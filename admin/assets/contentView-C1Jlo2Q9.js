import{i as e}from"./dom-DU-lIz3W.js";function o(){const t=document.createElement("section");return t.className="card content-card",t.innerHTML=`
    <div class="card-header">
      <h2>Content Pages</h2>
      <div class="header-actions">
        <button id="contentReload" class="icon-btn-ghost" title="Reload content">${e.reload}</button>
      </div>
    </div>
    <div id="contentEditors" class="content-editors"></div>
  `,{element:t,reloadButton:t.querySelector("#contentReload"),editorsContainer:t.querySelector("#contentEditors")}}export{o as createContentView};
