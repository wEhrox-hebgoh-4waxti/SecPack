function openVisitorForm(){
  const modal=document.getElementById("visitorModal");
  if(!modal)return;
  modal.hidden=false;
  document.body.classList.add("modal-open");
  window.setTimeout(()=>modal.querySelector("input")?.focus(),50);
}
function closeVisitorForm(){
  const modal=document.getElementById("visitorModal");
  if(!modal)return;
  modal.hidden=true;
  document.body.classList.remove("modal-open");
}
async function submitVisitorForm(event){
  event.preventDefault();
  const form=document.getElementById("visitorForm");
  const status=document.getElementById("visitorStatus");
  const button=form?.querySelector(".visitor-submit");
  if(!form||!status)return;
  const data=Object.fromEntries(new FormData(form).entries());
  delete data.consent;
  await window.secpackSubmitPayload(data,"visitor",status,button);
}
document.addEventListener("click",(event)=>{
  const action=event.target.closest("[data-sec-action]")?.dataset.secAction;
  if(action==="visitor-open")openVisitorForm();
  if(action==="visitor-close")closeVisitorForm();
});
document.getElementById("visitorForm")?.addEventListener("submit",submitVisitorForm);
document.addEventListener("keydown",(event)=>{if(event.key==="Escape")closeVisitorForm()});

(function(){
  const copy={
    en:{nav:"Advisor",eyebrow:"SEC PACK · PROFESSIONAL ADVISOR",title:"Technical thinking for printing & packaging.",text:"Explore structured support for paper, films, packaging, converting, adhesives, specifications and sourcing.",button:"Open Professional Advisor",footer:"Professional Advisor"},
    fa:{nav:"مشاور حرفه‌ای",eyebrow:"SEC PACK · مشاور حرفه‌ای",title:"تفکر فنی برای چاپ و بسته‌بندی.",text:"پشتیبانی ساختاریافته برای کاغذ، فیلم، بسته‌بندی، کانورتینگ، چسب، مشخصات فنی و تأمین.",button:"ورود به مشاور حرفه‌ای",footer:"مشاور حرفه‌ای"},
    ar:{nav:"المستشار المحترف",eyebrow:"SEC PACK · المستشار المحترف",title:"تفكير فني للطباعة والتغليف.",text:"دعم منظم للورق والأفلام والتغليف والتحويل واللاصقات والمواصفات والتوريد.",button:"فتح المستشار المحترف",footer:"المستشار المحترف"}
  };
  function applyAdvisorHomeLanguage(){
    const lang=document.documentElement.lang;
    const t=copy[lang]||copy.en;
    document.querySelectorAll('[data-sec-advisor="nav"]').forEach(e=>e.textContent=t.nav);
    document.querySelectorAll('[data-sec-advisor="eyebrow"]').forEach(e=>e.textContent=t.eyebrow);
    document.querySelectorAll('[data-sec-advisor="title"]').forEach(e=>e.textContent=t.title);
    document.querySelectorAll('[data-sec-advisor="text"]').forEach(e=>e.textContent=t.text);
    document.querySelectorAll('[data-sec-advisor="button"]').forEach(e=>e.textContent=t.button);
    document.querySelectorAll('[data-sec-advisor="footer"]').forEach(e=>e.textContent=t.footer);
  }
  applyAdvisorHomeLanguage();
  new MutationObserver(applyAdvisorHomeLanguage).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();
