const CACHE_NAME="secpack-shell-v1";
const CORE=[
  "/","/index.html","/site.webmanifest","/service-worker.js","/style.css","/i18n.js","/form-config.js","/assets/js/index.js","/logo.jpg",
  "/pages/products.html","/pages/store.html","/pages/company.html","/pages/contact.html","/pages/advisor.html",
  "/pages/a4-copy-paper.html","/pages/lamination-films.html","/pages/water-based-adhesives.html",
  "/pages/packaging-materials.html","/pages/manufacturers.html","/pages/market.html","/pages/documents.html",
  "/pages/privacy.html","/pages/terms.html","/pages/404.html","/pages/admin.html","/assets/js/admin.js","/assets/js/accounting.js","/assets/css/admin.css"
];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(fetch(request).then(response=>{
    if(response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(request,response.clone()));
    return response;
  }).catch(()=>caches.match(request).then(cached=>cached||caches.match("/index.html"))));
});