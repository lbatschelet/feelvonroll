import{i as a,e as s}from"./dom-DU-lIz3W.js";function o(){const e=document.createElement("div");return e.className="modal-backdrop",e.innerHTML=`
    <div class="modal">
      <div class="modal-header">
        <h3>Edit profile</h3>
        <button type="button" class="modal-close" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        <div class="question-row">
          <label class="field">
            <span>First name</span>
            <input type="text" id="profileFirstName" autocomplete="given-name" />
          </label>
          <label class="field">
            <span>Last name</span>
            <input type="text" id="profileLastName" autocomplete="family-name" />
          </label>
        </div>
        <div class="question-row">
          <label class="field">
            <span>Email</span>
            <input type="email" id="profileEmail" autocomplete="email" />
          </label>
        </div>
        <details class="modal-advanced" id="profilePasswordSection">
          <summary>Change password</summary>
          <div class="question-row">
            <label class="field">
              <span>Current password</span>
              <input type="password" id="profileCurrentPassword" autocomplete="current-password" title="Required when changing password" />
            </label>
          </div>
          <div class="question-row modal-password">
            <label class="field">
              <span>New password</span>
              <input type="password" id="profileNewPassword" autocomplete="new-password" />
            </label>
            <label class="field">
              <span>Confirm new password</span>
              <input type="password" id="profileNewPasswordConfirm" autocomplete="new-password" />
            </label>
          </div>
        </details>
      </div>
      <div class="modal-actions">
        <button type="button" class="ghost" id="profileCancel">Cancel</button>
        <button type="button" id="profileSave" class="btn-save">${a.save} Save</button>
      </div>
    </div>
  `,s(e),{element:e,modalCloseButton:e.querySelector(".modal-close"),modalCancelButton:e.querySelector("#profileCancel"),modalSaveButton:e.querySelector("#profileSave"),firstNameInput:e.querySelector("#profileFirstName"),lastNameInput:e.querySelector("#profileLastName"),emailInput:e.querySelector("#profileEmail"),currentPasswordInput:e.querySelector("#profileCurrentPassword"),newPasswordInput:e.querySelector("#profileNewPassword"),newPasswordConfirmInput:e.querySelector("#profileNewPasswordConfirm")}}export{o as createProfileModal};
