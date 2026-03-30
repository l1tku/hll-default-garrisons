# HLL Artillery Map Calculator
**v1.2.2 — Updated for Hell Let Loose Update 19.1**

An interactive tactical map and high-precision artillery calculator for Hell Let Loose. Features dynamic scaling for all maps, manual calculator, visual trajectory aids, and a mobile-optimized targeting UI.

## Live Demo
Access the calculator instantly in your browser:  
**[https://l1tku.github.io/hll-arty-map-calculator/](https://l1tku.github.io/hll-arty-map-calculator/)**

## Features
- **Interactive Tactical Maps**: High-resolution maps with smooth pan/zoom, dynamic grid rendering, sticky grid labels, and accurate meter scale.
- **Multi-Faction Support**: Full ballistics for **US**, **Germany**, **Soviet Union**, and **Great Britain** with per-map dynamic scaling (e.g., 2016m Carentan vs 1984m Driel) for 1:1 in-game accuracy.
- **Visual Targeting Suite**:
  - Trajectory line from gun to target with 50m distance/MIL ruler.
  - Trajectory Adjustment Slider to walk shots along the fixed bearing.
  - Dispersion (40m), Killzone (20m), and Blast Radius (10m) rings (adaptive scaling at any zoom).
  - **Permanent soft dark overlays** showing 1600m maximum range (outside the circle) and 100m minimum range / dead zone (inside the circle).
  - Compass bearing readout.
  - Shooting pulse ripple at impact.
- **Strongpoint Management**: "Match Setup" mode – select the 5 active strongpoints to match the current in-game Warfare or Offensive layout.
- **Custom Artillery System**: Place up to 3 custom guns per team directly on the map. They rotate toward the target, appear in the gun dropdown, and support Move/Delete via context menu.
- **Gun Selection & Visualization**:
  - Select via dropdown or direct click/tap on artillery icons.
  - Icons dynamically scale with zoom, rotate toward target, and stay fully visible.
- **Green Sector Highlight**: Persistent green sector highlight stays visible while placing custom artillery so you always know the allowed area.
- **Live Tracking HUD**:
  - **Desktop**: Real-time distance, MILs, grid, and bearing under cursor.
  - **Mobile**: Docked crosshair HUD with "Fire" button to lock target at screen center.
- **Manual Calculator**: Integrated keypad for quick distance-to-MIL calculations.
- **Mobile Optimized**:
  - Large touch targets, haptic feedback (keypad, Fire button, zoom buttons), and visual safety cues.
  - Snappy step-zoom, ergonomic Fire button placement, no pull-to-refresh bounce.
  - Crosshair targeting mode for precise in-game overlay use. On mobile you must aim with the crosshair and tap the **PLACE** button to position custom artillery.
- **Map Selector**: Visual thumbnail grid with search bar (supports accented characters).

## Technical Details
- **Dynamic Caching**: "Stale-While-Revalidate" – only downloads and caches maps you open, keeping storage low while ensuring instant reloads.
- **PWA Ready**: Installable to home screen on mobile for native-like experience (offline-capable once cached).
- **Performance**: GPU-accelerated on desktop, memory-safe transforms on mobile, throttled HUD updates, batch rendering.

## Usage
### Method 1: Map Targeting
1. **Select Map**: Open the map selector and choose your map.
2. **Configure Faction**: Select your Faction from the control panel.
3. **Select or Place Artillery**:
   - **HQ Guns**: Select Gun 1, 2, or 3 from the dropdown (these are the fixed HQ artillery positions).
   - **Custom Guns**: Click/tap the **"+"** button to enter placement mode, then click on the map (desktop) or aim with the crosshair and tap **PLACE** (mobile) to position up to 3 custom guns per team. Custom guns must be placed within the green highlighted sector.
4. **Aim**: Click anywhere on the map to place a target or use Live Tracking for real-time results directly under your cursor.
5. **Result**: Read the result from the Target Data Panel topside.

**Custom Gun Management**: Click a custom gun icon to select it, or right-click to open the context menu (Move / Delete). On mobile, you can also remove custom guns from the faction dropdown menu.

### Method 2: Manual Calculator
1. Click the Calculator Icon in the sidebar or within the Map Selection footer.
2. Select your faction.
3. Enter the distance using the keypad.
4. Get instant Elevation MILs.

## Map Controls
### Desktop
- **Left Click**: Place Target / Select Artillery.
- **Click & Drag**: Pan the map.
- **Mouse Wheel**: Zoom in/out.
- **Hover**: View live distance and grid reference in the HUD.

### Mobile
- **One Finger Drag**: Pan the map.
- **Tap "Fire" Button**: Places target at the center of the screen (Live Tracking).

## Installation & Local Usage
### Option 1: Live Web Access (Recommended)
No installation required. Simply visit the [Live Demo Link](https://l1tku.github.io/hll-arty-map-calculator/) from any desktop or mobile browser.

### Option 2: Local Development
1. **Clone** or download this repository.
2. Ensure map images are placed in `images/maps/` and thumbnails are in `images/maps/thumbnail/`.
3. Open `index.html` in any modern web browser.

## Supported Maps
* Carentan (CAR)
* Driel (DRI)
* El Alamein (ELA)
* Elsenborn Ridge (EBR)
* Foy (FOY)
* Hill 400 (H4)
* Hurtgen Forest (HUR)
* Kharkov (KHA)
* Kursk (KUR)
* Mortain (MOR)
* Omaha Beach (OMA)
* Purple Heart Lane (PHL)
* Remagen (REM) – updated for Update 19.1
* Sainte-Marie-du-Mont (SMM)
* Sainte-Mère-Église (SME)
* Smolensk (SMO)
* Stalingrad (STA)
* Tobruk (TOB)
* Utah Beach (UTA)

## Browser Support
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing
Feel free to submit issues and enhancement requests.

## Disclaimer & Copyright
This project is a community-made tool and is **not** affiliated with, endorsed by, or sponsored by Team17, Cover 6 Studios, or Black Matter.  
**Hell Let Loose** content and materials are trademarks and copyrights of their respective owners.  
* **Game Assets:** All game images (maps, icons) are the property of the Hell Let Loose developers and publishers. They are used here for non-commercial, educational, and informational purposes.

## License
The source code (HTML, CSS, JavaScript) of this project is licensed under the **MIT License**.  
> **Note:** The game assets (images located in the `/images` folder) are **excluded** from this license and remain the intellectual property of their respective owners.