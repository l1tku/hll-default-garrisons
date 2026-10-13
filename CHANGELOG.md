# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-09-23

### Removed
- Redundant comments across `index.html`, `css/style.css`, `js/script.js`, and `js/maps.js`.

## [1.0.9] - 2026-09-23

### Changed
- Updated game version compatibility to Hell Let Loose Update 21.
- Game version link now points to the Update 21 changelog.
- Bumped Service Worker cache version.

## [1.0.8] - 2026-09-16

### Added
- SEO meta description, Open Graph, Twitter Card, and Schema.org WebSite metadata.
- High-resolution 192×192 and 512×512 icon definitions.
- Carentan preview thumbnail.

## [1.0.7] - 2026-06-14

### Added
- Ko-fi support button.

## [1.0.6] - 2026-06-07

### Changed
- Aligned PWA naming, browser titles, and installed-app metadata.
- Updated service worker for safer caching and offline support.
- Polished header links, labels, and subtitle styling.

## [1.0.5] - 2026-06-03

### Added
- Juno Beach default garrison positions for Canada and Germany offensive layouts.
- Clickable header version links (app version → GitHub, `UPDATE 20` → official blog post).
- Changelog button and in-app changelog modal in the map selection header.

### Changed
- Supported Hell Let Loose game version updated to Update 20.

## [1.0.4] - 2026-03-31

### Fixed
- Garrison zoom coordinate calculation.
- Zoom-out logic validating saved pre-zoom state.
- Zoom state auto-resetting when manual zoom moves away from max zoom.
- Saved pre-zoom validation with fallback for edge cases.

### Changed
- Stronger haptic feedback on garrison zoom, arrows, strongpoints, grid, and radius toggles.

## [1.0.3] - 2026-03-28

### Changed
- Complete visual overhaul of the garrison control UI.
- Redesigned garrison control bar with navigation arrows, faction flag, garrison name, and zoom button.
- Updated map database, strongpoints, default garrisons, coordinates, and map data for Hell Let Loose 19.1.
- Improved UI/UX consistency, readability, touch-friendliness, and hover/active visual feedback.

### Fixed
- Garrison control bar overlaps, missing buttons, and horizontal width issues.
- Button visibility and contrast.
- Mobile compactness and responsiveness.
- Alignment and positioning on desktop and mobile.

## [1.0.2] - 2025-12-30

### Added
- Proximity warning rings on garrison markers (15 m locked, 50 m warning).
- Dynamic scaling of radius rings to map scale at any zoom level.

### Fixed
- Mobile marker alignment overridden by CSS transform logic on touch devices.
- Garrison icon vertical offsets so icons sit accurately on map coordinates.

### Changed
- README: added Disclaimer & Copyright section and clarified game asset exclusion from the MIT license.

## [1.0.1] - 2025-12-29

### Added
- Full mobile support with touch-optimized interface.
- Native tap and double-tap handling for garrison markers.
- CSS containment and image decoding optimizations.
- Responsive layout for mobile controls and header.
- Enhanced touch navigation arrows.

### Changed
- Removed native tap highlights for an app-like experience.

## [0.1.0] - 2025-12-28

### Added
- Initial release of the HLL Default Garrisons tool.
