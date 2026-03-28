// ==========================================
// 1. DATA & CONFIGURATION
// ==========================================

// CRITICAL: Check if MAP_DATABASE is defined (from js/maps.js)
if (typeof MAP_DATABASE === 'undefined') {
  console.error('MAP_DATABASE is missing! Make sure js/maps.js loaded before script.js');
  alert('Error: Map data failed to load. Please refresh the page.');
}

const APP_VERSION = "v1.0.3"; // UPDATES EVERYWHERE

// Detect Firefox to enable specific optimizations (sub-pixel rendering)
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// Map Dimensions
const MAP_WIDTH_METERS = 2000.0; 
const GAME_UNITS_PER_METER = 100.0;
const MAP_SDK_WIDTH = MAP_WIDTH_METERS * GAME_UNITS_PER_METER; // 200,000
const MAP_SDK_HEIGHT = MAP_SDK_WIDTH; // Square map

// SDK Boundaries
const GAME_LEFT = -MAP_SDK_WIDTH / 2; // -100,000
const GAME_RIGHT = MAP_SDK_WIDTH / 2; // 100,000
const GAME_TOP = MAP_SDK_HEIGHT / 2;  // 100,000
const GAME_BOTTOM = -MAP_SDK_HEIGHT / 2; // -100,000

// Map state
const MIN_ZOOM = 1;
let MAX_ZOOM = 10; 
const ZOOM_STEP = 0.5; 
const MARKER_ROTATION_DEG = 0; 

// Initial State
let state = { scale: 1, fitScale: 1, panning: false, pointX: 0, pointY: 0, startX: 0, startY: 0 };
let currentZoomLevel = 1;
let activeFaction = null;   
let activeTarget = null;
let activeMapKey = "CAR"; 
let currentStrongpoints = []; 
let labelCache = [];
let isRendering = false; 
let selectedGarrisonId = null; // Track selection by unique ID 

// === NEW: Garrison Zoom Toggle State ===
let zoomedGarrisonId = null;   // Which garrison we are currently zoomed into
let preZoomScale = 1;          // Remember the zoom level before we zoomed in 

// Add these with your other Global State variables
let lastClickTime = 0;
let lastClickId = null; 

// UNDECLARED GLOBAL VARIABLES - explicitly declared to avoid pollution
let trajSliderEnabled = false;
let activeGunIndex = -1; 



// --- PERFORMANCE CACHE ---
let stickyLabelsCache = { cols: [], rows: [] }; // Stores grid label elements
let cachedSubGrid = null; // Stores the keypad grid element



// Performance optimization: Real Cache (Lazy Loaded)
const cached = {
    _ele: {}, // Internal storage
    getElem(id) {
        if (!this._ele[id]) this._ele[id] = document.getElementById(id);
        return this._ele[id];
    },
    get mapImage() { return this.getElem("mapImage"); },
    get markersLayer() { return this.getElem("markers"); },
    get mapContainer() { return this.getElem("mapContainer"); },
    get mapStage() { return this.getElem("mapStage"); },
    get factionLabel() { return this.getElem("factionLabel"); },
    get zoomIndicator() { return this.getElem("zoomIndicator"); },
    // Add scale elements to cache too
    get scaleWrapper() { return this.getElem("scaleWrapper"); },
    get scaleTextMid() { return this.getElem("scaleTextMid"); },
    get scaleTextEnd() { return this.getElem("scaleTextEnd"); }
};

// DOM Elements
const mapContainer = document.getElementById("mapContainer");
const mapStage = document.getElementById("mapStage");
const zoomIndicator = document.getElementById("zoomIndicator");

// Function to open the Projects Hub Modal
function openProjectsModal() {
    const modal = document.getElementById('projectsModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Function to close the Projects Hub Modal
function closeProjectsModal() {
    const modal = document.getElementById('projectsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Add event listener for the close button inside the modal
document.getElementById('closeProjectsBtn')?.addEventListener('click', closeProjectsModal);

// Optional: Close modal if clicking on the dark overlay
document.getElementById('projectsModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'projectsModal') closeProjectsModal();
});

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

// --- NEW: Global Helper to stop map panning ---
const stopMapInteraction = (e) => {
    e.stopPropagation(); 
    // NOTE: Do NOT call preventDefault() here, or sliders/inputs won't work!
};


function showLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) loading.style.display = 'flex';
}

function updatePageTitle(mapName) {
    // Dynamically updates the browser tab title using the original case 
    document.title = `Default Garrisons Map - ${mapName}`;
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 200); 
  }
}

// --- PINCH ZOOM HELPERS ---
function getPinchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getPinchCenter(e) {
    return {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
    };
}

// Easing function for smooth movement (Ease Out Quart)
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

let activePanAnimation = null; // Track animation to cancel if interrupted

// NEW: Accepts targetZoom (passed as raw scale value, e.g., 1 to 10)
function animateToLocation(gameX, gameY, targetZoom = null) {
    const mapImage = document.getElementById("mapImage");
    if (!mapImage) return;

    if (activePanAnimation) cancelAnimationFrame(activePanAnimation);

    // 1. Setup Start Values
    const startX = state.pointX;
    const startY = state.pointY;
    const startScale = state.scale;

    // 2. Determine End Scale
    // If no zoom provided, stay at current. If provided, clamp to min/max.
    let endScale = targetZoom !== null ? targetZoom : startScale;
    endScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, endScale));

    // 3. Calculate Target Position based on END SCALE
    // We want the target to be in the center of the screen *after* the zoom finishes.
    const w = mapImage.naturalWidth;
    const h = mapImage.naturalHeight;
    
    // Convert Game Coords to Image Pixels
    const pos = gameToImagePixels(gameX, gameY, w, h);
    
    const screenCX = window.innerWidth / 2;
    const screenCY = window.innerHeight / 2;

    // IMPORTANT: specific "fitScale" logic must be applied to get pixels
    const effectiveEndZoom = endScale * state.fitScale;

    const targetX = screenCX - (pos.x * effectiveEndZoom);
    const targetY = screenCY - (pos.y * effectiveEndZoom);

    // 4. Animation Config
    const duration = 600; // Slightly slower for zooming (0.6s)
    const startTime = performance.now();

    toggleTransitions(false); // Kill CSS transitions

    function loop(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutQuart(progress);

        // 5. Interpolate Scale & Position
        state.scale = startScale + ((endScale - startScale) * ease);
        
        // --- FIX: SYNC THE SCROLL VARIABLE HERE ---
        currentZoomLevel = state.scale; 
        // ------------------------------------------

        state.pointX = startX + ((targetX - startX) * ease);
        state.pointY = startY + ((targetY - startY) * ease);

        // 6. Render Frame
        render();

        if (progress < 1) {
            activePanAnimation = requestAnimationFrame(loop);
        } else {
            activePanAnimation = null;
            // Optional: Save state after zoom finishes
            saveState(); 
        }
    }

    activePanAnimation = requestAnimationFrame(loop);
}

// Helper to get currently visible garrisons based on filters
function getVisibleGarrisons() {
    if (!currentStrongpoints) return [];
    
    const visible = [];
    currentStrongpoints.forEach(point => {
        if (point.type !== 'garrison_default') return;

        // Apply same faction filter logic as renderMarkers
        let shouldShow = true;
        if (activeFaction !== 'all' && activeFaction !== null) {
            const teamLower = point.team.toLowerCase();
            if (activeFaction === 't1') {
                shouldShow = (teamLower === 'us' || teamLower === 'allies' || teamLower === 'rus' || teamLower === 'sov' || teamLower === 'gb');
            } else if (activeFaction === 't2') {
                shouldShow = (teamLower === 'ger' || teamLower === 'axis');
            }
        }

        if (shouldShow) {
            visible.push(point);
        }
    });
    return visible;
}



// Show loading immediately
showLoading();

function toggleSubGrid(currentZoom) {
  // Lazy load cache
  if (!cachedSubGrid) {
      cachedSubGrid = document.querySelector('.keypad-grid');
  }
  
  if (!cachedSubGrid) return;

  // Simple state check to avoid DOM writes if not needed could be added here, 
  // but opacity style change is generally cheap.
  if (currentZoom >= 3.0) cachedSubGrid.style.opacity = "0.4"; 
  else cachedSubGrid.style.opacity = "0";   
}

function getEffectiveZoom() {
  return state.scale * state.fitScale;
}

function getGridRef(gameX, gameY) {
    const dims = getMapDimensions();
    
    // 1. DYNAMIC GRID SIZE
    // Instead of hard 200m, we ask: "How big is a grid square on THIS map?"
    // This ensures the math matches the visual lines (width / 10) exactly.
    const gridW = dims.width / GAME_UNITS_PER_METER / 10;
    const gridH = dims.height / GAME_UNITS_PER_METER / 10;

    // 2. OFFSET CORRECTION
    // Calculate meters from the explicit Top-Left of the map bounds.
    // This fixes maps that aren't perfectly centered at 0,0.
    const xMeters = (gameX - dims.left) / GAME_UNITS_PER_METER;
    const yMeters = (dims.top - gameY) / GAME_UNITS_PER_METER;
    
    // Bounds Check
    const totalW = dims.width / GAME_UNITS_PER_METER;
    const totalH = dims.height / GAME_UNITS_PER_METER;

    if (xMeters < 0 || xMeters > totalW || yMeters < 0 || yMeters > totalH) {
        return "---";
    }

    // Use the dynamic grid size for calculation
    let colIndex = Math.floor(xMeters / gridW); 
    let rowIndex = Math.floor(yMeters / gridH);
    
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    
    // Safety Clamp
    if (colIndex >= letters.length) colIndex = letters.length - 1;
    if (rowIndex >= 10) rowIndex = 9;
    if (colIndex < 0) colIndex = 0;
    if (rowIndex < 0) rowIndex = 0;
    
    const colChar = letters[colIndex];
    const rowChar = rowIndex + 1;
    
    return `${colChar}${rowChar}`;
}

function getGridData(gameX, gameY) {
    const dims = getMapDimensions();
    
    // 1. DYNAMIC GRID SIZE
    const gridW = dims.width / GAME_UNITS_PER_METER / 10;
    const gridH = dims.height / GAME_UNITS_PER_METER / 10;

    // 2. OFFSET CORRECTION
    const xMeters = (gameX - dims.left) / GAME_UNITS_PER_METER;
    const yMeters = (dims.top - gameY) / GAME_UNITS_PER_METER;
    
    const totalW = dims.width / GAME_UNITS_PER_METER;
    const totalH = dims.height / GAME_UNITS_PER_METER;

    if (xMeters < 0 || xMeters > totalW || yMeters < 0 || yMeters > totalH) {
        return { text: "---", keypadIndex: -1 };
    }

    // Main Grid
    let colIndex = Math.floor(xMeters / gridW); 
    let rowIndex = Math.floor(yMeters / gridH);
    
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    
    if (colIndex >= letters.length) colIndex = letters.length - 1;
    if (rowIndex >= 10) rowIndex = 9;
    if (colIndex < 0) colIndex = 0;
    if (rowIndex < 0) rowIndex = 0;
    
    const gridText = `${letters[colIndex]}${rowIndex + 1}`;

    // 3. SUB-GRID (Keypad 1-9)
    // We calculate the offset *within* the current grid square
    const subX = xMeters % gridW;
    const subY = yMeters % gridH;
    
    // Divide the dynamic square size by 3 for the sub-cells
    const kCol = Math.floor(subX / (gridW / 3)); 
    const kRow = Math.floor(subY / (gridH / 3)); 
    
    // Flat Index (0-8)
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Clamp to ensure we don't get 3 (edge case precision issues)
    const safeCol = Math.min(2, Math.max(0, kCol));
    const safeRow = Math.min(2, Math.max(0, kRow));

    const keypadIndex = (safeRow * 3) + safeCol;

    return { text: gridText, keypadIndex: keypadIndex };
}

// --- NEW: HTML Generator for the Visual Grid ---
function generateKeypadHTML(gridData) {
    let cellsHTML = "";
    for (let i = 0; i < 9; i++) {
        const activeClass = (i === gridData.keypadIndex) ? "active" : "";
        cellsHTML += `<div class="kp-cell ${activeClass}"></div>`;
    }

    return `
        <div class="grid-box-container">
            <span class="grid-text">${gridData.text}</span>
            <div class="visual-keypad">
                ${cellsHTML}
            </div>
        </div>
    `;
}

// --- FORCE ANIMATIONS OFF (RESPONSIVE STYLE) ---
function toggleTransitions(enable) {
  // Always remove the class, never add it.
  // This ensures instant snapping on both Desktop and Mobile.
  mapStage.classList.remove("zoom-transition");
  const labelLayer = document.getElementById("labelLayer");
  if (labelLayer) labelLayer.classList.remove("zoom-transition");
  mapStage.style.transition = "none";
}

function setZoomLevel(newLevel, mouseX = null, mouseY = null) {
  const prevZoom = getEffectiveZoom();
  // Update the global state immediately
  currentZoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newLevel));
  state.scale = currentZoomLevel;
  
  // REMOVED: The block that added 'zoom-transition' 
  // This keeps the zoom instant/responsive.
  
  const newZoom = getEffectiveZoom();
  
  if (mouseX !== null && mouseY !== null) {
    // Get the current world position under the mouse
    const worldX = (mouseX - state.pointX) / prevZoom;
    const worldY = (mouseY - state.pointY) / prevZoom;
    
    // Calculate what the new pan position should be
    state.pointX = mouseX - worldX * newZoom;
    state.pointY = mouseY - worldY * newZoom;
  }
  
  clampPosition();
  toggleSubGrid(currentZoomLevel);
  render();
  
  // Auto-save zoom changes (debounced)
  clearTimeout(window.saveZoomTimeout);
  window.saveZoomTimeout = setTimeout(saveState, 500);
}

function clampPosition() {
  const rect = mapContainer.getBoundingClientRect();
  const mapImage = document.getElementById("mapImage");
  const drawScale = state.scale * state.fitScale;
  const imgW = mapImage.naturalWidth * drawScale;
  const imgH = mapImage.naturalHeight * drawScale;

  const OVERSCROLL_FACTOR = 0.8; 
  const marginX = rect.width * OVERSCROLL_FACTOR;
  const marginY = rect.height * OVERSCROLL_FACTOR;

  const limitTop = marginY;
  const limitBottom = rect.height - imgH - marginY;
  const limitLeft = marginX;
  const limitRight = rect.width - imgW - marginX;

  if (state.pointX > limitLeft) state.pointX = limitLeft;
  if (state.pointX < limitRight) state.pointX = limitRight;
  if (state.pointY > limitTop) state.pointY = limitTop;
  if (state.pointY < limitBottom) state.pointY = limitBottom;
}

function createStickyLabels() {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  let labelLayer = document.getElementById("labelLayer");
  
  const isHidden = localStorage.getItem("hll-grid-hidden") === "true";

  if (!labelLayer) {
    labelLayer = document.createElement("div");
    labelLayer.id = "labelLayer";
    labelLayer.className = "label-layer";
    
    // NEW: Apply hidden class immediately
    if (isHidden) labelLayer.classList.add("grid-hidden");
    
    mapContainer.appendChild(labelLayer);
  }
  
  labelLayer.innerHTML = "";
  
  // Reset Cache
  stickyLabelsCache.cols = [];
  stickyLabelsCache.rows = [];

  // Create Columns (Letters)
  for (let i = 0; i < 10; i++) {
    const el = document.createElement("div");
    el.className = "hll-grid-label";
    el.innerText = (i === 0) ? "A1" : letters[i];
    labelLayer.appendChild(el);
    stickyLabelsCache.cols.push(el); // Save to cache
  }

  // Create Rows (Numbers)
  for (let i = 1; i < 10; i++) {
    const el = document.createElement("div");
    el.className = "hll-grid-label";
    el.innerText = i + 1;
    labelLayer.appendChild(el);
    stickyLabelsCache.rows.push(el); // Save to cache
  }
}

// === FIX #2: Sticky Labels using 2D Transform ===
function updateStickyLabels(currentDrawScale) {
  const mapImage = cached.mapImage; 
  if (!mapImage) return;

  const w = mapImage.naturalWidth;
  const h = mapImage.naturalHeight;
  const stepX = (w / 10) * currentDrawScale; 
  const stepY = (h / 10) * currentDrawScale; 

  const isMobile = window.innerWidth <= 768;
  const padding = isMobile ? 15 : 30; 
  
  const stickyTopY = Math.max(state.pointY, 0);
  const stickyLeftX = Math.max(state.pointX, 0);

  let fontScale = 0.7 + ((state.scale - 1) * 0.15);
  if (fontScale > 1.0) fontScale = 1.0;

  // FIX: Detect if we should use floats (Firefox/HighDPI) to prevent label vibration
  const isHighDPI = window.devicePixelRatio > 1;
  const useFloats = isHighDPI || isFirefox;

  for (let i = 0; i < stickyLabelsCache.cols.length; i++) {
    const el = stickyLabelsCache.cols[i];
    const colScreenX = state.pointX + (i * stepX);
    const finalX = colScreenX + padding;
    
    let finalY;
    if (i === 0) finalY = state.pointY + padding; 
    else finalY = stickyTopY + padding;      
    
    // Apply rounding only if NOT Firefox/HighDPI
    const xVal = useFloats ? finalX : Math.round(finalX);
    const yVal = useFloats ? finalY : Math.round(finalY);

    el.style.transform = `translate(${xVal}px, ${yVal}px) scale(${fontScale})`;
  }

  for (let i = 0; i < stickyLabelsCache.rows.length; i++) {
    const el = stickyLabelsCache.rows[i];
    const gridIndex = i + 1; 
    const finalX = stickyLeftX + padding;
    const rowScreenY = state.pointY + (gridIndex * stepY);
    const finalY = rowScreenY + padding;
    
    // Apply rounding only if NOT Firefox/HighDPI
    const xVal = useFloats ? finalX : Math.round(finalX);
    const yVal = useFloats ? finalY : Math.round(finalY);
    
    el.style.transform = `translate(${xVal}px, ${yVal}px) scale(${fontScale})`;
  }
}

function buildGrid() {
  let gridLayer = document.getElementById("gridLayer");
  
  // Check preference immediately
  const isHidden = localStorage.getItem("hll-grid-hidden") === "true";

  if (!gridLayer) {
    gridLayer = document.createElement("div");
    gridLayer.id = "gridLayer";
    gridLayer.className = "grid-layer";
    
    // NEW: Apply hidden class immediately upon creation if saved setting says so
    if (isHidden) gridLayer.classList.add("grid-hidden");

    document.getElementById("mapStage").appendChild(gridLayer);
  }
  
  gridLayer.innerHTML = ""; 
  const mapImage = document.getElementById("mapImage");
  const w = mapImage.naturalWidth;
  const h = mapImage.naturalHeight;
  if (w === 0) return; 
  
  gridLayer.style.width = `${w}px`;
  gridLayer.style.height = `${h}px`;

  const stepX = w / 10;
  const stepY = h / 10;

  const keypadLayer = document.createElement("div");
  keypadLayer.className = "keypad-grid";
  keypadLayer.style.backgroundSize = `${stepX/3}px ${stepY/3}px`;
  gridLayer.appendChild(keypadLayer);

  // --- VERTICAL LINES ---
  for (let i = 0; i <= 10; i++) { 
    const vLine = document.createElement("div");
    vLine.className = "hll-grid-line vertical";
    vLine.style.left = `${Math.round(i * stepX)}px`;
    
    // FIX: Remove -50% centering for inner lines to prevent Firefox sub-pixel blur
    if (i === 0) vLine.style.transform = "translateX(0)"; 
    else if (i === 10) vLine.style.transform = "translateX(-100%)"; 
    else vLine.style.transform = "translateX(0)"; // Changed from -50% to 0
    
    gridLayer.appendChild(vLine);
  }

  // --- HORIZONTAL LINES ---
  for (let i = 0; i <= 10; i++) { 
    const hLine = document.createElement("div");
    hLine.className = "hll-grid-line horizontal";
    hLine.style.top = `${Math.round(i * stepY)}px`;
    
    // FIX: Remove -50% centering for inner lines
    if (i === 0) hLine.style.transform = "translateY(0)"; 
    else if (i === 10) hLine.style.transform = "translateY(-100%)"; 
    else hLine.style.transform = "translateY(0)"; // Changed from -50% to 0
    
    gridLayer.appendChild(hLine);
  }
}

// --- COORDINATE CONVERSION HELPERS ---
function getMapDimensions() {
  const config = MAP_DATABASE[activeMapKey];
  
  // 1. If map has explicit FModel bounds, use them
  if (config.bounds) {
    return {
      width: config.bounds.maxX - config.bounds.minX,
      height: config.bounds.maxY - config.bounds.minY,
      left: config.bounds.minX,
      top: config.bounds.maxY 
    };
  }

  // 2. Fallback for other maps (Explicit Meter Values)
  const wMeters = config.widthMeters || MAP_WIDTH_METERS; 
  const hMeters = config.heightMeters || MAP_WIDTH_METERS; 

  const sdkW = wMeters * GAME_UNITS_PER_METER;
  const sdkH = hMeters * GAME_UNITS_PER_METER;

  return {
    width: sdkW,
    height: sdkH,
    left: -sdkW / 2,
    top: sdkH / 2
  };
}

function gameToImagePixels(gameX, gameY, imgW, imgH) {
  const dims = getMapDimensions();

  // X is Standard (Left to Right)
  const normX = (gameX - dims.left) / dims.width;
  
  // Y Inversion:
  // In Game: +Y is usually North (Up).
  // In Image: 0 is North (Top).
  // So we subtract GameY from the Top Boundary.
  // Example: If Top is 100800 and Point is 50000 -> (100800 - 50000) / H = Top Half.
  const normY = (dims.top - gameY) / dims.height;

  return { x: normX * imgW, y: normY * imgH };
}

function imagePixelsToGame(imgX, imgY, imgW, imgH) {
  const dims = getMapDimensions();
  const normX = imgX / imgW;
  const normY = imgY / imgH;
  const x = (normX * dims.width) + dims.left;
  const y = dims.top - (normY * dims.height);
  return { x: x, y: y };
}

function renderMarkers() {
  const markersLayer = cached.markersLayer;
  if (!markersLayer) return;
  markersLayer.innerHTML = ""; 
  labelCache = [];
  // === MEMORY LEAK FIX: Remove old control UIs + their listeners ===
  markersLayer.querySelectorAll('.garrison-control-ui').forEach(ui => {
      ui.remove(); // also removes attached event listeners
  });
  const fragment = document.createDocumentFragment();
  const mapImage = cached.mapImage;
  if (!mapImage) return;

  const w = mapImage.naturalWidth;
  const h = mapImage.naturalHeight;
  const config = MAP_DATABASE[activeMapKey];
  if (!config || !currentStrongpoints) return;

  // RENDER LOOP
  currentStrongpoints.forEach(point => {
    const isGarrison = point.type === 'garrison_default';
    
    // --- FACTION FILTER LOGIC ---
    let shouldShow = true;
    if (isGarrison && activeFaction !== 'all' && activeFaction !== null) {
        const teamLower = point.team.toLowerCase();
        if (activeFaction === 't1') {
            shouldShow = (teamLower === 'us' || teamLower === 'allies' || teamLower === 'rus' || teamLower === 'sov' || teamLower === 'gb');
        } else if (activeFaction === 't2') {
            shouldShow = (teamLower === 'ger' || teamLower === 'axis');
        }
    }

    if (!shouldShow) return;
    
    const el = document.createElement("div");
    el.className = `marker ${point.team} ${point.type}`;
    
    const pos = gameToImagePixels(point.gameX, point.gameY, w, h);
    
    // --- STRONGPOINT RENDERING ---
    if (point.type === 'strongpoint') {
      const dims = getMapDimensions();
      const pxPerMeter = (w / dims.width) * GAME_UNITS_PER_METER;
      const radiusPx = (point.radius / GAME_UNITS_PER_METER) * pxPerMeter;
      const size = radiusPx * 2;
      el.style.width = `${size}px`; 
      el.style.height = `${size}px`;
      el.style.left = `${Math.round(pos.x)}px`; 
      el.style.top = `${Math.round(pos.y)}px`; 
      el.style.marginLeft = `-${size/2}px`; 
      el.style.marginTop = `-${size/2}px`;

      const visual = document.createElement("div");
      visual.className = "marker-visual";
      el.appendChild(visual);
      
      if (point.label) {
        const labelSpan = document.createElement("span");
        labelSpan.className = "marker-label";
        labelSpan.innerText = point.label;
        el.appendChild(labelSpan);
        labelCache.push(labelSpan);
      }
    }
    
    // --- GARRISON RENDERING ---
    if (isGarrison) { 
      el.style.left = `${Math.round(pos.x)}px`; 
      el.style.top = `${Math.round(pos.y)}px`;
      
      if (selectedGarrisonId === point.id) el.classList.add('selected');

      const mainIcon = document.createElement("div");
      mainIcon.className = "garrison-main-icon";
      mainIcon.style.backgroundImage = 'url("images/ui/default_garrison_512.webp")';
      el.appendChild(mainIcon);

      // --- CLICK HANDLER (Manual Double-Click Logic) ---
      el.addEventListener('click', (e) => {
          if (isDragging) return; 
          e.stopPropagation();

          const now = Date.now();
          const isSameTarget = (lastClickId === point.id);
          const isFastEnough = (now - lastClickTime < 300); // 300ms threshold

          // CHECK: Is this a Double Click?
          if (isSameTarget && isFastEnough) {
              // --- DOUBLE CLICK ACTION ---
              
              // 1. Force Selection (Ensure it stays ON even if the first click toggled it off)
              selectedGarrisonId = point.id;

              // 2. Zoom Logic (Desktop Only)
              if (window.innerWidth > 768) {
                  // Zoom Closer to 7.0x (Adjust this number for closer/further)
                  animateToLocation(point.gameX, point.gameY, 7.0);
              } else {
                  // Mobile: Just Pan
                  animateToLocation(point.gameX, point.gameY, null);
              }

              // 3. Render final state
              renderMarkers();

          } else {
              // --- SINGLE CLICK ACTION ---
              // Toggle selection normally
              selectedGarrisonId = (selectedGarrisonId === point.id) ? null : point.id;
              renderMarkers();
          }

          // Save state for the next click
          lastClickTime = now;
          lastClickId = point.id;

          if (navigator.vibrate) navigator.vibrate(15);
      });

      // --- TACTICAL CONTROL BAR ---
      if (selectedGarrisonId === point.id) {
          const controlUI = document.createElement("div");
          controlUI.className = "garrison-control-ui";
          
          const visibleGarrisons = getVisibleGarrisons();
          const currentIndex = visibleGarrisons.findIndex(p => p.id === point.id);
          
          const prevIndex = (currentIndex - 1 + visibleGarrisons.length) % visibleGarrisons.length;
          const nextIndex = (currentIndex + 1) % visibleGarrisons.length;
          
          const prevPoint = visibleGarrisons[prevIndex];
          const nextPoint = visibleGarrisons[nextIndex];

          const flagSrc = getFlagImage(point.team);

          // NEW: Get full data and generate HTML
          const gridData = getGridData(point.gameX, point.gameY);
          const gridHTML = generateKeypadHTML(gridData);

          controlUI.innerHTML = `
              <div class="garrison-grid-tab">
                  ${gridHTML}
              </div>

              <div class="gar-btn arrow-left"></div>
              
              <div class="gar-label-text">
                 <img src="${flagSrc}" class="faction-flag" style="width:26px; height:auto; margin-right:8px;">
                 <span>${point.label}</span>
                 </div>

              <div class="gar-btn zoom-btn" id="garrisonZoomBtn">
                 <svg id="zoomIcon" viewBox="0 0 24 24" width="24" height="24">
                     <!-- Will be updated by JS -->
                 </svg>
              </div>

              <div class="gar-btn arrow-right"></div>
          `;

          // --- FIXED SWITCH LOGIC ---
          const switchGar = (e, targetPoint) => {
             e.stopPropagation(); // Stop map click
             
             // 1. Update Selection
             selectedGarrisonId = targetPoint.id;
             
             // FIX: Reset zoom state when switching garrisons
             zoomedGarrisonId = null;
             preZoomScale = 1;
             
             // 2. Pan to the new target (keep current zoom)
             animateToLocation(targetPoint.gameX, targetPoint.gameY, null);

             // 3. Re-render UI
             renderMarkers(); 
             if (navigator.vibrate) navigator.vibrate(10);
          };

          const btnPrev = controlUI.querySelector('.arrow-left');
          const btnNext = controlUI.querySelector('.arrow-right');
          const btnZoom = controlUI.querySelector('.zoom-btn');

          btnPrev.addEventListener('click', (e) => switchGar(e, prevPoint));
          btnNext.addEventListener('click', (e) => switchGar(e, nextPoint));
          
          // === ZOOM BUTTON TOGGLE ( +  →  -  ) ===
          const handleZoomToggle = (e) => {
              e.stopPropagation();
              if (e.type === 'touchstart') e.preventDefault();

              const isCurrentlyZoomed = (zoomedGarrisonId === point.id);

              if (!isCurrentlyZoomed) {
                  // === ZOOM IN ===
                  preZoomScale = state.scale;
                  zoomedGarrisonId = point.id;

                  const isMobile = window.innerWidth <= 768;
                  const targetZoom = isMobile ? 15.0 : 7.0;
                  
                  animateToLocation(point.gameX, point.gameY, targetZoom);
              } else {
                  // === ZOOM OUT ===
                  zoomedGarrisonId = null;
                  const savedPreZoom = preZoomScale;
                  preZoomScale = 1;
                  
                  animateToLocation(point.gameX, point.gameY, savedPreZoom);
              }

              renderMarkers();
              if (navigator.vibrate) navigator.vibrate(10);
          };
          
          btnZoom.addEventListener('click', handleZoomToggle);
          btnZoom.addEventListener('touchstart', handleZoomToggle, { passive: false });

          // Dynamic zoom icon ( +  or  - )
          const zoomBtn = controlUI.querySelector('.zoom-btn');
          const zoomIcon = controlUI.querySelector('#zoomIcon');

          const updateZoomIcon = () => {
              const isZoomed = (zoomedGarrisonId === point.id);
              if (isZoomed) {
                  // Minus icon - magnifying glass with minus centered inside
                  zoomIcon.innerHTML = `
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      <rect x="6" y="8.5" width="7" height="2" rx="0.5"/>   <!-- centered minus -->
                  `;
              } else {
                  // Plus icon
                  zoomIcon.innerHTML = `
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      <path d="M9.5 6v7M6 9.5h7" stroke="currentColor" stroke-width="2" fill="none"/>   <!-- centered plus -->
                  `;
              }
          };
          updateZoomIcon();   // Set correct icon immediately

          el.appendChild(controlUI);
      }
    }

    fragment.appendChild(el);
  });

  markersLayer.appendChild(fragment);
}






// === FIX: SYNCHRONOUS RENDER (Prevents Chrome Checkerboards) ===
function render() {
  clampPosition();
  const drawScale = state.scale * state.fitScale;
  const markersLayer = cached.markersLayer;
  
  // 1. CSS Variables
  const mapContainer = cached.mapContainer;
  mapContainer.style.setProperty('--current-scale', drawScale); 
  const mapStage = cached.mapStage;
  mapStage.style.setProperty('--effective-zoom', drawScale);
  
  // --- ADD THIS BLOCK ---
  // Calculate the inverse scale to keep UI elements constant size
  const uiCounterScale = 1 / drawScale; 
  // Pass it to CSS
  cached.mapContainer.style.setProperty('--ui-counter-scale', uiCounterScale);
  // ----------------------
  
  // --- FIREFOX SPECIFIC LAYER PROMOTION ---
  if (isFirefox) {
      if (state.scale > 1.01) {
          if (mapStage.style.willChange !== 'transform') mapStage.style.willChange = 'transform';
          if (markersLayer && markersLayer.style.willChange !== 'transform') markersLayer.style.willChange = 'transform';
      } else {
          mapStage.style.willChange = 'auto';
          if (markersLayer) markersLayer.style.willChange = 'auto';
      }
  }

  // --- RESPONSIVE DYNAMIC ICON SCALING ---
  const isMobileDevice = window.innerWidth <= 768;
  let baseSize, minSize, iconExponent;

  if (isMobileDevice) {
      // MOBILE (Max Zoom 20x)
      baseSize = 240; 
      minSize = 24;      // Allow it to get quite small
      
      // CHANGE: Increased from 0.65 to 0.75
      // This forces the icon to shrink faster as you zoom in
      iconExponent = 0.75; 
  } else {
      // DESKTOP (Max Zoom 10x)
      baseSize = 150;
      
      // CHANGE 1: Lower the limit so it CAN get smaller (was 28)
      minSize = 20;      
      
      // CHANGE 2: Increase exponent from 0.7 to 0.85
      // This makes it shrink much faster as you zoom in
      iconExponent = 0.85; 
  }

  // Math: Size = Base / (Zoom ^ Exponent)
  const rawSize = baseSize / Math.pow(state.scale, iconExponent);
  const dynSize = Math.max(minSize, Math.min(baseSize, rawSize));

  // Push to CSS variable used by .garrison-main-icon
  mapContainer.style.setProperty('--dynamic-icon-size', `${dynSize}px`);
  
  // --- DYNAMIC STROKE SCALING (Circles/Lines) ---
  const isMob = window.innerWidth <= 768;
  const strokeBase = isMob ? 10 : 8; 
  const strokeExp = isMob ? 0.5 : 0.6;
  const dynStroke = strokeBase / Math.pow(state.scale, strokeExp);
  const finalStroke = Math.max(1.5, Math.min(10, dynStroke));
  mapContainer.style.setProperty('--dynamic-stroke', `${finalStroke}px`);

  const dynCircleStroke = (strokeBase * 0.75) / Math.pow(state.scale, strokeExp);
  const finalCircleStroke = Math.max(1.0, Math.min(8, dynCircleStroke));
  mapContainer.style.setProperty('--dynamic-circle-stroke', `${finalCircleStroke}px`);
  
  // 2. Move Map (Conditional Precision)
  const isHighDPI = window.devicePixelRatio > 1;
  const useFloats = isHighDPI || (isFirefox && state.scale > 1.05);

  const finalX = useFloats ? state.pointX : Math.round(state.pointX);
  const finalY = useFloats ? state.pointY : Math.round(state.pointY);
  
  const transformString = `translate(${finalX}px, ${finalY}px) scale(${drawScale})`;
  
  // A. Apply to Map Image
  mapStage.style.transform = transformString;
  
  // B. Apply to Markers Layer
  if (markersLayer) {
      markersLayer.style.transform = transformString;
  }
  
  // 3. Update Text & Grid
  updateRealScale(drawScale);
  const zoomIndicator = cached.zoomIndicator;
  if (zoomIndicator) zoomIndicator.innerText = `${state.scale.toFixed(1)}x`;
  
  // --- FIREFOX OPTIMIZATION: BATCH LABEL UPDATE ---
  // Keeps grid labels readable
  const mobileScaleMultiplier = isMobileDevice ? 2.5 : 1.0; 
  const TRANSITION_START_ZOOM = 1.0;
  const TRANSITION_END_ZOOM = 5.0;

  let progress = (state.scale - TRANSITION_START_ZOOM) / (TRANSITION_END_ZOOM - TRANSITION_START_ZOOM);
  progress = Math.max(0, Math.min(1, progress)); 

  const topVal = progress * 50; 
  const transY = -100 + (progress * 50);
  const gap = -20 + (progress * 20);
  const arrowOp = Math.max(0, 1 - (progress * 1.6));

  const exponent = isMobileDevice ? 0.85 : 0.6; 
  const smoothInverse = 1.0 / Math.pow(state.scale, exponent);
  const finalScale = smoothInverse * mobileScaleMultiplier;

  if (markersLayer) {
      markersLayer.style.setProperty('--label-arrow-op', arrowOp);
      markersLayer.style.setProperty('--label-top', `${topVal}%`);
      markersLayer.style.setProperty('--label-transform', `translate(-50%, calc(${transY}% + ${gap}px)) scale(${finalScale})`);
  }

  // Update Grid Thickness
  const majorThickness = Math.max(1.0, 2.0 / drawScale); 
  const gridLayer = document.getElementById("gridLayer");
  if (gridLayer) {
      gridLayer.style.setProperty('--major-width', `${majorThickness}px`);
      
      const subGrid = gridLayer.querySelector('.keypad-grid');
      if (subGrid) {
          subGrid.style.opacity = state.scale >= 3.0 ? "0.4" : "0";
          const minorThickness = Math.max(1.0, 1.0 / drawScale);
          gridLayer.style.setProperty('--minor-width', `${minorThickness}px`);
      }
  }
  
  updateStickyLabels(drawScale);
  if (window.updateZoomSliderUI) window.updateZoomSliderUI();
}

// ... (rest of the code remains the same)

let _lastScaleTextEnd = "";
let _lastScaleTextMid = "";

function updateRealScale(effectiveZoom) {
    const mapImg = cached.mapImage;
    if (!mapImg || mapImg.naturalWidth === 0) return;

    // 1. GET GRID DIMENSIONS (2000m SDK logic)
    const TOTAL_PLAYABLE_METERS = 2000;

    // 2. CALCULATE PIXELS PER METER
    const currentMapPixelWidth = mapImg.naturalWidth * effectiveZoom;
    const pixelsPerMeter = currentMapPixelWidth / TOTAL_PLAYABLE_METERS;

    // 3. Select BAR SIZE BASED ON ZOOM
    const isMobile = window.innerWidth <= 768;
    let barMeters;

    if (isMobile) {
        barMeters = 600; 
        if (state.scale > 1.5)  barMeters = 400;
        if (state.scale > 2.5)  barMeters = 200;
        if (state.scale > 5.0)  barMeters = 100;
        if (state.scale > 10.0) barMeters = 50;
        if (state.scale > 18.0) barMeters = 20;
    } else {
        barMeters = 400;
        if (state.scale > 1.5) barMeters = 200;
        if (state.scale > 3.0) barMeters = 100;
        if (state.scale > 6.0) barMeters = 50;
        if (state.scale > 9.0) barMeters = 20;
    }

    // 4. APPLY TO UI (Using Cache)
    const barPixelsRounded = Math.round(barMeters * pixelsPerMeter);
    
    // Use Cached Elements
    const scaleWrapper = cached.scaleWrapper;
    const elMid = cached.scaleTextMid;
    const elEnd = cached.scaleTextEnd;

    if (scaleWrapper) scaleWrapper.style.width = `${barPixelsRounded}px`;
    
    // Optimization: Only write text if it changed
    const midText = `${barMeters / 2}m`;
    const endText = `${barMeters}m`;
    
    if (elMid && elMid.innerText !== midText) elMid.innerText = midText;
    if (elEnd && elEnd.innerText !== endText) elEnd.innerText = endText;
}

function updateDimensions() {
  const mapImage = document.getElementById("mapImage");
  
  // FIX: Check naturalWidth to prevent "Stuck Zoom" bug on browser restore
  if (!mapImage.complete || mapImage.naturalWidth === 0) return;
  
  const rect = mapContainer.getBoundingClientRect();
  
  state.fitScale = Math.min(rect.width / mapImage.naturalWidth, rect.height / mapImage.naturalHeight);
  
  const isMobile = window.innerWidth <= 768; 

  if (isMobile) {
      MAX_ZOOM = 20; 
  } else {
      MAX_ZOOM = 10; 
  }

  if (state.scale < MIN_ZOOM) state.scale = MIN_ZOOM;
  if (state.scale > MAX_ZOOM) state.scale = MAX_ZOOM;
}

function centerMap() {
  const mapImage = document.getElementById("mapImage");
  state.scale = MIN_ZOOM;
  const rect = mapContainer.getBoundingClientRect();
  state.pointX = (rect.width - (mapImage.naturalWidth * state.fitScale)) / 2;
  state.pointY = (rect.height - (mapImage.naturalHeight * state.fitScale)) / 2;
  
  toggleSubGrid(state.scale);
  render();
}

function initMap() {
    // --- 1. DOM RESTRUCTURING (Fix Z-Index Stacking) ---
    const markersLayer = cached.markersLayer;
    const mapContainer = cached.mapContainer;
    const mapImage = cached.mapImage;

    if (markersLayer && mapContainer && mapImage) {
        // Move markers layer if needed
        if (markersLayer.parentElement !== mapContainer) {
            mapContainer.appendChild(markersLayer);
        }
        
        // --- FIX: Sizing for Clipping ---
        // Force the layer to match the image size exactly.
        // This ensures 'overflow: hidden' cuts off the circle at the map edge.
        if (mapImage.naturalWidth > 0 && mapImage.naturalHeight > 0) {
            markersLayer.style.width = `${mapImage.naturalWidth}px`;
            markersLayer.style.height = `${mapImage.naturalHeight}px`;
        }
        
        // Visual Order & Transform Origin
        markersLayer.style.zIndex = "100"; 
        markersLayer.style.transformOrigin = "0 0"; 
    }
    // ---------------------------------------------------

    const controlsDrawer = document.getElementById("controlsDrawer");
    if (controlsDrawer) {
        if (window.savedPanelHidden) {
            controlsDrawer.classList.add("closed");
        } else {
            controlsDrawer.classList.remove("hidden-by-default");
        }
    }

    updateDimensions();
    centerMap();
    buildGrid();
    renderMarkers();
    currentZoomLevel = state.scale;

    mapContainer.style.cursor = ""; 

    render();

    mapContainer.addEventListener("contextmenu", (e) => {
        e.preventDefault(); 
        return false;
    });
}

// ==========================================
// VISUAL MAP SelectOR (MODAL LOGIC)
// ==========================================

function initMapSelector() {
  const btn = document.getElementById("openMapBtn");
  const searchInput = document.getElementById("mapSearchInput");
  const clearBtn = document.getElementById("clearSearchBtn");

  if (btn) btn.addEventListener("click", openMapSelector);
  
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      renderMapGrid(searchTerm);
    });
  }

  // --- ADD CLEAR BUTTON LOGIC ---
  if (clearBtn && searchInput) {
    const clearAction = (e) => {
      e.preventDefault();
      searchInput.value = "";
      searchInput.focus();
      renderMapGrid(""); // Reset grid to show all maps
    };

    clearBtn.addEventListener("click", clearAction);
    clearBtn.addEventListener("touchstart", clearAction, { passive: false });
  }
  
  // Close buttons
  const modal = document.getElementById("mapModal");
  if (modal) {
      modal.addEventListener("click", (e) => {
          if (e.target === modal) closeMapSelector();
      });
  }
  
  const closeBtn = document.getElementById("closeModalBtn");
  if(closeBtn) {
      closeBtn.addEventListener("click", (e) => {
          e.preventDefault(); 
          closeMapSelector();
      });
      closeBtn.addEventListener("touchstart", (e) => {
          e.preventDefault();
          closeMapSelector();
      }, { passive: false });
  }
}

// ==========================================
// IMPROVED MAP GRID RENDERING WITH DATASET
// ==========================================
let isGridFull = false;

function renderMapGrid(filter = "") {
    const grid = document.getElementById("mapGrid");
    if (!grid) return;
    const cleanFilter = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    // --- QUICK HIGHLIGHT ONLY (When no filter and grid already full) ---
    if (cleanFilter === "" && isGridFull && grid.hasChildNodes()) {
        grid.querySelectorAll('.map-card').forEach((card) => {
            const cardKey = card.dataset.mapKey || "";
            card.classList.toggle('active', cardKey === activeMapKey);
        });
        return;
    }

    // --- FULL REBUILD ---
    grid.innerHTML = "";
    const sortedKeys = Object.keys(MAP_DATABASE).sort((a, b) =>
        MAP_DATABASE[a].name.localeCompare(MAP_DATABASE[b].name)
    );

    sortedKeys.forEach(key => {
        const mapData = MAP_DATABASE[key];
        const cleanName = mapData.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
       
        if (cleanFilter !== "" && !cleanName.includes(cleanFilter)) return;
       
        const card = document.createElement("div");
        card.className = "map-card";
        card.dataset.mapKey = key; // <-- RELIABLE KEY STORAGE
        if (key === activeMapKey) card.classList.add('active');
       
        card.onclick = () => SelectMapFromGrid(key);
       
        const img = document.createElement("img");
        img.className = "map-card-img";
        img.alt = mapData.name;
        
        // Use a simpler loading approach to prevent "stuck" hidden images
        const imgPath = mapData.thumbnail || mapData.image;
        img.src = imgPath; 
        
        // If image fails, show a fallback background color
        img.onerror = () => {
            img.style.display = 'none';
            card.style.background = '#222';
        };
       
        const label = document.createElement("div");
        label.className = "map-card-name";
        label.innerText = mapData.name;
       
        card.appendChild(img);
        card.appendChild(label);
        grid.appendChild(card);
    });
    
    isGridFull = (cleanFilter === "");
}

// ==========================================
// OPEN MAP SelectOR - ALWAYS REFRESH HIGHLIGHT
// ==========================================
function openMapSelector() {
  const searchInput = document.getElementById("mapSearchInput");
  
  // Always clear any lingering search and refresh the grid
  if (searchInput) {
    searchInput.value = "";
  }
  
  // THIS IS THE KEY FIX: Always refresh the grid when opening
  // → Ensures the green highlight is always correct for the current activeMapKey
  renderMapGrid("");
  
  document.getElementById("mapModal").classList.add("active");
}

// ==========================================
// CLOSE MAP SelectOR
// ==========================================
function closeMapSelector() {
    const modal = document.getElementById("mapModal");
    const searchInput = document.getElementById("mapSearchInput");
    
    if (modal) {
        modal.classList.remove("active");
    }
    
    // Optional: Reset search when closing
    if (searchInput) {
        searchInput.value = "";
        renderMapGrid(""); 
    }
}

// ==========================================
// KEY FIXES APPLIED
// ==========================================
// 1. Map save state now works correctly on refresh
//    → activeMapKey is set immediately on Selection and saved before switchMap()
// 2. Map Selection panel green highlight now appears correctly
//    → renderMapGrid("") is called after activeMapKey is updated
// 3. Flicker/text flicker when switching maps is eliminated
//    → Current map name, faction UI, gun UI, and strongpoints are updated immediately
//    → Fade-out/fade-in is smoother with proper transition handling
//    → Loading overlay stays until fully ready

function SelectMapFromGrid(key) {
    closeMapSelector();

    // 1. Reset Global Targeting, Selection, and Faction State
    activeTarget = null;
    selectedGarrisonId = null; // Close the label
    
    // CHANGE: Force "All Factions" mode so all markers are visible by default
    activeFaction = 'all'; 

    // 2. Get Config
    const config = MAP_DATABASE[key];
    if (!config) return;

    // --- SORTING FIX: Sort the garrisons BEFORE switching ---
    applyMapSorting(config);
    // -------------------------------------------------------

    activeMapKey = key;
    currentStrongpoints = config.strongpoints || [];

    updatePageTitle(config.name);

    const currentMapLbl = document.getElementById("currentMapName");
    if (currentMapLbl) currentMapLbl.innerText = config.name;

    updateFactionUI(config);

    // Save new map selection immediately
    saveState();

    // Highlight selected card in the grid
    renderMapGrid("");

    // 6. Trigger Map Transition
    switchMap(key);
}

function switchMap(mapKey) {
    if (!MAP_DATABASE[mapKey]) return;

    const mapStage = document.getElementById("mapStage");
    const imgElement = document.getElementById('mapImage');
    const markersLayer = document.getElementById("markers");

    // 1. Fade out old map instantly
    if (mapStage) {
        mapStage.style.transition = "opacity 0.2s ease-out";
        mapStage.style.opacity = "0";
    }

    // Clear old markers immediately
    if (markersLayer) markersLayer.innerHTML = "";

    // Show loading overlay
    showLoading();

    const config = MAP_DATABASE[mapKey];

    // 2. Load new image - FIX: Clear any previous onload first to prevent double-fire
    imgElement.onload = null;
    
    // FIX: Set onload handler BEFORE setting src to handle both cached and new images
    const handleImageLoad = function() {
        // Ensure correct state (in case of race conditions)
        activeMapKey = mapKey;
        currentStrongpoints = config.strongpoints || [];

        // Re-build grid and markers for new map dimensions
        buildGrid();
        initMap(); // Re-centers, re-builds sticky labels, etc.

        // Final render
        renderMarkers();
        render();

        // Fade in new map
        if (mapStage) {
            mapStage.style.opacity = "1";
            // Restore smooth transitions
            setTimeout(() => {
                // Only animate opacity. Keep transform INSTANT to prevent memory spikes.
                mapStage.style.transition = "opacity 0.3s ease-in-out"; 
            }, 50);
        }

        // Hide loading
        hideLoading();

        // Clean up handler - FIX: Set to null to prevent memory leak
        imgElement.onload = null;
    };
    
    imgElement.onload = handleImageLoad;
    
    // FIX: Handle already-cached images (onload fires synchronously)
    if (imgElement.complete && imgElement.src === config.image) {
        // Image already loaded with correct source, manually trigger handler
        handleImageLoad();
    } else {
        // Trigger load (for new or different images)
        imgElement.src = config.image;
    }
}

// ==========================================
// FLAG IMAGE HELPER
// ==========================================
// ==========================================
// FLAG IMAGE HELPER (ROBUST VERSION)
// ==========================================
function getFlagImage(teamName) {
  if (!teamName) return "images/flags/us_60.webp"; 
  
  const lower = teamName.toLowerCase();
  
  // GB / British / Allies (Maps like El Alamein/Driel)
  if (lower === "gb" || lower.includes("british") || lower.includes("8th") || lower.includes("allies")) {
      return "images/flags/gb_60.webp";
  }

  // Soviet / Russian
  if (lower === "rus" || lower === "sov" || lower.includes("soviet") || lower.includes("rus")) {
      return "images/flags/rus_60.webp";
  }

  // German / Axis
  if (lower === "ger" || lower.includes("germany") || lower.includes("axis") || lower.includes("afrika")) {
      return "images/flags/ger_60.webp";
  }
  
  // Default to US for everything else (US, United States, Allies)
  return "images/flags/us_60.webp";
}

// ==========================================
// FACTION UI UPDATES
// ==========================================
function updateFactionUI(config) {
  const t1Label = config?.teams?.t1 || "ALLIES";
  const t2Label = config?.teams?.t2 || "AXIS";

  const t1Flag = getFlagImage(t1Label);
  const t2Flag = getFlagImage(t2Label);

  // Update dropdown data-values to be generic t1/t2
  const item1 = document.querySelector('.dropdown-item:nth-child(2)'); // Second item (T1, after "all")
  const item2 = document.querySelector('.dropdown-item:nth-child(3)'); // Third item (T2)
  
  if (item1) {
    item1.setAttribute('data-value', 't1'); 
    item1.querySelector('.item-text').innerText = t1Label;
    item1.querySelector('.item-flag').src = t1Flag;
  }
  if (item2) {
    item2.setAttribute('data-value', 't2');
    item2.querySelector('.item-text').innerText = t2Label;
    item2.querySelector('.item-flag').src = t2Flag;
  }

  const mainLabel = document.getElementById("factionLabel");
  const mainFlag = document.getElementById("currentFactionFlag");

  if (mainLabel && mainFlag) {
    if (activeFaction === null) {
        mainLabel.innerText = "SELECT TEAM";
        mainLabel.style.color = "#ffc107";
        mainFlag.style.display = "none";
    } else {
        mainLabel.style.color = "#ffffff";
        mainFlag.style.display = "inline-block";
        
        if (activeFaction === 't1') {
            mainLabel.innerText = t1Label;
            mainFlag.src = t1Flag;
        } else if (activeFaction === 't2') {
            mainLabel.innerText = t2Label;
            mainFlag.src = t2Flag;
        } else {
            mainLabel.innerText = "ALL FACTIONS";
            mainFlag.src = "images/flags/all_60.webp";
        }
    }
  }
}

// ==========================================
// GUN UI UPDATES (FIXED: No Animation on Switch)
// ==========================================

function setupDropdown(containerId, buttonId, labelId, onSelect) {
  const container = document.getElementById(containerId);
  const btn = document.getElementById(buttonId);
  
  if (!container || !btn) return;

  const menu = container.querySelector('.dropdown-menu');
  const items = container.querySelectorAll('.dropdown-item');

  // Toggle Menu on Button Click
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    const isCurrentlyOpen = !menu.classList.contains('hidden');
    
    // Reset all
    document.querySelectorAll('.dropdown-menu').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.btn-map-Select').forEach(el => el.classList.remove('active'));

    if (!isCurrentlyOpen) {
      menu.classList.remove('hidden');
      btn.classList.add('active');
    }
  });

  // Handle Item Click
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = item.getAttribute('data-value');
      
      // Close Menu
      menu.classList.add('hidden');
      btn.classList.remove('active');
      
      // Trigger the Selection logic (this calls the function in initGarrisonControls)
      onSelect(value);
    });
  });
}

function initGarrisonControls() {
  // 1. Setup Faction Dropdown (FIXED: No Animation)
  setupDropdown('factionDropdown', 'factionBtn', 'factionLabel', (value) => {
    // Even if value is same, we might need to "wake up" from null state
    if (activeFaction !== value) {
      
      toggleTransitions(false);

      activeFaction = value;
      // Note: We do NOT reset activeGunIndex here if it was already set, 
      // but usually if you switch teams you might want to reset guns. 
      // For now, let's keep gun Selection if valid, or let it stick.
      // Ideally, switching teams SHOULD reset the gun index to -1 as well 
      // because Gun 1 (US) is not Gun 1 (GER).
      
      // Disable trajectory slider
      trajSliderEnabled = false;
      const trajToggleBtn = document.getElementById('trajToggleBtn');
      const trajContainer = document.getElementById('trajSliderContainer');
      if (trajToggleBtn) trajToggleBtn.classList.remove('active');
      if (trajContainer) trajContainer.classList.add('hidden');
      
      // Refresh UI (This will revert color to white via updateFactionUI)
      updateFactionUI(MAP_DATABASE[activeMapKey]);
      
      renderMarkers(); 
      render();
      saveState();
    }
  });

  // 2. Setup Gun Dropdown (Toggle Only)
  const gunBtn = document.getElementById('gunBtn');
  const gunMenu = document.querySelector('#gunDropdown .dropdown-menu');
  
  if (gunBtn && gunMenu) {
      gunBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const wasHidden = gunMenu.classList.contains('hidden');
          
          document.querySelectorAll('.dropdown-menu').forEach(el => el.classList.add('hidden'));
          document.querySelectorAll('.btn-map-Select').forEach(el => el.classList.remove('active'));

          if (wasHidden) {
              gunMenu.classList.remove('hidden');
              gunBtn.classList.add('active');
          }
      });
  }


  // 3. Global Click Listener
  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.btn-map-Select').forEach(el => el.classList.remove('active'));
  });

}


// ==========================================
// SAVE STATE FUNCTIONALITY
// ==========================================

function saveState() {
  const controlsDrawer = document.getElementById("controlsDrawer");
  
  // CLEAN SAVE: Only saves Map, Faction, Gun, and Toggle Buttons.
  // NO Pan/Zoom, NO Manual Calculator settings.
  const stateToSave = {
    activeMapKey: activeMapKey,
    activeFaction: activeFaction,
    panelHidden: controlsDrawer ? controlsDrawer.classList.contains("closed") : false,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem('hllGarrisonsMapState', JSON.stringify(stateToSave));
  } catch (error) {
    // Silently handle save errors
  }
}

function loadState() {
  try {
    const savedState = localStorage.getItem('hllGarrisonsMapState');
    
    // IF NO SAVE FOUND: Default both to unSelected
    if (!savedState) {
        activeFaction = null; // Default to no faction
        return null;
    }
    
    const loaded = JSON.parse(savedState);
    
    if (!MAP_DATABASE[loaded.activeMapKey]) return null;
    
    activeMapKey = loaded.activeMapKey;
    
    // FIX: Respect saved faction, or default to null if missing/new user
    activeFaction = loaded.activeFaction || null;
    
    window.savedPanelHidden = loaded.panelHidden || false;
    
    return true; 
  } catch (error) {
    activeFaction = null;
    return null;
  }
}

function clearSavedState() {
  try {
    localStorage.removeItem('hllGarrisonsMapState');
  } catch (error) {
    // Silently handle clear errors
  }
}


// ==========================================
// 5. EVENT LISTENERS
// ==========================================

// State to track if a drag occurred
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
const DRAG_THRESHOLD = 5; // Pixels to move before counting as a "Pan"

// --- 1. REMOVED DOUBLE CLICK ZOOM (To fix latency) ---
// Double click logic has been deleted to allow instant shooting.

// --- 2. CLICK (MAP INTERACTION) ---
mapContainer.addEventListener("click", (e) => {
  // 1. If we were dragging (panning), DO NOT CLICK.
  if (isDragging) return; 

  // 2. Check for mobile crosshair interaction (Safe check for mobile HUD)
  const crosshair = document.getElementById("mobileCrosshair");
  if (crosshair && crosshair.offsetParent !== null) {
      return; 
  }

  // 3. Logic: If we click the map background, deselect the current garrison.
  // We use the target check to see if we clicked the map stage or image itself.
  if (e.target.id === "mapStage" || e.target.id === "mapImage" || e.target.id === "gridLayer") {
      if (selectedGarrisonId !== null) {
          selectedGarrisonId = null;
          // FIX: Reset zoom state when deselecting
          zoomedGarrisonId = null;
          preZoomScale = 1;
          renderMarkers();
      }
  }
});

// --- 3. HIGH-SPEED RESPONSIVE WHEEL ZOOM ---
let isWheelThrottled = false;

mapContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  
  // --- FIX: Stop auto-zoom if user scrolls manually ---
  if (activePanAnimation) {
      cancelAnimationFrame(activePanAnimation);
      activePanAnimation = null;
  }
  // ---------------------------------------------------
  
  // Ensure transitions are strictly OFF
  mapStage.classList.remove("zoom-transition");
  document.getElementById("labelLayer")?.classList.remove("zoom-transition");
  mapStage.style.transition = "none";

  if (!isWheelThrottled) {
    isWheelThrottled = true;
    
    requestAnimationFrame(() => {
      const direction = e.deltaY > 0 ? -1 : 1;
      
      // Kept your faster scroll speed
      const SCROLL_SPEED = 1.0; 
      
      let newZoom = currentZoomLevel + (direction * SCROLL_SPEED);
      newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

      const rect = mapContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (Math.abs(newZoom - currentZoomLevel) > 0.01) {
        setZoomLevel(newZoom, mouseX, mouseY);
      }
      
      isWheelThrottled = false;
    });
  }

  // REMOVED: The "Soft Landing" setTimeout block.
  // We no longer want to re-enable animations after scrolling stops.
}, { passive: false });

// --- 4. PANNING LOGIC (DESKTOP) ---
mapContainer.addEventListener("mousedown", (e) => {
  e.preventDefault();
  
  // --- FIX: Stop auto-zoom if user grabs the map ---
  if (activePanAnimation) {
      cancelAnimationFrame(activePanAnimation);
      activePanAnimation = null;
  }
  // ------------------------------------------------
  
  // FIX: Kill transitions on BOTH map and labels immediately
  toggleTransitions(false); 
  
  state.panning = true;
  isDragging = false; 
  
  dragStartX = e.clientX;
  dragStartY = e.clientY;

  state.startX = e.clientX - state.pointX;
  state.startY = e.clientY - state.pointY;
  
  // REMOVED: mapContainer.style.cursor = "grabbing"; 
  // We don't change the cursor yet!
});

window.addEventListener("mousemove", (e) => {
  if (!state.panning) return;
  e.preventDefault();

  const moveDist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
  
  // FIX: Only start the logic if we crossed the threshold
  if (!isDragging && moveDist > DRAG_THRESHOLD) {
      isDragging = true;
      mapContainer.style.cursor = "grabbing";
  }

  // FIX: Only pan the map if we are officially dragging
  if (isDragging) {
      handleMove(e.clientX, e.clientY);
  }
});

window.addEventListener("mouseup", () => {
  state.panning = false;
  mapContainer.style.cursor = ""; // Returns to the crosshair/dot cursor
});

// --- 5. PANNING LOGIC (MOBILE) ---
// Note: Double Tap is handled natively by "dblclick" event on most mobile browsers now
// provided touch-action is set to none (which it is in your CSS).

let initialPinchDistance = null;
let lastZoomScale = 1;

// --- 5. PANNING LOGIC (MOBILE) ---
mapContainer.addEventListener("touchstart", (e) => {
  // --- FIX: Stop auto-zoom if user touches screen ---
  if (activePanAnimation) {
      cancelAnimationFrame(activePanAnimation);
      activePanAnimation = null;
  }
  // -------------------------------------------------
  
  // FIX: Kill transitions immediately so drag is 1:1 instant
  toggleTransitions(false);

  if (e.touches.length === 1) {
    state.panning = true;
    isDragging = false;
    
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;

    state.startX = e.touches[0].clientX - state.pointX;
    state.startY = e.touches[0].clientY - state.pointY;
  } else if (e.touches.length === 2) {
    state.panning = false; 
    initialPinchDistance = getPinchDistance(e);
    lastZoomScale = state.scale;
  }
}, { passive: false });

mapContainer.addEventListener("touchmove", (e) => {
  if (e.cancelable) e.preventDefault(); 

  if (e.touches.length === 1 && state.panning) {
    // Check Threshold
    const moveDist = Math.hypot(e.touches[0].clientX - dragStartX, e.touches[0].clientY - dragStartY);
    
    if (!isDragging && moveDist > DRAG_THRESHOLD) {
        isDragging = true;
    }

    // FIX: Only move if confirmed dragging
    if (isDragging) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  } 
  else if (e.touches.length === 2 && initialPinchDistance) {
    // Pinch Zoom Logic
    isDragging = true; 
    const currentDistance = getPinchDistance(e);
    const zoomFactor = currentDistance / initialPinchDistance;
    
    // Calculate new zoom based on the scale at the start of the pinch
    let newZoom = lastZoomScale * zoomFactor;
    newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    
    const center = getPinchCenter(e);
    const rect = mapContainer.getBoundingClientRect();
    const mouseX = center.x - rect.left;
    const mouseY = center.y - rect.top;
    
    if (!isRendering) {
      isRendering = true;
      requestAnimationFrame(() => {
        // Update both the state and the tracking variable
        currentZoomLevel = newZoom; 
        setZoomLevel(newZoom, mouseX, mouseY);
        isRendering = false;
      });
    }
  }
}, { passive: false });

mapContainer.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) {
    initialPinchDistance = null;
  }
  if (e.touches.length === 0) {
    state.panning = false;
  }
});

// Shared Move Handler
function handleMove(clientX, clientY) {
  state.pointX = clientX - state.startX;
  state.pointY = clientY - state.startY;
  
  if (!isRendering) {
    isRendering = true;
    requestAnimationFrame(() => {
      render();
      isRendering = false;
    });
  }
  
  // Auto-save pan changes (debounced)
  clearTimeout(window.savePanTimeout);
  window.savePanTimeout = setTimeout(saveState, 1000);
}

// Fix for "Sticky Hover" on mobile
// (Mobile phones sometimes keep the :hover state after a tap)
document.addEventListener("touchstart", function(){}, true);

// --- 6. ESCAPE KEY TO CLEAR TARGET ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Only act if there is currently a target Selected
    if (activeTarget) {
      
      // --- FIX START: Kill Animations ---
      toggleTransitions(false);
      // ----------------------------------

      activeTarget = null; // Clear target data
      
      // Update visual states
      renderMarkers();     // Resets gun rotation (stops pointing at target)
      render();            // Refreshes the map

      // REMOVED: setTimeout hack to re-enable animations
      // -----------------------------------
    }
  }
});

// ZOOM SLIDER CONTROLS
// ==========================================

function initZoomControls() {
  const track = document.getElementById("zoomSliderTrack");
  const handle = document.getElementById("zoomSliderHandle");
  const fill = document.getElementById("zoomSliderFill");
  const btnIn = document.getElementById("btnZoomIn");
  const btnOut = document.getElementById("btnZoomOut");
  const mapStage = document.getElementById("mapStage");

  if (!track || !handle) return;

  // --- 1. SYNC UI FROM STATE ---
  window.updateZoomSliderUI = function() {
    const range = MAX_ZOOM - MIN_ZOOM;
    const progress = (state.scale - MIN_ZOOM) / range;
    const percentage = Math.max(0, Math.min(1, progress)) * 100;

    handle.style.bottom = `${percentage}%`;
    fill.style.height = `${percentage}%`;
  };

  // --- 2. HANDLE DRAG LOGIC ---
  let isDraggingSlider = false;

  function updateZoomFromEvent(e) {
    const rect = track.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculate percentage from bottom of track
    let val = (rect.bottom - clientY) / rect.height;
    val = Math.max(0, Math.min(1, val));
    
    const newZoom = MIN_ZOOM + (val * (MAX_ZOOM - MIN_ZOOM));
    
    // Zoom into visual center of container
    const containerRect = mapContainer.getBoundingClientRect();
    setZoomLevel(newZoom, containerRect.width / 2, containerRect.height / 2);
  }

  // --- EVENTS ---
  const startDrag = (e) => {
    isDraggingSlider = true;
    
    // FORCE KILL ALL TRANSITIONS
    mapStage.style.transition = "none"; 
    mapStage.classList.remove("zoom-transition");
    
    updateZoomFromEvent(e);
    // Vibrate on interaction start
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const doDrag = (e) => {
    if (!isDraggingSlider) return;
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    
    requestAnimationFrame(() => updateZoomFromEvent(e));
  };

  const endDrag = () => {
    isDraggingSlider = false;
    // REMOVED: mapStage.classList.add("zoom-transition");
  };

  // Track Listeners
  track.addEventListener("mousedown", startDrag);
  track.addEventListener("touchstart", startDrag, { passive: false });

  window.addEventListener("mousemove", (e) => { if(isDraggingSlider) updateZoomFromEvent(e); });
  window.addEventListener("touchmove", doDrag, { passive: false });

  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchend", endDrag);

// --- 3. BUTTONS (INSTANT SNAP) ---
  const handleBtn = (e, direction) => {
      // 1. Stop browser defaults (Zooming/Scrolling)
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const btn = e.currentTarget;
      
      // Debounce: If already pressed, ignore
      if (btn.classList.contains('pressed')) return;

      // 2. VIBRATION FIX (Chrome Mobile)
      // Increased to 25ms so it is distinctly felt on Android
      if (navigator.vibrate) navigator.vibrate(25);

      // 3. Visual Feedback
      btn.classList.add("pressed");
      setTimeout(() => btn.classList.remove("pressed"), 150);

      // 4. FORCE KILL TRANSITIONS HERE TOO
      mapStage.style.transition = "none";
      mapStage.classList.remove("zoom-transition");

      // 5. Zoom Logic
      // CHANGE: Mobile uses 2.0 step for speed, Desktop uses 1.0 for precision
      const step = (window.innerWidth <= 768) ? 2.0 : 1.0; 
      
      let target = state.scale + (direction * step);
      target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target));

      const rect = mapContainer.getBoundingClientRect();

      // Instant set (Safe for Mobile)
      setZoomLevel(target, rect.width / 2, rect.height / 2);
  };
  btnIn.addEventListener("touchstart", (e) => handleBtn(e, 1), { passive: false });
  btnOut.addEventListener("touchstart", (e) => handleBtn(e, -1), { passive: false });
  btnIn.addEventListener("click", (e) => handleBtn(e, 1));
  btnOut.addEventListener("click", (e) => handleBtn(e, -1));
}

// Initialize
initZoomControls();

// ==========================================
// STRONGPOINTS TOGGLE LOGIC
// ==========================================

function initStrongpointsToggle() {
    const btn = document.getElementById("btnToggleStrongpoints");
    const markersLayer = document.getElementById("markers");

    if (!btn || !markersLayer) return;

    // Load saved preference (Default to 'true' if not set)
    const isHidden = localStorage.getItem("hll-strongpoints-hidden") === "true";
    
    // Apply initial state
    if (isHidden) {
        markersLayer.classList.add("strongpoints-hidden");
        btn.classList.add("disabled");
    }

    // Toggle Handler
    const toggleStrongpoints = (e) => {
        // Prevent default double-tap zooms or map drags
        e.preventDefault();
        e.stopPropagation();

        const isNowHidden = markersLayer.classList.toggle("strongpoints-hidden");
        btn.classList.toggle("disabled", isNowHidden);
        
        // Save state so it remembers your choice on reload
        localStorage.setItem("hll-strongpoints-hidden", isNowHidden);

        // Optional: Vibrate on mobile for feedback
        if (navigator.vibrate) navigator.vibrate(10);
    };

    // Bind Events (Support both Touch and Click)
    btn.addEventListener("click", toggleStrongpoints);
    btn.addEventListener("touchstart", (e) => {
        // Prevent ghost clicks on mobile
        if (e.cancelable) e.preventDefault();
        toggleStrongpoints(e);
    }, { passive: false });
}

// ==========================================
// GRID TOGGLE LOGIC
// ==========================================

function initGridToggle() {
    const btn = document.getElementById("btnToggleGrid");
    // We do NOT fetch gridLayer here, because it might not exist yet on hard refresh.

    if (!btn) return;

    // 1. Load saved preference
    const isHidden = localStorage.getItem("hll-grid-hidden") === "true";

    // 2. Apply initial UI state to the BUTTON only
    if (isHidden) {
        btn.classList.add("disabled");
    }

    // 3. Toggle Handler
    const toggleGrid = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Fetch layers dynamically on click (they definitely exist now)
        const gridLayer = document.getElementById("gridLayer");
        const labelLayer = document.getElementById("labelLayer");

        if (!gridLayer) return;

        // Toggle visibility for the grid lines
        const isNowHidden = gridLayer.classList.toggle("grid-hidden");
        
        // Toggle visibility for the sticky labels
        if (labelLayer) {
            labelLayer.classList.toggle("grid-hidden", isNowHidden);
        }
        
        // Update Button State
        btn.classList.toggle("disabled", isNowHidden);

        // Save state
        localStorage.setItem("hll-grid-hidden", isNowHidden);

        if (navigator.vibrate) navigator.vibrate(10);
    };

    // 4. Bind Events
    btn.addEventListener("click", toggleGrid);
    btn.addEventListener("touchstart", (e) => {
        if (e.cancelable) e.preventDefault();
        toggleGrid(e);
    }, { passive: false });
}

// Apply panel hidden state immediately when DOM is ready (early as possible)
document.addEventListener('DOMContentLoaded', function() {
  const controlsDrawer = document.getElementById("controlsDrawer");
  const toggleBtn = document.getElementById("drawerToggleBtn");
  
  if (controlsDrawer) {
    if (window.savedPanelHidden) {
      // Apply hidden state immediately
      controlsDrawer.classList.add("closed");
      // NEW: If starting closed, assume user knows the UI or arrows aren't needed
      document.body.classList.add("guides-dismissed");
    }
  }
  
  // Set initial aria-expanded state
  if (toggleBtn && controlsDrawer) {
    const isClosed = controlsDrawer.classList.contains("closed");
    toggleBtn.setAttribute("aria-expanded", isClosed ? "false" : "true");
  }
  
  const drawer = document.getElementById("controlsDrawer");

if (toggleBtn && drawer) {
      toggleBtn.addEventListener("click", () => {
          drawer.classList.toggle("closed");

          // --- NEW: PERMANENTLY HIDE ARROWS ON CLOSE ---
          // Once closed (even once), we never show arrows again this session
          if (drawer.classList.contains("closed")) {
              document.body.classList.add("guides-dismissed");
          }
          // ---------------------------------------------
          
          // Update aria-expanded attribute for accessibility
          const isClosed = drawer.classList.contains("closed");
          toggleBtn.setAttribute("aria-expanded", isClosed ? "false" : "true");
          
          // --- THE FIX: Update global state immediately ---
          // This ensures that if you switch maps later, initMap() knows 
          // the panel is currently OPEN and won't force it closed.
          window.savedPanelHidden = isClosed;
          
          // Safety: Close dropdowns if we minimize
          if (drawer.classList.contains("closed")) {
               document.querySelectorAll('.dropdown-menu').forEach(el => el.classList.add('hidden'));
               document.querySelectorAll('.btn-map-Select').forEach(el => el.classList.remove('active'));
          }
           
          // Save panel state
          saveState();
      });
  }
  
  // Inject version number into UI elements
  const versionEl = document.getElementById('appVersion');
  if (versionEl) {
    versionEl.textContent = APP_VERSION;
  }
  
  const versionPanelEl = document.getElementById('appVersionPanel');
  if (versionPanelEl) {
    versionPanelEl.textContent = APP_VERSION;
  }
  
  // Initialize strongpoints toggle
  initStrongpointsToggle();

  // NEW: Initialize grid toggle
  initGridToggle();
  
});

// ==========================================
// MAP GARRISON SORTING & RENAMING (STABLE)
// ==========================================

function applyMapSorting(mapData) {
    if (!mapData.strongpoints) return;

    // Default to 'y' (Vertical) if sorting is missing
    const sortAxis = mapData.garrisonSort ? mapData.garrisonSort.toLowerCase() : 'y';

    // 1. Group Garrisons by Team
    const teams = {};
    const otherPoints = [];

    mapData.strongpoints.forEach(p => {
        if (p.type === 'garrison_default') {
            // Normalize team name to lowercase to ensure clean grouping
            const t = p.team.toLowerCase();
            if (!teams[t]) teams[t] = [];
            teams[t].push(p);
        } else {
            otherPoints.push(p);
        }
    });

    // 2. Sort and Rename items WITHIN each team
    Object.keys(teams).forEach(team => {
        teams[team].sort((a, b) => {
            if (sortAxis === 'x') {
                // Horizontal: Left -> Right
                return a.gameX - b.gameX;
            } else {
                // Vertical: Top -> Bottom (Desc Y)
                return b.gameY - a.gameY; 
            }
        });

        // Rename 1, 2, 3...
        teams[team].forEach((point, index) => {
            point.label = `Default Garrison ${index + 1}`;
        });
    });

    // 3. STABLE TEAM ORDER (Fixes the Arrow Navigation)
    // We sort the team keys alphabetically (e.g., 'axis', 'ger' before 'us', 'ussr')
    // This ensures [Ger 1, Ger 2, Ger 3] is followed by [US 1, US 2, US 3]
    const sortedTeamKeys = Object.keys(teams).sort(); 
    
    const sortedGarrisons = sortedTeamKeys.flatMap(key => teams[key]);

    // 4. Update the Master List
    mapData.strongpoints = [...sortedGarrisons, ...otherPoints];
}

// ==========================================
// FINAL INITIALIZATION
// ==========================================

// Build initial UI
createStickyLabels();
initMapSelector();
renderMapGrid("");

// Load saved data (single call)
loadState();

// Fallback / UI setup that was in the first block
if (!MAP_DATABASE[activeMapKey]) {
    activeMapKey = "CAR";
}
// Apply sorting to ensure garrisons are ordered correctly
applyMapSorting(MAP_DATABASE[activeMapKey]);
currentStrongpoints = MAP_DATABASE[activeMapKey].strongpoints || [];
document.getElementById("currentMapName").innerText = MAP_DATABASE[activeMapKey].name;
updatePageTitle(MAP_DATABASE[activeMapKey].name);
updateFactionUI(MAP_DATABASE[activeMapKey]);
initGarrisonControls();

// Handle first-time visit (No save found)
if (localStorage.getItem('hllGarrisonsMapState') === null) {
    openMapSelector();
}

// Load the map image last
const imgEl = document.getElementById("mapImage");
imgEl.src = MAP_DATABASE[activeMapKey].image;

const onInitLoadWithRetry = function() {
    // FIX: Loop until image has physical dimensions (Fixes "Stuck Zoom" on Reload)
    if (imgEl.naturalWidth === 0) {
        setTimeout(onInitLoadWithRetry, 50);
        return;
    }

    initMap(); 
    render();
    hideLoading();
};

if (imgEl.complete) {
    onInitLoadWithRetry();
} else {
    imgEl.onload = onInitLoadWithRetry;
}

// Ensure ResizeObserver doesn't trigger bad math if image isn't ready
new ResizeObserver(() => { 
    if (imgEl.naturalWidth > 0) {
        updateDimensions(); 
        render(); 
    }
}).observe(mapContainer);

// --- PROJECTS MODAL LOGIC ---

const btnOtherProjects = document.getElementById("btnOtherProjects");
const projectsModal = document.getElementById("projectsModal");
const closeProjectsBtn = document.getElementById("closeProjectsBtn");

if (btnOtherProjects && projectsModal) {
    // Open Modal
    btnOtherProjects.addEventListener("click", (e) => {
        e.preventDefault();
        projectsModal.classList.add("active");
        btnOtherProjects.blur(); // Blur opening button immediately
    });

    // Close Logic
    const closeHub = () => {
        projectsModal.classList.remove("active");
        // Force browser to forget focus when closing (prevents sticking grey/yellow)
        if (document.activeElement) {
            document.activeElement.blur();
        }
    };

    if (closeProjectsBtn) closeProjectsBtn.onclick = closeHub;

    // Close if clicking the dark background
    projectsModal.onclick = (e) => {
        if (e.target === projectsModal) closeHub();
    };
    
    // NEW: Target all buttons inside the hub to clear focus (Mobile Sticky Fix)
    const hubButtons = projectsModal.querySelectorAll('.footer-btn');
    hubButtons.forEach(btn => {
        // 1. Prevent focus from sticking on initial touch/click
        btn.addEventListener('mousedown', () => {
            setTimeout(() => btn.blur(), 0);
        });

        // 2. Ensure blur happens after action triggers
        btn.addEventListener('click', () => {
            setTimeout(() => {
                btn.blur();
                // Double safety: if user came back and it's still focused
                if (document.activeElement === btn) btn.blur();
            }, 100);
        });
    });
}

// Global reset when you switch back to the Garrisons tab
window.onfocus = function() {
    document.querySelectorAll('button').forEach(b => b.blur());
};

// --- FORCE RESET ON TAB RETURN (Mobile Fix) ---
window.addEventListener('pageshow', (event) => {
    // If the page was restored from cache (bfcache) or just shown
    if (event.persisted || document.visibilityState === 'visible') {
        if (document.activeElement) {
            document.activeElement.blur();
        }
        document.querySelectorAll('.footer-btn').forEach(btn => btn.blur());
    }
});

// KEYBOARD NAVIGATION FOR GARRISONS
document.addEventListener('keydown', (e) => {
    // 1. Only act if a garrison is currently selected
    if (selectedGarrisonId === null) return;

    // 2. Only act on Left or Right Arrow
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    // 3. Get list of valid garrisons
    const visibleGarrisons = getVisibleGarrisons();
    if (visibleGarrisons.length === 0) return;

    // 4. Find current index
    const currentIndex = visibleGarrisons.findIndex(p => p.id === selectedGarrisonId);
    if (currentIndex === -1) return; // Should not happen, but safe check

    let newIndex;

    if (e.key === 'ArrowLeft') {
        // Go back (loop to end if at start)
        newIndex = (currentIndex - 1 + visibleGarrisons.length) % visibleGarrisons.length;
    } else {
        // Go forward (loop to start if at end)
        newIndex = (currentIndex + 1) % visibleGarrisons.length;
    }

    const targetPoint = visibleGarrisons[newIndex];

    // 5. Update Selection and Pan
    selectedGarrisonId = targetPoint.id;
    // Pass null to keep current zoom level while panning
    animateToLocation(targetPoint.gameX, targetPoint.gameY, null); 
    renderMarkers();
});