/* ============ SCORES DE ACTIVIDAD ============ */
const MAYO=[
 {k:"sf",t:"Frecuencia de deposiciones",o:["Normal para el paciente","1–2 deposiciones más de lo normal","3–4 deposiciones más de lo normal","≥5 deposiciones más de lo normal"]},
 {k:"rb",t:"Sangrado rectal",o:["Sin sangre","Hilos de sangre en menos de la mitad de las deposiciones","Sangre evidente en la mayoría de las deposiciones","Solo sangre"]},
 {k:"pga",t:"Valoración global del médico",o:["Normal","Enfermedad leve","Enfermedad moderada","Enfermedad grave"]},
 {k:"es",t:"Mayo endoscópico",o:["Normal o inactiva (cicatrización)","Leve: eritema, disminución del patrón vascular (friabilidad leve en la versión original; en ensayos actuales la friabilidad puntúa 2)","Moderada: eritema marcado, ausencia de patrón vascular, friabilidad, erosiones","Grave: sangrado espontáneo, úlceras"]}
];
const HBIQ=[
 {k:"wb",t:"Estado general (día previo)",o:["Muy bueno","Ligeramente por debajo de lo normal","Malo","Muy malo","Pésimo"]},
 {k:"pa",t:"Dolor abdominal (día previo)",o:["Ninguno","Leve","Moderado","Grave"]},
 {k:"ms",t:"Masa abdominal",o:["Ausente","Dudosa","Definida","Definida y dolorosa"]}
];
const HBIC=["Artralgia","Uveítis","Eritema nodoso","Úlceras aftosas","Pioderma gangrenoso","Fisura anal","Fístula nueva","Absceso"];
const CDC=["Artritis o artralgia","Iritis o uveítis","Eritema nodoso, pioderma gangrenoso o estomatitis aftosa","Fisura, fístula o absceso perianal","Otra fístula","Fiebre >37,8 °C en la última semana"];
const UCE=[
 {k:"vp",t:"Patrón vascular",o:["Normal: vasos capilares visibles, ramificados","Obliteración parcheada del patrón","Obliteración completa"]},
 {k:"bl",t:"Sangrado",o:["Ninguno","Mucoso: coágulos o puntos de sangre en la superficie, que se lavan","Luminal leve: algo de sangre libre en la luz","Luminal moderado o grave: sangre franca en la luz o rezumando tras lavar"]},
 {k:"eu",t:"Erosiones y úlceras",o:["Ninguna","Erosiones: defectos ≤5 mm, planos, blancos o amarillos","Úlcera superficial: >5 mm, cubierta de fibrina","Úlcera profunda: excavada, con borde levantado"]}];
const RUT=[["i0","Sin lesiones en el íleon neoterminal"],["i1","≤5 lesiones aftosas"],["i2a","Lesiones confinadas a la anastomosis ileocólica (incluye estenosis anastomótica)"],["i2b",">5 aftas con mucosa normal entre ellas, o lesiones mayores salteadas, en el íleon neoterminal"],["i3","Ileítis aftosa difusa con mucosa difusamente inflamada"],["i4","Inflamación difusa con úlceras grandes, nódulos o estenosis"]];
const TOP=[
 ["1","Clase 1 · Enfermedad mínima","Síntomas y carga anorrectal mínimos, requiere poca intervención en el tiempo (definida por el paciente).","Sin intervención si no molesta","Manejo expectante con controles y acceso rápido si empeora; tratar la enfermedad luminal según guías."],
 ["2a","Clase 2a · Reparación","Fístula sintomática apta para cierre combinado médico-quirúrgico (incluye retiro del setón).","Cierre de la fístula","Terapia médica optimizada (anti-TNF con niveles altos) y cirugía reparadora bien seleccionada y oportuna (colgajo de avance, LIFT) con recto sin actividad."],
 ["2b","Clase 2b · Control de síntomas","Dolor y supuración crónicos que afectan la calidad de vida; fístula hoy no apta para reparación.","Control de síntomas","Mejor tratamiento médico y cirugía orientada a síntomas (setón de largo plazo, drenajes). Si el paciente lo desea, intentar llevarla a 2a."],
 ["2c-i","Clase 2c-i · Precoz y rápidamente progresiva","Progresión destructiva del periné o de la calidad de vida en 3–6 meses pese a tratamiento optimizado.","Controlar la sepsis y evitar la destrucción","Drenaje y control médico-quirúrgico rápido; si no se logra, ostomía desfuncionalizante (a veces proctectomía precoz)."],
 ["2c-ii","Clase 2c-ii · Gradualmente debilitante","Síntomas graves por ≥1 año, no apta para reparación, con calidad de vida limitada.","Control de síntomas","Terapia médica optimizada y, eventualmente, ostomía desfuncionalizante."],
 ["3","Clase 3 · Periné agotado o rasgos adversos","Síntomas graves pese a desfuncionalización, destrucción perineal irreversible o síntomas tan limitantes que requieren proctectomía.","Calidad de vida","Discutir proctectomía."],
 ["4a","Clase 4a · Posproctectomía, reparable","Seno o herida perineal sintomática apta para cierre.","Cierre del seno","Terapia médica optimizada y cirugía reparadora seleccionada."],
 ["4b","Clase 4b · Posproctectomía, control de síntomas","Seno o herida crónica no apta para reparación, o el objetivo del paciente es controlar síntomas.","Control de síntomas","Mejor tratamiento médico y cirugía orientada a síntomas."]];
const PDC=[
 {k:"sf",t:"Frecuencia de deposiciones",o:["Habitual posoperatoria","1–2 más que lo habitual","≥3 más que lo habitual"]},
 {k:"rb",t:"Sangrado rectal",o:["Ausente o raro","Diario"]},
 {k:"ur",t:"Urgencia fecal o cólico abdominal",o:["Ninguno","Ocasional","Habitual"]},
 {k:"fe",t:"Fiebre >37,8 °C",o:["Ausente","Presente"]}];
const PDE=["Edema","Granularidad","Friabilidad","Pérdida del patrón vascular","Exudado mucoso","Ulceración"];
const PDH=[
 {k:"pmn",t:"Infiltrado de polimorfonucleares",o:["Ausente","Leve","Moderado + abscesos de cripta","Grave + abscesos de cripta"]},
 {k:"ul",t:"Ulceración por campo de bajo aumento (promedio)",o:["Ausente","<25 %","25–50 %",">50 %"]}];
const SEGS=[["il","Íleon"],["cd","Colon derecho"],["ct","Colon transverso"],["ci","Colon izquierdo y sigma"],["re","Recto"]];
const SESV=[
 {k:"u",t:"Tamaño de úlceras",o:["Ninguna","Aftosas<br>0,1–0,5 cm","Grandes<br>0,5–2 cm","Muy grandes<br>&gt;2 cm"]},
 {k:"s",t:"Superficie ulcerada",o:["Ninguna","&lt;10 %","10–30 %","&gt;30 %"]},
 {k:"a",t:"Superficie afectada",o:["No afectada","&lt;50 %","50–75 %","&gt;75 %"]},
 {k:"n",t:"Estenosis",o:["Ninguna","Única,<br>se pasa","Múltiples,<br>se pasan","No se<br>pasa"]}
];
const opts=(name,o)=>`<div class="opts">${o.map((t,i)=>`<input type="radio" name="${name}" id="${name}-${i}" value="${i}"><label for="${name}-${i}"><i>${i}</i><span>${t}</span></label>`).join("")}</div>`;
$("#sc-form").innerHTML=`
<div id="f-mayo"><fieldset class="blk"><legend>Mayo · colitis ulcerosa</legend>${MAYO.map(q=>`<div class="scq"><div class="ql">${q.t}<span id="mv-${q.k}"></span></div>${opts("my_"+q.k,q.o)}</div>`).join("")}</fieldset></div>
<div id="f-uceis" hidden><fieldset class="blk"><legend>UCEIS · colitis ulcerosa</legend>
 <p class="hint" style="margin:0 0 4px">Puntuar el segmento más afectado (en la rectosigmoidoscopía).</p>
 ${UCE.map(q=>`<div class="scq"><div class="ql">${q.t}</div>${opts("uc_"+q.k,q.o)}</div>`).join("")}
</fieldset></div>
<div id="f-hbi" hidden><fieldset class="blk"><legend>Harvey-Bradshaw · enfermedad de Crohn</legend>
 ${HBIQ.slice(0,2).map(q=>`<div class="scq"><div class="ql">${q.t}</div>${opts("hb_"+q.k,q.o)}</div>`).join("")}
 <div class="scq"><label class="ql" for="hb-st">Deposiciones líquidas o blandas (día previo)<span>1 punto c/u</span></label><div class="inp" style="max-width:180px"><input id="hb-st" type="number" min="0" max="40" inputmode="numeric"><span>n.º</span></div></div>
 <div class="scq"><div class="ql">${HBIQ[2].t}</div>${opts("hb_ms",HBIQ[2].o)}</div>
 <div class="scq"><div class="ql">Complicaciones<span>1 punto c/u</span></div><div class="chk">${HBIC.map((t,i)=>`<input type="checkbox" name="hb_c" id="hbc-${i}" value="${i}"><label for="hbc-${i}">${t}</label>`).join("")}</div></div>
</fieldset></div>
<div id="f-cdai" hidden><fieldset class="blk"><legend>CDAI · enfermedad de Crohn (diario de 7 días)</legend>
 <div class="scq"><label class="ql" for="cd-st">Deposiciones líquidas o muy blandas · total de 7 días<span>× 2</span></label><div class="inp" style="max-width:200px"><input id="cd-st" type="number" min="0" max="300" inputmode="numeric"><span>n.º</span></div></div>
 <div class="scq"><div class="ql">Dolor abdominal · promedio diario de la semana<span>× 7 días × 5</span></div>${opts("cd_pa",["Ninguno","Leve","Moderado","Grave"])}</div>
 <div class="scq"><div class="ql">Estado general · promedio diario de la semana<span>× 7 días × 7</span></div>${opts("cd_wb",["Bien","Algo por debajo de lo normal","Malo","Muy malo","Pésimo"])}</div>
 <div class="scq"><div class="ql">Complicaciones<span>20 puntos c/u</span></div><div class="chk">${CDC.map((t,i)=>`<input type="checkbox" name="cd_c" id="cdc-${i}" value="${i}"><label for="cdc-${i}">${t}</label>`).join("")}</div></div>
 <div class="scq"><div class="ql">Uso de antidiarreicos (loperamida, opioides)<span>× 30</span></div>${opts("cd_ad",["No","Sí"])}</div>
 <div class="scq"><div class="ql">Masa abdominal<span>× 10</span></div><div class="opts">${[["Ausente",0],["Dudosa",2],["Definida",5]].map(([t,v],i)=>`<input type="radio" name="cd_ms" id="cd_ms-${i}" value="${v}"><label for="cd_ms-${i}"><i>${v}</i><span>${t}</span></label>`).join("")}</div></div>
 <div class="scq"><div class="ql">Sexo (para el hematocrito)</div>${opts("cd_sx",["Mujer (referencia 42 %)","Hombre (referencia 47 %)"])}</div>
 <div class="scq"><label class="ql" for="cd-hct">Hematocrito<span>(referencia − Hto) × 6</span></label><div class="inp" style="max-width:200px"><input id="cd-hct" type="number" min="10" max="65" step="0.1" inputmode="decimal"><span>%</span></div></div>
 <div class="scq"><label class="ql" for="cd-wt">Peso actual y peso estándar<span>% bajo el estándar × 1 (mínimo −10)</span></label>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><div class="inp" style="max-width:150px"><input id="cd-wt" type="number" min="25" max="250" step="0.1" inputmode="decimal" placeholder="actual"><span>kg</span></div><div class="inp" style="max-width:150px"><input id="cd-sw" type="number" min="25" max="250" step="0.1" inputmode="decimal" placeholder="estándar"><span>kg</span></div><div class="inp" style="max-width:150px"><input id="cd-ht" type="number" min="120" max="220" inputmode="numeric" placeholder="o talla"><span>cm</span></div></div>
  <p class="hint" style="margin:4px 0 0">Sin peso estándar, se estima con la talla (IMC 22 × talla²).</p></div>
</fieldset></div>
<div id="f-rut" hidden><fieldset class="blk"><legend>Rutgeerts modificado · ileocolonoscopía posquirúrgica</legend>
 <p class="hint" style="margin:0 0 4px">Evaluar el íleon neoterminal y la anastomosis a los 6–12 meses de la resección ileocólica.</p>
 <div class="scq"><div class="opts">${RUT.map(([k,t],i)=>`<input type="radio" name="rut" id="rut-${i}" value="${i}"><label for="rut-${i}"><i>${k}</i><span>${t}</span></label>`).join("")}</div></div>
</fieldset></div>
<div id="f-top" hidden><fieldset class="blk"><legend>TOpClass · enfermedad de Crohn perianal fistulizante</legend>
 <p class="hint" style="margin:0 0 4px">Clasificación por objetivo del paciente y gravedad, no por anatomía (para la anatomía: Parks y RM). El paciente puede cambiar de clase en el tiempo.</p>
 <div class="scq"><div class="opts">${TOP.map((x,i)=>`<input type="radio" name="topc" id="topc-${i}" value="${i}"><label for="topc-${i}"><i>${x[0]}</i><span><b>${x[1].split(" · ")[1]}</b> — ${x[2]}</span></label>`).join("")}</div></div>
</fieldset></div>
<div id="f-pdai" hidden><fieldset class="blk"><legend>PDAI · reservorio ileal (Sandborn 1994)</legend>
 <p class="hint" style="margin:0 0 4px">Clínico + endoscópico = mPDAI (0–12). Agrega la histología para el PDAI completo (0–18).</p>
 ${PDC.map(q=>`<div class="scq"><div class="ql">${q.t}</div>${opts("pd_"+q.k,q.o)}</div>`).join("")}
 <div class="scq"><div class="ql">Hallazgos endoscópicos<span>1 punto c/u</span></div><div class="chk">${PDE.map((t,i)=>`<input type="checkbox" name="pd_e" id="pde-${i}" value="${i}"><label for="pde-${i}">${t}</label>`).join("")}</div></div>
 <details class="segm"><summary>Histología (opcional)<span class="pt" id="pd-hpt">—</span></summary><div class="gin">${PDH.map(q=>`<div class="scq"><div class="ql">${q.t}</div>${opts("pd_"+q.k,q.o)}</div>`).join("")}</div></details>
</fieldset></div>
<div id="f-ses" hidden><fieldset class="blk"><legend>SES-CD · 5 segmentos × 4 variables</legend>
 <p class="hint" style="margin:0 0 4px">Puntúa cada segmento de 0 a 3 en cada variable. Marca «No explorado» si no se alcanzó.</p>
 ${SEGS.map(([k,n],si)=>`<details class="segm" id="sg-${k}"${si===0?" open":""}><summary>${n}<span class="pt" id="sp-${k}">—</span></summary><div class="gin">
  <label class="noexp"><input type="checkbox" id="nx-${k}"> No explorado</label>
  ${SESV.map(v=>`<div class="sesrow"><span>${v.t}</span><div class="seggrid">${v.o.map((t,i)=>`<input type="radio" name="ses_${k}_${v.k}" id="ses-${k}-${v.k}-${i}" value="${i}"><label for="ses-${k}-${v.k}-${i}"><b>${i}</b>${t}</label>`).join("")}</div></div>`).join("")}
 </div></details>`).join("")}
</fieldset></div>`;

const val=n=>{const e=document.querySelector(`input[name="${n}"]:checked`);return e?parseInt(e.value):null};
const band=(rows,v)=>`<div class="bands">${rows.map(([lo,hi,lab,rng])=>`<div class="${v!==null&&v>=lo&&v<=hi?"on":""}"><b>${rng}</b><span>${lab}</span></div>`).join("")}</div>`;
let scApply=null;
const INFO={
 mayo:`<h4>Cómo se usa</h4><ul class="why">
  <li class="n"><b>Mayo parcial</b> (0–9): frecuencia + sangrado + valoración global, sin endoscopía. Sirve para seguimiento clínico y para clasificar en la consulta.</li>
  <li class="n"><b>Mayo total</b> (0–12): suma la endoscopía. Remisión ≤2 sin subpuntaje &gt;1. Respuesta: descenso ≥3 puntos y ≥30 %, con sangrado que baja ≥1 o queda en 0–1.</li>
  <li class="n"><b>Mayo modificado</b> (0–9: frecuencia + sangrado + endoscopía), usado en ensayos recientes y por la FDA. Remisión: frecuencia ≤1, sangrado 0 y endoscópico ≤1.</li>
  <li class="n"><b>Meta STRIDE-III</b> (accionable, 7–12 meses): Mayo endoscópico 0. Mayo 1 solo como meta transitoria si hay remisión clínica y bioquímica. STRIDE-II aceptaba 0–1.</li>
  <li class="n"><b>Remisión clínica STRIDE-III</b>: Mayo parcial ≤1 con sangrado 0. Respuesta: descenso ≥30 % y ≥2 puntos.</li></ul>
  <p class="note" style="margin-top:8px">Schroeder KW, Tremaine WJ, Ilstrup DM. N Engl J Med. 1987;317:1625-9. doi:10.1056/NEJM198712243172603 · Lewis JD et al. Inflamm Bowel Dis. 2008;14:1660-6. doi:10.1002/ibd.20520</p>`,
 uceis:`<h4>Cómo se usa</h4><ul class="why">
  <li class="n">Tres descriptores con definición precisa; total 0–8. Menor variabilidad entre observadores que el Mayo endoscópico y no satura en la enfermedad grave.</li>
  <li class="n"><b>Remisión endoscópica</b>: UCEIS 0 (≤1 en muchos estudios). Bandas de uso habitual: 0–1 remisión, 2–4 leve, 5–6 moderada, 7–8 grave (no son cortes validados formalmente).</li>
  <li class="n"><b>Colitis aguda grave</b> (Corte 2015, n = 89): con UCEIS ≥5 al ingreso, 50 % requirió rescate vs 27 % con ≤4; con 7–8, 11 de 14 necesitaron infliximab o ciclosporina. Un UCEIS ≥7 puede justificar planificar el rescate precozmente.</li></ul>
  <p class="note" style="margin-top:8px">Travis SP, Schnell D, Krzeski P, et al. Gut. 2012;61(4):535-42. doi:10.1136/gutjnl-2011-300486 · Corte C, et al. J Crohns Colitis. 2015;9(5):376-81. doi:10.1093/ecco-jcc/jjv047</p>`,
 hbi:`<h4>Cómo se usa</h4><ul class="why">
  <li class="n">Índice simplificado del CDAI con datos del <b>día previo</b>; se calcula en la consulta, sin diario de 7 días.</li>
  <li class="n"><b>Respuesta</b>: descenso ≥3 puntos. <b>Remisión</b>: &lt;5.</li>
  <li class="n">Se correlaciona mal con la inflamación: confirmar con calprotectina, PCR, endoscopía o imagen (ACG 2025, KC9).</li></ul>
  <p class="note" style="margin-top:8px">Harvey RF, Bradshaw JM. A simple index of Crohn's-disease activity. Lancet. 1980;1(8167):514. doi:10.1016/s0140-6736(80)92767-1</p>`,
 cdai:`<h4>Cómo se usa</h4><ul class="why">
  <li class="n">Requiere un <b>diario de 7 días</b> (deposiciones, dolor, estado general) más examen y hematocrito. Es el índice clásico de los ensayos; en la consulta, el HBI es más práctico (correlación r ≈ 0,9).</li>
  <li class="n"><b>Remisión</b>: &lt;150. <b>Respuesta</b>: descenso ≥100 (CDAI-100) o ≥70 (CDAI-70, más laxo).</li>
  <li class="n">Pesa mucho lo subjetivo (dolor y bienestar ≈ 60 % del puntaje) y puede estar alto en SII superpuesto o enfermedad fibroestenosante sin inflamación: confirmar con calprotectina, PCR, endoscopía o ecografía intestinal.</li>
  <li class="n">Los ensayos recientes y la FDA usan como coprimario el <b>PRO2</b> (frecuencia de deposiciones ≤2,8 y dolor ≤1 de promedio diario) junto con la respuesta endoscópica (SES-CD).</li></ul>
  <p class="note" style="margin-top:8px">Best WR, Becktel JM, Singleton JW, Kern F Jr. Gastroenterology. 1976;70(3):439-44. doi:10.1016/S0016-5085(76)80163-1</p>`,
 rut:`<h4>Cómo se usa</h4><ul class="why">
  <li class="n">Ileocolonoscopía a los <b>6–12 meses</b> de la resección ileocólica (ACG 2025, R30). Es el mejor predictor de recurrencia clínica.</li>
  <li class="n"><b>Recurrencia endoscópica: ≥i2b</b>. La versión modificada separa i2a (solo anastomosis, menor riesgo) de i2b (íleon neoterminal).</li>
  <li class="n">Conducta: i0–i1 mantener y repetir en 1–3 años; i2a individualizar; ≥i2b iniciar o escalar terapia (anti-TNF, vedolizumab, ustekinumab; ACG R31).</li>
  <li class="n">Calprotectina &lt;100 µg/g a los 3–6 meses tiene alto valor predictivo negativo; la ecografía intestinal (grosor &gt;3 mm) apoya entre colonoscopías.</li></ul>
  <p class="note" style="margin-top:8px">Rutgeerts P, Geboes K, Vantrappen G, et al. Gastroenterology. 1990;99(4):956-63. doi:10.1016/0016-5085(90)90613-6</p>`,
 top:`<h4>Cómo se usa</h4><ul class="why">
  <li class="n">Asigna una clase según la gravedad y el <b>objetivo acordado con el paciente</b>; cada clase trae su estrategia médico-quirúrgica y el tipo de ensayo para el que es candidato.</li>
  <li class="n">Complementa, no reemplaza, la anatomía (Parks, RM con MAGNIFI-CD/Van Assche) y el examen bajo anestesia.</li>
  <li class="n">Se reclasifica en el tiempo: 2b → 2a tras controlar la sepsis con setón y anti-TNF, o 2a → 2b si falla la reparación.</li></ul>
  <p class="note" style="margin-top:8px">Geldof J, Iqbal N, LeBlanc JF, et al. Lancet Gastroenterol Hepatol. 2022;7(6):576-84. doi:10.1016/S2468-1253(22)00007-3</p>`,
 pdai:`<h4>Cómo se usa</h4><ul class="why">
  <li class="n"><b>Pouchitis</b>: PDAI ≥7 (completo) o mPDAI ≥5 (sin histología).</li>
  <li class="n"><b>Remisión</b> (EARNEST): mPDAI ≤4 con descenso ≥2; PDAI ≤6 con descenso ≥3. <b>Respuesta</b>: descenso del mPDAI ≥2.</li>
  <li class="n">Los síntomas solos no bastan: el reservorio irritable, la cuffitis y las estenosis dan clínica similar con endoscopía normal o distinta.</li>
  <li class="n">Describir por separado asa aferente, cuerpo del reservorio y cuff (ileítis prereservorio o cuffitis cambian la categoría).</li></ul>
  <p class="note" style="margin-top:8px">Sandborn WJ, Tremaine WJ, Batts KP, et al. Mayo Clin Proc. 1994;69(5):409-15. doi:10.1016/s0025-6196(12)61634-6 · Travis S et al. N Engl J Med. 2023;388:1191-200. doi:10.1056/NEJMoa2208450</p>`,
 ses:`<h4>Cómo se usa</h4><ul class="why">
  <li class="n">Puntaje endoscópico: 4 variables (0–3) en 5 segmentos; total 0–56. La estenosis no se mueve con el tratamiento médico.</li>
  <li class="n"><b>Meta STRIDE-III</b> (accionable, 7–12 meses): SES-CD ≤2; remisión completa ≤1. Por cápsula, Lewis &lt;135. STRIDE-II pedía SES-CD &lt;3 o ausencia de úlceras.</li>
  <li class="n"><b>Respuesta endoscópica</b>: descenso ≥50 % respecto del basal.</li>
  <li class="n">En enfermedad ileal aislada el máximo es bajo: un mismo número pesa más que en colitis extensa.</li></ul>
  <p class="note" style="margin-top:8px">Daperno M, D'Haens G, Van Assche G, et al. Development and validation of a new, simplified endoscopic activity score for Crohn's disease: the SES-CD. Gastrointest Endosc. 2004;60(4):505-12. doi:10.1016/s0016-5107(04)01878-4</p>`
};
function scRender(){
  const tool=(document.querySelector('input[name="stool"]:checked')||{}).value||"mayo";
  ["mayo","uceis","hbi","cdai","ses","rut","top","pdai"].forEach(t=>$("#f-"+t).hidden=t!==tool);
  $("#sc-info").innerHTML=INFO[tool];
  const btn=$("#sc-apply");btn.hidden=true;scApply=null;let h="";
  if(tool==="mayo"){
    const v={};MAYO.forEach(q=>{v[q.k]=val("my_"+q.k);$("#mv-"+q.k).textContent=v[q.k]===null?"":v[q.k]});
    const okP=v.sf!==null&&v.rb!==null&&v.pga!==null, partial=okP?v.sf+v.rb+v.pga:null;
    const total=okP&&v.es!==null?partial+v.es:null, mms=v.sf!==null&&v.rb!==null&&v.es!==null?v.sf+v.rb+v.es:null;
    const maxSub=Math.max(...Object.values(v).map(x=>x||0));
    let main,lab,st;
    if(total!==null){main=total+"<small>/12</small>";const rem=total<=2&&maxSub<=1;lab=rem?"Remisión":total<=5?"Leve":total<=10?"Moderada":"Grave";st=rem?"r":total<=5?"p":"f";
      if(!rem)scApply=total<=5?"leve":total<=10?"moderada":"grave";
      h=`<div class="k">Mayo total</div><div class="score"><b class="st-${st}">${main}</b><span class="st-${st}">${lab}</span></div>${band([[0,2,"Remisión (sin subpuntaje >1)","0–2"],[3,5,"Leve","3–5"],[6,10,"Moderada","6–10"],[11,12,"Grave","11–12"]],total)}`;
    }else if(partial!==null){lab=partial<=1?"Remisión":partial<=4?"Leve":partial<=7?"Moderada":"Grave";st=partial<=1?"r":partial<=4?"p":"f";
      if(partial>1)scApply=partial<=4?"leve":partial<=7?"moderada":"grave";
      h=`<div class="k">Mayo parcial</div><div class="score"><b class="st-${st}">${partial}<small>/9</small></b><span class="st-${st}">${lab}</span></div>${band([[0,1,"Remisión","0–1"],[2,4,"Leve","2–4"],[5,7,"Moderada","5–7"],[8,9,"Grave","8–9"]],partial)}`;
    }else h=`<div class="k">Mayo</div><h3>Completa frecuencia, sangrado y valoración global</h3><p class="note">Con esos tres se obtiene el Mayo parcial; agrega la endoscopía para el total.</p>`;
    const extra=[];
    if(partial!==null&&total!==null)extra.push(`Mayo parcial: <b>${partial}/9</b>`);
    if(mms!==null)extra.push(`Mayo modificado: <b>${mms}/9</b>${v.sf<=1&&v.rb===0&&v.es<=1?" · remisión":""}`);
    if(v.es!==null)extra.push(`Endoscópico: <b>${v.es}</b> · ${v.es===0?"remisión endoscópica":v.es===1?"mejoría endoscópica (meta STRIDE-III solo transitoria, si hay remisión clínica y bioquímica)":"actividad endoscópica"}`);
    if(extra.length)h+=`<ul class="why" style="margin-top:8px">${extra.map(x=>`<li class="n">${x}</li>`).join("")}</ul>`;
    if(scApply){btn.hidden=false;btn.textContent=`Usar en la decisión: CU ${scApply}`}
  }else if(tool==="hbi"){
    const wb=val("hb_wb"),pa=val("hb_pa"),ms=val("hb_ms"),stv=$("#hb-st").value,stn=parseInt(stv)||0,comp=document.querySelectorAll('input[name="hb_c"]:checked').length;
    if(wb===null||pa===null||ms===null||stv===""){h=`<div class="k">Harvey-Bradshaw</div><h3>Completa los 5 ítems</h3><p class="note">Estado general, dolor, deposiciones, masa y complicaciones.</p>`}
    else{const s=wb+pa+stn+ms+comp;const lab=s<5?"Remisión":s<=7?"Leve":s<=16?"Moderada":"Grave",st=s<5?"r":s<=7?"p":"f";
      if(s>=5)scApply=s<=7?"leve":s<=16?"moderada":"grave";
      h=`<div class="k">Harvey-Bradshaw</div><div class="score"><b class="st-${st}">${s}</b><span class="st-${st}">${lab}</span></div>${band([[0,4,"Remisión","<5"],[5,7,"Leve","5–7"],[8,16,"Moderada","8–16"],[17,999,"Grave",">16"]],s)}
      <ul class="why" style="margin-top:8px"><li class="n">Estado general ${wb} · dolor ${pa} · deposiciones ${stn} · masa ${ms} · complicaciones ${comp}</li></ul>`;
      if(scApply){btn.hidden=false;btn.textContent=`Usar en la decisión: Crohn ${scApply}`}
    }
  }else if(tool==="uceis"){
    const v={};UCE.forEach(q=>v[q.k]=val("uc_"+q.k));
    if(Object.values(v).some(x=>x===null))h=`<div class="k">UCEIS</div><h3>Completa los 3 descriptores</h3><p class="note">Patrón vascular, sangrado, erosiones y úlceras.</p>`;
    else{const t=v.vp+v.bl+v.eu,lab=t<=1?"Remisión endoscópica":t<=4?"Leve":t<=6?"Moderada":"Grave",st=t<=1?"r":t<=4?"p":"f";
      h=`<div class="k">UCEIS</div><div class="score"><b class="st-${st}">${t}<small>/8</small></b><span class="st-${st}">${lab}</span></div>${band([[0,1,"Remisión","0–1"],[2,4,"Leve","2–4"],[5,6,"Moderada","5–6"],[7,8,"Grave","7–8"]],t)}
      <ul class="why" style="margin-top:8px"><li class="n">Patrón vascular ${v.vp} · sangrado ${v.bl} · erosiones y úlceras ${v.eu}</li>
      ${t===0?`<li class="p">Remisión endoscópica completa. La meta STRIDE-III se expresa como Mayo endoscópico 0.</li>`:""}
      ${v.eu===3?`<li class="w">Úlceras profundas: factor de mal pronóstico (ACG 2025); márcalo en la Decisión («Mayo endoscópico 3 / úlceras profundas»).</li>`:""}
      ${t>=7?`<li class="w">En colitis aguda grave, UCEIS ≥7 al ingreso: casi todos requieren rescate; planificar infliximab o ciclosporina desde el inicio (Corte 2015).</li>`:t>=5?`<li class="w">En colitis aguda grave, UCEIS ≥5 duplica la necesidad de rescate (50 % vs 27 %).</li>`:""}</ul>`;}
  }else if(tool==="rut"){
    const v=val("rut");
    if(v===null)h=`<div class="k">Rutgeerts modificado</div><h3>Elige el hallazgo endoscópico</h3><p class="note">Íleon neoterminal y anastomosis, a los 6–12 meses de la cirugía.</p>`;
    else{const k=RUT[v][0],rec=v>=3,st=v<=1?"r":v===2?"p":"f",lab=v<=1?"Sin recurrencia endoscópica":v===2?"Lesión anastomótica (riesgo intermedio)":v===3?"Recurrencia endoscópica":"Recurrencia endoscópica grave";
      const cond=v<=1?"Mantener la estrategia actual; nueva ileocolonoscopía en 1–3 años y calprotectina seriada.":v===2?"Individualizar: el riesgo es menor que en i2b. Considerar vigilancia estrecha (calprotectina, ecografía, nueva colonoscopía en 6–12 meses) o tratar si hay otros factores de riesgo.":"Iniciar o escalar terapia avanzada (anti-TNF, vedolizumab, ustekinumab; ACG R31); optimizar niveles si ya está en tratamiento.";
      h=`<div class="k">Rutgeerts modificado</div><div class="score"><b class="st-${st}">${k}</b><span class="st-${st}">${lab}</span></div>${band([[0,1,"Sin recurrencia","i0–i1"],[2,2,"Anastomótica","i2a"],[3,3,"Recurrencia","i2b"],[4,5,"Recurrencia grave (alto riesgo clínico)","i3–i4"]],v)}
      <ul class="why" style="margin-top:8px"><li class="${rec?"w":"p"}">${cond}</li>${v>=4?`<li class="w">i3–i4: alta probabilidad de recurrencia clínica y quirúrgica a 3–5 años.</li>`:""}</ul>`;}
  }else if(tool==="top"){
    const v=val("topc");
    if(v===null)h=`<div class="k">TOpClass</div><h3>Elige la clase que describe al paciente</h3><p class="note">Define con el paciente si el objetivo es cerrar la fístula o controlar síntomas.</p>`;
    else{const x=TOP[v],st=v===0?"r":v<=2||v===6?"p":"f";
      h=`<div class="k">TOpClass</div><div class="score"><b class="st-${st}">${x[0]}</b><span class="st-${st}">${x[1].split(" · ")[1]}</span></div>
      <dl class="kv" style="margin-top:10px"><dt>Definición</dt><dd>${x[2]}</dd><dt>Objetivo</dt><dd><b>${x[3]}</b></dd><dt>Estrategia</dt><dd>${x[4]}</dd></dl>
      ${v>=1&&v<=5?`<ul class="why" style="margin-top:8px"><li class="n">Base médica: anti-TNF (infliximab con valle ≥10–20 µg/mL) ± tiopurina; antibiótico como puente en la sepsis. Examen bajo anestesia y setón antes de la terapia avanzada.</li></ul>`:""}`;}
  }else if(tool==="pdai"){
    const pc={};PDC.forEach(q=>pc[q.k]=val("pd_"+q.k));
    const cOk=Object.values(pc).every(x=>x!==null),cl=cOk?Object.values(pc).reduce((a,b)=>a+b,0):null;
    const en=document.querySelectorAll('input[name="pd_e"]:checked').length;
    const pm=val("pd_pmn"),ul=val("pd_ul"),hi=pm!==null&&ul!==null?pm+ul:null;
    $("#pd-hpt").textContent=hi===null?"—":hi+" pts";
    if(!cOk)h=`<div class="k">PDAI</div><h3>Completa los 4 ítems clínicos</h3><p class="note">Marca los hallazgos endoscópicos presentes (ninguno marcado = 0).</p>`;
    else{const m=cl+en,pou=hi!==null?m+hi>=7:m>=5;
      const main=hi!==null?`${m+hi}<small>/18</small>`:`${m}<small>/12</small>`,st=pou?"f":"r";
      h=`<div class="k">${hi!==null?"PDAI completo":"mPDAI (sin histología)"}</div><div class="score"><b class="st-${st}">${main}</b><span class="st-${st}">${pou?"Pouchitis":"Sin criterios de pouchitis"}</span></div>
      ${hi!==null?band([[0,6,"Sin pouchitis","0–6"],[7,18,"Pouchitis","≥7"]],m+hi):band([[0,4,"Sin pouchitis","0–4"],[5,12,"Pouchitis","≥5"]],m)}
      <ul class="why" style="margin-top:8px"><li class="n">Clínico ${cl}/6 · endoscópico ${en}/6${hi!==null?` · histológico ${hi}/6 · mPDAI ${m}/12`:""}</li>
      ${!pou&&cl>=3?`<li class="w">Síntomas sin inflamación suficiente: considerar reservorio irritable, cuffitis, estenosis o disfunción del piso pélvico.</li>`:""}
      <li class="n">En el control: respuesta si el mPDAI baja ≥2; remisión si queda ≤4 (y bajó ≥2).</li></ul>`;
      if(pou){scApply="pouch";btn.hidden=false;btn.textContent="Usar en la decisión: reservorio con pouchitis"}
    }
  }else if(tool==="cdai"){
    const num=id=>{const x=parseFloat(($("#"+id).value||"").replace(",","."));return isNaN(x)?null:x};
    const st=num("cd-st"),pa=val("cd_pa"),wb=val("cd_wb"),ad=val("cd_ad"),ms=val("cd_ms"),sx=val("cd_sx"),hct=num("cd-hct"),wt=num("cd-wt");
    let sw=num("cd-sw");const ht=num("cd-ht");if(sw===null&&ht)sw=Math.round(22*(ht/100)**2*10)/10;
    const comp=document.querySelectorAll('input[name="cd_c"]:checked').length;
    const miss=[];if(st===null)miss.push("deposiciones");if(pa===null)miss.push("dolor");if(wb===null)miss.push("estado general");if(ad===null)miss.push("antidiarreicos");if(ms===null)miss.push("masa");if(sx===null)miss.push("sexo");if(hct===null)miss.push("hematocrito");if(wt===null||sw===null)miss.push("peso actual y estándar o talla");
    if(miss.length)h=`<div class="k">CDAI</div><h3>Faltan: ${miss.join(", ")}</h3><p class="note">Las deposiciones van como total de 7 días; dolor y estado general como promedio diario.</p>`;
    else{
      const c1=st*2,c2=pa*7*5,c3=wb*7*7,c4=comp*20,c5=ad*30,c6=ms*10,c7=Math.round(((sx===1?47:42)-hct)*6*10)/10,c8=Math.max(-10,Math.round(100*(1-wt/sw)*10)/10);
      const s=Math.round(c1+c2+c3+c4+c5+c6+c7+c8);
      const lab=s<150?"Remisión":s<220?"Leve":s<=450?"Moderada":"Grave",stc=s<150?"r":s<220?"p":"f";
      if(s>=150)scApply=s<220?"leve":s<=450?"moderada":"grave";
      h=`<div class="k">CDAI</div><div class="score"><b class="st-${stc}">${s}</b><span class="st-${stc}">${lab}</span></div>${band([[-99,149,"Remisión","<150"],[150,219,"Leve","150–219"],[220,450,"Moderada","220–450"],[451,9999,"Grave",">450"]],s)}
      <ul class="why" style="margin-top:8px"><li class="n">Deposiciones ${c1} · dolor ${c2} · estado general ${c3} · complicaciones ${c4} · antidiarreicos ${c5} · masa ${c6} · hematocrito ${String(c7).replace(".",",")} · peso ${String(c8).replace(".",",")}${num("cd-sw")===null?` (estándar estimado ${String(sw).replace(".",",")} kg)`:""}</li>
      <li class="n">En el control: respuesta si baja ≥100 puntos (≥70 con criterio laxo); remisión si queda &lt;150.</li></ul>`;
      if(scApply){btn.hidden=false;btn.textContent=`Usar en la decisión: Crohn ${scApply}`}
    }
  }else{
    let tot=0,seen=0,ulc=false,stn=false;
    SEGS.forEach(([k])=>{
      const nx=$("#nx-"+k).checked;let p=0,any=false;
      SESV.forEach(v=>{const x=val(`ses_${k}_${v.k}`);document.querySelectorAll(`input[name="ses_${k}_${v.k}"]`).forEach(e=>e.disabled=nx);if(!nx&&x!==null){p+=x;any=true;if(v.k==="u"&&x>0)ulc=true;if(v.k==="n"&&x>0)stn=true}});
      $("#sp-"+k).textContent=nx?"no explorado":any?p+" pts":"—";if(!nx&&any){tot+=p;seen++}
    });
    if(!seen)h=`<div class="k">SES-CD</div><h3>Puntúa al menos un segmento</h3><p class="note">Abre cada segmento y marca sus 4 variables.</p>`;
    else{const lab=tot<=2?"Remisión endoscópica":tot<=6?"Leve":tot<=15?"Moderada":"Grave",st=tot<=2?"r":tot<=6?"p":"f";
      h=`<div class="k">SES-CD · ${seen} segmento(s) puntuado(s)</div><div class="score"><b class="st-${st}">${tot}<small>/56</small></b><span class="st-${st}">${lab}</span></div>${band([[0,2,"Remisión endoscópica","0–2"],[3,6,"Leve","3–6"],[7,15,"Moderada","7–15"],[16,56,"Grave","≥16"]],tot)}
      <ul class="why" style="margin-top:8px"><li class="${tot<=2?"p":"w"}">${tot<=1?"SES-CD ≤1: remisión endoscópica completa (meta STRIDE-III)":tot<=2?"SES-CD ≤2: meta endoscópica STRIDE-III cumplida":"SES-CD >2: no cumple la meta STRIDE-III (≤2)"}${tot<=2&&ulc?". Hay úlcera puntuada: revisar el segmento":""}</li>${stn?`<li class="w">Estenosis presente: caracterizar con imagen (componente inflamatorio vs fibrótico)</li>`:""}</ul>`;
    }
  }
  $("#sc-resb").innerHTML=h;
}
$("#v-scores").addEventListener("change",scRender);
$("#v-scores").addEventListener("input",e=>{if(e.target.id==="hb-st"||e.target.id.startsWith("cd-"))scRender()});
document.querySelectorAll('a[href="#scores"]').forEach(a=>a.addEventListener("click",()=>{try{const c=readForm();if(c.wt&&!$("#cd-wt").value)$("#cd-wt").value=c.wt;const sx=(document.querySelector('input[name="sex"]:checked')||{}).value;if(sx&&val("cd_sx")===null)$("#cd_sx-"+(sx==="M"?1:0)).checked=true}catch(e){}}));
$("#sc-apply").addEventListener("click",()=>{
  const tool=(document.querySelector('input[name="stool"]:checked')||{}).value;if(!scApply)return;
  if(tool==="pdai"){$("#dz-cu").checked=true;$("#ip-s").checked=true}
  else if(tool==="mayo"){$("#dz-cu").checked=true;$("#ip-n").checked=true;$("#sev-"+({leve:"l",moderada:"m",grave:"g"})[scApply]).checked=true}
  else{$("#dz-ec").checked=true;$("#act-"+({leve:"l",moderada:"m",grave:"g"})[scApply]).checked=true}
  render();toast("Actividad llevada al caso");location.hash="decision";
});
scRender();
