import{i as e}from"./dom-DU-lIz3W.js";function a(){const t=document.createElement("section");return t.className="card audit-card",t.innerHTML=`
    <div class="card-header">
      <h2>Audit Log</h2>
      <button id="reloadAudit" class="icon-btn-ghost" title="Reload audit log">${e.reload}</button>
    </div>
    <div class="card-header">
      <div class="card-header-left">
        <span id="auditCount" class="muted" title="Total audit entries">0</span>
      </div>
      <div class="header-actions">
        <select id="auditLimit" title="Rows per page">
          <option value="25">25</option>
          <option value="50" selected>50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>
        <div class="pagination">
          <button id="auditFirst" class="icon-btn-ghost" title="First page">${e.chevronsLeft}</button>
          <button id="auditPrev" class="icon-btn-ghost" title="Previous page">${e.chevronLeft}</button>
          <span id="auditPageInfo" class="page-info">Page 1 of 1</span>
          <button id="auditNext" class="icon-btn-ghost" title="Next page">${e.chevronRight}</button>
          <button id="auditLast" class="icon-btn-ghost" title="Last page">${e.chevronsRight}</button>
        </div>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Target</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody id="auditBody"></tbody>
      </table>
    </div>
  `,{element:t,reloadAuditButton:t.querySelector("#reloadAudit"),auditLimitSelect:t.querySelector("#auditLimit"),auditFirstButton:t.querySelector("#auditFirst"),auditPrevButton:t.querySelector("#auditPrev"),auditNextButton:t.querySelector("#auditNext"),auditLastButton:t.querySelector("#auditLast"),auditPageInfo:t.querySelector("#auditPageInfo"),auditCount:t.querySelector("#auditCount"),auditBody:t.querySelector("#auditBody")}}export{a as createAuditView};
