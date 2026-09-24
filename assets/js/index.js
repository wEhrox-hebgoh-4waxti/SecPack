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
