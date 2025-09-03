// server.js (CommonJS)
const express = require("express");
const cors = require("cors");
const path = require("path");
const { db, initDb } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));


initDb();

/**
 * ÁREAS (chaves usadas no código):
 *  - ti
 *  - saude
 *  - exatas
 *  - humanas
 *  - artes
 *  - negocios
 *  - comunicacao
 *  - meioambiente
 *
 * Cada pergunta tem 5 opções (sempre).
 */

// 40 PERGUNTAS (5 opções por pergunta)
const QUESTIONS = [
  {
    id: 1,
    text: "O que mais te anima ao começar um projeto?",
    options: [
      { label: "Codar e prototipar soluções digitais", value: "ti" },
      { label: "Impactar positivamente a saúde das pessoas", value: "saude" },
      { label: "Resolver com cálculos e lógica", value: "exatas" },
      { label: "Entender pessoas e contextos sociais", value: "humanas" },
      { label: "Criar algo visualmente marcante", value: "artes" }
    ]
  },
  {
    id: 2,
    text: "Em um trabalho em equipe, você tende a assumir o papel de...",
    options: [
      { label: "Dev/Arquiteto de software", value: "ti" },
      { label: "Cuidar do bem-estar do grupo", value: "saude" },
      { label: "Organizar dados e métricas", value: "exatas" },
      { label: "Mediar conflitos e facilitar diálogos", value: "humanas" },
      { label: "Direção de arte/identidade visual", value: "artes" }
    ]
  },
  {
    id: 3,
    text: "Qual trilha de aprendizado te atrai mais no curto prazo?",
    options: [
      { label: "Desenvolvimento Web/Mobile", value: "ti" },
      { label: "Primeiros socorros e saúde preventiva", value: "saude" },
      { label: "Estatística aplicada", value: "exatas" },
      { label: "Psicologia e educação", value: "humanas" },
      { label: "Design gráfico e UI", value: "artes" }
    ]
  },
  {
    id: 4,
    text: "Se você abrisse um canal, o conteúdo seria mais sobre...",
    options: [
      { label: "Tecnologia e automação", value: "ti" },
      { label: "Hábitos saudáveis e bem-estar", value: "saude" },
      { label: "Matemática prática/finanças", value: "exatas" },
      { label: "Sociologia e atualidades", value: "humanas" },
      { label: "Arte, design e criatividade", value: "artes" }
    ]
  },
  {
    id: 5,
    text: "Qual tipo de desafio te dá prazer de resolver?",
    options: [
      { label: "Debugar e integrar APIs", value: "ti" },
      { label: "Investigar causas de sintomas/problemas", value: "saude" },
      { label: "Otimizar modelos/algoritmos", value: "exatas" },
      { label: "Analisar comportamentos humanos", value: "humanas" },
      { label: "Criar identidade visual do zero", value: "artes" }
    ]
  },
  {
    id: 6,
    text: "Se pudesse estagiar amanhã, preferia em...",
    options: [
      { label: "Startup de software", value: "ti" },
      { label: "Clínica ou laboratório", value: "saude" },
      { label: "Empresa de engenharia", value: "exatas" },
      { label: "ONG/secretaria de educação", value: "humanas" },
      { label: "Estúdio de design", value: "artes" }
    ]
  },
  {
    id: 7,
    text: "Quando erra, sua reação mais comum é...",
    options: [
      { label: "Fazer debug e testes unitários", value: "ti" },
      { label: "Rever protocolos e prevenção", value: "saude" },
      { label: "Checar fórmulas e hipóteses", value: "exatas" },
      { label: "Pedir feedback e dialogar", value: "humanas" },
      { label: "Buscar novas referências criativas", value: "artes" }
    ]
  },
  {
    id: 8,
    text: "Que tipo de resultado te dá satisfação?",
    options: [
      { label: "Feature rodando liso", value: "ti" },
      { label: "Paciente/usuário melhorando", value: "saude" },
      { label: "Modelo preciso e eficiente", value: "exatas" },
      { label: "Transformação social real", value: "humanas" },
      { label: "Projeto bonito e original", value: "artes" }
    ]
  },
  {
    id: 9,
    text: "Em termos de carreira, você se imagina...",
    options: [
      { label: "Criando produtos digitais", value: "ti" },
      { label: "Atendendo pessoas", value: "saude" },
      { label: "Projetando soluções físicas", value: "exatas" },
      { label: "Liderando projetos sociais", value: "humanas" },
      { label: "Criando marcas/experiências", value: "artes" }
    ]
  },
  {
    id: 10,
    text: "Qual elogio combina mais com você?",
    options: [
      { label: "“Resolve e entrega rápido”", value: "ti" },
      { label: "“Empático e atencioso”", value: "saude" },
      { label: "“Preciso e lógico”", value: "exatas" },
      { label: "“Comunica e engaja”", value: "humanas" },
      { label: "“Criativo e original”", value: "artes" }
    ]
  },

  // Agora vamos incluir as demais áreas (negócios, comunicação, meio ambiente) distribuídas
  {
    id: 11,
    text: "Se fosse abrir um projeto, qual foco teria?",
    options: [
      { label: "App para resolver dor real", value: "ti" },
      { label: "Programa de saúde na escola", value: "saude" },
      { label: "Otimização de processos com dados", value: "exatas" },
      { label: "Plano de negócios e expansão", value: "negocios" },
      { label: "Campanha de comunicação eficiente", value: "comunicacao" }
    ]
  },
  {
    id: 12,
    text: "Qual dessas atividades te deixa no flow?",
    options: [
      { label: "Codar por horas", value: "ti" },
      { label: "Atender/acolher pessoas", value: "saude" },
      { label: "Modelar/experimentar", value: "exatas" },
      { label: "Pitch e networking", value: "negocios" },
      { label: "Criar roteiro/conteúdo", value: "comunicacao" }
    ]
  },
  {
    id: 13,
    text: "Qual setor te chama mais a atenção hoje?",
    options: [
      { label: "SaaS e IA aplicada", value: "ti" },
      { label: "Telemedicina e saúde digital", value: "saude" },
      { label: "Engenharias e infraestrutura", value: "exatas" },
      { label: "Varejo/Startups de negócio", value: "negocios" },
      { label: "Mídias sociais e jornalismo", value: "comunicacao" }
    ]
  },
  {
    id: 14,
    text: "Se pudesse contribuir com o planeta agora, faria...",
    options: [
      { label: "Tech para eficiência energética", value: "ti" },
      { label: "Programas de saúde coletiva", value: "saude" },
      { label: "Soluções de saneamento", value: "exatas" },
      { label: "Educação financeira popular", value: "negocios" },
      { label: "Projetos de preservação ambiental", value: "meioambiente" }
    ]
  },
  {
    id: 15,
    text: "Qual ferramenta você dominaria com gosto?",
    options: [
      { label: "Frameworks/Cloud/DevOps", value: "ti" },
      { label: "Protocolos e prontuários", value: "saude" },
      { label: "CAD/Simulação", value: "exatas" },
      { label: "CRM/Planos e métricas", value: "negocios" },
      { label: "Gestão de conteúdo/mídias", value: "comunicacao" }
    ]
  },
  {
    id: 16,
    text: "Num curso extra, você escolheria...",
    options: [
      { label: "Back-end/Front-end", value: "ti" },
      { label: "Nutrição/Enfermagem básica", value: "saude" },
      { label: "Cálculo/Estatística aplicada", value: "exatas" },
      { label: "Empreendedorismo/Marketing", value: "negocios" },
      { label: "Storytelling e oratória", value: "comunicacao" }
    ]
  },
  {
    id: 17,
    text: "Que tipo de notícia te prende?",
    options: [
      { label: "Lançamentos de tecnologia", value: "ti" },
      { label: "Avanços em tratamentos", value: "saude" },
      { label: "Inovação em engenharia", value: "exatas" },
      { label: "Resultados de mercado", value: "negocios" },
      { label: "Impactos climáticos", value: "meioambiente" }
    ]
  },
  {
    id: 18,
    text: "Qual saída de carreira te parece mais natural?",
    options: [
      { label: "Desenvolvedor/Eng. Software", value: "ti" },
      { label: "Enfermeiro/Psicólogo", value: "saude" },
      { label: "Engenheiro/Arquiteto", value: "exatas" },
      { label: "Gestor/Empreendedor", value: "negocios" },
      { label: "Jornalista/Publicitário", value: "comunicacao" }
    ]
  },
  {
    id: 19,
    text: "Se fosse montar um TCC paralelo, seria sobre...",
    options: [
      { label: "App com IA para estudo", value: "ti" },
      { label: "Programa de prevenção à ansiedade", value: "saude" },
      { label: "Automação de processos fabris", value: "exatas" },
      { label: "Plano de negócios de e-commerce", value: "negocios" },
      { label: "Educação ambiental em escolas", value: "meioambiente" }
    ]
  },
  {
    id: 20,
    text: "Qual habilidade gostaria de aprofundar agora?",
    options: [
      { label: "Arquitetura de software", value: "ti" },
      { label: "Comunicação empática", value: "saude" },
      { label: "Modelagem matemática", value: "exatas" },
      { label: "Gestão de times e finanças", value: "negocios" },
      { label: "Comunicação de massa", value: "comunicacao" }
    ]
  },

  // Misturando novamente com artes/humanas/ambiente para balancear
  {
    id: 21,
    text: "Qual ambiente de trabalho te atrai mais?",
    options: [
      { label: "Startup de tecnologia", value: "ti" },
      { label: "Hospital/Clínica/UBS", value: "saude" },
      { label: "Obra/Lab de engenharia", value: "exatas" },
      { label: "Agência/Estúdio criativo", value: "artes" },
      { label: "Institutos/ONGs socioambientais", value: "meioambiente" }
    ]
  },
  {
    id: 22,
    text: "Quando pensa em estudo, você prefere...",
    options: [
      { label: "Projetos práticos de código", value: "ti" },
      { label: "Casos reais com pessoas", value: "saude" },
      { label: "Listas e experimentos", value: "exatas" },
      { label: "Leitura e debates", value: "humanas" },
      { label: "Portfólio criativo", value: "artes" }
    ]
  },
  {
    id: 23,
    text: "Qual impacto você mais busca gerar?",
    options: [
      { label: "Escalar soluções digitais", value: "ti" },
      { label: "Qualidade de vida direta", value: "saude" },
      { label: "Eficiência e segurança", value: "exatas" },
      { label: "Consciência e justiça social", value: "humanas" },
      { label: "Cultura e expressão", value: "artes" }
    ]
  },
  {
    id: 24,
    text: "Uma habilidade que você valoriza muito é...",
    options: [
      { label: "Pensamento sistêmico", value: "ti" },
      { label: "Empatia e escuta", value: "saude" },
      { label: "Raciocínio lógico", value: "exatas" },
      { label: "Comunicação interpessoal", value: "humanas" },
      { label: "Criatividade original", value: "artes" }
    ]
  },
  {
    id: 25,
    text: "Se pudesse passar um dia com um profissional, seria...",
    options: [
      { label: "Eng. de Software", value: "ti" },
      { label: "Psicólogo/Nutricionista", value: "saude" },
      { label: "Engenheiro Civil", value: "exatas" },
      { label: "Professor/Pesquisador", value: "humanas" },
      { label: "Designer/Ilustrador", value: "artes" }
    ]
  },
  {
    id: 26,
    text: "Qual dessas missões te motiva mais?",
    options: [
      { label: "Automatizar rotinas chatas", value: "ti" },
      { label: "Reduzir filas e sofrimento", value: "saude" },
      { label: "Planejar obras seguras", value: "exatas" },
      { label: "Educar e orientar pessoas", value: "humanas" },
      { label: "Contar histórias visuais", value: "artes" }
    ]
  },
  {
    id: 27,
    text: "O que você mais curte em tecnologia?",
    options: [
      { label: "Criar do zero e iterar", value: "ti" },
      { label: "Telemedicina/wearables", value: "saude" },
      { label: "Cálculo/IA/robotização", value: "exatas" },
      { label: "Plataformas educacionais", value: "humanas" },
      { label: "Ferramentas de design", value: "artes" }
    ]
  },
  {
    id: 28,
    text: "Se fosse mentor, seria na área de...",
    options: [
      { label: "Programação/Cloud", value: "ti" },
      { label: "Saúde mental/nutrição", value: "saude" },
      { label: "Matemática/Física", value: "exatas" },
      { label: "Carreiras e estudos", value: "humanas" },
      { label: "Portfólio/Branding", value: "artes" }
    ]
  },
  {
    id: 29,
    text: "Que tipo de problema público você escolheria resolver?",
    options: [
      { label: "Serviços digitais eficientes", value: "ti" },
      { label: "Acesso à saúde básica", value: "saude" },
      { label: "Mobilidade e energia", value: "exatas" },
      { label: "Educação e inclusão", value: "humanas" },
      { label: "Cultura e espaços criativos", value: "artes" }
    ]
  },
  {
    id: 30,
    text: "Qual dessas metas te parece mais a sua cara?",
    options: [
      { label: "Escalar um produto SaaS", value: "ti" },
      { label: "Implementar programa de saúde", value: "saude" },
      { label: "Projetar uma ponte/edifício", value: "exatas" },
      { label: "Criar uma escola/projeto social", value: "humanas" },
      { label: "Expor uma coleção de design", value: "artes" }
    ]
  },
  {
    id: 31,
    text: "De qual destes relatórios você gostaria de cuidar?",
    options: [
      { label: "Logs/erros e performance", value: "ti" },
      { label: "Prontuários e evolução", value: "saude" },
      { label: "Planilhas de medição", value: "exatas" },
      { label: "Indicadores educacionais", value: "humanas" },
      { label: "Guia de identidade visual", value: "artes" }
    ]
  },
  {
    id: 32,
    text: "Em eventos, você prefere...",
    options: [
      { label: "Hackathons e meetups tech", value: "ti" },
      { label: "Congressos de saúde", value: "saude" },
      { label: "Feiras de engenharia", value: "exatas" },
      { label: "Feiras de negócios", value: "negocios" },
      { label: "Eventos de comunicação/mídia", value: "comunicacao" }
    ]
  },
  {
    id: 33,
    text: "Quando lê um artigo, você procura...",
    options: [
      { label: "Novas stacks e métodos", value: "ti" },
      { label: "Estudos de caso clínico", value: "saude" },
      { label: "Modelos e fórmulas", value: "exatas" },
      { label: "Estratégias de mercado", value: "negocios" },
      { label: "Linguagem e narrativa", value: "comunicacao" }
    ]
  },
  {
    id: 34,
    text: "O que te motiva a levantar da cama?",
    options: [
      { label: "Construir coisas úteis", value: "ti" },
      { label: "Cuidar de pessoas", value: "saude" },
      { label: "Resolver problemas difíceis", value: "exatas" },
      { label: "Ajudar gente a aprender", value: "humanas" },
      { label: "Expressar criatividade", value: "artes" }
    ]
  },
  {
    id: 35,
    text: "Qual destas métricas você gostaria de acompanhar?",
    options: [
      { label: "DAU/MAU e retenção", value: "ti" },
      { label: "Indicadores de saúde", value: "saude" },
      { label: "KPIs de qualidade técnica", value: "exatas" },
      { label: "LTV/CAC e NPS", value: "negocios" },
      { label: "Alcance/engajamento", value: "comunicacao" }
    ]
  },
  {
    id: 36,
    text: "Qual projeto escolar te deixou orgulhoso?",
    options: [
      { label: "Site/app funcional", value: "ti" },
      { label: "Campanha de saúde", value: "saude" },
      { label: "Experimento/cálculo difícil", value: "exatas" },
      { label: "Feira de empreendedorismo", value: "negocios" },
      { label: "Jornal/Podcast escolar", value: "comunicacao" }
    ]
  },
  {
    id: 37,
    text: "Se fosse voluntário hoje, escolheria...",
    options: [
      { label: "Trilha de capacitação digital", value: "ti" },
      { label: "Ações de saúde comunitária", value: "saude" },
      { label: "Mutirão de melhorias urbanas", value: "exatas" },
      { label: "Apoio educacional/mentoria", value: "humanas" },
      { label: "Mutirão de limpeza/reciclagem", value: "meioambiente" }
    ]
  },
  {
    id: 38,
    text: "Qual desses temas você defenderia em debate?",
    options: [
      { label: "Inclusão digital", value: "ti" },
      { label: "Saúde mental nas escolas", value: "saude" },
      { label: "Infraestrutura sustentável", value: "exatas" },
      { label: "Educação pública de qualidade", value: "humanas" },
      { label: "Proteção de biomas", value: "meioambiente" }
    ]
  },
  {
    id: 39,
    text: "Que ferramenta você levaria para uma ilha (imaginária)?",
    options: [
      { label: "Notebook e internet", value: "ti" },
      { label: "Kit de primeiros socorros", value: "saude" },
      { label: "Ferramentas de medição", value: "exatas" },
      { label: "Guia de sobrevivência social", value: "humanas" },
      { label: "Materiais de criação artística", value: "artes" }
    ]
  },
  {
    id: 40,
    text: "Qual visão de futuro mais te empolga?",
    options: [
      { label: "Mundo conectado por software", value: "ti" },
      { label: "Pessoas com mais saúde", value: "saude" },
      { label: "Cidades inteligentes seguras", value: "exatas" },
      { label: "Sociedades mais justas", value: "humanas" },
      { label: "Planeta preservado e belo", value: "meioambiente" }
    ]
  }
];

// Sugestões de carreiras por área
const SUGGESTIONS = {
  ti: {
    title: "Tecnologia da Informação (TI)",
    careers: [
      "Desenvolvedor(a) Web/Mobile",
      "Engenheiro(a) de Software",
      "Cientista de Dados",
      "DevOps/Cloud",
      "UX/UI Designer"
    ]
  },
  saude: {
    title: "Saúde",
    careers: [
      "Enfermeiro(a)",
      "Médico(a)",
      "Nutricionista",
      "Fisioterapeuta",
      "Psicólogo(a)"
    ]
  },
  exatas: {
    title: "Engenharias e Exatas",
    careers: [
      "Eng. Civil/Elétrica/Mecânica",
      "Arquiteto(a)",
      "Estatístico(a)",
      "Eng. de Produção",
      "Pesquisador(a)"
    ]
  },
  humanas: {
    title: "Ciências Humanas",
    careers: [
      "Professor(a)/Pedagogo(a)",
      "Sociólogo(a)",
      "Historiador(a)",
      "Antropólogo(a)",
      "Filósofo(a)"
    ]
  },
  artes: {
    title: "Artes e Design",
    careers: [
      "Designer Gráfico/Produto",
      "Ilustrador(a)",
      "Fotógrafo(a)",
      "Ator/Atriz",
      "Músico(a)"
    ]
  },
  negocios: {
    title: "Administração e Negócios",
    careers: [
      "Administrador(a)",
      "Gestor(a) de Marketing",
      "Economista",
      "Contador(a)",
      "Empreendedor(a)"
    ]
  },
  comunicacao: {
    title: "Comunicação e Mídia",
    careers: [
      "Jornalista",
      "Publicitário(a)",
      "Produtor(a) de Conteúdo",
      "Apresentador(a)",
      "Social Media"
    ]
  },
  meioambiente: {
    title: "Meio Ambiente e Biológicas",
    careers: [
      "Biólogo(a)",
      "Eng. Ambiental",
      "Veterinário(a)",
      "Agrônomo(a)",
      "Oceanógrafo(a)"
    ]
  }
};

// ---------- ROTAS ----------
app.get("/api/questions", (req, res) => {
  res.json({ questions: QUESTIONS });
});

app.post("/api/result", (req, res) => {
  const { answers } = req.body || {};
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Respostas inválidas." });
  }

  const tally = {
    ti: 0,
    saude: 0,
    exatas: 0,
    humanas: 0,
    artes: 0,
    negocios: 0,
    comunicacao: 0,
    meioambiente: 0
  };

  answers.forEach(v => {
    if (tally[v] !== undefined) tally[v] += 1;
  });

  // vencedor
  let winner = Object.keys(tally)[0];
  let max = -1;
  for (const k of Object.keys(tally)) {
    if (tally[k] > max) {
      max = tally[k];
      winner = k;
    }
  }

  // salva no banco
  const sql = `
    INSERT INTO resultados
      (area, score_ti, score_saude, score_exatas, score_humanas, score_artes, score_negocios, score_comunicacao, score_meioambiente)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    winner,
    tally.ti,
    tally.saude,
    tally.exatas,
    tally.humanas,
    tally.artes,
    tally.negocios,
    tally.comunicacao,
    tally.meioambiente
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao salvar resultado." });
    }
    res.json({
      id: this.lastID,
      winner,
      scores: tally,
      suggestion: SUGGESTIONS[winner]
    });
  });
});

// estatísticas agregadas (extra)
app.get("/api/stats", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(area='ti') AS ti,
      SUM(area='saude') AS saude,
      SUM(area='exatas') AS exatas,
      SUM(area='humanas') AS humanas,
      SUM(area='artes') AS artes,
      SUM(area='negocios') AS negocios,
      SUM(area='comunicacao') AS comunicacao,
      SUM(area='meioambiente') AS meioambiente
    FROM resultados;
  `;
  db.get(sql, [], (err, row) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar estatísticas." });
    res.json(row);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
