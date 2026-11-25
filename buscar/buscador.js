/* Buscador del Repositorio EII 2026 · módulo independiente
   Indexa en vivo la portada (clase, consulta rápida, láminas, fuentes) y carga la guía
   (guia-2026.html) al primer uso. No requiere índice precompilado: si la guía o la
   portada cambian, el buscador se actualiza solo. Autor: Dr. Moisés Oropeza Hernández. */
(function () {
  "use strict";
  if (window.__buscadorEII) return; window.__buscadorEII = true;

  var GUIA = "guia-2026.html";
  var MODS = [
    ["todo", "Todo"], ["guia", "Guía"], ["perla", "Perlas"], ["clase", "Clase 2026"],
    ["rapida", "Consulta rápida"], ["lamina", "Láminas"], ["fuentes", "Fuentes"]
  ];
  var ETQ = {}; MODS.forEach(function (m) { ETQ[m[0]] = m[1]; });

  /* ---------- normalización con mapa de posiciones ---------- */
  function norm(str) {
    var out = "", map = [];
    for (var i = 0; i < str.length; i++) {
      var d = str[i].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
      for (var k = 0; k < d.length; k++) { out += d[k]; map.push(i); }
    }
    return { s: out, m: map };
  }
  function n(str) { return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function esc(t) { return t.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function limpio(t) { return (t || "").replace(/\s+/g, " ").trim(); }

  var ITEMS = [], guiaEstado = "pendiente";

  function agregar(it) {
    it.title = limpio(it.title); it.sub = limpio(it.sub || ""); it.text = limpio(it.text || "");
    if (!it.title && !it.text) return;
    it.nt = n(it.title); it.ns = n(it.sub); it.nx = norm(it.text);
    ITEMS.push(it);
  }

  /* ---------- índice de la portada (DOM en vivo) ---------- */
  function indexarPortada() {
    // Clase 2026: un ítem por subtítulo h4 dentro de cada sección h3.sub (c1..c6)
    var clase = document.getElementById("v-clase");
    if (clase) {
      var h3 = null, buf = [], h4 = null;
      var flush = function () {
        if (!h3) { buf = []; return; }
        var ancla = h3.id || "clase";
        agregar({ mod: "clase", title: h4 ? h4.textContent : h3.textContent, sub: h4 ? h3.textContent : "Módulo 02",
          text: buf.join(" "), hash: ancla, el: h4 || h3 });
        buf = [];
      };
      Array.prototype.forEach.call(clase.querySelectorAll("h3.sub, h4, p, li, td, caption, .box"), function (el) {
        if (el.closest(".laminas")) return;
        if (el.matches("h3.sub")) { flush(); h3 = el; h4 = null; return; }
        if (el.matches("h4.min")) { flush(); h4 = el; return; }
        if (el.matches(".box")) { buf.push(el.textContent); return; }
        if (el.closest(".box")) return;
        buf.push(el.textContent);
      });
      flush();
    }
    // Consulta rápida: un ítem por bloque desplegable
    Array.prototype.forEach.call(document.querySelectorAll("#v-rapida details.ac"), function (d) {
      var sm = d.querySelector("summary");
      agregar({ mod: "rapida", title: sm ? sm.textContent : "Consulta rápida", sub: "Módulo 04",
        text: d.textContent.replace(sm ? sm.textContent : "", ""), hash: "rapida", el: d });
    });
    // Láminas: se indexan desde el módulo atlas/ (ver cargarAtlas)
    // Fuentes
    var fu = document.getElementById("v-fuentes");
    if (fu) {
      var cab = null, b2 = [];
      var fl = function () { if (cab) agregar({ mod: "fuentes", title: cab.textContent, sub: "Fuentes, autoría y alcance", text: b2.join(" "), hash: "fuentes", el: cab }); b2 = []; };
      Array.prototype.forEach.call(fu.querySelectorAll("h3.sub, p, li, td"), function (el) {
        if (el.matches("h3.sub")) { fl(); cab = el; return; }
        if (cab) b2.push(el.textContent);
      });
      fl();
    }
  }

  /* ---------- índice de la guía (se carga al primer uso) ---------- */
  function fragmento(t) {
    var w = limpio(t).replace(/[«»“”"]/g, "").split(" ").slice(0, 6).join(" ");
    return encodeURIComponent(w).replace(/-/g, "%2D");
  }
  function cargarGuia(cb) {
    if (guiaEstado !== "pendiente") { cb && cb(); return; }
    guiaEstado = "cargando";
    fetch(GUIA).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var h2s = doc.querySelectorAll('h2[id^="s"]');
      Array.prototype.forEach.call(h2s, function (h2) {
        var sec = h2.id, num = sec.slice(1);
        if (num === "24" || num === "25") return; // flashcards y quiz se generan por script
        var tit = limpio(h2.textContent).replace(/^\d+\s*/, "");
        var cab = "§" + num + " · " + tit, sub = null, buf = [], el = h2.nextElementSibling;
        var flush = function () {
          if (!buf.length && !sub) return;
          agregar({ mod: "guia", title: sub ? sub : tit, sub: sub ? cab : "Guía de estudio · sección " + num,
            text: buf.join(" "), url: GUIA + "#" + sec + (sub ? ":~:text=" + fragmento(sub) : "") });
          buf = [];
        };
        while (el && !(el.tagName === "H2" && el.id && el.id[0] === "s")) {
          if (el.tagName === "H3" || el.tagName === "H4") { flush(); sub = el.textContent; }
          else if (el.classList && el.classList.contains("cierre")) {
            Array.prototype.forEach.call(el.querySelectorAll(".cz li"), function (li) {
              var c = li.cloneNode(true), et = c.querySelector(".et"), etq = et ? et.textContent : "";
              if (et) et.remove();
              var txt = limpio(c.textContent), err = !!li.closest(".errores");
              agregar({ mod: "perla", title: txt.length > 110 ? txt.slice(0, 108).replace(/\s\S*$/, "") + "…" : txt,
                sub: (err ? "Error frecuente" : "Perla" + (etq ? " · " + etq : "")) + " — §" + num + " " + tit,
                text: txt, url: GUIA + "#" + sec + ":~:text=" + fragmento(txt) });
            });
          }
          else if (!/^(SCRIPT|STYLE|TEMPLATE)$/.test(el.tagName) && !(el.classList && el.classList.contains("laminas"))) buf.push(el.textContent);
          el = el.nextElementSibling;
        }
        flush();
      });
      guiaEstado = "lista"; cb && cb();
    }).catch(function () { guiaEstado = "error"; cb && cb(); });
  }


  /* ---------- atlas (módulo propio, carga diferida) ---------- */
  var ATLAS = "atlas/index.html", atlasEstado = "pendiente";
  function cargarAtlas(cb) {
    if (atlasEstado !== "pendiente") { cb && cb(); return; }
    atlasEstado = "cargando";
    fetch(ATLAS).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      Array.prototype.forEach.call(doc.querySelectorAll("figure.lam-card"), function (f) {
        var h3 = f.querySelector("figcaption h3"), tit = h3 ? h3.textContent : "Lámina";
        var gr = f.closest(".grupo"), gh = gr ? gr.querySelector("h2") : null;
        var cuerpo = [];
        Array.prototype.forEach.call(f.querySelectorAll("svg text"), function (t) { cuerpo.push(t.textContent); });
        Array.prototype.forEach.call(f.querySelectorAll(".rec li"), function (li) { cuerpo.push(li.textContent); });
        agregar({ mod: "lamina", title: tit, sub: (gh ? gh.textContent : "Atlas") + " · lámina",
          text: cuerpo.join(" "), url: ATLAS + "#" + f.id });
      });
      atlasEstado = "lista"; cb && cb();
    }).catch(function () { atlasEstado = "error"; cb && cb(); });
  }

  /* ---------- búsqueda ---------- */
  function buscar(q, filtro) {
    var terms = n(q).split(/\s+/).filter(function (t) { return t.length > 1 || /\d/.test(t); });
    if (!terms.length) return [];
    var res = [];
    ITEMS.forEach(function (it) {
      if (filtro !== "todo" && it.mod !== filtro) return;
      var sc = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i], a = it.nt.indexOf(t), b = it.ns.indexOf(t), c = it.nx.s.indexOf(t);
        if (a < 0 && b < 0 && c < 0) return;
        sc += (a >= 0 ? 12 : 0) + (b >= 0 ? 4 : 0) + (c >= 0 ? 1 + Math.min(4, it.nx.s.split(t).length - 2) : 0);
      }
      var frase = n(q).trim();
      if (terms.length > 1 && (it.nt.indexOf(frase) >= 0 || it.nx.s.indexOf(frase) >= 0)) sc += 10;
      if (it.mod === "perla") sc += 1;
      res.push({ it: it, sc: sc, terms: terms });
    });
    res.sort(function (x, y) { return y.sc - x.sc; });
    return res;
  }
  function resaltar(txt, terms) {
    var nn = norm(txt), marks = [];
    terms.forEach(function (t) {
      var p = 0, i;
      while ((i = nn.s.indexOf(t, p)) >= 0) { marks.push([nn.m[i], nn.m[i + t.length - 1] + 1]); p = i + t.length; }
    });
    if (!marks.length) return esc(txt);
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var out = "", pos = 0;
    marks.forEach(function (mk) { if (mk[0] < pos) return; out += esc(txt.slice(pos, mk[0])) + "<mark>" + esc(txt.slice(mk[0], mk[1])) + "</mark>"; pos = mk[1]; });
    return out + esc(txt.slice(pos));
  }
  function extracto(it, terms) {
    var t = it.text; if (!t) return "";
    var best = -1;
    terms.forEach(function (tt) { var i = it.nx.s.indexOf(tt); if (i >= 0 && (best < 0 || i < best)) best = i; });
    if (best < 0) return resaltar(t.slice(0, 170), terms) + (t.length > 170 ? "…" : "");
    var o = it.nx.m[best], ini = Math.max(0, o - 70), fin = Math.min(t.length, o + 150);
    if (ini > 0) ini = t.indexOf(" ", ini) + 1;
    return (ini > 0 ? "…" : "") + resaltar(t.slice(ini, fin), terms) + (fin < t.length ? "…" : "");
  }

  /* ---------- navegación a un resultado ---------- */
  function destacar(el) {
    if (!el) return;
    el.classList.add("bq-flash");
    setTimeout(function () { el.classList.remove("bq-flash"); }, 1900);
  }
  function ir(it) {
    if (it.url) { window.open(it.url, "_blank", "noopener"); return; }
    var target = "#" + it.hash;
    var hacer = function () {
      if (it.el && it.el.tagName === "DETAILS") it.el.open = true;
      if (it.el) { it.el.scrollIntoView({ block: "start" }); window.scrollBy(0, -70); destacar(it.el); }
    };
    if (location.hash === target) hacer();
    else { location.hash = it.hash; setTimeout(hacer, 90); }
  }

  /* ---------- interfaz ---------- */
  var css = "" +
    ".bq{margin:22px 0 4px;max-width:760px;position:relative}" +
    ".bq-box{display:flex;align-items:center;gap:10px;background:var(--panel,#fff);border:1.5px solid var(--line-2,#ccc);border-radius:12px;padding:4px 8px 4px 14px;box-shadow:var(--sh,none);transition:border-color .15s}" +
    ".bq-box:focus-within{border-color:var(--marino-2,#255a8a)}" +
    ".bq-box svg{flex:none;color:var(--fg-3,#888)}" +
    ".bq-box input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--fg,#111);font:inherit;font-size:1rem;padding:10px 0}" +
    ".bq-kbd{flex:none;font-family:var(--ff-m,monospace);font-size:.72rem;color:var(--fg-3,#888);border:1px solid var(--line-2,#ccc);border-radius:5px;padding:1px 7px}" +
    ".bq-box input::-webkit-search-cancel-button{display:none;-webkit-appearance:none}" +
    ".bq-x{flex:none;background:none;border:0;color:var(--fg-3,#888);font-size:1.1rem;cursor:pointer;padding:4px 6px}" +
    ".bq-res{margin-top:10px;background:var(--panel,#fff);border:1px solid var(--line,#ddd);border-radius:12px;box-shadow:var(--sh-2,none);overflow:hidden}" +
    ".bq-chips{display:flex;gap:6px;flex-wrap:wrap;padding:10px 12px;border-bottom:1px solid var(--line,#ddd);background:var(--panel-2,#f4f4f4)}" +
    ".bq-chip{background:var(--panel,#fff);border:1px solid var(--line-2,#ccc);color:var(--fg-2,#444);border-radius:999px;padding:3px 10px;font:600 .74rem var(--ff-b,inherit);cursor:pointer}" +
    ".bq-chip b{font-weight:700;color:var(--fg-3,#888);margin-left:3px}" +
    ".bq-chip[aria-pressed=true]{background:var(--marino,#173a5e);border-color:var(--marino,#173a5e);color:var(--bg,#fff)}" +
    ".bq-chip[aria-pressed=true] b{color:inherit;opacity:.75}" +
    ".bq-chip:disabled{opacity:.4;cursor:default}" +
    ".bq-list{max-height:min(62vh,560px);overflow-y:auto;overscroll-behavior:contain}" +
    ".bq-it{display:block;width:100%;text-align:left;background:none;border:0;border-bottom:1px solid var(--line,#ddd);padding:11px 14px;cursor:pointer;font:inherit;color:inherit}" +
    ".bq-it:last-child{border-bottom:0}" +
    ".bq-it:hover,.bq-it.on{background:var(--panel-2,#f4f4f4)}" +
    ".bq-it .m{display:inline-block;font:700 .62rem var(--ff-b,inherit);letter-spacing:.08em;text-transform:uppercase;border-radius:4px;padding:1px 6px;margin-right:7px;vertical-align:1px;background:var(--panel-2,#eee);color:var(--fg-2,#444)}" +
    ".bq-it .m.guia{background:color-mix(in srgb,var(--marino,#173a5e) 15%,transparent);color:var(--marino,#173a5e)}" +
    ".bq-it .m.perla{background:color-mix(in srgb,var(--verde,#2f6b4f) 16%,transparent);color:var(--verde,#2f6b4f)}" +
    ".bq-it .m.clase{background:color-mix(in srgb,var(--acento,#b0561c) 15%,transparent);color:var(--acento,#b0561c)}" +
    ".bq-it .m.rapida{background:color-mix(in srgb,var(--ambar,#8a6414) 16%,transparent);color:var(--ambar,#8a6414)}" +
    ".bq-it .t{font-weight:650;color:var(--fg,#111);font-size:.93rem}" +
    ".bq-it .s{display:block;font-size:.74rem;color:var(--fg-3,#888);margin-top:2px}" +
    ".bq-it .x{display:block;font-size:.82rem;color:var(--fg-2,#444);margin-top:5px;line-height:1.5}" +
    ".bq-it .ext{font-size:.72rem;color:var(--fg-3,#888);margin-left:4px}" +
    ".bq-it mark{background:color-mix(in srgb,var(--ambar,#d9b25c) 30%,transparent);color:inherit;border-radius:2px;padding:0 1px}" +
    ".bq-vacio{padding:16px 14px;color:var(--fg-3,#888);font-size:.88rem}" +
    ".bq-pie{padding:7px 14px;font-size:.7rem;color:var(--fg-3,#888);border-top:1px solid var(--line,#ddd);background:var(--panel-2,#f4f4f4)}" +
    ".bq-top{background:none;border:1px solid var(--line-2,#ccc);color:var(--fg-2,#444);border-radius:7px;height:30px;padding:0 10px;cursor:pointer;font:600 .78rem var(--ff-b,inherit);display:flex;align-items:center;gap:6px;flex:none}" +
    ".bq-top:hover{border-color:var(--marino,#173a5e);color:var(--marino,#173a5e)}" +
    "@media(max-width:700px){.bq-top span{display:none}.bq-kbd{display:none}}" +
    ".bq-flash{animation:bqf 1.9s ease}" +
    "@keyframes bqf{0%,40%{box-shadow:0 0 0 3px color-mix(in srgb,var(--ambar,#d9b25c) 70%,transparent)}100%{box-shadow:0 0 0 3px transparent}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var LUPA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var wrap = document.createElement("div");
  wrap.className = "bq"; wrap.setAttribute("role", "search");
  wrap.innerHTML =
    '<div class="bq-box">' + LUPA +
    '<input id="bq-in" type="search" autocomplete="off" spellcheck="false" placeholder="Buscar en guía, perlas, clase, consulta rápida y láminas…" aria-label="Buscar en el repositorio">' +
    '<button class="bq-x" type="button" aria-label="Limpiar" hidden>✕</button><span class="bq-kbd">/</span></div>' +
    '<div class="bq-res" hidden><div class="bq-chips"></div><div class="bq-list" role="listbox"></div><div class="bq-pie"></div></div>';

  // ubicación: en el hero de la portada, antes de los chips de metadatos
  var hero = document.querySelector("#v-inicio .hero");
  if (!hero) return;
  var meta = hero.querySelector(".meta");
  hero.insertBefore(wrap, meta || null);

  // botón en la barra superior
  var tema = document.getElementById("tema");
  if (tema && tema.parentNode) {
    var bt = document.createElement("button");
    bt.className = "bq-top"; bt.type = "button"; bt.title = "Buscar (/)";
    bt.innerHTML = LUPA.replace('width="18" height="18"', 'width="14" height="14"') + "<span>Buscar</span>";
    tema.parentNode.insertBefore(bt, tema);
    bt.addEventListener("click", enfocar);
  }

  var inp = wrap.querySelector("input"), res = wrap.querySelector(".bq-res"),
      chips = wrap.querySelector(".bq-chips"), list = wrap.querySelector(".bq-list"),
      pie = wrap.querySelector(".bq-pie"), bx = wrap.querySelector(".bq-x");
  var filtro = "todo", sel = -1, actuales = [];

  function enfocar() {
    if (location.hash && location.hash !== "#inicio") location.hash = "inicio";
    setTimeout(function () { inp.focus(); inp.select(); window.scrollTo({ top: 0 }); }, 60);
  }

  function pintar() {
    var q = inp.value.trim();
    bx.hidden = !q;
    if (q.length < 2) { res.hidden = true; return; }
    if (guiaEstado === "pendiente") cargarGuia(pintar);
    if (atlasEstado === "pendiente") cargarAtlas(pintar);
    var todos = buscar(q, "todo");
    var cuenta = { todo: todos.length };
    todos.forEach(function (r) { cuenta[r.it.mod] = (cuenta[r.it.mod] || 0) + 1; });
    if (filtro !== "todo" && !cuenta[filtro]) filtro = "todo";
    chips.innerHTML = MODS.map(function (m) {
      var c = cuenta[m[0]] || 0;
      return '<button type="button" class="bq-chip" data-f="' + m[0] + '" aria-pressed="' + (filtro === m[0]) + '"' + (c ? "" : " disabled") + ">" + m[1] + "<b>" + c + "</b></button>";
    }).join("");
    actuales = filtro === "todo" ? todos : todos.filter(function (r) { return r.it.mod === filtro; });
    var mostrar = actuales.slice(0, 60);
    if (!mostrar.length) {
      list.innerHTML = '<div class="bq-vacio">' + (guiaEstado === "cargando" ? "Cargando la guía…" : "Sin resultados para «" + esc(q) + "». Prueba con un término más corto o sin tildes.") + "</div>";
    } else {
      list.innerHTML = mostrar.map(function (r, i) {
        var it = r.it;
        return '<button type="button" class="bq-it" role="option" data-i="' + i + '">' +
          '<span class="m ' + it.mod + '">' + ETQ[it.mod] + "</span>" +
          '<span class="t">' + resaltar(it.title, r.terms) + "</span>" + (it.url ? '<span class="ext">↗</span>' : "") +
          (it.sub ? '<span class="s">' + esc(it.sub) + "</span>" : "") +
          (it.mod !== "perla" && it.text ? '<span class="x">' + extracto(it, r.terms) + "</span>" : "") + "</button>";
      }).join("");
    }
    sel = -1;
    var notas = [];
    if (guiaEstado === "cargando") notas.push("Indexando la guía…");
    if (guiaEstado === "error") notas.push("La guía no se pudo indexar en este contexto (ábrela desde el sitio publicado)");
    notas.push((actuales.length > 60 ? "60 de " + actuales.length : actuales.length) + " resultado" + (actuales.length === 1 ? "" : "s") + " · ↑↓ para moverse, Enter para abrir, Esc para cerrar");
    pie.textContent = notas.join(" · ");
    res.hidden = false;
  }
  function mover(d) {
    var its = list.querySelectorAll(".bq-it"); if (!its.length) return;
    if (sel >= 0 && its[sel]) its[sel].classList.remove("on");
    sel = Math.max(0, Math.min(its.length - 1, sel + d));
    its[sel].classList.add("on"); its[sel].scrollIntoView({ block: "nearest" });
  }

  var tmr;
  inp.addEventListener("input", function () { clearTimeout(tmr); tmr = setTimeout(pintar, 110); });
  inp.addEventListener("focus", function () { if (guiaEstado === "pendiente") cargarGuia(function () { if (inp.value.trim().length > 1) pintar(); });
    if (atlasEstado === "pendiente") cargarAtlas(function () { if (inp.value.trim().length > 1) pintar(); }); });
  inp.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); mover(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); mover(-1); }
    else if (e.key === "Enter") { e.preventDefault(); var r = actuales[sel >= 0 ? sel : 0]; if (r) ir(r.it); }
    else if (e.key === "Escape") { if (inp.value) { inp.value = ""; pintar(); } else inp.blur(); }
  });
  bx.addEventListener("click", function () { inp.value = ""; pintar(); inp.focus(); });
  chips.addEventListener("click", function (e) { var b = e.target.closest(".bq-chip"); if (!b || b.disabled) return; filtro = b.getAttribute("data-f"); pintar(); inp.focus(); });
  list.addEventListener("click", function (e) { var b = e.target.closest(".bq-it"); if (!b) return; var r = actuales[+b.getAttribute("data-i")]; if (r) ir(r.it); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    var a = document.activeElement, tag = a && a.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || (a && a.isContentEditable)) return;
    e.preventDefault(); enfocar();
  });

  indexarPortada();
})();
