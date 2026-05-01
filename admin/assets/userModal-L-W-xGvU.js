import{e as a}from"./dom-DU-lIz3W.js";function o(){const e=document.createElement("div");return e.className="modal-backdrop",e.innerHTML=`
    <div class="modal">
      <div class="modal-header">
        <h3 id="modalTitle">Create user</h3>
        <button type="button" class="modal-close" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        <div id="modalFormArea">
          <div class="question-row">
            <label class="field">
              <span>First name</span>
              <input type="text" id="modalUserFirstName" placeholder="First name" autocomplete="given-name" />
            </label>
            <label class="field">
              <span>Last name</span>
              <input type="text" id="modalUserLastName" placeholder="Last name" autocomplete="family-name" />
            </label>
          </div>
          <div class="question-row">
            <label class="field">
              <span>Email</span>
              <input
                type="email"
                id="modalUserEmail"
                placeholder="name@domain.ch"
                autocomplete="email"
              />
            </label>
          </div>
          <details class="modal-advanced" id="modalAdvanced">
            <summary>Set password manually</summary>
            <div class="question-row modal-password">
              <label class="field">
                <span>Password</span>
                <input
                  type="password"
                  id="modalUserPassword"
                  placeholder="Min. 8 characters"
                  autocomplete="new-password"
                />
              </label>
              <label class="field">
                <span>Confirm password</span>
                <input
                  type="password"
                  id="modalUserPasswordConfirm"
                  placeholder="Confirm password"
                  autocomplete="new-password"
                />
              </label>
            </div>
            <div id="modalPasswordMatch" class="password-match"></div>
          </details>
          <div class="admin-toggle">
            <label class="admin-toggle-row">
              <input type="checkbox" id="modalUserIsAdmin" />
              <strong>Admin</strong>
            </label>
            <p class="admin-toggle-hint">Admins can manage users, configure the questionnaire, and view audit logs. Regular users can only review and moderate pins.</p>
          </div>
        </div>
        <div id="modalResultArea" style="display: none;">
          <p class="modal-result-msg">User created successfully. Share the password link below so they can set their password.</p>
          <div class="reset-link-box">
            <div class="muted" id="modalResultExpiryLabel">Password link (valid for 24 hours)</div>
            <div class="reset-link-row">
              <input type="text" id="modalResultLink" readonly />
              <button type="button" id="modalCopyLink" class="ghost">Copy</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="ghost" id="modalCancel">Cancel</button>
        <div class="split-btn" id="modalSplitBtn">
          <button type="button" id="modalCreateUser">Create password link</button>
          <button type="button" class="split-btn-caret" id="modalExpiryToggle" title="Token validity period">24h ▾</button>
          <div class="split-btn-menu" id="modalExpiryMenu">
            <button type="button" data-hours="1">1 hour</button>
            <button type="button" data-hours="24" class="is-active">24 hours</button>
            <button type="button" data-hours="168">7 days</button>
            <button type="button" data-hours="720">30 days</button>
          </div>
        </div>
        <button type="button" id="modalDone" style="display: none;">Done</button>
      </div>
    </div>
  `,a(e),{element:e,modalCloseButton:e.querySelector(".modal-close"),modalCancelButton:e.querySelector("#modalCancel"),modalCreateUserButton:e.querySelector("#modalCreateUser"),modalTitle:e.querySelector("#modalTitle"),modalUserFirstName:e.querySelector("#modalUserFirstName"),modalUserLastName:e.querySelector("#modalUserLastName"),modalUserEmail:e.querySelector("#modalUserEmail"),modalUserIsAdmin:e.querySelector("#modalUserIsAdmin"),modalUserPassword:e.querySelector("#modalUserPassword"),modalUserPasswordConfirm:e.querySelector("#modalUserPasswordConfirm"),modalAdvanced:e.querySelector("#modalAdvanced"),modalPasswordMatch:e.querySelector("#modalPasswordMatch"),modalFormArea:e.querySelector("#modalFormArea"),modalResultArea:e.querySelector("#modalResultArea"),modalResultLink:e.querySelector("#modalResultLink"),modalResultExpiryLabel:e.querySelector("#modalResultExpiryLabel"),modalCopyLink:e.querySelector("#modalCopyLink"),modalSplitBtn:e.querySelector("#modalSplitBtn"),modalExpiryToggle:e.querySelector("#modalExpiryToggle"),modalExpiryMenu:e.querySelector("#modalExpiryMenu"),modalDone:e.querySelector("#modalDone")}}export{o as createUserModal};
