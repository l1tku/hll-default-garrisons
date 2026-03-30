# Changelog
All notable changes to this project will be documented in this file.

## [1.2.2] - 2026-03-29
### Fixed
- **Mil Display on Gun Switch**: Fixed bug where "OUT" was incorrectly displayed for elevation mil when switching between HQ and custom artillery, even when the target was within range. The mil value is now correctly recalculated from the current gun position in `renderTargeting()`.

## [1.2.1] - 2026-03-29
### Fixed
- Manual calculator "FIRING AS" label now consistently shows "UNITED STATES" for US faction
- Desktop haptic feedback: Added vibration when shooting via desktop map click (was only on mobile fire button previously)
- Individual gun rotations: Added authentic Yaw rotation values from game files to all 114 artillery guns across 19 maps
- Updated all artillery icon images
- Removed leftover unused crosshair.png file

## [1.2.0] - 2026-03-29
### Added
- **Dynamic Version System**: APP_VERSION now extracts automatically from script URL query parameter, ensuring displayed version always matches cache-buster.
- **Haptic Feedback for Custom Artillery**: Added vibration feedback when selecting custom artillery guns (was missing previously).

### Changed
- Updated script.js cache-buster to semantic versioning (`?v=1.2.0`).

### Fixed
- **Desktop Haptic Feedback**: Added missing vibration feedback when shooting via desktop map click (was only on mobile fire button previously).

## [1.1.8] - 2026-03-28
### Added
- **Custom Artillery System (Major Feature)**: Players can now place up to 3 custom guns per team directly on the map. Custom guns are fully functional and appear in the gun dropdown or when clicked on, and support a context menu (Move / Delete).
- **Remagen Refresh Support**: Updated the Remagen map data and scaling to match the official Hell Let Loose Update 19.1 map refresh.
- **Permanent Range Overlays**: Added soft dark background overlays that permanently show the **1600m maximum range** (everything outside the circle) and **100m minimum range** (everything inside the circle).
- **Target Panel Close Button**: Added a clean "✕" button in the top-right corner of the Target Data Panel for clearing of the current target.
- **Green Sector Highlight**: Added persistent green sector highlight that stays visible while placing custom artillery so you always know the allowed placement area.

### Changed
- **Clean Range Visualization**: Completely removed the old red dashed 1600 m circle. Range limits are now shown exclusively through elegant dark overlays.
- **Mobile Custom Gun Placement**: On mobile you must now aim with the crosshair and then **tap the PLACE button** to position custom artillery.

### Fixed
- **Overlay Timing**: Both max-range and min-range dark overlays now appear **immediately** when any gun (HQ or custom) is selected.
- **Code Cleanup**: Final polish on overlay creation, update calls, and mobile text restoration logic.

### Performance
- Overlays use lightweight GPU-accelerated CSS masks — zero impact on frame rate or battery life.

## [1.1.7] - 2026-03-20
### Changed
- Preparing for **Update 19.1** compatibility (game version string updated).

## [1.1.6] - 2026-01-26
### Added
- Match Setup Mode with Strongpoint Filter
- Max Range Indicator (temporary red dashed circle)
- Shooting Pulse effect
- Target Compass Bearing

### Fixed
- Bearing accuracy with proper flooring
- Z-index layering
- Zoom performance
- Haptic feedback
- Mobile Projects Hub alignment

*(Older versions below remain unchanged)*

## [1.1.5] - 2026-01-23
### Changed
- Responsiveness overhaul (instant zoom/pan)
- Dynamic artillery icon scaling
- Removed dimming on unselected guns
- Mobile ruler precision improvements

### Fixed
- Map switch state reset
- Gun rotation logic
- Strongpoint label blur
- Scale bar accuracy
- Mobile checkerboarding

## [1.1.4] - 2026-01-21
### Added
- Trajectory Adjustment Slider

### Fixed
- Mobile fire offset
- Map transition flicker
- Dynamic page titles
- Scale bar rendering
- Mobile UI ergonomics

## [1.1.3] - 2026-01-17
### Fixed
- Desktop stutter on wheel zoom

## [1.1.2] - 2026-01-17
### Fixed
- Mobile GPU checkerboarding
- Stuck zoom on reload
- Script initialization errors
- Desktop hover highlights
- Modal persistence

## [1.1.1] - 2026-01-16
### Fixed
- Projects Hub logic and alignment
- Visual weight balancing
- Mobile overflow

## [1.1.0] - 2026-01-16
### Added
- Core engine with dynamic targeting
- Visual impact zones
- Interactive map selector

### Fixed & Performance
- Major rendering and state fixes
- GPU acceleration
- Haptic feedback
- Viewport locking