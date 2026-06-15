# HLL Interactive Map for Default Garrisons
**v1.0.7 — Updated for Hell Let Loose Update 20**

A lightweight intel tool for **Hell Let Loose** offensive matches. It ships with an interactive garrison map that highlights every defender default spawn point on offensive maps so squad leads can plan their opening moves without guesswork.

## Installation & Local Usage
### Option 1: Live Web Access (Recommended)
No installation required. Simply visit the [Live Demo Link](https://l1tku.github.io/hll-default-garrisons/) from any desktop or mobile browser.

### Option 2: Local Development
1. **Clone** or download this repository.
2. Open `index.html` in any modern web browser.

## Usage
1. **Select Map**: Choose your map from the selector
2. **Navigate Garrisons**: Use left/right arrows to cycle through garrisons
3. **Filter Faction**: Toggle between All, Axis, or Allies to declutter the view
4. **View Intel**: Check proximity rings (15m locked, 50m warning) around each garrison
5. **Read Grid**: View grid reference (e.g., A1-5) for tactical planning

## Map Controls
### Desktop
- **Left Click**: Select garrison.
- **Click & Drag**: Pan the map.
- **Mouse Wheel**: Zoom in/out.
- **Hover**: View garrison details and grid reference.

### Mobile
- **One Finger Drag**: Pan the map.
- **Tap Garrison**: Select and view details.
- **Pinch**: Zoom in/out.

## Features
- **Interactive Map:** Pan, zoom, and inspect maps with scale readouts.
- **Preloaded Intel:** Exact default garrison markers for every offensive map layout.
- **Proximity Warnings:** Visual 15m (Locked) and 50m (Warning) radius rings show garrison influence areas.
- **Dynamic Scaling:** Radius rings scale accurately to map scale at any zoom level.
- **Faction Filters:** Toggle between All, Axis, or Allies to declutter the tactical view.
- **Mobile Optimized:** Touch-friendly interface with native pinch-to-zoom and tap interactions.
- **Garrison Control Bar:** Tactical navigation with left/right arrows, faction flag, garrison name, zoom toggle, and grid reference display (e.g., A1-5).
- **Projects Hub:** Quick links to related tools (Artillery Calculator, SPA Calculator).
- **Scale Indicator:** Real-time distance readout with dynamic bar (0-400m+).
- **Map Search:** Filterable map selector with instant search.

**Updated for Hell Let Loose Update 20**

## Disclaimer & Copyright

This project is a community-made tool and is **not** affiliated with, endorsed by, or sponsored by Team17, Cover 6 Studios, or Black Matter.

**Hell Let Loose** content and materials are trademarks and copyrights of their respective owners.
* **Game Assets:** All game images (maps, garrison icons) are the property of the Hell Let Loose developers and publishers. They are used here for non-commercial, educational, and informational purposes.

## License

The source code (HTML, CSS, JavaScript) of this project is licensed under the **MIT License**.

> **Note:** The game assets (images located in the `/images` folder) are **excluded** from this license and remain the intellectual property of their respective owners.

---

# Changelog

All notable changes to this project will be documented in this file.

## [1.0.7] - 2026-06-14
### Added
- Added Ko-fi support button

## [1.0.6] - 2026-06-07
### Updated
- Aligned PWA naming, browser titles, and installed-app metadata.
- Updated the service worker for safer caching and offline support.
- Polished the header links, labels, and subtitle styling.

## [1.0.5] - 2026-06-03
### Updated
- Added Juno Beach default garrison positions for both Canada and Germany offensive layouts.
- Updated supported Hell Let Loose game version to Update 20.

## [1.0.4] - 2026-03-31
### Fixed
- Garrison zoom coordinate calculation (captures fitScale at animation start, uses mapContainer for center)
- Zoom out logic now validates saved pre-zoom to prevent accidental zoom-in
- Zoom state auto-resets when manual zoom moves away from MAX_ZOOM
- Saved pre-zoom validation with 3.0x fallback for edge cases

### Improved
- Stronger haptic feedback (50ms) on garrison zoom, arrows, strongpoints, grid, and radius toggles

## [1.0.3] - 2026-03-28
### Major Visual Rework & Game Update
- **Complete Visual Overhaul**: Major redesign and polish of the **entire garrison control UI** for a cleaner, more tactical, and professional look across the whole project.
- **Improved Garrison Control Bar**: Full, balanced layout with clearly visible left/right navigation arrows, faction flag, garrison name (smart ellipsis truncation for long names like "DEFAULT GARRISON 2"), zoom button, and right arrow.
- **Hell Let Loose 19.1 Support**: Updated MAP_DATABASE, all strongpoints, default garrisons, coordinates, and map data for full compatibility with the latest game patch 19.1.

### Fixed
- Garrison control bar overlaps, missing buttons, and horizontal width issues.
- Button visibility and contrast (arrows and zoom button now stand out perfectly).
- Mobile compactness and responsiveness of the new UI.
- Various alignment and pixel-perfect positioning tweaks (desktop + mobile).

### Improved
- Overall UI/UX consistency, readability, and touch-friendliness.
- Visual feedback (hover/active states) on garrison controls.

## [1.0.2] - 2025-12-30
### Added
- **Proximity Warnings**: Added visual 15m (Locked) and 50m (Warning) radius rings to garrison markers.
- **Dynamic Scaling**: Radius rings now scale accurate to the map scale (meters-to-pixels) at any zoom level.

### Fixed
- **Mobile Marker Alignment**: Fixed CSS transform logic that was overriding vertical offset settings on touch devices.
- **Garrison Icon Positioning**: Corrected vertical offsets to ensure garrison icons sit accurately on map coordinates.

### Documentation
- **Legal Disclaimer**: Added Disclaimer & Copyright section to README to clarify game asset ownership.
- **License Scope**: Explicitly excluded game images/assets from the MIT code license.

## [1.0.1] - 2025-12-29
### Added
- **Mobile Support**: Full touch-optimized interface for mobile devices.
- **Touch Interactions**: Native tap and double-tap handling for garrison markers.
- **Mobile Performance**: CSS containment and image decoding optimizations.
- **Responsive Layout**: Mobile-optimized controls and header positioning.
- **Touch Buttons**: Enhanced navigation arrows with instant touch response.
- **Native Polish**: Removed tap highlights for true app-like experience.

## [0.1.0] - 2025-12-28
### Added
- Initial release of the HLL Default Garrisons tool.
