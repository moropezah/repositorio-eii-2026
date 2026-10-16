/* ============ MOTOR DE DECISIÓN ============ */
const TIERS=["pref","alt","baja","prec","evit"];
const TIERTX={pref:["Preferente","Primera elección en este escenario"],alt:["Alternativa razonable","Eficacia comparable o evidencia menor"],baja:["Menor eficacia esperada","Válida, pero rinde menos en esta línea"],prec:["Con precaución","Condición del paciente que obliga a sopesar riesgo"],evit:["Evitar","No usar en este paciente o escenario; el motivo indica si es contraindicación, riesgo mayor que el beneficio o falta de eficacia"],inv:["En investigación","Sin aprobación; considerar ensayo clínico"]};

function evaluate(c){
  const R={items:[],steps:[],alerts:[],combo:null,fail:[],guides:new Set(),tags:[],title:""};
  const ti=t=>TIERS.indexOf(t);
  const add=(id,tier,ph,why,dose)=>{let it=R.items.find(x=>x.id===id&&x.ph===ph);if(!it){it={id,tier,ph,why:[],dose:dose||null};R.items.push(it)}else if(ti(tier)<ti(it.tier))it.tier=tier;if(why)it.why.push({c:"n",t:why});return it};
  const step=(t)=>R.steps.push(t);
  const alert=(lvl,t)=>R.alerts.push({lvl,t});
  const has=k=>c.co.includes(k), eim=k=>c.eim.includes(k);
  const age=c.age||0;
  const cuRiskN=c.cur.length+(c.ext==="E3"?1:0);
  const pouch=c.dz==="cu"&&c.ipaa==="si";
  const ecRisk=c.dz==="ec"&&(c.ecr.length>0||c.beh!=="B1"||c.pa!=="no"||c.l4);

  /* ---------- etiquetas del caso ---------- */
  if(pouch){
    R.title="Reservorio ileal (IPAA) · colitis ulcerosa";
    R.tags.push(["cu",({int:"Pouchitis aguda o intermitente",rec:"Pouchitis recurrente que responde",cadp:"Pouchitis crónica dependiente de antibióticos",carp:"Pouchitis crónica refractaria a antibióticos",cldp:"Enfermedad tipo Crohn del reservorio",cuff:"Cuffitis"})[c.pch]]);
  }else if(c.dz==="cu"){
    R.title="Colitis ulcerosa";
    R.tags.push(["cu",c.ext+" · "+({E1:"proctitis",E2:"izquierda",E3:"extensa"})[c.ext]]);
    R.tags.push(["cu",({leve:"Leve",moderada:"Moderada",grave:"Grave ambulatoria",asuc:"Colitis aguda grave"})[c.sev]]);
  }else{
    R.title="Enfermedad de Crohn";
    R.tags.push(["ec",c.loc+(c.l4?"+L4":"")+" "+c.beh+(c.pa!=="no"?"p":"")]);
    R.tags.push(["ec",({remision:"En remisión",leve:"Actividad leve",moderada:"Actividad moderada",grave:"Actividad grave"})[c.act]]);
    if(c.postop)R.tags.push(["ec","Posquirúrgico"]);
    R.tags.push([ecRisk?"risk":"",ecRisk?"Alto riesgo de progresión":"Bajo riesgo de progresión"]);
  }
  if(!pouch&&c.hist)R.tags.push(["",({naive:"Sin tratamiento previo",falla5asa:"Falla a 5-ASA/budesonida",corticodep:"Corticodependiente",corticorref:"Corticorrefractario",fallaImm:"Falla a inmunomodulador",tnf:"Expuesto a anti-TNF",multi:"Falla a ≥2 mecanismos"})[c.hist]]);
  if(age)R.tags.push([age>=65?"risk":"",age+" años"]);
  if(c.preg!=="no"&&c.sex==="F")R.tags.push(["risk",({deseo:"Deseo de embarazo",embarazo:"Embarazada",lactancia:"Lactancia"})[c.preg]]);

  /* ---------- alertas transversales ---------- */
  if(has("hbsag"))alert("r","HBsAg positivo: iniciar entecavir o tenofovir antes de cualquier inmunosupresión, incluidos corticoides (ECCO 2026).");
  if(has("antihbc"))alert("a","Anti-HBc aislado: ADN-VHB basal; profilaxis si es detectable o con inmunosupresión intensa, si no, ADN y transaminasas c/3 meses.");
  if(has("tbcl"))alert("a","TBC latente: tratar. Anti-TNF y JAK se difieren ≥3–4 semanas; vedolizumab, anti-IL-12/23, anti-IL-23 y S1P pueden iniciarse en paralelo (ECCO 2026).");
  if(has("tbcAct"))alert("r","TBC activa: tratamiento antituberculoso y decisión con infectología; no iniciar anti-TNF ni JAK hasta controlarla.");
  if(has("infAct"))alert("r","Infección activa o absceso sin drenar: tratar o drenar antes de iniciar o escalar la inmunosupresión.");
  if(has("vhbNoInm"))alert("i","No inmune a VHB: vacunar (de preferencia al diagnóstico; con inmunosupresión, esquema de alta dosis o adyuvado y control de anti-HBs).");
  if(has("vzvneg"))alert("a","VVZ no inmune: vacuna de varicela (viva) ≥4 semanas antes de inmunosuprimir; requisito antes de S1P. Luego, vacuna recombinante de zóster.");
  if(c.pend&&c.pend.length)alert("i","Tamizaje pendiente: "+c.pend.join(", ")+". Completar antes de iniciar terapia avanzada (checklist en cada ficha).");
  if(has("vih"))alert("i","VIH: inmunosupresión posible con TAR, carga viral indetectable y CD4 estables; controlar CD4.");
  if(has("vhc"))alert("i","VHC: tratar con antivirales de acción directa; son seguros con inmunosupresores.");
  if(has("endemico"))alert("i","Zona endémica: serología de Strongyloides (o ivermectina empírica) y de Trypanosoma cruzi antes de inmunosuprimir.");
  if(age>=65||has("fragil"))alert("a","Adulto mayor: medir fragilidad (<a href=\"#fragilidad\">calculadora de Fried y escala clínica</a>) y polifarmacia; el riesgo documentado es el subtratamiento. Preferir mecanismos con buen perfil agrupado (vedolizumab, ustekinumab, anti-IL-23).");
  if(c.dz==="cu"&&eim("cep"))alert("i","CEP: ningún fármaco modifica su historia natural. Colonoscopía de vigilancia anual con cromoendoscopía desde el diagnóstico.");
  if(c.sex==="F"&&c.preg==="embarazo")alert("a","Embarazo: la actividad, no el fármaco, determina el riesgo obstétrico. Mantener la terapia eficaz; manejo conjunto con obstetricia.");

  /* ======================= COLITIS ULCEROSA ======================= */
  if(c.dz==="cu"&&!pouch){
    let sev=c.sev;
    const failed=["falla5asa","corticodep","corticorref","fallaImm","tnf","multi"].includes(c.hist);
    if(sev==="moderada"&&(c.cur.includes("mayo3")||cuRiskN>=2)&&!failed){
      alert("a","Moderada con factores de mal pronóstico: tratar como moderada-grave (ACG 2025, KC18).");sev="grave";
    }
    if((sev==="leve"||sev==="moderada")&&["falla5asa","corticodep","corticorref","fallaImm"].includes(c.hist)){sev="grave";alert("i","Falla a terapia convencional: corresponde terapia de CU moderada-grave (ACG KC24).");}
    if((sev==="leve"||sev==="moderada")&&["tnf","multi"].includes(c.hist))sev="grave";

    if(sev==="leve"||sev==="moderada"){
      step("<b>Confirmar actividad</b>: calprotectina basal, descartar C. difficile y enteropatógenos.");
      if(c.ext==="E1"){
        add("mz_sup","pref","Inducción y mantención","Proctitis: 5-ASA rectal ≥1 g/d es de primera línea (ECCO R3, ACG R6); misma vía en mantención (ACG R18)");
        add("mz_ene","alt","Inducción","Enema o espuma si el compromiso llega al rectosigma");
        add("cort_rect","alt","Inducción","Si intolerancia o falla a 5-ASA tópico; 5-ASA rectal es preferible (ECCO R6)");
        add("mz_comb","alt","Inducción y mantención","Si no responde a tópico en 4–6 semanas: agregar mesalazina oral (ECCO R4)",sev==="moderada"?"Supositorio 1 g/noche + oral 2,5–4,5 g/d (5–9 comprimidos de 500 mg) → mantención supositorio 1 g 3 veces/semana ± oral 2 g/d":"Supositorio 1 g/noche + oral 2,5 g/d (5 comprimidos de 500 mg) → mantención supositorio 1 g 3 veces/semana");
      }else{
        const ext2=c.ext==="E2";
        add("mz_comb","pref","Inducción y mantención",ext2?"Oral + rectal supera a oral sola (ECCO R4, ACG R10)":"Oral + rectal supera a oral sola desde proctosigmoiditis en adelante (ECCO R4); la vía rectal controla rápido la urgencia y el sangrado",
          (sev==="moderada"?"Oral 4,5 g/d (9 comprimidos de 500 mg; 4,8 g en guías)":"Oral 2,5 g/d (5 comprimidos de 500 mg; 2,4 g en guías)")+" + enema 1 g/noche (supositorio 1 g si predomina lo rectal) × 8 semanas → mantención oral ≥2 g/d + rectal 1 g 2–3 veces/semana");
        add("mz_or","alt","Inducción y mantención",ext2?"Monoterapia oral si no tolera la vía rectal":(sev==="moderada"?"Monoterapia oral si no tolera la vía rectal; dosis alta en moderada (ASCEND: 4,8 g; en Chile 4,5 g con comprimidos de 500 mg)":"Monoterapia oral si no tolera la vía rectal; dosis estándar basta en leve (ACG R15: 2,4 g; en Chile 2,5 g)"),
          (sev==="moderada"?"4,5 g/d (9 comprimidos de 500 mg; 4,8 g en guías)":"2,5 g/d (5 comprimidos de 500 mg; 2,4 g en guías)")+" × 8 semanas → mantención ≥2 g/d");
        add("bud_mmx","alt","Inducción",ext2?"Si falla o intolerancia a 5-ASA oral + rectal (ACG R11)":"Si no responde a 5-ASA (ACG R16); no superior a 5-ASA como primera opción (ECCO R9)");
        if(ext2)add("cort_rect","alt","Inducción","Alternativa tópica a 5-ASA rectal");
        else add("pred","alt","Inducción","Si falla 5-ASA a 4–8 semanas (ACG R13)");
      }
      add("aza","evit","Inducción","Tiopurina no induce remisión (ECCO R10, ACG R23)");
      step("<b>Reevaluar a las 8 semanas</b> (ACG KC19). Sin remisión con 5-ASA a dosis plena: no cambiar a otra formulación; escalar de clase (ACG R14).");
      R.fail.push("Sin respuesta a 5-ASA oral + rectal a dosis plena → budesonida MMX o prednisona 40 mg.","Corticodependencia o recaída frecuente → terapia avanzada (abre el escenario «Falla a 5-ASA»).");
      if(c.ext==="E1")R.fail.push("Proctitis refractaria: descartar adherencia, proximalización y síndrome de intestino irritable; tacrolimus o beclometasona en supositorio (ACG R7, preparación magistral).");
    }
    else if(sev==="grave"){
      R.tags.push(["risk","Moderada-grave"]);
      step("<b>Descartar C. difficile y CMV</b> si es corticorrefractario o hay deterioro.");
      step("<b>Rectosigmoidoscopía o colonoscopía</b> basal con Mayo endoscópico/UCEIS y calprotectina, para medir la respuesta después.");
      step("<b>Checklist previo al inicio</b> de inmediato (TBC, VHB, vacunas) para no retrasar la terapia avanzada.");
      if(c.ext==="E1")alert("i","La extensión no limita la terapia avanzada: la proctitis moderada-grave accede a lo mismo que la colitis extensa (ACG KC26). Etrasimod tiene datos específicos en proctitis aislada.");
      if(c.hist==="corticorref")add("pred","evit","Puente","Corticorrefractario: no repetir corticoide sistémico");
      else{add("pred","alt","Puente","Puente mientras actúa la terapia avanzada; puede omitirse si se elige un fármaco rápido (ACG KC25d)");}
      if(c.sev==="moderada"&&c.hist==="naive")add("bud_mmx","alt","Puente","Opción no sistémica en actividad moderada (ACG R21)");
      const naive=["naive","falla5asa","corticodep","corticorref","fallaImm"].includes(c.hist);
      if(naive){
        R.tags.push(["","Naïve a terapia avanzada"]);
        [["ifx","Mayor eficacia en naïve (AGA 2024); anti-TNF preferido en CU (ACG KC45)"],["vdz","Mayor eficacia en naïve (AGA); superior a adalimumab (VARSITY; ECCO R24, ACG R45)"],["upa","Mayor eficacia en naïve (AGA); inicio en días"],["rzb","Mayor eficacia en naïve (AGA 2024)"],["gus","Mayor eficacia en naïve (AGA 2024)"],["oza","Mayor eficacia en naïve (AGA 2024); oral"],["etr","Mayor eficacia en naïve (AGA 2024); oral, sin titulación"]].forEach(([id,w])=>add(id,"pref","Inducción y mantención",w));
        [["gol","Eficacia intermedia (AGA 2024)"],["ust","Eficacia intermedia (AGA 2024)"],["tofa","Eficacia intermedia en naïve (AGA 2024); inicio en días"],["miri","Eficacia intermedia (AGA 2024)"],["fil","Eficacia intermedia (AGA 2024)"]].forEach(([id,w])=>add(id,"alt","Inducción y mantención",w));
        add("ada","baja","Inducción y mantención","Menor eficacia relativa en naïve (AGA 2024); inferior a vedolizumab en VARSITY");
        if(c.hist==="corticodep")add("aza","alt","Mantención","Corticodependiente <65 años: mantención con tiopurina es opción (ECCO R14), con efecto a las 12–17 semanas");
        else add("aza","baja","Mantención","Mantención tras inducción con corticoide (ACG R36); no induce remisión");
      }else if(c.hist==="tnf"){
        R.tags.push(["","Post anti-TNF"]);
        [["upa","Mayor eficacia tras anti-TNF (AGA 2024)"],["tofa","Mayor eficacia tras anti-TNF (AGA 2024)"],["ust","Mayor eficacia tras anti-TNF (AGA 2024)"]].forEach(([id,w])=>add(id,"pref","Inducción y mantención",w));
        [["rzb","Eficacia intermedia tras anti-TNF (AGA)"],["gus","Eficacia intermedia tras anti-TNF (AGA)"],["miri","Eficacia intermedia tras anti-TNF (AGA)"],["fil","Eficacia intermedia tras anti-TNF (AGA)"]].forEach(([id,w])=>add(id,"alt","Inducción y mantención",w));
        [["vdz","Menor eficacia tras anti-TNF (AGA 2024)"],["oza","Menor eficacia tras anti-TNF (AGA 2024)"],["etr","Menor eficacia tras anti-TNF (AGA 2024)"]].forEach(([id,w])=>add(id,"baja","Inducción y mantención",w));
        tnfSecond(c,add,["ifx","ada","gol"]);
      }else{
        R.tags.push(["risk","Refractario multimecanismo"]);
        add("upa","pref","Inducción y mantención","Mejor rendimiento relativo en multiexpuestos; reinducción con 45 mg posible");
        add("tofa","alt","Inducción y mantención","Eficaz tras biológicos (OCTAVE)");
        [["rzb","p19 conserva eficacia tras varias fallas"],["gus","p19 conserva eficacia tras varias fallas"],["miri","p19; inducción extendida disponible"],["ust","Si no fue uno de los mecanismos fallidos"]].forEach(([id,w])=>add(id,"alt","Inducción y mantención",w));
        [["vdz","Rinde poco tras múltiples fallas"],["oza","Eficacia reducida en multiexpuestos"],["etr","Eficacia reducida en multiexpuestos"]].forEach(([id,w])=>add(id,"baja","Inducción y mantención",w));
        tnfSecond(c,add,["ifx","ada","gol"]);
        step("<b>Consulta con cirugía</b>: la proctocolectomía es una opción curativa en CU refractaria (ACG KC32, ECCO quirúrgica 2026).");
        step("<b>Descartar factores no inflamatorios</b>: C. difficile, CMV, adherencia, SII superpuesto.");
        step("<b>Ensayo clínico</b> o terapia avanzada combinada en centro experto (ver pestaña En investigación).");
      }
      add("aza","evit","Inducción","Tiopurina o metotrexato en monoterapia no inducen remisión (ECCO R10/R13, ACG R23)");
      if(R.items.some(i=>i.id==="ifx"&&ti(i.tier)<=1))R.combo="cu";
      R.fail.push("Falla primaria (sin respuesta al final de la inducción con nivel adecuado) → cambiar de mecanismo.","Pérdida secundaria con nivel bajo sin anticuerpos → intensificar; con anticuerpos altos → cambio intraclase ± inmunomodulador.","Falla a ≥2 mecanismos → JAK si no se usó, cirugía o ensayo clínico.");
      R.guides.add("jak");if(R.combo)R.guides.add("combo");
    }
    else if(sev==="asuc"){
      R.tags.push(["risk","Hospitalizado"]);
      const a=c.asuc;
      if(a==="ingreso"){
        step("<b>Hospitalizar</b> y calcular Truelove-Witts; hemograma, PCR, albúmina, electrolitos, perfil hepático.");
        step("<b>C. difficile</b> en 2 pasos y coprocultivo; <b>rectosigmoidoscopía sin preparación</b> con biopsias para CMV (IHQ).");
        step("<b>Radiografía de abdomen</b>: colon transverso ≥5,5–6 cm = megacolon tóxico.");
        step("<b>HBPM profiláctica</b> (el sangrado no la contraindica; ACG R47, AGA 2026).");
        step("Suspender AINE, opioides, anticolinérgicos y antidiarreicos. Sin antibióticos de rutina (ACG R48) ni NPT para reposo intestinal (ACG R49).");
        step("<b>Interconsulta precoz a cirugía</b> y tamizaje prebiológico inmediato (TBC, VHB) para no retrasar el rescate.");
        step("<b>Evaluar el día 3</b> con índice de Oxford: >8 deposiciones/día, o 3–8 con PCR >45 mg/L, predice ~85 % de colectomía.");
        add("mpred","pref","Inducción","Primera línea (ECCO R43, ACG R50, AGA 2026)");
        add("hc","alt","Inducción","Equivalente a metilprednisolona");
        add("mz_or","evit","Inducción","Agregar 5-ASA oral no aporta (ECCO R44)");
        add("vdz","evit","Inducción","Inicio lento: no usar como rescate en monoterapia");
        add("oza","evit","Inducción","Sin evidencia en colitis aguda grave");add("etr","evit","Inducción","Sin evidencia en colitis aguda grave");
      }else if(a==="d3resp"){
        step("<b>Pasar a prednisona oral</b> 40 mg/d con retiro en 8 semanas.");
        step("<b>Planificar la mantención antes del alta</b>: tras colitis aguda grave no basta tiopurina sola ni 5-ASA (ECCO PP1).");
        add("pred","pref","Puente","Paso a vía oral al responder");
        [["ifx","Mantención con la mayor evidencia tras colitis grave; LRS no cubre este subgrupo (solo corticorrefractario)"],["vdz","Mantención segura; requiere puente con corticoide por su inicio lento"],["upa","Rápido, permite retirar el corticoide antes"],["rzb","Opción de mayor eficacia en naïve (AGA)"],["gus","Opción de mayor eficacia en naïve (AGA)"]].forEach(([id,w])=>add(id,"pref","Mantención",w));
        [["tofa","Eficacia intermedia en naïve"],["ust","Eficacia intermedia"],["miri","Eficacia intermedia"],["ada","Menor eficacia relativa"],["gol","Eficacia intermedia"]].forEach(([id,w])=>add(id,"alt","Mantención",w));
        add("aza","baja","Mantención","Tiopurina sola no se recomienda tras colitis aguda grave (ECCO PP1)");
        if(["tnf","multi"].includes(c.hist))tnfSecond(c,add,["ifx","ada","gol"]);
        R.guides.add("jak");
      }else if(a==="d3noresp"){
        R.tags.push(["risk","Corticorrefractaria"]);
        step("<b>Decidir rescate hoy</b> (día 3–5); prolongar corticoides más de 7 días no aporta y aumenta complicaciones.");
        step("<b>Cirugía presente en la decisión</b>: colectomía si hay perforación, hemorragia masiva o megacolon tóxico, o si el rescate falla en 5–7 días.");
        step("Antes de infliximab: confirmar TBC y VHB. Antes de ciclosporina: colesterol, Mg, creatinina y PA.");
        const ifxFail=["tnf","multi"].includes(c.hist)&&c.tnff!=="intol";
        add("ifx",ifxFail?"prec":"pref","Rescate",ifxFail?"Falla previa a anti-TNF: preferir ciclosporina o JAK":"Infliximab o ciclosporina, equivalentes en colectomía (CYSIF, CONSTRUCT; ECCO R45, ACG R51). Cubierto por LRS (CU grave corticorrefractaria hospitalizada)","5 mg/kg; albúmina baja o PCR alta: considerar 10 mg/kg o segunda dosis precoz (ECCO R46, PREDICT-UC)");
        add("csa",c.hist==="fallaImm"?"alt":"pref","Rescate",c.hist==="fallaImm"?"Falla previa a tiopurina: sin puente de mantención natural; considerar vedolizumab como mantención (ACG R54)":"Equivalente a infliximab; vida media corta (ventaja si se va a cirugía)");
        add("tofa","alt","Rescate","TACOS (ECA): respuesta 83 % vs 59 %, menos rescate. Guía chilena 2026 R21 (fuerte); ECCO PP2; AGA 2026","10 mg c/8 h (fuera de ficha) o 10 mg c/12 h");
        add("upa","alt","Rescate","Series: sobrevida libre de colectomía a 90 días ~84 %; comparativa 2026 con tofacitinib","45 mg/d");
        add("vdz","evit","Rescate","No como rescate");add("oza","evit","Rescate","Sin evidencia");add("etr","evit","Rescate","Sin evidencia");
        R.fail.push("Sin respuesta al rescate en 5–7 días → colectomía subtotal con ileostomía.","Mantención: tras infliximab → infliximab ± tiopurina (ACG R52); tras ciclosporina → tiopurina (ACG R53) o vedolizumab (ACG R54); tras JAK → el mismo JAK.");
        R.guides.add("asuc");if(!ifxFail)R.combo="cu";
      }else{
        R.tags.push(["risk","Falla al rescate"]);
        step("<b>Colectomía subtotal con ileostomía</b> terminal es la conducta estándar.");
        step("Una tercera línea secuencial (infliximab tras ciclosporina, ciclosporina tras infliximab o JAK) solo en centro experto y tras discusión quirúrgica: evita colectomía en ~53 %, con 26 % de eventos adversos y mortalidad 0,88 % (ECCO R47).");
        add("upa","alt","Tercera línea","JAK tras falla a infliximab o ciclosporina (ECCO R47, centro experto)");
        add("tofa","alt","Tercera línea","Igual que upadacitinib");
        add("csa","alt","Tercera línea","Si el rescate fue infliximab");
        add("ifx","alt","Tercera línea","Si el rescate fue ciclosporina");
        R.guides.add("asuc");
      }
    }
  }

  /* ======================= CROHN ======================= */
  if(c.dz==="ec"){
    const ileal=c.loc==="L1"||c.loc==="L3";
    const lowRisk=!ecRisk&&!c.postop;
    const mild=c.act==="leve"&&lowRisk&&["naive","falla5asa"].includes(c.hist)&&c.hist!=="falla5asa";
    if(c.beh==="B3"&&c.b3==="absceso"){alert("r","Absceso intraabdominal: antibiótico + drenaje percutáneo (>2–3 cm) o quirúrgico. Diferir la inmunosupresión hasta drenar (ACG R35).");}
    if(c.pa==="absceso")alert("r","Absceso perianal: drenaje quirúrgico urgente antes de cualquier terapia avanzada (ACG KC50).");

    if(c.postop){
      const hr=c.ecr.includes("cirugia")||has("tabaco")||c.beh==="B3"||c.pa!=="no";
      R.tags.push([hr?"risk":"",hr?"Alto riesgo de recurrencia":"Bajo riesgo de recurrencia"]);
      step("<b>Dejar de fumar</b>: el tabaquismo duplica la recurrencia.");
      step("<b>Ileocolonoscopía a los 6–12 meses</b> con <a href=\"#scores\">Rutgeerts modificado</a> (ACG R30); agendarla antes del alta. Calprotectina c/3–6 meses (&lt;100 µg/g a los 3–6 meses ayuda a descartar).");
      if(hr){
        const tnfF=["tnf","multi"].includes(c.hist)&&c.tnff!=="intol"&&c.tnff!=="inmuno";
        add("ifx",tnfF?"baja":"pref","Prevención posquirúrgica",tnfF?"Falló anti-TNF antes de la cirugía":"Anti-TNF dentro de 4 semanas en alto riesgo (PREVENT: recurrencia endoscópica 30,6 % vs 60 %; ACG R33)");
        add("ada",tnfF?"baja":"pref","Prevención posquirúrgica",tnfF?"Falló anti-TNF antes de la cirugía":"Alternativa SC (POCER, ACG R33)");
        add("vdz",tnfF?"pref":"alt","Prevención posquirúrgica","REPREVIO: recurrencia endoscópica i2b+ 23 % vs 77 % (ACG R34); opción tras falla a anti-TNF");
        add("ust","alt","Prevención posquirúrgica","Datos observacionales; útil tras falla a anti-TNF");
        add("metro","alt","Prevención posquirúrgica","1–2 g/d × 3 meses (ACG R32); tolerancia limitada");
        add("aza","baja","Prevención posquirúrgica","Eficacia modesta; a veces combinada con metronidazol");
      }else{
        step("<b>Bajo riesgo</b>: observación y colonoscopía a los 6–12 meses; tratar si Rutgeerts ≥ i2b (ACG R31).");
        add("metro","alt","Prevención posquirúrgica","Opción en bajo riesgo (3 meses)");
        add("aza","baja","Prevención posquirúrgica","Si se quiere profilaxis en bajo riesgo");
      }
      R.fail.push("Rutgeerts ≥ i2b → iniciar o escalar terapia avanzada (anti-TNF, vedolizumab, ustekinumab).");
    }

    if(c.act!=="remision"){
      if(mild){
        step("<b>Bajo riesgo y actividad leve</b>: tratamiento de inducción sin mantención obligatoria; monitorizar con calprotectina, PCR e imagen (ACG KC39).");
        if(ileal){
          add("bud_cir","pref","Inducción","EC ileocecal leve a moderada: 9 mg/d × 8 semanas (ACG R5); retiro en 2–4 semanas");
          add("pred","alt","Inducción","Si no responde a budesonida o si la actividad es moderada");
        }else{
          add("ssz","pref","Inducción","Solo en EC colónica leve sintomática (ACG KC40)");
          add("pred","alt","Inducción","40 mg/d con retiro en 8 semanas");
        }
        add("bud_cir","evit","Mantención","No mantiene la remisión (ACG R6)");
        add("mz_or","evit","Inducción","Mesalazina oral no es eficaz en EC (ACG R4 fuerte en contra; Guía chilena 2026)");
        step("<b>Reevaluar a las 8 semanas</b>: síntomas, PCR y calprotectina; recaída antes de 3 meses o dependencia → terapia avanzada.");
        if(age>=65)alert("i","≥65 años: preferir budesonida sobre corticoide sistémico (menos fracturas, delirio e hiperglicemia; GETECCU 2025).");
        R.fail.push("Sin respuesta a budesonida en 8 semanas, recaída precoz o corticodependencia → terapia avanzada según línea y perfil.","En ≥65 años o con comorbilidad: preferir vedolizumab, ustekinumab o anti-IL-23; evitar iniciar tiopurina y JAK.");
      }else{
        const grave=c.act==="grave";
        if(grave){
          step("<b>Hospitalizar si HBI &gt;16 o sistémico</b>: TC o RM con contraste para descartar absceso u obstrucción; C. difficile.");
          step("<b>HBPM profiláctica</b> y soporte nutricional.");
          add("mpred","pref","Puente","EC grave hospitalizada tras descartar absceso (ACG KC47)");
        }else{
          add("pred","alt","Puente","Opcional mientras actúa la terapia avanzada (AGA R15)");
          if(ileal&&c.act==="moderada"&&!grave)add("bud_cir","alt","Puente","Ileocecal moderada: puente no sistémico");
        }
        step("<b>Terapia avanzada precoz</b> (AGA R15; ACG R3: no exige falla a terapia convencional).");
        step("<b>Imagen basal</b> (enteroRM o ecografía intestinal) e ileocolonoscopía con SES-CD para tener con qué medir la respuesta.");
        const naive=["naive","falla5asa","corticodep","corticorref","fallaImm"].includes(c.hist);
        if(naive){
          R.tags.push(["","Naïve a terapia avanzada"]);
          [["ifx","Mayor eficacia en naïve (AGA 2025); el más estudiado en enfermedad grave y penetrante"],["ada","Mayor eficacia en naïve (AGA 2025)"],["rzb","Mayor eficacia en naïve (AGA 2025)"],["gus","Mayor eficacia en naïve (AGA 2025)"],["ust","Mayor eficacia en naïve (AGA 2025); equivalente a adalimumab (SEAVUE)"],["miri","Mayor eficacia en naïve (AGA 2025)"],["vdz","Mayor eficacia en naïve (AGA 2025), inicio lento (hasta 14 semanas)"]].forEach(([id,w])=>add(id,"pref","Inducción y mantención",w));
          add("upa","baja","Inducción y mantención","Menor eficacia relativa en naïve según AGA 2025; FDA y ACG lo posicionan tras anti-TNF");
          add("czp","baja","Inducción y mantención","Menor eficacia relativa (AGA 2025)");
          if(!ecRisk){add("aza","alt","Mantención","Mantención tras inducción con corticoides en bajo riesgo (AGA R6, ACG R9)");add("mtx","alt","Mantención","SC/IM 25 → 15 mg/semana (AGA R7, ACG R11)");}
          else{add("aza","baja","Mantención","En alto riesgo, la monoterapia con inmunomodulador queda corta");}
        }else if(c.hist==="tnf"){
          R.tags.push(["","Post anti-TNF"]);
          [["rzb","Mayor eficacia tras anti-TNF (AGA); superior a ustekinumab (SEQUENCE; ACG R19)"],["gus","Mayor eficacia tras anti-TNF (AGA 2025)"],["upa","Mayor eficacia tras anti-TNF (AGA; ACG R23)"]].forEach(([id,w])=>add(id,"pref","Inducción y mantención",w));
          [["ust","Eficacia intermedia tras anti-TNF (AGA)"],["miri","Eficacia intermedia tras anti-TNF (AGA)"]].forEach(([id,w])=>add(id,"alt","Inducción y mantención",w));
          [["vdz","Menor eficacia tras anti-TNF (AGA)"],["czp","Menor eficacia (AGA)"]].forEach(([id,w])=>add(id,"baja","Inducción y mantención",w));
          tnfSecond(c,add,["ada","ifx"]);
        }else{
          R.tags.push(["risk","Refractario multimecanismo"]);
          [["upa","Eficaz con independencia de la exposición previa a biológicos"],["rzb","p19 con eficacia tras múltiples fallas (MOTIVATE)"],["gus","p19 con eficacia tras múltiples fallas"]].forEach(([id,w])=>add(id,"pref","Inducción y mantención",w));
          [["miri","Opción p19"],["ust","Si no fue uno de los fallidos"]].forEach(([id,w])=>add(id,"alt","Inducción y mantención",w));
          [["vdz","Rinde poco tras múltiples fallas"]].forEach(([id,w])=>add(id,"baja","Inducción y mantención",w));
          tnfSecond(c,add,["ada","ifx"]);
          step("<b>Cirugía</b>: resección ileocecal en enfermedad localizada es una alternativa real (LIR!C).");
          step("<b>Terapia avanzada combinada</b> (p. ej. vedolizumab + anti-TNF, anti-IL-23 + JAK) en centro experto, o ensayo clínico.");
        }
        add("mz_or","evit","Inducción","Sin eficacia en EC (ACG R4)");
        add("aza","evit","Inducción","Tiopurina no induce remisión (ACG R8, AGA R5)");
        if(c.loc==="L1"&&c.beh==="B1"&&!grave)step("<b>EC ileal localizada</b>: la resección ileocecal laparoscópica es alternativa a la terapia avanzada (LIR!C), sobre todo con enfermedad corta.");
        if(c.l4)step("<b>Compromiso alto (L4)</b>: IBP asociado; los anti-TNF tienen la mayor experiencia; la estenosis duodenal puede requerir dilatación.");
        if(R.items.some(i=>i.id==="ifx"&&ti(i.tier)<=1))R.combo="ec";
        R.fail.push("Falla primaria con nivel adecuado → cambiar de mecanismo (AGA: segundo anti-TNF solo si la falla fue inmunogénica o por intolerancia).","Pérdida de respuesta → TDM reactivo e intensificación antes de cambiar.","Falla a ≥2 mecanismos → JAK o anti-IL-23 si no se usaron, cirugía o terapia combinada avanzada.");
        R.guides.add("jak");if(R.items.some(i=>i.id==="vdz"))R.guides.add("vdzec");if(R.combo)R.guides.add("combo");
      }
    }

    /* fenotipo estenosante */
    if(c.beh==="B2"){
      step("<b>Caracterizar la estenosis</b>: enteroRM o ecografía intestinal y colonoscopía con biopsias (descartar neoplasia, sobre todo en colon).");
      if(c.b2==="inflamatoria"||c.b2==="mixta"){
        step("<b>Componente inflamatorio</b>: terapia avanzada; anti-TNF con la mejor evidencia (CREOLE: adalimumab).");
        ["ada","ifx"].forEach(id=>{const it=R.items.find(x=>x.id===id&&x.ph==="Inducción y mantención");if(it&&ti(it.tier)>0&&ti(it.tier)<3){it.tier="pref";it.why.push({c:"p",t:"Estenosis inflamatoria: CREOLE"})}});
      }
      if(c.b2==="fibrotica"||c.b2==="mixta"){
        if(c.b2l==="corta")step("<b>Estenosis fibrótica corta (≤5 cm) y accesible</b>: dilatación endoscópica con balón (18–20 mm); repetible. Sin fístula ni absceso asociados.");
        else step("<b>Estenosis larga, múltiple o con fístula</b>: cirugía (resección o estricturoplastía).");
        step("Sin terapia médica antifibrótica aprobada; los anti-TL1A se estudian con ese objetivo.");
      }
      step("Dieta baja en residuos durante los síntomas obstructivos; optimizar nutrición antes de cirugía.");
    }
    if(c.beh==="B3"){
      if(c.b3==="absceso")step("<b>Absceso</b>: antibiótico + drenaje; iniciar anti-TNF una vez controlada la sepsis; considerar resección electiva.");
      else step("<b>Fístula interna</b>: anti-TNF es la opción con más evidencia; definir con cirugía si requiere resección.");
      ["ifx","ada"].forEach(id=>{const it=R.items.find(x=>x.id===id&&x.ph==="Inducción y mantención");if(it&&ti(it.tier)>0&&ti(it.tier)<3){it.tier="pref";it.why.push({c:"p",t:"Fenotipo penetrante: anti-TNF con mayor evidencia"})}});
    }

    /* perianal */
    if(c.pa!=="no"){
      R.guides.add("combo");
      step("<b>RM de pelvis</b> (clasificación de Parks, MAGNIFI-CD/Van Assche) y evaluación por coloproctología.");
      if(c.pa==="simple"){
        step("<b>Fístula simple</b>: asintomática y sin actividad luminal puede observarse; si es baja con recto sano, la fistulotomía es opción (coloproctología). Clasificar con <a href=\"#scores\">TOpClass</a>.");
        add("ifx","pref","Perianal","Fístula simple sintomática o persistente: anti-TNF es la única clase con ECA de cierre fistuloso (ACCENT II)","5 mg/kg sem 0-2-6; objetivo valle ≥10 µg/mL");
        add("ada","alt","Perianal","Anti-TNF SC (CHARM subanálisis)");
        add("cipro","alt","Perianal","Control sintomático: mejora el drenaje, pero el cierre es pobre y recae al suspender (Thia 2009: remisión 30 % vs 12,5 % placebo, n = 25, p = 0,41). Mejor tolerado que metronidazol","500 mg c/12 h × 4–8 semanas");
        add("metro","alt","Perianal","Control sintomático; peor tolerancia (abandono 71 % en Thia 2009, neuropatía en uso prolongado)","500 mg c/12 h × 4–8 semanas");
      }else{
        step("<b>Examen bajo anestesia</b> con drenaje y setón laxo antes de la terapia avanzada (ACG KC50). Definir el objetivo con <a href=\"#scores\">TOpClass</a> (2a cierre, 2b control de síntomas, 2c-3 desfuncionalización o proctectomía).");
        step("Retirar el setón tras la inducción; cirugía reparadora (colgajo de avance, LIFT) solo con recto sin actividad. Refractario: desfuncionalización o proctectomía.");
        const tnfF=["tnf","multi"].includes(c.hist)&&(c.tnff==="primaria"||c.tnff==="farmaco");
        add("ifx",tnfF?"baja":"pref","Perianal",tnfF?"Falla de mecanismo a anti-TNF":"Única clase con ECA de cierre fistuloso (ACCENT II; ACG R24). Cubierto por LRS (EC fístula perianal compleja)","5 mg/kg sem 0-2-6; objetivo valle ≥10 µg/mL");
        add("ada",tnfF?"baja":"alt","Perianal","ACG R25 (condicional); CHARM subanálisis");
        add("metro","alt","Perianal","Antibiótico + anti-TNF mejora la respuesta (ACG R26, ADAFI)");
        add("cipro","alt","Perianal","Antibiótico + anti-TNF (ADAFI)");
        add("ust",tnfF?"alt":"baja","Perianal","ACG R28 (condicional, evidencia muy baja)");
        add("upa",tnfF?"alt":"baja","Perianal","Análisis post hoc de 3 ECA (ACG R29)");
        add("rzb","baja","Perianal","Datos limitados");add("gus","baja","Perianal","Datos limitados");
        add("vdz","baja","Perianal","ACG R27 (condicional, evidencia muy baja); no como monoterapia inicial");
        if(!tnfF)R.combo="ec";
        alert("i","Infliximab SC no se cubre por LRS con enfermedad perianal.");
        R.fail.push("Fístula compleja sin cierre con infliximab optimizado (valle ≥10–20 µg/mL) → ustekinumab, upadacitinib o anti-IL-23; reevaluar cirugía.");
      }
    }
  }

  /* ======================= RESERVORIO ILEAL ======================= */
  if(pouch){
    const P=c.pch, ph="Reservorio";
    step("<b>Confirmar inflamación</b>: endoscopía del reservorio con biopsias (asa aferente, cuerpo, cuff) y PDAI/mPDAI (<a href=\"#scores\">pestaña Scores</a>). Los síntomas solos no distinguen pouchitis de reservorio irritable, cuffitis o estenosis.");
    step("<b>Descartar causas secundarias</b>: <i>C. difficile</i>, CMV en refractarios, AINE, isquemia, estenosis de la anastomosis o del asa aferente; fístula o absceso con RM pélvica si hay dolor perineal o supuración.");
    if(P==="int"||P==="rec"){
      add("cipro","pref",ph,"Primera línea en pouchitis aguda (AGA 2024; respuesta agrupada ~65 %). Mayor descenso del PDAI y mejor tolerado que metronidazol (Shen 2001)","500 mg c/12 h × 2 semanas");
      add("metro","alt",ph,"Eficacia similar, peor tolerancia (náuseas, disgeusia, neuropatía)","15–20 mg/kg/d (≈500 mg c/8–12 h) × 2 semanas");
      step("Respuesta esperable en días. Sin respuesta a 2–4 semanas: reevaluar el diagnóstico y tratar como refractaria.");
      step("<b>Sin profilaxis antibiótica primaria</b> (AGA 2024, en contra); probióticos en prevención primaria: sin recomendación.");
      if(P==="rec")add("prob","pref",ph,"Prevención secundaria tras inducir remisión con antibiótico (AGA 2024, condicional; formulación De Simone). La experiencia real rinde menos que los ECA","1 sobre (450–900 × 10⁹ UFC) c/12 h, continuo");
      R.fail.push("≥3 episodios/año o recaída al suspender el antibiótico → pouchitis crónica dependiente de antibióticos.");
      R.fail.push("Sin respuesta a 4 semanas de antibiótico → crónica refractaria: biopsia, CMV y terapia avanzada.");
    }
    if(P==="cadp"){
      add("cipro","pref",ph,"Antibiótico crónico a la menor dosis eficaz o en ciclos rotativos (AGA 2024; basado en experiencia)","250–500 mg/d continuo o ciclos de 2 semanas rotando con metronidazol");
      add("metro","alt",ph,"Para rotar; limitar la exposición prolongada por neuropatía","250 mg c/8–12 h en ciclos");
      add("vdz","pref",ph,"Terapia avanzada sugerida (AGA 2024). EARNEST: remisión mPDAI sem 14 31 % vs 10 % (dif. 21 pp; IC95 % 5–38). Aprobado por EMA en pouchitis crónica","300 mg EV sem 0-2-6 + ciprofloxacino sem 1–4 → c/8 semanas");
      add("ifx","alt",ph,"Cohortes (AGA 2024, sugerido); puede reutilizarse si respondía antes de la colectomía","5 mg/kg sem 0-2-6 → c/8 semanas");
      add("ada","alt",ph,"Cohortes; resultados menores que infliximab","160/80 mg → 40 mg c/2 semanas");
      add("ust","alt",ph,"Cohortes y series","EV según peso → 90 mg SC c/8 semanas");
      add("prob","alt",ph,"Mantención tras remisión si se logra suspender el antibiótico","1 sobre c/12 h");
      R.fail.push("Necesidad de antibiótico continuo o intolerancia → terapia avanzada (vedolizumab primero).");
    }
    if(P==="carp"){
      add("vdz","pref",ph,"Único ECA en pouchitis crónica (EARNEST: remisión mPDAI sem 14 31 % vs 10 %; respuesta sem 34 dif. 22 pp); AGA 2024 sugerido","300 mg EV sem 0-2-6 + ciprofloxacino sem 1–4 → c/8 semanas");
      add("bud_cir","pref","Puente","Budesonida de liberación ileal (AGA 2024, sugerido; Gionchetti 2007: remisión 75 %, n = 20, abierto). Limitar a 8–12 semanas","9 mg/d × 8 semanas");
      add("ifx","alt",ph,"Cohortes; respuesta agrupada moderada (AGA 2024)","5 mg/kg sem 0-2-6 → c/8 semanas");
      add("ust","alt",ph,"Cohortes y series","EV según peso → 90 mg SC c/8 semanas");
      add("ada","alt",ph,"Cohortes","160/80 mg → 40 mg c/2 semanas");
      add("upa","baja",ph,"Series pequeñas","45 mg × 8 sem → 15–30 mg");
      add("cipro","alt","Puente","Antibiótico combinado × 4 semanas mientras actúa la terapia avanzada","Ciprofloxacino 500 mg c/12 h + metronidazol 500 mg c/12 h (o tinidazol/rifaximina) × 4 semanas");
      step("<b>Biopsias con CMV</b> y revisar diagnóstico alternativo (tipo Crohn, isquemia, autoinmune/IgG4, CEP asociada) antes de escalar.");
      R.fail.push("Falla a dos terapias avanzadas → derivar a centro de referencia; considerar desfuncionalización o escisión del reservorio.");
    }
    if(P==="cldp"){
      step("<b>Caracterizar el fenotipo</b>: fístula >12 meses tras el cierre de la ileostomía, estenosis del cuerpo o del asa aferente, o ileítis prereservorio. RM pélvica y evaluación por coloproctología; examen bajo anestesia si hay absceso.");
      add("bud_cir","pref","Puente","Recomendado en enfermedad tipo Crohn del reservorio (AGA 2024, experiencia y datos indirectos); limitar a 8–12 semanas","9 mg/d × 8 semanas");
      add("ifx","pref",ph,"Terapia avanzada sugerida (AGA 2024; respuesta agrupada 74 %). Anti-TNF es el más estudiado; de elección si hay fístula","5 mg/kg sem 0-2-6 → c/8 semanas; valle ≥10 µg/mL si fistulizante");
      add("ada","alt",ph,"Anti-TNF SC; cohortes","160/80 mg → 40 mg c/2 semanas");
      add("vdz","alt",ph,"Cohortes; útil en ileítis prereservorio","300 mg EV sem 0-2-6 → c/8 semanas");
      add("ust","alt",ph,"Cohortes, incluso tras anti-TNF","EV según peso → 90 mg SC c/8 semanas");
      add("rzb","baja",ph,"Series","—");
      R.fail.push("Estenosis fibrótica → dilatación endoscópica; fístula compleja refractaria → manejo quirúrgico (setón, desfuncionalización).");
    }
    if(P==="cuff"){
      add("mz_sup","pref",ph,"Terapia tópica de primera línea, extrapolada de CU (AGA 2024)","500 mg c/12 h o 1 g/noche × 4 semanas");
      add("cort_rect","alt",ph,"Alternativa tópica o si no responde a mesalazina","Budesonida espuma 2 mg/d × 4 semanas");
      add("vdz","baja",ph,"Refractaria: terapia avanzada como en CU (AGA 2024)","Esquema de CU");
      add("ifx","baja",ph,"Refractaria: terapia avanzada como en CU","Esquema de CU");
      step("Si no responde: descartar cuffitis tipo Crohn y reservorio irritable; biopsias del cuff.");
      R.fail.push("Cuffitis refractaria a tópicos → terapia avanzada según el algoritmo de CU.");
    }
  }

  /* MEI que exigen tratamiento propio en un escenario sin terapia avanzada (leve / bajo riesgo) */
  {
    const ADV=["tnf","int","p40","p19","jak","s1p"];
    const sysE=["axial","artper","uveitis","pg","psoriasis","aps","hs"].filter(eim);
    const MEIN={axial:"espondiloartritis axial",artper:"artritis periférica tipo 2",uveitis:"uveítis",pg:"pioderma gangrenoso",psoriasis:"psoriasis",aps:"artritis psoriásica",hs:"hidradenitis supurativa"};
    const hasAdv=R.items.some(i=>ADV.includes(D[i.id].cl)&&ti(i.tier)<=1);
    if(!pouch&&sysE.length&&!hasAdv){
      const tx=sysE.map(k=>MEIN[k]).join(", ");
      step(`<b>Manifestación extraintestinal con curso propio</b> (${tx}): justifica terapia avanzada aunque la actividad luminal sea leve; elegir un fármaco que trate la EII y la MEI, con reumatología, oftalmología o dermatología (ECCO MEI 2024).`);
      const cand=c.dz==="cu"?["ifx","ada","gol","ust","rzb","gus","upa","tofa"]:["ifx","ada","ust","rzb","gus","upa"];
      cand.forEach(id=>add(id,"alt","Inducción y mantención",`Por MEI (${tx})`));
      R.fail.push("La MEI sigue activa con la EII en remisión → cambiar a un mecanismo con eficacia demostrada en esa MEI (ver motivos en cada fármaco).");
    }
    if((eim("art1")||eim("en"))&&!sysE.length)step("<b>Artritis periférica tipo 1 y eritema nodoso</b> siguen la actividad intestinal: tratar la EII; si hace falta, AINE por pocos días (con precaución) o corticoide. No obligan por sí solos a escalar (ECCO MEI 2024).");
  }

  /* fusionar inducción + mantención del mismo fármaco y nivel */
  R.items.filter(i=>i.ph==="Inducción").forEach(ind=>{
    const m=R.items.find(i=>i.id===ind.id&&i.ph==="Mantención"&&i.tier===ind.tier);
    if(m){ind.ph="Inducción y mantención";ind.why=ind.why.concat(m.why);R.items.splice(R.items.indexOf(m),1)}
  });
  /* fusionar luminal + perianal: manda el tier perianal */
  R.items.filter(i=>i.ph==="Perianal").forEach(p=>{
    const l=R.items.find(i=>i.id===p.id&&i.ph==="Inducción y mantención");
    if(l){p.ph="Luminal y perianal";p.why=p.why.concat(l.why);if(!p.dose)p.dose=null;R.items.splice(R.items.indexOf(l),1)}
  });

  /* ======================= MODIFICADORES ======================= */
  const pos=(it,t)=>it.why.push({c:"p",t}), warn=(it,t)=>it.why.push({c:"w",t});
  const down=(it,tier,t,ci)=>{if(ti(tier)>ti(it.tier))it.tier=tier;it.why.push({c:tier==="evit"?"x":"w",t,ci:!!ci})};
  const up=(it,t)=>{if(it.tier==="alt")it.tier="pref";else if(it.tier==="baja")it.tier="alt";it.why.push({c:"p",t})};
  const cvRisk=["tabaco","hta","dm","dlp"].filter(has).length;
  R.items.forEach(it=>{
    const d=D[it.id];if(!d)return;const k=d.cl,id=it.id;
    const isJ=k==="jak",isS=k==="s1p",isT=k==="tnf",isTio=id==="aza"||id==="mp",safe=["int","p40","p19"].includes(k);
    // edad
    if(age>=65){
      if(isJ)down(it,"prec","≥65 años: usar solo si no hay alternativa adecuada (EMA 2023); upadacitinib 15 mg en mantención");
      if(isTio)down(it,"prec","≥65 años: tiopurina solo en <65 (ECCO R14); ↑ linfoma y cáncer de piel no melanoma");
      if(id==="mtx")down(it,"prec","Adulto mayor: evitar metotrexato (ACTECCU 2026)");
      if(isS)down(it,"prec","Adulto mayor: S1P con precaución (bradicardia, edema macular; ACTECCU 2026)");
      if(isT){
        if(it.tier==="pref"&&!/perianal|rescate/i.test(it.ph))down(it,"alt","≥65 años: ↑ infecciones graves y la tiopurina asociada no se recomienda (linfoma, cáncer de piel no melanoma); sin ella aumenta la inmunogenicidad. Si se elige: monoterapia con TDM proactivo");
        else warn(it,"≥65 años: ↑ infecciones graves; evitar tiopurina asociada y usar TDM proactivo");
      }
      if(safe&&it.tier!=="evit")up(it,"Perfil de seguridad favorable en adulto mayor");
      if(id==="pred"||id==="mpred")warn(it,"Adulto mayor: minimizar dosis y duración del corticoide");
    }else if(age>=50&&cvRisk>0&&isJ)warn(it,"≥50 años con factor de riesgo CV: población de ORAL Surveillance; discutir riesgo");
    // vedolizumab en Crohn: inicio lento
    if(id==="vdz"&&c.dz==="ec"&&/Inducción|Luminal/.test(it.ph)){
      if(c.act==="grave")down(it,"alt","Crohn grave: el inicio lento (10–14 semanas) no controla a tiempo; preferir anti-TNF, ustekinumab, anti-IL-23 o upadacitinib según el perfil");
      else warn(it,"Inicio lento en EC (10–14 semanas; GEMINI 2: remisión sem 6 14,5 % vs 6,8 %): requiere puente corticoide. Si se necesita control más rápido, preferir ustekinumab o anti-IL-23 (2–4 semanas)");
      if((age>=65||has("fragil"))&&["corticodep","corticorref"].includes(c.hist))warn(it,"Adulto mayor corticodependiente: el puente corticoide prolongado erosiona la ventaja de seguridad; ustekinumab o anti-IL-23 logran el mismo perfil con inicio más rápido");
    }
    // cardiovascular
    if(isJ){
      if(has("cvd"))down(it,"evit","Enfermedad cardiovascular establecida: riesgo de MACE (ORAL Surveillance; EMA)");
      if(has("tev"))down(it,"evit","TEV previo: riesgo trombótico con JAK");
      if(has("tabaco"))down(it,"prec","Tabaquismo: solo si no hay alternativa (EMA 2023)");
      if(has("dlp"))warn(it,"Dislipidemia: el JAK eleva LDL; perfil lipídico a las 8–12 semanas y estatina si corresponde");
      if((has("hta")||has("dm"))&&!has("cvd"))warn(it,"HTA/diabetes suman riesgo CV: evaluar SCORE2");
      if(has("zoster"))down(it,"prec","Herpes zóster previo: riesgo dosis-dependiente; vacuna recombinante antes");
      if(has("neoActiva")||has("neo5"))down(it,"evit","Neoplasia reciente o activa: JAK restringido (EMA)");
      if(has("linfoma"))down(it,"evit","Linfoma previo");
      if(has("cpnm")||has("melanoma"))down(it,"prec","Antecedente de cáncer de piel: vigilancia dermatológica");
      if(has("erc")&&id==="tofa")warn(it,"ERC: reducir a 5 mg c/12 h si TFG <30");
      if(has("erc")&&id==="fil")warn(it,"ERC: 100 mg/d");
      if(has("hepato"))down(it,"prec","Hepatopatía: evitar en daño hepático grave");
      if(has("infRec")||has("fragil"))down(it,"prec","Fragilidad o infecciones graves: ↑ infecciones serias");
      if(has("oral"))pos(it,"Vía oral");
    }
    if(isS){
      if(has("bradi"))down(it,"evit","Bradiarritmia, BAV 2°–3° sin marcapasos o QTc largo (ficha técnica de ozanimod y etrasimod)",1);
      if(has("cvd"))down(it,"prec","IAM, ACV o angina en los últimos 6 meses: contraindicado; fuera de ese plazo, precaución");
      if(has("icc34"))down(it,"evit","ICC descompensada");
      if(has("ojo"))down(it,"prec","Edema macular o retinopatía: riesgo de edema macular; fondo de ojo basal y a 3–4 meses");
      if(has("dm"))warn(it,"Diabetes: fondo de ojo basal");
      if(has("hta"))warn(it,"Puede elevar la presión arterial");
      if(has("neoActiva")||has("neo5"))down(it,"prec","Neoplasia reciente: datos limitados");
      if(has("cpnm")||has("melanoma"))down(it,"prec","Cáncer de piel previo: vigilancia dermatológica (S1P)");
      if(has("hepato"))warn(it,"Perfil hepático: alza de transaminasas descrita");
      if(has("oral"))pos(it,"Vía oral");
      if(has("desmiel"))pos(it,"Los S1P se usan en esclerosis múltiple");
    }
    if(has("tbcAct")){if(isT||isJ)down(it,"evit","TBC activa: no iniciar hasta completar el tratamiento inicial (ECCO infecciones 2026)",1);else if(["int","p40","p19","s1p","imm","cni"].includes(k)||id==="pred"||id==="mpred")down(it,"prec","TBC activa: coordinar con infectología")}
    if(has("infAct")&&["tnf","jak","int","p40","p19","s1p","imm","cni"].includes(k))warn(it,"Infección activa: diferir el inicio hasta controlarla");
    if(isS&&has("vzvneg"))down(it,"prec","VVZ no inmune: vacunar y esperar 4 semanas antes de iniciar");
    if(isT){
      if(has("icc34"))down(it,"evit","Insuficiencia cardíaca NYHA III–IV: empeoramiento y mortalidad con anti-TNF (ATTACH)",1);
      if(has("icc12"))down(it,"prec","ICC NYHA I–II: ecocardiograma; evitar dosis altas de infliximab");
      if(has("desmiel"))down(it,"evit","Enfermedad desmielinizante (esclerosis múltiple, neuritis óptica): anti-TNF puede desencadenarla o agravarla",1);
      if(has("lupus"))down(it,"prec","Lupus o ANA alto: riesgo de lupus inducido");
      if(has("neoActiva"))down(it,"prec","Neoplasia activa: decisión con oncología");
      else if(has("neo5"))warn(it,"Neoplasia <5 años: datos tranquilizadores, decidir con oncología");
      if(has("linfoma"))down(it,"prec","Linfoma previo: evitar sobre todo combinado con tiopurina");
      if(has("melanoma"))down(it,"prec","Melanoma previo: ↑ riesgo de melanoma con anti-TNF");
      if(has("infRec")||has("fragil"))down(it,"prec","Fragilidad o infecciones graves recurrentes: ↑ infección grave");
      if(has("obeso"))warn(it,"IMC alto o albúmina baja: mayor aclaramiento; TDM precoz e intensificación");
    }
    if(isTio){
      if(c.tpmt==="baja")down(it,"evit","TPMT/NUDT15 sin actividad (homocigoto): mielotoxicidad grave. Con actividad intermedia: 30–50 % de la dosis y hemograma estrecho",1);
      else if(c.tpmt==="intermedia")warn(it,"TPMT intermedia: iniciar con 50 % de la dosis");
      else if(c.tpmt==="nd")warn(it,"Medir TPMT y NUDT15 antes de iniciar (ACG R10)");
      if(has("ebvneg"))down(it,"prec","VEB IgG negativo: riesgo de linfoproliferación y HLH, sobre todo en hombres jóvenes");
      if(has("neoActiva")||has("neo5"))down(it,"evit","Neoplasia reciente: evitar tiopurinas (ACTECCU 2026)");
      if(has("linfoma"))down(it,"evit","Linfoma previo");
      if(has("cpnm"))down(it,"evit","Cáncer de piel no melanoma: riesgo persistente con tiopurinas");
      if(has("melanoma"))down(it,"prec","Melanoma previo");
      if(has("hepato"))warn(it,"Hepatopatía: vigilar transaminasas y 6-MMP");
      if(has("fragil"))down(it,"prec","Fragilidad: mielotoxicidad e infecciones");
    }
    if(id==="mtx"){
      if(has("erc"))down(it,"prec","ERC: ajustar dosis; contraindicado si TFG <30");
      if(has("hepato"))down(it,"evit","Hepatopatía o alcohol: hepatotoxicidad");
      if(has("neoActiva")||has("neo5"))down(it,"prec","Neoplasia reciente (ACTECCU 2026)");
    }
    if(id==="csa"){
      if(has("erc"))down(it,"prec","ERC: nefrotoxicidad");
      if(has("hta"))warn(it,"HTA: la ciclosporina la agrava");
      if(age>=65)warn(it,"Adulto mayor: mayor toxicidad renal e infecciosa");
    }
    if(safe){
      if((has("neoActiva")||has("neo5")||has("linfoma"))&&it.tier!=="evit")up(it,"Antecedente oncológico: clase con menor señal de riesgo");
      if((has("infRec")||has("fragil"))&&it.tier!=="evit"&&age<65)up(it,"Riesgo infeccioso alto: perfil de seguridad favorable (ACG KC46)");
      if((has("cvd")||has("tev"))&&it.tier!=="evit")pos(it,"Sin señal cardiovascular ni trombótica");
    }
    if(k==="asa"&&has("erc"))warn(it,"ERC: creatinina basal y periódica (nefritis intersticial)");
    // embarazo
    if(c.sex==="F"&&c.preg!=="no"){
      const p=c.preg;
      if(isJ)down(it,"evit",p==="lactancia"?"Lactancia: evitar JAK":"Embarazo o deseo: suspender ≥4 semanas antes de concebir; usar solo sin alternativa");
      if(isS)down(it,"evit",p==="lactancia"?"Lactancia: evitar S1P":p==="embarazo"?"Teratogénico: no usar en el embarazo":"Teratogénico: lavado antes de concebir (ozanimod 3 meses, etrasimod 1–2 semanas)",p==="embarazo");
      if(id==="mtx")down(it,"evit",p==="deseo"?"Teratogénico y abortivo: suspender 3–6 meses antes de concebir":p==="lactancia"?"Se excreta en la leche: no usar en lactancia":"Teratogénico y abortivo: no usar en el embarazo",p!=="deseo");
      if(isTio&&p==="embarazo")warn(it,"No iniciar durante el embarazo; continuar si ya estaba en uso");
      if((isT||k==="int"||k==="p40")&&it.tier!=="evit"){up(it,p==="lactancia"?"Compatible con lactancia":"Datos de seguridad en embarazo (PIANO)");if(isT&&p==="embarazo")warn(it,"Exposición en 3er trimestre: diferir vacunas vivas del lactante hasta los 6 meses")}
      if(k==="p19")warn(it,"Datos limitados en embarazo: continuar si ya en uso, decisión individual");
      if(id==="czp"&&p!=="lactancia")pos(it,"Transferencia placentaria mínima");
      if(id==="cipro")down(it,"evit","Evitar quinolonas en embarazo");
    }
    // MEI
    if(eim("axial")){if(isT||isJ)up(it,"Cubre espondiloartritis axial");if(safe)warn(it,"Sin eficacia en espondiloartritis axial");if(isS)warn(it,"No trata MEI articulares")}
    if(eim("artper")){if(isT||isJ)up(it,"Controla artritis periférica independiente de la actividad");if(k==="int")warn(it,"Vedolizumab no controla artritis independiente; puede emerger")}
    if(eim("uveitis")){if(id==="ada"||id==="ifx")up(it,"Uveítis: adalimumab aprobado (VISUAL); infliximab eficaz");if(k==="int")warn(it,"No trata uveítis");if(isS)down(it,"prec","Uveítis: riesgo de edema macular con S1P")}
    if(eim("pg")){if(id==="ifx")up(it,"Pioderma gangrenoso: único ECA (infliximab)");if(id==="ada")up(it,"Pioderma: alternativa a infliximab");if(k==="p40"||k==="p19")pos(it,"Pioderma: series de casos favorables");if(k==="int")warn(it,"No trata pioderma gangrenoso")}
    if(eim("psoriasis")){if(k==="p40"||id==="rzb"||id==="gus")up(it,"Psoriasis: aprobado también en psoriasis");if(id==="miri")pos(it,"Eje IL-23; sin aprobación en psoriasis");if(isT)warn(it,"Puede inducir psoriasis paradojal")}
    if(eim("aps")){if(k==="p40"||id==="rzb"||id==="gus"||isT||id==="upa"||id==="tofa")up(it,"Artritis psoriásica: aprobado o con eficacia demostrada")}
    if(eim("hs")){if(id==="ada"||id==="ifx")up(it,"Hidradenitis: adalimumab aprobado; infliximab eficaz");if(id==="rzb"||id==="gus")warn(it,"Sin eficacia demostrada en hidradenitis")}
  });

  // combinada
  if(R.combo){
    const it=R.items.find(i=>i.id==="ifx");
    if(age>=65||has("ebvneg")||has("linfoma")||has("neoActiva")||has("neo5")||has("cpnm")||c.tpmt==="baja"||has("fragil"))R.comboWarn=true;
  }
  /* orden dentro de cada nivel: según contexto */
  const SAFE={int:0,p40:0,p19:0,asa:0,abx:0,prob:0,cort:1,tnf:1,s1p:2,jak:2,imm:2,cni:2};
  const spd=it=>{const k=(D[it.id].kin||{})[c.dz];return k?k.on[0]:/Rescate|Puente/.test(it.ph)?0:6};
  const sf=it=>SAFE[D[it.id].cl]??1, cl=it=>CHILE_ORDER[D[it.id].chile];
  const severe=(c.dz==="cu"&&!pouch&&["grave","asuc"].includes(c.sev))||(c.dz==="ec"&&c.act==="grave");
  const frailCtx=age>=65||has("fragil")||has("infRec")||has("neoActiva")||has("neo5");
  let keys;
  if(severe){keys=[spd,sf,cl];R.order="rapidez de acción y luego seguridad (actividad grave)"}
  else if(frailCtx){keys=[sf,cl,spd];R.order=age>=65?"seguridad, disponibilidad en Chile y rapidez de acción (adulto mayor)":"seguridad, disponibilidad en Chile y rapidez de acción (riesgo infeccioso u oncológico)"}
  else{keys=[cl,spd,sf];R.order="disponibilidad en Chile y luego rapidez de acción"}
  if(c.dz==="ec"&&c.pa&&c.pa!=="no"){keys.unshift(it=>/perianal/i.test(it.ph)?0:1);R.order="eficacia perianal primero; luego "+R.order}
  R.items.sort((a,b)=>{let d=ti(a.tier)-ti(b.tier);for(const f of keys){if(d)break;d=f(a)-f(b)}return d});
  return R;
}

function tnfSecond(c,add,ids){
  ids.forEach(id=>{
    if(c.tnff==="inmuno"||c.tnff==="intol")add(id,"alt","Inducción y mantención",c.tnff==="inmuno"?"Falla inmunogénica: un segundo anti-TNF es razonable, idealmente con inmunomodulador (AGA 2025)":"Intolerancia no de clase: segundo anti-TNF válido");
    else add(id,"evit","Inducción y mantención","Falla de mecanismo a anti-TNF: cambiar de clase, no de molécula (ACG KC29, AGA)");
  });
}
