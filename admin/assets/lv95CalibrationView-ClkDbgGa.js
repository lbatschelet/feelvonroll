function t(){const e=document.createElement("section");return e.className="card lv95-calibration-card",e.style.display="none",e.innerHTML=`
    <div class="card-header">
      <div class="card-header-left">
        <h2>LV95 Calibration</h2>
        <span class="muted">EPSG:2056</span>
      </div>
      <div class="header-actions">
        <button class="ghost" id="lv95UnlockBtn" type="button">Unlock</button>
        <button class="ghost" id="lv95PreviewBtn" type="button" disabled>Preview</button>
        <button class="primary" id="lv95SaveBtn" type="button" disabled>Save</button>
      </div>
    </div>

    <p class="form-hint">
      Pick 3 floor points in the webapp (Capture), then enter LV95 E/N per point. You can type or paste Swiss-formatted numbers
      (e.g. <code>2'598'784.10</code>) or paste the pair from map.geo.admin.ch in one field: <code>2'598'784.10, 1'200'158.40</code>.
      Use Preview to validate RMS before saving.
    </p>

    <div class="form-row" style="max-width:520px">
      <label><strong>Label (optional)</strong></label>
      <input type="text" id="lv95Label" placeholder="e.g. VonRoll 2026-04" />
    </div>

    <div class="admin-toggle" style="margin-bottom:14px">
      <label class="admin-toggle-row">
        <input type="checkbox" id="lv95ApplyStations" checked />
        <strong>Apply to stations</strong>
      </label>
      <p class="admin-toggle-hint">Updates stations.lv95_e/lv95_n from target_x/target_z using the saved calibration.</p>
    </div>

    <div id="lv95PointsBody" class="lv95-points" aria-label="Calibration points"></div>

    <div style="margin-top:12px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
      <div class="muted" id="lv95ActiveHint"></div>
      <div class="muted" id="lv95PreviewHint"></div>
    </div>
  `,{element:e,unlockBtn:e.querySelector("#lv95UnlockBtn"),previewBtn:e.querySelector("#lv95PreviewBtn"),saveBtn:e.querySelector("#lv95SaveBtn"),labelInput:e.querySelector("#lv95Label"),applyStations:e.querySelector("#lv95ApplyStations"),pointsBody:e.querySelector("#lv95PointsBody"),activeHint:e.querySelector("#lv95ActiveHint"),previewHint:e.querySelector("#lv95PreviewHint")}}export{t as createLv95CalibrationView};
