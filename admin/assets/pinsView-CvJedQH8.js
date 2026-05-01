import{i as o}from"./dom-DU-lIz3W.js";function l(){const t=document.createElement("section");t.className="card tools-card",t.innerHTML=`
    <div class="tools">
      <input type="text" id="searchInput" placeholder="Search (ID, floor, text)" title="Filter by ID, floor, or note text" />
      <select id="filterSelect" title="Filter by approval status">
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <select id="sortSelect" title="Sort pins">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="floor">Floor</option>
        <option value="wellbeing">Wellbeing</option>
      </select>
      <select id="pageSizeSelect" title="Rows per page">
        <option value="10">10 per page</option>
        <option value="25" selected>25 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </select>
      <button id="reloadPins" class="icon-btn-ghost" title="Reload pin list">${o.reload}</button>
      <div class="split-btn">
        <button id="exportPinsCsv" class="ghost" title="Download pin data as CSV (timestamps are UTC)">Export CSV (UTC)</button>
        <button id="exportPinsCsvMenu" class="ghost split-btn-caret" title="More export options" aria-haspopup="menu" aria-expanded="false">
          ${o.chevronDown}
        </button>
        <div id="exportPinsCsvMenuPanel" class="split-btn-menu" role="menu" aria-label="Export options">
          <button id="exportPinsCsvLong" type="button" role="menuitem" title="Download detailed pin answer data as CSV (one row per question, timestamps are UTC)">Export CSV (Long, UTC)</button>
        </div>
      </div>
    </div>
  `;const e=document.createElement("section");return e.className="card",e.innerHTML=`
    <div class="card-header">
      <div class="card-header-left">
        <h2>Pins</h2>
        <span id="pinCount" class="muted" title="Total pins matching filter">0</span>
      </div>
      <div class="header-actions">
        <div class="pagination">
          <button id="firstPage" class="icon-btn-ghost" title="First page">${o.chevronsLeft}</button>
          <button id="prevPage" class="icon-btn-ghost" title="Previous page">${o.chevronLeft}</button>
          <span id="pageInfo" class="page-info">Page 1 of 1</span>
          <button id="nextPage" class="icon-btn-ghost" title="Next page">${o.chevronRight}</button>
          <button id="lastPage" class="icon-btn-ghost" title="Last page">${o.chevronsRight}</button>
        </div>
        <span class="header-divider"></span>
        <button id="approveSelected" class="ghost" title="Mark selected pins as approved">Approve</button>
        <button id="pendingSelected" class="ghost" title="Mark selected pins as pending">Pending</button>
        <button id="blockSelected" class="ghost" title="Mark selected pins as rejected (irreversible in practice)">Reject</button>
        <button id="deleteSelected" class="icon-btn danger" title="Delete selected pins (admins only, irreversible)">${o.trash}</button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" id="selectAll" /></th>
            <th>ID</th>
            <th>Station</th>
            <th>Questionnaire</th>
            <th>Text answers</th>
            <th>Created</th>
            <th class="text-right">Status</th>
          </tr>
        </thead>
        <tbody id="pinsBody"></tbody>
      </table>
    </div>
  `,{toolsCard:t,tableCard:e,reloadButton:t.querySelector("#reloadPins"),exportCsvButton:t.querySelector("#exportPinsCsv"),exportCsvLongButton:t.querySelector("#exportPinsCsvLong"),exportCsvMenuButton:t.querySelector("#exportPinsCsvMenu"),exportCsvMenuPanel:t.querySelector("#exportPinsCsvMenuPanel"),pageSizeSelect:t.querySelector("#pageSizeSelect"),firstPageButton:e.querySelector("#firstPage"),prevPageButton:e.querySelector("#prevPage"),nextPageButton:e.querySelector("#nextPage"),lastPageButton:e.querySelector("#lastPage"),pageInfo:e.querySelector("#pageInfo"),searchInput:t.querySelector("#searchInput"),filterSelect:t.querySelector("#filterSelect"),sortSelect:t.querySelector("#sortSelect"),pinCount:e.querySelector("#pinCount"),approveSelected:e.querySelector("#approveSelected"),pendingSelected:e.querySelector("#pendingSelected"),blockSelected:e.querySelector("#blockSelected"),deleteSelected:e.querySelector("#deleteSelected"),selectAll:e.querySelector("#selectAll"),pinsBody:e.querySelector("#pinsBody")}}export{l as createPinsView};
