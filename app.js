/* Escenarios del Corazón — V1.1
   Static app for GitHub Pages. Autosave to localStorage.
   Adds "Modo teatro" (reference question with a character, then user's question).
*/
const STORAGE_KEY = "ldlv_v11_state";

const $ = (sel) => document.querySelector(sel);

const screens = {
  intro: $("#screenIntro"),
  quiz: $("#screenQuiz"),
  results: $("#screenResults"),
};

const dlgHelp = $("#dlgHelp");
const dlgPause = $("#dlgPause");

const btnStart = $("#btnStart");
const btnResume = $("#btnResume");
const btnHelp = $("#btnHelp");
const btnReset = $("#btnReset");

const inpName = $("#inpName");
const selEnergy = $("#selEnergy");
const chkTheatre = $("#chkTheatre");

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

/** Data model */
const ALTERS = [
  {
    id: "emocion",
    name: "Altar de Emoción",
    guide: "La Muerte",
    flavor: "Los sentimientos no son enemigos: son mensajeros.",
    questions: [
      {
        id: "emocion_1",
        type: "choice",
        prompt: "Si hoy tuvieras una máscara para mostrar cómo estás por dentro, ¿cuál sería?",
        refPrompt: "Si Manolo se sintiera así por dentro, ¿qué crees que haría primero?",
        options: [
          "Se movería tranquilo: respira, piensa y sigue",
          "Sonreiría por fuera, pero buscaría un rincón para bajar la carga",
          "Se pondría serio: pediría menos ruido y más espacio",
          "Se quedaría confundido: preguntaría “¿qué me está pasando?”"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría que alguien entendiera de tu estado hoy?"
      },
      {
        id: "emocion_2",
        type: "scale",
        prompt: "En este momento, tu emoción más grande se siente…",
        refPrompt: "Si María sintiera una emoción así de fuerte, ¿cómo la cuidaría sin hacerse daño?",
        scale: ["Muy suave", "Suave", "Media", "Fuerte", "Muy fuerte"],
        onePhrase: false
      },
      {
        id: "emocion_3",
        type: "choice",
        prompt: "Cuando algo te molesta, normalmente tu emoción sale primero como…",
        refPrompt: "Si Joaquín se molestara, ¿cómo crees que le saldría primero?",
        options: [
          "Tristeza (me apago, me dan ganas de estar sola)",
          "Ira (me sube rápido y digo cosas fuertes)",
          "Ansiedad (me acelero, me preocupo, me quedo rumiando)",
          "Depende / cambia según el día"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te ayudaría a bajar esa emoción cuando aparece?"
      },
    ]
  },
  {
    id: "pensamientos",
    name: "Altar de Pensamientos",
    guide: "Xibalba",
    flavor: "A veces la mente escribe guiones que no son justos contigo.",
    questions: [
      {
        id: "pens_1",
        type: "choice",
        prompt: "Cuando te equivocas o algo sale mal, tu cabeza suele decir…",
        refPrompt: "Si Xibalba quisiera enredar a Manolo con un mal pensamiento, ¿cuál le susurraría?",
        options: [
          "“Ok, pasó. Puedo arreglarlo o aprender.”",
          "“Soy un desastre, siempre lo hago mal.”",
          "“No fue mi culpa, fue por…”",
          "“No sé, me quedo en blanco.”"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría decirte a ti misma en esos momentos?"
      },
      {
        id: "pens_2",
        type: "choice",
        prompt: "¿Qué tan fácil te resulta explicar lo que piensas cuando alguien insiste en que “no es para tanto”?",
        refPrompt: "Si María viera que la invalidan, ¿cómo crees que respondería?",
        options: [
          "Fácil: lo digo claro aunque se incomoden",
          "Más o menos: lo intento, pero me canso",
          "Difícil: me cierro y digo poco",
          "Depende de quién sea"
        ],
        onePhrase: false
      },
      {
        id: "pens_3",
        type: "choice",
        prompt: "Si tuvieras que elegir 1 valor que te importa (aunque a veces no lo digas), ¿cuál se parece más?",
        refPrompt: "Si tu historia tuviera un “valor protagonista”, ¿cuál crees que elegiría Manolo para ti?",
        options: [
          "Respeto (que me traten bien y yo tratar bien)",
          "Libertad (poder ser yo sin tanta presión)",
          "Lealtad (cuidar a mi gente)",
          "Justicia (que las cosas sean “justas” de verdad)"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿cuándo sientes que ese valor se te rompe o te lo rompen?"
      },
    ]
  },
  {
    id: "cuerpo",
    name: "Altar de Cuerpo y Energía",
    guide: "Joaquín",
    flavor: "Tu cuerpo te cuenta la verdad antes que tus palabras.",
    questions: [
      {
        id: "cuerpo_1",
        type: "choice",
        prompt: "Cuando estás bajo presión (cole, casa, amigos), tu cuerpo lo nota sobre todo en…",
        refPrompt: "Si Joaquín estuviera bajo presión, ¿dónde crees que le pegaría primero?",
        options: [
          "Estómago (nudo, dolor, ganas de vomitar)",
          "Cabeza (tensión, dolor, mente acelerada)",
          "Pecho (opresión, respiración corta)",
          "No lo noto claro / depende"
        ],
        onePhrase: false
      },
      {
        id: "cuerpo_2",
        type: "choice",
        prompt: "¿Qué te ayuda más a regularte sin hablar (solo contigo)?",
        refPrompt: "Si Manolo necesitara calmarse sin hablar, ¿qué crees que elegiría?",
        options: [
          "Pintar / dibujar / crear algo",
          "Mover el cuerpo (caminar, bailar, deporte)",
          "Música / auriculares / estar en mi mundo",
          "Nada en especial (me cuesta encontrar algo)"
        ],
        onePhrase: true,
        phraseHint: "Una frase: si tuvieras 10 minutos para cuidarte hoy, ¿qué harías?"
      },
      {
        id: "cuerpo_3",
        type: "scale",
        prompt: "Tu nivel de estrés hoy (sin juzgar):",
        refPrompt: "Si María notara estrés, ¿qué señal corporal le avisaría?",
        scale: ["0–1","2–3","4–5","6–7","8–10"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué es lo que más te está apretando últimamente?"
      },
    ]
  },
  {
    id: "autoestima",
    name: "Altar de Autoestima",
    guide: "Manolo",
    flavor: "No eres un personaje fijo: eres una historia que se reescribe.",
    questions: [
      {
        id: "auto_1",
        type: "choice",
        prompt: "Cuando te miras por dentro (no en un espejo), lo que más ves es…",
        refPrompt: "Si Manolo estuviera dudando de sí, ¿qué crees que haría para no perderse?",
        options: [
          "Fortaleza: tengo cosas buenas aunque a veces se me olvide",
          "Exigencia: siento que debo ser perfecta o “bien”",
          "Duda: no sé quién soy bien, estoy en construcción",
          "Crítica: me ataco más de lo que me ayudo"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué parte tuya te cae mejor (aunque sea pequeña)?"
      },
      {
        id: "auto_2",
        type: "choice",
        prompt: "¿Qué te pasa con los halagos o el reconocimiento?",
        refPrompt: "Si María recibiera un halago, ¿cómo crees que lo manejaría?",
        options: [
          "Me cuesta creerlos, pero me gustan",
          "Me dan pena o incomodidad",
          "Los recibo bien y ya",
          "Depende mucho de quién venga"
        ],
        onePhrase: false
      },
      {
        id: "auto_3",
        type: "choice",
        prompt: "Si tuvieras que elegir 1 talento que te acompaña (aunque no lo explotes), ¿cuál se parece más?",
        refPrompt: "Si tu talento tuviera un “poder”, ¿cuál crees que sería en la historia?",
        options: [
          "Creatividad (pintar, imaginar, inventar)",
          "Sensibilidad (capto detalles, me importan las cosas)",
          "Liderazgo (organizo, propongo, muevo gente)",
          "Humor (hago más liviano lo pesado)"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría atreverte a hacer más con ese talento?"
      },
    ]
  },
  {
    id: "amistad",
    name: "Altar de Amistad",
    guide: "María",
    flavor: "Tu tribu importa… y tus límites también.",
    questions: [
      {
        id: "amis_1",
        type: "choice",
        prompt: "Con Julieta, normalmente tú eres la que…",
        refPrompt: "Si María viera tu amistad con Julieta, ¿qué crees que celebraría de ustedes?",
        options: [
          "Se suelta y crea (teatro, ideas, juego) sin miedo",
          "Escucha y acompaña cuando ella está mal",
          "Se adapta para evitar conflictos",
          "Siente que a veces se queda corta / no encaja"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué es lo más bonito de tu amistad con Julieta?"
      },
      {
        id: "amis_2",
        type: "choice",
        prompt: "Con Matías y David, lo que más suele pasar es…",
        refPrompt: "Si Manolo tuviera que cuidarte en esos planes, ¿qué crees que te sugeriría?",
        options: [
          "Me siento incluida y cómoda",
          "Me río, pero no cuento lo importante",
          "Me siento a ratos aparte / como invitada",
          "Depende del día o del plan"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué necesitarías para sentirte más tú con ellos?"
      },
      {
        id: "amis_3",
        type: "choice",
        prompt: "Cuando hay un conflicto con alguien, tú tiendes a…",
        refPrompt: "Si Joaquín tuviera un conflicto, ¿cómo crees que lo encararía primero?",
        options: [
          "Hablarlo pronto (aunque te dé nervios)",
          "Esperar a ver si se arregla solo",
          "Cerrar la puerta (me alejo sin explicar mucho)",
          "Exploto y luego me arrepiento"
        ],
        onePhrase: false
      },
    ]
  },
  {
    id: "escuela",
    name: "Altar de Escuela",
    guide: "El Escenario",
    flavor: "El cole también es un escenario con reglas raras.",
    questions: [
      {
        id: "esco_1",
        type: "choice",
        prompt: "En el colegio Pedro Justo Berrío, lo más difícil para ti suele ser…",
        refPrompt: "Si esto fuera una obra, ¿qué “obstáculo” pondría el guion hoy?",
        options: [
          "La presión por notas / rendimiento",
          "La convivencia (comentarios, grupos, miradas)",
          "La autoridad / reglas / sentir que me controlan",
          "Nada en especial (por ahora lo llevo bien)"
        ],
        onePhrase: true,
        phraseHint: "Una frase: si pudieras cambiar 1 cosa del cole, ¿cuál sería?"
      },
      {
        id: "esco_2",
        type: "choice",
        prompt: "Cuando sientes que te observan o te juzgan, tu reacción suele ser…",
        refPrompt: "Si María se sintiera juzgada, ¿qué haría para no traicionarse a sí misma?",
        options: [
          "Me pongo más seria y me protejo",
          "Actúo “normal” pero por dentro me acelero",
          "Me vuelvo más divertida para disimular",
          "No me afecta tanto"
        ],
        onePhrase: false
      },
      {
        id: "esco_3",
        type: "choice",
        prompt: "¿Qué te gustaría que un profe entendiera mejor de ti?",
        refPrompt: "Si Manolo fuera tu profe por un día, ¿qué crees que notaría de ti?",
        options: [
          "Que soy capaz, pero a veces me bloqueo",
          "Que necesito respeto, no humillación",
          "Que aprendo mejor con creatividad y ejemplos",
          "Que me cuesta hablar cuando me presionan"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te ayudaría a participar más sin sentirte expuesta?"
      },
    ]
  },
  {
    id: "casa",
    name: "Altar de Casa",
    guide: "Laura y Ricardo",
    flavor: "La casa puede ser refugio… o ruido.",
    questions: [
      {
        id: "casa_1",
        type: "choice",
        prompt: "Con tu mamá (Laura), lo que más te pasa es…",
        refPrompt: "Si La Muerte mirara esta escena con tu mamá, ¿qué crees que diría con humor (pero en serio)?",
        options: [
          "Me entiende bastante, aunque discutamos",
          "Me cuida, pero a veces siento control",
          "Me cuesta hablarle: me cierro rápido",
          "Depende: hay días buenísimos y días pesados"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría pedirle a Laura sin pelea?"
      },
      {
        id: "casa_2",
        type: "choice",
        prompt: "Con tu papá (Ricardo), lo más típico es…",
        refPrompt: "Si esto fuera una escena de reconciliación, ¿qué “detalle pequeño” pondrías para acercarse?",
        options: [
          "Me siento cercana y puedo ser yo",
          "Me entiende a su manera, pero le cuesta",
          "Siento distancia o poca presencia",
          "Depende mucho del tema"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría que Ricardo hiciera más (o menos)?"
      },
      {
        id: "casa_3",
        type: "choice",
        prompt: "Cuando en casa hay tensión, tú normalmente…",
        refPrompt: "Si Manolo entrara a esa tensión, ¿qué haría para no incendiar la escena?",
        options: [
          "Intento calmar y mediar",
          "Me encierro en mi mundo",
          "Me engancho y discuto",
          "Hago como si no pasara"
        ],
        onePhrase: false
      },
    ]
  },
  {
    id: "redes",
    name: "Altar de Redes y Comparación",
    guide: "El Espejo Moderno",
    flavor: "A veces el feed habla más fuerte que la realidad.",
    questions: [
      {
        id: "red_1",
        type: "choice",
        prompt: "Cuando ves redes, lo que más te suele pasar es…",
        refPrompt: "Si Xibalba quisiera tentarte con redes, ¿cómo crees que lo haría?",
        options: [
          "Me inspiro (ideas, arte, cosas que quiero aprender)",
          "Me comparo (cuerpo, vida, popularidad) y me baja",
          "Me distraigo y se me va el tiempo",
          "Depende del contenido"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué tipo de contenido te hace bien de verdad?"
      },
      {
        id: "red_2",
        type: "choice",
        prompt: "En chats/grupos, cuando hay drama o indirectas, tú…",
        refPrompt: "Si María viera drama en un chat, ¿qué haría para cuidarse y cuidar el vínculo?",
        options: [
          "Digo algo y pongo límite",
          "Me salgo / silencio / evito",
          "Me engancho y respondo",
          "Leo, pero me quedo callada"
        ],
        onePhrase: false
      },
      {
        id: "red_3",
        type: "choice",
        prompt: "Si pudieras poner una “regla” para cuidarte en redes, sería…",
        refPrompt: "Si Manolo escribiera tu regla en su guitarra, ¿cuál pondría?",
        options: [
          "No entrar cuando estoy sensible",
          "No seguir cuentas que me comparan",
          "Poner horario (y ya)",
          "Compartir menos y vivir más"
        ],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué sería un uso sano de redes para ti (hoy)?"
      },
    ]
  },
];

function buildFlow(theatreMode){
  const flow = [];
  for(const altar of ALTERS){
    for(const q of altar.questions){
      if(theatreMode && q.refPrompt){
        flow.push({
          id: q.id + "_ref",
          altarId: altar.id,
          altarName: altar.name,
          guide: altar.guide,
          flavor: altar.flavor,
          type: q.type,
          prompt: `🎭 ${q.refPrompt}`,
          options: q.options,
          scale: q.scale,
          onePhrase: false,
          isReference: true,
          baseId: q.id,
        });
      }
      flow.push({
        id: q.id + "_you",
        altarId: altar.id,
        altarName: altar.name,
        guide: altar.guide,
        flavor: altar.flavor,
        type: q.type,
        prompt: `🫶 Y tú: ${q.prompt}`,
        options: q.options,
        scale: q.scale,
        onePhrase: q.onePhrase || false,
        phraseHint: q.phraseHint || "",
        isReference: false,
        baseId: q.id,
      });
    }
  }
  return flow;
}

const defaultState = () => ({
  meta: {
    version: "v1.1",
    startedAt: null,
    completedAt: null,
    name: "",
    energy: "media",
    theatreMode: true,
  },
  idx: 0,
  answers: {},
});

let state = defaultState();
let FLOW = [];

function hasSavedProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.idx === "number" && parsed.idx > 0;
  }catch{ return false; }
}

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || ""); }catch{ return null; } }
function clearState(){ localStorage.removeItem(STORAGE_KEY); }

function showScreen(which){
  for(const [k,el] of Object.entries(screens)){
    el.style.display = (k === which) ? "" : "none";
  }
}
function openDialog(dlg){ if(dlg?.showModal) dlg.showModal(); else dlg?.setAttribute("open","open"); }
function closeDialog(dlg){ if(dlg?.close) dlg.close(); else dlg?.removeAttribute("open"); }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function renderQuestion(){
  const q = FLOW[state.idx];
  altarChip.textContent = `${q.altarName} · Guía: ${q.guide}`;
  qTitle.textContent = q.prompt;
  qCounter.textContent = `${state.idx + 1} / ${FLOW.length}`;

  const pct = Math.round(((state.idx) / FLOW.length) * 100);
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${pct}%`;

  const prev = state.answers[q.id] || { value: null, phrase: "" };
  qBody.innerHTML = "";

  const scene = document.createElement("div");
  scene.className = "scene";
  scene.innerHTML = `<div class="prompt">${escapeHtml(q.flavor)}</div>`;
  qBody.appendChild(scene);

  const grid = document.createElement("div");
  grid.className = "choice-grid";

  const opts = q.type === "scale" ? q.scale : q.options;
  opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    if(prev.value === opt) btn.classList.add("selected");
    btn.innerHTML = `<span class="tag">${(i+1)}</span>${escapeHtml(opt)}`;
    btn.addEventListener("click", () => selectChoice(q, opt));
    grid.appendChild(btn);
  });

  qBody.appendChild(grid);

  if(q.onePhrase){
    const wrap = document.createElement("div");
    wrap.className = "onephrase";
    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = q.phraseHint || "Una frase (opcional):";
    const ta = document.createElement("textarea");
    ta.maxLength = 240;
    ta.placeholder = "Escribe una frase… (opcional)";
    ta.value = prev.phrase || "";
    ta.addEventListener("input", () => {
      const cur = state.answers[q.id] || { value: null, phrase: "" };
      cur.phrase = ta.value;
      state.answers[q.id] = cur;
      saveState();
    });
    wrap.appendChild(hint);
    wrap.appendChild(ta);
    qBody.appendChild(wrap);
  }

  btnBack.disabled = (state.idx === 0);
  btnNext.textContent = (state.idx === FLOW.length - 1) ? "Ver resumen" : "Siguiente";
}

function selectChoice(q, value){
  const cur = state.answers[q.id] || { value: null, phrase: "" };
  cur.value = value;
  state.answers[q.id] = cur;
  saveState();
  renderQuestion();
}

function currentAnswerOk(){
  const q = FLOW[state.idx];
  const a = state.answers[q.id];
  return a && a.value;
}

function flashNeedAnswer(){
  btnNext.animate([
    { transform: "translateX(0px)" },
    { transform: "translateX(-6px)" },
    { transform: "translateX(6px)" },
    { transform: "translateX(-4px)" },
    { transform: "translateX(4px)" },
    { transform: "translateX(0px)" },
  ], { duration: 260, easing: "ease-out" });
}

function next(){
  if(!currentAnswerOk()){ flashNeedAnswer(); return; }
  if(state.idx < FLOW.length - 1){
    state.idx++;
    saveState();
    renderQuestion();
  } else complete();
}

function back(){
  state.idx = clamp(state.idx - 1, 0, FLOW.length - 1);
  saveState();
  renderQuestion();
}

function pause(){ saveState(); openDialog(dlgPause); }

function stripHtml(html){
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Gentle inference based on themes (not diagnostic)
function buildValueInference(allAnswers){
  const themes = { coraje:0, honestidad:0, cuidado:0, libertad:0, lealtad:0, respeto:0, justicia:0 };
  const add = (k,n=1)=>{ themes[k]=(themes[k]??0)+n; };
  const pick = (qid)=> allAnswers[qid]?.value || "";
  const has = (s, sub)=> s.toLowerCase().includes(sub.toLowerCase());

  const val = pick("pens_3_you");
  if(has(val,"Respeto")) add("respeto",3);
  if(has(val,"Libertad")) add("libertad",3);
  if(has(val,"Lealtad")) add("lealtad",3);
  if(has(val,"Justicia")) add("justicia",3);

  const conflict = pick("amis_3_you");
  if(has(conflict,"Hablarlo")) add("coraje",2), add("honestidad",1);
  if(has(conflict,"Esperar")) add("cuidado",1);
  if(has(conflict,"alejo")) add("cuidado",1), add("libertad",1);
  if(has(conflict,"Exploto")) add("honestidad",1);

  const selfTalk = pick("pens_1_you");
  if(has(selfTalk,"aprender")) add("coraje",1), add("cuidado",1);
  if(has(selfTalk,"desastre")) add("cuidado",1);
  if(has(selfTalk,"culpa")) add("justicia",1);
  if(has(selfTalk,"blanco")) add("cuidado",1);

  const chat = pick("red_2_you");
  if(has(chat,"límite")) add("respeto",2), add("coraje",1);
  if(has(chat,"salgo")) add("cuidado",1);
  if(has(chat,"engancho")) add("honestidad",1);
  if(has(chat,"callada")) add("cuidado",1);

  const home = pick("casa_3_you");
  if(has(home,"mediar")) add("cuidado",2), add("lealtad",1);
  if(has(home,"encierro")) add("cuidado",1), add("libertad",1);
  if(has(home,"discuto")) add("honestidad",1);
  if(has(home,"no pasara")) add("cuidado",1);

  const sorted = Object.entries(themes).sort((a,b)=>b[1]-a[1]);
  const top = sorted.filter(([,v])=>v>0).slice(0,2).map(([k])=>k);

  if(top.length===0){
    return {
      headline:"Tu historia hoy pide calma y claridad",
      bullets:[
        "Hoy tu escena parece más de observar que de empujar.",
        "Si varias respuestas fueron “depende” o “no sé”, eso también es información."
      ],
      nextStep:"Elige 1 cosa pequeña que te cuide hoy (10 minutos) y hazla sin negociar contigo."
    };
  }
  const t1=top[0], t2=top[1]||null;
  const headline = t2 ? `Tu escena de hoy se mueve entre ${t1} y ${t2}` : `Tu escena de hoy se apoya en ${t1}`;
  const bullets = [
    `Cuando eliges, se nota que te importa el ${t1}.`,
    ...(t2?[`También aparece el ${t2}, como una brújula para no perderte.`]:[]),
    "Esto no es “quién eres para siempre”; es lo que tu historia mostró hoy."
  ];
  const nextStep = t1==="cuidado" ? "Esta semana: practica un límite suave: “ahora no puedo con esto, luego lo hablamos”."
    : t1==="coraje" ? "Esta semana: di una verdad pequeña en una frase (sin explicación larga)."
    : t1==="respeto" ? "Esta semana: elige 1 situación donde te trates con respeto (sin hablarte feo)."
    : t1==="libertad" ? "Esta semana: reserva 10 minutos de algo que sea tuyo (arte, música, movimiento)."
    : t1==="lealtad" ? "Esta semana: pregunta a alguien importante “¿qué necesitas de mí?” y di también lo tuyo."
    : "Esta semana: escribe una frase que te gustaría oír cuando estás difícil, y repítela.";
  return { headline, bullets, nextStep };
}

function summarize(){
  const name = (state.meta.name || "").trim();
  const who = name ? name : "Tú";
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CO", { year:"numeric", month:"long", day:"numeric" });

  const echoLines = [];
  const phraseLines = [];

  for(const q of FLOW){
    if(q.isReference) continue;
    const a = state.answers[q.id];
    if(!a?.value) continue;
    if(echoLines.length < 10){
      echoLines.push(`• ${q.prompt.replace("🫶 Y tú: ","")} → ${a.value}`);
    }
    if(a.phrase && phraseLines.length < 10){
      phraseLines.push(`• ${q.prompt.replace("🫶 Y tú: ","")} — “${a.phrase.trim()}”`);
    }
  }

  const inf = buildValueInference(state.answers);

  const summaryHtml = `
    <h3>Resumen para ${escapeHtml(who)}</h3>
    <p><strong>${escapeHtml(dateStr)}</strong> · Medellín</p>

    <p>
      Hoy hiciste algo valiente: <strong>poner palabras</strong> (aunque sean pocas) a lo que te pasa.
      Este resumen usa el tono de la historia: el recuerdo, el cuidado y el coraje de elegir.
    </p>

    <h3>Lo que se ve en tus respuestas</h3>
    <p class="mono">${escapeHtml(echoLines.join("\\n"))}</p>

    ${phraseLines.length ? `
      <h3>Tus frases</h3>
      <p class="mono">${escapeHtml(phraseLines.join("\\n"))}</p>
    ` : ""}

    <h3>Lo que tu historia sugiere hoy (sin etiqueta, con sentido)</h3>
    <p><strong>${escapeHtml(inf.headline)}</strong></p>
    <ul>
      ${inf.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
    </ul>

    <h3>Un gesto para esta semana</h3>
    <p>${escapeHtml(inf.nextStep)}</p>

    <p class="tiny">
      Si quieres abrir conversación con Sergio, puedes decir: “Hay una parte de mi resumen que quiero explicar mejor”.
    </p>
  `;

  const dataObj = {
    meta: state.meta,
    completedAt: state.meta.completedAt,
    flowLength: FLOW.length,
    answers: state.answers
  };

  const dataHtml = `
    <h3>Datos (registro)</h3>
    <pre class="mono" style="white-space:pre-wrap; overflow:auto;">${escapeHtml(JSON.stringify(dataObj, null, 2))}</pre>
  `;

  return { summaryHtml, dataHtml, dataObj };
}

function complete(){
  state.meta.completedAt = new Date().toISOString();
  saveState();
  showScreen("results");

  const { summaryHtml, dataHtml, dataObj } = summarize();
  panelSummary.innerHTML = summaryHtml;
  panelData.innerHTML = dataHtml;

  panelSummary.dataset.raw = stripHtml(summaryHtml);
  panelData.dataset.raw = JSON.stringify(dataObj, null, 2);
}

function startFresh(){
  state = {
    meta: {
      version: "v1.1",
      startedAt: new Date().toISOString(),
      completedAt: null,
      name: inpName.value.trim(),
      energy: selEnergy.value,
      theatreMode: !!chkTheatre.checked,
    },
    idx: 0,
    answers: {},
  };
  FLOW = buildFlow(state.meta.theatreMode);
  saveState();
  showScreen("quiz");
  renderQuestion();
}

function resume(){
  const loaded = loadState();
  if(!loaded) return;
  state = { ...defaultState(), ...loaded };
  FLOW = buildFlow(!!state.meta.theatreMode);
  showScreen("quiz");
  renderQuestion();
}

function init(){
  btnResume.style.display = hasSavedProgress() ? "" : "none";
}

btnHelp.addEventListener("click", () => openDialog(dlgHelp));
btnCloseHelp.addEventListener("click", () => closeDialog(dlgHelp));

btnStart.addEventListener("click", () => startFresh());
btnResume.addEventListener("click", () => resume());

btnBack.addEventListener("click", () => back());
btnNext.addEventListener("click", () => next());
btnPause.addEventListener("click", () => pause());

btnExitToIntro.addEventListener("click", () => { closeDialog(dlgPause); showScreen("intro"); });
btnKeepGoing.addEventListener("click", () => closeDialog(dlgPause));

btnReset.addEventListener("click", () => {
  if(confirm("¿Seguro que quieres reiniciar y borrar el progreso guardado en este navegador?")){
    clearState();
    state = defaultState();
    btnResume.style.display = hasSavedProgress() ? "" : "none";
    showScreen("intro");
  }
});

btnCopy.addEventListener("click", async () => {
  const text = panelSummary.dataset.raw || stripHtml(panelSummary.innerHTML);
  try{
    await navigator.clipboard.writeText(text);
    btnCopy.textContent = "Copiado ✓";
    setTimeout(() => btnCopy.textContent = "Copiar resumen", 900);
  }catch{
    alert("No pude copiar automáticamente. Puedes seleccionar el texto manualmente.");
  }
});

btnDownload.addEventListener("click", () => {
  const raw = panelData.dataset.raw || "";
  const blob = new Blob([raw], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = (state.meta.name || "respuestas").replaceAll(/[^a-zA-Z0-9_-]+/g,"_");
  a.download = `escenarios_v11_${safeName}_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

btnNew.addEventListener("click", () => {
  clearState();
  state = defaultState();
  btnResume.style.display = "none";
  showScreen("intro");
});

document.addEventListener("keydown", (ev) => {
  if(screens.quiz.style.display === "none") return;
  const q = FLOW[state.idx];
  if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)) return;

  if(ev.key === "Enter"){
    ev.preventDefault();
    next();
  } else if(ev.key === "ArrowLeft"){
    ev.preventDefault();
    back();
  } else if(["1","2","3","4","5"].includes(ev.key)){
    const i = parseInt(ev.key,10) - 1;
    const opts = q.type === "scale" ? q.scale : q.options;
    if(opts?.[i]) selectChoice(q, opts[i]);
  }
});

init();
