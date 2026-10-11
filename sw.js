const CACHE="timetable-v4";
const FILES=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Network first: always try the newest files, fall back to the saved copy when offline.
self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET")return;
  const same=new URL(req.url).origin===location.origin;
  e.respondWith(
    fetch(same?new Request(req,{cache:"no-cache"}):req).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});
      return r;
    }).catch(()=>caches.match(req).then(hit=>hit||caches.match("./index.html")))
  );
});
