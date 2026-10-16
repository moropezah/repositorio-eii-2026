/* ============ INTERFAZ ============ */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const F=$("#f");
let onlyChile=false, lastR=null, lastC=null;

const OPT=["b2","b2l","b3","preg","tpmt","asuc","ipaa"];
const DEF={ipaa:"no",dz:"ec",ext:"E3",sev:"moderada",asuc:"ingreso",loc:"L1",beh:"B1",b2:"inflamatoria",b2l:"corta",b3:"fistula",pa:"no",act:"moderada",hist:"naive",tnff:"primaria",sex:"M",preg:"no",tpmt:"nd"};
const PRESETS=[
 {k:"ec70",l:"EC ileal leve · 70 años",v:{dz:"ec",loc:"L1",beh:"B1",pa:"no",act:"leve",hist:"naive",age:70,wt:72,sex:"M",preg:"no",co:["hta"],eim:[],ecr:[],tpmt:"nd"}},
 {k:"cu32",l:"CU E3 corticodependiente · 32 años",v:{dz:"cu",ext:"E3",sev:"moderada",hist:"corticodep",age:32,wt:61,sex:"F",preg:"deseo",cur:["joven"],co:[],eim:["art1"],tpmt:"normal"}},
 {k:"asuc",l:"Colitis aguda grave · día 3",v:{dz:"cu",ext:"E3",sev:"asuc",asuc:"d3noresp",hist:"naive",age:44,wt:58,sex:"F",preg:"no",cur:["pcr","mayo3"],co:[],eim:[],tpmt:"nd"}},
 {k:"peri",l:"EC perianal compleja · 26 años",v:{dz:"ec",loc:"L3",beh:"B1",pa:"compleja",act:"moderada",hist:"naive",age:26,wt:64,sex:"M",preg:"no",ecr:["joven"],co:[],eim:[],tpmt:"normal"}},
 {k:"cu68",l:"CU post anti-TNF · 68 años, riesgo CV",v:{dz:"cu",ext:"E2",sev:"grave",hist:"tnf",tnff:"primaria",age:68,wt:80,sex:"M",preg:"no",cur:[],co:["tabaco","hta","dlp"],eim:[],tpmt:"nd"}},
 {k:"b2",l:"EC estenosante mixta",v:{dz:"ec",loc:"L1",beh:"B2",b2:"mixta",b2l:"corta",pa:"no",act:"moderada",hist:"naive",age:38,wt:66,sex:"F",preg:"no",ecr:["ulceras"],co:[],eim:["axial"],tpmt:"nd"}},
 {k:"pouch",l:"Reservorio · pouchitis refractaria",v:{dz:"cu",ipaa:"si",pch:"carp",age:41,wt:68,sex:"M",preg:"no",cur:[],co:[],eim:[],tpmt:"nd"}},
 {k:"emb",l:"CU en embarazo",v:{dz:"cu",ext:"E2",sev:"moderada",hist:"falla5asa",age:30,wt:64,sex:"F",preg:"embarazo",cur:[],co:[],eim:[],tpmt:"nd"}}
];

function readForm(){
  const fd=new FormData(F), g=n=>fd.get(n)||(OPT.includes(n)?DEF[n]:null);
  const c={ipaa:g("ipaa"),pch:g("pch"),dz:g("dz"),ext:g("ext"),sev:g("sev"),asuc:g("asuc"),loc:g("loc"),l4:!!fd.get("l4"),beh:g("beh"),b2:g("b2"),b2l:g("b2l"),b3:g("b3"),pa:g("pa"),act:g("act"),postop:!!fd.get("postop"),hist:g("hist"),tnff:g("tnff"),sex:g("sex"),preg:g("preg"),tpmt:g("tpmt"),
    age:parseInt(fd.get("age"))||0,wt:parseFloat(fd.get("wt"))||0,cur:fd.getAll("cur"),ecr:fd.getAll("ecr"),co:fd.getAll("co"),eim:fd.getAll("eim")};
  c.asucSet=!!fd.get("asuc");
  const SER={vhb:{pos:"hbsag",res:"antihbc",neg:"vhbNoInm"},tbc:{lat:"tbcl",act:"tbcAct"},vhc:{pos:"vhc"},vih:{pos:"vih"},vzv:{neg:"vzvneg"},ebv:{neg:"ebvneg"}};
  const SERN={vhb:"VHB",tbc:"TBC",vhc:"VHC",vih:"VIH",vzv:"VVZ",ebv:"VEB"};
  c.pend=[];Object.keys(SER).forEach(k=>{const v=fd.get("s_"+k)||"nd";if(v==="nd")c.pend.push(SERN[k]);else if(SER[k][v])c.co.push(SER[k][v])});if(c.sex!=="F")c.preg="no";
  if(!["tnf","multi"].includes(c.hist))c.tnff=null;
  return c;
}
function setForm(v){
  F.reset();
  const o=Object.assign({},DEF,v);
  ["ipaa","pch","dz","ext","sev","asuc","loc","beh","b2","b2l","b3","pa","act","hist","tnff","sex","preg","tpmt"].forEach(n=>{const el=F.querySelector(`input[name="${n}"][value="${o[n]}"]`);if(el)el.checked=true});
  $("#age").value=o.age||"";$("#wt").value=o.wt||"";
  ["cur","ecr","co","eim"].forEach(n=>(o[n]||[]).forEach(val=>{const el=F.querySelector(`input[name="${n}"][value="${val}"]`);if(el)el.checked=true}));
  if(o.l4)$("#l4").checked=true; if(o.postop)$("#postop").checked=true;
}
function progress(c){
  const s1=!!c.dz, s2=s1&&c.age>=16&&!!c.sex;
  const pouch=c.dz==="cu"&&c.ipaa==="si";
  const ph=pouch?!!c.pch:c.dz==="cu"?["ext","sev"].every(k=>c[k])&&(c.sev!=="asuc"||!!c.asucSet):["loc","beh","pa","act"].every(k=>c[k]);
  const s3=s2&&ph, s4=s3&&(pouch||!!c.hist&&(!["tnf","multi"].includes(c.hist)||!!c.tnff));
  return {s1,s2,s3,s4,pouch};
}
function vis(c){
  const p=progress(c);
  $("#blk-pac").hidden=!p.s1;
  $("#blk-cu").hidden=!(p.s2&&c.dz==="cu");$("#blk-ec").hidden=!(p.s2&&c.dz==="ec");
  $("#blk-lin").hidden=!p.s3||p.pouch;$("#blk-co").hidden=!p.s4;$("#blk-mei").hidden=!p.s4;
  const nx=!p.s1?"":!p.s2?"Ingresa edad y sexo para continuar.":!p.s3?(p.pouch?"Elige el trastorno del reservorio.":"Completa el fenotipo para continuar."):!p.s4?"Indica la línea terapéutica para ver la recomendación.":"";
  $("#nexthint").textContent=nx;
  $$("[data-cnt]").forEach(el=>{const g=el.dataset.cnt;if(g==="ser"){const n=document.querySelectorAll('#g-ser input[type=radio]:checked:not([value="nd"])').length;el.textContent=n?`${n}/6 registradas`:"";return}const n=document.querySelectorAll(`#g-${g} input[type=checkbox]:checked`).length;el.textContent=n?n+" marcado"+(n>1?"s":""):""});
  ["q-ext","q-sev","q-cur"].forEach(i=>$("#"+i).hidden=p.pouch);$("#q-pch").hidden=!p.pouch;
  $("#q-asuc").hidden=c.sev!=="asuc"||p.pouch;$("#q-b2").hidden=c.beh!=="B2";$("#q-b3").hidden=c.beh!=="B3";
  $("#q-tnf").hidden=!["tnf","multi"].includes(c.hist);$("#q-preg").hidden=c.sex!=="F";
}

/* ---------- helpers de presentación ---------- */
function badge(id){const d=D[id];const b=CHILE[d.chile];return `<span class="badge ${b[1]}" title="${esc(d.chileTx||b[2])}">${b[0]}</span>`}
function wk(w){return w<1?`día ${Math.max(1,Math.round(w*7))}`:`sem ${w}`}
function kinBar(k,max){
  if(!k)return"";max=max||24;const P=w=>Math.min(100,w/max*100);
  let h=`<div class="kin" role="img" aria-label="Inicio ${wk(k.on[0])}–${wk(k.on[1])}; fin de inducción ${wk(k.ev)}${k.ext?"; extendida "+wk(k.ext):""}"><div class="trk"></div>`;
  h+=`<div class="on" style="left:${P(k.on[0])}%;width:${Math.max(1.2,P(k.on[1])-P(k.on[0]))}%"></div>`;
  h+=`<div class="ev" style="left:${P(k.ev)}%"></div><span class="lb" style="left:${Math.max(6,Math.min(92,P(k.ev)))}%">${wk(k.ev)}</span>`;
  if(k.ext&&k.ext<=max){let lx=Math.max(8,Math.min(94,P(k.ext)));const le=Math.max(6,Math.min(92,P(k.ev)));if(Math.abs(lx-le)<11)lx=Math.min(96,le+11);h+=`<div class="ex" style="left:${P(k.ext)}%"></div><span class="lb x" style="left:${lx}%">${wk(k.ext)}</span>`}
  for(let t=0;t<=max;t+=4)h+=`<span class="tk" style="left:${Math.max(2,Math.min(98,P(t)))}%">${t}</span>`;
  return h+"</div>";
}
function doseLine(it,dz){
  if(it.dose)return it.dose;const d=D[it.id][dz];if(!d)return"";
  if(/Mantención|Prevención/.test(it.ph)&&!/Inducción/.test(it.ph))return /Prevención/.test(it.ph)&&d.ind&&!/^No|^Tras/.test(d.ind)?`${d.ind} → ${d.mant}`:d.mant;
  if(it.ph==="Inducción y mantención"||it.ph==="Luminal y perianal")return `${d.ind} → ${d.mant}`;
  return d.ind;
}

/* ---------- render del resultado ---------- */
function render(){
  const c=readForm();vis(c);lastC=c;
  const P=progress(c);
  if(!P.s4){
    const st=[["¿De qué se trata?",P.s1],["Edad y sexo",P.s2],["Fenotipo y actividad",P.s3],["Línea terapéutica",P.s4]];
    const now=st.findIndex(x=>!x[1]);
    $("#res").innerHTML=`<div class="empty"><p class="eyebrow">Recomendación</p><h3>${P.s1?"Sigue completando el caso":"Empieza eligiendo la enfermedad"}</h3><p>La recomendación aparece al completar los cuatro pasos. Comorbilidades y manifestaciones extraintestinales se agregan después y ajustan el resultado.</p><ol class="prog">${st.map((x,i)=>`<li class="${x[1]?"ok":i===now?"now":""}"><i>${x[1]?"✓":i+1}</i>${x[0]}</li>`).join("")}</ol><p class="note" style="margin-top:14px">También puedes cargar un caso tipo desde el selector de arriba.</p></div>`;
    lastR=null;return;
  }
  const R=evaluate(c);lastR=R;
  let h=`<div class="casehead"><div class="k">Caso</div><h3>${esc(R.title)}</h3><div class="tags">${R.tags.map(([k,t])=>`<span class="tag ${k}">${esc(t)}</span>`).join("")}</div>
   <div class="acts"><button class="btn pri" type="button" id="copy">Copiar resumen para la ficha</button><label class="toggle"><input type="checkbox" id="onlycl" ${onlyChile?"checked":""}> Solo disponibles en Chile</label></div></div>`;
  const prefs=R.items.filter(i=>i.tier==="pref"&&(!onlyChile||D[i.id].chile!=="no"));
  if(prefs.length){
    const main=prefs.filter(i=>!/Puente/.test(i.ph)).slice(0,4), bridge=prefs.filter(i=>/Puente/.test(i.ph));
    h+=`<div class="reco"><div class="k"><i>✓</i>Recomendación principal</div><ul>${main.concat(bridge).map(i=>`<li><b>${esc(D[i.id].n)}<em>${esc(i.ph)}</em></b><span>${esc(doseLine(i,c.dz))}</span></li>`).join("")}</ul>${prefs.length>main.length+bridge.length?`<p class="note" style="margin-top:8px">+${prefs.length-main.length-bridge.length} opción(es) preferente(s) más abajo, con igual nivel de evidencia.</p>`:""}<p class="note" style="margin-top:6px">Orden dentro de cada nivel: ${esc(R.order||"")}.</p></div>`;
  }
  const bold=t=>t.replace(/^([^:<]{3,70}):/,"<b>$1:</b>");
  if(R.alerts.length)h+=`<div class="alerts">${R.alerts.map(a=>`<div class="al ${a.lvl}"><b class="ic">${a.lvl==="r"?"ALTO":a.lvl==="a"?"OJO":"NOTA"}</b><span>${bold(a.t)}</span></div>`).join("")}</div>`;
  if(R.steps.length)h+=`<div class="box"><h4>Plan inmediato</h4><ol class="steps">${R.steps.map(s=>`<li>${s}</li>`).join("")}</ol></div>`;
  let hidden=0;
  TIERS.forEach(t=>{
    let its=R.items.filter(i=>i.tier===t);
    if(onlyChile){const n=its.length;its=its.filter(i=>D[i.id].chile!=="no");hidden+=n-its.length}
    if(!its.length)return;
    if(t==="baja")h+=`<details class="more baja"><summary>${TIERTX[t][0]} <small>${TIERTX[t][1]} · ${its.length}</small></summary>`;
    h+=`<div class="tier ${t}"><header><h4>${TIERTX[t][0]}</h4><small>${TIERTX[t][1]}</small><span class="n">${its.length}</span></header>`;
    its.forEach(it=>{
      const d=D[it.id],k=(d.kin||{})[c.dz],dl=doseLine(it,c.dz);
      const whys=it.why.filter((w,i,a)=>a.findIndex(x=>x.t===w.t)===i);
      const evk=t!=="evit"?"":whys.some(w=>w.ci)?["ci","Contraindicado"]:whys.some(w=>w.c==="x")?["rb","Riesgo mayor que el beneficio"]:["sb","Sin beneficio en este escenario"];
      h+=`<div class="drow"><div class="nm"><b>${esc(d.n)}</b>${evk?`<span class="evk ${evk[0]}">${evk[1]}</span>`:""}<span class="ph">${esc(it.ph)}</span><span class="cls">${CLS[d.cl]}</span>${badge(it.id)}</div>
      <button class="btn go" type="button" data-ficha="${it.id}" data-ph="${esc(it.ph)}">Ficha</button>
      ${dl?`<div class="dose">${esc(dl)}${d.kinTx?` <em>· inicio: ${esc(d.kinTx.charAt(0).toLowerCase()+d.kinTx.slice(1))}</em>`:""}</div>`:""}
      <ul class="why">${whys.map(w=>`<li class="${w.c}">${w.ci?"<b>Contraindicado:</b> ":""}${esc(w.t)}</li>`).join("")}</ul>
      ${k&&t!=="evit"?`<div class="mini">${kinBar(k,Math.max(16,(k.ext||k.ev)+2))}</div>`:""}</div>`;
    });
    h+="</div>";if(t==="baja")h+="</details>";
  });
  if(hidden)h+=`<p class="note">${hidden} opción(es) sin registro en Chile ocultas. Desmarca el filtro para verlas.</p>`;
  if(R.items.some(i=>D[i.id].kin&&D[i.id].kin[c.dz]))h+=`<div class="kinleg"><span><i style="background:color-mix(in srgb,var(--verde) 70%,transparent)"></i>Inicio de acción</span><span><i style="background:var(--marino);width:3px"></i>Fin de inducción</span><span><i style="background:var(--acento);width:3px"></i>Inducción extendida</span></div>`;

  if(R.combo){
    const w=[];
    w.push("TPMT y NUDT15 antes de iniciar; hemograma y perfil hepático en semanas 2, 4, 8 y 12, luego c/3 meses.");
    w.push("Dosis: azatioprina 2–2,5 mg/kg (SONIC); 1–1,5 mg/kg puede bastar para reducir inmunogenicidad. Alternativa: metotrexato 12,5–15 mg/semana.");
    w.push("Transaminasas en alza: medir 6-TGN/6-MMP; perfil hepatotóxico → azatioprina 25–33 % + alopurinol 100 mg.");
    w.push("Hombre <35 años o VEB negativo: riesgo de linfoma hepatoesplénico T y linfoproliferación; valorar metotrexato o monoterapia con TDM.");
    w.push("Tras ≥6 meses de remisión libre de corticoides: retirar el inmunomodulador y mantener el anti-TNF (AGA R13–R14).");
    h+=`<div class="box"><h4>Terapia combinada</h4><p style="margin:0 0 8px;font-size:.88rem;color:var(--fg-2)"><b style="color:var(--fg)">Infliximab + tiopurina</b> ${c.dz==="cu"?"(UC SUCCESS: remisión libre de corticoides 40 % vs 22 % con infliximab solo)":"(SONIC: remisión libre de corticoides 57 % vs 44 % con infliximab solo)"}. Reduce anticuerpos antifármaco y aumenta niveles.</p>
    ${R.comboWarn?`<div class="al a" style="margin-bottom:8px"><b class="ic">OJO</b><span>Este paciente tiene factores que desaconsejan la tiopurina (edad, neoplasia, VEB negativo, TPMT o fragilidad): preferir infliximab en monoterapia con TDM proactivo o metotrexato.</span></div>`:""}
    <ul class="why">${w.map(x=>`<li class="n">${x}</li>`).join("")}</ul>
    ${c.hist==="multi"?`<p class="note" style="margin-top:8px">Terapia avanzada combinada (dos biológicos o biológico + JAK): series observacionales en refractariedad o MEI no controlada; ECCO 2026 no la recomienda fuera de centro experto (PP9).</p>`:""}</div>`;
  }else if(c.hist==="multi"){
    h+=`<div class="box"><h4>Terapia combinada avanzada</h4><p style="font-size:.86rem;color:var(--fg-2);margin:0">Dos terapias avanzadas (p. ej. vedolizumab + anti-TNF o anti-IL-23 + JAK) solo en refractariedad multimecanismo o MEI no controlada, en centro experto. Evidencia observacional; VEGA y DUET en fase 2. ECCO 2026 PP9: insuficiente para recomendarla de rutina.</p></div>`;
  }
  if(R.fail.length)h+=`<div class="box"><h4>Si falla</h4><ul class="why">${R.fail.map(x=>`<li class="n">${esc(x)}</li>`).join("")}</ul></div>`;

  const top=R.items.filter(i=>i.tier==="pref"&&D[i.id].kin&&D[i.id].kin[c.dz]);
  if(top.length){
    h+=`<div class="box"><h4>Cuándo reevaluar</h4><div class="tw" style="margin:0"><table class="t" style="min-width:480px"><thead><tr><th>Fármaco</th><th>Inicio</th><th>Fin de inducción</th><th>Niveles</th></tr></thead><tbody>${top.map(i=>{const d=D[i.id],k=d.kin[c.dz];return `<tr><td class="nm">${esc(d.n)}</td><td>${esc(d.kinTx||"")}</td><td>${wk(k.ev)}${k.ext?` · extendida ${wk(k.ext)}`:""}</td><td>${esc(d.tdm.split(".")[0])}</td></tr>`}).join("")}</tbody></table></div>
    <p class="note" style="margin-top:8px">Objetivos STRIDE-II: respuesta clínica a corto plazo; calprotectina y PCR normales a los 3–6 meses; cicatrización endoscópica a los 6–12 meses.</p></div>`;
  }
  const gl=relGuides(R,c);
  if(gl.length){h+=`<details class="more gd"><summary>Dónde discrepan las guías <small>${gl.length} tema(s) · ${esc(gl.map(g=>GDRUG[g]).join(", "))}</small></summary><div class="box">${gl.map(g=>gTable(g)).join("")}</div></details>`}
  if(c.hist==="multi")h+=`<p class="note">Refractario a ≥2 mecanismos: considerar ensayo clínico. Las moléculas en fase 2–3 están en la pestaña <a href="#pipeline">En investigación</a>.</p>`;
  $("#res").innerHTML=h;
}
/* discrepancias: solo si el fármaco en conflicto aparece entre las sugerencias visibles */
const GDRUG={jak:"JAK",combo:"infliximab + tiopurina",asuc:"rescate en colitis aguda grave",vdzec:"vedolizumab en EC",tbc:"tamizaje de TBC",tiop:"tiopurina ≥65 años"};
const GREL={
 jak:(v,c,R)=>v.some(i=>D[i.id].cl==="jak"),
 combo:(v,c,R)=>!!R.combo&&v.some(i=>i.id==="ifx"),
 asuc:(v,c,R)=>v.some(i=>i.ph==="Rescate"),
 vdzec:(v,c,R)=>c.dz==="ec"&&v.some(i=>i.id==="vdz"),
 tbc:(v,c,R)=>v.some(i=>["int","p40","p19","s1p"].includes(D[i.id].cl)),
 tiop:(v,c,R)=>c.age>=65&&v.some(i=>i.id==="aza"||i.id==="mp")
};
function relGuides(R,c){
  const v=R.items.filter(i=>["pref","alt","prec"].includes(i.tier)&&(!onlyChile||D[i.id].chile!=="no"));
  return Object.keys(GREL).filter(g=>GREL[g](v,c,R));
}
function fichaGuides(id,c){
  const d=D[id],k=d.cl,out=[];
  if(k==="jak")out.push("jak");
  if(id==="ifx"||id==="aza"||id==="mp")out.push("combo");
  if((id==="ifx"||id==="csa"||k==="jak")&&c&&c.dz==="cu"&&c.sev==="asuc"&&c.ipaa!=="si")out.push("asuc");
  if(id==="vdz"&&c&&c.dz==="ec")out.push("vdzec");
  if(["int","p40","p19","s1p","tnf","jak"].includes(k))out.push("tbc");
  if((id==="aza"||id==="mp")&&c&&c.age>=65)out.push("tiop");
  return out;
}
function gTable(g){const G=GCMP[g];return `<div class="tw"><table class="t cmp"><caption>${esc(G.t)}</caption><tbody>${G.rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</tbody></table></div>`}

/* ---------- ficha ---------- */
function openFicha(id,ph){
  const d=D[id],c=lastC||readForm();
  $("#dcls").textContent=CLS[d.cl];$("#dtitle").textContent=d.n;
  const bb=BRAND[id];$("#dbrand").innerHTML=bb?bb.map(([t,c])=>`<span class="${c?"bc":"bn"}">${esc(t)}</span>`).join(""):"";$("#dbrand").hidden=!bb;
  $("#dmoa").innerHTML=MOA[id]?`<b>Mecanismo:</b> ${esc(MOA[id])}`:"";$("#dmoa").hidden=!MOA[id];
  $("#dtags").innerHTML=`${badge(id)}<span class="tag">${esc(d.via)}</span>${d.cu?'<span class="tag cu">CU</span>':""}${d.ec?'<span class="tag ec">EC</span>':""}`;
  let b="";
  const it=ph&&lastR?lastR.items.find(i=>i.id===id&&i.ph===ph):null;
  if(it){const ws=it.why.filter((w,i,a)=>a.findIndex(x=>x.t===w.t)===i);b+=`<div class="fs"><h5>En este paciente · ${TIERTX[it.tier][0]}</h5><ul class="why">${ws.map(w=>`<li class="${w.c}">${w.ci?"<b>Contraindicado:</b> ":""}${esc(w.t)}</li>`).join("")}</ul></div>`}
  b+=`<div class="fs"><h5>Chile</h5><p>${esc(d.chileTx||CHILE[d.chile][2])}</p></div>`;
  ["cu","ec"].forEach(z=>{const x=d[z];if(!x)return;b+=`<div class="fs"><h5>Dosis · ${z==="cu"?"colitis ulcerosa":"enfermedad de Crohn"}</h5><dl class="kv"><dt>Inducción</dt><dd>${esc(x.ind)}</dd><dt>Mantención</dt><dd>${esc(x.mant)}</dd><dt>Intensificación</dt><dd>${esc(x.int)}</dd></dl></div>`});
  if(d.pouch)b+=`<div class="fs"><h5>Dosis · reservorio ileal</h5><dl class="kv"><dt>Inducción</dt><dd>${esc(d.pouch.ind)}</dd><dt>Mantención</dt><dd>${esc(d.pouch.mant)}</dd><dt>Escalamiento</dt><dd>${esc(d.pouch.int)}</dd></dl></div>`;
  b+=`<div class="fs"><h5>Para la receta</h5><div class="rx"><ul>${d.pres.map(p=>`<li>${esc(p)}</li>`).join("")}</ul><div class="calc">${esc(d.calc(c.wt))}${c.wt?` <span style="color:var(--fg-3)">(peso ${c.wt} kg)</span>`:""}</div></div><p class="note" style="margin-top:6px">Presentaciones habituales; confirmar disponibilidad en farmacia.</p></div>`;
  b+=`<div class="fs"><h5>Cinética · cuánto esperar</h5><p>${esc(d.kinTx||"")}</p>${["cu","ec"].map(z=>d.kin&&d.kin[z]?`<p style="margin:8px 0 0;font-size:.74rem;font-weight:700;color:var(--fg-3)">${z==="cu"?"CU":"EC"}</p>${kinBar(d.kin[z],Math.max(16,(d.kin[z].ext||d.kin[z].ev)+2))}`:"").join("")}</div>`;
  b+=`<div class="fs"><h5>Niveles (TDM)</h5><p>${esc(d.tdm)}</p></div>`;
  b+=`<div class="fs"><h5>En el control</h5><div class="ae">${d.ae.map(([l,t])=>`<div class="${l}"><b>${l==="e"?"Esperable":l==="v"?"Vigilar":"Suspender"}</b><span>${esc(t)}</span></div>`).join("")}</div></div>`;
  b+=`<div class="fs"><h5>Embarazo y lactancia</h5><dl class="kv"><dt>Embarazo</dt><dd>${esc(d.preg)}</dd><dt>Lactancia</dt><dd>${esc(d.lact)}</dd></dl></div>`;
  b+=`<div class="fs"><h5>Ensayos pivotales y guías</h5><p>${esc(d.trials)}</p></div>`;
  const fg=fichaGuides(id,c);if(fg.length)b+=`<div class="fs"><details class="more gd"><summary>Dónde discrepan las guías <small>${fg.length} tema(s)</small></summary><div class="box">${fg.map(g=>gTable(g)).join("")}</div></details></div>`;
  if(d.chk.length){
    b+=`<div class="fs"><h5>Checklist previo al inicio</h5><div class="cl" id="clist">${d.chk.map((k,i)=>{const x=CK[k];if(!x)return"";const tg=x[1]==="o"?'<em class="o">Obligatorio</em>':x[1]==="f"?'<em class="f">Según riesgo</em>':"";return `<label><input type="checkbox" id="ck-${id}-${i}"><span>${esc(x[0])}${tg}</span></label>`}).join("")}</div><div class="acts"><button class="btn" type="button" id="copyck">Copiar checklist</button></div></div>`;
  }
  $("#dbody").innerHTML=b;$("#dbody").scrollTop=0;
  $("#drawer").hidden=false;$("#scrim").hidden=false;$("#dclose").focus();
  const cb=$("#copyck");if(cb)cb.onclick=()=>{const t=`Checklist ${d.n}\n`+d.chk.map((k,i)=>`[${$("#ck-"+id+"-"+i).checked?"x":" "}] ${CK[k][0]}`).join("\n");copyText(t)};
}
function closeFicha(){$("#drawer").hidden=true;$("#scrim").hidden=true}

/* ---------- copiar ---------- */
function toast(t){const e=$("#toast");e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2200)}
function copyText(t){
  const fb=()=>{const ta=document.createElement("textarea");ta.value=t;ta.className="copybox";const box=$("#dbody")&&!$("#drawer").hidden?$("#dbody"):$("#res");box.appendChild(ta);ta.select();toast("Selecciona y copia el texto")};
  try{navigator.clipboard.writeText(t).then(()=>toast("Copiado"),fb)}catch(e){fb()}
}
function summary(){
  const R=lastR,c=lastC;let s=`${R.title} — ${R.tags.map(t=>t[1]).join(" · ")}\n`;
  if(R.alerts.length)s+="\nAlertas:\n"+R.alerts.map(a=>"- "+a.t.replace(/<[^>]+>/g,"")).join("\n")+"\n";
  if(R.steps.length)s+="\nPlan:\n"+R.steps.map((x,i)=>`${i+1}. ${x.replace(/<[^>]+>/g,"")}`).join("\n")+"\n";
  ["pref","alt"].forEach(t=>{const its=R.items.filter(i=>i.tier===t);if(its.length)s+=`\n${TIERTX[t][0]}:\n`+its.map(i=>`- ${D[i.id].n} (${i.ph}; ${CHILE[D[i.id].chile][0]}): ${doseLine(i,c.dz)}`).join("\n")+"\n"});
  const ev=R.items.filter(i=>i.tier==="evit"||i.tier==="prec");if(ev.length)s+="\nEvitar / precaución:\n"+ev.map(i=>`- ${D[i.id].n}: ${i.why.filter(w=>w.c!=="n"&&w.c!=="p").map(w=>(w.ci?"CONTRAINDICADO: ":"")+w.t).join("; ")||i.why.map(w=>w.t).join("; ")}`).join("\n")+"\n";
  if(R.fail.length)s+="\nSi falla:\n"+R.fail.map(x=>"- "+x).join("\n")+"\n";
  s+="\nFuente: Decisión Terapéutica EII, Dr. Moisés Oropeza Hernández (ECCO 2026/2024, ACG 2025, AGA 2024–2025, Guía chilena 2026). Apoyo a la decisión; no reemplaza el juicio clínico.";
  return s;
}

/* ---------- otras vistas ---------- */
function renderFarmacos(){
  const q=($("#fq").value||"").toLowerCase();
  $("#ftab tbody").innerHTML=Object.entries(D).filter(([id,d])=>!q||(d.n+" "+CLS[d.cl]+" "+brandTx(id)).toLowerCase().includes(q)).map(([id,d])=>`<tr class="clk" data-ficha="${id}" tabindex="0"><td class="nm">${esc(d.n)}${BRAND[id]?`<div class="brl">${esc(brandTx(id))}</div>`:""}</td><td>${CLS[d.cl]}</td><td>${d.cu?"Sí":d.pouch?"Reservorio":"—"}</td><td>${d.ec?"Sí":"—"}</td><td>${esc(d.via)}</td><td>${esc(d.kinTx||"")}</td><td>${badge(id)}</td></tr>`).join("");
}
function renderKin(){
  const z=(F.ownerDocument.querySelector('input[name="kdz"]:checked')||{}).value||"cu";
  $("#ktab tbody").innerHTML=Object.entries(D).filter(([id,d])=>d.kin&&d.kin[z]&&d.cl!=="abx").map(([id,d])=>{const k=d.kin[z];return `<tr class="clk" data-ficha="${id}" tabindex="0"><td class="nm">${esc(d.n)}<div class="cls" style="font-family:var(--ff-b);font-weight:400">${CLS[d.cl]}</div></td><td>${kinBar(k,24)}</td><td>${wk(k.ev)}</td><td>${k.ext?wk(k.ext):"—"}</td><td style="min-width:260px">${esc(d.tdm)}</td></tr>`}).join("");
}
function renderPipe(){
  $("#pcards").innerHTML=PIPE.map(p=>`<article class="pc"><div class="ph2"><span class="pill ${p.fase}">${esc(p.faseTx)}</span><span class="tag">${esc(p.dz)}</span></div><h4>${esc(p.n)}</h4><p class="q2">${esc(p.mech)}</p><div class="res2">${esc(p.res)}</div><p>${esc(p.sig)}</p><p class="q2"><b>¿Cambia la práctica?</b> ${esc(p.prac)} · ${esc(p.ref)}</p></article>`).join("");
}
function renderGuias(){
  $("#gcmp").innerHTML=Object.keys(GCMP).map(gTable).join("");
  $("#gtl").innerHTML=GTL.map(g=>`<div><h5>${esc(g.h)}</h5><ul>${g.li.map(l=>`<li>${esc(l)}</li>`).join("")}</ul></div>`).join("");
  $("#refs").innerHTML=REFS.map(r=>`<li>${esc(r).replace(/doi:(\S+)/,(m,x)=>`doi:<a href="https://doi.org/${x}" target="_blank" rel="noopener">${x}</a>`)}</li>`).join("");
}

/* ---------- navegación y tema ---------- */
const VIEWS=["decision","scores","farmacos","cinetica","fragilidad","pipeline","guias","fuentes"];
function show(v){if(!VIEWS.includes(v))v="decision";VIEWS.forEach(x=>{$("#v-"+x).classList.toggle("on",x===v)});$$("#tabs a").forEach(a=>a.setAttribute("aria-current",a.getAttribute("href")==="#"+v?"true":"false"))}
window.addEventListener("hashchange",()=>{closeFicha();show(location.hash.slice(1));window.scrollTo(0,0)});
$("#tema").addEventListener("click",()=>{const r=document.documentElement;const cur=r.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");const n=cur==="dark"?"light":"dark";r.setAttribute("data-theme",n);try{localStorage.setItem("eii-tema",n)}catch(e){}});
try{const t=localStorage.getItem("eii-tema");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}

/* ---------- eventos ---------- */
$("#preset").insertAdjacentHTML("beforeend",PRESETS.map(p=>`<option value="${p.k}">${esc(p.l)}</option>`).join(""));
$("#preset").addEventListener("change",e=>{const p=PRESETS.find(x=>x.k===e.target.value);if(!p){newCase();return}setForm(p.v);$$("details.grp").forEach(d=>d.open=!!d.querySelector('input[type=checkbox]:checked, input[type=radio]:checked:not([value="nd"])'));render()});
$("#nuevo").addEventListener("click",newCase);
function newCase(){F.reset();$("#preset").value="";$$("details.grp").forEach(d=>d.open=false);render();window.scrollTo(0,0)}
F.addEventListener("change",()=>{render()});
F.addEventListener("input",e=>{if(e.target.type==="number")render()});
F.addEventListener("submit",e=>e.preventDefault());
document.addEventListener("click",e=>{
  const f=e.target.closest("[data-ficha]");if(f){openFicha(f.dataset.ficha,f.dataset.ph||null);return}
  if(e.target.id==="copy"&&lastR)copyText(summary());
});
document.addEventListener("change",e=>{if(e.target.id==="onlycl"){onlyChile=e.target.checked;render()}if(e.target.name==="kdz")renderKin()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#drawer").hidden)closeFicha();if(e.key==="Enter"&&e.target.matches("tr[data-ficha]"))openFicha(e.target.dataset.ficha)});
$("#dclose").addEventListener("click",closeFicha);$("#scrim").addEventListener("click",closeFicha);
$("#fq").addEventListener("input",renderFarmacos);

/* ---------- inicio ---------- */
render();renderFarmacos();renderKin();renderPipe();renderGuias();
show(location.hash.slice(1)||"decision");
