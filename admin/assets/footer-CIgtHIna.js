import{b as r}from"./config-dcVj4wuk.js";const a=r?.siteUrl+"/issue/?source=admin";function n(){const e=document.createElement("footer");e.className="app-footer";const t=new Date().getFullYear();return e.innerHTML=`
    <div class="footer-left">
      <span class="footer-credit">
        © ${t}
        <a href="https://lukasbatschelet.ch" target="_blank" rel="noopener">Lukas Batschelet</a>
        for
        <a href="https://www.phbern.ch" target="_blank" rel="noopener" class="footer-phbern" title="PHBern"><strong>PH</strong>&thinsp;Bern</a>
      </span>
      <span class="footer-license">
        Licensed under <a href="https://github.com/lbatschelet/feelvonroll-admin/blob/main/LICENSE" target="_blank" rel="noopener">AGPL-3.0</a>
      </span>
    </div>
    <a class="footer-bug" href="${a}" target="_blank" rel="noopener" title="Report a bug or request a feature">
      Report a bug
    </a>
  `,{element:e}}export{n as createFooter};
