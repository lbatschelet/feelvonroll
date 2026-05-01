import{e as a}from"./dom-DU-lIz3W.js";function i(){const t="/admin/",e=t.endsWith("/")?t:`${t}/`,o=document.createElement("section");return o.className="card login-card",o.innerHTML=`
    <h2>Login</h2>
    <div class="auth-section" data-section="login">
      <div class="form-row">
        <label>Email</label>
        <input type="email" id="loginEmail" placeholder="name@domain.ch" title="Admin account email" />
      </div>
      <div class="form-row">
        <label>Password</label>
        <input type="password" id="loginPassword" placeholder="Password" title="Admin account password" />
      </div>
      <div class="form-actions">
        <button id="loginUserButton">Log in</button>
        <a href="${e}reset" class="forgot-link">Forgot password?</a>
      </div>
    </div>
    <div class="auth-section" data-section="bootstrap">
      <div class="form-row">
        <label>Admin token</label>
        <input type="password" id="adminToken" placeholder="Token" title="One-time bootstrap token" />
      </div>
      <div class="form-actions">
        <button id="bootstrapButton">Start setup</button>
      </div>
    </div>
  `,a(o),{element:o,loginEmail:o.querySelector("#loginEmail"),loginPassword:o.querySelector("#loginPassword"),loginUserButton:o.querySelector("#loginUserButton"),tokenInput:o.querySelector("#adminToken"),bootstrapButton:o.querySelector("#bootstrapButton")}}export{i as createLoginCard};
