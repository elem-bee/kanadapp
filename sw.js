/* global ["./", "index.html", "roadbook.html", "admin.html", "style.css", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"], ["https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js", "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js", "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"], ["https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"] */
/* Service worker Otrip — généré par build.py (les marqueurs __…__ sont remplacés à la compilation).
   - la coque de l'application (pages, styles, icônes, bibliothèques épinglées) est mise en cache, par version ;
   - les appels à Supabase ne passent JAMAIS par ce cache : les données sont gérées par le pont de stockage (copie locale + écriture refusée hors ligne) ;
   - une nouvelle version s'installe en arrière-plan et n'est activée que sur demande de l'utilisateur (« Nouvelle version disponible »). */
const VERSION="5673233c1c4f";
const SHELL_CACHE="otrip-shell-"+VERSION;
const RUNTIME_CACHE="otrip-runtime";
const SHELL=["./", "index.html", "roadbook.html", "admin.html", "style.css", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"];
const LIBS=["https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js", "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js", "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"];           // indispensables : sans elles l'installation échoue et sera retentée
const OPTIONAL=["https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js", "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"];   // cartes et PDF : utiles, mais leur absence ne doit pas empêcher l'installation

self.addEventListener("install",(e)=>{
  e.waitUntil((async()=>{
    const c=await caches.open(SHELL_CACHE);
    await c.addAll(SHELL.map((u)=>new Request(u,{cache:"reload"})));
    await Promise.all(LIBS.map(async(u)=>{
      const r=await fetch(u,{mode:"cors",cache:"reload"});
      if(!r.ok)throw new Error("bibliothèque indisponible : "+u);
      await c.put(u,r);
    }));
    await Promise.all(OPTIONAL.map(async(u)=>{try{const r=await fetch(u,{mode:"cors",cache:"reload"});if(r.ok)await c.put(u,r);}catch(_){}}));
  })());
});

self.addEventListener("activate",(e)=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter((k)=>k.startsWith("otrip-shell-")&&k!==SHELL_CACHE).map((k)=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message",(e)=>{if(e.data&&e.data.type==="SKIP_WAITING")self.skipWaiting();});

const ALL_LIBS=new Set(LIBS.concat(OPTIONAL));

self.addEventListener("fetch",(e)=>{
  const req=e.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(/(^|\.)supabase\.(co|in)$/.test(url.hostname))return;            // données : jamais ici
  if(url.origin===self.location.origin){e.respondWith(fromShell(req));return;}
  if(ALL_LIBS.has(req.url)){e.respondWith(libFirst(req));return;}
  if(/(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)){e.respondWith(staleWhileRevalidate(req));return;}
  // fonds de carte, recherche de lieux, Google Maps, Drive… : réseau seul
});

async function fromShell(req){
  const c=await caches.open(SHELL_CACHE);
  const hit=await c.match(req,{ignoreSearch:true});     // roadbook.html?trip=… retrouve roadbook.html
  if(hit)return hit;
  try{return await fetch(req);}
  catch(_){
    if(req.mode==="navigate"){const home=(await c.match("index.html"))||(await c.match("./"));if(home)return home;}
    return Response.error();
  }
}
async function libFirst(req){
  const c=await caches.open(SHELL_CACHE);
  const hit=await c.match(req.url);
  if(hit)return hit;
  const r=await fetch(req);
  if(r&&r.ok){try{(await caches.open(RUNTIME_CACHE)).put(req.url,r.clone());}catch(_){}}
  return r;
}
async function staleWhileRevalidate(req){
  const c=await caches.open(RUNTIME_CACHE);
  const hit=await c.match(req);
  const net=fetch(req).then((r)=>{if(r&&(r.ok||r.type==="opaque"))c.put(req,r.clone());return r;}).catch(()=>null);
  return hit||(await net)||Response.error();
}
