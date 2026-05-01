import{i as e}from"./dom-DU-lIz3W.js";function s(){const a=document.createElement("div");return a.className="modal-backdrop unsaved-dialog",a.innerHTML=`
    <div class="modal modal-sm">
      <div class="modal-header">
        <h3>Unsaved changes</h3>
      </div>
      <p class="unsaved-message">You have unsaved changes. What would you like to do?</p>
      <div class="modal-actions">
        <button type="button" class="ghost" id="unsavedStay">Stay</button>
        <button type="button" class="danger" id="unsavedDiscard">Discard</button>
        <button type="button" class="btn-save" id="unsavedSave">${e.save} Save &amp; continue</button>
      </div>
    </div>
  `,{element:a,stayButton:a.querySelector("#unsavedStay"),discardButton:a.querySelector("#unsavedDiscard"),saveButton:a.querySelector("#unsavedSave")}}export{s as createUnsavedDialog};
