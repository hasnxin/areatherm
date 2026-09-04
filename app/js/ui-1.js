/* AreaTherm UI — Dashboard, Location & Climate, Shelter Designer, Materials */
window.UI = window.UI || {};

(function () {
  const CFG = window.APP_CONFIG, DATA = window.APP_DATA, ENGINE = window.APP_ENGINE, STORE = window.APP_STORE, CH = window.APP_CHARTS;

  const heroHtml = (compact) => `
    <div class="hero" style="${compact ? "padding:22px 28px;" : ""}">
      <span class="tag tag-model" style="margin-bottom:10px;">Physics-based decision-support platform</span>
      <h1 style="${compact ? "font-size:20px;" : ""}">Design Shelters for the Climate Around Them.</h1>
      <p>An area-specific, physics-based software platform for predicting thermal performance and
      optimizing passive shelter design — starting with Ladakh.</p>
      ${compact ? "" : `<div class="flow">
        <span class="step">CLIMATE</span><span class="arrow">↓</span>
        <span class="step">DESIGN</span><span class="arrow">↓</span>
        <span class="step">MATERIALS</span><span class="arrow">↓</span>
        <span class="step">SIMULATION</span><span class="arrow">↓</span>
        <span class="step">OPTIMIZATION</span><span class="arrow">↓</span>
        <span class="step">RECOMMENDATION</span>
      </div>`}
      <div class="cta-row">
        <button class="btn btn-accent" id="heroDemoBtn">▶ Run Ladakh Demo</button>
        <button class="btn" id="heroWorkflowBtn" style="background:transparent;border-color:rgba(255,255,255,.4);color:#fff;">See full workflow →</button>
      </div>
    </div>`;

  UI.renderDashboard = function (root) {
    const s = STORE.get();
    const last = s.lastSimulationResult;
    const hist = s.simulationHistory;
    const avgScore = hist.length ? (hist.reduce((a, h) => a + h.thermalComfortScore, 0) / hist.length) : null;
    const bestOpt = s.lastOptimizationResult ? s.lastOptimizationResult.recommended : null;
    const uniqueLocations = new Set(hist.map(h => h.locationLabel)).size;

    root.innerHTML = `
      ${heroHtml(hist.length > 0)}
      <div class="grid grid-4" style="margin-bottom:18px;">
        <div class="card metric-card"><div class="metric-label">Total Simulations</div><div class="metric-value">${hist.length}</div><div class="metric-sub">this session</div></div>
        <div class="card metric-card"><div class="metric-label">Locations Analysed</div><div class="metric-value">${uniqueLocations || (s.location ? 1 : 0)}</div><div class="metric-sub">${s.location ? U.esc(s.location.label) : "none selected"}</div></div>
        <div class="card metric-card"><div class="metric-label">Best Performing Design</div><div class="metric-value">${bestOpt ? bestOpt.score.total.toFixed(0) : "—"}</div><div class="metric-sub">${bestOpt ? "Design " + bestOpt.label + " (optimization run)" : "run optimization"}</div></div>
        <div class="card metric-card"><div class="metric-label">Avg. Thermal Comfort Score</div><div class="metric-value">${avgScore != null ? avgScore.toFixed(0) : "—"}</div><div class="metric-sub">across ${hist.length} run(s)</div></div>
      </div>
      <div class="grid grid-3" style="margin-bottom:18px;">
        <div class="card metric-card"><div class="metric-label">Solar Energy Potential</div><div class="metric-value">${s.location ? s.location.annualSolarKwhM2Yr : "—"}</div><div class="metric-sub">kWh/m²/yr <span class="tag tag-demo">${s.location ? "demo" : ""}</span></div></div>
        <div class="card metric-card"><div class="metric-label">Estimated Heat Loss</div><div class="metric-value">${last ? last.daily.totalLossKwh.toFixed(1) : "—"}</div><div class="metric-sub">kWh/day <span class="tag tag-model">${last ? "model prediction" : ""}</span></div></div>
        <div class="card metric-card"><div class="metric-label">Current Simulation Status</div><div class="metric-value" style="font-size:16px;">${last ? "✅ Complete" : "○ Not run"}</div><div class="metric-sub">${last ? "last run this session" : "go to Thermal Simulation"}</div></div>
      </div>
      <div class="grid grid-2">
        <div class="card">
          <h3>Thermal Comfort Score</h3>
          ${last ? `
            <div style="display:flex; align-items:center; gap:22px;">
              <div id="dashGauge"></div>
              <ul class="checklist" style="font-size:12.5px;">
                <li>Daytime comfort: <b>${last.comfort.dayComfortPct.toFixed(0)}%</b></li>
                <li>Night comfort: <b>${last.comfort.nightComfortPct.toFixed(0)}%</b></li>
                <li>Solar utilization: <b>${last.scores.solarUtilizationPct.toFixed(0)}%</b></li>
                <li>Heat retention: <b>${last.scores.heatRetentionPct.toFixed(0)}%</b></li>
              </ul>
            </div>` : `<p class="subtitle">Run a thermal simulation to populate the comfort score.</p>`}
        </div>
        <div class="card">
          <h3>Recent Simulations</h3>
          ${hist.length ? `<div class="table-wrap"><table><thead><tr><th>ID</th><th>Location</th><th>Design</th><th>Score</th></tr></thead><tbody>
            ${hist.slice(0, 6).map(h => `<tr><td style="font-family:var(--mono);font-size:11px;">${h.id}</td><td>${U.esc(h.locationLabel)}</td><td>${U.esc(h.designName)}</td><td class="num">${h.thermalComfortScore}</td></tr>`).join("")}
          </tbody></table></div>` : `<p class="subtitle">No simulations yet. Try the Ladakh demo.</p>`}
        </div>
      </div>`;

    if (last) CH.scoreGauge(U.qs("#dashGauge", root), last.scores.thermalComfortScore);
    U.on("#heroDemoBtn", "click", () => window.APP.runLadakhDemo(), root);
    U.on("#heroWorkflowBtn", "click", () => window.APP.navigate("location"), root);
  };

  // ---------------------------------------------------------------------
  UI.renderLocation = function (root) {
    const s = STORE.get();
    const loc = s.location;
    const locOptions = Object.values(DATA.LOCATIONS).map(l => `<option value="${l.key}" ${loc && loc.key === l.key ? "selected" : ""}>${l.label}</option>`).join("");
    const seasonOptions = (loc ? Object.keys(loc.seasons) : ["Winter", "Spring", "Summer", "Autumn"])
      .map(k => `<option value="${k}" ${s.seasonKey === k ? "selected" : ""}>${k}</option>`).join("");
    const season = STORE.currentSeason();

    root.innerHTML = `
      <h1>Location &amp; Climate Profile</h1>
      <p class="subtitle">Enter a location's climate inputs, or load an illustrative Ladakh demo dataset.</p>

      <div class="grid grid-2">
        <div class="card">
          <h3>Demo Climate Dataset ${s.climateSource && s.climateSource.type === "DEMO_ILLUSTRATIVE" ? '<span class="tag tag-demo">demo / illustrative</span>' : ""}</h3>
          <div class="form-inline">
            <div class="form-row"><label>Ladakh location</label>
              <select id="locSelect"><option value="">— select —</option>${locOptions}</select>
            </div>
            <div class="form-row"><label>Season</label>
              <select id="seasonSelect">${seasonOptions}</select>
            </div>
          </div>
          <button class="btn btn-accent btn-sm" id="loadDemoBtn">Load sample profile</button>
          <p class="hint" style="margin-top:10px;">Demo values are illustrative reference figures for prototype
          demonstration only — not experimentally validated or field-measured. Architecture supports future
          integration with NASA POWER, ERA5, IMD, and other validated datasets (not live in this build).</p>
        </div>

        <div class="card">
          <h3>Location Details ${loc ? `<span class="tag tag-input">from dataset</span>` : `<span class="tag tag-field">user-provided</span>`}</h3>
          <div class="form-inline">
            <div class="form-row"><label>Country</label><input id="locCountry" value="${loc ? loc.country : "India"}"></div>
            <div class="form-row"><label>State</label><input id="locState" value="${loc ? loc.state : ""}"></div>
            <div class="form-row"><label>District</label><input id="locDistrict" value="${loc ? loc.district : ""}"></div>
          </div>
          <div class="form-inline">
            <div class="form-row"><label>Latitude</label><input id="locLat" type="number" step="0.0001" value="${loc ? loc.latitude : ""}"></div>
            <div class="form-row"><label>Longitude</label><input id="locLon" type="number" step="0.0001" value="${loc ? loc.longitude : ""}"></div>
            <div class="form-row"><label>Elevation (m)</label><input id="locElev" type="number" value="${loc ? loc.elevationM : ""}"></div>
          </div>
        </div>
      </div>

      ${season ? `
      <div class="card" style="margin-top:16px;">
        <h3>Climate Inputs — ${U.esc(s.seasonKey)} (${loc.label}) <span class="tag tag-demo">demo / illustrative</span></h3>
        <div class="grid grid-4">
          <div class="metric-card"><div class="metric-label">Ambient Temp Range</div><div class="metric-value" style="font-size:18px;">${season.tMin} to ${season.tMax} °C</div></div>
          <div class="metric-card"><div class="metric-label">Solar Irradiance</div><div class="metric-value" style="font-size:18px;">${season.solarKwhDay} kWh/m²/day</div></div>
          <div class="metric-card"><div class="metric-label">Sunshine Window</div><div class="metric-value" style="font-size:18px;">${season.sunrise}h – ${season.sunset}h</div></div>
          <div class="metric-card"><div class="metric-label">Wind / RH / Cloud</div><div class="metric-value" style="font-size:15px;">${season.windMs} m/s · ${season.rhPct}% · ${season.cloudPct}%</div></div>
        </div>
        <h3 style="margin-top:16px;">24-Hour Ambient Temperature &amp; Solar Irradiance (model input curve)</h3>
        <div id="climateChart"></div>
      </div>` : `<div class="card" style="margin-top:16px;"><p class="subtitle">Load a demo profile or enter custom climate data (Advanced Mode) to continue.</p></div>`}

      <div class="card" style="margin-top:16px;">
        <h3>Comfort Requirement</h3>
        <div class="form-inline">
          <div class="form-row"><label>Comfort profile</label>
            <select id="comfortProfile">${DATA.COMFORT_PROFILES.map(c => `<option value="${c.id}" ${s.design.comfort.profileId === c.id ? "selected" : ""}>${c.label}</option>`).join("")}</select>
          </div>
          <div class="form-row"><label>Min comfortable temp (°C)</label><input id="comfortMin" type="number" value="${s.design.comfort.min}"></div>
          <div class="form-row"><label>Max comfortable temp (°C)</label><input id="comfortMax" type="number" value="${s.design.comfort.max}"></div>
        </div>
        <p class="hint">Comfort range is not universally fixed — it depends on occupancy type (human, livestock,
        produce, seed storage, nursery, equipment). Select a profile or enter a custom range.</p>
        <button class="btn btn-accent btn-sm" id="saveComfortBtn">Save comfort requirement</button>
      </div>`;

    if (season) {
      const hours = Array.from({ length: 25 }, (_, i) => i);
      CH.lineChart(U.qs("#climateChart", root), [
        { name: "Ambient Temp (°C)", color: "#c93b3b", data: hours.map(h => ({ x: h, y: ENGINE.ambientTempAt(season, h) })) }
      ], { height: 200, yLabel: "°C", xLabel: "Hour of day" });
      const solarDiv = document.createElement("div");
      solarDiv.style.marginTop = "10px";
      U.qs("#climateChart", root).appendChild(solarDiv);
      CH.lineChart(solarDiv, [
        { name: "Solar Irradiance (W/m²)", color: "#d98a12", data: hours.map(h => ({ x: h, y: ENGINE.solarIrradianceAt(season, h) })) }
      ], { height: 180, yLabel: "W/m²", xLabel: "Hour of day" });
    }

    U.on("#loadDemoBtn", "click", () => {
      const key = U.qs("#locSelect", root).value;
      const seasonKey = U.qs("#seasonSelect", root).value;
      if (!key) { alert("Select a Ladakh location first."); return; }
      STORE.loadLadakhDemo(key, seasonKey);
      window.APP.render();
    }, root);
    U.on("#locSelect", "change", () => {
      const key = U.qs("#locSelect", root).value;
      if (key) { const opts = Object.keys(DATA.LOCATIONS[key].seasons); U.qs("#seasonSelect", root).innerHTML = opts.map(k => `<option value="${k}">${k}</option>`).join(""); }
    }, root);
    U.on("#saveComfortBtn", "click", () => {
      const profileId = U.qs("#comfortProfile", root).value;
      const min = parseFloat(U.qs("#comfortMin", root).value);
      const max = parseFloat(U.qs("#comfortMax", root).value);
      STORE.updateDesign({ comfort: { profileId, min, max } });
      window.APP.toast("Comfort requirement saved.");
    }, root);
    U.on("#comfortProfile", "change", () => {
      const p = DATA.COMFORT_PROFILES.find(c => c.id === U.qs("#comfortProfile", root).value);
      if (p) { U.qs("#comfortMin", root).value = p.min; U.qs("#comfortMax", root).value = p.max; }
    }, root);
  };

  // ---------------------------------------------------------------------
  const BEARING = { SOUTH: 180, SE: 135, EAST: 90, NE: 45, NORTH: 0, NW: 315, WEST: 270, SW: 225 };
  function bearingOf(design) {
    if (design.orientation === "CUSTOM") return (180 + (design.azimuthDeg || 0)) % 360;
    return BEARING[design.orientation] ?? 180;
  }

  function drawShelterPreview(container, design, geom) {
    const size = 260, cx = size / 2, cy = size / 2;
    const scale = Math.min(180 / Math.max(geom.L, geom.W || geom.L), 6);
    const w = geom.W ? geom.L * scale : geom.L * scale;
    const h = geom.W ? geom.W * scale : geom.L * scale;
    const bearing = bearingOf(design);
    const isRound = ["CIRCULAR", "DOME", "SEMI_CIRCULAR"].includes(design.shape);
    let shapeSvg;
    if (isRound) {
      shapeSvg = `<circle cx="${cx}" cy="${cy}" r="${w / 2}" fill="#dfeef2" stroke="#1f8a9e" stroke-width="2"/>`;
    } else {
      shapeSvg = `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" fill="#dfeef2" stroke="#1f8a9e" stroke-width="2"/>`;
    }
    // window mark on the FRONT face (rotated by bearing)
    const winMark = `<rect x="${cx - w * 0.18}" y="${cy - h / 2 - 4}" width="${w * 0.36}" height="8" fill="#2fb8cf"/>`;
    container.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" style="width:260px;height:260px;">
        <g transform="rotate(${bearing} ${cx} ${cy})">
          ${shapeSvg}
          ${winMark}
        </g>
        <text x="${cx}" y="14" text-anchor="middle" class="chart-tick" font-size="11">N ↑</text>
        <text x="${cx}" y="${size - 6}" text-anchor="middle" class="chart-tick" font-size="10">Top-down schematic — illustrative</text>
      </svg>`;
  }

  UI.renderDesigner = function (root) {
    const s = STORE.get();
    const d = s.design;
    const geom = ENGINE.computeGeometry(d);
    const wallOpts = DATA.materialsByCategory("WALL").map(m => `<option value="${m.id}" ${d.wall.materialId === m.id ? "selected" : ""}>${m.name}</option>`).join("");
    const roofOpts = DATA.materialsByCategory("ROOF").map(m => `<option value="${m.id}" ${d.roof.materialId === m.id ? "selected" : ""}>${m.name}</option>`).join("");
    const glazeOpts = DATA.materialsByCategory("WINDOW").map(m => `<option value="${m.id}" ${d.windows[0].glazingMaterialId === m.id ? "selected" : ""}>${m.name} (U=${m.uValue}, SHGC=${m.shgc})</option>`).join("");

    root.innerHTML = `
      <h1>Shelter Designer</h1>
      <p class="subtitle">Define geometry, orientation, and openings. Preview updates live.</p>
      <div class="grid grid-2">
        <div class="card">
          <fieldset>
            <legend>Geometry</legend>
            <div class="form-inline">
              <div class="form-row"><label>Shape</label>
                <select id="dShape">
                  ${["RECTANGULAR","SQUARE","CIRCULAR","DOME","SEMI_CIRCULAR","CUSTOM"].map(v => `<option value="${v}" ${d.shape===v?"selected":""}>${v.replace("_"," ")}</option>`).join("")}
                </select>
              </div>
            </div>
            <div class="form-inline" id="rectFields" style="${["CIRCULAR","DOME","SEMI_CIRCULAR"].includes(d.shape)?"display:none;":""}">
              <div class="form-row"><label>Length (m)</label><input id="dLength" type="number" step="0.1" value="${d.length}"></div>
              <div class="form-row"><label>Width (m)</label><input id="dWidth" type="number" step="0.1" value="${d.width}"></div>
              <div class="form-row"><label>Height (m)</label><input id="dHeight" type="number" step="0.1" value="${d.height}"></div>
            </div>
            <div class="form-inline" id="roundFields" style="${["CIRCULAR","DOME","SEMI_CIRCULAR"].includes(d.shape)?"":"display:none;"}">
              <div class="form-row"><label>Diameter (m)</label><input id="dDiameter" type="number" step="0.1" value="${d.diameter || 5}"></div>
              <div class="form-row"><label>Height (m)</label><input id="dHeight2" type="number" step="0.1" value="${d.height}"></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Orientation</legend>
            <div class="form-inline">
              <div class="form-row"><label>Primary facade orientation</label>
                <select id="dOrientation">
                  ${["SOUTH","SE","EAST","NE","NORTH","NW","WEST","SW","CUSTOM"].map(v => `<option value="${v}" ${d.orientation===v?"selected":""}>${v}</option>`).join("")}
                </select>
              </div>
              <div class="form-row" id="azimuthRow" style="${d.orientation==="CUSTOM"?"":"display:none;"}"><label>Custom azimuth (° from South)</label><input id="dAzimuth" type="number" value="${d.azimuthDeg||0}"></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Openings</legend>
            <div class="form-inline">
              <div class="form-row"><label>Window area each (m²)</label><input id="dWinArea" type="number" step="0.1" value="${d.windows[0].areaEach}"></div>
              <div class="form-row"><label>Window count</label><input id="dWinCount" type="number" value="${d.windows[0].count}"></div>
              <div class="form-row"><label>Window face</label>
                <select id="dWinOrient">${["FRONT","BACK","LEFT","RIGHT"].map(v=>`<option ${d.windows[0].orientation===v?"selected":""}>${v}</option>`).join("")}</select>
              </div>
            </div>
            <div class="form-inline">
              <div class="form-row"><label>Glazing type</label><select id="dGlazing">${glazeOpts}</select></div>
              <div class="form-row"><label>Door area (m²)</label><input id="dDoorArea" type="number" step="0.1" value="${d.doors[0].areaEach}"></div>
              <div class="form-row"><label>Air leakage (ACH)</label><input id="dAch" type="number" step="0.1" value="${d.airLeakageAch}"></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Occupancy &amp; internal gain</legend>
            <div class="form-inline">
              <div class="form-row"><label>Occupancy (persons)</label><input id="dOccupancy" type="number" value="${d.occupancy}"></div>
              <div class="form-row"><label>Internal heat gain (W)</label><input id="dInternal" type="number" value="${d.internalHeatGainW}"></div>
            </div>
          </fieldset>
          <button class="btn btn-accent" id="saveDesignBtn">Save shelter design</button>
        </div>

        <div>
          <div class="card" style="text-align:center;">
            <h3>2D Preview (top-down)</h3>
            <div id="preview2d"></div>
          </div>
          <div class="card" style="margin-top:16px;">
            <h3>Derived Geometry <span class="tag tag-model">calculated</span></h3>
            <div class="grid grid-2">
              <div class="metric-card"><div class="metric-label">Floor Area</div><div class="metric-value" style="font-size:18px;">${geom.floorArea.toFixed(1)} m²</div></div>
              <div class="metric-card"><div class="metric-label">Volume</div><div class="metric-value" style="font-size:18px;">${geom.volume.toFixed(1)} m³</div></div>
              <div class="metric-card"><div class="metric-label">Wall Area</div><div class="metric-value" style="font-size:18px;">${geom.wallArea.toFixed(1)} m²</div></div>
              <div class="metric-card"><div class="metric-label">Roof Area</div><div class="metric-value" style="font-size:18px;">${geom.roofArea.toFixed(1)} m²</div></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:16px;">
        <h3>Wall, Roof, Floor Construction &amp; Insulation</h3>
        <div class="grid grid-3">
          <fieldset><legend>Wall</legend>
            <div class="form-row"><label>Material</label><select id="dWallMat">${wallOpts}</select></div>
            <div class="form-row"><label>Thickness (mm)</label><input id="dWallThick" type="number" value="${d.wall.thicknessMm}"></div>
            <div class="form-row"><label>Insulation</label><select id="dWallInsMat">${DATA.materialsByCategory("INSULATION").map(m=>`<option value="${m.id}" ${d.wall.insulationMaterialId===m.id?"selected":""}>${m.name}</option>`).join("")}</select></div>
            <div class="form-row"><label>Insulation thickness (mm)</label><input id="dWallInsThick" type="number" value="${d.wall.insulationThicknessMm}"></div>
          </fieldset>
          <fieldset><legend>Roof</legend>
            <div class="form-row"><label>Material</label><select id="dRoofMat">${roofOpts}</select></div>
            <div class="form-row"><label>Thickness (mm)</label><input id="dRoofThick" type="number" value="${d.roof.thicknessMm}"></div>
            <div class="form-row"><label>Insulation</label><select id="dRoofInsMat">${DATA.materialsByCategory("INSULATION").map(m=>`<option value="${m.id}" ${d.roof.insulationMaterialId===m.id?"selected":""}>${m.name}</option>`).join("")}</select></div>
            <div class="form-row"><label>Insulation thickness (mm)</label><input id="dRoofInsThick" type="number" value="${d.roof.insulationThicknessMm}"></div>
          </fieldset>
          <fieldset><legend>Floor &amp; Thermal Mass</legend>
            <div class="form-row"><label>Floor material</label><select id="dFloorMat">${wallOpts}</select></div>
            <div class="form-row"><label>Thermal mass material</label><select id="dMassMat">
              <option value="">None</option>
              ${DATA.materialsByCategory("THERMAL_MASS").map(m=>`<option value="${m.id}" ${d.thermalMass && d.thermalMass.materialId===m.id?"selected":""}>${m.name}</option>`).join("")}
            </select></div>
            <div class="form-row"><label>Thermal mass (kg)</label><input id="dMassKg" type="number" value="${d.thermalMass?d.thermalMass.massKg:0}"></div>
          </fieldset>
        </div>
        <button class="btn btn-accent" id="saveMaterialsBtn">Save construction</button>
        <span class="hint">U-values (wall ${ENGINE.wallUValue(d).toFixed(2)} W/m²K · roof ${ENGINE.roofUValue(d).toFixed(2)} W/m²K · floor ${ENGINE.floorUValue(d).toFixed(2)} W/m²K) are calculated live from these layers.</span>
      </div>`;

    drawShelterPreview(U.qs("#preview2d", root), d, geom);

    U.on("#dShape", "change", () => {
      const v = U.qs("#dShape", root).value;
      U.qs("#rectFields", root).style.display = ["CIRCULAR","DOME","SEMI_CIRCULAR"].includes(v) ? "none" : "";
      U.qs("#roundFields", root).style.display = ["CIRCULAR","DOME","SEMI_CIRCULAR"].includes(v) ? "" : "none";
    }, root);
    U.on("#dOrientation", "change", () => {
      U.qs("#azimuthRow", root).style.display = U.qs("#dOrientation", root).value === "CUSTOM" ? "" : "none";
    }, root);

    U.on("#saveDesignBtn", "click", () => {
      const shape = U.qs("#dShape", root).value;
      const patch = {
        shape,
        length: parseFloat(U.qs("#dLength", root).value) || d.length,
        width: parseFloat(U.qs("#dWidth", root).value) || d.width,
        height: parseFloat((U.qs("#dHeight", root)||U.qs("#dHeight2",root)).value) || d.height,
        diameter: parseFloat(U.qs("#dDiameter", root) ? U.qs("#dDiameter", root).value : d.diameter) || d.diameter,
        orientation: U.qs("#dOrientation", root).value,
        azimuthDeg: parseFloat(U.qs("#dAzimuth", root).value) || 0,
        airLeakageAch: parseFloat(U.qs("#dAch", root).value),
        occupancy: parseInt(U.qs("#dOccupancy", root).value) || 0,
        internalHeatGainW: parseFloat(U.qs("#dInternal", root).value) || 0,
        windows: [{ areaEach: parseFloat(U.qs("#dWinArea", root).value), count: parseInt(U.qs("#dWinCount", root).value), orientation: U.qs("#dWinOrient", root).value, glazingMaterialId: U.qs("#dGlazing", root).value }],
        doors: [{ areaEach: parseFloat(U.qs("#dDoorArea", root).value), count: 1 }]
      };
      STORE.updateDesign(patch);
      window.APP.render();
      window.APP.toast("Shelter design saved.");
    }, root);

    U.on("#saveMaterialsBtn", "click", () => {
      const massMatId = U.qs("#dMassMat", root).value;
      const massKg = parseFloat(U.qs("#dMassKg", root).value) || 0;
      STORE.updateDesign({
        wall: { materialId: U.qs("#dWallMat", root).value, thicknessMm: parseFloat(U.qs("#dWallThick", root).value), insulationMaterialId: U.qs("#dWallInsMat", root).value, insulationThicknessMm: parseFloat(U.qs("#dWallInsThick", root).value) },
        roof: { materialId: U.qs("#dRoofMat", root).value, thicknessMm: parseFloat(U.qs("#dRoofThick", root).value), insulationMaterialId: U.qs("#dRoofInsMat", root).value, insulationThicknessMm: parseFloat(U.qs("#dRoofInsThick", root).value) },
        floor: { materialId: U.qs("#dFloorMat", root).value, thicknessMm: 100 },
        thermalMass: massMatId && massKg > 0 ? { materialId: massMatId, massKg, surfaceAreaM2: Math.min(geom.floorArea, massKg / 300) } : null
      });
      window.APP.render();
      window.APP.toast("Construction saved.");
    }, root);
  };

  // ---------------------------------------------------------------------
  UI.renderMaterials = function (root) {
    const cats = ["WALL", "ROOF", "INSULATION", "THERMAL_MASS", "WINDOW"];
    const tableFor = cat => {
      const rows = DATA.materialsByCategory(cat);
      const isWindow = cat === "WINDOW", isMass = cat === "THERMAL_MASS";
      return `<div class="table-wrap"><table><thead><tr>
          <th>Name</th>${isWindow ? "<th>U-value (W/m²K)</th><th>SHGC</th>" : "<th>Density (kg/m³)</th><th>k (W/mK)</th><th>Cp (J/kgK)</th>"}
          <th>Absorptivity</th><th>${isMass ? "Cost (₹/kg)" : "Cost (₹/m²)"}</th><th>Sustainability</th>
        </tr></thead><tbody>
        ${rows.map(m => `<tr>
          <td>${U.esc(m.name)}</td>
          ${isWindow ? `<td class="num">${m.uValue}</td><td class="num">${m.shgc}</td>` : `<td class="num">${m.density||"—"}</td><td class="num">${m.k||"—"}</td><td class="num">${m.cp||"—"}</td>`}
          <td class="num">${m.absorptivity ?? "—"}</td>
          <td class="num">${isMass ? (m.costPerKg??"—") : (m.costPerM2??"—")}</td>
          <td>${m.sustainability}</td>
        </tr>`).join("")}
        </tbody></table></div>`;
    };

    root.innerHTML = `
      <h1>Material Database</h1>
      <p class="subtitle"><span class="tag tag-demo">Engineering database value</span> — typical/handbook reference
      properties. Verify for actual construction/material specification before field use. Values are configurable.</p>
      ${cats.map(c => `<div class="card" style="margin-bottom:16px;"><h3>${c.replace("_"," ")}</h3>${tableFor(c)}</div>`).join("")}

      <div class="card">
        <h3>Add Custom Material</h3>
        <div class="form-inline">
          <div class="form-row"><label>Category</label><select id="cmCat">${cats.map(c=>`<option value="${c}">${c}</option>`).join("")}</select></div>
          <div class="form-row"><label>Name</label><input id="cmName" placeholder="e.g. Local yak-wool felt"></div>
          <div class="form-row"><label>Density (kg/m³)</label><input id="cmDensity" type="number"></div>
          <div class="form-row"><label>k (W/mK)</label><input id="cmK" type="number" step="0.001"></div>
          <div class="form-row"><label>Cp (J/kgK)</label><input id="cmCp" type="number"></div>
        </div>
        <button class="btn btn-accent btn-sm" id="addMaterialBtn">Add material</button>
        <span class="hint">Custom materials are marked <b>user-provided</b>, not pre-validated engineering values.</span>
      </div>`;

    U.on("#addMaterialBtn", "click", () => {
      const cat = U.qs("#cmCat", root).value, name = U.qs("#cmName", root).value.trim();
      if (!name) { alert("Enter a material name."); return; }
      DATA.MATERIALS.push({
        id: "custom_" + Date.now(), category: cat, name,
        density: parseFloat(U.qs("#cmDensity", root).value) || null,
        k: parseFloat(U.qs("#cmK", root).value) || null,
        cp: parseFloat(U.qs("#cmCp", root).value) || null,
        absorptivity: 0.6, reflectivity: 0.4, emissivity: 0.9,
        costPerM2: 1000, costPerKg: 5, sustainability: "MEDIUM", isCustom: true
      });
      window.APP.render();
      window.APP.toast("Custom material added (user-provided — not a validated engineering value).");
    }, root);
  };
})();
