/* Escenarios del Corazón — V1.2
   - Adds scene context to each Q
   - Fixes conjugation (ref third person, you tuteo)
   - Ref questions have their own options/types (no scale mismatch)
*/
const STORAGE_KEY = "ldlv_v12_state";
const $ = (sel) => document.querySelector(sel);

const screens = { intro: $("#screenIntro"), quiz: $("#screenQuiz"), results: $("#screenResults") };

const dlgHelp = $("#dlgHelp");
const dlgPause = $("#dlgPause");

const btnStart = $("#btnStart");
const btnResume = $("#btnResume");
const btnHelp = $("#btnHelp");
const btnReset = $("#btnReset");

const inpName = $("#inpName");
const selEnergy = $("#selEnergy");
const chkTheatre = $("#chkTheatre");
const introPara = $("#introPara");

const qTitle = $("#qTitle");
const qCounter = $("#qCounter");
const qBody = $("#qBody");
const altarChip = $("#altarChip");
const progressFill = $("#progressFill");
const progressText = $("#progressText");

const btnBack = $("#btnBack");
const btnNext = $("#btnNext");
const btnPause = $("#btnPause");

const btnCloseHelp = $("#btnCloseHelp");
const btnExitToIntro = $("#btnExitToIntro");
const btnKeepGoing = $("#btnKeepGoing");

const panelSummary = $("#panel-summary");
const panelData = $("#panel-data");

const btnCopy = $("#btnCopy");
const btnDownload = $("#btnDownload");
const btnNew = $("#btnNew");

const NAMES = {
  girl: "Antonia",
  bestFriend: "Julieta",
  friends: ["Matías", "David"],
  mom: "Laura",
  dad: "Ricardo",
  city: "Medellín",
  school: "Pedro Justo Berrío",
};

introPara.innerHTML = `
  ${NAMES.girl}, esto es un juego corto (12–15 min) para que puedas hablar de ti sin sentir que te están interrogando.
  Vamos por <strong>ocho altares</strong> con mini-escenas (como si fueran teatro).
  Tú eliges opciones y, cuando quieras, escribes <strong>una frase</strong>.
  Si después te da curiosidad, puedes jugarlo también con ${NAMES.bestFriend} o con ${NAMES.friends.join(" y ")}:
  cada persona cuenta su versión, sin “respuestas correctas”.
`;

// 8 altars x 3 questions = 24 base questions
const ALTERS = [
  { id:"emocion", name:"Altar de Emoción", guide:"La Muerte", dot:"rgba(255,91,214,0.95)", questions:[
    { id:"emocion_1", sceneTitle:"Escena: una máscara antes de salir", scene:"Antes de salir a escena, eliges una máscara. No es para mentir: es para protegerte un momento.",
      ref:{ character:"Manolo", type:"choice", prompt:"Si Manolo tuviera que ponerse una máscara hoy, ¿cuál elegiría?",
        options:["Una máscara tranquila: se siente estable","Una máscara sonriente: por fuera bien, por dentro cargado","Una máscara seria: quiere poco ruido y más espacio","Una máscara confusa: no entiende qué le pasa"]},
      you:{ type:"choice", prompt:"Si hoy tú tuvieras una máscara para mostrar cómo estás por dentro, ¿cuál sería?",
        options:["Una máscara tranquila: me siento bastante bien","Una máscara sonriente: por fuera bien, por dentro cansada","Una máscara seria: estoy sensible y prefiero calma","Una máscara confusa: no sé bien qué me pasa"],
        onePhrase:true, phraseHint:"Una frase: ¿qué te gustaría que alguien entendiera de tu estado hoy?"}
    },
    { id:"emocion_2", sceneTitle:"Escena: emoción grande en el pecho", scene:"Sube una emoción fuerte. No hay que pelear con ella: hay que escucharla sin dejar que maneje todo.",
      ref:{ character:"María", type:"choice", prompt:"Si a María le sube una emoción fuerte, ¿qué haría para cuidarse?",
        options:["Respiraría y bajaría el ritmo","Se alejaría un momento para no explotar","Buscaría a alguien de confianza y lo diría directo","Haría como si nada y aguantaría"]},
      you:{ type:"scale", prompt:"Ahora mismo, tu emoción más grande se siente…", scale:["Muy suave","Suave","Media","Fuerte","Muy fuerte"], onePhrase:false }
    },
    { id:"emocion_3", sceneTitle:"Escena: cuando algo molesta", scene:"Pasa algo que molesta. La emoción sale primero de una forma… y luego cambia.",
      ref:{ character:"Joaquín", type:"choice", prompt:"Si a Joaquín algo le molesta, ¿cómo le sale primero?",
        options:["Se entristece y se apaga","Se irrita y responde rápido","Se acelera y se preocupa","Depende del día / del tema"]},
      you:{ type:"choice", prompt:"Cuando algo te molesta, tu emoción suele salir primero como…",
        options:["Tristeza (me apago)","Ira (me sube rápido)","Ansiedad (me acelero)","Depende / cambia según el día"],
        onePhrase:true, phraseHint:"Una frase: ¿qué te ayudaría a bajar esa emoción cuando aparece?"}
    },
  ]},
  { id:"pensamientos", name:"Altar de Pensamientos", guide:"Xibalba", dot:"rgba(247,201,72,0.95)", questions:[
    { id:"pens_1", sceneTitle:"Escena: el susurro en la cabeza", scene:"Cuando algo sale mal, aparece una voz interna. A veces ayuda. A veces enreda.",
      ref:{ character:"Xibalba", type:"choice", prompt:"Si Xibalba quisiera enredar a Manolo con un pensamiento, ¿cuál le susurraría?",
        options:["“Siempre te equivocas, no sirves”","“Nunca es tu culpa, los demás son el problema”","“Mejor no lo intentes”","“Tiene que ser perfecto o no vale”"]},
      you:{ type:"choice", prompt:"Cuando algo sale mal, tu cabeza suele decirte…",
        options:["“Ok, pasó. Puedo arreglarlo o aprender.”","“Soy un desastre, siempre lo hago mal.”","“No fue mi culpa, fue por…”","“No sé, me quedo en blanco.”"],
        onePhrase:true, phraseHint:"Una frase: ¿qué te gustaría decirte a ti misma en esos momentos?"}
    },
    { id:"pens_2", sceneTitle:"Escena: “no es para tanto”", scene:"Alguien minimiza lo que sientes o piensas. Eso cambia la escena.",
      ref:{ character:"María", type:"choice", prompt:"Si a María le dicen “no es para tanto”, ¿cómo respondería?",
        options:["Lo diría claro: “para mí sí es”","Se callaría y se iría","Haría broma para quitarle peso","Depende de quién lo diga"]},
      you:{ type:"choice", prompt:"Cuando alguien insiste en que “no es para tanto”, ¿qué tan fácil te resulta explicarte?",
        options:["Fácil","Más o menos","Difícil","Depende de quién sea"], onePhrase:false }
    },
    { id:"pens_3", sceneTitle:"Escena: el valor protagonista", scene:"Cada historia tiene un valor que la sostiene. No siempre se dice, pero se nota.",
      ref:{ character:"Manolo", type:"choice", prompt:"Si Manolo eligiera un valor para sostener tu historia, ¿cuál escogería?",
        options:["Respeto","Libertad","Lealtad","Justicia"]},
      you:{ type:"choice", prompt:"Si tú eligieras 1 valor que te importa, ¿cuál se parece más?",
        options:["Respeto (trato digno)","Libertad (ser yo)","Lealtad (cuidar a mi gente)","Justicia (que sea justo)"],
        onePhrase:true, phraseHint:"Una frase: ¿cuándo sientes que ese valor se te rompe?"}
    },
  ]},
  { id:"cuerpo", name:"Altar de Cuerpo y Energía", guide:"Joaquín", dot:"rgba(83,213,253,0.95)", questions:[
    { id:"cuerpo_1", sceneTitle:"Escena: el cuerpo avisa", scene:"A veces el cuerpo habla antes que la boca. No es drama: es señal.",
      ref:{ character:"Joaquín", type:"choice", prompt:"Si Joaquín estuviera bajo presión, ¿dónde lo notaría primero?",
        options:["Estómago","Cabeza","Pecho","No lo notaría claro"]},
      you:{ type:"choice", prompt:"Cuando estás bajo presión, tu cuerpo lo nota sobre todo en…",
        options:["Estómago","Cabeza","Pecho","No lo noto claro / depende"], onePhrase:false }
    },
    { id:"cuerpo_2", sceneTitle:"Escena: 10 minutos para regularte", scene:"En la historia, música y movimiento cambian el ánimo. En la vida real también hay ‘botones’.",
      ref:{ character:"Manolo", type:"choice", prompt:"Si Manolo necesitara calmarse sin hablar, ¿qué elegiría?",
        options:["Crear/tocar música","Mover el cuerpo","Silencio a solas","No sabría qué hacer"]},
      you:{ type:"choice", prompt:"¿Qué te ayuda más a regularte sin hablar (solo contigo)?",
        options:["Pintar/crear","Mover el cuerpo","Música/auriculares","Me cuesta encontrar algo"],
        onePhrase:true, phraseHint:"Una frase: si tuvieras 10 minutos para cuidarte hoy, ¿qué harías?"}
    },
    { id:"cuerpo_3", sceneTitle:"Escena: el medidor de presión", scene:"Imagina un medidor como en los escenarios: luces bajas a luces fuertes.",
      ref:{ character:"María", type:"choice", prompt:"Si María notara estrés, ¿qué haría primero?",
        options:["Respirar y bajar la velocidad","Pedir espacio antes de hablar","Seguir igual y aguantar","Buscar distracción fuerte"]},
      you:{ type:"scale", prompt:"Tu nivel de estrés hoy (sin juzgar):", scale:["0–1","2–3","4–5","6–7","8–10"],
        onePhrase:true, phraseHint:"Una frase: ¿qué es lo que más te está apretando últimamente?"}
    },
  ]},
  { id:"autoestima", name:"Altar de Autoestima", guide:"Manolo", dot:"rgba(98,246,181,0.95)", questions:[
    { id:"auto_1", sceneTitle:"Escena: mirarte por dentro", scene:"Hay un espejo que no muestra la cara, sino la forma de hablarte.",
      ref:{ character:"Manolo", type:"choice", prompt:"Si Manolo dudara de sí hoy, ¿qué haría para no perderse?",
        options:["Recordaría algo que sí logró","Buscaría a alguien que le diga la verdad con cariño","Se escondería para no fallar","Haría chistes para no sentir"]},
      you:{ type:"choice", prompt:"Cuando te miras por dentro, lo que más ves es…",
        options:["Fortaleza","Exigencia","Duda","Crítica"], onePhrase:true, phraseHint:"Una frase: ¿qué parte tuya te cae mejor (aunque sea pequeña)?"}
    },
    { id:"auto_2", sceneTitle:"Escena: recibir reconocimiento", scene:"Cuando alguien te reconoce, tu cuerpo reacciona.",
      ref:{ character:"María", type:"choice", prompt:"Si a María le hacen un halago, ¿cómo lo recibe?",
        options:["Dice gracias","Se incomoda y cambia de tema","No lo cree","Depende de quién venga"]},
      you:{ type:"choice", prompt:"¿Qué te pasa con los halagos?",
        options:["Me cuesta creerlos","Me dan pena","Los recibo bien","Depende de quién venga"], onePhrase:false }
    },
    { id:"auto_3", sceneTitle:"Escena: tu talento como poder", scene:"En la historia, cada quien tiene un ‘poder’ que se nota en momentos difíciles.",
      ref:{ character:"La Muerte", type:"choice", prompt:"Si La Muerte describiera tu poder en una palabra, ¿cuál diría?",
        options:["Creatividad","Sensibilidad","Liderazgo","Humor"]},
      you:{ type:"choice", prompt:"Elige 1 talento que te acompaña:",
        options:["Creatividad","Sensibilidad","Liderazgo","Humor"], onePhrase:true, phraseHint:"Una frase: ¿qué te gustaría atreverte a hacer más con ese talento?"}
    },
  ]},
  { id:"amistad", name:"Altar de Amistad", guide:"María", dot:"rgba(138,107,255,0.95)", questions:[
    { id:"amis_1", sceneTitle:"Escena: tú y Julieta ensayando", scene:`Tú y ${NAMES.bestFriend} inventan una mini obra. Alguien del público no entiende… pero ustedes sí.`,
      ref:{ character:"María", type:"choice", prompt:`Si María viera tu amistad con ${NAMES.bestFriend}, ¿qué celebraría?`,
        options:["Que crean y juegan","Que se apoyan","Que son sinceras","Que se cuidan con humor"]},
      you:{ type:"choice", prompt:`Con ${NAMES.bestFriend}, normalmente tú…`,
        options:["Te sueltas y creas","Escuchas y acompañas","Te adaptas para evitar conflicto","A veces no encajas"],
        onePhrase:true, phraseHint:`Una frase: ¿qué es lo más bonito de tu amistad con ${NAMES.bestFriend}?`}
    },
    { id:"amis_2", sceneTitle:"Escena: con Matías y David", scene:`Hay risas, pero también momentos donde podrías contar algo más real… o no.`,
      ref:{ character:"Manolo", type:"choice", prompt:"Si Manolo quisiera cuidarte en ese plan, ¿qué te sugeriría?",
        options:["Ser tú, aunque sea con una frase","Reírte y ya","Irte si te incomoda","Observar primero y hablar después"]},
      you:{ type:"choice", prompt:`Con ${NAMES.friends[0]} y ${NAMES.friends[1]}, lo que más pasa es…`,
        options:["Me siento incluida","Me río, pero no cuento lo importante","A ratos me siento aparte","Depende del plan"],
        onePhrase:true, phraseHint:"Una frase: ¿qué necesitarías para sentirte más tú con ellos?"}
    },
    { id:"amis_3", sceneTitle:"Escena: mini-conflicto", scene:"Un comentario o un silencio tensa la escena.",
      ref:{ character:"Joaquín", type:"choice", prompt:"Si Joaquín tuviera un conflicto, ¿qué haría primero?",
        options:["Lo hablaría de frente","Esperaría","Se alejaría","Explotaría y luego se arrepiente"]},
      you:{ type:"choice", prompt:"Cuando hay un conflicto, tú tiendes a…",
        options:["Hablarlo pronto","Esperar","Alejarme","Explotar y luego arrepentirme"], onePhrase:false }
    },
  ]},
  { id:"escuela", name:"Altar de Escuela", guide:"El Escenario", dot:"rgba(255,140,60,0.95)", questions:[
    { id:"esco_1", sceneTitle:"Escena: el colegio como escenario", scene:`En el colegio ${NAMES.school}, hay luces, público y reglas.`,
      ref:{ character:"El Escenario", type:"choice", prompt:"Si esto fuera una obra, ¿qué obstáculo pondría el guion hoy?",
        options:["Presión por notas","Convivencia","Autoridad/control","Ninguno fuerte hoy"]},
      you:{ type:"choice", prompt:`En el colegio ${NAMES.school}, lo más difícil para ti suele ser…`,
        options:["Notas/rendimiento","Convivencia","Reglas/control","Nada en especial"], onePhrase:true, phraseHint:"Una frase: si pudieras cambiar 1 cosa del cole, ¿cuál sería?"}
    },
    { id:"esco_2", sceneTitle:"Escena: sentirte observada", scene:"De pronto sientes que te miran. No sabes si juzgan o solo miran.",
      ref:{ character:"María", type:"choice", prompt:"Si María se sintiera juzgada, ¿qué haría?",
        options:["Pondría límite con calma","Se protegería y hablaría menos","Se volvería divertida para disimular","No le daría importancia"]},
      you:{ type:"choice", prompt:"Cuando sientes que te observan, tú…",
        options:["Me protejo","Me acelero por dentro","Disimulo con humor","No me afecta tanto"], onePhrase:false }
    },
    { id:"esco_3", sceneTitle:"Escena: un profe que sí te ve", scene:"Imagina un profe que te entiende sin presionarte.",
      ref:{ character:"Manolo", type:"choice", prompt:"Si Manolo fuera tu profe por un día, ¿qué notaría?",
        options:["Eres capaz pero te bloqueas","Necesitas respeto","Aprendes con creatividad","Te cuesta hablar con presión"]},
      you:{ type:"choice", prompt:"¿Qué te gustaría que un profe entendiera mejor de ti?",
        options:["Soy capaz pero me bloqueo","Necesito respeto","Aprendo con creatividad","Me cuesta hablar si me presionan"],
        onePhrase:true, phraseHint:"Una frase: ¿qué te ayudaría a participar más sin sentirte expuesta?"}
    },
  ]},
  { id:"casa", name:"Altar de Casa", guide:"Laura y Ricardo", dot:"rgba(83,213,253,0.78)", questions:[
    { id:"casa_1", sceneTitle:"Escena: mamá y tú", scene:`Con tu mamá (${NAMES.mom}), a veces hay cuidado… y a veces choque.`,
      ref:{ character:"La Muerte", type:"choice", prompt:`Si La Muerte mirara tu escena con ${NAMES.mom}, ¿qué diría?`,
        options:["Hablen con menos presión","Bajen control y suban respeto","No se entiendan perfectas","Den espacio sin desconectarse"]},
      you:{ type:"choice", prompt:`Con tu mamá (${NAMES.mom}), lo que más te pasa es…`,
        options:["Me entiende bastante","Me cuida pero siento control","Me cierro rápido","Depende del día"],
        onePhrase:true, phraseHint:`Una frase: ¿qué te gustaría pedirle a ${NAMES.mom} sin pelea?`}
    },
    { id:"casa_2", sceneTitle:"Escena: papá y tú", scene:`Con tu papá (${NAMES.dad}), un gesto pequeño cambia la cercanía.`,
      ref:{ character:"Manolo", type:"choice", prompt:"Si esto fuera una escena de acercamiento, ¿qué detalle pequeño pondría Manolo?",
        options:["Conversación corta sin juicio","Actividad breve juntos","Disculpa simple","Mensaje de “estoy”"]},
      you:{ type:"choice", prompt:`Con tu papá (${NAMES.dad}), lo más típico es…`,
        options:["Me siento cercana","Me entiende a su manera","Siento distancia","Depende del tema"],
        onePhrase:true, phraseHint:`Una frase: ¿qué te gustaría que ${NAMES.dad} hiciera más (o menos)?`}
    },
    { id:"casa_3", sceneTitle:"Escena: tensión en casa", scene:"Sube la tensión. Cada quien se protege a su manera.",
      ref:{ character:"Joaquín", type:"choice", prompt:"Si Joaquín entrara a esa tensión, ¿cómo reaccionaría primero?",
        options:["Mediar","Encerrarse","Discutir de frente","Hacer como si nada"]},
      you:{ type:"choice", prompt:"Cuando en casa hay tensión, tú…",
        options:["Mediar","Me encierro","Discuto","Hago como si nada"], onePhrase:false }
    },
  ]},
  { id:"redes", name:"Altar de Redes y Comparación", guide:"El Espejo Moderno", dot:"rgba(255,91,214,0.78)", questions:[
    { id:"red_1", sceneTitle:"Escena: el espejo del feed", scene:"El feed puede ser inspiración… o comparación.",
      ref:{ character:"Xibalba", type:"choice", prompt:"Si Xibalba quisiera tentarte con redes, ¿cómo lo haría?",
        options:["Vidas perfectas para compararte","Perder tiempo y culparte","Mucho ruido para no sentir","Peleas en comentarios"]},
      you:{ type:"choice", prompt:"Cuando ves redes, lo que más te suele pasar es…",
        options:["Me inspiro","Me comparo y me baja","Me distraigo y se me va el tiempo","Depende del contenido"],
        onePhrase:true, phraseHint:"Una frase: ¿qué contenido te hace bien de verdad?"}
    },
    { id:"red_2", sceneTitle:"Escena: drama en un chat", scene:"Aparece una indirecta. La escena puede escalar… o alguien la corta.",
      ref:{ character:"María", type:"choice", prompt:"Si María viera drama en un chat, ¿qué haría?",
        options:["Poner límite con calma","Salirse y no alimentar","Responder fuerte","Leer y callar"]},
      you:{ type:"choice", prompt:"En chats/grupos, cuando hay drama o indirectas, tú…",
        options:["Pongo límite","Me salgo/evito","Me engancho","Leo y me callo"], onePhrase:false }
    },
    { id:"red_3", sceneTitle:"Escena: tu regla de cuidado", scene:"Una regla sencilla puede cambiar tu relación con redes.",
      ref:{ character:"Manolo", type:"choice", prompt:"Si Manolo escribiera tu regla en su guitarra, ¿cuál pondría?",
        options:["No entrar sensible","No seguir cuentas que comparan","Poner horario","Compartir menos y vivir más"]},
      you:{ type:"choice", prompt:"Si tú pusieras una regla para cuidarte en redes, sería…",
        options:["No entrar cuando estoy sensible","No seguir cuentas que me comparan","Poner horario","Compartir menos y vivir más"],
        onePhrase:true, phraseHint:"Una frase: ¿qué sería un uso sano de redes para ti (hoy)?"}
    },
  ]},
];

function buildFlow(theatreMode){
  const flow = [];
  for(const altar of ALTERS){
    for(const q of altar.questions){
      if(theatreMode && q.ref){
        flow.push({ id:q.id+"_ref", altarId:altar.id, altarName:altar.name, guide:altar.guide, dot:altar.dot,
          sceneTitle:q.sceneTitle, scene:q.scene, modeTag:"🎭 Personaje", ...q.ref, isReference:true, baseId:q.id });
      }
      flow.push({ id:q.id+"_you", altarId:altar.id, altarName:altar.name, guide:altar.guide, dot:altar.dot,
        sceneTitle:q.sceneTitle, scene:q.scene, modeTag:"🫶 Tú", ...q.you, isReference:false, baseId:q.id });
    }
  }
  return flow;
}

const defaultState = () => ({ meta:{version:"v1.2", startedAt:null, completedAt:null, name:"", energy:"media", theatreMode:true}, idx:0, answers:{} });
let state = defaultState();
let FLOW = [];

function hasSavedProgress(){ try{ const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return false; const p=JSON.parse(raw); return p && typeof p.idx==="number" && p.idx>0; }catch{return false;} }
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||""); }catch{ return null; } }
function clearState(){ localStorage.removeItem(STORAGE_KEY); }
function showScreen(which){ for(const [k,el] of Object.entries(screens)) el.style.display=(k===which)?"":"none"; }
function openDialog(d){ if(d?.showModal) d.showModal(); else d?.setAttribute("open","open"); }
function closeDialog(d){ if(d?.close) d.close(); else d?.removeAttribute("open"); }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function escapeHtml(s){ return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }

function setAltarChip(q){
  altarChip.innerHTML = `<span class="altar-dot" style="background:${q.dot}"></span>${escapeHtml(q.altarName)} · Guía: ${escapeHtml(q.guide)}`;
}

function renderQuestion(){
  const q = FLOW[state.idx];
  setAltarChip(q);
  qTitle.textContent = `${q.modeTag}: ${q.prompt}`;
  qCounter.textContent = `${state.idx+1} / ${FLOW.length}`;

  const pct = Math.round((state.idx / FLOW.length) * 100);
  progressFill.style.width = pct + "%";
  progressText.textContent = pct + "%";

  const prev = state.answers[q.id] || { value:null, phrase:"" };
  qBody.innerHTML = "";

  const scene = document.createElement("div");
  scene.className = "scene";
  scene.innerHTML = `<div class="scene-title">${escapeHtml(q.sceneTitle)} <span class="scene-badge">${escapeHtml(q.modeTag)}</span></div>
                     <div class="scene-text">${escapeHtml(q.scene)}</div>`;
  qBody.appendChild(scene);

  const grid = document.createElement("div");
  grid.className = "choice-grid";
  const opts = q.type==="scale" ? q.scale : q.options;

  opts.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.type="button";
    btn.className="choice";
    if(prev.value===opt) btn.classList.add("selected");
    btn.innerHTML = `<span class="tag">${i+1}</span>${escapeHtml(opt)}`;
    btn.addEventListener("click", ()=>selectChoice(q,opt));
    grid.appendChild(btn);
  });
  qBody.appendChild(grid);

  if(q.onePhrase){
    const wrap=document.createElement("div");
    wrap.className="onephrase";
    const hint=document.createElement("div");
    hint.className="hint";
    hint.textContent = q.phraseHint || "Una frase (opcional):";
    const ta=document.createElement("textarea");
    ta.maxLength=240; ta.placeholder="Escribe una frase… (opcional)";
    ta.value = prev.phrase || "";
    ta.addEventListener("input", ()=>{
      const cur = state.answers[q.id] || { value:null, phrase:"" };
      cur.phrase = ta.value;
      state.answers[q.id]=cur; saveState();
    });
    wrap.appendChild(hint); wrap.appendChild(ta);
    qBody.appendChild(wrap);
  }

  btnBack.disabled = (state.idx===0);
  btnNext.textContent = (state.idx===FLOW.length-1) ? "Ver resumen" : "Siguiente";
}

function selectChoice(q,value){
  const cur = state.answers[q.id] || { value:null, phrase:"" };
  cur.value=value; state.answers[q.id]=cur; saveState(); renderQuestion();
}
function currentAnswerOk(){ const q=FLOW[state.idx]; const a=state.answers[q.id]; return a && a.value; }
function flashNeedAnswer(){ btnNext.animate([{transform:"translateX(0px)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0px)"}],{duration:220,easing:"ease-out"}); }
function next(){ if(!currentAnswerOk()){ flashNeedAnswer(); return; } if(state.idx<FLOW.length-1){ state.idx++; saveState(); renderQuestion(); } else complete(); }
function back(){ state.idx=clamp(state.idx-1,0,FLOW.length-1); saveState(); renderQuestion(); }
function pause(){ saveState(); openDialog(dlgPause); }
function stripHtml(html){ const tmp=document.createElement("div"); tmp.innerHTML=html; return tmp.textContent||tmp.innerText||""; }

// Inference from YOU answers only
function buildValueInference(){
  const themes={coraje:0,honestidad:0,cuidado:0,libertad:0,lealtad:0,respeto:0,justicia:0};
  const add=(k,n=1)=>themes[k]=(themes[k]??0)+n;
  const pick=(qid)=>state.answers[qid]?.value||"";
  const has=(s,sub)=>s.toLowerCase().includes(sub.toLowerCase());

  const val=pick("pens_3_you");
  if(has(val,"Respeto")) add("respeto",3);
  if(has(val,"Libertad")) add("libertad",3);
  if(has(val,"Lealtad")) add("lealtad",3);
  if(has(val,"Justicia")) add("justicia",3);

  const conflict=pick("amis_3_you");
  if(has(conflict,"Hablar")) add("coraje",2),add("honestidad",1);
  if(has(conflict,"Esperar")) add("cuidado",1);
  if(has(conflict,"Alejar")) add("cuidado",1),add("libertad",1);
  if(has(conflict,"Explot")) add("honestidad",1);

  const selfTalk=pick("pens_1_you");
  if(has(selfTalk,"aprender")) add("coraje",1),add("cuidado",1);
  if(has(selfTalk,"desastre")) add("cuidado",1);
  if(has(selfTalk,"culpa")) add("justicia",1);
  if(has(selfTalk,"blanco")) add("cuidado",1);

  const chat=pick("red_2_you");
  if(has(chat,"límite")||has(chat,"Pongo")) add("respeto",2),add("coraje",1);
  if(has(chat,"salgo")) add("cuidado",1);
  if(has(chat,"engancho")) add("honestidad",1);
  if(has(chat,"call")) add("cuidado",1);

  const home=pick("casa_3_you");
  if(has(home,"Medi")) add("cuidado",2),add("lealtad",1);
  if(has(home,"encier")) add("cuidado",1),add("libertad",1);
  if(has(home,"Disc")) add("honestidad",1);
  if(has(home,"nada")) add("cuidado",1);

  const sorted=Object.entries(themes).sort((a,b)=>b[1]-a[1]);
  const top=sorted.filter(([,v])=>v>0).slice(0,2).map(([k])=>k);

  if(top.length===0){
    return { headline:"Tu historia hoy pide calma y claridad",
      bullets:["Hoy tu escena parece más de observar que de empujar.","Si varias respuestas fueron “depende” o “no sé”, eso también cuenta."],
      nextStep:"Elige 1 cosa pequeña que te cuide hoy (10 minutos) y hazla sin negociar contigo." };
  }
  const t1=top[0], t2=top[1]||null;
  const headline = t2 ? `Tu escena de hoy se mueve entre ${t1} y ${t2}` : `Tu escena de hoy se apoya en ${t1}`;
  const bullets=[`En tus elecciones aparece fuerte el ${t1}.`, ...(t2?[`También aparece el ${t2}, como una brújula.`]:[]), "Esto no es “quién eres para siempre”; es lo que hoy se asomó."];
  const nextStep = t1==="cuidado" ? "Esta semana: practica un límite suave: “ahora no puedo con esto, luego lo hablamos”."
    : t1==="coraje" ? "Esta semana: di una verdad pequeña en una frase (sin explicación larga)."
    : t1==="respeto" ? "Esta semana: trátate con respeto 1 vez al día (no te hables feo)."
    : t1==="libertad" ? "Esta semana: reserva 10 minutos de algo tuyo (arte, música, movimiento)."
    : t1==="lealtad" ? "Esta semana: pide apoyo claro a alguien de tu confianza (una frase)."
    : "Esta semana: escribe una frase que te gustaría oír cuando estás difícil, y repítela.";
  return { headline, bullets, nextStep };
}

function summarize(){
  const who = (state.meta.name||"").trim() || NAMES.girl;
  const dateStr = new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"});
  const echoLines=[]; const phraseLines=[];
  for(const q of FLOW){
    if(q.isReference) continue;
    const a=state.answers[q.id]; if(!a?.value) continue;
    if(echoLines.length<12) echoLines.push(`• ${q.prompt} → ${a.value}`);
    if(a.phrase && phraseLines.length<10) phraseLines.push(`• ${q.prompt} — “${a.phrase.trim()}”`);
  }
  const inf=buildValueInference();
  const summaryHtml = `
    <h3>Resumen para ${escapeHtml(who)}</h3>
    <p><strong>${escapeHtml(dateStr)}</strong> · ${escapeHtml(NAMES.city)}</p>
    <p>Hoy hiciste algo valiente: <strong>poner palabras</strong> (aunque sean pocas) a lo que te pasa.</p>
    <h3>Lo que se ve en tus respuestas</h3>
    <p class="mono">${escapeHtml(echoLines.join("\n"))}</p>
    ${phraseLines.length ? `<h3>Tus frases</h3><p class="mono">${escapeHtml(phraseLines.join("\n"))}</p>` : ""}
    <h3>Lo que tu historia sugiere hoy (sin etiqueta, con sentido)</h3>
    <p><strong>${escapeHtml(inf.headline)}</strong></p>
    <ul>${inf.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul>
    <h3>Un gesto para esta semana</h3>
    <p>${escapeHtml(inf.nextStep)}</p>
  `;
  const dataObj = { meta:state.meta, completedAt:state.meta.completedAt, flowLength:FLOW.length, answers:state.answers };
  const dataHtml = `<h3>Datos (registro)</h3><pre class="mono" style="white-space:pre-wrap; overflow:auto;">${escapeHtml(JSON.stringify(dataObj,null,2))}</pre>`;
  return { summaryHtml, dataHtml, dataObj };
}

function complete(){
  state.meta.completedAt = new Date().toISOString();
  saveState(); showScreen("results");
  const { summaryHtml, dataHtml, dataObj } = summarize();
  panelSummary.innerHTML = summaryHtml;
  panelData.innerHTML = dataHtml;
  panelSummary.dataset.raw = stripHtml(summaryHtml);
  panelData.dataset.raw = JSON.stringify(dataObj,null,2);
}

function startFresh(){
  state = { meta:{ version:"v1.2", startedAt:new Date().toISOString(), completedAt:null, name:inpName.value.trim(), energy:selEnergy.value, theatreMode:!!chkTheatre.checked }, idx:0, answers:{} };
  FLOW = buildFlow(state.meta.theatreMode);
  saveState(); showScreen("quiz"); renderQuestion();
}
function resume(){
  const loaded=loadState(); if(!loaded) return;
  state = { ...defaultState(), ...loaded };
  FLOW = buildFlow(!!state.meta.theatreMode);
  showScreen("quiz"); renderQuestion();
}
function init(){ btnResume.style.display = hasSavedProgress() ? "" : "none"; }

btnHelp.addEventListener("click",()=>openDialog(dlgHelp));
btnCloseHelp.addEventListener("click",()=>closeDialog(dlgHelp));
btnStart.addEventListener("click",()=>startFresh());
btnResume.addEventListener("click",()=>resume());
btnBack.addEventListener("click",()=>back());
btnNext.addEventListener("click",()=>next());
btnPause.addEventListener("click",()=>pause());
btnExitToIntro.addEventListener("click",()=>{ closeDialog(dlgPause); showScreen("intro"); });
btnKeepGoing.addEventListener("click",()=>closeDialog(dlgPause));
btnReset.addEventListener("click",()=>{
  if(confirm("¿Seguro que quieres reiniciar y borrar el progreso guardado en este navegador?")){
    clearState(); state=defaultState(); btnResume.style.display = hasSavedProgress() ? "" : "none"; showScreen("intro");
  }
});
btnCopy.addEventListener("click", async ()=>{
  const text = panelSummary.dataset.raw || stripHtml(panelSummary.innerHTML);
  try{ await navigator.clipboard.writeText(text); btnCopy.textContent="Copiado ✓"; setTimeout(()=>btnCopy.textContent="Copiar resumen",900); }
  catch{ alert("No pude copiar automáticamente. Puedes seleccionar el texto manualmente."); }
});
btnDownload.addEventListener("click",()=>{
  const raw = panelData.dataset.raw || "";
  const blob = new Blob([raw],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  const safeName=(state.meta.name||"respuestas").replaceAll(/[^a-zA-Z0-9_-]+/g,"_");
  a.download=`escenarios_v12_${safeName}_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});
btnNew.addEventListener("click",()=>{ clearState(); state=defaultState(); btnResume.style.display="none"; showScreen("intro"); });

document.addEventListener("keydown",(ev)=>{
  if(screens.quiz.style.display==="none") return;
  const q=FLOW[state.idx];
  if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)) return;
  if(ev.key==="Enter"){ ev.preventDefault(); next(); }
  else if(ev.key==="ArrowLeft"){ ev.preventDefault(); back(); }
  else if(["1","2","3","4","5"].includes(ev.key)){
    const i=parseInt(ev.key,10)-1;
    const opts = q.type==="scale" ? q.scale : q.options;
    if(opts?.[i]) selectChoice(q, opts[i]);
  }
});

init();
