import{i as t}from"./dom-DU-lIz3W.js";function o(){const e=document.createElement("section");return e.className="card questionnaire-card",e.innerHTML=`
    <div class="card-header">
      <h2>Questions</h2>
      <div class="header-actions">
        <button class="button" id="addQuestionBtn">+ New Question</button>
      </div>
    </div>
    <div class="question-languages" style="display:none">
      <select id="languageSelect"></select>
    </div>
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Label</th>
            <th>Type</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="questionsBody"></tbody>
      </table>
    </div>
    <div class="palette-global-section">
      <div class="palette-global-title-row">
        <h3>Global color scale</h3>
        <button class="button" id="saveGlobalColorPalette">Save scale</button>
      </div>
      <p class="palette-global-hint">One diverging scale for negative → neutral → positive values.</p>
      <div class="palette-global-options" id="globalColorPaletteOptions"></div>
    </div>

    <!-- Question edit/create modal -->
    <div class="modal-backdrop" id="questionModal">
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3 id="questionModalTitle">New question</h3>
          <button class="modal-close" id="closeQuestionModal" type="button">&times;</button>
        </div>
        <div class="modal-fields-row">
          <label class="field">
            <span>Key</span>
            <input type="text" id="newQuestionKey" placeholder="e.g. wellbeing" title="Unique identifier used in the API" />
          </label>
          <label class="field">
            <span>Type</span>
            <select id="newQuestionType">
              <option value="slider">Slider</option>
              <option value="multi">Multiple choice</option>
              <option value="influence">Influence (checkbox + slider)</option>
              <option value="text">Text</option>
            </select>
          </label>
        </div>
        <div class="modal-checks-row">
          <label class="checkbox-inline"><input type="checkbox" id="newQuestionRequired" title="Must be answered before submitting" /> Required</label>
          <label class="checkbox-inline"><input type="checkbox" id="newQuestionActive" checked title="Visible to end users" /> Active</label>
          <label class="checkbox-inline slider-color-only"><input type="checkbox" id="newQuestionUseForColor" title="Use this slider to color pins on the map" /> Pin color</label>
          <label class="checkbox-inline multi-only"><input type="checkbox" id="newQuestionSingleChoice" checked title="Only one option can be selected" /> Single choice</label>
        </div>
        <div class="modal-translations" id="newQuestionTranslations"></div>
        <div class="modal-config-grid slider-range-only">
          <label class="field">
            <span>Min</span>
            <input type="number" id="newQuestionMin" value="0" />
          </label>
          <label class="field">
            <span>Max</span>
            <input type="number" id="newQuestionMax" value="1" />
          </label>
          <label class="field">
            <span>Step</span>
            <input type="number" id="newQuestionStep" value="0.01" />
          </label>
          <label class="field">
            <span>Default</span>
            <input type="number" id="newQuestionDefault" value="0.5" />
          </label>
        </div>
        <div class="modal-config-grid text-only">
          <label class="field">
            <span>Rows</span>
            <input type="number" id="newQuestionRows" value="3" title="Height of the text field" />
          </label>
        </div>
        <div id="questionModalOptions"></div>
        <div class="modal-actions">
          <button class="icon-btn danger" id="deleteQuestion" type="button" title="Delete this question" style="display:none">${t.trash}</button>
          <span class="modal-actions-spacer"></span>
          <button class="ghost" id="cancelQuestionModal" type="button">Cancel</button>
          <button id="addQuestion" class="btn-save" type="button">${t.save} Save</button>
        </div>
      </div>
    </div>
  `,{element:e,addQuestionBtn:e.querySelector("#addQuestionBtn"),questionModal:e.querySelector("#questionModal"),questionModalTitle:e.querySelector("#questionModalTitle"),closeQuestionModalButton:e.querySelector("#closeQuestionModal"),cancelQuestionModalButton:e.querySelector("#cancelQuestionModal"),languageSelect:e.querySelector("#languageSelect"),questionsBody:e.querySelector("#questionsBody"),newQuestionKey:e.querySelector("#newQuestionKey"),newQuestionType:e.querySelector("#newQuestionType"),newQuestionRequired:e.querySelector("#newQuestionRequired"),newQuestionActive:e.querySelector("#newQuestionActive"),newQuestionTranslations:e.querySelector("#newQuestionTranslations"),newQuestionMin:e.querySelector("#newQuestionMin"),newQuestionMax:e.querySelector("#newQuestionMax"),newQuestionStep:e.querySelector("#newQuestionStep"),newQuestionDefault:e.querySelector("#newQuestionDefault"),newQuestionUseForColor:e.querySelector("#newQuestionUseForColor"),newQuestionSingleChoice:e.querySelector("#newQuestionSingleChoice"),newQuestionRows:e.querySelector("#newQuestionRows"),globalColorPaletteOptions:e.querySelector("#globalColorPaletteOptions"),saveGlobalColorPaletteButton:e.querySelector("#saveGlobalColorPalette"),addQuestionButton:e.querySelector("#addQuestion"),deleteQuestionButton:e.querySelector("#deleteQuestion"),questionModalOptions:e.querySelector("#questionModalOptions")}}export{o as createQuestionnaireView};
