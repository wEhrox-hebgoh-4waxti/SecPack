const CACHE="secpack-v1";
const ASSETS=[
"/","/index.html","/style.css","/i18n.js","/form-config.js","/logo.jpg",
"/pages/products.html","/pages/store.html","/pages/advisor.html","/pages/contact.html",
"/pages/company.html","/pages/market.html","/pages/documents.html","/pages/privacy.html","/pages/terms.html",
"/assets/js/index.js","/assets/js/pages-store.js","/assets/js/advisor.js"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin||e.request.method!=="GET")return;
  if(u.pathname.startsWith("/api.secpackco.com"))return;
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
    if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return r;
  }).catch(()=>caches.match("/index.html"))));
});
