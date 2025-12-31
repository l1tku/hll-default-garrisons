// Offensive tacmaps (all entries are offensive mode)
const maps = {
  EBR: { name: "Elsenborn Ridge", webp: "images/maps/TacMap_EBR_L_1944.webp", src: "images/maps/TacMap_EBR_L_1944.webp" },
  MOR: { name: "Mortain", webp: "images/maps/TacMap_MOR_L_1944.webp", src: "images/maps/TacMap_MOR_L_1944.webp" },
  SMO: { name: "Smolensk", webp: "images/maps/TacMap_SMO_L_1943.webp", src: "images/maps/TacMap_SMO_L_1943.webp" },
  TOB: { name: "Tobruk", webp: "images/maps/TacMap_TOB_L_1942.webp", src: "images/maps/TacMap_TOB_L_1942.webp" },
  CAR: { name: "Carentan", webp: "images/maps/map_Carentan.webp", src: "images/maps/map_Carentan.webp" },
  DRI: { name: "Driel", webp: "images/maps/map_driel.webp", src: "images/maps/map_driel.webp" },
  ELA: { name: "El Alamein", webp: "images/maps/map_elalamein.webp", src: "images/maps/map_elalamein.webp" },
  FOY: { name: "Foy", webp: "images/maps/map_foy.webp", src: "images/maps/map_foy.webp" },
  H4:  { name: "Hill 400", webp: "images/maps/map_hill400.webp", src: "images/maps/map_hill400.webp" },
  HUR: { name: "Hurtgen Forest", webp: "images/maps/map_hurtgen.webp", src: "images/maps/map_hurtgen.webp" },
  KHA: { name: "Kharkov", webp: "images/maps/map_kharkov.webp", src: "images/maps/map_kharkov.webp" },
  KUR: { name: "Kursk", webp: "images/maps/map_kursk.webp", src: "images/maps/map_kursk.webp" },
  OMA: { name: "Omaha Beach", webp: "images/maps/map_omaha.webp", src: "images/maps/map_omaha.webp" },
  PHL: { name: "Purple Heart Lane", webp: "images/maps/map_purpleheartlane.webp", src: "images/maps/map_purpleheartlane.webp" },
  REM: { name: "Remagen", webp: "images/maps/map_remagen.webp", src: "images/maps/map_remagen.webp" },
  SMM: { name: "Sainte-Marie-du-Mont", webp: "images/maps/map_smdmv2.webp", src: "images/maps/map_smdmv2.webp" },
  STA: { name: "Stalingrad", webp: "images/maps/map_stalingrad.webp", src: "images/maps/map_stalingrad.webp" },
  SME: { name: "Sainte-Mère-Église", webp: "images/maps/map_stmereeglise.webp", src: "images/maps/map_stmereeglise.webp" },
  UTA: { name: "Utah Beach", webp: "images/maps/map_utahbeach.webp", src: "images/maps/map_utahbeach.webp" }
};

/**
 * Default garrison coordinates per map.
 * x/y are percentages of the map image (0-100).
 * Each map now holds coordinates for both factions.
 */
const garrisonsData = {
  EBR: {
    axis: [
      { label: "New Garrison", x: 26.5764, y: 26.7752 },
      { label: "New Garrison 2", x: 51.6233, y: 24.6752 },
      { label: "New Garrison 3", x: 78.4453, y: 24.5701 }
    ],
    allies: [
      { label: "New Garrison", x: 73.3367, y: 78.0919 },
      { label: "New Garrison 2", x: 54.9684, y: 72.6770 },
      { label: "New Garrison 3", x: 26.3866, y: 77.6348 }
    ]
  },
  MOR: {
    axis: [
      { label: "New Garrison", x: 28.2763, y: 26.2510 },
      { label: "New Garrison 2", x: 26.3828, y: 53.6870 },
      { label: "New Garrison 3", x: 23.4527, y: 77.5821 }
    ],
    allies: [
      { label: "New Garrison", x: 78.7639, y: 22.1362 },
      { label: "New Garrison 2", x: 78.1513, y: 52.4613 },
      { label: "New Garrison 3", x: 77.2142, y: 72.4553 }
    ]
  },
  SMO: {
    allies: [
      { label: "New Garrison", x: 22.8081, y: 27.8282 },
      { label: "New Garrison 2", x: 25.4047, y: 48.0705 },
      { label: "New Garrison 3", x: 24.1763, y: 69.1399 }
    ],
    axis: [
      { label: "New Garrison", x: 75.3313, y: 27.3640 },
      { label: "New Garrison 2", x: 73.3592, y: 49.5776 },
      { label: "New Garrison 3", x: 74.4260, y: 70.3789 }
    ]
  },
  TOB: {
    allies: [
      { label: "New Garrison", x: 25.6834, y: 34.1966 },
      { label: "New Garrison 2", x: 23.6744, y: 49.2122 },
      { label: "New Garrison 3", x: 24.8945, y: 67.3214 }
    ],
    axis: [
      { label: "New Garrison", x: 77.2658, y: 29.6758 },
      { label: "New Garrison 2", x: 74.9141, y: 45.9365 },
      { label: "New Garrison 3", x: 77.2530, y: 72.4699 }
    ]
  },
  CAR: {
    axis: [
      { label: "New Garrison", x: 32.0775, y: 34.6327 },
      { label: "New Garrison 2", x: 36.4559, y: 51.5468 },
      { label: "New Garrison 3", x: 29.1161, y: 65.3169 }
    ],
    allies: [
      { label: "New Garrison", x: 68.5946, y: 32.6029 },
      { label: "New Garrison 2", x: 70.5005, y: 49.4304 },
      { label: "New Garrison 3", x: 63.5202, y: 75.8426 }
    ]
  },
  DRI: {
    axis: [
      { label: "New Garrison", x: 28.8254, y: 68.9080 },
      { label: "New Garrison 2", x: 51.9583, y: 70.4492 },
      { label: "New Garrison 3", x: 72.2985, y: 67.6618 }
    ],
    allies: [
      { label: "New Garrison", x: 30.3190, y: 33.3876 },
      { label: "New Garrison 2", x: 52.7736, y: 29.8291 },
      { label: "New Garrison 3", x: 68.3767, y: 29.6294 }
    ]
  },
  ELA: {
    axis: [
      { label: "New Garrison", x: 73.6436, y: 32.6860 },
      { label: "New Garrison 2", x: 76.4492, y: 45.3327 },
      { label: "New Garrison 3", x: 70.5872, y: 68.9386 }
    ],
    allies: [
      { label: "New Garrison", x: 30.0403, y: 33.1940 },
      { label: "New Garrison 2", x: 29.1255, y: 47.4299 },
      { label: "New Garrison 3", x: 29.5245, y: 68.9015 }
    ]
  },
  FOY: {
    allies: [
      { label: "New Garrison", x: 31.0238, y: 25.8663 },
      { label: "New Garrison 2", x: 43.1917, y: 33.6310 },
      { label: "New Garrison 3", x: 73.7406, y: 31.2951 }
    ],
    axis: [
      { label: "New Garrison", x: 31.1937, y: 62.4359 },
      { label: "New Garrison 2", x: 55.2840, y: 66.2495 },
      { label: "New Garrison 3", x: 72.3515, y: 63.5722 }
    ]
  },
  H4: {
    axis: [
      { label: "New Garrison", x: 29.3660, y: 26.2411 },
      { label: "New Garrison 2", x: 32.4670, y: 55.2356 },
      { label: "New Garrison 3", x: 29.4358, y: 64.7351 }
    ],
    allies: [
      { label: "New Garrison", x: 63.7967, y: 31.6612 },
      { label: "New Garrison 2", x: 63.9266, y: 48.7657 },
      { label: "New Garrison 3", x: 67.6321, y: 72.4510 }
    ]
  },
  HUR: {
    axis: [
      { label: "New Garrison", x: 29.3849, y: 26.2402 },
      { label: "New Garrison 2", x: 32.4577, y: 55.2593 },
      { label: "New Garrison 3", x: 29.4254, y: 64.4697 }
    ],
    allies: [
      { label: "New Garrison", x: 60.7959, y: 37.8016 },
      { label: "New Garrison 2", x: 66.7795, y: 54.9569 },
      { label: "New Garrison 3", x: 64.9551, y: 77.2430 }
    ]
  },
  KHA: {
    axis: [
      { label: "New Garrison", x: 34.9850, y: 20.4737 },
      { label: "New Garrison 2", x: 56.5151, y: 20.0707 },
      { label: "New Garrison 3", x: 76.9114, y: 23.2100 }
    ],
    allies: [
      { label: "New Garrison", x: 28.6739, y: 78.9722 },
      { label: "New Garrison 2", x: 53.8057, y: 79.0704 },
      { label: "New Garrison 3", x: 69.1915, y: 78.1189 }
    ]
  },
  KUR: {
    axis: [
      { label: "New Garrison", x: 33.6533, y: 24.4179 },
      { label: "New Garrison 2", x: 52.3938, y: 21.7314 },
      { label: "New Garrison 3", x: 74.7527, y: 20.6189 }
    ],
    allies: [
      { label: "New Garrison", x: 36.6365, y: 74.7925 },
      { label: "New Garrison 2", x: 50.0941, y: 74.4242 },
      { label: "New Garrison 3", x: 66.3864, y: 75.8449 }
    ]
  },
  OMA: {
    allies: [
      { label: "New Garrison", x: 21.0942, y: 34.3431 },
      { label: "New Garrison 2", x: 20.7194, y: 48.9125 },
      { label: "New Garrison 3", x: 21.0616, y: 66.7241 }
    ],
    axis: [
      { label: "New Garrison", x: 78.0468, y: 26.6036 },
      { label: "New Garrison 2", x: 77.4488, y: 45.8406 },
      { label: "New Garrison 3", x: 71.5673, y: 67.8883 }
    ]
  },
  PHL: {
    axis: [
      { label: "New Garrison", x: 29.4218, y: 31.7287 },
      { label: "New Garrison 2", x: 48.1351, y: 34.8851 },
      { label: "New Garrison 3", x: 68.5690, y: 33.4797 }
    ],
    allies: [
      { label: "New Garrison", x: 33.6231, y: 62.8173 },
      { label: "New Garrison 2", x: 48.9657, y: 64.2756 },
      { label: "New Garrison 3", x: 77.5020, y: 61.5952 }
    ]
  },
  REM: {
    allies: [
      { label: "New Garrison", x: 28.2594, y: 28.5719 },
      { label: "New Garrison 2", x: 52.6297, y: 26.0786 },
      { label: "New Garrison 3", x: 68.2245, y: 29.0742 }
    ],
    axis: [
      { label: "New Garrison", x: 33.2534, y: 69.5042 },
      { label: "New Garrison 2", x: 50.9749, y: 71.5767 },
      { label: "New Garrison 3", x: 69.2615, y: 68.4195 }
    ]
  },
  SMM: {
    axis: [
      { label: "New Garrison", x: 31.3531, y: 32.9404 },
      { label: "New Garrison 2", x: 51.3946, y: 32.3620 },
      { label: "New Garrison 3", x: 64.4658, y: 30.6766 }
    ],
    allies: [
      { label: "New Garrison", x: 30.4593, y: 66.4874 },
      { label: "New Garrison 2", x: 51.1316, y: 70.2952 },
      { label: "New Garrison 3", x: 71.7253, y: 63.9113 }
    ]
  },
  STA: {
    allies: [
      { label: "New Garrison", x: 27.4142, y: 24.5372 },
      { label: "New Garrison 2", x: 23.8895, y: 55.2424 },
      { label: "New Garrison 3", x: 24.7630, y: 76.2281 }
    ],
    axis: [
      { label: "New Garrison", x: 78.6803, y: 29.2218 },
      { label: "New Garrison 2", x: 77.4140, y: 50.1327 },
      { label: "New Garrison 3", x: 78.7988, y: 67.8971 }
    ]
  },
  SME: {
    allies: [
      { label: "New Garrison", x: 32.2965, y: 28.0727 },
      { label: "New Garrison 2", x: 36.0324, y: 40.7232 },
      { label: "New Garrison 3", x: 33.9574, y: 69.5006 }
    ],
    axis: [
      { label: "New Garrison", x: 69.7825, y: 35.2163 },
      { label: "New Garrison 2", x: 68.4197, y: 52.5084 },
      { label: "New Garrison 3", x: 71.8347, y: 71.3896 }
    ]
  },
  UTA: {
    allies: [
      { label: "New Garrison", x: 28.1592, y: 25.1906 },
      { label: "New Garrison 2", x: 26.8216, y: 50.0068 },
      { label: "New Garrison 3", x: 23.7690, y: 75.6686 }
    ],
    axis: [
      { label: "New Garrison", x: 76.8213, y: 27.7427 },
      { label: "New Garrison 2", x: 78.2830, y: 50.2344 },
      { label: "New Garrison 3", x: 71.2563, y: 69.7611 }
    ]
  }
};

const FACTION_FLAG_PATHS = {
  us: "images/flags/us.png",
  gb: "images/flags/gb.png",
  ger: "images/flags/ger.png",
  soviet: "images/flags/rus.png"
};

const factionFlags = {
  CAR: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  DRI: { allies: FACTION_FLAG_PATHS.gb, axis: FACTION_FLAG_PATHS.ger },
  EBR: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  ELA: { allies: FACTION_FLAG_PATHS.gb, axis: FACTION_FLAG_PATHS.ger },
  FOY: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  H4:  { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  HUR: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  KHA: { allies: FACTION_FLAG_PATHS.soviet, axis: FACTION_FLAG_PATHS.ger },
  KUR: { allies: FACTION_FLAG_PATHS.soviet, axis: FACTION_FLAG_PATHS.ger },
  MOR: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  OMA: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  PHL: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  REM: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  SMM: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  SME: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger },
  SMO: { allies: FACTION_FLAG_PATHS.soviet, axis: FACTION_FLAG_PATHS.ger },
  STA: { allies: FACTION_FLAG_PATHS.soviet, axis: FACTION_FLAG_PATHS.ger },
  TOB: { allies: FACTION_FLAG_PATHS.gb, axis: FACTION_FLAG_PATHS.ger },
  UTA: { allies: FACTION_FLAG_PATHS.us, axis: FACTION_FLAG_PATHS.ger }
};

function getFactionFlag(mapKey, faction) {
  return factionFlags[mapKey]?.[faction] ?? null;
}

// --- FACTION STATE ---
let currentFaction = "all";

// --- DOM ELEMENTS ---
const mapSelect = document.getElementById("mapSelect");
const mapImage = document.getElementById("mapImage");
const mapSourceWebp = document.getElementById("mapSourceWebp");
const mapStage = document.getElementById("mapStage");
const markersContainer = document.getElementById("markers");
const mapLoader = document.getElementById("mapLoader");
const gridOverlay = document.getElementById("gridOverlay");
const btnAxis = document.getElementById("btnAxis");
const btnAllies = document.getElementById("btnAllies");
const btnAllFactions = document.getElementById("btnAllFactions");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebar = document.getElementById("utilitySidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const spaCalculatorBtn = document.getElementById("spaCalculatorBtn");

// --- NAVIGATION STATE ---
let visibleMarkersList = []; // Stores objects { x, y, label, element }
let currentMarkerIndex = -1;

const scaleWrapper = document.getElementById("scaleWrapper");
const scaleText10m = document.getElementById("scaleText10m");
const scaleTextMid = document.getElementById("scaleTextMid");
const scaleTextEnd = document.getElementById("scaleTextEnd");
const zoomLevelIndicator = document.getElementById("zoomLevelIndicator");

// --- SCALE LOGIC CONFIGURATION ---
const MAP_REAL_WIDTH_METERS = 2000;
const ALLOWED_SCALES = [500, 250, 200, 100, 50, 25, 20, 10];

const LAST_MAP_STORAGE_KEY = "hll-last-map";
const mapOrder = Object.entries(maps).sort((a, b) => a[1].name.localeCompare(b[1].name));
const storedMapKey = localStorage.getItem(LAST_MAP_STORAGE_KEY);
let currentMapKey = storedMapKey && maps[storedMapKey] ? storedMapKey : mapOrder[0][0];

function populateSelect() {
  mapOrder.forEach(([key, { name }]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = name;
    mapSelect.appendChild(option);
  });
}

function updateFactionButtons() {
  if (!btnAxis || !btnAllies || !btnAllFactions) return;
  [btnAxis, btnAllies, btnAllFactions].forEach(btn => btn.classList.remove("active"));

  switch (currentFaction) {
    case "axis":
      btnAxis.classList.add("active");
      break;
    case "allies":
      btnAllies.classList.add("active");
      break;
    default:
      btnAllFactions.classList.add("active");
  }
}

if (btnAxis && btnAllies && btnAllFactions) {
  btnAxis.addEventListener("click", () => {
    if (currentFaction === "axis") return;
    currentFaction = "axis";
    updateFactionButtons();
    renderMap(mapSelect.value);
  });

  btnAllies.addEventListener("click", () => {
    if (currentFaction === "allies") return;
    currentFaction = "allies";
    updateFactionButtons();
    renderMap(mapSelect.value);
  });

  btnAllFactions.addEventListener("click", () => {
    if (currentFaction === "all") return;
    currentFaction = "all";
    updateFactionButtons();
    renderMap(mapSelect.value);
  });
}

updateFactionButtons();

// Get reference to the loader
function renderMap(mapKey) {
currentMapKey = mapKey;
const map = maps[mapKey];
if (!map) return;

if (mapSelect && mapSelect.value !== mapKey) {
mapSelect.value = mapKey;
}
localStorage.setItem(LAST_MAP_STORAGE_KEY, mapKey);

// 1. SHOW LOADING SCREEN
if (mapLoader) mapLoader.classList.add("visible");

// 2. Clear previous markers & Reset State
markersContainer.innerHTML = "";
markersContainer.classList.remove("has-selection");
visibleMarkersList = [];
currentMarkerIndex = -1;

// 3. DEFINE LOAD HANDLERS
const onMapLoaded = () => {
if (mapLoader) mapLoader.classList.remove("visible");
updateCache();
initMapLogic();
};

const onMapError = () => {
console.warn("Map image failed to load or is missing.");
if (mapLoader) mapLoader.classList.remove("visible");
};

mapImage.onload = null;
mapImage.onerror = null;
mapImage.onload = onMapLoaded;
mapImage.onerror = onMapError;

// Safety Timeout
setTimeout(() => {
if (mapLoader && mapLoader.classList.contains("visible")) {
mapLoader.classList.remove("visible");
}
}, 3000);

// 4. SET IMAGE SOURCES
  mapImage.loading = "eager";
  mapImage.decoding = "auto"; 
  mapImage.fetchPriority = "high";

if (map.webp) mapSourceWebp.srcset = map.webp;
mapImage.src = map.webp;
mapImage.alt = map.name;

// 6. Prepare Points Data
const mapData = garrisonsData[mapKey];
let points = [];
  
if (mapData) {
const axisPoints = (mapData.axis || []).map((p, i) => ({ ...p, label: `Axis Default ${i + 1}`, faction: "axis" }));
const alliesPoints = (mapData.allies || []).map((p, i) => ({ ...p, label: `Allies Default ${i + 1}`, faction: "allies" }));

if (currentFaction === "all") points = [...axisPoints, ...alliesPoints];
else points = currentFaction === "axis" ? axisPoints : alliesPoints;
}

// 7. Render Markers
points.forEach((point, index) => {
const marker = document.createElement("div");
marker.className = "marker";

// --- BUTTON HELPER: Makes buttons snap instantly on mobile ---
const bindQuickAction = (btn, action) => {
// Touch: Fire on lift, prevent ghost clicks, stop bubbling
btn.addEventListener("touchend", (e) => {
e.preventDefault(); 
e.stopPropagation();
action();
}, { passive: false });
        
// Mouse: Standard click
btn.onclick = (e) => {
e.stopPropagation();
action();
};
        
// Stop touchstart from dragging the map when hitting buttons
btn.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: false });
};

// Icon
const icon = document.createElement("img");
icon.src = "images/ui/icn_garrison_shadow_green.png";
icon.alt = point.label;
marker.appendChild(icon);

// Inner 15m radius circle
const innerRadius = document.createElement("div");
innerRadius.className = "inner-radius";
marker.appendChild(innerRadius);

// Label with Buttons
const labelDiv = document.createElement("div");
labelDiv.className = "marker-label";

// PREV BUTTON
const prevBtn = document.createElement("button");
prevBtn.className = "nav-arrow prev";
prevBtn.innerHTML = "&#10094;";
bindQuickAction(prevBtn, () => {
const prevIndex = index === 0 ? points.length - 1 : index - 1;
selectGarrisonByIndex(prevIndex, false, true);
});

const textSpan = document.createElement("span");
textSpan.className = "label-text";

const flagSrc = getFactionFlag(mapKey, point.faction);
if (flagSrc) {
const flagImg = document.createElement("img");
flagImg.src = flagSrc;
flagImg.className = "label-flag";
textSpan.appendChild(flagImg);
}

const labelCopy = document.createElement("span");
labelCopy.className = "label-copy";
labelCopy.textContent = point.label;
textSpan.appendChild(labelCopy);

// NEXT BUTTON
const nextBtn = document.createElement("button");
nextBtn.className = "nav-arrow next";
nextBtn.innerHTML = "&#10095;";
bindQuickAction(nextBtn, () => {
const nextIndex = index === points.length - 1 ? 0 : index + 1;
selectGarrisonByIndex(nextIndex, false, true);
});

labelDiv.appendChild(prevBtn);
labelDiv.appendChild(textSpan);
labelDiv.appendChild(nextBtn);
marker.appendChild(labelDiv);

// --- MARKER INTERACTION (Tap & Double Tap) ---
    
// Stop map drag when touching marker
marker.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: false });
marker.addEventListener("touchmove", (e) => e.stopPropagation(), { passive: false });

// Mobile: Handle Tap & Double Tap Manually
let lastTapTime = 0;
marker.addEventListener("touchend", (e) => {
e.preventDefault(); // Stop ghost mouse clicks
e.stopPropagation();

const currentTime = new Date().getTime();
const tapLength = currentTime - lastTapTime;

// Always select on tap
activateMarkerVisuals(index, marker);

// Detect Double Tap (Speed < 300ms)
if (tapLength < 300 && tapLength > 0) {
selectGarrisonByIndex(index, true, false); // Zoom in
lastTapTime = 0;
} else {
lastTapTime = currentTime;
}
});

// Desktop: Click & Double Click
let clickCount = 0;
let clickTimer = null;
marker.addEventListener("click", (evt) => {
evt.stopPropagation();
clickCount++;
      
activateMarkerVisuals(index, marker);

if (clickCount === 1) {
clickTimer = setTimeout(() => { clickCount = 0; }, 300);
} else if (clickCount === 2) {
clearTimeout(clickTimer);
clickCount = 0;
selectGarrisonByIndex(index, true, false); // Zoom in
}
});

markersContainer.appendChild(marker);

visibleMarkersList.push({
xPct: point.x,
yPct: point.y,
element: marker
});
});

requestRender();
}

// Helper to update visuals without Logic (used in taps)
function activateMarkerVisuals(index, markerElement) {
currentMarkerIndex = index;
markersContainer.classList.add("has-selection");
visibleMarkersList.forEach(item => item.element.classList.remove("active"));
markerElement.classList.add("active");
}

function buildGridOverlay() {
  if (!gridOverlay) return;
  gridOverlay.innerHTML = "";
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "grid-svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");

  const createLine = (x1, y1, x2, y2, isSubgrid) => {
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("class", isSubgrid ? "subgrid-line" : "grid-line");
    return line;
  };

  for (let i = 1; i < 10; i++) {
    svg.appendChild(createLine(i * 10, 0, i * 10, 100, false));
    svg.appendChild(createLine(0, i * 10, 100, i * 10, false));
  }

  for (let i = 1; i < 30; i++) {
    if (i % 3 === 0) continue;
    const pos = i * (10 / 3);
    svg.appendChild(createLine(pos, 0, pos, 100, true));
    svg.appendChild(createLine(0, pos, 100, pos, true));
  }

  const labelContainer = document.createElement("div");
  labelContainer.className = "grid-labels";
  const letters = "ABCDEFGHIJ".split("");

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.className = "grid-label-cell";
      
      let labelText = "";
      if (row === 0 && col === 0) labelText = "A1";
      else if (row === 0) labelText = letters[col];
      else if (col === 0) labelText = (row + 1).toString();

      if (labelText) {
        const span = document.createElement("span");
        span.className = "grid-label-text";
        span.textContent = labelText;
        cell.appendChild(span);
      }

      labelContainer.appendChild(cell);
    }
  }

  gridOverlay.appendChild(svg);
  gridOverlay.appendChild(labelContainer);
}

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const storedTheme = localStorage.getItem("hll-theme");

function applyTheme(theme) {
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
    themeToggle.textContent = "Switch to Dark mode";
  } else {
    root.removeAttribute("data-theme");
    themeToggle.textContent = "Switch to Light mode";
  }
  localStorage.setItem("hll-theme", theme);
}

const preferred = storedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
applyTheme(preferred);

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
});

// --- SIDEBAR LOGIC ---
const SIDEBAR_OPEN_CLASS = "sidebar-open";
const SPA_CALCULATOR_URL = "https://l1tku.github.io/hll-spa-calculator/";

function openSidebar() {
  document.body.classList.add(SIDEBAR_OPEN_CLASS);
  sidebar?.setAttribute("aria-hidden", "false");
  sidebarToggle?.setAttribute("aria-expanded", "true");
  sidebarBackdrop?.removeAttribute("hidden");
}

function closeSidebar() {
  document.body.classList.remove(SIDEBAR_OPEN_CLASS);
  sidebar?.setAttribute("aria-hidden", "true");
  sidebarToggle?.setAttribute("aria-expanded", "false");
  sidebarBackdrop?.setAttribute("hidden", "");
}

sidebarToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.contains(SIDEBAR_OPEN_CLASS);
  if (isOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

sidebarClose?.addEventListener("click", closeSidebar);
sidebarBackdrop?.addEventListener("click", closeSidebar);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.body.classList.contains(SIDEBAR_OPEN_CLASS)) {
    closeSidebar();
  }
});

spaCalculatorBtn?.addEventListener("click", () => {
  window.open(SPA_CALCULATOR_URL, "_blank", "noopener");
});

// --- ZOOM & PAN & SCALE LOGIC (OPTIMIZED) ---

// 1. State Variables
let currentZoomLevel = 1; 
const MIN_LEVEL = 1;
let maxLevel = 10; // Changed from const MAX_LEVEL to let variable
let baseZoom = 1.0; 

// Pan Variables
let panX = 0;
let panY = 0;
let isDragging = false;
let suppressNextMapClick = false;
let startMouseX = 0;
let startMouseY = 0;
let lastPanX = 0;
let lastPanY = 0;

// --- IMPROVED DRAG LOGIC ---
// New variable to track if we actually moved
let hasMoved = false;
const DRAG_THRESHOLD = 5; // Pixels to move before counting as a drag

// Rendering State
let isRenderPending = false;
let zoomTransitionTimeout = null;
let mapClickListenerAttached = false;

// --- CALIBRATION SETTINGS ---
const ANCHOR_OFFSET_X = 0;
const ANCHOR_OFFSET_Y = -6;

// 2. Caching Dimensions (Prevents Layout Thrashing)
// We store these so we don't query the DOM during a drag event
const cache = {
  containerW: 0,
  containerH: 0,
  mapW: 0,
  mapH: 0,
  rectLeft: 0,
  rectTop: 0
};

// Update cache on resize, map load, or init
function updateCache() {
  const containerRect = mapStage.parentElement.getBoundingClientRect();
  cache.containerW = containerRect.width;
  cache.containerH = containerRect.height;
  cache.rectLeft = containerRect.left;
  cache.rectTop = containerRect.top;

  // We need the unscaled dimensions of the image
  cache.mapW = mapImage.offsetWidth;
  cache.mapH = mapImage.offsetHeight;

  // --- DYNAMIC MAX ZOOM CALCULATION ---
  // A standard desktop view is roughly 1200px wide.
  // If the current screen is 400px (mobile), we need 3x more zoom 
  // to reach the same level of detail as desktop.
  const referenceWidth = 1200; 
  if (cache.containerW > 0) {
    const ratio = referenceWidth / cache.containerW;
    // Base max is 10. On mobile, this might become 10 * 3 = 30.
    // We cap it at 50x to prevent getting lost in pixels.
    maxLevel = Math.max(10, Math.min(50, 10 * ratio));
  }
}

function getEffectiveZoom() {
  return baseZoom * currentZoomLevel;
}

// 3. The Math (Calculates limits based on Cache, not DOM)
function clampPosition() {
  const effectiveZoom = getEffectiveZoom();
  const currentMapW = cache.mapW * effectiveZoom;
  const currentMapH = cache.mapH * effectiveZoom;

  const diffW = cache.containerW - currentMapW;
  const diffH = cache.containerH - currentMapH;

  // If map is smaller than container, center it. 
  // If larger, clamp edges.
  if (diffW >= 0) panX = diffW / 2;
  else panX = Math.min(0, Math.max(panX, diffW));

  if (diffH >= 0) panY = diffH / 2;
  else panY = Math.min(0, Math.max(panY, diffH));
}

// 4. The Renderer (Uses requestAnimationFrame)
function requestRender() {
  if (!isRenderPending) {
    isRenderPending = true;
    requestAnimationFrame(renderTransform);
  }
}

function renderTransform() {
  const effectiveZoom = getEffectiveZoom();
  
  // 1. Update Map Stage
  mapStage.style.setProperty("--zoom", effectiveZoom);
  mapStage.style.setProperty("--pan-x", `${panX.toFixed(2)}px`);
  mapStage.style.setProperty("--pan-y", `${panY.toFixed(2)}px`);
  
  // 2. Calculate & Apply 50m Danger Radius
  // Logic: The map represents MAP_REAL_WIDTH_METERS (2000m).
  // The danger circle represents a 50m radius, which is a 50m diameter.
  // So the diameter in pixels = (Current Map Width in Pixels) * (50 / 2000).
  if (cache.mapW > 0) {
    // 50m is the diameter of the 50m radius circle
    const diameterInMeters = 50; 
    // Calculate the ratio of the circle size to the full map size
    const sizeRatio = diameterInMeters / MAP_REAL_WIDTH_METERS; // 50 / 2000 = 0.025
    
    // Calculate exact pixel size at current zoom
    const dangerRadiusPx = (cache.mapW * effectiveZoom) * sizeRatio;
    
    markersContainer.style.setProperty('--danger-radius', `${dangerRadiusPx.toFixed(1)}px`);
    
    // Calculate 15m inner radius (15m diameter)
    const innerDiameterInMeters = 15;
    const innerSizeRatio = innerDiameterInMeters / MAP_REAL_WIDTH_METERS; // 15 / 2000 = 0.0075
    const innerRadiusPx = (cache.mapW * effectiveZoom) * innerSizeRatio;
    
    markersContainer.style.setProperty('--inner-radius', `${innerRadiusPx.toFixed(1)}px`);
  }
  
  // 3. PERFORMANCE FIX: 
  // Only recalculate text scale if we are NOT actively scrolling.
  // This prevents the 3s lag spike.
  if (!document.body.classList.contains("is-interacting")) {
      const inverse = (1 / effectiveZoom).toFixed(4);
      mapStage.style.setProperty("--inverse-zoom", inverse);
  }

  // 4. Update Markers (Standard logic)
  if (visibleMarkersList.length > 0 && cache.mapW > 0) {
    for (let i = 0; i < visibleMarkersList.length; i++) {
      const m = visibleMarkersList[i];
      const mapPxX = (m.xPct / 100) * cache.mapW;
      const mapPxY = (m.yPct / 100) * cache.mapH;
      const screenX = (mapPxX * effectiveZoom) + panX;
      const screenY = (mapPxY * effectiveZoom) + panY;
      
      m.element.style.transform = `
        translate3d(${screenX}px, ${screenY}px, 0) 
        translate(-50%, -50%) 
        translate(${ANCHOR_OFFSET_X}px, ${ANCHOR_OFFSET_Y}px)
      `;
    }
  }

  updateRealScale(effectiveZoom);
  isRenderPending = false;
}

function updateRealScale(effectiveZoom) {
  // Use cached map width
  const currentMapWidthPx = cache.mapW * effectiveZoom;
  if (currentMapWidthPx <= 0) return;

  const metersPerPixel = MAP_REAL_WIDTH_METERS / currentMapWidthPx;
  
  // Mobile-specific: Reduce max scale width on smaller screens
  const isMobile = window.innerWidth <= 768;
  const maxAllowedWidthPx = isMobile ? 150 : 250; // Smaller on mobile
  
  const maxCapacity = metersPerPixel * maxAllowedWidthPx;
  
  // Find the largest scale value that fits
  let selectedScale = ALLOWED_SCALES.find(scale => scale <= maxCapacity);
  if (selectedScale === undefined) selectedScale = ALLOWED_SCALES[ALLOWED_SCALES.length - 1];

  const drawnWidth = selectedScale / metersPerPixel;
  
  // Direct DOM updates (low cost compared to layout reflows)
  scaleWrapper.style.width = `${drawnWidth}px`;
  scaleTextEnd.textContent = `${selectedScale}m`;
  scaleTextMid.textContent = `${selectedScale / 2}m`;
  
  // Update 10m text and position - calculate proportional position
  const tenMeterPosition = 10 / metersPerPixel; // 10m in pixels
  const tenMeterPercentage = (10 / selectedScale) * 100; // 10m as percentage of total scale
  
  // Only show 10m indicator when zoom level is exactly 10x and not on mobile
  if (scaleText10m && effectiveZoom === 10 && !isMobile) {
    scaleText10m.textContent = '10m';
    scaleText10m.style.display = 'block';
    scaleText10m.style.left = '20%'; // 10m is 20% of 50m scale
    
    // Also update the tick position
    const tick10m = document.querySelector('.t-10m');
    if (tick10m) {
      tick10m.style.display = 'block';
      tick10m.style.left = '20%';
    }
  } else if (scaleText10m) {
    scaleText10m.style.display = 'none';
    const tick10m = document.querySelector('.t-10m');
    if (tick10m) {
      tick10m.style.display = 'none';
    }
  }
}

// 5. Input Handlers

// ZOOM
function triggerZoomTransition() {
  if (!mapStage) return;
  mapStage.classList.add("zoom-transition");
  if (zoomTransitionTimeout) clearTimeout(zoomTransitionTimeout);
  zoomTransitionTimeout = setTimeout(() => {
    mapStage.classList.remove("zoom-transition");
    zoomTransitionTimeout = null;
  }, 260);
}

// Helper: Performance Mode
function startInteraction() {
  document.body.classList.add("is-interacting");
}
function stopInteraction() {
  document.body.classList.remove("is-interacting");
  requestRender();
}

// UPDATE setZoomLevel to handle Floats
function setZoomLevel(newLevel, mouseX = null, mouseY = null, options = {}) {
  const prevZoom = getEffectiveZoom();
  
  // UPDATED: Use 'maxLevel' variable instead of 'MAX_LEVEL' constant
  currentZoomLevel = Math.max(MIN_LEVEL, Math.min(maxLevel, newLevel));
  
  const newZoom = getEffectiveZoom();

  // Logic for Grid Detail
  if (currentZoomLevel >= 4) gridOverlay.classList.add('detailed-grid');
  else gridOverlay.classList.remove('detailed-grid');

  if (zoomLevelIndicator) zoomLevelIndicator.textContent = `${currentZoomLevel.toFixed(1)}x`;

  const focusWorldPoint = options.focusWorldPoint;
  if (focusWorldPoint) {
       if (!cache.containerW) updateCache();
       const tX = focusWorldPoint.targetScreenX ?? (cache.containerW / 2);
       const tY = focusWorldPoint.targetScreenY ?? (cache.containerH / 2);
       panX = tX - (focusWorldPoint.worldX * newZoom);
       panY = tY - (focusWorldPoint.worldY * newZoom);
  } else if (mouseX !== null) {
       const worldX = (mouseX - panX) / prevZoom;
       const worldY = (mouseY - panY) / prevZoom;
       panX = mouseX - (worldX * newZoom);
       panY = mouseY - (worldY * newZoom);
  }
  
  clampPosition();
  requestRender();
}

function focusOnMapPoint(xPercent, yPercent, targetLevel = 6, animate = true) {
  if (!cache.mapW || !cache.mapH) updateCache();
  if (!cache.mapW || !cache.mapH) return;

  const worldX = (xPercent / 100) * cache.mapW;
  const worldY = (yPercent / 100) * cache.mapH;

  // Only play the sliding animation if 'animate' is true
  if (animate) {
    triggerZoomTransition();
  } else {
    // If not animating, ensure we remove the class instantly to prevent lag
    if (mapStage) mapStage.classList.remove("zoom-transition");
  }

  setZoomLevel(targetLevel, null, null, { 
    focusWorldPoint: { 
      worldX, 
      worldY, 
      targetScreenX: cache.containerW / 2, 
      targetScreenY: cache.containerH / 2 
    } 
  });
}

// --- DESKTOP MOUSE INTERACTION (Simple & Reliable) ---
const mapContainer = mapStage.parentElement;

mapContainer.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return; // Only Left Click
  e.preventDefault();
  isDragging = false;
  hasMoved = false;
  startMouseX = e.clientX;
  startMouseY = e.clientY;
  lastPanX = panX;
  lastPanY = panY;
  mapContainer.classList.add("dragging");
});

window.addEventListener("mousemove", (e) => {
  if (!mapContainer.classList.contains("dragging")) return;
  e.preventDefault();

  const deltaX = e.clientX - startMouseX;
  const deltaY = e.clientY - startMouseY;

  if (!hasMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
    hasMoved = true;
    isDragging = true;
    // Optimization: Hide grid lines while dragging
    startInteraction();
  }

  if (isDragging) {
    panX = lastPanX + deltaX;
    panY = lastPanY + deltaY;
    clampPosition();
    requestRender();
  }
});

window.addEventListener("mouseup", () => {
  if (mapContainer.classList.contains("dragging")) {
    mapContainer.classList.remove("dragging");
    
    // Stop the "Interaction Mode" (Show grid lines again)
    stopInteraction();

    if (hasMoved) {
      suppressNextMapClick = true;
      setTimeout(() => { suppressNextMapClick = false; }, 50);
    }
    isDragging = false;
    hasMoved = false;
  }
});

// --- MOBILE TOUCH INTERACTION (Pan & Pinch-to-Zoom) ---
let initialPinchDistance = null;
let lastZoomCenter = null;

mapContainer.addEventListener("touchstart", (e) => {
  // 1 Finger: Pan Start
  if (e.touches.length === 1) {
      isDragging = false;
      hasMoved = false;
      startMouseX = e.touches[0].clientX;
      startMouseY = e.touches[0].clientY;
      lastPanX = panX;
      lastPanY = panY;
      initialPinchDistance = null;
  } 
  // 2 Fingers: Pinch Start
  else if (e.touches.length === 2) {
      initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
      );
      // Calculate center for zoom anchor
      lastZoomCenter = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
  }
}, { passive: false });

mapContainer.addEventListener("touchmove", (e) => {
  // PREVENT BROWSER SCROLLING (Crucial)
  e.preventDefault(); 

  // CASE 1: Pan (1 Finger)
  if (e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - startMouseX;
      const deltaY = e.touches[0].clientY - startMouseY;

      if (!hasMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
          hasMoved = true;
          isDragging = true;
          startInteraction();
      }

      if (isDragging) {
          panX = lastPanX + deltaX;
          panY = lastPanY + deltaY;
          
          // Debounce the heavy render
          requestAnimationFrame(() => {
              clampPosition();
              renderTransform();
          });
      }
  }
  // CASE 2: Pinch Zoom (2 Fingers)
  else if (e.touches.length === 2 && initialPinchDistance !== null) {
      const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
      );

      if (initialPinchDistance > 0) {
          const diff = currentDistance - initialPinchDistance;
          
          // Sensitivity (Lower = slower zoom)
          const zoomSpeed = 0.02; 
          
          if (Math.abs(diff) > 2) {
              // Determine Zoom Direction
              const newZoom = currentZoomLevel + (diff * zoomSpeed);
              
              // Hide grid lines
              startInteraction();
              
              // Get map container offset for accurate centering
              const rect = mapContainer.getBoundingClientRect();
              const zoomX = lastZoomCenter.x - rect.left;
              const zoomY = lastZoomCenter.y - rect.top;

              setZoomLevel(newZoom, zoomX, zoomY);
              
              // Reset distance so zoom is incremental (smooth)
              initialPinchDistance = currentDistance;
          }
      }
  }
}, { passive: false });

// --- REPLACE THE "touchend" LISTENER WITH THIS ---

let lastMapTap = 0; // Track double-taps on the background

mapContainer.addEventListener("touchend", (e) => {
  // 1. Handle Double Tap on Background (Zoom In)
  // Only trigger if we are lifting the last finger (touches === 0)
  // AND we haven't been dragging/panning (!hasMoved)
  // AND we weren't pinching (!initialPinchDistance)
  if (e.touches.length === 0 && !hasMoved && initialPinchDistance === null) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastMapTap;

      if (tapLength < 300 && tapLength > 0) {
          // Double Tap Detected!
          e.preventDefault(); // Stop browser zoom

          // Calculate where the user tapped relative to the map container
          const rect = mapContainer.getBoundingClientRect();
          const touch = e.changedTouches[0];
          const tapX = touch.clientX - rect.left;
          const tapY = touch.clientY - rect.top;

          // Zoom logic: Zoom in 2.5x, up to the Max Level
          // UPDATED: Use maxLevel variable
          const targetZoom = Math.min(maxLevel, currentZoomLevel * 2.5);
          
          setZoomLevel(targetZoom, tapX, tapY);
          
          lastMapTap = 0; // Reset
      } else {
          lastMapTap = currentTime; // Record single tap time
      }
  }

  // 2. Reset Interaction State (Existing Logic)
  if (e.touches.length === 0) {
      stopInteraction();
      
      if (hasMoved) {
          suppressNextMapClick = true;
          setTimeout(() => { suppressNextMapClick = false; }, 50);
      }
      isDragging = false;
      hasMoved = false;
      // Reset pinch distance so next touch starts fresh
      // (We reset it here to ensure the check above works correctly)
      initialPinchDistance = null; 
  }
  
  // Reset pan start if dropping from 2 fingers to 1
  if (e.touches.length === 1) {
      startMouseX = e.touches[0].clientX;
      startMouseY = e.touches[0].clientY;
      lastPanX = panX;
      lastPanY = panY;
  }
});

// Desktop Wheel Zoom
mapContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  mapStage.classList.remove("zoom-transition");
  startInteraction();
  
  const direction = e.deltaY > 0 ? -1 : 1;
  const newZoom = currentZoomLevel + (direction * 0.5); 
  
  const mouseX = e.clientX - cache.rectLeft;
  const mouseY = e.clientY - cache.rectTop;
  
  setZoomLevel(newZoom, mouseX, mouseY);
  
  // Auto-stop interaction after scroll stops
  setTimeout(stopInteraction, 150);
}, { passive: false });

// RESIZE OBSERVER (Better than window.resize)
const resizeObserver = new ResizeObserver(() => {
  updateCache();
  clampPosition();
  requestRender();
});
resizeObserver.observe(mapStage.parentElement);


// 6. Initialization
function initMapLogic() {
  if (mapImage.complete && mapImage.naturalWidth > 0) {
    updateCache();
    // Center map initially
    setZoomLevel(1); 
    // Manual center if desired:
    const effectiveZoom = getEffectiveZoom();
    panX = (cache.containerW - (cache.mapW * effectiveZoom)) / 2;
    panY = (cache.containerH - (cache.mapH * effectiveZoom)) / 2;
    
    clampPosition();
    requestRender();
  } else {
    mapImage.onload = () => {
      updateCache();
      initMapLogic();
    };
  }
}

// Hook into existing selection logic
mapSelect.addEventListener("change", (e) => {
  renderMap(e.target.value);
  // Give the browser a moment to paint the new image frame before calculating dims
  requestAnimationFrame(() => {
     updateCache();
     initMapLogic();
  });
});

// --- EXECUTE ---
populateSelect();
if (mapSelect) {
  mapSelect.value = currentMapKey;
}
buildGridOverlay();
// Initial Load
renderMap(currentMapKey);
// Wait for image to load before initializing logic
mapImage.addEventListener('load', () => {
    updateCache();
    initMapLogic();
}, { once: true });

// Prevent context menu and save image on map
document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('.map-image, .map-stage, .map-wrap')) {
    e.preventDefault();
    return false;
  }
});

// Prevent long-press save image on mobile (more targeted listener)
if (mapImage) {
  mapImage.addEventListener('touchstart', (e) => {
    e.preventDefault();
  }, { passive: false });
}

document.addEventListener('selectstart', (e) => {
  if (e.target && typeof e.target.closest === 'function' && e.target.closest('.map-image, .map-stage, .map-wrap')) {
    e.preventDefault();
    return false;
  }
});

// Enable simple map click handler (used only to clear selections)
if (mapStage) {
  mapStage.addEventListener('click', handleMapClick, true);
}

// --- REPLACE YOUR selectGarrisonByIndex FUNCTION WITH THIS ---
/**
 * Selects a garrison, highlights it, and zooms in.
 */
function selectGarrisonByIndex(index, shouldAnimate = true, maintainZoom = false) {
  if (visibleMarkersList.length === 0) return;
  if (index < 0 || index >= visibleMarkersList.length) return;

  // CRITICAL FIX: Recalculate screen size before moving. 
  // This prevents the map from "stopping" if the mobile address bar changed height.
  updateCache(); 

  // 1. Update State
  currentMarkerIndex = index;
  markersContainer.classList.add("has-selection");
  const target = visibleMarkersList[index];

  // 2. Update Visuals
  visibleMarkersList.forEach(item => item.element.classList.remove("active"));
  target.element.classList.add("active");

  // 3. Zoom Logic
  let zoomLevel;
  if (maintainZoom) {
    zoomLevel = currentZoomLevel; 
  } else {
    zoomLevel = Math.max(currentZoomLevel, 6); 
  }
  
  focusOnMapPoint(target.xPct, target.yPct, zoomLevel, shouldAnimate);
}

/**
 * Clears any active garrison selection.
 */
function clearGarrisonSelection() {
  currentMarkerIndex = -1;
  markersContainer.classList.remove("has-selection");
  visibleMarkersList.forEach(item => item.element.classList.remove("active"));
}

/**
 * Handles Arrow Key Navigation
 */
document.addEventListener("keydown", (e) => {
  // Only navigate if we have markers
  if (e.key === "Escape") {
    clearGarrisonSelection();
    return;
  }
  if (visibleMarkersList.length === 0) return;

  if (e.key === "ArrowRight") {
    // Go forward, wrap to start
    let nextIndex = currentMarkerIndex + 1;
    if (nextIndex >= visibleMarkersList.length) nextIndex = 0;
    selectGarrisonByIndex(nextIndex, false); // Snap
  } 
  else if (e.key === "ArrowLeft") {
    // Go backward, wrap to end
    let prevIndex = currentMarkerIndex - 1;
    if (prevIndex < 0) prevIndex = visibleMarkersList.length - 1;
    selectGarrisonByIndex(prevIndex, false); // Snap
  }
});


// Simple map click handler just to clear selections
function handleMapClick(e) {
  if (suppressNextMapClick || isDragging) return;
  if (e.target.closest && e.target.closest('.marker')) return;
  clearGarrisonSelection();
}

// --- MOBILE CONTROLS TOGGLE ---
const controlsToggle = document.getElementById("controlsToggle");
const controlsPanel = document.getElementById("controlsPanel"); // Ensure ID is added to HTML div

if (controlsToggle && controlsPanel) {
  controlsToggle.addEventListener("click", (e) => {
    // Prevent click from bubbling to map
    e.stopPropagation();
    // Toggle the class that slides the panel down/up
    controlsPanel.classList.toggle("minimized");
  });
}

// remove legacy optional coordinate capture hook

// --- RADIUS TOGGLE LOGIC (Mobile Optimized) ---
const radiusToggleBtn = document.getElementById("radiusToggleBtn");
const miniSwitch = radiusToggleBtn ? radiusToggleBtn.querySelector(".mini-switch") : null;

if (radiusToggleBtn && markersContainer) {

  // Logic to actually switch the state
  const toggleRadiusAction = () => {
    // 1. Toggle the visual switch
    if (miniSwitch) {
      miniSwitch.classList.toggle("is-active");
    }

    // 2. Toggle the class that hides the CSS rings
    const isNowActive = miniSwitch.classList.contains("is-active");
    
    if (isNowActive) {
      markersContainer.classList.remove("rings-hidden");
    } else {
      markersContainer.classList.add("rings-hidden");
    }
  };

  // 1. Touch: Handle tap instantly (prevents ghost clicks)
  radiusToggleBtn.addEventListener("touchend", (e) => {
    e.preventDefault(); 
    e.stopPropagation(); // Stop map from reacting
    toggleRadiusAction();
  }, { passive: false });

  // 2. Stop map drag from starting when touching this button
  radiusToggleBtn.addEventListener("touchstart", (e) => {
    e.stopPropagation();
  }, { passive: false });

  // 3. Desktop: Standard Click
  radiusToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleRadiusAction();
  });
}

