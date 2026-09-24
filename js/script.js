// ==========================================
// 1. DATA & CONFIGURATION
// ==========================================

if (typeof MAP_DATABASE === 'undefined') {
  console.error('MAP_DATABASE is missing! Make sure js/maps.js loaded before script.js');
  alert('Error: Map data failed to load. Please refresh the page.');
}

const APP_VERSION = "v1.1.0";
const GAME_VERSION = "UPDATE 21";

const versionMap = {
  'appVersion': APP_VERSION,
  'appVersionPanel': APP_VERSION,
  'gameVersion': GAME_VERSION,
  'gameVersionPanel': GAME_VERSION
};

function updateVersionDisplays() {
  Object.keys(versionMap).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = versionMap[id];
    }
  });
}

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// HLL maps are 2000m square; SDK coordinates use 100 units/m,
// centered on origin → ±100,000 units
const MAP_WIDTH_METERS = 2000.0; 
const GAME_UNITS_PER_METER = 100.0;
const MAP_SDK_WIDTH = MAP_WIDTH_METERS * GAME_UNITS_PER_METER;
const MAP_SDK_HEIGHT = MAP_SDK_WIDTH;

const GAME_LEFT = -MAP_SDK_WIDTH / 2;
const GAME_RIGHT = MAP_SDK_WIDTH / 2;
const GAME_TOP = MAP_SDK_HEIGHT / 2;
const GAME_BOTTOM = -MAP_SDK_HEIGHT / 2;

const MIN_ZOOM = 1;
let MAX_ZOOM = 10; 
const ZOOM_STEP = 0.5; 

let state = { scale: 1, fitScale: 1, panning: false, pointX: 0, pointY: 0, startX: 0, startY: 0 };
let currentZoomLevel = 1;
let activeFaction = null;   
let activeTarget = null;
let activeMapKey = "CAR"; 
let currentStrongpoints = []; 
let labelCache = [];
let isRendering = false; 
let selectedGarrisonId = null;

let zoomedGarrisonId = null;
let preZoomScale = 1;

let lastClickTime = 0;
let lastClickId = null; 

let trajSliderEnabled = false;
let activeGunIndex = -1; 

let stickyLabelsCache = { cols: [], rows: [] };
let cachedSubGrid = null;

const cached = {
    _ele: {},
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
    get scaleWrapper() { return this.getElem("scaleWrapper"); },
    get scaleTextMid() { return this.getElem("scaleTextMid"); },
    get scaleTextEnd() { return this.getElem("scaleTextEnd"); }
};

const mapContainer = document.getElementById("mapContainer");
const mapStage = document.getElementById("mapStage");
const zoomIndicator = document.getElementById("zoomIndicator");

function openProjectsModal() {
    const modal = document.getElementById('projectsModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeProjectsModal() {
    const modal = document.getElementById('projectsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

document.getElementById('closeProjectsBtn')?.addEventListener('click', closeProjectsModal);

document.getElementById('projectsModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'projectsModal') closeProjectsModal();
});

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

const stopMapInteraction = (e) => {
    e.stopPropagation(); 
};


function showLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) loading.style.display = 'flex';
}

function updatePageTitle(mapName) {
    document.title = `HLL Default Garrisons - ${mapName}`;
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 200); 
  }
}

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

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

let activePanAnimation = null;

function animateToLocation(gameX, gameY, targetZoom = null) {
    const mapImage = document.getElementById("mapImage");
    if (!mapImage) return;

    if (activePanAnimation) cancelAnimationFrame(activePanAnimation);

    const startX = state.pointX;
    const startY = state.pointY;
    const startScale = state.scale;
    
    const fitScale = state.fitScale;

    let endScale = targetZoom !== null ? targetZoom : startScale;
    endScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, endScale));

    const w = mapImage.naturalWidth;
    const h = mapImage.naturalHeight;
    
    const pos = gameToImagePixels(gameX, gameY, w, h);
    
    const containerRect = mapContainer.getBoundingClientRect();
    const screenCX = containerRect.width / 2;
    const screenCY = containerRect.height / 2;

    const effectiveEndZoom = endScale * fitScale;

    const targetX = screenCX - (pos.x * effectiveEndZoom);
    const targetY = screenCY - (pos.y * effectiveEndZoom);

    const duration = 600;
    const startTime = performance.now();

    toggleTransitions(false);

    function loop(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutQuart(progress);

        state.scale = startScale + ((endScale - startScale) * ease);
        
        currentZoomLevel = state.scale; 

        state.pointX = startX + ((targetX - startX) * ease);
        state.pointY = startY + ((targetY - startY) * ease);

        render();

        if (progress < 1) {
            activePanAnimation = requestAnimationFrame(loop);
        } else {
            activePanAnimation = null;
            saveState(); 
        }
    }

    activePanAnimation = requestAnimationFrame(loop);
}

function getVisibleGarrisons() {
    if (!currentStrongpoints) return [];
    
    const visible = [];
    currentStrongpoints.forEach(point => {
        if (point.type !== 'garrison_default') return;

        let shouldShow = true;
        if (activeFaction !== 'all' && activeFaction !== null) {
            const teamLower = point.team.toLowerCase();
            if (activeFaction === 't1') {
                shouldShow = (teamLower === 'us' || teamLower === 'allies' || teamLower === 'rus' || teamLower === 'sov' || teamLower === 'gb' || teamLower === 'can');
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



showLoading();

function toggleSubGrid(currentZoom) {
  if (!cachedSubGrid) {
      cachedSubGrid = document.querySelector('.keypad-grid');
  }
  
  if (!cachedSubGrid) return;

  if (currentZoom >= 3.0) cachedSubGrid.style.opacity = "0.4"; 
  else cachedSubGrid.style.opacity = "0";   
}

function getEffectiveZoom() {
  return state.scale * state.fitScale;
}

function getGridRef(gameX, gameY) {
    const dims = getMapDimensions();
    
    const gridW = dims.width / GAME_UNITS_PER_METER / 10;
    const gridH = dims.height / GAME_UNITS_PER_METER / 10;

    const xMeters = (gameX - dims.left) / GAME_UNITS_PER_METER;
    const yMeters = (dims.top - gameY) / GAME_UNITS_PER_METER;
    
    const totalW = dims.width / GAME_UNITS_PER_METER;
    const totalH = dims.height / GAME_UNITS_PER_METER;

    if (xMeters < 0 || xMeters > totalW || yMeters < 0 || yMeters > totalH) {
        return "---";
    }

    let colIndex = Math.floor(xMeters / gridW); 
    let rowIndex = Math.floor(yMeters / gridH);
    
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    
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
    
    const gridW = dims.width / GAME_UNITS_PER_METER / 10;
    const gridH = dims.height / GAME_UNITS_PER_METER / 10;

    const xMeters = (gameX - dims.left) / GAME_UNITS_PER_METER;
    const yMeters = (dims.top - gameY) / GAME_UNITS_PER_METER;
    
    const totalW = dims.width / GAME_UNITS_PER_METER;
    const totalH = dims.height / GAME_UNITS_PER_METER;

    if (xMeters < 0 || xMeters > totalW || yMeters < 0 || yMeters > totalH) {
        return { text: "---", keypadIndex: -1 };
    }

    let colIndex = Math.floor(xMeters / gridW); 
    let rowIndex = Math.floor(yMeters / gridH);
    
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    
    if (colIndex >= letters.length) colIndex = letters.length - 1;
    if (rowIndex >= 10) rowIndex = 9;
    if (colIndex < 0) colIndex = 0;
    if (rowIndex < 0) rowIndex = 0;
    
    const gridText = `${letters[colIndex]}${rowIndex + 1}`;

    const subX = xMeters % gridW;
    const subY = yMeters % gridH;
    
    const kCol = Math.floor(subX / (gridW / 3)); 
    const kRow = Math.floor(subY / (gridH / 3)); 
    
    const safeCol = Math.min(2, Math.max(0, kCol));
    const safeRow = Math.min(2, Math.max(0, kRow));

    const keypadIndex = (safeRow * 3) + safeCol;

    return { text: gridText, keypadIndex: keypadIndex };
}

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

function toggleTransitions(enable) {
  mapStage.classList.remove("zoom-transition");
  const labelLayer = document.getElementById("labelLayer");
  if (labelLayer) labelLayer.classList.remove("zoom-transition");
  mapStage.style.transition = "none";
}

function setZoomLevel(newLevel, mouseX = null, mouseY = null) {
  const prevZoom = getEffectiveZoom();
  currentZoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newLevel));
  state.scale = currentZoomLevel;
  
  
  if (zoomedGarrisonId !== null && state.scale < MAX_ZOOM - 0.5) {
    zoomedGarrisonId = null;
    renderMarkers();
  }
  
  const newZoom = getEffectiveZoom();
  
  if (mouseX !== null && mouseY !== null) {
    const worldX = (mouseX - state.pointX) / prevZoom;
    const worldY = (mouseY - state.pointY) / prevZoom;
    
    state.pointX = mouseX - worldX * newZoom;
    state.pointY = mouseY - worldY * newZoom;
  }
  
  clampPosition();
  toggleSubGrid(currentZoomLevel);
  render();
  
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
    
    if (isHidden) labelLayer.classList.add("grid-hidden");
    
    mapContainer.appendChild(labelLayer);
  }
  
  labelLayer.innerHTML = "";
  
  stickyLabelsCache.cols = [];
  stickyLabelsCache.rows = [];

  for (let i = 0; i < 10; i++) {
    const el = document.createElement("div");
    el.className = "hll-grid-label";
    el.innerText = (i === 0) ? "A1" : letters[i];
    labelLayer.appendChild(el);
    stickyLabelsCache.cols.push(el);
  }

  for (let i = 1; i < 10; i++) {
    const el = document.createElement("div");
    el.className = "hll-grid-label";
    el.innerText = i + 1;
    labelLayer.appendChild(el);
    stickyLabelsCache.rows.push(el);
  }
}

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

  const isHighDPI = window.devicePixelRatio > 1;
  const useFloats = isHighDPI || isFirefox;

  for (let i = 0; i < stickyLabelsCache.cols.length; i++) {
    const el = stickyLabelsCache.cols[i];
    const colScreenX = state.pointX + (i * stepX);
    const finalX = colScreenX + padding;
    
    let finalY;
    if (i === 0) finalY = state.pointY + padding; 
    else finalY = stickyTopY + padding;      
    
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
    
    const xVal = useFloats ? finalX : Math.round(finalX);
    const yVal = useFloats ? finalY : Math.round(finalY);
    
    el.style.transform = `translate(${xVal}px, ${yVal}px) scale(${fontScale})`;
  }
}

function buildGrid() {
  let gridLayer = document.getElementById("gridLayer");
  
  const isHidden = localStorage.getItem("hll-grid-hidden") === "true";

  if (!gridLayer) {
    gridLayer = document.createElement("div");
    gridLayer.id = "gridLayer";
    gridLayer.className = "grid-layer";
    
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

  for (let i = 0; i <= 10; i++) { 
    const vLine = document.createElement("div");
    vLine.className = "hll-grid-line vertical";
    vLine.style.left = `${Math.round(i * stepX)}px`;
    
    if (i === 0) vLine.style.transform = "translateX(0)"; 
    else if (i === 10) vLine.style.transform = "translateX(-100%)"; 
    else vLine.style.transform = "translateX(0)";
    
    gridLayer.appendChild(vLine);
  }

  for (let i = 0; i <= 10; i++) { 
    const hLine = document.createElement("div");
    hLine.className = "hll-grid-line horizontal";
    hLine.style.top = `${Math.round(i * stepY)}px`;
    
    if (i === 0) hLine.style.transform = "translateY(0)"; 
    else if (i === 10) hLine.style.transform = "translateY(-100%)"; 
    else hLine.style.transform = "translateY(0)";
    
    gridLayer.appendChild(hLine);
  }
}

function getMapDimensions() {
  const config = MAP_DATABASE[activeMapKey];
  
  if (config.bounds) {
    return {
      width: config.bounds.maxX - config.bounds.minX,
      height: config.bounds.maxY - config.bounds.minY,
      left: config.bounds.minX,
      top: config.bounds.maxY 
    };
  }

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

  const normX = (gameX - dims.left) / dims.width;
  
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
  markersLayer.querySelectorAll('.garrison-control-ui').forEach(ui => {
      ui.remove();
  });
  const fragment = document.createDocumentFragment();
  const mapImage = cached.mapImage;
  if (!mapImage) return;

  const w = mapImage.naturalWidth;
  const h = mapImage.naturalHeight;
  const config = MAP_DATABASE[activeMapKey];
  if (!config || !currentStrongpoints) return;

  currentStrongpoints.forEach(point => {
    const isGarrison = point.type === 'garrison_default';
    
    let shouldShow = true;
    if (isGarrison && activeFaction !== 'all' && activeFaction !== null) {
        const teamLower = point.team.toLowerCase();
        if (activeFaction === 't1') {
            shouldShow = (teamLower === 'us' || teamLower === 'allies' || teamLower === 'rus' || teamLower === 'sov' || teamLower === 'gb' || teamLower === 'can');
        } else if (activeFaction === 't2') {
            shouldShow = (teamLower === 'ger' || teamLower === 'axis');
        }
    }

    if (!shouldShow) return;
    
    const el = document.createElement("div");
    el.className = `marker ${point.team} ${point.type}`;
    
    const pos = gameToImagePixels(point.gameX, point.gameY, w, h);
    
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
    
    if (isGarrison) { 
      el.style.left = `${Math.round(pos.x)}px`; 
      el.style.top = `${Math.round(pos.y)}px`;
      
      if (selectedGarrisonId === point.id) el.classList.add('selected');

      const mainIcon = document.createElement("div");
      mainIcon.className = "garrison-main-icon";
      mainIcon.style.backgroundImage = 'url("images/ui/default_garrison_512.webp")';
      
      const dims = getMapDimensions();
      const pxPerMeter = (w / dims.width) * GAME_UNITS_PER_METER;
      
      const ring15mPx = Math.round(15 * pxPerMeter);
      const ring50mPx = Math.round(50 * pxPerMeter);
      
      const ring15m = document.createElement("div");
      ring15m.className = "radius-ring";
      ring15m.style.cssText = `width:${ring15mPx}px;height:${ring15mPx}px;background:rgba(255,68,68,0.4);border:1px solid rgba(255,68,68,0.8);border-radius:50%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:-1;`;
      el.appendChild(ring15m);
      
      const ring50m = document.createElement("div");
      ring50m.className = "radius-ring";
      ring50m.style.cssText = `width:${ring50mPx}px;height:${ring50mPx}px;background:rgba(255,193,7,0.3);border:1px solid rgba(255,193,7,0.7);border-radius:50%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:-2;`;
      el.appendChild(ring50m);
      
      el.appendChild(mainIcon);

      el.addEventListener('click', (e) => {
          if (isDragging) return; 
          e.stopPropagation();

          const now = Date.now();
          const isSameTarget = (lastClickId === point.id);
          const isFastEnough = (now - lastClickTime < 300);

          if (isSameTarget && isFastEnough) {
              
              selectedGarrisonId = point.id;

              if (window.innerWidth > 768) {
                  animateToLocation(point.gameX, point.gameY, 7.0);
              } else {
                  animateToLocation(point.gameX, point.gameY, null);
              }

              renderMarkers();

          } else {
              selectedGarrisonId = (selectedGarrisonId === point.id) ? null : point.id;
              renderMarkers();
          }

          lastClickTime = now;
          lastClickId = point.id;

          if (navigator.vibrate) navigator.vibrate(15);
      });

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

          const switchGar = (e, targetPoint) => {
             e.stopPropagation();
             
             selectedGarrisonId = targetPoint.id;
             
             zoomedGarrisonId = null;
             preZoomScale = 1;
             
             animateToLocation(targetPoint.gameX, targetPoint.gameY, null);

             renderMarkers(); 
             if (navigator.vibrate) navigator.vibrate(50);
          };

          const btnPrev = controlUI.querySelector('.arrow-left');
          const btnNext = controlUI.querySelector('.arrow-right');
          const btnZoom = controlUI.querySelector('.zoom-btn');

          btnPrev.addEventListener('click', (e) => switchGar(e, prevPoint));
          btnNext.addEventListener('click', (e) => switchGar(e, nextPoint));
          
          const handleZoomToggle = (e) => {
              e.stopPropagation();
              if (e.type === 'touchstart') e.preventDefault();

              const isCurrentlyZoomed = (zoomedGarrisonId === point.id);

              if (!isCurrentlyZoomed) {
                  preZoomScale = state.scale;
                  zoomedGarrisonId = point.id;
                  
                  animateToLocation(point.gameX, point.gameY, MAX_ZOOM);
              } else {
                  zoomedGarrisonId = null;
                  const savedPreZoom = preZoomScale;
                  preZoomScale = 1;
                  
                  const targetZoom = (savedPreZoom < state.scale && savedPreZoom >= MIN_ZOOM) ? savedPreZoom : 3.0;
                  
                  animateToLocation(point.gameX, point.gameY, targetZoom);
              }

              renderMarkers();
              if (navigator.vibrate) navigator.vibrate(50);
          };
          
          btnZoom.addEventListener('click', handleZoomToggle);
          btnZoom.addEventListener('touchstart', handleZoomToggle, { passive: false });

          const zoomBtn = controlUI.querySelector('.zoom-btn');
          const zoomIcon = controlUI.querySelector('#zoomIcon');

          const updateZoomIcon = () => {
              const isZoomed = (zoomedGarrisonId === point.id);
              if (isZoomed) {
                  zoomIcon.innerHTML = `
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      <rect x="6" y="8.5" width="7" height="2" rx="0.5"/>   <!-- centered minus -->
                  `;
              } else {
                  zoomIcon.innerHTML = `
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      <path d="M9.5 6v7M6 9.5h7" stroke="currentColor" stroke-width="2" fill="none"/>   <!-- centered plus -->
                  `;
              }
          };
          updateZoomIcon();

          el.appendChild(controlUI);
      }
    }

    fragment.appendChild(el);
  });

  markersLayer.appendChild(fragment);
}


function render() {
  clampPosition();
  const drawScale = state.scale * state.fitScale;
  const markersLayer = cached.markersLayer;
  
  const mapContainer = cached.mapContainer;
  mapContainer.style.setProperty('--current-scale', drawScale); 
  const mapStage = cached.mapStage;
  mapStage.style.setProperty('--effective-zoom', drawScale);
  
  const uiCounterScale = 1 / drawScale; 
  cached.mapContainer.style.setProperty('--ui-counter-scale', uiCounterScale);
  
  if (isFirefox) {
      if (state.scale > 1.01) {
          if (mapStage.style.willChange !== 'transform') mapStage.style.willChange = 'transform';
          if (markersLayer && markersLayer.style.willChange !== 'transform') markersLayer.style.willChange = 'transform';
      } else {
          mapStage.style.willChange = 'auto';
          if (markersLayer) markersLayer.style.willChange = 'auto';
      }
  }

  const isMobileDevice = window.innerWidth <= 768;
  let baseSize, minSize, iconExponent;

  if (isMobileDevice) {
      baseSize = 240; 
      minSize = 24;
      
      iconExponent = 0.75; 
  } else {
      baseSize = 150;
      
      minSize = 20;      
      
      iconExponent = 0.85; 
  }

  const rawSize = baseSize / Math.pow(state.scale, iconExponent);
  const dynSize = Math.max(minSize, Math.min(baseSize, rawSize));

  mapContainer.style.setProperty('--dynamic-icon-size', `${dynSize}px`);
  
  const isMob = window.innerWidth <= 768;
  const strokeBase = isMob ? 10 : 8; 
  const strokeExp = isMob ? 0.5 : 0.6;
  const dynStroke = strokeBase / Math.pow(state.scale, strokeExp);
  const finalStroke = Math.max(1.5, Math.min(10, dynStroke));
  mapContainer.style.setProperty('--dynamic-stroke', `${finalStroke}px`);

  const dynCircleStroke = (strokeBase * 0.75) / Math.pow(state.scale, strokeExp);
  const finalCircleStroke = Math.max(1.0, Math.min(8, dynCircleStroke));
  mapContainer.style.setProperty('--dynamic-circle-stroke', `${finalCircleStroke}px`);
  
  const isHighDPI = window.devicePixelRatio > 1;
  const useFloats = isHighDPI || (isFirefox && state.scale > 1.05);

  const finalX = useFloats ? state.pointX : Math.round(state.pointX);
  const finalY = useFloats ? state.pointY : Math.round(state.pointY);
  
  const transformString = `translate(${finalX}px, ${finalY}px) scale(${drawScale})`;
  
  mapStage.style.transform = transformString;
  
  if (markersLayer) {
      markersLayer.style.transform = transformString;
  }
  
  updateRealScale(drawScale);
  const zoomIndicator = cached.zoomIndicator;
  if (zoomIndicator) zoomIndicator.innerText = `${state.scale.toFixed(1)}x`;
  
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


let _lastScaleTextEnd = "";
let _lastScaleTextMid = "";

function updateRealScale(effectiveZoom) {
    const mapImg = cached.mapImage;
    if (!mapImg || mapImg.naturalWidth === 0) return;

    const TOTAL_PLAYABLE_METERS = 2000;

    const currentMapPixelWidth = mapImg.naturalWidth * effectiveZoom;
    const pixelsPerMeter = currentMapPixelWidth / TOTAL_PLAYABLE_METERS;

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

    const barPixelsRounded = Math.round(barMeters * pixelsPerMeter);
    
    const scaleWrapper = cached.scaleWrapper;
    const elMid = cached.scaleTextMid;
    const elEnd = cached.scaleTextEnd;

    if (scaleWrapper) scaleWrapper.style.width = `${barPixelsRounded}px`;
    
    const midText = `${barMeters / 2}m`;
    const endText = `${barMeters}m`;
    
    if (elMid && elMid.innerText !== midText) elMid.innerText = midText;
    if (elEnd && elEnd.innerText !== endText) elEnd.innerText = endText;
}

function updateDimensions() {
  const mapImage = document.getElementById("mapImage");
  
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
    const markersLayer = cached.markersLayer;
    const mapContainer = cached.mapContainer;
    const mapImage = cached.mapImage;

    if (markersLayer && mapContainer && mapImage) {
        if (markersLayer.parentElement !== mapContainer) {
            mapContainer.appendChild(markersLayer);
        }
        
        if (mapImage.naturalWidth > 0 && mapImage.naturalHeight > 0) {
            markersLayer.style.width = `${mapImage.naturalWidth}px`;
            markersLayer.style.height = `${mapImage.naturalHeight}px`;
        }
        
        markersLayer.style.zIndex = "100"; 
        markersLayer.style.transformOrigin = "0 0"; 
    }

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
// VISUAL MAP SELECTOR
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

  if (clearBtn && searchInput) {
    const clearAction = (e) => {
      e.preventDefault();
      searchInput.value = "";
      searchInput.focus();
      renderMapGrid("");
    };

    clearBtn.addEventListener("click", clearAction);
    clearBtn.addEventListener("touchstart", clearAction, { passive: false });
  }
  
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
// MAP GRID RENDERING
// ==========================================
let isGridFull = false;

function renderMapGrid(filter = "") {
    const grid = document.getElementById("mapGrid");
    if (!grid) return;
    const cleanFilter = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    if (cleanFilter === "" && isGridFull && grid.hasChildNodes()) {
        grid.querySelectorAll('.map-card').forEach((card) => {
            const cardKey = card.dataset.mapKey || "";
            card.classList.toggle('active', cardKey === activeMapKey);
        });
        return;
    }

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
        card.dataset.mapKey = key;
        if (key === activeMapKey) card.classList.add('active');
       
        card.onclick = () => SelectMapFromGrid(key);
       
        const img = document.createElement("img");
        img.className = "map-card-img";
        img.alt = mapData.name;
        
        const imgPath = mapData.thumbnail || mapData.image;
        img.src = imgPath; 
        
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
// OPEN MAP SELECTOR
// ==========================================
function openMapSelector() {
  const searchInput = document.getElementById("mapSearchInput");
  
  if (searchInput) {
    searchInput.value = "";
  }
  
  renderMapGrid("");
  
  document.getElementById("mapModal").classList.add("active");
}

// ==========================================
// CLOSE MAP SELECTOR
// ==========================================
function closeMapSelector() {
    const modal = document.getElementById("mapModal");
    const searchInput = document.getElementById("mapSearchInput");
    
    if (modal) {
        modal.classList.remove("active");
    }
    
    if (searchInput) {
        searchInput.value = "";
        renderMapGrid(""); 
    }
}

// ==========================================
// SELECT MAP FROM GRID
// ==========================================
function SelectMapFromGrid(key) {
    closeMapSelector();

    activeTarget = null;
    selectedGarrisonId = null;
    
    activeFaction = 'all'; 

    const config = MAP_DATABASE[key];
    if (!config) return;

    applyMapSorting(config);

    activeMapKey = key;
    currentStrongpoints = config.strongpoints || [];

    updatePageTitle(config.name);

    const currentMapLbl = document.getElementById("currentMapName");
    if (currentMapLbl) currentMapLbl.innerText = config.name;

    updateFactionUI(config);

    saveState();

    renderMapGrid("");

    switchMap(key);
}

function switchMap(mapKey) {
    if (!MAP_DATABASE[mapKey]) return;

    const mapStage = document.getElementById("mapStage");
    const imgElement = document.getElementById('mapImage');
    const markersLayer = document.getElementById("markers");

    if (mapStage) {
        mapStage.style.transition = "opacity 0.2s ease-out";
        mapStage.style.opacity = "0";
    }

    if (markersLayer) markersLayer.innerHTML = "";

    showLoading();

    const config = MAP_DATABASE[mapKey];

    imgElement.onload = null;
    
    const handleImageLoad = function() {
        activeMapKey = mapKey;
        currentStrongpoints = config.strongpoints || [];

        buildGrid();
        initMap();

        renderMarkers();
        render();

        if (mapStage) {
            mapStage.style.opacity = "1";
            setTimeout(() => {
                mapStage.style.transition = "opacity 0.3s ease-in-out"; 
            }, 50);
        }

        hideLoading();

        imgElement.onload = null;
    };
    
    imgElement.onload = handleImageLoad;
    
    if (imgElement.complete && imgElement.src === config.image) {
        handleImageLoad();
    } else {
        imgElement.src = config.image;
    }
}

// ==========================================
// FLAG IMAGE HELPER
// ==========================================
function getFlagImage(teamName) {
  if (!teamName) return "images/flags/us_60.webp"; 
  
  const lower = teamName.toLowerCase();

  if (lower === "can" || lower.includes("canada") || lower.includes("canadian")) {
      return "images/flags/can.webp";
  }
  
  if (lower === "gb" || lower.includes("british") || lower.includes("8th") || lower.includes("allies")) {
      return "images/flags/gb_60.webp";
  }

  if (lower === "rus" || lower === "sov" || lower.includes("soviet") || lower.includes("rus")) {
      return "images/flags/rus_60.webp";
  }

  if (lower === "ger" || lower.includes("germany") || lower.includes("axis") || lower.includes("afrika")) {
      return "images/flags/ger_60.webp";
  }
  
  return "images/flags/us_60.webp";
}

// ==========================================
// UPDATE FACTION UI
// ==========================================
function updateFactionUI(config) {
  const t1Label = config?.teams?.t1 || "ALLIES";
  const t2Label = config?.teams?.t2 || "AXIS";

  const t1Flag = getFlagImage(t1Label);
  const t2Flag = getFlagImage(t2Label);

  const item1 = document.querySelector('.dropdown-item:nth-child(2)');
  const item2 = document.querySelector('.dropdown-item:nth-child(3)');
  
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
// SETUP DROPDOWN FUNCTIONALITY 
// ==========================================

function setupDropdown(containerId, buttonId, labelId, onSelect) {
  const container = document.getElementById(containerId);
  const btn = document.getElementById(buttonId);
  
  if (!container || !btn) return;

  const menu = container.querySelector('.dropdown-menu');
  const items = container.querySelectorAll('.dropdown-item');

  btn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    const isCurrentlyOpen = !menu.classList.contains('hidden');
    
    document.querySelectorAll('.dropdown-menu').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.btn-map-Select').forEach(el => el.classList.remove('active'));

    if (!isCurrentlyOpen) {
      menu.classList.remove('hidden');
      btn.classList.add('active');
    }
  });

  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = item.getAttribute('data-value');
      
      menu.classList.add('hidden');
      btn.classList.remove('active');
      
      onSelect(value);
    });
  });
}

function initGarrisonControls() {
  setupDropdown('factionDropdown', 'factionBtn', 'factionLabel', (value) => {
    if (activeFaction !== value) {
      
      toggleTransitions(false);

      activeFaction = value;
      
      trajSliderEnabled = false;
      const trajToggleBtn = document.getElementById('trajToggleBtn');
      const trajContainer = document.getElementById('trajSliderContainer');
      if (trajToggleBtn) trajToggleBtn.classList.remove('active');
      if (trajContainer) trajContainer.classList.add('hidden');
      
      updateFactionUI(MAP_DATABASE[activeMapKey]);
      
      renderMarkers(); 
      render();
      saveState();
    }
  });

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
  
  const stateToSave = {
    activeMapKey: activeMapKey,
    activeFaction: activeFaction,
    panelHidden: controlsDrawer ? controlsDrawer.classList.contains("closed") : false,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem('hllGarrisonsMapState', JSON.stringify(stateToSave));
  } catch (error) {
  }
}

function loadState() {
  try {
    const savedState = localStorage.getItem('hllGarrisonsMapState');
    
    if (!savedState) {
        activeFaction = null;
        return null;
    }
    
    const loaded = JSON.parse(savedState);
    
    if (!MAP_DATABASE[loaded.activeMapKey]) return null;
    
    activeMapKey = loaded.activeMapKey;
    
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
  }
}


// ==========================================
// 5. EVENT LISTENERS
// ==========================================

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
const DRAG_THRESHOLD = 5;


mapContainer.addEventListener("click", (e) => {
  if (isDragging) return; 

  const crosshair = document.getElementById("mobileCrosshair");
  if (crosshair && crosshair.offsetParent !== null) {
      return; 
  }

  if (e.target.id === "mapStage" || e.target.id === "mapImage" || e.target.id === "gridLayer") {
      if (selectedGarrisonId !== null) {
          selectedGarrisonId = null;
          zoomedGarrisonId = null;
          preZoomScale = 1;
          renderMarkers();
      }
  }
});

let isWheelThrottled = false;

mapContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  
  if (activePanAnimation) {
      cancelAnimationFrame(activePanAnimation);
      activePanAnimation = null;
  }
  
  mapStage.classList.remove("zoom-transition");
  document.getElementById("labelLayer")?.classList.remove("zoom-transition");
  mapStage.style.transition = "none";

  if (!isWheelThrottled) {
    isWheelThrottled = true;
    
    requestAnimationFrame(() => {
      const direction = e.deltaY > 0 ? -1 : 1;
      
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

}, { passive: false });

mapContainer.addEventListener("mousedown", (e) => {
  e.preventDefault();
  
  if (activePanAnimation) {
      cancelAnimationFrame(activePanAnimation);
      activePanAnimation = null;
  }
  
  toggleTransitions(false); 
  
  state.panning = true;
  isDragging = false; 
  
  dragStartX = e.clientX;
  dragStartY = e.clientY;

  state.startX = e.clientX - state.pointX;
  state.startY = e.clientY - state.pointY;
  
});

window.addEventListener("mousemove", (e) => {
  if (!state.panning) return;
  e.preventDefault();

  const moveDist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
  
  if (!isDragging && moveDist > DRAG_THRESHOLD) {
      isDragging = true;
      mapContainer.style.cursor = "grabbing";
  }

  if (isDragging) {
      handleMove(e.clientX, e.clientY);
  }
});

window.addEventListener("mouseup", () => {
  state.panning = false;
  mapContainer.style.cursor = "";
});


let initialPinchDistance = null;
let lastZoomScale = 1;

mapContainer.addEventListener("touchstart", (e) => {
  if (activePanAnimation) {
      cancelAnimationFrame(activePanAnimation);
      activePanAnimation = null;
  }
  
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
    const moveDist = Math.hypot(e.touches[0].clientX - dragStartX, e.touches[0].clientY - dragStartY);
    
    if (!isDragging && moveDist > DRAG_THRESHOLD) {
        isDragging = true;
    }

    if (isDragging) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  } 
  else if (e.touches.length === 2 && initialPinchDistance) {
    isDragging = true; 
    const currentDistance = getPinchDistance(e);
    const zoomFactor = currentDistance / initialPinchDistance;
    
    let newZoom = lastZoomScale * zoomFactor;
    newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    
    const center = getPinchCenter(e);
    const rect = mapContainer.getBoundingClientRect();
    const mouseX = center.x - rect.left;
    const mouseY = center.y - rect.top;
    
    if (!isRendering) {
      isRendering = true;
      requestAnimationFrame(() => {
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
  
  clearTimeout(window.savePanTimeout);
  window.savePanTimeout = setTimeout(saveState, 1000);
}

document.addEventListener("touchstart", function(){}, true);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (activeTarget) {
      
      toggleTransitions(false);

      activeTarget = null;
      
      renderMarkers();
      render();

    }
  }
});

// ==========================================
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

  window.updateZoomSliderUI = function() {
    const range = MAX_ZOOM - MIN_ZOOM;
    const progress = (state.scale - MIN_ZOOM) / range;
    const percentage = Math.max(0, Math.min(1, progress)) * 100;

    handle.style.bottom = `${percentage}%`;
    fill.style.height = `${percentage}%`;
  };

  let isDraggingSlider = false;

  function updateZoomFromEvent(e) {
    const rect = track.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    let val = (rect.bottom - clientY) / rect.height;
    val = Math.max(0, Math.min(1, val));
    
    const newZoom = MIN_ZOOM + (val * (MAX_ZOOM - MIN_ZOOM));
    
    const containerRect = mapContainer.getBoundingClientRect();
    setZoomLevel(newZoom, containerRect.width / 2, containerRect.height / 2);
  }

  const startDrag = (e) => {
    isDraggingSlider = true;
    
    mapStage.style.transition = "none"; 
    mapStage.classList.remove("zoom-transition");
    
    updateZoomFromEvent(e);
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
  };

  track.addEventListener("mousedown", startDrag);
  track.addEventListener("touchstart", startDrag, { passive: false });

  window.addEventListener("mousemove", (e) => { if(isDraggingSlider) updateZoomFromEvent(e); });
  window.addEventListener("touchmove", doDrag, { passive: false });

  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchend", endDrag);

  const handleBtn = (e, direction) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const btn = e.currentTarget;
      
      if (btn.classList.contains('pressed')) return;

      if (navigator.vibrate) navigator.vibrate(25);

      btn.classList.add("pressed");
      setTimeout(() => btn.classList.remove("pressed"), 150);

      mapStage.style.transition = "none";
      mapStage.classList.remove("zoom-transition");

      const step = (window.innerWidth <= 768) ? 2.0 : 1.0; 
      
      let target = state.scale + (direction * step);
      target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target));

      const rect = mapContainer.getBoundingClientRect();

      setZoomLevel(target, rect.width / 2, rect.height / 2);
  };
  btnIn.addEventListener("touchstart", (e) => handleBtn(e, 1), { passive: false });
  btnOut.addEventListener("touchstart", (e) => handleBtn(e, -1), { passive: false });
  btnIn.addEventListener("click", (e) => handleBtn(e, 1));
  btnOut.addEventListener("click", (e) => handleBtn(e, -1));
}

initZoomControls();

// ==========================================
// STRONGPOINTS TOGGLE LOGIC
// ==========================================

function initStrongpointsToggle() {
    const btn = document.getElementById("btnToggleStrongpoints");
    const markersLayer = document.getElementById("markers");

    if (!btn || !markersLayer) return;

    const isHidden = localStorage.getItem("hll-strongpoints-hidden") === "true";
    
    if (isHidden) {
        markersLayer.classList.add("strongpoints-hidden");
        btn.classList.add("disabled");
    }

    const toggleStrongpoints = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isNowHidden = markersLayer.classList.toggle("strongpoints-hidden");
        btn.classList.toggle("disabled", isNowHidden);
        
        localStorage.setItem("hll-strongpoints-hidden", isNowHidden);

        if (navigator.vibrate) navigator.vibrate(50);
    };

    btn.addEventListener("click", toggleStrongpoints);
    btn.addEventListener("touchstart", (e) => {
        if (e.cancelable) e.preventDefault();
        toggleStrongpoints(e);
    }, { passive: false });
}

// ==========================================
// GRID TOGGLE LOGIC
// ==========================================

function initGridToggle() {
    const btn = document.getElementById("btnToggleGrid");

    if (!btn) return;

    const isHidden = localStorage.getItem("hll-grid-hidden") === "true";

    if (isHidden) {
        btn.classList.add("disabled");
    }

    const toggleGrid = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const gridLayer = document.getElementById("gridLayer");
        const labelLayer = document.getElementById("labelLayer");

        if (!gridLayer) return;

        const isNowHidden = gridLayer.classList.toggle("grid-hidden");
        
        if (labelLayer) {
            labelLayer.classList.toggle("grid-hidden", isNowHidden);
        }
        
        btn.classList.toggle("disabled", isNowHidden);

        localStorage.setItem("hll-grid-hidden", isNowHidden);

        if (navigator.vibrate) navigator.vibrate(50);
    };

    btn.addEventListener("click", toggleGrid);
    btn.addEventListener("touchstart", (e) => {
        if (e.cancelable) e.preventDefault();
        toggleGrid(e);
    }, { passive: false });
}

// ==========================================
// RADIUS TOGGLE LOGIC
// ==========================================
function initRadiiToggle() {
    const btn = document.getElementById("btnToggleRadii");
    const markersLayer = document.getElementById("markers");
    const legend = document.querySelector(".garrison-legend");
    if (!btn || !markersLayer) return;

    const isHidden = localStorage.getItem("hll-radii-hidden") === "true";

    if (isHidden) {
        markersLayer.classList.add("radii-hidden");
        btn.classList.add("disabled");
        if (legend) legend.style.display = "none";
    }

    const toggleRadii = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isNowHidden = markersLayer.classList.toggle("radii-hidden");
        btn.classList.toggle("disabled", isNowHidden);
        
        if (legend) legend.style.display = isNowHidden ? "none" : "flex";

        localStorage.setItem("hll-radii-hidden", isNowHidden);

        if (navigator.vibrate) navigator.vibrate(50);
    };

    btn.addEventListener("click", toggleRadii);
    btn.addEventListener("touchstart", (e) => {
        if (e.cancelable) e.preventDefault();
        toggleRadii(e);
    }, { passive: false });
}

document.addEventListener('DOMContentLoaded', function() {
  const controlsDrawer = document.getElementById("controlsDrawer");
  const toggleBtn = document.getElementById("drawerToggleBtn");
  
  if (controlsDrawer) {
    if (window.savedPanelHidden) {
      controlsDrawer.classList.add("closed");
      document.body.classList.add("guides-dismissed");
    }
  }
  
  if (toggleBtn && controlsDrawer) {
    const isClosed = controlsDrawer.classList.contains("closed");
    toggleBtn.setAttribute("aria-expanded", isClosed ? "false" : "true");
  }
  
  const drawer = document.getElementById("controlsDrawer");

if (toggleBtn && drawer) {
      toggleBtn.addEventListener("click", () => {
          drawer.classList.toggle("closed");

          if (drawer.classList.contains("closed")) {
              document.body.classList.add("guides-dismissed");
          }
          
          const isClosed = drawer.classList.contains("closed");
          toggleBtn.setAttribute("aria-expanded", isClosed ? "false" : "true");
          
          window.savedPanelHidden = isClosed;
          
          if (drawer.classList.contains("closed")) {
               document.querySelectorAll('.dropdown-menu').forEach(el => el.classList.add('hidden'));
               document.querySelectorAll('.btn-map-Select').forEach(el => el.classList.remove('active'));
          }
           
          saveState();
      });
  }
  
  const versionEl = document.getElementById('appVersion');
  if (versionEl) {
    versionEl.textContent = APP_VERSION;
  }
  
  const versionPanelEl = document.getElementById('appVersionPanel');
  if (versionPanelEl) {
    versionPanelEl.textContent = APP_VERSION;
  }

  const gameVersionEl = document.getElementById('gameVersion');
  if (gameVersionEl) {
    gameVersionEl.textContent = GAME_VERSION;
  }

  const gameVersionPanelEl = document.getElementById('gameVersionPanel');
  if (gameVersionPanelEl) {
    gameVersionPanelEl.textContent = GAME_VERSION;
  }
  
  initStrongpointsToggle();

  initGridToggle();
  initRadiiToggle();
  
});

// ==========================================
// MAP GARRISON SORTING & RENAMING
// ==========================================

function applyMapSorting(mapData) {
    if (!mapData.strongpoints) return;

    const sortAxis = mapData.garrisonSort ? mapData.garrisonSort.toLowerCase() : 'y';

    const teams = {};
    const otherPoints = [];

    mapData.strongpoints.forEach(p => {
        if (p.type === 'garrison_default') {
            const t = p.team.toLowerCase();
            if (!teams[t]) teams[t] = [];
            teams[t].push(p);
        } else {
            otherPoints.push(p);
        }
    });

    Object.keys(teams).forEach(team => {
        teams[team].sort((a, b) => {
            if (sortAxis === 'x') {
                return a.gameX - b.gameX;
            } else {
                return b.gameY - a.gameY; 
            }
        });

        teams[team].forEach((point, index) => {
            point.label = `Default Garrison ${index + 1}`;
        });
    });

    const sortedTeamKeys = Object.keys(teams).sort(); 
    
    const sortedGarrisons = sortedTeamKeys.flatMap(key => teams[key]);

    mapData.strongpoints = [...sortedGarrisons, ...otherPoints];
}

// ==========================================
// FINAL INITIALIZATION
// ==========================================

createStickyLabels();
initMapSelector();
renderMapGrid("");

loadState();

if (!MAP_DATABASE[activeMapKey]) {
    activeMapKey = "CAR";
}
applyMapSorting(MAP_DATABASE[activeMapKey]);
currentStrongpoints = MAP_DATABASE[activeMapKey].strongpoints || [];
document.getElementById("currentMapName").innerText = MAP_DATABASE[activeMapKey].name;
updatePageTitle(MAP_DATABASE[activeMapKey].name);
updateFactionUI(MAP_DATABASE[activeMapKey]);
initGarrisonControls();

if (localStorage.getItem('hllGarrisonsMapState') === null) {
    openMapSelector();
}

const imgEl = document.getElementById("mapImage");
imgEl.src = MAP_DATABASE[activeMapKey].image;

const onInitLoadWithRetry = function() {
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

new ResizeObserver(() => { 
    if (imgEl.naturalWidth > 0) {
        updateDimensions(); 
        render(); 
    }
}).observe(mapContainer);


const btnOtherProjects = document.getElementById("btnOtherProjects");
const projectsModal = document.getElementById("projectsModal");
const closeProjectsBtn = document.getElementById("closeProjectsBtn");

if (btnOtherProjects && projectsModal) {
    btnOtherProjects.addEventListener("click", (e) => {
        e.preventDefault();
        projectsModal.classList.add("active");
        btnOtherProjects.blur();
    });

    const closeHub = () => {
        projectsModal.classList.remove("active");
        if (document.activeElement) {
            document.activeElement.blur();
        }
    };

    if (closeProjectsBtn) closeProjectsBtn.onclick = closeHub;

    projectsModal.onclick = (e) => {
        if (e.target === projectsModal) closeHub();
    };
    
    const hubButtons = projectsModal.querySelectorAll('.footer-btn');
    hubButtons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            setTimeout(() => btn.blur(), 0);
        });

        btn.addEventListener('click', () => {
            setTimeout(() => {
                btn.blur();
                if (document.activeElement === btn) btn.blur();
            }, 100);
        });
    });
}


const changelogBtn = document.getElementById("changelogBtn");
const changelogBtnPanel = document.getElementById("changelogBtnPanel");
const changelogModal = document.getElementById("changelogModal");
const closeChangelogBtn = document.getElementById("closeChangelogBtn");
const changelogContent = document.getElementById("changelogContent");

function openChangelog() {
    if (!changelogModal) return;
    changelogModal.classList.add("active");
    loadChangelog();
}

function closeChangelog() {
    if (!changelogModal) return;
    changelogModal.classList.remove("active");
}

async function loadChangelog() {
    if (!changelogContent) return;

    try {
        const response = await fetch("CHANGELOG.md");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        const text = await response.text();
        changelogContent.innerHTML = parseMarkdown(text);
    } catch (error) {
        console.error("Failed to load changelog:", error);
        changelogContent.textContent =
            "Failed to load changelog. Make sure you are running this on a web server (not file:// protocol).";
    }
}

function parseMarkdown(text) {
    let html = text;
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\n\n/g, "<br><br>");
    return html;
}

if (changelogBtn) {
    changelogBtn.addEventListener("click", openChangelog);
}

if (changelogBtnPanel) {
    changelogBtnPanel.addEventListener("click", openChangelog);
}

if (closeChangelogBtn) {
    closeChangelogBtn.addEventListener("click", closeChangelog);
}

if (changelogModal) {
    changelogModal.addEventListener("click", (e) => {
        if (e.target === changelogModal) {
            closeChangelog();
        }
    });
}

window.onfocus = function() {
    document.querySelectorAll('button').forEach(b => b.blur());
};

window.addEventListener('pageshow', (event) => {
    if (event.persisted || document.visibilityState === 'visible') {
        if (document.activeElement) {
            document.activeElement.blur();
        }
        document.querySelectorAll('.footer-btn').forEach(btn => btn.blur());
    }
});

document.addEventListener('keydown', (e) => {
    if (selectedGarrisonId === null) return;

    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    const visibleGarrisons = getVisibleGarrisons();
    if (visibleGarrisons.length === 0) return;

    const currentIndex = visibleGarrisons.findIndex(p => p.id === selectedGarrisonId);
    if (currentIndex === -1) return;

    let newIndex;

    if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + visibleGarrisons.length) % visibleGarrisons.length;
    } else {
        newIndex = (currentIndex + 1) % visibleGarrisons.length;
    }

    const targetPoint = visibleGarrisons[newIndex];

    selectedGarrisonId = targetPoint.id;
    animateToLocation(targetPoint.gameX, targetPoint.gameY, null); 
    renderMarkers();
});

updateVersionDisplays();