window.SEC_PACK_FORMS = Object.freeze({
  endpoint: ""
});

(function(){
  function tr(key){ return (window.secpackT || ((k)=>k))(key); }
  function setStatus(el,key,state){
    if(!el) return;
    el.textContent=tr(key);
    el.className="form-status "+(state||"");
    el.dataset.state=state||"";
  }
  async function submitPayload(payload,type,statusEl,button){
    const endpoint=window.SEC_PACK_FORMS && window.SEC_PACK_FORMS.endpoint;
    if(!endpoint){
      setStatus(statusEl,"dynamic.formNotConfigured","local");
      return {ok:false,configured:false};
    }
    if(button) button.disabled=true;
    setStatus(statusEl,"dynamic.formSending","sending");
    const body=new URLSearchParams();
    Object.entries(payload).forEach(([key,value])=>{
      if(value!==undefined && value!==null) body.append(key,String(value));
    });
    body.append("form_type",type);
    body.append("subject","SEC PACK — "+type);
    try{
      const response=await fetch(endpoint,{
        method:"POST",
        headers:{"Accept":"application/json","Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
        body
      });
      let result={};
      try{result=await response.json();}catch(_){}
      if(!response.ok) throw new Error("Form submission failed");
      setStatus(statusEl,"dynamic.formSent","success");
      return {ok:true,configured:true,result};
    }catch(error){
      setStatus(statusEl,"dynamic.formError","error");
      return {ok:false,configured:true,error};
    }finally{
      if(button) button.disabled=false;
    }
  }
  window.secpackSubmitPayload=submitPayload;
})();
