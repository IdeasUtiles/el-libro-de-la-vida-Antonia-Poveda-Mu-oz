/* El Libro de la Vida — Autoevaluación (V1)
   Static app for GitHub Pages. Autosave to localStorage.
*/
const STORAGE_KEY = "ldlv_v1_state";

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

const tabs = Array.from(document.querySelectorAll(".tab"));
const panelHer = $("#panel-her");
const panelSergio = $("#panel-sergio");
const panelData = $("#panel-data");

const btnCopy = $("#btnCopy");
const btnDownload = $("#btnDownload");
const btnNew = $("#btnNew");

/** Data model */
const ALTERS = [
  {
    id: "emocion",
    name: "Altar de Emoción",
    guide: "La Muerte (con humor amable)",
    flavor: "Hoy tu corazón habla en colores.",
    questions: [
      {
        id: "emocion_1",
        type: "choice",
        prompt: "Si hoy tuvieras una máscara para mostrar cómo estás por dentro, ¿cuál sería?",
        options: [
          "Una máscara tranquila: por fuera y por dentro todo va bastante bien",
          "Una máscara sonriente que esconde cansancio o fastidio",
          "Una máscara seria: estoy sensible y prefiero poco ruido",
          "Una máscara confusa: no sé bien qué me pasa hoy"
        ],
        tags: ["Máscara 1","Máscara 2","Máscara 3","Máscara 4"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría que alguien entendiera de tu estado hoy?"
      },
      {
        id: "emocion_2",
        type: "scale",
        prompt: "En este momento, tu emoción más grande se siente…",
        scale: ["Muy suave", "Suave", "Media", "Fuerte", "Muy fuerte"],
        onePhrase: false
      },
      {
        id: "emocion_3",
        type: "choice",
        prompt: "Cuando algo te molesta, normalmente tu emoción sale primero como…",
        options: [
          "Tristeza (me apago, me dan ganas de estar sola)",
          "Ira (me sube rápido y digo cosas fuertes)",
          "Ansiedad (me acelero, me preocupo, me quedo rumiando)",
          "Depende / cambia según el día"
        ],
        tags: ["Tristeza","Ira","Ansiedad","Depende"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te ayudaría a bajar esa emoción cuando aparece?"
      },
    ]
  },
  {
    id: "pensamientos",
    name: "Altar de Pensamientos",
    guide: "Xibalba (pero tú mandas)",
    flavor: "Tus ideas pueden ser luces… o laberintos.",
    questions: [
      {
        id: "pens_1",
        type: "choice",
        prompt: "Cuando te equivocas o algo sale mal, tu cabeza suele decir…",
        options: [
          "“Ok, pasó. Puedo arreglarlo o aprender.”",
          "“Soy un desastre, siempre lo hago mal.”",
          "“No fue mi culpa, fue por…”",
          "“No sé, me quedo en blanco.”"
        ],
        tags: ["Aprendo","Duro","Culpa fuera","Blanco"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría decirte a ti misma en esos momentos?"
      },
      {
        id: "pens_2",
        type: "choice",
        prompt: "¿Qué tan fácil te resulta explicar lo que piensas cuando alguien insiste en que 'no es para tanto'?",
        options: [
          "Fácil: lo digo claro aunque se incomoden",
          "Más o menos: lo intento, pero me canso",
          "Difícil: me cierro y digo poco",
          "Depende de quién sea"
        ],
        tags: ["Fácil","Más o menos","Difícil","Depende"],
        onePhrase: false
      },
      {
        id: "pens_3",
        type: "choice",
        prompt: "Si tuvieras que elegir 1 valor que te importa (aunque a veces no lo digas), ¿cuál se parece más?",
        options: [
          "Respeto (que me traten bien y yo tratar bien)",
          "Libertad (poder ser yo sin tanta presión)",
          "Lealtad (cuidar a mi gente)",
          "Justicia (que las cosas sean 'justas' de verdad)"
        ],
        tags: ["Respeto","Libertad","Lealtad","Justicia"],
        onePhrase: true,
        phraseHint: "Una frase: ¿cuándo sientes que ese valor se te rompe o te lo rompen?"
      },
    ]
  },
  {
    id: "cuerpo",
    name: "Altar de Cuerpo y Energía",
    guide: "Joaquín (vibración + cuerpo)",
    flavor: "Tu cuerpo también tiene voz.",
    questions: [
      {
        id: "cuerpo_1",
        type: "choice",
        prompt: "Cuando estás bajo presión (cole, casa, amigos), tu cuerpo lo nota sobre todo en…",
        options: [
          "Estómago (nudo, dolor, ganas de vomitar)",
          "Cabeza (tensión, dolor, mente acelerada)",
          "Pecho (opresión, respiración corta)",
          "No lo noto claro / depende"
        ],
        tags: ["Estómago","Cabeza","Pecho","Depende"],
        onePhrase: false
      },
      {
        id: "cuerpo_2",
        type: "choice",
        prompt: "¿Qué te ayuda más a regularte sin hablar (solo contigo)?",
        options: [
          "Pintar / dibujar / crear algo",
          "Mover el cuerpo (caminar, bailar, deporte)",
          "Música / auriculares / estar en mi mundo",
          "Nada en especial (me cuesta encontrar algo)"
        ],
        tags: ["Pintar","Mover","Música","Me cuesta"],
        onePhrase: true,
        phraseHint: "Una frase: si tuvieras 10 minutos para cuidarte hoy, ¿qué harías?"
      },
      {
        id: "cuerpo_3",
        type: "scale",
        prompt: "Tu nivel de estrés hoy (sin juzgar):",
        scale: ["0–1","2–3","4–5","6–7","8–10"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué es lo que más te está apretando últimamente?"
      },
    ]
  },
  {
    id: "autoestima",
    name: "Altar de Autoestima",
    guide: "Manolo (arte + corazón)",
    flavor: "No eres un personaje fijo: eres una historia en movimiento.",
    questions: [
      {
        id: "auto_1",
        type: "choice",
        prompt: "Cuando te miras por dentro (no en un espejo), lo que más ves es…",
        options: [
          "Fortaleza: tengo cosas buenas aunque a veces se me olvide",
          "Exigencia: siento que debo ser perfecta o 'bien'",
          "Duda: no sé quién soy bien, estoy en construcción",
          "Crítica: me ataco más de lo que me ayudo"
        ],
        tags: ["Fortaleza","Exigencia","Duda","Crítica"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué parte tuya te cae mejor (aunque sea pequeña)?"
      },
      {
        id: "auto_2",
        type: "choice",
        prompt: "¿Qué te pasa con los halagos o el reconocimiento?",
        options: [
          "Me cuesta creerlos, pero me gustan",
          "Me dan pena o incomodidad",
          "Los recibo bien y ya",
          "Depende mucho de quién venga"
        ],
        tags: ["Me cuesta","Me incomoda","Bien","Depende"],
        onePhrase: false
      },
      {
        id: "auto_3",
        type: "choice",
        prompt: "Si tuvieras que elegir 1 talento que te acompaña (aunque no lo explotes), ¿cuál se parece más?",
        options: [
          "Creatividad (pintar, imaginar, inventar)",
          "Sensibilidad (capto detalles, me importan las cosas)",
          "Liderazgo (organizo, propongo, muevo gente)",
          "Humor (hago más liviano lo pesado)"
        ],
        tags: ["Creatividad","Sensibilidad","Liderazgo","Humor"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría atreverte a hacer más con ese talento?"
      },
    ]
  },
  {
    id: "amistad",
    name: "Altar de Amistad",
    guide: "María (valentía en vínculos)",
    flavor: "Tu tribu importa… y tus límites también.",
    questions: [
      {
        id: "amis_1",
        type: "choice",
        prompt: "Con Julieta, normalmente tú eres la que…",
        options: [
          "Se suelta y crea (teatro, ideas, juego) sin miedo",
          "Escucha y acompaña cuando ella está mal",
          "Se adapta para evitar conflictos",
          "Siente que a veces se queda corta / no encaja"
        ],
        tags: ["Creo","Acompaño","Evito","No encajo"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué es lo más bonito de tu amistad con Julieta?"
      },
      {
        id: "amis_2",
        type: "choice",
        prompt: "Con Matías y David, lo que más suele pasar es…",
        options: [
          "Me siento incluida y cómoda",
          "Me río, pero no cuento lo importante",
          "Me siento a ratos aparte / como invitada",
          "Depende del día o del plan"
        ],
        tags: ["Incluida","Risas","Aparte","Depende"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué necesitarías para sentirte más tú con ellos?"
      },
      {
        id: "amis_3",
        type: "choice",
        prompt: "Cuando hay un conflicto con alguien, tú tiendes a…",
        options: [
          "Hablarlo pronto (aunque te dé nervios)",
          "Esperar a ver si se arregla solo",
          "Cerrar la puerta (me alejo sin explicar mucho)",
          "Exploto y luego me arrepiento"
        ],
        tags: ["Hablo","Espero","Me alejo","Exploto"],
        onePhrase: false
      },
    ]
  },
  {
    id: "escuela",
    name: "Altar de Escuela",
    guide: "El narrador del escenario (teatro)",
    flavor: "El cole también es un escenario con reglas raras.",
    questions: [
      {
        id: "esco_1",
        type: "choice",
        prompt: "En el colegio Pedro Justo Berrío, lo más difícil para ti suele ser…",
        options: [
          "La presión por notas / rendimiento",
          "La convivencia (comentarios, grupos, miradas)",
          "La autoridad / reglas / sentir que me controlan",
          "Nada en especial (por ahora lo llevo bien)"
        ],
        tags: ["Notas","Convivencia","Control","Bien"],
        onePhrase: true,
        phraseHint: "Una frase: si pudieras cambiar 1 cosa del cole, ¿cuál sería?"
      },
      {
        id: "esco_2",
        type: "choice",
        prompt: "Cuando sientes que te observan o te juzgan, tu reacción suele ser…",
        options: [
          "Me pongo más seria y me protejo",
          "Actúo “normal” pero por dentro me acelero",
          "Me vuelvo más divertida para disimular",
          "No me afecta tanto"
        ],
        tags: ["Me protejo","Me acelero","Disimulo","No tanto"],
        onePhrase: false
      },
      {
        id: "esco_3",
        type: "choice",
        prompt: "¿Qué te gustaría que un profe entendiera mejor de ti?",
        options: [
          "Que soy capaz, pero a veces me bloqueo",
          "Que necesito respeto, no humillación",
          "Que aprendo mejor con creatividad y ejemplos",
          "Que me cuesta hablar cuando me presionan"
        ],
        tags: ["Bloqueo","Respeto","Creatividad","Presión"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te ayudaría a participar más sin sentirte expuesta?"
      },
    ]
  },
  {
    id: "casa",
    name: "Altar de Casa",
    guide: "Los que te conocen sin maquillaje",
    flavor: "La casa puede ser refugio… o ruido.",
    questions: [
      {
        id: "casa_1",
        type: "choice",
        prompt: "Con tu mamá (Laura), lo que más te pasa es…",
        options: [
          "Me entiende bastante, aunque discutamos",
          "Me cuida, pero a veces siento control",
          "Me cuesta hablarle: me cierro rápido",
          "Depende: hay días buenísimos y días pesados"
        ],
        tags: ["Me entiende","Control","Me cierro","Depende"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría pedirle a Laura sin pelea?"
      },
      {
        id: "casa_2",
        type: "choice",
        prompt: "Con tu papá (Ricardo), lo más típico es…",
        options: [
          "Me siento cercana y puedo ser yo",
          "Me entiende a su manera, pero le cuesta",
          "Siento distancia o poca presencia",
          "Depende mucho del tema"
        ],
        tags: ["Cercanía","A su manera","Distancia","Depende"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué te gustaría que Ricardo hiciera más (o menos)?"
      },
      {
        id: "casa_3",
        type: "choice",
        prompt: "Cuando en casa hay tensión, tú normalmente…",
        options: [
          "Intento calmar y mediar",
          "Me encierro en mi mundo",
          "Me engancho y discuto",
          "Hago como si no pasara"
        ],
        tags: ["Mediar","Me encierro","Discuto","Ignoro"],
        onePhrase: false
      },
    ]
  },
  {
    id: "redes",
    name: "Altar de Redes y Comparación",
    guide: "El espejo moderno (sin magia)",
    flavor: "A veces el feed habla más fuerte que la realidad.",
    questions: [
      {
        id: "red_1",
        type: "choice",
        prompt: "Cuando ves redes, lo que más te suele pasar es…",
        options: [
          "Me inspiro (ideas, arte, cosas que quiero aprender)",
          "Me comparo (cuerpo, vida, popularidad) y me baja",
          "Me distraigo y se me va el tiempo",
          "Depende del contenido"
        ],
        tags: ["Inspiro","Comparo","Me pierdo","Depende"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué tipo de contenido te hace bien de verdad?"
      },
      {
        id: "red_2",
        type: "choice",
        prompt: "En chats/grupos, cuando hay drama o indirectas, tú…",
        options: [
          "Digo algo y pongo límite",
          "Me salgo / silencio / evito",
          "Me engancho y respondo",
          "Leo, pero me quedo callada"
        ],
        tags: ["Límite","Evito","Me engancho","Callada"],
        onePhrase: false
      },
      {
        id: "red_3",
        type: "choice",
        prompt: "Si pudieras poner una “regla” para cuidarte en redes, sería…",
        options: [
          "No entrar cuando estoy sensible",
          "No seguir cuentas que me comparan",
          "Poner horario (y ya)",
          "Compartir menos y vivir más"
        ],
        tags: ["Estado","Cuentas","Horario","Vivir"],
        onePhrase: true,
        phraseHint: "Una frase: ¿qué sería un uso sano de redes para ti (hoy)?"
      },
    ]
  },
];

function buildFlow(){
  // Flatten questions
  const flow = [];
  for(const altar of ALTERS){
    for(const q of altar.questions){
      flow.push({ altarId: altar.id, altarName: altar.name, guide: altar.guide, flavor: altar.flavor, ...q });
    }
  }
  return flow;
}

const FLOW = buildFlow();

const defaultState = () => ({
  meta: {
    version: "v1",
    startedAt: null,
    completedAt: null,
    name: "",
    energy: "media",
  },
  idx: 0,
  answers: {},      // qid -> {value, phrase?}
});

let state = defaultState();

function hasSavedProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.idx === "number" && parsed.idx > 0 && parsed.idx < FLOW.length;
  }catch{ return false; }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return null;
  try{
    return JSON.parse(raw);
  }catch{
    return null;
  }
}

function clearState(){
  localStorage.removeItem(STORAGE_KEY);
}

function showScreen(which){
  for(const [k,el] of Object.entries(screens)){
    el.style.display = (k === which) ? "" : "none";
  }
}

function openDialog(dlg){
  if(typeof dlg.showModal === "function") dlg.showModal();
  else dlg.setAttribute("open","open");
}
function closeDialog(dlg){
  if(typeof dlg.close === "function") dlg.close();
  else dlg.removeAttribute("open");
}

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function setTab(tabId){
  tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
  panelHer.style.display = tabId === "her" ? "" : "none";
  panelSergio.style.display = tabId === "sergio" ? "" : "none";
  panelData.style.display = tabId === "data" ? "" : "none";
}

function getChoiceValue(q, idx){
  return q.options[idx];
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

  // Build body
  qBody.innerHTML = "";

  const flavor = document.createElement("div");
  flavor.className = "prompt";
  flavor.textContent = q.flavor;
  qBody.appendChild(flavor);

  if(q.type === "choice"){
    const grid = document.createElement("div");
    grid.className = "choice-grid";

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      if(prev.value === opt) btn.classList.add("selected");
      btn.innerHTML = `<span class="tag">${(i+1)}</span>${escapeHtml(opt)}`;
      btn.addEventListener("click", () => {
        selectChoice(q, opt);
      });
      grid.appendChild(btn);
    });

    qBody.appendChild(grid);
  } else if(q.type === "scale"){
    const grid = document.createElement("div");
    grid.className = "choice-grid";

    q.scale.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      if(prev.value === opt) btn.classList.add("selected");
      btn.innerHTML = `<span class="tag">${(i+1)}</span>${escapeHtml(opt)}`;
      btn.addEventListener("click", () => {
        selectChoice(q, opt);
      });
      grid.appendChild(btn);
    });

    qBody.appendChild(grid);
  }

  // One phrase field if enabled
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

  // Buttons
  btnBack.disabled = (state.idx === 0);
  btnNext.textContent = (state.idx === FLOW.length - 1) ? "Ver resultados" : "Siguiente";
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
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
  // Allow unanswered? prefer at least a choice.
  return a && a.value;
}

function next(){
  if(!currentAnswerOk()){
    flashNeedAnswer();
    return;
  }
  if(state.idx < FLOW.length - 1){
    state.idx++;
    saveState();
    renderQuestion();
    return;
  }
  complete();
}

function back(){
  state.idx = clamp(state.idx - 1, 0, FLOW.length - 1);
  saveState();
  renderQuestion();
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

function summarize(){
  const name = (state.meta.name || "").trim();
  const who = name ? name : "Tú";
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CO", { year:"numeric", month:"long", day:"numeric" });

  // Helper to get answer text
  const ans = (id) => (state.answers[id]?.value || "");
  const phr = (id) => (state.answers[id]?.phrase || "").trim();

  // Pull some highlights (no inference, just echo choices)
  const highlightLines = [];
  const phraseLines = [];

  for(const q of FLOW){
    const a = state.answers[q.id];
    if(!a?.value) continue;
    // keep 8-12 highlights
    if(highlightLines.length < 10){
      highlightLines.push(`• ${q.prompt} → ${a.value}`);
    }
    if(a.phrase){
      phraseLines.push(`• ${q.prompt} — “${a.phrase.trim()}”`);
    }
  }

  const forHer = `
  <h3>Carta para ${escapeHtml(who)}</h3>
  <p><strong>${escapeHtml(dateStr)}</strong></p>
  <p>
    Hoy jugaste a responderte sin presión. No es un diagnóstico, es una foto del momento.
    Lo valioso es que <strong>tú</strong> elegiste palabras para contar cómo estás.
  </p>

  <p><strong>Lo que dijiste hoy, con tus propias elecciones:</strong></p>
  <p class="mono">${escapeHtml(highlightLines.slice(0,8).join("\n"))}</p>

  ${phraseLines.length ? `
    <p><strong>Tus frases (las que quisiste escribir):</strong></p>
    <p class="mono">${escapeHtml(phraseLines.slice(0,8).join("\n"))}</p>
  ` : ""}

  <p><strong>Un cierre estilo “Libro de la Vida”:</strong></p>
  <p>
    Si hoy fuera una escena de teatro, tu personaje no está “bien” o “mal”: está <em>vivo</em>.
    Y lo más potente de un personaje vivo es que puede ensayar otra forma de cuidarse.
  </p>

  <p class="tiny">
    Si algo de esto te da ganas de hablar, puedes decir: “Hay una parte de mis respuestas que quiero explicar mejor.”
  </p>
  `;

  const forSergio = `
  <h3>Resumen para Sergio (sin inferencias)</h3>
  <p><strong>${escapeHtml(dateStr)}</strong> · Sesión por videollamada · Colegio: Pedro Justo Berrío (Medellín)</p>

  <p><strong>Datos de inicio:</strong></p>
  <p class="mono">${escapeHtml([
    `Nombre (opcional): ${name || "(no indicado)"}`,
    `Energía reportada: ${state.meta.energy}`,
    `Avance completado: ${FLOW.length}/${FLOW.length}`
  ].join("\n"))}</p>

  <p><strong>Resumen de respuestas (selecciones):</strong></p>
  <p class="mono">${escapeHtml(highlightLines.join("\n"))}</p>

  ${phraseLines.length ? `
    <p><strong>Frases escritas (textos breves):</strong></p>
    <p class="mono">${escapeHtml(phraseLines.join("\n"))}</p>
  ` : ""}

  <p class="tiny">
    Nota: este resumen no interpreta ni etiqueta. Solo refleja lo que ella eligió y escribió hoy.
  </p>
  `;

  const dataObj = {
    meta: state.meta,
    completedAt: state.meta.completedAt,
    flowLength: FLOW.length,
    answers: state.answers,
    questions: FLOW.map(q => ({
      id: q.id,
      altarId: q.altarId,
      altarName: q.altarName,
      prompt: q.prompt,
      type: q.type
    }))
  };

  const forData = `
  <h3>Datos</h3>
  <p>Esto es lo que se puede descargar en JSON (útil para guardar en tu registro).</p>
  <pre class="mono" style="white-space:pre-wrap; overflow:auto;">${escapeHtml(JSON.stringify(dataObj, null, 2))}</pre>
  `;

  return { forHer, forSergio, forData, dataObj };
}

function complete(){
  state.meta.completedAt = new Date().toISOString();
  saveState();
  showScreen("results");

  const { forHer, forSergio, forData, dataObj } = summarize();
  panelHer.innerHTML = forHer;
  panelSergio.innerHTML = forSergio;
  panelData.innerHTML = forData;

  setTab("her");

  // Store computed for copy/download
  panelHer.dataset.raw = stripHtml(forHer);
  panelSergio.dataset.raw = stripHtml(forSergio);
  panelData.dataset.raw = JSON.stringify(dataObj, null, 2);
}

function stripHtml(html){
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function startFresh(){
  state = defaultState();
  state.meta.startedAt = new Date().toISOString();
  state.meta.name = inpName.value.trim();
  state.meta.energy = selEnergy.value;
  saveState();
  showScreen("quiz");
  renderQuestion();
}

function resume(){
  const loaded = loadState();
  if(!loaded){ return; }
  // Minimal validation
  state = { ...defaultState(), ...loaded };
  showScreen("quiz");
  renderQuestion();
}

function pause(){
  saveState();
  openDialog(dlgPause);
}

// Events
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
  const active = document.querySelector(".tab.active")?.dataset.tab || "her";
  let text = "";
  if(active === "her") text = panelHer.dataset.raw || stripHtml(panelHer.innerHTML);
  if(active === "sergio") text = panelSergio.dataset.raw || stripHtml(panelSergio.innerHTML);
  if(active === "data") text = panelData.dataset.raw || stripHtml(panelData.innerHTML);

  try{
    await navigator.clipboard.writeText(text);
    btnCopy.textContent = "Copiado ✓";
    setTimeout(() => btnCopy.textContent = "Copiar pestaña", 900);
  }catch{
    alert("No pude copiar automáticamente. Puedes seleccionar el texto manualmente.");
  }
});

btnDownload.addEventListener("click", () => {
  const activeData = panelData.dataset.raw || "";
  const blob = new Blob([activeData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = (state.meta.name || "respuestas").replaceAll(/[^a-zA-Z0-9_-]+/g,"_");
  a.download = `ldlv_v1_${safeName}_${new Date().toISOString().slice(0,10)}.json`;
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

// Tabs
tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

// Keyboard shortcuts (helpful when Sergio comparte pantalla)
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
    if(q.type === "choice" && q.options[i]) selectChoice(q, q.options[i]);
    if(q.type === "scale" && q.scale[i]) selectChoice(q, q.scale[i]);
  }
});

// Init
(function init(){
  btnResume.style.display = hasSavedProgress() ? "" : "none";
})();
