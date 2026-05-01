import{e as s}from"./dom-DU-lIz3W.js";function r(){const e=document.createElement("div");return e.className="layout",e.innerHTML=`
    <header class="header">
      <div class="header-brand">
        <a class="header-title" href="/" title="Back to login"><em>feel</em><strong>vonRoll</strong> Admin</a>
      </div>
    </header>
    <section class="card login-card">
      <div class="reset-section" data-section="request">
        <h2>Reset password</h2>
        <p class="form-hint">Enter your email address and we will send you a link to reset your password.</p>
        <div class="form-row">
          <label>Email</label>
          <input type="email" id="resetRequestEmail" placeholder="name@domain.ch" />
        </div>
        <div class="form-actions">
          <button id="resetRequestButton">Send reset link</button>
        </div>
        <div id="resetRequestStatus" class="status"></div>
        <p class="form-hint" style="margin-top: 12px;"><a href="/">Back to login</a></p>
      </div>
      <div class="reset-section" data-section="set-password" style="display:none;">
        <h2>Set new password</h2>
        <p class="form-hint" id="resetEmailHint" style="display:none;"></p>
        <div class="form-row">
          <label>New password</label>
          <input type="password" id="resetNewPassword" placeholder="Min. 8 characters" autocomplete="new-password" />
        </div>
        <div class="form-row">
          <label>Confirm password</label>
          <input type="password" id="resetConfirmPassword" placeholder="Confirm password" autocomplete="new-password" />
        </div>
        <div id="resetPasswordMatch" class="password-match"></div>
        <div class="form-actions">
          <button id="resetSetPasswordButton">Set password</button>
        </div>
        <div id="resetSetStatus" class="status"></div>
        <p class="form-hint" style="margin-top: 12px;"><a href="/">Back to login</a></p>
      </div>
    </section>
  `,s(e),{element:e,requestSection:e.querySelector('[data-section="request"]'),requestEmail:e.querySelector("#resetRequestEmail"),requestButton:e.querySelector("#resetRequestButton"),requestStatus:e.querySelector("#resetRequestStatus"),setPasswordSection:e.querySelector('[data-section="set-password"]'),emailHint:e.querySelector("#resetEmailHint"),newPassword:e.querySelector("#resetNewPassword"),confirmPassword:e.querySelector("#resetConfirmPassword"),passwordMatch:e.querySelector("#resetPasswordMatch"),setPasswordButton:e.querySelector("#resetSetPasswordButton"),setStatus:e.querySelector("#resetSetStatus")}}export{r as createResetPage};
