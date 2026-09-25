const ORIGINS=new Set(["https://secpackco.com","https://www.secpackco.com"]);
const MAX=12000;
const MODEL="gpt-5.6-terra";
const keyName="OPENAI_"+"API_KEY";
const prompt="You are the SEC PACK Professional Advisor for paper, board, printing, packaging, films, adhesives, converting and international B2B sourcing. Distinguish facts, assumptions and recommendations. Never invent specifications, certifications, prices or supplier claims. Protect confidential supplier identities, prices, routes, margins and internal records. Answer in the selected language and be concise and practical.";

function out(data,status=200,origin="https://secpackco.com"){const o=ORIGINS.has(origin)?origin:"https://secpackco.com";return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=UTF-8","Cache-Control":"no-store","Access-Control-Allow-Origin":o,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}})}
function clean(v,n){return typeof v==="string"?v.trim().slice(0,n):""}
export default{async fetch(req,env){
 const origin=req.headers.get("Origin");
 if(origin&&!ORIGINS.has(origin))return out({error:"Origin not allowed."},403,origin);
 if(req.method==="OPTIONS")return out({},204,origin);
 if(req.method!=="POST")return out({error:"Method not allowed."},405,origin);
 const path=new URL(req.url).pathname;
 if(path==="/forms"){
   if(!env.DB)return out({error:"Form storage is not configured."},503,origin);
   const raw=await req.text(); if(raw.length>MAX)return out({error:"Request too large."},413,origin);
   const p=new URLSearchParams(raw); if(p.get("_gotcha"))return out({ok:true},202,origin);
   const type=clean(p.get("form_type"),20); if(!["contact","visitor","order"].includes(type))return out({error:"Invalid form type."},400,origin);
   const id=crypto.randomUUID(), now=new Date().toISOString();
   await env.DB.prepare("CREATE TABLE IF NOT EXISTS inquiries (id TEXT PRIMARY KEY,form_type TEXT,name TEXT,company TEXT,email TEXT,phone TEXT,product TEXT,destination TEXT,payment TEXT,notes TEXT,message TEXT,items TEXT,created_at TEXT NOT NULL)").run();
   await env.DB.prepare("INSERT INTO inquiries (id,form_type,name,company,email,phone,product,destination,payment,notes,message,items,created_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13)").bind(id,type,clean(p.get("name"),120),clean(p.get("company"),160),clean(p.get("email"),254),clean(p.get("phone"),80),clean(p.get("product"),240),clean(p.get("destination"),160),clean(p.get("payment"),80),clean(p.get("notes"),2000),clean(p.get("message"),4000),clean(p.get("items"),4000),now).run();
   return out({ok:true,id,received_at:now},202,origin);
 }
 if(path!=="/"&&path!=="/advisor")return out({error:"Not found."},404,origin);
 if(!env[keyName])return out({error:"Advisor backend is not configured."},503,origin);
 const len=Number(req.headers.get("Content-Length")||0);if(len>MAX)return out({error:"Request too large."},413,origin);
 let b;try{b=await req.json()}catch(_){return out({error:"Invalid JSON."},400,origin)}
 const q=clean(b.question,6000);if(!q)return out({error:"Question is required."},400,origin);
 const input="Language: "+(["en","fa","ar"].includes(b.language)?b.language:"en")+"\nArea: "+clean(b.area,80)+"\nStyle: "+clean(b.depth,40)+"\n\nQuestion:\n"+q;
 const body={model:env.OPENAI_MODEL||MODEL,input:[{role:"system",content:[{type:"input_text",text:prompt}]},{role:"user",content:[{type:"input_text",text:input}]}],max_output_tokens:1800};
 if(b.useWeb===true)body.tools=[{type:"web_search"}];
 const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env[keyName],"Content-Type":"application/json"},body:JSON.stringify(body)});
 if(!r.ok)return out({error:"The advisor service is temporarily unavailable."},502,origin);
 const data=await r.json();return out({answer:typeof data.output_text==="string"?data.output_text.trim():""},200,origin);
}};
