const STORAGE_KEY="ldlv_v13_state";
const $=(s)=>document.querySelector(s);
const screens={intro:$("#screenIntro"),quiz:$("#screenQuiz"),results:$("#screenResults")};

const dlgHelp=$("#dlgHelp"), dlgPause=$("#dlgPause");
const btnStart=$("#btnStart"), btnResume=$("#btnResume"), btnHelp=$("#btnHelp"), btnReset=$("#btnReset");
const inpName=$("#inpName"), selEnergy=$("#selEnergy"), chkTheatre=$("#chkTheatre"), introPara=$("#introPara");
const qTitle=$("#qTitle"), qCounter=$("#qCounter"), qBody=$("#qBody"), altarChip=$("#altarChip");
const progressFill=$("#progressFill"), progressText=$("#progressText");
const btnBack=$("#btnBack"), btnNext=$("#btnNext"), btnPause=$("#btnPause");
const btnCloseHelp=$("#btnCloseHelp"), btnExitToIntro=$("#btnExitToIntro"), btnKeepGoing=$("#btnKeepGoing");
const panelSummary=$("#panel-summary");
let LAST_JSON_RAW = "";

const btnCopy=$("#btnCopy"), btnDownload=$("#btnDownload"), btnNew=$("#btnNew");

const NAMES={girl:"Antonia",bestFriend:"Julieta",friends:["Matías","David"],mom:"Laura",dad:"Ricardo",city:"Medellín",school:"Pedro Justo Berrío"};

introPara.innerHTML = `${NAMES.girl}, este juego está inspirado en la película <strong>El Libro de la Vida</strong>. `
+ `Vamos por <strong>ocho altares</strong> con mini-escenas (como teatro). En modo teatro: `
+ `primero imaginas qué haría un personaje (Manolo, María, Joaquín, la <strong>Catrina</strong> o Xibalba) y luego respondes tú. `
+ `Si te da curiosidad, puedes jugarlo también con ${NAMES.bestFriend} o con ${NAMES.friends.join(" y ")}: `
+ `cada persona cuenta su versión, sin respuestas correctas.`;

const WORLD_CLASS={intro:"world-intro",emocion:"world-emocion",pensamientos:"world-pensamientos",cuerpo:"world-cuerpo",autoestima:"world-autoestima",amistad:"world-amistad",escuela:"world-escuela",casa:"world-casa",redes:"world-redes"};
function setWorld(altarId){
  const body=document.body;
  body.className = body.className.split(" ").filter(c=>!c.startsWith("world-")).join(" ").trim();
  body.classList.add(WORLD_CLASS[altarId]||WORLD_CLASS.intro);
}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function openDialog(d){d?.showModal?d.showModal():d?.setAttribute("open","open");}
function closeDialog(d){d?.close?d.close():d?.removeAttribute("open");}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}

const ALTERS=[
 {id:"emocion",name:"Altar de Emoción",guide:"La Catrina",dot:"rgba(255,91,214,0.95)",questions:[
  {id:"emocion_1",sceneTitle:"Escena: una máscara antes de salir",scene:"Antes de salir a escena, eliges una máscara. No es para mentir: es para protegerte un momento.",
   ref:{type:"choice",prompt:"Si Manolo tuviera que ponerse una máscara hoy, ¿cuál elegiría?",
        options:["Tranquila: se siente estable","Sonriente: por fuera bien, por dentro cargado","Seria: quiere calma y espacio","Confusa: no entiende qué le pasa"]},
   you:{type:"choice",prompt:"Si hoy tú tuvieras una máscara para mostrar cómo estás por dentro, ¿cuál sería?",
        options:["Tranquila: me siento bastante bien","Sonriente: por fuera bien, por dentro cansada","Seria: estoy sensible y prefiero calma","Confusa: no sé bien qué me pasa"],
        onePhrase:true,phraseHint:"Una frase: ¿qué te gustaría que alguien entendiera de tu estado hoy?"}},
  {id:"emocion_2",sceneTitle:"Escena: emoción grande en el pecho",scene:"Sube una emoción fuerte. No hay que pelear con ella: hay que escucharla sin dejar que maneje todo.",
   ref:{type:"choice",prompt:"Si a María le sube una emoción fuerte, ¿qué haría primero para cuidarse?",
        options:["Respirar y bajar el ritmo","Alejarse un momento","Decírselo a alguien de confianza","Hacer como si nada y aguantar"]},
   you:{type:"scale",prompt:"Ahora mismo, tu emoción más grande se siente…",scale:["Muy suave","Suave","Media","Fuerte","Muy fuerte"]}},
  {id:"emocion_3",sceneTitle:"Escena: cuando algo molesta",scene:"Pasa algo que molesta. La emoción suele salir primero… y luego cambia.",
   ref:{type:"choice",prompt:"Si a Joaquín algo le molestara hoy, ¿cómo le saldría primero?",
        options:["Tristeza (se apaga)","Ira (responde rápido)","Ansiedad (se acelera)","Depende del tema"]},
   you:{type:"choice",prompt:"Cuando algo me molesta, mi emoción suele salir primero como…",
        options:["Tristeza","Ira","Ansiedad","Depende"],
        onePhrase:true,phraseHint:"Una frase: ¿qué te ayuda a bajarla cuando aparece?"}},
 ]},
 {id:"pensamientos",name:"Altar de Pensamientos",guide:"Xibalba",dot:"rgba(247,201,72,0.95)",questions:[
  {id:"pens_1",sceneTitle:"Escena: el susurro en la cabeza",scene:"Cuando algo sale mal, aparece una voz interna. A veces ayuda. A veces enreda.",
   ref:{type:"choice",prompt:"Si Xibalba quisiera enredar a Manolo con un pensamiento, ¿cuál le susurraría?",
        options:["“Siempre te equivocas”","“Nunca es tu culpa”","“Mejor no lo intentes”","“Tiene que ser perfecto”"]},
   you:{type:"choice",prompt:"Cuando algo sale mal, mi cabeza suele decirme…",
        options:["“Puedo arreglarlo o aprender.”","“Soy un desastre.”","“No fue mi culpa.”","“Me quedo en blanco.”"],
        onePhrase:true,phraseHint:"Una frase: ¿qué te gustaría decirte a ti misma ahí?"}},
  {id:"pens_2",sceneTitle:"Escena: “no es para tanto”",scene:"Alguien minimiza lo que sientes o piensas. Eso cambia la escena.",
   ref:{type:"choice",prompt:"Si a María le dijeran “no es para tanto”, ¿cómo respondería?",
        options:["“Para mí sí es.”","Se calla y se va","Bromea para bajar tensión","Depende de quién sea"]},
   you:{type:"choice",prompt:"Cuando alguien dice “no es para tanto”, explicarme me sale…",
        options:["Fácil","Más o menos","Difícil","Depende de quién sea"]}},
  {id:"pens_3",sceneTitle:"Escena: el valor protagonista",scene:"Cada historia tiene un valor que la sostiene.",
   ref:{type:"choice",prompt:"Si Manolo eligiera un valor para sostener tu historia, ¿cuál escogería?",
        options:["Respeto","Libertad","Lealtad","Justicia"]},
   you:{type:"choice",prompt:"Si yo elijo 1 valor que me importa, es…",
        options:["Respeto","Libertad","Lealtad","Justicia"],
        onePhrase:true,phraseHint:"Una frase: ¿cuándo sientes que ese valor se te rompe?"}},
 ]},
 {id:"cuerpo",name:"Altar de Cuerpo y Energía",guide:"Joaquín",dot:"rgba(83,213,253,0.95)",questions:[
  {id:"cuerpo_1",sceneTitle:"Escena: el cuerpo avisa",scene:"A veces el cuerpo habla antes que la boca.",
   ref:{type:"choice",prompt:"Si Joaquín estuviera bajo presión, ¿dónde lo notaría primero?",
        options:["Estómago","Cabeza","Pecho","No lo notaría"]},
   you:{type:"choice",prompt:"Cuando estoy bajo presión, mi cuerpo lo nota en…",
        options:["Estómago","Cabeza","Pecho","No lo noto claro"]}},
  {id:"cuerpo_2",sceneTitle:"Escena: 10 minutos para regularte",scene:"En la historia, música y movimiento cambian el ánimo. En la vida real también.",
   ref:{type:"choice",prompt:"Si Manolo necesitara calmarse sin hablar, ¿qué elegiría?",
        options:["Crear (música/arte)","Mover el cuerpo","Silencio a solas","No sabría qué hacer"]},
   you:{type:"choice",prompt:"Para regularme sin hablar, me ayuda más…",
        options:["Pintar/crear","Moverme","Música","No sé"],
        onePhrase:true,phraseHint:"Una frase: si tuvieras 10 minutos hoy, ¿qué harías?"}},
  {id:"cuerpo_3",sceneTitle:"Escena: el medidor de presión",scene:"Imagina un medidor: luces bajas a luces fuertes.",
   ref:{type:"choice",prompt:"Si María notara estrés, ¿qué haría primero?",
        options:["Respira y baja velocidad","Pide espacio","Aguanta","Se distrae fuerte"]},
   you:{type:"scale",prompt:"Mi nivel de estrés hoy es…",scale:["0–1","2–3","4–5","6–7","8–10"],
        onePhrase:true,phraseHint:"Una frase: ¿qué es lo que más te aprieta últimamente?"}},
 ]},
 {id:"autoestima",name:"Altar de Autoestima",guide:"Manolo",dot:"rgba(98,246,181,0.95)",questions:[
  {id:"auto_1",sceneTitle:"Escena: mirarte por dentro",scene:"Hay un espejo que no muestra la cara, sino la forma de hablarte.",
   ref:{type:"choice",prompt:"Si Manolo dudara de sí hoy, ¿qué haría para no perderse?",
        options:["Recuerda algo logrado","Busca una verdad con cariño","Se esconde para no fallar","Hace chistes para no sentir"]},
   you:{type:"choice",prompt:"Cuando me miro por dentro, aparece más…",
        options:["Fortaleza","Exigencia","Duda","Crítica"],
        onePhrase:true,phraseHint:"Una frase: ¿qué parte tuya te cae mejor (aunque sea pequeña)?"}},
  {id:"auto_2",sceneTitle:"Escena: recibir reconocimiento",scene:"Cuando alguien te reconoce, tu cuerpo reacciona.",
   ref:{type:"choice",prompt:"Si a María le hacen un halago, ¿cómo lo recibe?",
        options:["Dice gracias","Se incomoda","No lo cree","Depende"]},
   you:{type:"choice",prompt:"Con los halagos, a mí…",
        options:["Me cuesta creerlos","Me dan pena","Los recibo bien","Depende de quién venga"]}},
  {id:"auto_3",sceneTitle:"Escena: tu talento como poder",scene:"Cada quien tiene un “poder” que se nota en momentos difíciles.",
   ref:{type:"choice",prompt:"Si la Catrina describiera tu poder en una palabra, ¿cuál diría?",
        options:["Creatividad","Sensibilidad","Liderazgo","Humor"]},
   you:{type:"choice",prompt:"Elijo 1 talento que siento que me acompaña:",
        options:["Creatividad","Sensibilidad","Liderazgo","Humor"],
        onePhrase:true,phraseHint:"Una frase: ¿qué te gustaría atreverte a hacer más con ese talento?"}},
 ]},
 {id:"amistad",name:"Altar de Amistad",guide:"María",dot:"rgba(138,107,255,0.95)",questions:[
  {id:"amis_1",sceneTitle:"Escena: tú y Julieta ensayando",scene:`Tú y ${NAMES.bestFriend} inventan una mini obra. Alguien no entiende… pero ustedes sí.`,
   ref:{type:"choice",prompt:`Si María viera tu amistad con ${NAMES.bestFriend}, ¿qué celebraría?`,
        options:["Que crean y juegan","Que se apoyan","Que son sinceras","Que se cuidan con humor"]},
   you:{type:"choice",prompt:`Con ${NAMES.bestFriend}, normalmente yo…`,
        options:["Me suelto y creo","Escucho y acompaño","Me adapto para evitar conflicto","A veces siento que no encajo"],
        onePhrase:true,phraseHint:`Una frase: ¿qué es lo más bonito de tu amistad con ${NAMES.bestFriend}?`}},
  {id:"amis_2",sceneTitle:"Escena: un plan con Matías y David",scene:`Están en un plan de amigos con ${NAMES.friends[0]} y ${NAMES.friends[1]} (charla, risa, estar juntos).`,
   ref:{type:"choice",prompt:`En ese plan, si Manolo quisiera cuidarte, ¿qué te sugeriría?`,
        options:["Ser tú (aunque sea una frase)","Reírte y ya (sin contar lo importante)","Irte si te incomoda","Observar primero y hablar después"]},
   you:{type:"choice",prompt:`Con ${NAMES.friends[0]} y ${NAMES.friends[1]}, lo que más pasa es…`,
        options:["Me siento incluida","Me río pero no cuento lo importante","A ratos me siento aparte","Depende del plan"],
        onePhrase:true,phraseHint:"Una frase: ¿qué necesitarías para sentirte más tú con ellos?"}},
  {id:"amis_3",sceneTitle:"Escena: mini-conflicto",scene:"Un comentario o un silencio tensa la escena.",
   ref:{type:"choice",prompt:"Si Joaquín tuviera un conflicto, ¿qué haría primero?",
        options:["Lo habla de frente","Espera","Se aleja","Explota y luego se arrepiente"]},
   you:{type:"choice",prompt:"Cuando hay un conflicto, yo tiendo a…",
        options:["Hablarlo pronto","Esperar","Alejarme","Explotar y luego arrepentirme"]}},
 ]},
 {id:"escuela",name:"Altar de Escuela",guide:"El Escenario",dot:"rgba(255,140,60,0.95)",questions:[
  {id:"esco_1",sceneTitle:"Escena: hoy en el colegio",scene:`Piensa en un día típico en el colegio ${NAMES.school}. “Esto” es tu día real allá.`,
   ref:{type:"choice",prompt:"En ese día típico, si esto fuera una obra, ¿qué obstáculo pondría el guion hoy?",
        options:["Presión por notas","Convivencia (grupos/miradas)","Reglas/control","Nada fuerte hoy"]},
   you:{type:"choice",prompt:`En el colegio ${NAMES.school}, lo más difícil para mí suele ser…`,
        options:["Notas","Convivencia","Reglas/control","Nada en especial"],
        onePhrase:true,phraseHint:"Una frase: si pudieras cambiar 1 cosa del cole, ¿cuál sería?"}},
  {id:"esco_2",sceneTitle:"Escena: sentirte observada",scene:"De pronto sientes que te miran. Tu cuerpo decide una respuesta.",
   ref:{type:"choice",prompt:"Si María se sintiera juzgada, ¿qué haría para no traicionarse?",
        options:["Pone límite con calma","Se protege y habla menos","Disimula con humor","No le da importancia"]},
   you:{type:"choice",prompt:"Cuando siento que me observan, yo…",
        options:["Me protejo","Me acelero por dentro","Disimulo con humor","No me afecta tanto"]}},
  {id:"esco_3",sceneTitle:"Escena: un profe que sí te ve",scene:"Imagina un profe que te entiende sin presionarte.",
   ref:{type:"choice",prompt:"Si Manolo fuera profe por un día, ¿qué notaría de ti?",
        options:["Eres capaz pero te bloqueas","Necesitas respeto","Aprendes con creatividad","Te cuesta hablar con presión"]},
   you:{type:"choice",prompt:"Me gustaría que un profe entendiera que…",
        options:["Soy capaz pero me bloqueo","Necesito respeto","Aprendo con creatividad","Me cuesta hablar si me presionan"]}},
 ]},
 {id:"casa",name:"Altar de Casa",guide:"Laura y Ricardo",dot:"rgba(83,213,253,0.78)",questions:[
  {id:"casa_1",sceneTitle:"Escena: tu relación cotidiana con tu mamá",scene:`Piensa en la escena cotidiana de tu relación con ${NAMES.mom}, tu mamá: conversaciones, reglas, choques, afecto.`,
   ref:{type:"choice",prompt:`Si la Catrina pudiera ver esa escena cotidiana con ${NAMES.mom}, tu mamá, ¿qué recomendaría?`,
        options:["Menos presión y más verdad","Bajar control y subir respeto","Entenderse mejor (no perfecto)","Dar espacio sin desconectarse"]},
   you:{type:"choice",prompt:`Con mi mamá (${NAMES.mom}), lo que más me pasa es…`,
        options:["Me entiende bastante","Me cuida pero siento control","Me cierro rápido","Depende del día"],
        onePhrase:true,phraseHint:`Una frase: ¿qué te gustaría pedirle a ${NAMES.mom} sin pelea?`}},
  {id:"casa_2",sceneTitle:"Escena: un papá queriendo acercarse más",scene:"En la película, los papás también aprenden. Imagina al papá de María queriendo acercarse más a su hija.",
   ref:{type:"choice",prompt:"Si el papá de María quisiera acercarse más a su hija, ¿qué detalle pequeño haría primero?",
        options:["Conversación corta sin juicio","Actividad breve juntos","Disculpa simple por algo viejo","Mensaje de “estoy aquí” sin presión"]},
   you:{type:"choice",prompt:`Con mi papá (${NAMES.dad}), lo más típico es…`,
        options:["Me siento cercana","Me entiende a su manera","Siento distancia","Depende del tema"],
        onePhrase:true,phraseHint:`Una frase: ¿qué te gustaría que ${NAMES.dad} hiciera más (o menos)?`}},
  {id:"casa_3",sceneTitle:"Escena: tensión en casa (cuando algo se calienta)",scene:"Piensa en un momento real en que en casa sube la tensión (discusión, regaño o malentendido).",
   ref:{type:"choice",prompt:"Si Joaquín entrara a una tensión así, ¿cómo reaccionaría primero?",
        options:["Intentaría mediar","Se encerraría para no empeorar","Discutiría de frente","Haría como si nada"]},
   you:{type:"choice",prompt:"Cuando en casa hay tensión, yo…",
        options:["Intento mediar","Me encierro","Discuto","Hago como si nada"]}},
 ]},
 {id:"redes",name:"Altar de Redes y Comparación",guide:"El Espejo Moderno",dot:"rgba(255,91,214,0.78)",questions:[
  {id:"red_1",sceneTitle:"Escena: redes sociales y ánimo",scene:"Piensa en redes sociales (Instagram, TikTok, etc.). A veces inspiran, a veces bajan el ánimo.",
   ref:{type:"choice",prompt:"Si Xibalba quisiera tentarte con redes sociales, ¿cómo lo haría?",
        options:["Vidas perfectas para compararte","Hacerte perder tiempo y luego culparte","Mucho ruido para no sentir","Meterte en peleas/comentarios"]},
   you:{type:"choice",prompt:"Cuando veo redes sociales, lo que más me suele pasar es…",
        options:["Me inspiro","Me comparo y me baja","Me distraigo y se me va el tiempo","Depende del contenido"],
        onePhrase:true,phraseHint:"Una frase: ¿qué contenido te hace bien de verdad?"}},
  {id:"red_2",sceneTitle:"Escena: drama en un chat",scene:"Aparece una indirecta en un chat. La escena puede escalar… o alguien la corta.",
   ref:{type:"choice",prompt:"Si María viera drama en un chat, ¿qué haría?",
        options:["Poner límite con calma","Salirse y no alimentar","Responder fuerte para que respeten","Leer y quedarse callada"]},
   you:{type:"choice",prompt:"En chats/grupos, cuando hay drama o indirectas, yo…",
        options:["Pongo límite","Me salgo/evito","Me engancho","Leo y me callo"]}},
  {id:"red_3",sceneTitle:"Escena: consejo claro sobre redes sociales",scene:"Imagina que Manolo te da un consejo simple para cuidarte con redes sociales (sin sermón).",
   ref:{type:"choice",prompt:"¿Qué consejo simple crees que te daría Manolo sobre redes sociales?",
        options:["No entrar cuando estás sensible","No seguir cuentas que te comparan","Poner horario y ya","Compartir menos y vivir más"]},
   you:{type:"choice",prompt:"Si yo pusiera una regla para cuidarme en redes sociales, sería…",
        options:["No entrar cuando estoy sensible","No seguir cuentas que me comparan","Poner horario","Compartir menos y vivir más"],
        onePhrase:true,phraseHint:"Una frase: ¿qué sería un uso sano de redes para ti (hoy)?"}},
 ]},
];

function buildFlow(theatreMode){
  const flow=[];
  for(const altar of ALTERS){
    for(const q of altar.questions){
      if(theatreMode && q.ref){
        flow.push({id:q.id+"_ref",altarId:altar.id,altarName:altar.name,guide:altar.guide,dot:altar.dot,sceneTitle:q.sceneTitle,scene:q.scene,modeTag:"🎭 Personaje",...q.ref,isReference:true});
      }
      flow.push({id:q.id+"_you",altarId:altar.id,altarName:altar.name,guide:altar.guide,dot:altar.dot,sceneTitle:q.sceneTitle,scene:q.scene,modeTag:"🫶 Tú",...q.you,isReference:false});
    }
  }
  return flow;
}

const defaultState=()=>({meta:{version:"v1.3",startedAt:null,completedAt:null,name:"",energy:"media",theatreMode:true},idx:0,answers:{}});
let state=defaultState();
let FLOW=[];

function hasSavedProgress(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return false;const p=JSON.parse(raw);return p&&typeof p.idx==="number"&&p.idx>0;}catch{return false;}}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"");}catch{return null;}}
function clearState(){localStorage.removeItem(STORAGE_KEY);}
function showScreen(which){for(const[k,el]of Object.entries(screens))el.style.display=(k===which)?"":"none";}

function setAltarChip(q){altarChip.innerHTML=`<span class="altar-dot" style="background:${q.dot}"></span>${escapeHtml(q.altarName)} · Guía: ${escapeHtml(q.guide)}`;}

function renderQuestion(){
  const q=FLOW[state.idx];
  setWorld(q.altarId);
  setAltarChip(q);
  qTitle.textContent = `${q.modeTag}: ${q.prompt}`;
  qCounter.textContent = `${state.idx+1} / ${FLOW.length}`;
  const pct=Math.round((state.idx/FLOW.length)*100);
  progressFill.style.width=pct+"%"; progressText.textContent=pct+"%";

  const prev=state.answers[q.id]||{value:null,phrase:""};
  qBody.innerHTML="";

  const scene=document.createElement("div");
  scene.className="scene";
  scene.innerHTML=`<div class="scene-title">${escapeHtml(q.sceneTitle)} <span class="scene-badge">${escapeHtml(q.modeTag)}</span></div>
                   <div class="scene-text">${escapeHtml(q.scene)}</div>`;
  qBody.appendChild(scene);

  const grid=document.createElement("div"); grid.className="choice-grid";
  const opts=q.type==="scale"?q.scale:q.options;
  opts.forEach((opt,i)=>{
    const btn=document.createElement("button");
    btn.type="button"; btn.className="choice";
    if(prev.value===opt) btn.classList.add("selected");
    btn.innerHTML=`<span class="tag">${i+1}</span>${escapeHtml(opt)}`;
    btn.addEventListener("click",()=>selectChoice(q,opt));
    grid.appendChild(btn);
  });
  qBody.appendChild(grid);

  if(q.onePhrase){
    const wrap=document.createElement("div"); wrap.className="onephrase";
    const hint=document.createElement("div"); hint.className="hint"; hint.textContent=q.phraseHint||"Una frase (opcional):";
    const ta=document.createElement("textarea"); ta.maxLength=240; ta.placeholder="Escribe una frase… (opcional)"; ta.value=prev.phrase||"";
    ta.addEventListener("input",()=>{const cur=state.answers[q.id]||{value:null,phrase:""};cur.phrase=ta.value;state.answers[q.id]=cur;saveState();});
    wrap.appendChild(hint); wrap.appendChild(ta); qBody.appendChild(wrap);
  }

  btnBack.disabled=(state.idx===0);
  btnNext.textContent=(state.idx===FLOW.length-1)?"Ver resumen":"Siguiente";
}

function selectChoice(q,value){const cur=state.answers[q.id]||{value:null,phrase:""};cur.value=value;state.answers[q.id]=cur;saveState();renderQuestion();}
function currentAnswerOk(){const q=FLOW[state.idx];const a=state.answers[q.id];return a&&a.value;}
function flashNeedAnswer(){btnNext.animate([{transform:"translateX(0px)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0px)"}],{duration:220,easing:"ease-out"});}
function next(){if(!currentAnswerOk()){flashNeedAnswer();return;}if(state.idx<FLOW.length-1){state.idx++;saveState();renderQuestion();}else complete();}
function back(){state.idx=clamp(state.idx-1,0,FLOW.length-1);saveState();renderQuestion();}
function pause(){saveState();openDialog(dlgPause);}
function stripHtml(html){const tmp=document.createElement("div");tmp.innerHTML=html;return tmp.textContent||tmp.innerText||"";}

function buildValueInference(){
  const themes={coraje:0,cuidado:0,respeto:0,libertad:0,lealtad:0,justicia:0,honestidad:0};
  const add=(k,n=1)=>themes[k]=(themes[k]??0)+n;
  const pick=(qid)=>state.answers[qid]?.value||"";
  const v=pick("pens_3_you");
  if(v==="Respeto") add("respeto",3);
  if(v==="Libertad") add("libertad",3);
  if(v==="Lealtad") add("lealtad",3);
  if(v==="Justicia") add("justicia",3);

  const conflict=pick("amis_3_you");
  if(conflict==="Hablarlo pronto") add("coraje",2),add("honestidad",1);
  if(conflict==="Esperar") add("cuidado",1);
  if(conflict==="Alejarme") add("cuidado",1),add("libertad",1);
  if(conflict==="Explotar y luego arrepentirme") add("honestidad",1);

  const sorted=Object.entries(themes).sort((a,b)=>b[1]-a[1]);
  const top=sorted.filter(([,v])=>v>0).slice(0,2).map(([k])=>k);
  if(top.length===0) return {headline:"Tu historia hoy pide calma y claridad",bullets:["Hoy tu escena parece más de observar que de empujar."],nextStep:"Elige 1 cosa pequeña que te cuide hoy (10 minutos) y hazla."};
  const t1=top[0], t2=top[1]||null;
  return {
    headline: t2?`Tu escena de hoy se mueve entre ${t1} y ${t2}`:`Tu escena de hoy se apoya en ${t1}`,
    bullets:[`En tus elecciones aparece fuerte el ${t1}.`, ...(t2?[`También aparece el ${t2}.`]:[]), "Esto no es para siempre: es lo de hoy."],
    nextStep: t1==="cuidado" ? "Esta semana: practica un límite suave: “ahora no puedo con esto, luego lo hablamos”."
      : t1==="coraje" ? "Esta semana: di una verdad pequeña en una frase."
      : t1==="respeto" ? "Esta semana: trátate con respeto 1 vez al día."
      : "Esta semana: elige un gesto pequeño de cuidado."
  };
}

function summarize(){
  const who=(state.meta.name||"").trim()||NAMES.girl;
  const dateStr=new Date().toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"});

  // Group answers (only "Tú")
  const groups = new Map(); // altarName -> {dot, guide, items:[]}
  for(const q of FLOW){
    if(q.isReference) continue;
    const a = state.answers[q.id];
    if(!a?.value) continue;
    if(!groups.has(q.altarName)){
      groups.set(q.altarName, { dot: q.dot, guide: q.guide, items: [] });
    }
    groups.get(q.altarName).items.push({
      prompt: q.prompt,
      value: a.value,
      phrase: (a.phrase||"").trim()
    });
  }

  const inf=buildValueInference();

  const sections = [];
  for(const [altarName, g] of groups.entries()){
    const itemsHtml = g.items.map(it => {
      const phrase = it.phrase ? `<div class="sum-phrase">“${escapeHtml(it.phrase)}”</div>` : "";
      return `<li><div class="sum-q">${escapeHtml(it.prompt)}</div><div class="sum-a">${escapeHtml(it.value)}</div>${phrase}</li>`;
    }).join("");
    sections.push(`
      <div class="sum-block">
        <div class="sum-head">
          <span class="altar-dot" style="background:${g.dot}"></span>
          <div>
            <div class="sum-title">${escapeHtml(altarName)}</div>
            <div class="sum-sub">Guía: ${escapeHtml(g.guide)}</div>
          </div>
        </div>
        <ul class="sum-list">${itemsHtml}</ul>
      </div>
    `);
  }

  const summaryHtml = `
    <h3>Resumen para ${escapeHtml(who)}</h3>
    <p><strong>${escapeHtml(dateStr)}</strong> · ${escapeHtml(NAMES.city)}</p>

    <div class="sum-callout">
      <div><strong>Idea principal de hoy</strong></div>
      <div class="sum-small"><strong>${escapeHtml(inf.headline)}</strong></div>
      <ul>
        ${inf.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}
      </ul>
      <div class="sum-small"><strong>Un gesto para esta semana:</strong> ${escapeHtml(inf.nextStep)}</div>
    </div>

    <h3>Tus respuestas (por altares)</h3>
    <div class="sum-grid">
      ${sections.join("")}
    </div>
  `;

  const dataObj={meta:state.meta,completedAt:state.meta.completedAt,flowLength:FLOW.length,answers:state.answers};
  const dataHtml=""; // ya no se muestra en pantalla
  return {summaryHtml,dataHtml,dataObj};
}

function complete(){
  state.meta.completedAt=new Date().toISOString();
  saveState(); showScreen("results"); setWorld("intro");
  const {summaryHtml,dataHtml,dataObj}=summarize();
  LAST_JSON_RAW = JSON.stringify(dataObj, null, 2);
  panelSummary.innerHTML=summaryHtml;
panelSummary.dataset.raw=stripHtml(summaryHtml);
}

function startFresh(){
  state={meta:{version:"v1.3",startedAt:new Date().toISOString(),completedAt:null,name:inpName.value.trim(),energy:selEnergy.value,theatreMode:!!chkTheatre.checked},idx:0,answers:{}};
  FLOW=buildFlow(state.meta.theatreMode);
  saveState(); showScreen("quiz"); renderQuestion();
}
function resume(){
  const loaded=loadState(); if(!loaded) return;
  state={...defaultState(),...loaded};
  FLOW=buildFlow(!!state.meta.theatreMode);
  showScreen("quiz"); renderQuestion();
}
function init(){ btnResume.style.display=hasSavedProgress()?"":"none"; setWorld("intro"); }

btnHelp.addEventListener("click",()=>openDialog(dlgHelp));
btnCloseHelp.addEventListener("click",()=>closeDialog(dlgHelp));
btnStart.addEventListener("click",()=>startFresh());
btnResume.addEventListener("click",()=>resume());
btnBack.addEventListener("click",()=>back());
btnNext.addEventListener("click",()=>next());
btnPause.addEventListener("click",()=>pause());
btnExitToIntro.addEventListener("click",()=>{closeDialog(dlgPause);showScreen("intro");setWorld("intro");});
btnKeepGoing.addEventListener("click",()=>closeDialog(dlgPause));
btnReset.addEventListener("click",()=>{
  if(confirm("Reiniciar borra las respuestas guardadas en este navegador. ¿Seguro?")){
    clearState(); state=defaultState(); btnResume.style.display=hasSavedProgress()?"":"none"; showScreen("intro"); setWorld("intro");
  }
});
btnCopy.addEventListener("click", async ()=>{
  const text=panelSummary.dataset.raw||stripHtml(panelSummary.innerHTML);
  try{await navigator.clipboard.writeText(text);btnCopy.textContent="Copiado ✓";setTimeout(()=>btnCopy.textContent="Copiar resumen",900);}
  catch{alert("No pude copiar automáticamente. Puedes seleccionar el texto manualmente.");}
});
btnDownload.addEventListener("click",()=>{
  const raw = LAST_JSON_RAW || "";
  const blob=new Blob([raw],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url;
  const safe=(state.meta.name||"respuestas").replaceAll(/[^a-zA-Z0-9_-]+/g,"_");
  a.download=`escenarios_v14_1_${safe}_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});
btnNew.addEventListener("click",()=>{clearState();state=defaultState();btnResume.style.display="none";showScreen("intro");setWorld("intro");});

document.addEventListener("keydown",(ev)=>{
  if(screens.quiz.style.display==="none") return;
  const q=FLOW[state.idx];
  if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)) return;
  if(ev.key==="Enter"){ev.preventDefault();next();}
  else if(ev.key==="ArrowLeft"){ev.preventDefault();back();}
  else if(["1","2","3","4","5"].includes(ev.key)){
    const i=parseInt(ev.key,10)-1;
    const opts=q.type==="scale"?q.scale:q.options;
    if(opts?.[i]) selectChoice(q,opts[i]);
  }
});

init();
