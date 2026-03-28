// ==========================================
// MAP DATABASE
// ==========================================
const MAP_DATABASE = {
  CAR: {
    name: "Carentan",
    image: "images/maps/map_Carentan.webp",
    thumbnail: "images/maps/thumbnail/CAR.webp",
    teams: { t1: "UNITED STATES", t2: "GERMANY" },
    
    // --- FIX 1: Exact Dimensions from MapMeta file ---
    // 40320 units * 5 sectors = 2016 meters
    widthMeters: 2016, 
    heightMeters: 2016, 
    // -------------------------------------------------

    strongpoints: [
      // --- ALLIED DEFAULT GARRISONS (OFFENSIVE ATTACKERS) ---
      // Y-Inversion applied
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: 27329.06, gameY: -52170.77, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: 41451.76, gameY: 992.76, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: 37721.13, gameY: 35020.23, radius: 500, team: "us", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN DEFENDERS - US OFFENSIVE) ---
      // Y-Inversion applied
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: -42075.0, gameY: -31010.0, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: -27181.0, gameY: -3123.0, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: -35942.0, gameY: 30732.0, radius: 500, team: "ger", type: "garrison_default" },


      // NOTE: Sectors grouped by MapMeta InitialOwner, NOT by geographic position.

      // --- ALLIES SECTORS ---
      { label: "FARM RUINS", id: "B3", gameX: -68814.41, gameY: -37720.035, radius: 5000.0, team: "us", type: "strongpoint" },
      { label: "502ND START", id: "B1", gameX: -67076.41, gameY: -4670.035, radius: 5000.0, team: "us", type: "strongpoint" },
      { label: "BLACTOT", id: "B2", gameX: -65543.41, gameY: 39731.965, radius: 5000.0, team: "us", type: "strongpoint" },
      { label: "DERAILED TRAIN", id: "B6", gameX: -39381.41, gameY: -28975.035, radius: 5000.0, team: "us", type: "strongpoint" },
      { label: "RUINS", id: "B4", gameX: -26183.41, gameY: -2343.035, radius: 3000.0, team: "us", type: "strongpoint" },
      { label: "PUMPING STATION", id: "B5", gameX: -36748.41, gameY: 29821.965, radius: 5000.0, team: "us", type: "strongpoint" },
      
      // --- NEUTRAL SECTORS ---
      { label: "TRAIN STATION", id: "B9", gameX: 246.59, gameY: -27698.035, radius: 5000.0, team: "neu", type: "strongpoint" },
      { label: "TOWN CENTER", id: "B7", gameX: 1021.59, gameY: 1021.96, radius: 5000.0, team: "neu", type: "strongpoint" },
      { label: "CANAL CROSSING", id: "B8", gameX: 5892.59, gameY: 39387.965, radius: 5000.0, team: "neu", type: "strongpoint" },
      
      // --- AXIS SECTORS ---
      { label: "MONT HALAIS", id: "B12", gameX: 33828.59, gameY: -51343.035, radius: 3973.63, team: "ger", type: "strongpoint" },
      { label: "RAIL CROSSING", id: "B10", gameX: 44171.59, gameY: 6296.965, radius: 5000.0, team: "ger", type: "strongpoint" },
      { label: "CUSTOMS", id: "B11", gameX: 40816.59, gameY: 34224.965, radius: 5000.0, team: "ger", type: "strongpoint" },
      { label: "LA MAISON DES ORMES", id: "B15", gameX: 72222.59, gameY: -38476.035, radius: 5000.0, team: "ger", type: "strongpoint" },
      { label: "RAIL CAUSEWAY", id: "B13", gameX: 75611.59, gameY: -5968.035, radius: 5495.63, team: "ger", type: "strongpoint" },
      { label: "CANAL LOCKS", id: "B14", gameX: 66826.59, gameY: 26456.965, radius: 5000.0, team: "ger", type: "strongpoint" }
    ]
  },
  DRI: { 
    name: "Driel", 
    image: "images/maps/map_driel.webp", 
    thumbnail: "images/maps/thumbnail/DRI.webp", 
    teams: { t1: "ALLIES", t2: "GERMANY" }, 

// --- SCALE FIX: 1984 METERS ---
    // Although SectorWidth indicates 2016m, the Level Settings (HLLWorldSettings)
    // define MBPBounds as -99200 to 99200 units (1984 meters).
    // The visual map texture is clipped to these playable bounds.
    widthMeters: 1984, 
    heightMeters: 1984, 

    garrisonSort: "x",

    strongpoints: [
      // Y coordinates inverted (multiplied by -1) to match map image orientation

      // --- ALLIES DEFAULT GARRISONS (DEFENDERS) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GB_G_OFF_1", gameX: -38994.13, gameY: 32891.75, radius: 500, team: "gb", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GB_G_OFF_2", gameX: 5525.76, gameY: 39952.99, radius: 500, team: "gb", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GB_G_OFF_3", gameX: 36380.06, gameY: 40330.75, radius: 500, team: "gb", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (DEFENDERS) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 44196.79, gameY: -35246.69, radius: 500, team: "axis", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 3853.08, gameY: -40744.65, radius: 500, team: "axis", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: -41891.73, gameY: -37609.50, radius: 500, team: "axis", type: "garrison_default" },

      // NOTE: Sectors grouped by MapMeta InitialOwner, NOT by geographic position.

      // --- ALLIES SECTORS ---
      { label: "ORCHARDS", id: "B15", gameX: -39533.19, gameY: -70991.98, radius: 8000.0, team: "gb", type: "strongpoint" },
      { label: "SCHADUWWOLKEN FARM", id: "B14", gameX: -2113.17, gameY: -72341.06, radius: 6500.0, team: "gb", type: "strongpoint" },
      { label: "FIELDS", id: "B13", gameX: 41461.46, gameY: -71828.51, radius: 6000.0, team: "gb", type: "strongpoint" },
      { label: "RIETVELD", id: "B10", gameX: -40615.84, gameY: -40909.70, radius: 6000.0, team: "gb", type: "strongpoint" },
      { label: "SOUTH RAILWAY", id: "B11", gameX: 3826.84, gameY: -42206.75, radius: 8000.0, team: "gb", type: "strongpoint" },
      { label: "MIDDEL ROAD", id: "B12", gameX: 41461.46, gameY: -38457.82, radius: 6000.0, team: "gb", type: "strongpoint" },
      
      // --- NEUTRAL SECTORS ---
      { label: "BRICK FACTORY", id: "B9", gameX: -39703.02, gameY: -6122.76, radius: 6000.0, team: "neu", type: "strongpoint" },
      { label: "RAILWAY BRIDGE", id: "B7", gameX: 2882.37, gameY: 3877.29, radius: 9000.0, team: "neu", type: "strongpoint" },
      { label: "GARRISON EMPLACEMENTS", id: "B8", gameX: 43301.99, gameY: 2530.00, radius: 5500.0, team: "neu", type: "strongpoint" },
      
      // --- AXIS SECTORS ---
      { label: "BOATYARD", id: "B1", gameX: -38518.71, gameY: 33980.62, radius: 7000.0, team: "ger", type: "strongpoint" },
      { label: "BRIDGEWAY", id: "B6", gameX: 3880.96, gameY: 39449.43, radius: 6000.0, team: "ger", type: "strongpoint" },
      { label: "RIJN BANKS", id: "B5", gameX: 39177.53, gameY: 42960.49, radius: 7000.0, team: "ger", type: "strongpoint" },
      { label: "OOSTERBEEK APPROACH", id: "B2", gameX: -36028.54, gameY: 73330.25, radius: 6000.0, team: "ger", type: "strongpoint" },
      { label: "ROSEANDER POLDER", id: "B3", gameX: 2809.07, gameY: 72870.87, radius: 6000.0, team: "ger", type: "strongpoint" },
      { label: "KASTEEL ROSANDE", id: "B4", gameX: 38371.14, gameY: 71836.70, radius: 7000.0, team: "ger", type: "strongpoint" }
    ]
  },
  ELA: { 
    name: "El Alamein", 
    image: "images/maps/map_elalamein.webp", 
    thumbnail: "images/maps/thumbnail/ELA.webp", 
    teams: {
        t1: "BRITISH 8TH ARMY",
        t2: "AFRIKA KORPS"
    }, 

    widthMeters: 1984, 
    heightMeters: 1984, 


    strongpoints: [
      // --- ALLIES DEFAULT GARRISONS (COMMONWEALTH) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GB_G_OFF_1", gameX: -41375.33, gameY: 5023.39, radius: 500, team: "allies", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GB_G_OFF_2", gameX: -39476.20, gameY: 33266.47, radius: 500, team: "allies", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GB_G_OFF_3", gameX: -40537.39, gameY: -37623.83, radius: 500, team: "allies", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 52435.07, gameY: 9200.93, radius: 500, team: "axis", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 46920.79, gameY: 34279.69, radius: 500, team: "axis", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 40854.45, gameY: -37597.44, radius: 500, team: "axis", type: "garrison_default" },

      // NOTE: Sectors grouped by MapMeta InitialOwner, NOT by geographic position.

      // --- AXIS SECTORS ---
      { label: "MITEIRIYA RIDGE", id: "B11", gameX: -79261.70, gameY: -36680.63, radius: 6000.0, team: "ger", type: "strongpoint" },
      { label: "GARRISON POSITION", id: "B6", gameX: -71609.83, gameY: 8175.46, radius: 6000.0, team: "ger", type: "strongpoint" },
      { label: "VEHICLE DEPOT", id: "B1", gameX: -68233.38, gameY: 37264.52, radius: 6000.0, team: "ger", type: "strongpoint" },
      { label: "WATCHTOWER", id: "B12", gameX: -40818.59, gameY: -37838.59, radius: 6000.0, team: "ger", type: "strongpoint" },
      { label: "EL MREIR", id: "B7", gameX: -37776.82, gameY: 2887.53, radius: 6000.0, team: "ger", type: "strongpoint" },
      { label: "HAMLET RUINS", id: "B2", gameX: -37466.63, gameY: 37732.38, radius: 6000.0, team: "ger", type: "strongpoint" },

      // --- NEUTRAL SECTORS ---
      { label: "VALLEY", id: "B13", gameX: 1970.44, gameY: -35186.07, radius: 8190.72, team: "neu", type: "strongpoint" },
      { label: "OASIS", id: "B8", gameX: -2900.92, gameY: 851.28, radius: 6000.0, team: "neu", type: "strongpoint" },
      { label: "DESERT RAT TRENCHES", id: "B3", gameX: 4880.01, gameY: 40988.05, radius: 6000.0, team: "neu", type: "strongpoint" },

      // --- ALLIES SECTORS ---
      { label: "AIRFIELD HANGARS", id: "B14", gameX: 41085.37, gameY: -32927.33, radius: 8000.0, team: "us", type: "strongpoint" },
      { label: "AIRFIELD COMMAND", id: "B9", gameX: 38495.92, gameY: 4155.89, radius: 6000.0, team: "us", type: "strongpoint" },
      { label: "FUEL DEPOT", id: "B4", gameX: 43333.85, gameY: 35426.48, radius: 7000.0, team: "us", type: "strongpoint" },
      { label: "QUARRY", id: "B15", gameX: 78760.73, gameY: -41540.40, radius: 6000.0, team: "us", type: "strongpoint" },
      { label: "AMBUSHED CONVOY", id: "B10", gameX: 72480.45, gameY: 2526.44, radius: 6000.0, team: "us", type: "strongpoint" },
      { label: "CLIFFSIDE VILLAGE", id: "B5", gameX: 68942.24, gameY: 39028.40, radius: 6000.0, team: "us", type: "strongpoint" }
    ],
  },
  EBR: { 
    name: "Elsenborn Ridge", 
    image: "images/maps/TacMap_EBR_L_1944.webp", 
    thumbnail: "images/maps/thumbnail/EBR.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },

    // --- DIMENSIONS ---
    // Calculated from LayoutMeta: 5 sectors * 40000 units = 2000m.
    // 1 Game Unit = 1 cm. 100 units = 1m.
    widthMeters: 2000, 
    heightMeters: 2000, 

    // --- SORTING CONFIG ---
    // "x": Sorts garrisons Left-to-Right (West->East). Required for horizontal garrison lines.
    // "y": (Default) Sorts Top-to-Bottom. Used for most other maps.
    garrisonSort: "x",


    strongpoints: [
      // --- ALLIED DEFAULT GARRISONS (US) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: 9923.00, gameY: -45375.00, radius: 500, team: "allies", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: 46580.00, gameY: -56330.00, radius: 500, team: "allies", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: -47207.00, gameY: -55268.00, radius: 500, team: "allies", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_10", gameX: 3271.84, gameY: 50580.01, radius: 500, team: "axis", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_11", gameX: -46767.00, gameY: 46330.00, radius: 500, team: "axis", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_12", gameX: 56854.23, gameY: 50767.45, radius: 500, team: "axis", type: "garrison_default" },

      // NOTE: Sectors grouped by MapMeta InitialOwner, NOT by geographic position.

      // --- ALLIES SECTORS ---
      { label: "99TH COMMAND CENTRE", id: "B17", gameX: -39637.50, gameY: 67610.96, radius: 7500.0, team: "us", type: "strongpoint" },
      { label: "GARRISON BATTERY", id: "B18", gameX: 420.0, gameY: 69376.0, radius: 8000.0, team: "us", type: "strongpoint" },
      { label: "U.S. CAMP", id: "B16", gameX: 50979.02, gameY: 67675.0, radius: 7000.0, team: "us", type: "strongpoint" },
      { label: "ELSENBORN RIDGE", id: "B19", gameX: -30950.0, gameY: 41967.96, radius: 7000.0, team: "us", type: "strongpoint" },
      { label: "FARAHILDE FARM", id: "B20", gameX: 10158.0, gameY: 30210.0, radius: 8000.0, team: "us", type: "strongpoint" },
      { label: "JENSIT PILLBOXES", id: "B21", gameX: 49674.99, gameY: 28085.95, radius: 7000.0, team: "us", type: "strongpoint" },

      // --- NEUTRAL SECTORS ---
      { label: "ROAD TO ELSENBORN RIDGE", id: "B22", gameX: -40964.0, gameY: -3317.0, radius: 8000.0, team: "neu", type: "strongpoint" },
      { label: "DUGOUT TANKS", id: "B23", gameX: -9124.0, gameY: -2404.0, radius: 6000.0, team: "neu", type: "strongpoint" },
      { label: "CHECKPOINT", id: "B25", gameX: 40444.91, gameY: -6529.14, radius: 5000.0, team: "neu", type: "strongpoint" },

      // --- AXIS SECTORS ---
      { label: "ERELSDELL FARMHOUSE", id: "B24", gameX: -41672.0, gameY: -38246.0, radius: 8000.0, team: "ger", type: "strongpoint" },
      { label: "AA BATTERY", id: "B27", gameX: 8607.68, gameY: -33127.07, radius: 7000.0, team: "ger", type: "strongpoint" },
      { label: "HINTERBERG", id: "B26", gameX: 39637.23, gameY: -39888.69, radius: 8000.0, team: "ger", type: "strongpoint" },
      { label: "SUPPLY CACHE", id: "B29", gameX: -25666.0, gameY: -66300.0, radius: 5000.0, team: "ger", type: "strongpoint" },
      { label: "FOXHOLES", id: "B28", gameX: 12223.86, gameY: -67172.27, radius: 7000.0, team: "ger", type: "strongpoint" },
      { label: "FUEL DEPOT", id: "B30", gameX: 38049.76, gameY: -70408.04, radius: 7000.0, team: "ger", type: "strongpoint" }
    ],
  },
  FOY: { 
    name: "Foy", 
    image: "images/maps/map_foy.webp", 
    thumbnail: "images/maps/thumbnail/FOY.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },

    // Verified standard dimensions
    widthMeters: 1984, 
    heightMeters: 1984, 

    // Sort Left-to-Right
    garrisonSort: "x",

    // US (South) points North (180), GER (North) points South (0)

    strongpoints: [
      // --- ALLIED DEFAULT GARRISONS (US) ---
      // Y-Inverted
      { label: "Default Garrison 2", id: "US_G_OFF_1", gameX: -13417.00, gameY: 32425.00, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 1", id: "US_G_OFF_2", gameX: -37577.00, gameY: 47671.00, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: 47033.00, gameY: 37027.00, radius: 500, team: "us", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN DEFENDERS) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 10455.25, gameY: -32351.98, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: -37271.20, gameY: -24808.20, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 44296.13, gameY: -27064.91, radius: 500, team: "ger", type: "garrison_default" },

      // NOTE: Sectors grouped by MapMeta InitialOwner, NOT by geographic position.

      // --- AXIS SECTORS ---
      { label: "ROAD TO RECOGNE", id: "B11", gameX: -49755.0, gameY: 74340.0, radius: 2750.0, team: "ger", type: "strongpoint" }, 
      { label: "COBRU APPROACH", id: "B13", gameX: 9952.0, gameY: 74787.0, radius: 3500.0, team: "ger", type: "strongpoint" },  
      { label: "ROAD TO NOVILLE", id: "B12", gameX: 38286.18, gameY: 76947.95, radius: 5343.75, team: "ger", type: "strongpoint" }, 
      { label: "COBRU FACTORY", id: "B10", gameX: -29988.0, gameY: 44676.0, radius: 5500.0, team: "ger", type: "strongpoint" }, 
      { label: "FOY", id: "B15", gameX: -9586.0, gameY: 34052.0, radius: 3250.0, team: "ger", type: "strongpoint" }, 
      { label: "FLAK BATTERY", id: "B8", gameX: 45241.0, gameY: 39594.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 

      // --- NEUTRAL SECTORS ---
      { label: "WEST BEND", id: "B9", gameX: -53153.0, gameY: 12966.0, radius: 5500.0, team: "neu", type: "strongpoint" }, 
      { label: "SOUTHERN EDGE", id: "B3", gameX: -1114.0, gameY: -589.0, radius: 4738.37, team: "neu", type: "strongpoint" }, 
      { label: "DUGOUT BARN", id: "B14", gameX: 46085.04, gameY: 4721.09, radius: 4139.88, team: "neu", type: "strongpoint" }, 

      // --- ALLIES SECTORS ---
      { label: "N30 HIGHWAY", id: "B4", gameX: -38407.0, gameY: -31775.0, radius: 6250.0, team: "us", type: "strongpoint" }, 
      { label: "BIZORY-FOY ROAD", id: "B2", gameX: 10035.0, gameY: -39390.0, radius: 3500.0, team: "us", type: "strongpoint" }, 
      { label: "EASTERN OURTHE", id: "B1", gameX: 45845.0, gameY: -27822.0, radius: 4531.25, team: "us", type: "strongpoint" }, 
      { label: "ROAD TO BASTOGNE", id: "B7", gameX: -52862.0, gameY: -63773.0, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "BOIS JACQUES", id: "B5", gameX: -5582.0, gameY: -68237.0, radius: 5000.0, team: "us", type: "strongpoint" }, 
      { label: "FOREST OUTSKIRTS", id: "B6", gameX: 46279.0, gameY: -67141.0, radius: 5000.0, team: "us", type: "strongpoint" }
    ],
  },
H4: { 
    name: "Hill 400", 
    image: "images/maps/map_hill400.webp", 
    thumbnail: "images/maps/thumbnail/H4.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },

    widthMeters: 1984, 
    heightMeters: 1984, 
    garrisonSort: "y",

    strongpoints: [
      // --- ALLIED DEFAULT GARRISONS (US OFFENSIVE) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: 27630.57, gameY: 2366.25, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: 34901.45, gameY: -44742.10, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: 27398.98, gameY: 36307.15, radius: 500, team: "us", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN DEFENDERS) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: -34757.00, gameY: -10481.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: -40938.00, gameY: 47070.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: -40806.00, gameY: -29356.00, radius: 500, team: "ger", type: "garrison_default" },

      // NOTE: Sectors grouped by MapMeta InitialOwner, NOT by geographic position.

      // --- ALLIES SECTORS ---
      { label: "FEDERHECKE JUNCTION", id: "B1", gameX: -65367.926, gameY: -2874.167, radius: 4250.0, team: "us", type: "strongpoint" },
      { label: "CONVOY AMBUSH", id: "B2", gameX: -65875.18, gameY: 36966.816, radius: 3000.0, team: "us", type: "strongpoint" },
      { label: "STUCKCHEN FARM", id: "B3", gameX: -63938.484, gameY: -42413.004, radius: 3000.0, team: "us", type: "strongpoint" },
      { label: "BERGSTEIN CHURCH", id: "B4", gameX: -30580.357, gameY: -8420.501, radius: 3000.0, team: "us", type: "strongpoint" },
      { label: "ROER RIVER HOUSE", id: "B5", gameX: -38405.066, gameY: 43380.766, radius: 3000.0, team: "us", type: "strongpoint" },
      { label: "KIRCHWEG", id: "B6", gameX: -41257.29, gameY: -31282.14, radius: 3000.0, team: "us", type: "strongpoint" },

      // --- NEUTRAL SECTORS ---
      { label: "FLAK PITS", id: "B7", gameX: 1384.489, gameY: 33584.805, radius: 3000.0, team: "neu", type: "strongpoint" },
      { label: "HILL 400", id: "B8", gameX: -1408.900, gameY: -4698.044, radius: 5000.0, team: "neu", type: "strongpoint" },
      { label: "SOUTHERN APPROACH", id: "B9", gameX: 948.213, gameY: -25170.994, radius: 3000.0, team: "neu", type: "strongpoint" },

      // --- AXIS SECTORS ---
      { label: "EASTERN SLOPE", id: "B10", gameX: 29662.375, gameY: 3406.845, radius: 3000.0, team: "ger", type: "strongpoint" },
      { label: "TRAIN WRECK", id: "B11", gameX: 32129.537, gameY: -43600.098, radius: 3000.0, team: "ger", type: "strongpoint" },
      { label: "PAPER MILL", id: "B12", gameX: 69319.79, gameY: -39032.61, radius: 3000.0, team: "ger", type: "strongpoint" },
      { label: "ROER RIVER CROSSING", id: "B13", gameX: 64685.836, gameY: 33321.977, radius: 3000.0, team: "ger", type: "strongpoint" },
      { label: "ZERKALL", id: "B14", gameX: 78823.555, gameY: 9569.677, radius: 5000.0, team: "ger", type: "strongpoint" },
      { label: "ESELSWEG JUNCTION", id: "B15", gameX: 26549.63, gameY: 41028.504, radius: 3000.0, team: "ger", type: "strongpoint" }
    ],
  },
  HUR: {
    name: "Hürtgen Forest",
    image: "images/maps/map_hurtgen.webp", // Verify filename
    thumbnail: "images/maps/thumbnail/HUR.webp",
    teams: { t1: "UNITED STATES", t2: "GERMANY" },

    widthMeters: 1984,
    heightMeters: 1984,

    garrisonSort: "y",

    strongpoints: [
      // --- ALLIED DEFAULT GARRISONS (US OFFENSIVE) ---
      // Y-Inverted
      { label: "Default Garrison 2", id: "US_G_OFF_1", gameX: 33248.29, gameY: -9884.67, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 1", id: "US_G_OFF_2", gameX: 21414.85, gameY: 24130.46, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: 29620.77, gameY: -54180.13, radius: 500, team: "us", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN DEFENDERS) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: -34757.00, gameY: -10481.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: -40938.00, gameY: 47070.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: -40806.00, gameY: -28782.00, radius: 500, team: "ger", type: "garrison_default" },

      // --- ALLIES SECTORS (Col 1 & 2) ---
      { label: "LUMBER YARD", id: "B1", gameX: -77356.0, gameY: -36029.0, radius: 4000.0, team: "us", type: "strongpoint" }, // Booster 9 (Scale 4.0 * 1000)
      { label: "RESERVE STATION", id: "B2", gameX: -78776.0, gameY: -2238.0, radius: 4500.0, team: "us", type: "strongpoint" }, // Booster 11 (Scale 4.5 * 1000)
      { label: "MAUSBACH APPROACH", id: "B3", gameX: -74423.0, gameY: 46733.0, radius: 4625.0, team: "us", type: "strongpoint" }, // Booster 20 (Scale 4.625 * 1000)
      { label: "THE RUIN", id: "B4", gameX: -42793.0, gameY: -26141.0, radius: 4400.0, team: "us", type: "strongpoint" }, // Booster 7 (Scale 5.5 * Explicit 800)
      { label: "KALL TRAIL", id: "B5", gameX: -35755.0, gameY: -2459.0, radius: 6000.0, team: "us", type: "strongpoint" }, // Booster 13 (Scale 6.0 * 1000)
      { label: "WEHEBACH OVERLOOK", id: "B6", gameX: -38278.0, gameY: 34416.0, radius: 5031.25, team: "us", type: "strongpoint" }, // Booster 19 (Scale 5.03125 * 1000)

      // --- NEUTRAL SECTORS (Col 3) ---
      { label: "THE SIEGFRIED LINE", id: "B7", gameX: -3711.0, gameY: -42305.0, radius: 4500.0, team: "neu", type: "strongpoint" }, // Booster 31 (Scale 4.5 * 1000)
      { label: "THE SCAR", id: "B8", gameX: -6935.0, gameY: -3328.0, radius: 3015.0, team: "neu", type: "strongpoint" }, // Booster 3 (Scale 2.25 * Explicit 1340)
      { label: "NORTH PASS", id: "B9", gameX: 6540.0, gameY: 49329.0, radius: 4347.0, team: "neu", type: "strongpoint" }, // Booster 17 (Scale 3.25 * Explicit 1337)

      // --- AXIS SECTORS (Col 4 & 5) ---
      { label: "SALIENT 42", id: "B10", gameX: 40632.0, gameY: -50244.0, radius: 3250.0, team: "ger", type: "strongpoint" }, // Booster 26 (Scale 3.25 * 1000)
      { label: "JACOB'S BARN", id: "B11", gameX: 37658.0, gameY: -8531.0, radius: 3500.0, team: "ger", type: "strongpoint" }, // Booster 15 (Scale 3.5 * 1000)
      { label: "HILL 15", id: "B12", gameX: 45628.0, gameY: 34330.0, radius: 4500.0, team: "ger", type: "strongpoint" }, // Booster 22 (Scale 4.5 * 1000)
      { label: "LOGGING CAMP", id: "B13", gameX: 64477.0, gameY: -51502.0, radius: 3750.0, team: "ger", type: "strongpoint" }, // Booster 28 (Scale 3.75 * 1000)
      { label: "HURTGEN APPROACH", id: "B14", gameX: 67776.0, gameY: -6558.0, radius: 3500.0, team: "ger", type: "strongpoint" }, // Booster 1 (Scale 3.5 * 1000)
      { label: "GROSSHAU APPROACH", id: "B15", gameX: 73663.0, gameY: 38895.0, radius: 3750.0, team: "ger", type: "strongpoint" }  // Booster 24 (Scale 3.75 * 1000)
    ],
  },
KHA: {
    name: "Kharkov",
    image: "images/maps/map_kharkov.webp",
    thumbnail: "images/maps/thumbnail/KHA.webp",
    teams: { t1: "SOVIET UNION", t2: "GERMANY" },

    widthMeters: 1984, // Confirmed
    heightMeters: 1984,

    garrisonSort: "x",

    strongpoints: [
      // --- ALLIED DEFAULT GARRISONS (SOVIET UNION) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "RUS_G_OFF_1", gameX: 38030.58, gameY: -55813.09, radius: 500, team: "rus", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "RUS_G_OFF_2", gameX: 7553.50, gameY: -57680.65, radius: 500, team: "rus", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "RUS_G_OFF_3", gameX: -42268.49, gameY: -57651.53, radius: 500, team: "rus", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: -29773.33, gameY: 58520.91, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 12885.42, gameY: 59340.52, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 53334.35, gameY: 53076.24, radius: 500, team: "ger", type: "garrison_default" },

      // NOTE: Sectors grouped by MapMeta InitialOwner, NOT by geographic position.
      
      // --- AXIS SECTORS ---
      { label: "WEHRMACHT OUTLOOK", id: "B1", gameX: -37313.91, gameY: -72972.37, radius: 3750.0, team: "ger", type: "strongpoint" },
      { label: "HAY STORAGE", id: "B2", gameX: 4240.65, gameY: -71736.38, radius: 3750.0, team: "ger", type: "strongpoint" },
      { label: "OVERPASS", id: "B3", gameX: 41180.39, gameY: -70416.95, radius: 3750.0, team: "ger", type: "strongpoint" },
      { label: "RIVER CROSSING", id: "B4", gameX: -27116.35, gameY: -40003.02, radius: 3750.0, team: "ger", type: "strongpoint" },
      { label: "BELGOROD OUTSKIRTS", id: "B5", gameX: 8105.97, gameY: -38673.01, radius: 9000.0, team: "ger", type: "strongpoint" },
      { label: "LUMBERYARD", id: "B6", gameX: 46774.79, gameY: -37490.91, radius: 3750.0, team: "ger", type: "strongpoint" },

      // --- NEUTRAL SECTORS ---
      { label: "WATER MILL", id: "B7", gameX: -36761.05, gameY: 3563.89, radius: 3750.0, team: "neu", type: "strongpoint" },
      { label: "ST MARY", id: "B8", gameX: 6074.99, gameY: 633.23, radius: 6000.0, team: "neu", type: "strongpoint" },
      { label: "DISTILLERY", id: "B9", gameX: 44449.21, gameY: 4542.49, radius: 3750.0, team: "neu", type: "strongpoint" },

      // --- ALLIES SECTORS ---
      { label: "BITTER SPRING", id: "B10", gameX: -37433.28, gameY: 38891.41, radius: 8000.0, team: "us", type: "strongpoint" },
      { label: "LUMBER WORKS", id: "B11", gameX: 7916.14, gameY: 39814.16, radius: 3750.0, team: "us", type: "strongpoint" },
      { label: "WINDMILL HILLSIDE", id: "B12", gameX: 46877.23, gameY: 41370.87, radius: 3750.0, team: "us", type: "strongpoint" },
      { label: "MARSH TOWN", id: "B13", gameX: -36517.52, gameY: 70661.75, radius: 3750.0, team: "us", type: "strongpoint" },
      { label: "SOVIET VANTAGE POINT", id: "B14", gameX: 8032.91, gameY: 70714.63, radius: 3750.0, team: "us", type: "strongpoint" },
      { label: "GERMAN FUEL DUMP", id: "B15", gameX: 41168.31, gameY: 70231.15, radius: 3750.0, team: "us", type: "strongpoint" }
    ],
  },
KUR: { 
    name: "Kursk", 
    image: "images/maps/map_kursk.webp", 
    thumbnail: "images/maps/thumbnail/KUR.webp", 
    teams: { t1: "SOVIET UNION", t2: "GERMANY" },
    
    // Confirmed 1984m
    widthMeters: 1984, 
    heightMeters: 1984, 
    
    // Soviets (North) face South (0), Germans (South) face North (180)
    garrisonSort: "x", 

    strongpoints: [
      // NOTE: Y-Coordinates Inverted (Raw Y * -1).
      // Radii = 1000 * RelativeScale3D.X
      
      // --- AXIS BASE (South / Bottom / Negative Inverted Y) ---
      // Sorted West to East
      { label: "ROAD TO KURSK", id: "B1", gameX: -31287.0, gameY: -68120.0, radius: 4500.0, team: "ger", type: "strongpoint" }, // Booster_1
      { label: "AMMO DUMP", id: "B14", gameX: -1729.0, gameY: -66294.0, radius: 5447.0, team: "ger", type: "strongpoint" }, // Booster 14
      { label: "EASTERN POSITION", id: "B13", gameX: 36100.0, gameY: -65758.0, radius: 6000.0, team: "ger", type: "strongpoint" }, // Booster 13

      // --- AXIS MID (Mid-South) ---
      { label: "RUDNO", id: "B2", gameX: -27089.0, gameY: -40069.0, radius: 6000.0, team: "ger", type: "strongpoint" }, // Booster 2
      { label: "DESTROYED BATTERY", id: "B15", gameX: -990.0, gameY: -39981.0, radius: 4500.0, team: "ger", type: "strongpoint" }, // Booster 15
      { label: "THE MUDDY CHURN", id: "B12", gameX: 41089.0, gameY: -42772.0, radius: 4500.0, team: "ger", type: "strongpoint" }, // Booster 12

      // --- NEUTRAL (Center) ---
      { label: "THE WINDMILLS", id: "B3", gameX: -26712.39, gameY: 4842.25, radius: 6000.0, team: "neu", type: "strongpoint" }, // Booster 3
      { label: "YAMKI", id: "B10", gameX: 9609.0, gameY: -3974.0, radius: 6973.0, team: "neu", type: "strongpoint" }, // Booster 10
      { label: "OLEG'S HOUSE", id: "B11", gameX: 39754.0, gameY: -7774.0, radius: 4500.0, team: "neu", type: "strongpoint" }, // Booster 11

      // --- ALLIES MID (Mid-North) ---
      { label: "PANZER'S END", id: "B4", gameX: -35117.0, gameY: 31958.0, radius: 6000.0, team: "us", type: "strongpoint" }, // Booster 4
      { label: "DEFENCE IN DEPTH", id: "B9", gameX: 1604.0, gameY: 34906.0, radius: 7022.0, team: "us", type: "strongpoint" }, // Booster 9
      { label: "LISTENING POST", id: "B8", gameX: 40413.0, gameY: 36000.0, radius: 7673.0, team: "us", type: "strongpoint" }, // Booster 8

      // --- ALLIES BASE (North / Top / Positive Inverted Y) ---
      { label: "GARRISON POSITION", id: "B5", gameX: -35117.0, gameY: 68921.0, radius: 6000.0, team: "us", type: "strongpoint" }, // Booster 5
      { label: "GRUSHKI", id: "B6", gameX: 7070.0, gameY: 68141.0, radius: 4961.0, team: "us", type: "strongpoint" }, // Booster 6
      { label: "GRUSHKI FLANK", id: "B7", gameX: 47151.0, gameY: 67169.0, radius: 4500.0, team: "us", type: "strongpoint" }, // Booster 7

      // --- GARRISON POSITIONS ---
      // --- ALLIED DEFAULT GARRISONS (SOVIET UNION) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "RUS_G_OFF_3", gameX: 32530.00, gameY: -51378.00, radius: 500, team: "rus", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "RUS_G_OFF_2", gameX: 246.00, gameY: -48598.00, radius: 500, team: "rus", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "RUS_G_OFF_1", gameX: -26434.00, gameY: -49334.00, radius: 500, team: "rus", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: -32418.80, gameY: 50750.48, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 4735.16, gameY: 56115.20, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 49035.13, gameY: 58203.72, radius: 500, team: "ger", type: "garrison_default" }
    ] 
  },
  MOR: { 
    name: "Mortain", 
    image: "images/maps/TacMap_MOR_L_1944.webp", 
    thumbnail: "images/maps/thumbnail/MOR.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },
    
    bounds: {
      minX: -100000,
      maxX: 100000,
      minY: -100000,
      maxY: 100000
    },
    
    // US garrisons on west point east (-90°), GER garrisons on east point west (90°)
    
    strongpoints: [
      // --- STRONGPOINTS (OBJECTIVES) ---

      // Booster_01
      { label: "HOTEL DE LA POSTE", id: "B1", gameX: -71664.03, gameY: 47217.445, radius: 5000.0, team: "us", type: "strongpoint" },
      // Booster_02
      { label: "FORWARD BATTERY", id: "B2", gameX: -67949.4, gameY: -6438.873, radius: 6500.0, team: "us", type: "strongpoint" },
      // Booster_03
      { label: "SOUTHERN APPROACH", id: "B3", gameX: -70344.09, gameY: -46402.33, radius: 7500.0, team: "neu", type: "strongpoint" },
      // Booster_04
      { label: "MORTAIN OUTSKIRTS", id: "B4", gameX: -49136.977, gameY: 39819.566, radius: 6000.0, team: "ger", type: "strongpoint" },
      // Booster_05
      { label: "FORWARD MEDICAL AID STATION", id: "B5", gameX: -35275.574, gameY: 2194.1567, radius: 7000.0, team: "ger", type: "strongpoint" },
      // Booster_06
      { label: "MORTAIN APPROACH", id: "B6", gameX: -42775.5, gameY: -33050.027, radius: 7000.0, team: "us", type: "strongpoint" },
      // Booster_07
      { label: "HILL 314", id: "B7", gameX: -2425.1055, gameY: 38259.5, radius: 7000.0, team: "us", type: "strongpoint" },
      // Booster_08
      { label: "LA PETITE CHAPELLE SAINT-MICHEL", id: "B8", gameX: 1725.2772, gameY: -5918.17, radius: 5000.0, team: "neu", type: "strongpoint" },
      // Booster_09
      { label: "U.S. SOUTHERN ROADBLOCK", id: "B9", gameX: -11254.05, gameY: -49076.438, radius: 7000.0, team: "ger", type: "strongpoint" },
      // Booster_10
      { label: "DESTROYED GERMAN CONVOY", id: "B10", gameX: 35469.836, gameY: 42255.99, radius: 8000.0, team: "ger", type: "strongpoint" },
      // Booster_11
      { label: "GERMAN RECON CAMP", id: "B11", gameX: 40439.145, gameY: 2510.7285, radius: 6000.0, team: "us", type: "strongpoint" },
      // Booster_12
      { label: "LES AUBRILS FARM", id: "B12", gameX: 48018.547, gameY: -26619.574, radius: 6000.0, team: "us", type: "strongpoint" },
      // Booster_13
      { label: "ABANDONED GERMAN CHECKPOINT", id: "B13", gameX: 68651.26, gameY: 40271.47, radius: 6500.0, team: "neu", type: "strongpoint" },
      // Booster_14
      { label: "GERMAN DEFENSIVE CAMP", id: "B14", gameX: 68294.46, gameY: -1986.8845, radius: 7000.0, team: "ger", type: "strongpoint" },
      // Booster_15
      { label: "LE FERME DU DESCHAMPS", id: "B15", gameX: 71327.67, gameY: -36841.695, radius: 7000.0, team: "ger", type: "strongpoint" },

      // --- ALLIED DEFAULT GARRISONS (US) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: 57562.50, gameY: 55667.50, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: 56249.00, gameY: -4872.50, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: 54332.50, gameY: -44925.00, radius: 500, team: "us", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_3", gameX: -53023.06, gameY: -55214.94, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: -47239.93, gameY: -7479.07, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_1", gameX: -43409.22, gameY: 47417.19, radius: 500, team: "ger", type: "garrison_default" }
    ]
  },
  OMA: { 
    name: "Omaha Beach", 
    image: "images/maps/map_omaha.webp", 
    thumbnail: "images/maps/thumbnail/OMA.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },
    
    // --- DIMENSIONS ---
    // Using standard 1984m square (same as Driel, Kharkov)
    // MBPBounds: -99200 to 99200 units = 1984 meters
    widthMeters: 1984,
    heightMeters: 1984,
    
    // --- GARRISON SORTING ---
    // "x": Sort garrisons Left-to-Right (West->East) for horizontal garrison lines
    // "y": Sort garrisons Top-to-Bottom (North->South) - used for Omaha since labels are North/Middle/South
    garrisonSort: "y",
    
    // --- GARRISON ROTATIONS ---
    // Germany West, US East (west<->east layout): rotate garrisons to face inward.
    // US garrisons on east side point west (90°), GER garrisons on west side point east (-90°)
    
    strongpoints: [
     
      // --- AXIS SECTORS ---
      // Y coordinates inverted (multiplied by -1) to match map image orientation
      { label: "BEAUMONT ROAD", id: "B11", gameX: -66508.0, gameY: 34528.0, radius: 5000.0, team: "ger", type: "strongpoint" }, // SphereSectorCaptureBooster12
      { label: "CROSSROADS", id: "B12", gameX: -63975.723, gameY: -2684.23, radius: 3713.8135, team: "ger", type: "strongpoint" }, // SphereSectorCaptureBooster13
      { label: "CHURCH ROAD", id: "B9", gameX: -36692.0, gameY: 9308.0, radius: 5000.0, team: "ger", type: "strongpoint" }, // SphereSectorCaptureBooster10
      { label: "REAR BATTERY", id: "B10", gameX: -40364.508, gameY: 47019.88, radius: 5000.0, team: "ger", type: "strongpoint" }, // SphereSectorCaptureBooster11
      { label: "LES ISLES", id: "B13", gameX: -65785.0, gameY: -33673.0, radius: 5000.0, team: "ger", type: "strongpoint" }, // SphereSectorCaptureBooster14
      { label: "THE ORCHARDS", id: "B8", gameX: -44319.355, gameY: -27163.912, radius: 4000.0, team: "ger", type: "strongpoint" }, // SphereSectorCaptureBooster9
      
      // --- NEUTRAL SECTORS ---
      // Y coordinates inverted (multiplied by -1) to match map image orientation
      { label: "WEST VIERVILLE", id: "B5", gameX: 4665.0, gameY: 40540.0, radius: 5000.0, team: "neu", type: "strongpoint" }, // SphereSectorCaptureBooster6
      { label: "VIERVILLE SUR MER", id: "B6", gameX: -2661.8896, gameY: 2895.0942, radius: 5000.0, team: "neu", type: "strongpoint" }, // SphereSectorCaptureBooster7
      { label: "GARRISON BATTERY", id: "B7", gameX: 2342.277, gameY: -31510.633, radius: 5000.0, team: "neu", type: "strongpoint" }, // SphereSectorCaptureBooster8
      
      // --- ALLIES SECTORS ---
      // Y coordinates inverted (multiplied by -1) to match map image orientation
      { label: "WN73", id: "B4", gameX: 54259.0, gameY: 44498.0, radius: 5000.0, team: "us", type: "strongpoint" }, // SphereSectorCaptureBooster5
      { label: "DOG GREEN", id: "B3", gameX: 67602.0, gameY: 31262.0, radius: 6250.0, team: "us", type: "strongpoint" }, // SphereSectorCaptureBooster4, Scale: 1.25
      { label: "WN71", id: "B1", gameX: 55132.387, gameY: 5791.973, radius: 3750.0, team: "us", type: "strongpoint" }, // SphereSectorCaptureBooster2, Scale: 0.75
      { label: "THE DRAW", id: "B14", gameX: 71322.0, gameY: 7432.0, radius: 3750.0, team: "us", type: "strongpoint" }, // SphereSectorCaptureBooster15, Scale: 0.75
      { label: "WN70", id: "B2", gameX: 46516.0, gameY: -30340.0, radius: 5000.0, team: "us", type: "strongpoint" }, // SphereSectorCaptureBooster3
      { label: "DOG WHITE", id: "B15", gameX: 71817.0, gameY: -30284.0, radius: 5000.0, team: "us", type: "strongpoint" }, // SphereSectorCaptureBooster16
      
      // --- GARRISON POSITIONS ---
      
      // --- ALLIED DEFAULT GARRISONS (US) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: -57248.16, gameY: 31016.25, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: -58101.41, gameY: 2042.77, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: -57429.82, gameY: -33264.43, radius: 500, team: "us", type: "garrison_default" }, 

      // --- AXIS DEFAULT GARRISONS (GERMAN) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 55624.00, gameY: 46354.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 54465.00, gameY: 8182.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 42798.00, gameY: -35575.00, radius: 500, team: "ger", type: "garrison_default" }
    ] 
  },
PHL: { 
    name: "Purple Heart Lane", 
    image: "images/maps/map_purpleheartlane.webp", 
    thumbnail: "images/maps/thumbnail/PHL.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },
    
    // Standard 1984m square map (same as Driel, Kharkov, etc.)
    widthMeters: 1984,
    heightMeters: 1984,
    
    // Sort garrisons by X coordinate (west to east) since they're arranged horizontally
    garrisonSort: "x",
    
    // US garrisons (north) point south (0°), German garrisons (south) point north (180°)
    
    strongpoints: [
      // NOTE: Map is visually south-north, Allies north, Axis south
      // Y coordinates inverted (multiplied by -1) to match map image orientation
      // Sectors grouped by MapMeta InitialOwner, NOT by geographic position
      
      // Base Radius 1000.0 from ASphereSectorCaptureBooster.cpp (SetSphereRadius 1000.0)
      
      // --- ALLIES SECTORS (North) ---
      // Y coordinates inverted (multiplied by -1) to match map image orientation
      // Ordered north to south (highest to lowest Y)
      { label: "BLOODY BEND", id: "B12", gameX: -53699.133, gameY: 68803.984, radius: 2750.0, team: "ger", type: "strongpoint" }, // Scale 2.75
      { label: "DEAD MAN'S CORNER", id: "B8", gameX: 740.8672, gameY: 65433.984, radius: 4000.0, team: "neu", type: "strongpoint" }, // Scale 4.0
      { label: "FORWARD BATTERY", id: "B6", gameX: 33330.867, gameY: 66643.984, radius: 4000.0, team: "us", type: "strongpoint" }, // Scale 4.0
      { label: "JOURDAN CANAL", id: "B14", gameX: -41489.133, gameY: 38108.99, radius: 2750.0, team: "ger", type: "strongpoint" }, // Scale 2.75
      { label: "DOUVE BRIDGE", id: "B5", gameX: -1434.0474, gameY: 26826.268, radius: 4250.0, team: "us", type: "strongpoint" }, // Scale 4.25
      { label: "DOUVE RIVER BATTERY", id: "B15", gameX: 33572.38, gameY: 36601.72, radius: 3500.0, team: "ger", type: "strongpoint" }, // Scale 3.5
      
      // --- NEUTRAL SECTORS ---
      // Ordered north to south (highest to lowest Y)
      { label: "GROULT PILLBOX", id: "B7", gameX: -37607.4, gameY: 5672.991, radius: 5500.0, team: "neu", type: "strongpoint" }, // Scale 5.5
      { label: "CARENTAN CAUSEWAY", id: "B3", gameX: 787.74744, gameY: -1346.289, radius: 3500.0, team: "us", type: "strongpoint" }, // Scale 3.5
      { label: "FLAK POSITION", id: "B13", gameX: 45592.906, gameY: 4116.6772, radius: 4750.0, team: "ger", type: "strongpoint" }, // Scale 4.75
      
      // --- AXIS SECTORS (South) ---
      // Ordered north to south (highest to lowest Y)
      { label: "MADELEINE FARM", id: "B10", gameX: -33264.676, gameY: -30204.594, radius: 3250.0, team: "ger", type: "strongpoint" }, // Scale 3.25
      { label: "MADELEINE BRIDGE", id: "B1", gameX: 1928.2188, gameY: -39878.098, radius: 3000.0, team: "us", type: "strongpoint" }, // Scale 3.0
      { label: "AID STATION", id: "B11", gameX: 47043.207, gameY: -32172.8, radius: 3250.0, team: "ger", type: "strongpoint" }, // Scale 3.25
      { label: "INGOUF CROSSROADS", id: "B9", gameX: -36344.676, gameY: -66489.59, radius: 3250.0, team: "neu", type: "strongpoint" }, // Scale 3.25
      { label: "ROAD TO CARENTAN", id: "B2", gameX: 2953.2188, gameY: -63908.098, radius: 3000.0, team: "us", type: "strongpoint" }, // Scale 3.0
      { label: "CABBAGE PATCH", id: "B4", gameX: 46253.22, gameY: -62363.098, radius: 2500.0, team: "ger", type: "strongpoint" }, // Scale 2.5
      
      // --- ALLIED DEFAULT GARRISONS (US) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: -32518.35, gameY: -25504.82, radius: 500, team: "us", type: "garrison_default" },
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: -2092.78, gameY: -28507.63, radius: 500, team: "us", type: "garrison_default" },
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: 54500.00, gameY: -23000.00, radius: 500, team: "us", type: "garrison_default" },

      // --- AXIS DEFAULT GARRISONS (GERMAN) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: -3685.27, gameY: 29972.62, radius: 500, team: "ger", type: "garrison_default" },
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 36836.18, gameY: 32692.00, radius: 500, team: "ger", type: "garrison_default" },
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: -40771.69, gameY: 36103.83, radius: 500, team: "ger", type: "garrison_default" }
    ] 
  },
REM: { 
    name: "Remagen", 
    image: "images/maps/map_remagen.webp", 
    thumbnail: "images/maps/thumbnail/REM.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },
    
    // Standard 1984m dimensions
    widthMeters: 1984, 
    heightMeters: 1984, 
    
    garrisonSort: "x",
    
    // US (South/West) faces North (180), GER (North/East) faces South (0)

    strongpoints: [
      // NOTE: Map is visually North-South.
      // Top of Map = Positive Y = German Lines
      // Bottom of Map = Negative Y = US Lines

      // --- AXIS SECTORS (North/Top) ---
      { label: "ALTE LIEBE BARSCH", id: "B11", gameX: -41114.0, gameY: 69583.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 
      { label: "BEWALDET KREUZUNG", id: "B12", gameX: -891.0, gameY: 69550.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 
      { label: "DAN RADART 512", id: "B15", gameX: 41625.0, gameY: 69063.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 
      { label: "ERPEL", id: "B10", gameX: -39275.0, gameY: 40853.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 
      { label: "ERPELER LEY", id: "B13", gameX: 9697.0, gameY: 42679.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 
      { label: "KASBACH OUTLOOK", id: "B14", gameX: 38436.418, gameY: 41098.23, radius: 4000.0, team: "ger", type: "strongpoint" }, 

      // --- NEUTRAL SECTORS (Middle/River) ---
      { label: "ST. SEVERIN CHAPEL", id: "B9", gameX: -39275.0, gameY: 12967.0, radius: 4000.0, team: "neu", type: "strongpoint" }, 
      { label: "LUDENDORFF BRIDGE", id: "B1", gameX: 3032.2412, gameY: -7.021, radius: 8000.0, team: "neu", type: "strongpoint" }, 
      { label: "BAUERNHOF AM RHEIN", id: "B6", gameX: 38817.02, gameY: -15613.944, radius: 4000.0, team: "neu", type: "strongpoint" }, 

      // --- ALLIES SECTORS (South/Bottom) ---
      { label: "REMAGEN", id: "B7", gameX: -35925.75, gameY: -39434.0, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "MÖBELFABRIK", id: "B2", gameX: -1000.0, gameY: -40824.0, radius: 5000.0, team: "us", type: "strongpoint" }, 
      { label: "SCHLIEFFEN AUSWEG", id: "B5", gameX: 39053.0, gameY: -38264.0, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "WALDBURG", id: "B8", gameX: -40954.977, gameY: -80279.71, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "MÜHLENWEG", id: "B3", gameX: 3742.6152, gameY: -72094.91, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "HAGELKREUZ", id: "B4", gameX: 37607.746, gameY: -68933.32, radius: 4000.0, team: "us", type: "strongpoint" }, 

      // --- GARRISON POSITIONS ---
      // ALLIES (US)
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: 5188.68, gameY: 47351.95, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: -43091.75, gameY: 42371.53, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: 36137.86, gameY: 41495.47, radius: 500, team: "us", type: "garrison_default" }, 

      // AXIS (GER)
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 1875.95, gameY: -42865.25, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: -33251.79, gameY: -38880.36, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 38210.52, gameY: -36642.55, radius: 500, team: "ger", type: "garrison_default" }
    ]
  },
SMM: { 
    name: "Sainte-Marie-du-Mont", 
    image: "images/maps/map_smdmv2.webp", 
    thumbnail: "images/maps/thumbnail/SMM.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },
    
    // Standard 1984m dimensions
    widthMeters: 1984, 
    heightMeters: 1984, 
    
    // US (North) Faces South (0), GER (South) Faces North (180)
    garrisonSort: "x", 

    strongpoints: [
      // NOTE: Y-Coordinates Inverted (Raw Y * -1).
      // Radii calculated: Base Radius * RelativeScale3D.X
      // Sorted North (Top) to South (Bottom).

      // --- ALLIES SECTORS (North - Positive Inverted Y) ---
      // US Base
      { label: "WINTERS LANDING", id: "B2", gameX: -39503.26, gameY: 78343.03, radius: 5755.0, team: "us", type: "strongpoint" }, // Scale 1.278
      { label: "LE GRAND CHEMIN", id: "B3", gameX: -367.0, gameY: 76667.0, radius: 4500.0, team: "us", type: "strongpoint" }, // No Scale
      { label: "THE BARN", id: "B4", gameX: 44896.0, gameY: 73822.0, radius: 5691.0, team: "us", type: "strongpoint" }, // Scale 1.264

      // US Mid
      { label: "BRECOURT BATTERY", id: "B1", gameX: -39380.0, gameY: 39702.0, radius: 6079.0, team: "us", type: "strongpoint" }, // Scale 1.35
      { label: "CATTLESHEDS", id: "B11", gameX: 2961.32, gameY: 41557.40, radius: 5401.0, team: "us", type: "strongpoint" }, // Scale 1.20
      { label: "RUE DE LA GARE", id: "B12", gameX: 35565.56, gameY: 39370.59, radius: 5893.0, team: "us", type: "strongpoint" }, // Scale 1.309

      // --- NEUTRAL SECTORS (Center) ---
      { label: "THE DUGOUT", id: "B13", gameX: -37170.91, gameY: 151.19, radius: 5815.0, team: "neu", type: "strongpoint" }, // Scale 1.292
      { label: "AA NETWORK", id: "B5", gameX: 1716.0, gameY: -2530.0, radius: 6531.0, team: "neu", type: "strongpoint" }, // Scale 1.451
      { label: "PIERRE'S FARM", id: "B6", gameX: 37508.1, gameY: -1336.70, radius: 5207.0, team: "neu", type: "strongpoint" }, // Scale 1.157

      // --- AXIS SECTORS (South - Negative Inverted Y) ---
      // GER Mid
      { label: "HUGO'S FARM", id: "B10", gameX: -38001.0, gameY: -38089.0, radius: 6046.0, team: "ger", type: "strongpoint" }, // Scale 1.343
      { label: "THE HAMLET", id: "B15", gameX: -2158.77, gameY: -42649.31, radius: 4500.0, team: "ger", type: "strongpoint" }, // No Scale
      { label: "STE MARIE DU MONT", id: "B14", gameX: 47022.13, gameY: -50258.56, radius: 6000.0, team: "ger", type: "strongpoint" }, // Base Radius 6000

      // GER Base
      { label: "THE CORNER", id: "B9", gameX: -34620.76, gameY: -69152.77, radius: 5106.0, team: "ger", type: "strongpoint" }, // Scale 1.134
      { label: "HILL 6", id: "B8", gameX: 142.14, gameY: -76822.93, radius: 4500.0, team: "ger", type: "strongpoint" }, // No Scale
      { label: "THE FIELDS", id: "B7", gameX: 39750.15, gameY: -78234.78, radius: 4500.0, team: "ger", type: "strongpoint" }, // No Scale

      // --- GARRISON POSITIONS ---
      // ALLIES (US) - North (Positive Y)
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: 2216.60, gameY: -40251.93, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: -38699.64, gameY: -32769.35, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: 43059.09, gameY: -27670.55, radius: 500, team: "us", type: "garrison_default" }, 

      // AXIS (GER) - South (Negative Y)
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 2822.15, gameY: 34951.49, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 28732.78, gameY: 38327.42, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: -36957.57, gameY: 33759.08, radius: 500, team: "ger", type: "garrison_default" }
    ] 
  },
  SME: { 
    name: "Sainte-Mère-Église", 
    image: "images/maps/map_stmereeglise.webp", 
    thumbnail: "images/maps/thumbnail/SME.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },
    
    // Standard 2000m dimensions
    widthMeters: 1984, 
    heightMeters: 1984, 
    
    // US (East) faces West (90), GER (West) faces East (-90)
    garrisonSort: "y", 

    strongpoints: [
      // NOTE: Y-Coordinates Inverted.
      // Map is West (Left/Ger) to East (Right/US).

      // --- ALLIES SECTORS (East - Positive X) ---
      // US Base (Far East)
      { label: "LES VIEUX VERGERS", id: "B3", gameX: 70168.0, gameY: 28861.0, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "CROSS ROADS", id: "B2", gameX: 72279.0, gameY: -1393.0, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "RUISSEAU DE FERME", id: "B1", gameX: 72138.0, gameY: -38912.0, radius: 4000.0, team: "us", type: "strongpoint" }, 

      // US Mid (Mid-East)
      { label: "GARRISON BATTERY", id: "B4", gameX: 39652.0, gameY: 34374.0, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "THE CEMETERY", id: "B5", gameX: 28858.0, gameY: -5593.0, radius: 4000.0, team: "us", type: "strongpoint" }, 
      { label: "MAISON DU CRIQUE", id: "B6", gameX: 25884.0, gameY: -30530.0, radius: 4000.0, team: "us", type: "strongpoint" }, 

      // --- NEUTRAL SECTORS (Center - Near X=0) ---
      { label: "HOSPICE", id: "B15", gameX: -1100.0, gameY: 46000.0, radius: 4000.0, team: "neu", type: "strongpoint" }, 
      { label: "SAINTE-MÈRE-ÉGLISE", id: "B7", gameX: 5949.0, gameY: 7436.0, radius: 4741.0, team: "neu", type: "strongpoint" }, 
      { label: "CHECKPOINT", id: "B10", gameX: 467.0, gameY: -32490.0, radius: 4000.0, team: "neu", type: "strongpoint" }, 

      // --- AXIS SECTORS (West - Negative X) ---
      // GER Mid (Mid-West)
      { label: "ROUTE DU HARAS", id: "B11", gameX: -40886.0, gameY: 37779.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 
      { label: "WESTERN APPROACH", id: "B8", gameX: -32652.0, gameY: 14761.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 
      { label: "RUE DE GAMBOSVILLE", id: "B9", gameX: -34553.0, gameY: -41733.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 

      // GER Base (Far West)
      { label: "FLAK POSITION", id: "B12", gameX: -69311.0, gameY: 40772.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 
      { label: "VAULAVILLE", id: "B13", gameX: -62223.0, gameY: 3146.0, radius: 2507.0, team: "ger", type: "strongpoint" }, 
      { label: "LA PRAIRIE", id: "B14", gameX: -67517.0, gameY: -35037.0, radius: 4000.0, team: "ger", type: "strongpoint" }, 

      // --- GARRISON POSITIONS ---
      // ALLIES (US)
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: -27706.96, gameY: 18384.22, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: -35147.62, gameY: 43375.20, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: -31840.40, gameY: -38751.82, radius: 500, team: "us", type: "garrison_default" }, 

      // AXIS (GER)
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 36550.00, gameY: -5050.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 39210.00, gameY: 29200.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 43270.00, gameY: -42620.00, radius: 500, team: "ger", type: "garrison_default" }
    ] 
  },
  SMO: { 
    name: "Smolensk", 
    image: "images/maps/TacMap_SMO_L_1943.webp", 
    thumbnail: "images/maps/thumbnail/SMO.webp", 
    teams: { t1: "SOVIET UNION", t2: "GERMANY" },
    
    // Confirmed 2000m based on data spread
    widthMeters: 2000, 
    heightMeters: 2000, 
    
    // Soviets (East) face West (90), Germans (West) face East (-90)
    garrisonSort: "y", 

    strongpoints: [
      // NOTE: Y-Coordinates Inverted.
      // Map is West (Left/Ger) to East (Right/Sov).
      // North = Positive Inverted Y (Top)
      // South = Negative Inverted Y (Bottom)

      // --- AXIS SECTORS (West - Negative X) ---
      // GER Base (Far West)
      { label: "PANZER LOADING STATION", id: "SMO_GER_Base1", gameX: -68850.08, gameY: 40044.95, radius: 7000.0, team: "ger", type: "strongpoint" }, // Booster 16 (Top/North)
      { label: "TRAM DEPOT", id: "SMO_GER_Base2", gameX: -67850.08, gameY: 5084.95, radius: 7000.0, team: "ger", type: "strongpoint" }, // Booster 21 (Mid)
      { label: "SMOLENSK OUTSKIRTS", id: "SMO_GER_Base3", gameX: -68850.08, gameY: -40680.05, radius: 6500.0, team: "ger", type: "strongpoint" }, // Booster 26 (Bottom/South)

      // GER Mid (Mid-West)
      { label: "SMOLENSK HAUPTBAHNHOF", id: "SMO_GER_Mid1", gameX: -38450.08, gameY: 40044.95, radius: 7000.0, team: "ger", type: "strongpoint" }, // Booster 17 (Top/North)
      { label: "LUMBER YARD", id: "SMO_GER_Mid2", gameX: -36050.08, gameY: -8915.05, radius: 9000.0, team: "ger", type: "strongpoint" }, // Booster 22 (Mid - Large Radius)
      { label: "DNIEPER WEST CROSSING", id: "SMO_GER_Mid3", gameX: -40450.08, gameY: -39680.05, radius: 7000.0, team: "ger", type: "strongpoint" }, // Booster 27 (Bottom/South)

      // --- NEUTRAL SECTORS (Center - Near X=0) ---
      { label: "PYATNITSKII OVERPASS", id: "SMO_Mid1", gameX: 1000.0, gameY: 38544.95, radius: 6500.0, team: "neu", type: "strongpoint" }, // Booster 18 (Top/North)
      { label: "ZHELYABOVA SQUARE", id: "SMO_Mid2", gameX: 1000.0, gameY: 0.0, radius: 6500.0, team: "neu", type: "strongpoint" }, // Booster 23 (Mid)
      { label: "84TH BATTALION BRIDGE", id: "SMO_Mid3", gameX: 1000.0, gameY: -40680.05, radius: 6000.0, team: "neu", type: "strongpoint" }, // Booster 28 (Bottom/South)

      // --- SOVIET SECTORS (East - Positive X) ---
      // SOV Mid (Mid-East)
      { label: "ZADNEPROVIE DISTRICT", id: "SMO_SOV_Mid1", gameX: 39264.92, gameY: 40444.95, radius: 6500.0, team: "us", type: "strongpoint" }, // Booster 19 (Top/North)
      { label: "MOSKOVSKAYA STREET", id: "SMO_SOV_Mid2", gameX: 39764.92, gameY: 1084.95, radius: 6500.0, team: "us", type: "strongpoint" }, // Booster 24 (Mid)
      { label: "SMOLENSK CITADEL", id: "SMO_SOV_Mid3", gameX: 39264.92, gameY: -40680.05, radius: 7000.0, team: "us", type: "strongpoint" }, // Booster 29 (Bottom/South)

      // SOV Base (Far East)
      { label: "RAILYARD STORAGE", id: "SMO_SOV_Base1", gameX: 68709.92, gameY: 40044.95, radius: 7000.0, team: "us", type: "strongpoint" }, // Booster 20 (Top/North)
      { label: "APARTMENT BLOCK", id: "SMO_SOV_Base2", gameX: 69209.92, gameY: 1084.95, radius: 7000.0, team: "us", type: "strongpoint" }, // Booster 25 (Mid)
      { label: "BOMBARDED RIVERFRONT", id: "SMO_SOV_Base3", gameX: 69209.92, gameY: -40080.05, radius: 7000.0, team: "us", type: "strongpoint" }, // Booster 30 (Bottom/South)

      // --- GARRISON POSITIONS ---
      // SOVIETS (West - Negative X)
      // Y-Inverted
      { label: "Default Garrison 1", id: "RUS_G_OFF_1", gameX: -49225.00, gameY: 3875.00, radius: 500, team: "rus", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "RUS_G_OFF_2", gameX: -54375.00, gameY: 44225.00, radius: 500, team: "rus", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "RUS_G_OFF_3", gameX: -51650.00, gameY: -38350.00, radius: 500, team: "rus", type: "garrison_default" }, 

      // GERMANS (East - Positive X)
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 46765.00, gameY: 750.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 50745.00, gameY: 45155.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 48850.00, gameY: -40765.00, radius: 500, team: "ger", type: "garrison_default" }
    ] 
  },
STA: { 
    name: "Stalingrad", 
    image: "images/maps/map_stalingrad.webp", 
    thumbnail: "images/maps/thumbnail/STA.webp", 
    teams: { t1: "SOVIET UNION", t2: "GERMANY" },
    
    // Confirmed 1984m (MbPBounds -99200 to 99200)
    widthMeters: 1984, 
    heightMeters: 1984, 
    
    // Soviets (East) face West (90), Germans (West) face East (-90)
    garrisonSort: "y", 

    strongpoints: [
      // NOTE: IDs updated to match SphereSectorCaptureBooster numbers.
      // Coordinates: Exact Booster location (Y inverted).
      // Radii: Confirmed from STA_gameplay file (Large radii: 7000-9500).

      // --- AXIS SECTORS (West - Negative X) ---
      // GER Base (Far West)
      { label: "CITY OVERLOOK", id: "B11", gameX: -69346.0, gameY: -48417.0, radius: 8000.0, team: "ger", type: "strongpoint" }, // Booster 11 (North)
      { label: "NAIL FACTORY", id: "B10", gameX: -71016.0, gameY: -11068.0, radius: 8000.0, team: "ger", type: "strongpoint" }, // Booster 10 (Mid)
      { label: "MAMAYEV APPROACH", id: "B9", gameX: -69500.0, gameY: 47966.0, radius: 7000.0, team: "ger", type: "strongpoint" }, // Booster 9 (South)

      // GER Mid (Mid-West)
      { label: "KOMSOMOL HQ", id: "B14", gameX: -39683.0, gameY: -39676.0, radius: 8000.0, team: "ger", type: "strongpoint" }, // Booster 14 (North)
      { label: "YELLOW HOUSE", id: "B12", gameX: -39693.0, gameY: 1.5, radius: 8000.0, team: "ger", type: "strongpoint" }, // Booster 12 (Mid)
      { label: "DOLGIY RAVINE", id: "B8", gameX: -39681.0, gameY: 48845.0, radius: 7500.0, team: "ger", type: "strongpoint" }, // Booster 8 (South)

      // --- NEUTRAL SECTORS (Center - Near X=0) ---
      { label: "TRAIN STATION", id: "B15", gameX: 6.0, gameY: -39678.0, radius: 8000.0, team: "neu", type: "strongpoint" }, // Booster 15 (North)
      { label: "CARRIAGE DEPOT", id: "B13", gameX: -15.0, gameY: -13.0, radius: 8500.0, team: "neu", type: "strongpoint" }, // Booster 13 (Mid)
      { label: "RAILWAY CROSSING", id: "B7", gameX: 7.0, gameY: 39673.0, radius: 8000.0, team: "neu", type: "strongpoint" }, // Booster 7 (South)

      // --- SOVIET SECTORS (East - Positive X) ---
      // SOV Mid (Mid-East)
      { label: "THE BREWERY", id: "B3", gameX: 39674.0, gameY: -41970.0, radius: 7500.0, team: "us", type: "strongpoint" }, // Booster 3 (North)
      { label: "PAVLOV'S HOUSE", id: "B1", gameX: 48586.0, gameY: -1452.0, radius: 7000.0, team: "us", type: "strongpoint" }, // Booster 1 (Mid)
      { label: "HOUSE OF THE WORKERS", id: "B5", gameX: 36591.0, gameY: 40602.0, radius: 9500.0, team: "us", type: "strongpoint" }, // Booster 5 (South - Largest!)

      // SOV Base (Far East)
      { label: "VOLGA BANKS", id: "B4", gameX: 70121.0, gameY: -43351.0, radius: 7500.0, team: "us", type: "strongpoint" }, // Booster 4 (North)
      { label: "GRUDININ'S MILL", id: "B2", gameX: 70063.0, gameY: 32.0, radius: 7000.0, team: "us", type: "strongpoint" }, // Booster 2 (Mid)
      { label: "L-SHAPED HOUSE", id: "B6", gameX: 68875.0, gameY: 35043.0, radius: 7500.0, team: "us", type: "strongpoint" }, // Booster 6 (South)

      // --- GARRISON POSITIONS ---
      // SOVIETS (West - Negative X)
      // Y-Inverted
      // --- GARRISON POSITIONS ---
      // SOVIETS (West - Negative X)
      // Source Y values were: -50565, 10470, 52132
      // Inverted Y values: 50565, -10470, -52132
      { label: "Default Garrison 1", id: "RUS_G_OFF_1", gameX: -44801.00, gameY: 50565.00, radius: 500, team: "rus", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "RUS_G_OFF_2", gameX: -51768.00, gameY: -10470.00, radius: 500, team: "rus", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "RUS_G_OFF_3", gameX: -50113.00, gameY: -52132.00, radius: 500, team: "rus", type: "garrison_default" }, 

      // GERMANS (East - Positive X)
      // Source Y values were: -41336.344, 264.4093, 35575
      // Inverted Y values: 41336.34, -264.41, -35575
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 56870.99, gameY: 41336.34, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 54428.96, gameY: -264.41, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 57118.00, gameY: -35575.00, radius: 500, team: "ger", type: "garrison_default" }
    ] 
  },
  TOB: {
    name: "Tobruk",
    image: "images/maps/TacMap_TOB_L_1942.webp",
    thumbnail: "images/maps/thumbnail/TOB.webp",
    teams: { t1: "BRITISH 8TH ARMY", t2: "GERMANY" },

    widthMeters: 2000,
    heightMeters: 2000,

    garrisonSort: "y",

    strongpoints: [
      // --- AXIS GARRISONS (Germany) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 49759.11, gameY: 8011.74, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 54440.39, gameY: -44951.82, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 54452.22, gameY: 40605.42, radius: 500, team: "ger", type: "garrison_default" }, 

      // --- ALLIES GARRISONS (British) ---
      // Y-Inverted
      { label: "Default Garrison 1", id: "GB_G_OFF_1", gameX: -52663.07, gameY: 1503.00, radius: 500, team: "allies", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GB_G_OFF_2", gameX: -48623.04, gameY: 31560.61, radius: 500, team: "allies", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GB_G_OFF_3", gameX: -50216.48, gameY: -34742.76, radius: 500, team: "allies", type: "garrison_default" },

      // --- AXIS SECTORS (Col 1 & 2) ---
      { label: "GUARD ROOM", id: "B1", gameX: -68855.0, gameY: 27530.0, radius: 7000.0, team: "ger", type: "strongpoint" },
      { label: "TANK GRAVEYARD", id: "B2", gameX: -69405.0, gameY: 2075.0, radius: 8000.0, team: "ger", type: "strongpoint" },
      { label: "DIVISION HEADQUARTERS", id: "B3", gameX: -69835.0, gameY: -45005.0, radius: 7000.0, team: "ger", type: "strongpoint" },
      { label: "WEST CREEK", id: "B4", gameX: -40077.0, gameY: 44015.0, radius: 8000.0, team: "ger", type: "strongpoint" },
      { label: "ALBERGO RISTORANTE MODERNO", id: "B5", gameX: -29536.5, gameY: -2241.0, radius: 7000.0, team: "ger", type: "strongpoint" },
      { label: "KING SQUARE", id: "B6", gameX: -29485.1, gameY: -39744.3, radius: 8000.0, team: "ger", type: "strongpoint" },

      // --- NEUTRAL SECTORS (Col 3) ---
      { label: "DESERT RAT CAVES", id: "B7", gameX: 31.2, gameY: 39665.2, radius: 8000.0, team: "neu", type: "strongpoint" },
      { label: "CHURCH GROUNDS", id: "B8", gameX: 59.9, gameY: -11770.0, radius: 7000.0, team: "neu", type: "strongpoint" },
      { label: "ADMIRALTY HOUSE", id: "B9", gameX: 7919.4, gameY: -48901.8, radius: 9000.0, team: "neu", type: "strongpoint" },

      // --- ALLIES SECTORS (Col 4 & 5) ---
      { label: "ABANDONED AMMO CACHE", id: "B10", gameX: 39687.5, gameY: 39659.9, radius: 8000.0, team: "us", type: "strongpoint" },
      { label: "8TH ARMY MEDICAL HOSPITAL", id: "B11", gameX: 40124.0, gameY: 2845.0, radius: 9000.0, team: "us", type: "strongpoint" },
      { label: "SUPPLY DUMP", id: "B12", gameX: 39820.5, gameY: -43918.3, radius: 9000.0, team: "us", type: "strongpoint" },
      { label: "ROAD TO SENUSSI MINE", id: "B13", gameX: 69522.8, gameY: 40790.0, radius: 7000.0, team: "us", type: "strongpoint" },
      { label: "MAKESHIFT AID STATION", id: "B14", gameX: 69380.0, gameY: -25.0, radius: 9000.0, team: "us", type: "strongpoint" },
      { label: "CARGO WAREHOUSES", id: "B15", gameX: 70047.3, gameY: -41171.9, radius: 8000.0, team: "us", type: "strongpoint" }
    ],
  },
UTA: { 
    name: "Utah Beach", 
    image: "images/maps/map_utahbeach.webp", 
    thumbnail: "images/maps/thumbnail/UTA.webp", 
    teams: { t1: "UNITED STATES", t2: "GERMANY" },
    
    // Confirmed 1984m (Standard Warfare Map)
    widthMeters: 1984, 
    heightMeters: 1984, 
    
    // US (East) faces West (90), GER (West) faces East (-90)
    garrisonSort: "y", 

    strongpoints: [
      // NOTE: Y-Coordinates Inverted.
      // Sorted North (Negative Y) to South (Positive Y).
      
      // --- AXIS BASE (West - Negative X) ---
      { label: "SAINTE MARIE APPROACH", id: "B17", gameX: -64837.0, gameY: -52705.0, radius: 3000.0, team: "ger", type: "strongpoint" }, // North
      { label: "FLOODED HOUSE", id: "B16", gameX: -66464.0, gameY: 2944.0, radius: 3000.0, team: "ger", type: "strongpoint" }, // Mid
      { label: "MAMMUT RADAR", id: "B15", gameX: -65158.0, gameY: 51522.0, radius: 3000.0, team: "ger", type: "strongpoint" }, // South

      // --- AXIS MID (Mid-West) ---
      { label: "DROWNED FIELDS", id: "B13", gameX: -36400.0, gameY: -43928.0, radius: 3000.0, team: "ger", type: "strongpoint" }, // North
      { label: "LA GRANDE CRIQUE", id: "B12", gameX: -28986.0, gameY: -508.0, radius: 3294.0, team: "ger", type: "strongpoint" }, // Mid
      { label: "SUNKEN BRIDGE", id: "B14", gameX: -30810.0, gameY: 47853.0, radius: 3000.0, team: "ger", type: "strongpoint" }, // South

      // --- NEUTRAL (Center) ---
      { label: "WN7", id: "B9", gameX: 727.0, gameY: -50408.0, radius: 5000.0, team: "neu", type: "strongpoint" }, // North
      { label: "THE CHAPEL", id: "B10", gameX: 10650.0, gameY: 7786.0, radius: 3000.0, team: "neu", type: "strongpoint" }, // Mid
      { label: "WN4", id: "B11", gameX: 5359.0, gameY: 42267.0, radius: 3742.0, team: "neu", type: "strongpoint" }, // South (Note: Very tall oval shape in game)

      // --- ALLIES MID (Mid-East) ---
      { label: "WN5", id: "B8", gameX: 48763.0, gameY: -44080.0, radius: 3194.0, team: "us", type: "strongpoint" }, // North
      { label: "HILL 5", id: "B7", gameX: 36131.0, gameY: 1838.0, radius: 3000.0, team: "us", type: "strongpoint" }, // Mid
      { label: "AA BATTERY", id: "B18", gameX: 35101.0, gameY: 43589.0, radius: 3942.0, team: "us", type: "strongpoint" }, // South

      // --- ALLIES BASE (East - Positive X) ---
      { label: "UNCLE RED", id: "B5", gameX: 66675.0, gameY: -45162.0, radius: 2824.0, team: "us", type: "strongpoint" }, // North
      { label: "RED ROOF HOUSE", id: "B4", gameX: 64923.67, gameY: -3144.0, radius: 3250.0, team: "us", type: "strongpoint" }, // Mid
      { label: "TARE GREEN", id: "B3", gameX: 63845.0, gameY: 46581.0, radius: 3000.0, team: "us", type: "strongpoint" }, // South

      // --- GARRISON POSITIONS ---
      // ALLIES (US) - West - Negative X
      // Y-Inverted
      { label: "Default Garrison 1", id: "US_G_OFF_1", gameX: -45927.00, gameY: -59.00, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "US_G_OFF_2", gameX: -52048.00, gameY: -51110.00, radius: 500, team: "us", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "US_G_OFF_3", gameX: -43354.00, gameY: 49127.00, radius: 500, team: "us", type: "garrison_default" }, 

      // GERMANS (East - Positive X)
      // Y-Inverted
      { label: "Default Garrison 1", id: "GER_G_OFF_1", gameX: 56057.00, gameY: -663.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 2", id: "GER_G_OFF_2", gameX: 42130.00, gameY: -39360.00, radius: 500, team: "ger", type: "garrison_default" }, 
      { label: "Default Garrison 3", id: "GER_G_OFF_3", gameX: 53246.00, gameY: 44069.00, radius: 500, team: "ger", type: "garrison_default" }
    ] 
  },
};