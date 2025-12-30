# Changelog

All notable changes to this project will be documented in this file.

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