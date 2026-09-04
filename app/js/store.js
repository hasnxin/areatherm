/* AreaTherm — app state ("database") + localStorage persistence.
   Field names mirror DATABASE_SCHEMA.sql so a real API client is a
   drop-in replacement for this module (see ARCHITECTURE.md §2, §6). */

window.APP_STORE = (function () {
  const DATA = window.APP_DATA;
  const KEY = "areatherm_state_v1";

  function defaultDesign() {
    return {
      name: "Baseline Shelter",
      shape: "RECTANGULAR",
      length: 6, width: 4, height: 3,
      orientation: "EAST", azimuthDeg: 90,
      wall: { materialId: "wall_stone", thicknessMm: 400, insulationMaterialId: "ins_puf", insulationThicknessMm: 50 },
      roof: { materialId: "roof_rcc", thicknessMm: 150, insulationMaterialId: "ins_puf", insulationThicknessMm: 50 },
      floor: { materialId: "wall_concrete", thicknessMm: 100 },
      windows: [{ areaEach: 2.4, count: 1, orientation: "FRONT", glazingMaterialId: "glaze_double" }],
      doors: [{ areaEach: 1.8, count: 1 }],
      airLeakageAch: 0.8,
      thermalMass: { materialId: "mass_stone", massKg: 800, surfaceAreaM2: 6 },
      occupancy: 2,
      internalHeatGainW: 150,
      groundTempC: null,
      comfort: { profileId: "human", min: 18, max: 27 }
    };
  }

  function freshState() {
    return {
      project: { name: "Untitled Project", createdAt: new Date().toISOString() },
      locationKey: null,
      location: null, // custom location object if not using a demo dataset
      seasonKey: "Winter",
      climateSource: null, // { type: 'DEMO_ILLUSTRATIVE'|'USER_PROVIDED', label }
      design: defaultDesign(),
      simConfig: { timeStepMinutes: 60, periodType: "24H", days: 1 },
      weights: { ...window.APP_CONFIG.DEFAULT_WEIGHTS },
      mode: "SIMPLE",
      simulationHistory: [], // [{id, ts, locationLabel, designName, thermalComfortScore}]
      lastSimulationResult: null,
      lastOptimizationResult: null,
      validationDatasets: [] // [{id, name, points:[{ts,ambient,measured,predicted,...}], stats}]
    };
  }

  let state = load() || freshState();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  function get() { return state; }
  function reset() { state = freshState(); save(); return state; }

  function loadLadakhDemo(locationKey, seasonKey) {
    const loc = DATA.LOCATIONS[locationKey];
    if (!loc) return;
    state.locationKey = locationKey;
    state.location = loc;
    state.seasonKey = seasonKey || "Winter";
    state.climateSource = { type: "DEMO_ILLUSTRATIVE", label: "Demo / illustrative climate dataset" };
    state.project.name = `${loc.label} — Passive Agricultural Shelter`;
    save();
  }

  function currentSeason() {
    if (!state.location) return null;
    return state.location.seasons[state.seasonKey];
  }

  function updateDesign(patch) {
    state.design = { ...state.design, ...patch };
    save();
  }

  function recordSimulation(result) {
    state.lastSimulationResult = result;
    state.simulationHistory.unshift({
      id: "SIM-" + Date.now(),
      ts: new Date().toISOString(),
      locationLabel: state.location ? state.location.label : "Custom location",
      designName: state.design.name,
      thermalComfortScore: result.scores.thermalComfortScore
    });
    state.simulationHistory = state.simulationHistory.slice(0, 20);
    save();
  }

  function recordOptimization(result) {
    state.lastOptimizationResult = result;
    save();
  }

  function addValidationDataset(ds) {
    state.validationDatasets.unshift(ds);
    save();
  }

  return {
    get, save, reset, loadLadakhDemo, currentSeason, updateDesign,
    recordSimulation, recordOptimization, addValidationDataset, defaultDesign
  };
})();
