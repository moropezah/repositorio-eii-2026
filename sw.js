/* Service worker · Repositorio EII 2026 · versión 2026-10-09e */
const PREFIX='eii-completa-';
const CACHE=PREFIX+'2026-10-09e';
const FONTS='eii-fonts-v1';
const ASSETS=["./", "index.html", "guia-2026.html", "quiz/", "quiz/index.html", "decision/", "decision/index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "decision/icons/icon-192.png"];
const FONT_CSS=["https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap", "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap", "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.addAll(ASSETS);
    try{const fc=await caches.open(FONTS);
      for(const u of FONT_CSS){const r=await fetch(u,{mode:'cors'});if(!r.ok)continue;const css=await r.clone().text();await fc.put(u,r);
        const urls=[...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]);
        await Promise.all(urls.map(f=>fetch(f,{mode:'cors'}).then(x=>x.ok&&fc.put(f,x)).catch(()=>{})));}
    }catch(err){}
    self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(async c=>{const hit=await c.match(req);if(hit)return hit;try{const r=await fetch(req);if(r.ok||r.type==='opaque')c.put(req,r.clone());return r}catch(err){return new Response('',{status:504})}}));
    return;
  }
  if(url.origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    // Con conexión: siempre la versión más reciente (red primero, máximo 4 s). Sin conexión: copia guardada.
    const net=fetch(req,{cache:'no-cache'}).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>null);
    const timeout=new Promise(res=>setTimeout(()=>res(null),4000));
    const r=await Promise.race([net,timeout]);
    if(r)return r;
    const hit=await c.match(req,{ignoreSearch:true});
    if(hit){e.waitUntil(net);return hit}
    const late=await net;if(late)return late;
    if(req.mode==='navigate'){const fb=await c.match('./',{ignoreSearch:true});if(fb)return fb}
    return new Response('Sin conexión y sin copia guardada de este recurso.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  })());
});
