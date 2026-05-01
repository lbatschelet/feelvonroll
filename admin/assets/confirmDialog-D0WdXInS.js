import{b as v,h as y,s as C}from"./adminModal-USiLx18-.js";function k(){const e=document.createElement("div");e.className="modal-backdrop confirm-dialog",e.innerHTML=`
    <div class="modal modal-sm" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
      <div class="modal-header">
        <h3 id="confirmTitle">Confirm</h3>
        <button type="button" class="modal-close" aria-label="Close">×</button>
      </div>
      <p class="unsaved-message confirm-message"></p>
      <div class="modal-actions">
        <button type="button" class="ghost" id="confirmCancel">Cancel</button>
        <button type="button" class="danger" id="confirmOk">Delete</button>
      </div>
    </div>
  `;const r=e.querySelector("#confirmTitle"),i=e.querySelector(".confirm-message"),d=e.querySelector(".modal-close"),s=e.querySelector("#confirmCancel"),n=e.querySelector("#confirmOk");let t=null;const l=o=>{if(y(e),t){const a=t;t=null,a(!!o)}};v(e,()=>l(!1),[d,s]),n.addEventListener("click",()=>l(!0));const c=o=>{o.key==="Escape"&&l(!1)};return{element:e,confirm:async({title:o="Confirm",message:a="",okLabel:m="OK",cancelLabel:u="Cancel"}={})=>(r.textContent=o,i.textContent=a,n.textContent=m,s.textContent=u,C(e),n.focus(),document.addEventListener("keydown",c),await new Promise(f=>{t=b=>{document.removeEventListener("keydown",c),f(b)}}))}}export{k as createConfirmDialog};
