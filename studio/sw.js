/* Turing Studio: recibe fotos y videos compartidos desde la galería (Web Share Target).
   Android manda un POST multipart a ./share; se guardan en la caché y se abre la app con ?shared. */
const SHARE_CACHE = "turing-studio-shared";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "POST" || !url.pathname.endsWith("/share")) return;
  e.respondWith((async () => {
    const back = n => Response.redirect(new URL("./?shared=" + n, self.registration.scope).href, 303);
    try {
      const fd = await e.request.formData();
      const c = await caches.open(SHARE_CACHE);
      for (const k of await c.keys()) await c.delete(k);
      let i = 0;
      for (const f of fd.getAll("media")) {
        if (!(f instanceof File)) continue;
        await c.put(new Request(new URL("shared/" + i + "-" + Date.now(), self.registration.scope).href), new Response(f, { headers: {
          "content-type": f.type || "application/octet-stream", "x-name": encodeURIComponent(f.name), "x-modified": String(f.lastModified || Date.now()) } }));
        i++;
      }
      return back(i);
    } catch (err) { return back(0); }
  })());
});
