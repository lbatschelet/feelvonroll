import{i as e}from"./dom-DU-lIz3W.js";function n(){const t=document.createElement("section");return t.className="card stations-card",t.style.display="none",t.innerHTML=`
    <div class="card-header">
      <h2>Stations</h2>
      <button class="button" id="addStationBtn">+ New Station</button>
    </div>

    <div id="stationsListWrap">
      <table class="table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Name</th>
            <th>Floor</th>
            <th>Questionnaire</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="stationsTableBody"></tbody>
      </table>
    </div>

    <!-- Station edit modal -->
    <div class="modal-backdrop" id="stationModal">
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3 id="stationEditTitle">New Station</h3>
          <button class="modal-close" id="closeStationModal" type="button">&times;</button>
        </div>
        <div class="modal-fields-row">
          <label class="field">
            <span>Key</span>
            <input type="text" id="stKeyInput" placeholder="e.g. foyer-eg" />
          </label>
          <label class="field">
            <span>Name</span>
            <input type="text" id="stNameInput" placeholder="e.g. Foyer Erdgeschoss" />
          </label>
        </div>
        <p class="form-hint" style="margin-top:0">
          Key is the stable, URL-safe slug embedded in QR codes and paths (lowercase, numbers, hyphens). Keep it short and unique. Use Name for the human-readable label.
        </p>
        <label class="field" style="margin-bottom:12px">
          <span>Description</span>
          <textarea id="stDescInput" rows="2" placeholder="Optional description"></textarea>
        </label>
        <div class="modal-fields-row">
          <label class="field">
            <span>Floor Index</span>
            <input type="number" id="stFloorInput" value="0" min="0" />
          </label>
          <label class="field">
            <span>Questionnaire</span>
            <select id="stQuestionnaireSelect">
              <option value="">— Default —</option>
            </select>
          </label>
        </div>
        <div class="modal-checks-row">
          <label class="checkbox-inline"><input type="checkbox" id="stActiveCheck" checked /> Active</label>
        </div>

        <div class="station-link-section" id="stationLinkSection" style="display:none">
          <p class="station-link-section-title">Public URLs</p>
          <p class="form-hint" style="margin-top:0">The QR code encodes the standard URL only. Use the tablet button to copy the kiosk URL.</p>
          <label class="field">
            <span>Standard (print &amp; normal visit)</span>
            <div class="copy-row">
              <input type="text" id="stLinkDisplayStandard" readonly />
              <button type="button" class="icon-btn-ghost" id="stCopyLinkStandard" title="Copy standard station URL">${e.copy}</button>
              <button type="button" class="icon-btn-ghost" id="stDownloadQrStandard" title="Download QR code (standard URL, PNG)">${e.qr}</button>
            </div>
          </label>
          <label class="field">
            <span>Kiosk (iPad)</span>
            <div class="copy-row">
              <input type="text" id="stLinkDisplayKiosk" readonly />
              <button type="button" class="icon-btn-ghost" id="stCopyLinkKiosk" title="Copy kiosk URL">${e.tablet}</button>
            </div>
          </label>
        </div>

        <h4 style="margin-top:1rem;margin-bottom:6px;">Camera Position</h4>
        <p class="form-hint">Set the 3D camera position and look-at target. Use "Capture from Webapp" to pick interactively.</p>

        <div class="position-grid">
          <label class="field"><span>Camera X</span> <input type="number" step="any" id="stCamX" value="0" /></label>
          <label class="field"><span>Camera Y</span> <input type="number" step="any" id="stCamY" value="0" /></label>
          <label class="field"><span>Camera Z</span> <input type="number" step="any" id="stCamZ" value="0" /></label>
          <label class="field"><span>Target X</span> <input type="number" step="any" id="stTgtX" value="0" /></label>
          <label class="field"><span>Target Y</span> <input type="number" step="any" id="stTgtY" value="0" /></label>
          <label class="field"><span>Target Z</span> <input type="number" step="any" id="stTgtZ" value="0" /></label>
        </div>

        <button class="button ghost" id="capturePositionBtn" type="button" style="margin-bottom:12px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 4px;">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
          Capture from Webapp
        </button>

        <input type="hidden" id="stIdInput" />

        <div class="modal-actions">
          <button class="icon-btn danger" id="deleteStationBtn" type="button" title="Delete this station" style="display:none">${e.trash}</button>
          <span class="modal-actions-spacer"></span>
          <button class="ghost" id="cancelStationBtn" type="button">Cancel</button>
          <button class="btn-save" id="saveStationBtn">${e.save} Save</button>
        </div>
      </div>
    </div>
  `,{element:t,addBtn:t.querySelector("#addStationBtn"),tableBody:t.querySelector("#stationsTableBody"),modal:t.querySelector("#stationModal"),editTitle:t.querySelector("#stationEditTitle"),closeModalBtn:t.querySelector("#closeStationModal"),keyInput:t.querySelector("#stKeyInput"),nameInput:t.querySelector("#stNameInput"),descInput:t.querySelector("#stDescInput"),floorInput:t.querySelector("#stFloorInput"),questionnaireSelect:t.querySelector("#stQuestionnaireSelect"),activeCheck:t.querySelector("#stActiveCheck"),linkSection:t.querySelector("#stationLinkSection"),linkDisplayStandard:t.querySelector("#stLinkDisplayStandard"),copyLinkStandardBtn:t.querySelector("#stCopyLinkStandard"),downloadQrStandardBtn:t.querySelector("#stDownloadQrStandard"),linkDisplayKiosk:t.querySelector("#stLinkDisplayKiosk"),copyLinkKioskBtn:t.querySelector("#stCopyLinkKiosk"),camX:t.querySelector("#stCamX"),camY:t.querySelector("#stCamY"),camZ:t.querySelector("#stCamZ"),tgtX:t.querySelector("#stTgtX"),tgtY:t.querySelector("#stTgtY"),tgtZ:t.querySelector("#stTgtZ"),captureBtn:t.querySelector("#capturePositionBtn"),deleteBtn:t.querySelector("#deleteStationBtn"),idInput:t.querySelector("#stIdInput"),saveBtn:t.querySelector("#saveStationBtn"),cancelBtn:t.querySelector("#cancelStationBtn")}}export{n as createStationsView};
