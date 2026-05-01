import{b as e}from"./config-BJ-Z3s_A.js";function u(){const t=document.createElement("header");t.className="header";const n=e?.wordmarkHtml,a=e?.siteUrl;return t.innerHTML=`
    <div class="header-brand">
      <a class="header-title" data-action="dashboard" href="#" title="Go to dashboard">${n} Admin</a>
      <a class="header-external" href="${a}" target="_blank" rel="noopener" title="Open ${a}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>
    <nav class="nav">
      <button class="nav-button" data-page="pins">Pins</button>
      <button class="nav-button" data-page="questionnaire">Questions</button>
      <button class="nav-button" data-page="questionnaires">Questionnaires</button>
      <button class="nav-button" data-page="stations">Stations</button>
      <button class="nav-button" data-page="calibration" data-admin-only="true">Calibration</button>
      <button class="nav-button" data-page="languages">Languages</button>
      <button class="nav-button" data-page="users" data-admin-only="true">Users</button>
      <button class="nav-button" data-page="audit" data-admin-only="true">Audit</button>
      <button class="nav-button" data-page="content">Content</button>
      <div class="user-menu">
        <button class="nav-button" id="userMenuButton" type="button">Profile</button>
        <div class="user-menu-panel" id="userMenuPanel">
          <button type="button" data-action="profile">Edit profile</button>
          <button type="button" data-action="logout">Log out</button>
        </div>
      </div>
    </nav>
  `,{element:t,titleButton:t.querySelector(".header-title"),nav:t.querySelector(".nav"),navButtons:Array.from(t.querySelectorAll(".nav-button[data-page]")),userMenuButton:t.querySelector("#userMenuButton"),userMenuPanel:t.querySelector("#userMenuPanel"),userMenuItems:Array.from(t.querySelectorAll("#userMenuPanel button"))}}export{u as createHeader};
