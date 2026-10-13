# HLL Interactive Map for Default Garrisons
**v1.1.0 — Updated for Hell Let Loose Update 21**

A lightweight intel tool for **Hell Let Loose** offensive matches. It ships with an interactive garrison map that highlights every defender default spawn point on offensive maps so squad leads can plan their opening moves without guesswork.

## Features
- **Interactive Map:** Pan, zoom, and inspect high-resolution tactical maps with pinpoint precision.
- **Garrison Locations:** Exact default garrison positions for every Offensive mode map layout.
- **Garrison Control Bar:** Quickly cycle between garrisons with direct grid references (e.g., A1-5) and auto-zoom.
- **Strongpoint Overlay Toggle:** Toggle strongpoint capture zones on or off.
- **Sector Grid Toggle:** Toggle the map coordinate grid display on or off.
- **Radius Rings Toggle:** Toggle the 15m and 50m proximity rings on or off.
- **Faction Filters:** Toggle between All, Axis, or Allies to declutter the tactical view.
- **Distance Scale Bar:** Dynamic ruler to accurately estimate distances in meters.
- **Map Search:** Search bar to jump directly to any map.
- **Mobile Ready:** Touch-optimized for seamless use on phones and tablets.

## Installation & Local Usage
### Option 1: Live Web Access (Recommended)
No installation required. Open [HLL Default Garrisons](https://l1tku.github.io/hll-default-garrisons/) in any browser.

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

## Supported Maps
* Carentan
* Driel
* El Alamein
* Elsenborn Ridge
* Foy
* Hill 400
* Hurtgen Forest
* Juno Beach
* Kharkov
* Kursk
* Mortain
* Omaha Beach
* Purple Heart Lane
* Remagen
* Sainte-Marie-du-Mont
* Sainte-Mère-Église
* Smolensk
* Stalingrad
* Tobruk
* Utah Beach

## Browser Support
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Disclaimer & Copyright

This project is a community-made tool and is **not** affiliated with, endorsed by, or sponsored by Team17, Cover 6 Studios, or Black Matter.

**Hell Let Loose** content and materials are trademarks and copyrights of their respective owners.
* **Game Assets:** All game images (maps, garrison icons) are the property of the Hell Let Loose developers and publishers. They are used here for non-commercial, educational, and informational purposes.

## License

The source code (HTML, CSS, JavaScript) of this project is licensed under the **MIT License**.

> **Note:** The game assets (images located in the `/images` folder) are **excluded** from this license and remain the intellectual property of their respective owners.

---

## Version History

Only the last 5 releases are shown here — the full history lives in [CHANGELOG.md](CHANGELOG.md).

### [1.1.0] - 2026-09-23

#### Removed
- Redundant comments across `index.html`, `css/style.css`, `js/script.js`, and `js/maps.js`.

### [1.0.9] - 2026-09-23

#### Changed
- Updated game version compatibility to Hell Let Loose Update 21.
- Game version link now points to the Update 21 changelog.
- Bumped Service Worker cache version.

### [1.0.8] - 2026-09-16

#### Added
- SEO meta description, Open Graph, Twitter Card, and Schema.org WebSite metadata.
- High-resolution 192×192 and 512×512 icon definitions.
- Carentan preview thumbnail.

### [1.0.7] - 2026-06-14

#### Added
- Ko-fi support button.

### [1.0.6] - 2026-06-07

#### Changed
- Aligned PWA naming, browser titles, and installed-app metadata.
- Updated service worker for safer caching and offline support.
- Polished header links, labels, and subtitle styling.
