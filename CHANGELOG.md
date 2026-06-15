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
- Added clickable header version links: app version now opens the GitHub repository and `UPDATE 20` opens the official Hell Let Loose blog post.
- Added a changelog button and in-app changelog modal to the map selection header.

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
