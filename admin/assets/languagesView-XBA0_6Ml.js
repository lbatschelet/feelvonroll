import{i as e}from"./dom-DU-lIz3W.js";function t(){const a=document.createElement("section");return a.className="card languages-card",a.innerHTML=`
    <div class="card-header">
      <h2>Languages</h2>
      <div class="header-actions">
        <button class="button" id="addLanguageBtn">+ New Language</button>
      </div>
    </div>
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Label</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="languagesBody"></tbody>
      </table>
    </div>

    <!-- Language create/edit modal -->
    <div class="modal-backdrop" id="languageModal">
      <div class="modal">
        <div class="modal-header">
          <h3 id="languageModalTitle">New Language</h3>
          <button class="modal-close" id="closeLanguageModal" type="button">&times;</button>
        </div>
        <div class="modal-fields-row">
          <label class="field">
            <span>Code</span>
            <input type="text" id="languageCode" placeholder="e.g. en" title="Short language code" />
          </label>
          <label class="field">
            <span>Label</span>
            <input type="text" id="languageLabel" placeholder="e.g. English" title="Language name" />
          </label>
        </div>
        <div class="modal-actions">
          <span class="modal-actions-spacer"></span>
          <button class="ghost" id="cancelLanguageModal" type="button">Cancel</button>
          <button id="saveLanguageBtn" class="btn-save" type="button">${e.save} Save</button>
        </div>
      </div>
    </div>
  `,{element:a,addBtn:a.querySelector("#addLanguageBtn"),languagesBody:a.querySelector("#languagesBody"),modal:a.querySelector("#languageModal"),modalTitle:a.querySelector("#languageModalTitle"),closeModalBtn:a.querySelector("#closeLanguageModal"),cancelModalBtn:a.querySelector("#cancelLanguageModal"),codeInput:a.querySelector("#languageCode"),labelInput:a.querySelector("#languageLabel"),saveBtn:a.querySelector("#saveLanguageBtn")}}export{t as createLanguagesView};
