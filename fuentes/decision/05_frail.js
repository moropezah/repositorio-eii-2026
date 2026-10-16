/* ============ FRAGILIDAD ============ */
const CFS=[
 [1,"Muy en forma","Robusto, activo y enérgico; hace ejercicio con regularidad. Entre los más en forma para su edad."],
 [2,"En forma","Sin síntomas de enfermedad activa, pero menos en forma que la categoría 1. Ejercicio ocasional o estacional."],
 [3,"Se maneja bien","Problemas médicos bien controlados aunque con síntomas ocasionales; no hace actividad física regular más allá de caminar."],
 [4,"Fragilidad muy leve","Independiente, pero los síntomas limitan sus actividades. Refiere estar «más lento» o cansado durante el día."],
 [5,"Fragilidad leve","Lentitud evidente; necesita ayuda en actividades instrumentales complejas (finanzas, transporte, tareas domésticas pesadas)."],
 [6,"Fragilidad moderada","Necesita ayuda en todas las actividades fuera de casa y en las tareas del hogar; dificultad con escaleras; ayuda mínima para bañarse."],
 [7,"Fragilidad grave","Dependiente para el cuidado personal por causa física o cognitiva, pero estable y sin alto riesgo de morir en 6 meses."],
 [8,"Fragilidad muy grave","Totalmente dependiente, cerca del final de la vida; no se recuperaría de una enfermedad menor."],
 [9,"Enfermo terminal","Expectativa de vida menor de 6 meses, sin otra fragilidad evidente."]
];
$("#cfsl").innerHTML=CFS.map(([n,t,d])=>`<input type="radio" name="cfs" id="cfs-${n}" value="${n}"><label for="cfs-${n}"><i>${n}</i><span><b>${t}</b><small>${d}</small></span></label>`).join("");

function gripCut(sx,imc){if(!sx||!imc)return null;if(sx==="M")return imc<=24?29:imc<=26?30:imc<=28?30:32;return imc<=23?17:imc<=26?17.3:imc<=29?18:21}
function gaitCut(sx,t){if(!sx||!t)return null;return sx==="M"?(t<=173?7:6):(t<=159?7:6)}
const num=id=>parseFloat($("#"+id).value)||0;

function frailAuto(e){
  const sx=(document.querySelector('input[name="fsx"]:checked')||{}).value, t=num("ftalla"), p=num("fpeso"), p0=num("fpeso0");
  const imc=t&&p?p/((t/100)**2):0;
  $("#fimc").textContent=imc?`IMC ${imc.toFixed(1).replace(".",",")} kg/m²`:"Sexo, talla y peso permiten calcular los puntos de corte de prensión y marcha.";
  const src=e&&e.target?e.target.id:"";
  // 1 peso
  if(p&&p0){const d=p0-p,pc=d/p0*100,ok=d>4.5||pc>=5;$("#a1").textContent=`Pérdida ${d.toFixed(1).replace(".",",")} kg (${pc.toFixed(1).replace(".",",")} %) → ${ok?"cumple":"no cumple"}`;if(["fpeso","fpeso0"].includes(src))$("#c1").checked=ok}else $("#a1").textContent="";
  // 4 prensión
  const gc=gripCut(sx,imc);$("#cut4").textContent=gc?`Corte: ≤${String(gc).replace(".",",")} kg`:"Requiere sexo, talla y peso";
  const g=num("fgrip");if(g&&gc){const ok=g<=gc;$("#a4").textContent=`${String(g).replace(".",",")} kg vs ≤${String(gc).replace(".",",")} → ${ok?"cumple":"no cumple"}`;if(["fgrip","ftalla","fpeso","fsx-m","fsx-f"].includes(src))$("#c4").checked=ok}else $("#a4").textContent="";
  // 5 marcha
  const mc=gaitCut(sx,t);$("#cut5").textContent=mc?`Corte: ≥${mc} s`:"Requiere sexo y talla";
  const s=num("fgait");if(s&&mc){const ok=s>=mc;$("#a5").textContent=`${String(s).replace(".",",")} s (${(4.57/s).toFixed(2).replace(".",",")} m/s) vs ≥${mc} s → ${ok?"cumple":"no cumple"}`;if(["fgait","ftalla","fsx-m","fsx-f"].includes(src))$("#c5").checked=ok}else $("#a5").textContent="";
  frailRender();
}
function frailRender(){
  const tool=(document.querySelector('input[name="ftool"]:checked')||{}).value||"fried";
  $("#fried").hidden=tool!=="fried";$("#cfs").hidden=tool!=="cfs";
  let st=null,score="",lab="",txt="",extra="";
  if(tool==="fried"){
    const n=[1,2,3,4,5].filter(i=>$("#c"+i).checked).length;
    [1,2,3,4,5].forEach(i=>$("#fc"+i).classList.toggle("on",$("#c"+i).checked));
    st=n>=3?"f":n>=1?"p":"r";score=`${n}<small style="font-size:1rem;color:var(--fg-3)">/5</small>`;
    lab=st==="f"?"Frágil":st==="p"?"Prefrágil":"Robusto";
    txt=st==="f"?"Tres o más criterios: mayor riesgo de infección grave, hospitalización, discapacidad y muerte.":st==="p"?"Uno o dos criterios: estado intermedio y reversible; intervenir y reevaluar.":"Ningún criterio. Si aún no los evaluaste todos, el resultado puede subestimar la fragilidad.";
    extra=`<div class="meter"><div class="r ${st==="r"?"on":""}"></div><div class="p ${st==="p"?"on":""}"></div><div class="f ${st==="f"?"on":""}"></div></div><div class="meterl"><span>0 · robusto</span><span>1–2 · prefrágil</span><span>≥3 · frágil</span></div>`;
  }else{
    const v=parseInt((document.querySelector('input[name="cfs"]:checked')||{}).value)||0;
    if(!v){$("#fresb").innerHTML=`<div class="k">Resultado</div><h3>Elige una categoría</h3><p class="note">Escala 1–9: 1–3 sin fragilidad; 4 fragilidad muy leve; ≥5 frágil (GETECCU 2025).</p>`;$("#fapply").hidden=true;return}
    st=v>=5?"f":v===4?"p":"r";score=`${v}<small style="font-size:1rem;color:var(--fg-3)">/9</small>`;
    lab=CFS[v-1][1];txt=st==="f"?"CFS ≥5: frágil. Mismo impacto clínico que Fried ≥3.":st==="p"?"CFS 4: equivale a prefragilidad; vigilar y reevaluar.":"Sin fragilidad.";
    extra=`<div class="meter"><div class="r ${st==="r"?"on":""}"></div><div class="p ${st==="p"?"on":""}"></div><div class="f ${st==="f"?"on":""}"></div></div><div class="meterl"><span>1–3 · no frágil</span><span>4 · muy leve</span><span>≥5 · frágil</span></div>`;
  }
  $("#fresb").innerHTML=`<div class="k">Resultado · ${tool==="fried"?"Fenotipo de Fried":"Escala clínica de fragilidad"}</div><div class="score"><b class="st-${st}">${score}</b><span class="st-${st}">${lab}</span></div>${extra}<p style="margin:8px 0 0;font-size:.88rem;color:var(--fg-2)">${txt}</p>`;
  const b=$("#fapply");b.hidden=false;
  if(st==="f"){b.textContent="Marcar fragilidad en la decisión";b.className="btn pri";delete b.dataset.off}
  else{b.textContent="Quitar fragilidad de la decisión";b.className="btn";b.dataset.off="1"}
}
$("#v-fragilidad").addEventListener("input",frailAuto);
$("#v-fragilidad").addEventListener("change",e=>{if(/^c\d$/.test(e.target.id)||e.target.name==="ftool"||e.target.name==="cfs")frailRender();else frailAuto(e)});
document.addEventListener("click",e=>{if(e.target.id!=="fapply")return;const on=!e.target.dataset.off;$("#co-fr").checked=on;if(on)$("#g-otr").open=true;render();toast(on?"Fragilidad marcada en el caso":"Fragilidad desmarcada en el caso");if(on)location.hash="decision"});
frailAuto();
