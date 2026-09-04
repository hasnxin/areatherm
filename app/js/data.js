/* AreaTherm — demo climate datasets, material library, comfort profiles.
   All climate figures below are DEMO / ILLUSTRATIVE datasets for prototype
   demonstration only — NOT field-measured or DRDO-validated data. */

window.APP_DATA = (function () {

  // ---- Ladakh demo climate profiles --------------------------------
  // Seasons per location: Winter / Spring / Summer / Autumn.
  // tMin/tMax = ambient air temperature range (°C)
  // solarKwhDay = illustrative daily global horizontal irradiation (kWh/m2/day)
  // sunrise/sunset in decimal hours; windMs, rhPct, cloudPct are illustrative.
  const LOCATIONS = {
    leh: {
      key: "leh", label: "Leh, Ladakh",
      country: "India", state: "Ladakh (UT)", district: "Leh",
      latitude: 34.1526, longitude: 77.5771, elevationM: 3500,
      annualSolarKwhM2Yr: 2050, avgSunshineHoursDay: 7.9, avgCloudFreeDays: 300,
      seasons: {
        Winter: { tMin: -15, tMax: -1, solarKwhDay: 3.6, sunrise: 7.3, sunset: 17.0, windMs: 2.1, rhPct: 38, cloudPct: 12 },
        Spring: { tMin: -4, tMax: 12, solarKwhDay: 5.6, sunrise: 6.0, sunset: 18.5, windMs: 2.8, rhPct: 32, cloudPct: 15 },
        Summer: { tMin: 10, tMax: 27, solarKwhDay: 6.4, sunrise: 5.3, sunset: 19.6, windMs: 2.4, rhPct: 35, cloudPct: 18 },
        Autumn: { tMin: -6, tMax: 15, solarKwhDay: 4.9, sunrise: 6.2, sunset: 18.0, windMs: 2.0, rhPct: 30, cloudPct: 10 }
      }
    },
    nubra: {
      key: "nubra", label: "Nubra Valley, Ladakh",
      country: "India", state: "Ladakh (UT)", district: "Leh (Nubra)",
      latitude: 34.6803, longitude: 77.5654, elevationM: 3050,
      annualSolarKwhM2Yr: 2020, avgSunshineHoursDay: 8.0, avgCloudFreeDays: 305,
      seasons: {
        Winter: { tMin: -12, tMax: 2, solarKwhDay: 3.7, sunrise: 7.2, sunset: 17.1, windMs: 2.3, rhPct: 34, cloudPct: 10 },
        Spring: { tMin: -2, tMax: 14, solarKwhDay: 5.7, sunrise: 6.0, sunset: 18.6, windMs: 2.9, rhPct: 28, cloudPct: 13 },
        Summer: { tMin: 13, tMax: 29, solarKwhDay: 6.5, sunrise: 5.2, sunset: 19.7, windMs: 2.5, rhPct: 30, cloudPct: 16 },
        Autumn: { tMin: -4, tMax: 17, solarKwhDay: 5.0, sunrise: 6.1, sunset: 18.1, windMs: 2.1, rhPct: 27, cloudPct: 9 }
      }
    },
    kargil: {
      key: "kargil", label: "Kargil, Ladakh",
      country: "India", state: "Ladakh (UT)", district: "Kargil",
      latitude: 34.5539, longitude: 76.1349, elevationM: 2676,
      annualSolarKwhM2Yr: 1950, avgSunshineHoursDay: 7.6, avgCloudFreeDays: 280,
      seasons: {
        Winter: { tMin: -10, tMax: 2, solarKwhDay: 3.3, sunrise: 7.4, sunset: 17.2, windMs: 1.9, rhPct: 42, cloudPct: 18 },
        Spring: { tMin: -1, tMax: 15, solarKwhDay: 5.3, sunrise: 6.1, sunset: 18.6, windMs: 2.4, rhPct: 36, cloudPct: 20 },
        Summer: { tMin: 14, tMax: 30, solarKwhDay: 6.1, sunrise: 5.4, sunset: 19.7, windMs: 2.0, rhPct: 38, cloudPct: 22 },
        Autumn: { tMin: -3, tMax: 17, solarKwhDay: 4.6, sunrise: 6.3, sunset: 18.1, windMs: 1.8, rhPct: 33, cloudPct: 16 }
      }
    },
    dras: {
      key: "dras", label: "Drass, Ladakh",
      country: "India", state: "Ladakh (UT)", district: "Kargil (Drass)",
      latitude: 34.4362, longitude: 75.7622, elevationM: 3230,
      annualSolarKwhM2Yr: 1900, avgSunshineHoursDay: 7.2, avgCloudFreeDays: 270,
      seasons: {
        Winter: { tMin: -25, tMax: -8, solarKwhDay: 3.1, sunrise: 7.5, sunset: 17.1, windMs: 1.6, rhPct: 40, cloudPct: 16 },
        Spring: { tMin: -8, tMax: 10, solarKwhDay: 5.0, sunrise: 6.1, sunset: 18.5, windMs: 2.1, rhPct: 34, cloudPct: 18 },
        Summer: { tMin: 8, tMax: 24, solarKwhDay: 5.9, sunrise: 5.4, sunset: 19.6, windMs: 1.8, rhPct: 37, cloudPct: 20 },
        Autumn: { tMin: -9, tMax: 13, solarKwhDay: 4.4, sunrise: 6.3, sunset: 18.0, windMs: 1.5, rhPct: 32, cloudPct: 14 }
      }
    }
  };

  // ---- Predefined reference locations (for live Open-Meteo lookup) ----
  // Coordinates/elevations are reference values for site selection, not
  // survey-grade. Any of these can load LIVE weather (Open-Meteo) or, for
  // the three that overlap LOCATIONS above, an illustrative demo profile.
  const PREDEFINED_LOCATIONS = [
    { id: "leh", name: "Leh, Ladakh", latitude: 34.1526, longitude: 77.5771, elevationM: 3500, region: "Ladakh (UT)", category: "Cold desert" },
    { id: "kargil", name: "Kargil, Ladakh", latitude: 34.56, longitude: 76.11, elevationM: 2676, region: "Ladakh (UT)", category: "Cold desert" },
    { id: "keylong", name: "Keylong, Himachal Pradesh", latitude: 32.22, longitude: 77.05, elevationM: 3170, region: "Himachal Pradesh", category: "High Himalaya" },
    { id: "munsiyari", name: "Munsiyari, Uttarakhand", latitude: 30.05, longitude: 80.20, elevationM: 2298, region: "Uttarakhand", category: "High Himalaya" },
    { id: "dras", name: "Drass, Ladakh", latitude: 34.42, longitude: 75.57, elevationM: 3280, region: "Ladakh (UT)", category: "Cold desert" },
    { id: "srinagar", name: "Srinagar, J&K", latitude: 34.08, longitude: 75.34, elevationM: 1730, region: "Jammu & Kashmir (UT)", category: "Temperate valley" },
    { id: "pune", name: "Pune, Maharashtra", latitude: 18.52, longitude: 73.85, elevationM: 625, region: "Maharashtra", category: "Tropical plateau" },
    { id: "bareilly", name: "Bareilly, Uttar Pradesh", latitude: 28.37, longitude: 79.43, elevationM: 168, region: "Uttar Pradesh", category: "Gangetic plain" },
    { id: "nagpur", name: "Nagpur, Maharashtra", latitude: 21.14, longitude: 79.08, elevationM: 310, region: "Maharashtra", category: "Tropical plain" },
    { id: "shimla", name: "Shimla, Himachal Pradesh", latitude: 31.77, longitude: 77.10, elevationM: 2159, region: "Himachal Pradesh", category: "Mid Himalaya" }
  ];

  // ---- Material library ---------------------------------------------
  // All values are engineering-database reference values (typical/handbook
  // ranges) — NOT independently lab-tested for this project. Editable.
  const MATERIALS = [
    // WALL
    { id: "wall_concrete", category: "WALL", name: "Concrete (dense)", density: 2400, k: 1.40, cp: 880, defaultThicknessMm: 200, absorptivity: 0.65, reflectivity: 0.35, emissivity: 0.90, costPerM2: 1400, sustainability: "LOW" },
    { id: "wall_brick", category: "WALL", name: "Fired Brick", density: 1700, k: 0.72, cp: 840, defaultThicknessMm: 230, absorptivity: 0.60, reflectivity: 0.40, emissivity: 0.90, costPerM2: 1100, sustainability: "MEDIUM" },
    { id: "wall_stone", category: "WALL", name: "Local Stone Masonry", density: 2600, k: 1.70, cp: 850, defaultThicknessMm: 400, absorptivity: 0.55, reflectivity: 0.45, emissivity: 0.90, costPerM2: 1600, sustainability: "MEDIUM" },
    { id: "wall_adobe", category: "WALL", name: "Adobe", density: 1600, k: 0.55, cp: 900, defaultThicknessMm: 300, absorptivity: 0.60, reflectivity: 0.40, emissivity: 0.90, costPerM2: 650, sustainability: "HIGH" },
    { id: "wall_rammed_earth", category: "WALL", name: "Rammed Earth", density: 2000, k: 0.60, cp: 900, defaultThicknessMm: 350, absorptivity: 0.60, reflectivity: 0.40, emissivity: 0.90, costPerM2: 900, sustainability: "HIGH" },
    { id: "wall_mud_block", category: "WALL", name: "Sun-dried Mud Block", density: 1500, k: 0.46, cp: 900, defaultThicknessMm: 300, absorptivity: 0.62, reflectivity: 0.38, emissivity: 0.90, costPerM2: 500, sustainability: "HIGH" },
    { id: "wall_aac", category: "WALL", name: "AAC Block", density: 550, k: 0.16, cp: 1050, defaultThicknessMm: 200, absorptivity: 0.55, reflectivity: 0.45, emissivity: 0.90, costPerM2: 950, sustainability: "MEDIUM" },
    { id: "wall_insulated_panel", category: "WALL", name: "Insulated Sandwich Panel (PUF core)", density: 45, k: 0.023, cp: 1400, defaultThicknessMm: 100, absorptivity: 0.45, reflectivity: 0.55, emissivity: 0.85, costPerM2: 1900, sustainability: "MEDIUM" },
    { id: "wall_composite", category: "WALL", name: "Composite Insulated Wall (brick + EPS + brick)", density: 900, k: 0.09, cp: 950, defaultThicknessMm: 280, absorptivity: 0.55, reflectivity: 0.45, emissivity: 0.90, costPerM2: 2100, sustainability: "MEDIUM" },

    // ROOF
    { id: "roof_rcc", category: "ROOF", name: "RCC Slab", density: 2400, k: 1.58, cp: 880, defaultThicknessMm: 150, absorptivity: 0.65, reflectivity: 0.35, emissivity: 0.90, costPerM2: 1500, sustainability: "LOW" },
    { id: "roof_metal", category: "ROOF", name: "Galvanized Metal Sheet", density: 7850, k: 50, cp: 490, defaultThicknessMm: 1, absorptivity: 0.55, reflectivity: 0.45, emissivity: 0.28, costPerM2: 700, sustainability: "MEDIUM" },
    { id: "roof_insulated_metal", category: "ROOF", name: "Insulated Metal Roof Panel (PUF core)", density: 40, k: 0.022, cp: 1400, defaultThicknessMm: 80, absorptivity: 0.45, reflectivity: 0.55, emissivity: 0.30, costPerM2: 1700, sustainability: "MEDIUM" },
    { id: "roof_composite", category: "ROOF", name: "Composite Roof (metal + rockwool + ply)", density: 300, k: 0.05, cp: 1000, defaultThicknessMm: 120, absorptivity: 0.50, reflectivity: 0.50, emissivity: 0.75, costPerM2: 1600, sustainability: "MEDIUM" },
    { id: "roof_earth", category: "ROOF", name: "Traditional Earth Roof", density: 1700, k: 0.80, cp: 900, defaultThicknessMm: 250, absorptivity: 0.65, reflectivity: 0.35, emissivity: 0.90, costPerM2: 850, sustainability: "HIGH" },

    // INSULATION (k used with user-set thickness)
    { id: "ins_eps", category: "INSULATION", name: "EPS", density: 20, k: 0.035, cp: 1450, defaultThicknessMm: 75, absorptivity: 0.4, reflectivity: 0.6, emissivity: 0.6, costPerM2: 500, sustainability: "LOW" },
    { id: "ins_xps", category: "INSULATION", name: "XPS", density: 35, k: 0.030, cp: 1450, defaultThicknessMm: 75, absorptivity: 0.4, reflectivity: 0.6, emissivity: 0.6, costPerM2: 650, sustainability: "LOW" },
    { id: "ins_rockwool", category: "INSULATION", name: "Rock Wool", density: 100, k: 0.040, cp: 840, defaultThicknessMm: 75, absorptivity: 0.4, reflectivity: 0.6, emissivity: 0.6, costPerM2: 600, sustainability: "MEDIUM" },
    { id: "ins_glasswool", category: "INSULATION", name: "Glass Wool", density: 24, k: 0.038, cp: 840, defaultThicknessMm: 75, absorptivity: 0.4, reflectivity: 0.6, emissivity: 0.6, costPerM2: 550, sustainability: "MEDIUM" },
    { id: "ins_puf", category: "INSULATION", name: "PUF (Polyurethane Foam)", density: 32, k: 0.023, cp: 1400, defaultThicknessMm: 75, absorptivity: 0.4, reflectivity: 0.6, emissivity: 0.6, costPerM2: 750, sustainability: "LOW" },
    { id: "ins_sheepwool", category: "INSULATION", name: "Sheep Wool", density: 25, k: 0.038, cp: 1700, defaultThicknessMm: 75, absorptivity: 0.4, reflectivity: 0.6, emissivity: 0.6, costPerM2: 900, sustainability: "HIGH" },
    { id: "ins_natural_fibre", category: "INSULATION", name: "Natural Fibre Insulation (local wool/felt)", density: 60, k: 0.045, cp: 1600, defaultThicknessMm: 75, absorptivity: 0.4, reflectivity: 0.6, emissivity: 0.6, costPerM2: 700, sustainability: "HIGH" },

    // THERMAL MASS
    { id: "mass_stone", category: "THERMAL_MASS", name: "Stone (basalt/granite)", density: 2700, k: 2.2, cp: 850, absorptivity: 0.6, reflectivity: 0.4, emissivity: 0.9, costPerKg: 6, sustainability: "MEDIUM" },
    { id: "mass_concrete", category: "THERMAL_MASS", name: "Concrete Mass", density: 2400, k: 1.4, cp: 880, absorptivity: 0.6, reflectivity: 0.4, emissivity: 0.9, costPerKg: 5, sustainability: "LOW" },
    { id: "mass_water", category: "THERMAL_MASS", name: "Water Drums", density: 1000, k: 0.6, cp: 4186, absorptivity: 0.9, reflectivity: 0.1, emissivity: 0.95, costPerKg: 0.05, sustainability: "HIGH" },
    { id: "mass_pcm", category: "THERMAL_MASS", name: "Phase Change Material (paraffin-based, ~24°C melt)", density: 900, k: 0.2, cp: 2100, pcmMeltC: 24, pcmLatentJKg: 190000, absorptivity: 0.5, reflectivity: 0.5, emissivity: 0.9, costPerKg: 350, sustainability: "MEDIUM" },
    { id: "mass_earth", category: "THERMAL_MASS", name: "Compacted Earth Mass", density: 1900, k: 1.0, cp: 900, absorptivity: 0.6, reflectivity: 0.4, emissivity: 0.9, costPerKg: 1, sustainability: "HIGH" },
    { id: "mass_composite", category: "THERMAL_MASS", name: "Composite Storage (stone + PCM)", density: 1800, k: 1.1, cp: 1400, pcmMeltC: 24, pcmLatentJKg: 90000, absorptivity: 0.55, reflectivity: 0.45, emissivity: 0.9, costPerKg: 120, sustainability: "MEDIUM" },

    // WINDOW / GLAZING
    { id: "glaze_single", category: "WINDOW", name: "Single Glazing", uValue: 5.8, shgc: 0.85, costPerM2: 1200, sustainability: "LOW" },
    { id: "glaze_double", category: "WINDOW", name: "Double Glazing", uValue: 2.8, shgc: 0.70, costPerM2: 3200, sustainability: "MEDIUM" },
    { id: "glaze_triple", category: "WINDOW", name: "Triple Glazing", uValue: 1.6, shgc: 0.58, costPerM2: 5200, sustainability: "MEDIUM" },
    { id: "glaze_lowe", category: "WINDOW", name: "Low-E Double Glazing", uValue: 1.8, shgc: 0.62, costPerM2: 4200, sustainability: "HIGH" }
  ];

  // ---- Comfort profiles ------------------------------------------------
  const COMFORT_PROFILES = [
    { id: "human", label: "Human Occupancy", min: 18, max: 27 },
    { id: "agri_produce", label: "Agricultural Produce Storage", min: 4, max: 12 },
    { id: "livestock", label: "Livestock Shelter", min: 8, max: 20 },
    { id: "seed_storage", label: "Seed Storage", min: 5, max: 15 },
    { id: "nursery", label: "Plant Nursery / Greenhouse", min: 15, max: 28 },
    { id: "equipment", label: "Equipment / Electronics Shelter", min: 5, max: 35 },
    { id: "custom", label: "Custom", min: 18, max: 27 }
  ];

  function materialsByCategory(cat) {
    return MATERIALS.filter(m => m.category === cat);
  }
  function materialById(id) {
    return MATERIALS.find(m => m.id === id);
  }

  function predefinedLocationById(id) {
    return PREDEFINED_LOCATIONS.find(l => l.id === id);
  }

  return {
    LOCATIONS, PREDEFINED_LOCATIONS, MATERIALS, COMFORT_PROFILES,
    materialsByCategory, materialById, predefinedLocationById
  };
})();
