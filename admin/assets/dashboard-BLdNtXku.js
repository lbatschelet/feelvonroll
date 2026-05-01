function a(){const s=document.createElement("section");return s.className="card dashboard-card",s.innerHTML=`
    <div class="card-header">
      <h2>Overview</h2>
    </div>
    <div class="dashboard-grid">
      <div class="dashboard-item">
        <span class="muted">Total pins</span>
        <strong id="dashboardPinsTotal">0</strong>
      </div>
      <div class="dashboard-item">
        <span class="muted">Pending pins</span>
        <strong id="dashboardPinsPending">0</strong>
      </div>
      <div class="dashboard-item">
        <span class="muted">Approved pins</span>
        <strong id="dashboardPinsApproved">0</strong>
      </div>
      <div class="dashboard-item">
        <span class="muted">Rejected pins</span>
        <strong id="dashboardPinsRejected">0</strong>
      </div>
      <div class="dashboard-item">
        <span class="muted">Questions</span>
        <strong id="dashboardQuestionsTotal">0</strong>
      </div>
      <div class="dashboard-item">
        <span class="muted">Active languages</span>
        <strong id="dashboardLanguagesActive">0</strong>
      </div>
    </div>
  `,{element:s,dashboardPinsTotal:s.querySelector("#dashboardPinsTotal"),dashboardPinsPending:s.querySelector("#dashboardPinsPending"),dashboardPinsApproved:s.querySelector("#dashboardPinsApproved"),dashboardPinsRejected:s.querySelector("#dashboardPinsRejected"),dashboardQuestionsTotal:s.querySelector("#dashboardQuestionsTotal"),dashboardLanguagesActive:s.querySelector("#dashboardLanguagesActive")}}export{a as createDashboardCard};
