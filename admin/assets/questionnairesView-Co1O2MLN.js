import{i as t}from"./dom-DU-lIz3W.js";function a(){const e=document.createElement("section");return e.className="card questionnaires-card",e.style.display="none",e.innerHTML=`
    <div class="card-header">
      <h2>Questionnaires</h2>
      <button class="button" id="addQuestionnaireBtn">+ New Questionnaire</button>
    </div>

    <div id="questionnairesListWrap">
      <table class="table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Name</th>
            <th>Slots</th>
            <th>Default</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="questionnairesTableBody"></tbody>
      </table>
    </div>

    <!-- Questionnaire edit modal -->
    <div class="modal-backdrop" id="questionnaireModal">
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3 id="questionnaireEditTitle">New Questionnaire</h3>
          <button class="modal-close" id="closeQuestionnaireModal" type="button">&times;</button>
        </div>

        <div class="modal-fields-row">
          <label class="field">
            <span>Key</span>
            <input type="text" id="qnrKeyInput" placeholder="e.g. station_foyer" />
          </label>
          <label class="field">
            <span>Name</span>
            <input type="text" id="qnrNameInput" placeholder="e.g. Foyer Questionnaire" />
          </label>
        </div>
        <label class="field" style="margin-bottom:12px">
          <span>Description</span>
          <textarea id="qnrDescInput" rows="2" placeholder="Optional description"></textarea>
        </label>
        <div class="modal-checks-row">
          <label class="checkbox-inline"><input type="checkbox" id="qnrActiveCheck" checked /> Active</label>
        </div>
        <input type="hidden" id="qnrIdInput" />

        <h4 style="margin-top:0.5rem;margin-bottom:6px;">Slots</h4>
        <p class="form-hint">Each slot is a position in the questionnaire. A fixed slot always shows the same question. A pool slot randomly picks from assigned questions.</p>

        <div id="slotsContainer"></div>
        <button class="button ghost" id="addSlotBtn" type="button">+ Add Slot</button>

        <div class="modal-actions" style="margin-top:1rem">
          <button class="icon-btn danger" id="deleteQuestionnaireBtn" type="button" title="Delete this questionnaire" style="display:none">${t.trash}</button>
          <span class="modal-actions-spacer"></span>
          <button class="ghost" id="cancelQuestionnaireBtn" type="button">Cancel</button>
          <button class="btn-save" id="saveQuestionnaireBtn">${t.save} Save</button>
        </div>
      </div>
    </div>
  `,{element:e,addBtn:e.querySelector("#addQuestionnaireBtn"),tableBody:e.querySelector("#questionnairesTableBody"),modal:e.querySelector("#questionnaireModal"),editTitle:e.querySelector("#questionnaireEditTitle"),closeModalBtn:e.querySelector("#closeQuestionnaireModal"),keyInput:e.querySelector("#qnrKeyInput"),nameInput:e.querySelector("#qnrNameInput"),descInput:e.querySelector("#qnrDescInput"),activeCheck:e.querySelector("#qnrActiveCheck"),idInput:e.querySelector("#qnrIdInput"),deleteBtn:e.querySelector("#deleteQuestionnaireBtn"),slotsContainer:e.querySelector("#slotsContainer"),addSlotBtn:e.querySelector("#addSlotBtn"),saveBtn:e.querySelector("#saveQuestionnaireBtn"),cancelBtn:e.querySelector("#cancelQuestionnaireBtn")}}export{a as createQuestionnairesView};
