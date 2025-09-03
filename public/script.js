// public/script.js

const API = ""; // mesmo host (Codespaces serve /api/*)

let QUESTIONS = [];
let current = 0;
let answers = []; // ["ti", "saude", ...] length 40

const isTest = location.pathname.endsWith("teste.html");
const isResult = location.pathname.endsWith("resultado.html");

if (isTest) initTest();
if (isResult) renderResult();

async function initTest(){
  const res = await fetch(`${API}/api/questions`);
  const data = await res.json();
  QUESTIONS = data.questions || [];
  answers = new Array(QUESTIONS.length).fill(null);

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (current > 0) current--;
    renderQuestion();
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (!answers[current]) { alert("Escolha uma opção para continuar."); return; }
    if (current < QUESTIONS.length - 1){
      current++;
      renderQuestion();
    } else {
      finishTest();
    }
  });

  renderQuestion();
}

function renderQuestion(){
  const q = QUESTIONS[current];
  const qEl = document.getElementById("question");
  const optsEl = document.getElementById("options");
  const progress = document.getElementById("progress");

  qEl.textContent = q.text;
  progress.textContent = `Pergunta ${current + 1} de ${QUESTIONS.length}`;
  document.getElementById("prevBtn").disabled = current === 0;
  document.getElementById("nextBtn").textContent = current === QUESTIONS.length - 1 ? "Finalizar" : "Próxima";

  optsEl.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt.label;
    if (answers[current] === opt.value) btn.classList.add("active");
    btn.onclick = () => {
      answers[current] = opt.value;
      [...optsEl.children].forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
    };
    optsEl.appendChild(btn);
  });
}

async function finishTest(){
  if (answers.some(a => !a)) {
    alert("Responda todas as perguntas antes de finalizar.");
    return;
  }
  const res = await fetch(`${API}/api/result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  });
  const data = await res.json();
  sessionStorage.setItem("vocacao_result", JSON.stringify(data));
  location.href = "./resultado.html";
}

function renderResult(){
  const raw = sessionStorage.getItem("vocacao_result");
  if (!raw){ location.href = "./teste.html"; return; }
  const data = JSON.parse(raw);

  const mapTitle = {
    ti: "Tecnologia da Informação",
    saude: "Saúde",
    exatas: "Engenharias e Exatas",
    humanas: "Ciências Humanas",
    artes: "Artes e Design",
    negocios: "Administração e Negócios",
    comunicacao: "Comunicação e Mídia",
    meioambiente: "Meio Ambiente e Biológicas"
  };

  document.getElementById("winner").textContent =
    `Sua afinidade maior: ${mapTitle[data.winner]} (${data.winner})`;

  const s = data.scores;
  document.getElementById("scores").textContent =
    `Pontuações — TI: ${s.ti} | Saúde: ${s.saude} | Exatas: ${s.exatas} | Humanas: ${s.humanas} | ` +
    `Artes: ${s.artes} | Negócios: ${s.negocios} | Comunicação: ${s.comunicacao} | Meio Ambiente: ${s.meioambiente}`;

  const careersEl = document.getElementById("careers");
  careersEl.innerHTML = "";
  (data.suggestion?.careers || []).forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    careersEl.appendChild(li);
  });
}
