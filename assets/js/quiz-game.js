// --- Easter Egg: Quiz de Programação & Ciência de Dados (5 Níveis de Dificuldade) ---
// Ativado exclusivamente quando o usuário digita "QUIZ" ou "LEADERBOARD" no Console R
// Níveis:
// 1. Iniciante (Fundamentos & Lógica)
// 2. Júnior (Python, R & Estruturas de Dados)
// 3. Pleno (SQL, Pandas/dplyr & Algoritmos)
// 4. Sênior (Econometria, Machine Learning & Concorrência)
// 5. Mestre / Hacker (Compiladores, Otimização C++/WASM & Arquitetura)

(function() {
  const STORAGE_KEY = 'econdata_quiz_leaderboard';

  const QUIZ_QUESTIONS = {
    1: [ // Nível 1: Iniciante
      {
        q: "Em linguagens de programação, qual é o tipo de dado utilizado para representar valores Verdadeiro ou Falso?",
        options: ["String", "Boolean", "Float", "Array"],
        answer: 1,
        explanation: "Boolean (ou booleano) representa valores lógicos binários (True / False)."
      },
      {
        q: "Qual estrutura de repetição é tradicionalmente utilizada quando se sabe de antemão o número de iterações?",
        options: ["switch", "while", "for", "try-catch"],
        answer: 2,
        explanation: "O loop 'for' é o padrão idiomático para iterações sobre sequências ou intervalos definidos."
      },
      {
        q: "Na maioria das linguagens modernas (C, Python, Java, JS), qual é o índice do primeiro elemento de uma lista/array?",
        options: ["0", "1", "-1", "null"],
        answer: 0,
        explanation: "Essas linguagens usam indexação baseada em zero (0-indexed)."
      },
      {
        q: "O que a instrução 'return' faz dentro de uma função?",
        options: ["Interrompe o computador", "Encerra a função e devolve um valor ao chamador", "Reinicia o loop principal", "Imprime o texto na tela"],
        answer: 1,
        explanation: "Return finaliza a execução da função corrente e envia o resultado especificado de volta."
      },
      {
        q: "Qual operador matemático é comumente usado para obter o resto de uma divisão inteira (módulo)?",
        options: ["//", "%", "^", "&&"],
        answer: 1,
        explanation: "O operador '%' (módulo) retorna o resto da divisão entre dois números."
      }
    ],
    2: [ // Nível 2: Júnior
      {
        q: "Em Python, qual é a principal diferença entre uma lista e uma tupla?",
        options: ["Listas são imutáveis; tuplas são mutáveis", "Tuplas são imutáveis; listas são mutáveis", "Tuplas só aceitam números", "Listas não suportam iteração"],
        answer: 1,
        explanation: "Tuplas são imutáveis (seus elementos não podem ser alterados após criação), enquanto listas são mutáveis."
      },
      {
        q: "No ecossistema R (Tidyverse), qual operador ('pipe') é tradicionalmente usado para encadear funções no dplyr?",
        options: ["->>", "%>%", "::", "$$"],
        answer: 1,
        explanation: "O operador pipe '%>%' (do pacote magrittr/dplyr) passa o resultado da esquerda como primeiro argumento da direita."
      },
      {
        q: "Qual é o valor de retorno da expressão JavaScript: typeof NaN?",
        options: ["'undefined'", "'number'", "'NaN'", "'null'"],
        answer: 1,
        explanation: "Em JavaScript e no padrão IEEE 754, NaN significa 'Not a Number', mas seu tipo primitivo ainda é 'number'."
      },
      {
        q: "Em R, ao contrário de Python e C, a indexação padrão de vetores começa em qual número?",
        options: ["0", "1", "-1", "Depende do pacote"],
        answer: 1,
        explanation: "O R segue a convenção matemática matricial onde o primeiro elemento está na posição 1."
      },
      {
        q: "Qual estrutura de dados opera no princípio LIFO (Last In, First Out)?",
        options: ["Fila (Queue)", "Pilha (Stack)", "Tabela Hash", "Grafo"],
        answer: 1,
        explanation: "Uma Pilha (Stack) insere e remove do mesmo topo: o último a entrar é o primeiro a sair."
      }
    ],
    3: [ // Nível 3: Pleno
      {
        q: "Em SQL, qual cláusula deve ser utilizada para filtrar grupos agregados após um GROUP BY?",
        options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
        answer: 1,
        explanation: "WHERE filtra linhas individuais antes do agrupamento; HAVING filtra os grupos após a agregação."
      },
      {
        q: "Qual é a complexidade assintótica média de busca, inserção e remoção em uma Tabela Hash bem dimensionada?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explanation: "Tabelas Hash com boa função de hashing possuem tempo médio constante O(1)."
      },
      {
        q: "Qual a diferença conceitual entre INNER JOIN e LEFT JOIN em SQL?",
        options: [
          "INNER JOIN retorna apenas linhas com correspondência em ambas as tabelas; LEFT JOIN mantém todas da tabela esquerda",
          "INNER JOIN inclui valores nulos da direita; LEFT JOIN descarta",
          "LEFT JOIN é sempre mais rápido computacionalmente",
          "Não há diferença em bancos relacionais modernos"
        ],
        answer: 0,
        explanation: "LEFT JOIN garante que todos os registros da tabela à esquerda apareçam, preenchendo com NULL onde não houver match."
      },
      {
        q: "No Git, o que o comando 'git rebase' faz em comparação com 'git merge'?",
        options: [
          "Deleta os commits antigos sem aviso",
          "Reaplica commits em cima de outra ponta base, criando um histórico linear",
          "Apenas baixa as alterações remotas sem alterar o grafo local",
          "Cria sempre um commit com dois pais"
        ],
        answer: 1,
        explanation: "Rebase reaplica os commits da branch atual sobre o topo da branch alvo, mantendo o histórico limpo e linear."
      },
      {
        q: "O que é 'data leakage' (vazamento de dados) em pipelines de Machine Learning?",
        options: [
          "Quando um hacker invade a base de dados do modelo",
          "Quando informações do conjunto de teste ou do futuro são inadvertidamente usadas no treinamento",
          "Quando o dataset possui muitos valores ausentes (NaN)",
          "Quando o modelo atinge 100% de recall artificialmente"
        ],
        answer: 1,
        explanation: "Data leakage ocorre quando variáveis que não estariam disponíveis no momento da predição real contaminam o treino."
      }
    ],
    4: [ // Nível 4: Sênior
      {
        q: "Em Econometria e Estatística, qual pressuposto fundamental do estimador MQO (OLS) é violado quando há endogeneidade?",
        options: ["Homocedasticidade dos erros", "E(u | X) = 0 (Exogeneidade estrita dos regressores)", "Normalidade dos resíduos", "Ausência de multicolinearidade perfeita"],
        answer: 1,
        explanation: "Endogeneidade significa que Cov(X, u) != 0, violando a hipótese de exogeneidade estrita e tornando o MQO tendencioso e inconsistente."
      },
      {
        q: "Em sistemas concorrentes, qual fenômeno ocorre quando duas ou mais threads aguardam indefinidamente por recursos bloqueados mutuamente?",
        options: ["Race Condition", "Deadlock", "Livelock", "Starvation"],
        answer: 1,
        explanation: "Deadlock (impasse) é o estado em que cada processo detém um recurso e aguarda o que está sob posse de outro."
      },
      {
        q: "Qual método econométrico é padrão-ouro para estimar relações causais na presença de viés de variável omitida e endogeneidade com instrumento válido (Z)?",
        options: ["LASSO Regularization", "2SLS (Mínimos Quadrados em 2 Estágios / IV)", "K-Means Clustering", "Random Forest Regressor"],
        answer: 1,
        explanation: "Variáveis Instrumentais via 2SLS (Two-Stage Least Squares) isolam a variação exógena do regressor endógeno."
      },
      {
        q: "Em programação funcional e reativa, o que caracteriza uma 'função pura' (pure function)?",
        options: [
          "Não possui efeitos colaterais e sempre retorna o mesmo resultado para os mesmos argumentos",
          "Função que só aceita tipos primitivos",
          "Função assíncrona com Promise nativa",
          "Função escrita exclusivamente em C ou Assembly"
        ],
        answer: 0,
        explanation: "Funções puras possuem transparência referencial e são livres de efeitos colaterais (side effects)."
      },
      {
        q: "Qual é o principal benefício do algoritmo de Gradient Boosting (como XGBoost ou LightGBM) em dados tabulares?",
        options: [
          "Treina árvores independentes em paralelo sem comunicação",
          "Cada nova árvore é treinada para corrigir os erros residuais (pseudo-resíduos) do conjunto anterior",
          "Elimina completamente a necessidade de hiperparâmetros",
          "Reduz o custo assintótico para O(1)"
        ],
        answer: 1,
        explanation: "O Boosting constrói árvores sequencialmente, onde cada árvore subsequente foca nos resíduos das árvores anteriores."
      }
    ],
    5: [ // Nível 5: Mestre / Hacker
      {
        q: "Como o WebAssembly (Wasm) consegue atingir desempenho quase nativo dentro do sandbox de navegadores modernos?",
        options: [
          "Executando com privilégios de root no sistema operacional",
          "Formato binário pré-otimizado (bytecode) com tipos estáticos compilado via JIT diretamente para instruções de máquina locais",
          "Convertendo código C em JavaScript interpretado em tempo de execução",
          "Desativando o coletor de lixo do navegador"
        ],
        answer: 1,
        explanation: "Wasm é um bytecode estruturado de baixo nível que os motores de browser (V8, SpiderMonkey) compilam em código de máquina nativo rapidamente."
      },
      {
        q: "Em C e C++, o que significa 'Undefined Behavior' (UB) segundo o padrão da linguagem?",
        options: [
          "O programa emite um aviso silencioso no console",
          "O compilador tem permissão de assumir que tal situação nunca acontece, podendo gerar qualquer código de máquina, falha catastrófica ou otimizações bizarras",
          "A função retorna automaticamente NULL",
          "O SO encerra a thread sem desalocar ponteiros"
        ],
        answer: 1,
        explanation: "Undefined Behavior impõe zero requisitos ao compilador: tudo é permitido, desde crash até remoção de checagens pelo otimizador."
      },
      {
        q: "Em arquiteturas de processadores modernos (x86_64, ARM64), qual técnica de otimização de hardware pode falhar e causar descarte de pipeline (pipeline stall)?",
        options: ["Branch Prediction (Previsão de Desvio)", "Garbage Collection", "DMA Transfer", "Memory Paging"],
        answer: 0,
        explanation: "Quando o preditor de desvios erra (branch misprediction), todas as instruções especulativas no pipeline devem ser descartadas."
      },
      {
        q: "O que é o Teorema CAP para sistemas distribuídos de armazenamento de dados?",
        options: [
          "Afirma que é impossível garantir simultaneamente Consistência, Disponibilidade e Tolerância a Partições de rede",
          "Prova que qualquer algoritmo de ordenação pode ser O(n)",
          "Determina a taxa máxima de compressão de Shannon",
          "Garante a atomicidade absoluta de transações ACID em nuvem"
        ],
        answer: 0,
        explanation: "O Teorema de Brewer (CAP) prova que um sistema distribuído pode escolher no máximo duas das três garantias sob partição."
      },
      {
        q: "No kernel Linux e em engines de alta performance (como V8), qual é o objetivo de usar estruturas 'Lock-Free' baseadas em primitivas CAS (Compare-And-Swap)?",
        options: [
          "Eliminar mutexes e esperas ativas, garantindo progresso do sistema mesmo se alguma thread for suspensa",
          "Garantir acesso compartilhado sem uso de memória RAM",
          "Aumentar o consumo de CPU em segundo plano",
          "Criptografar ponteiros em registradores"
        ],
        answer: 0,
        explanation: "Estruturas Lock-Free garantem que pelo menos uma thread ativa no sistema conclui sua operação em passos finitos, sem bloqueio de mutex."
      }
    ]
  };

  const LEVEL_NAMES = {
    1: { title: "Iniciante", tag: "Lógica & Fundamentos", color: "#10B981", points: 100 },
    2: { title: "Júnior", tag: "Python, R & Estruturas", color: "#38BDF8", points: 200 },
    3: { title: "Pleno", tag: "SQL, Algoritmos & Pipelines", color: "#818CF8", points: 350 },
    4: { title: "Sênior", tag: "Econometria & Concorrência", color: "#F59E0B", points: 500 },
    5: { title: "Mestre", tag: "Wasm, Compiladores & Kernel", color: "#EF4444", points: 800 }
  };

  let currentLevel = 1;
  let currentQuestionIndex = 0;
  let currentScore = 0;
  let answeredQuestions = 0;
  let correctAnswers = 0;
  let currentQuestionsList = [];
  let userSelectedOption = null;

  // Carrega Leaderboard do LocalStorage
  function getLeaderboard() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    // Placar padrão institucional EconData
    return [
      { name: "Satoshi_N", score: 3850, level: "Mestre (5)", date: "2026-09-28" },
      { name: "Ada_Lovelace", score: 3200, level: "Sênior (4)", date: "2026-09-30" },
      { name: "DanieI_Adler", score: 2750, level: "Sênior (4)", date: "2026-10-01" },
      { name: "Alan_Turing", score: 2400, level: "Pleno (3)", date: "2026-09-29" },
      { name: "Econ_Dev_PUC", score: 1800, level: "Júnior (2)", date: "2026-10-01" }
    ];
  }

  function saveScore(name, score, level) {
    if (!name) name = "Dev_Anonimo";
    const lb = getLeaderboard();
    const entry = {
      name: name.slice(0, 16),
      score: score,
      level: LEVEL_NAMES[level]?.title || `Nível ${level}`,
      date: new Date().toISOString().split('T')[0]
    };
    lb.push(entry);
    lb.sort((a, b) => b.score - a.score);
    const top10 = lb.slice(0, 10);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
    } catch(e) {}
    return top10;
  }

  // --- Renderização da Leaderboard ---
  window.launchLeaderboard = function(containerEl) {
    if (!containerEl) return;
    const lb = getLeaderboard();

    containerEl.innerHTML = `
      <div class="quiz-overlay-game">
        <div class="quiz-header">
          <div class="quiz-title">
            <span class="quiz-icon">🏆</span>
            <div>
              <strong>HALL DA FAMA · LEADERBOARD ECONDATA</strong>
              <small>Top Pontuações do Quiz de Programação & Econometria</small>
            </div>
          </div>
          <button class="chess-btn-icon" onclick="window.closeQuizGame()" title="Fechar">✕</button>
        </div>

        <div class="quiz-leaderboard-table-wrap">
          <table class="quiz-lb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Desenvolvedor</th>
                <th>Nível</th>
                <th>Pontos</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              ${lb.map((item, idx) => `
                <tr class="${idx === 0 ? 'top-1' : idx === 1 ? 'top-2' : idx === 2 ? 'top-3' : ''}">
                  <td class="lb-rank">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                  <td class="lb-name"><strong>${item.name}</strong></td>
                  <td class="lb-level"><span class="quiz-tag-pill">${item.level}</span></td>
                  <td class="lb-score tabular-num">${item.score} pts</td>
                  <td class="lb-date">${item.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="quiz-actions" style="margin-top: 1rem;">
          <button class="console-btn-action" onclick="window.launchQuizGame(document.getElementById('console-plot-area'))">Jogar o Quiz Agora</button>
          <button class="console-btn-action" onclick="window.closeQuizGame()">Fechar</button>
        </div>
      </div>
    `;
  };

  // --- Inicialização do Quiz ---
  window.launchQuizGame = function(containerEl) {
    if (!containerEl) return;
    currentLevel = 1;
    currentQuestionIndex = 0;
    currentScore = 0;
    answeredQuestions = 0;
    correctAnswers = 0;
    userSelectedOption = null;

    renderLevelSelection(containerEl);
  };

  function renderLevelSelection(containerEl) {
    containerEl.innerHTML = `
      <div class="quiz-overlay-game">
        <div class="quiz-header">
          <div class="quiz-title">
            <span class="quiz-icon">🧠</span>
            <div>
              <strong>TECH & DATA QUIZ · EconData Analytics</strong>
              <small>Teste seus conhecimentos em 5 níveis de dificuldade</small>
            </div>
          </div>
          <div class="quiz-stats">
            <button class="console-btn-action" onclick="window.launchLeaderboard(document.getElementById('console-plot-area'))" style="font-size: 0.72rem; padding: 4px 8px;">🏆 Ver Leaderboard</button>
            <button class="chess-btn-icon" onclick="window.closeQuizGame()" title="Fechar">✕</button>
          </div>
        </div>

        <div class="quiz-level-picker-intro">
          <p>Escolha o nível inicial para testar sua proficiência técnica em programação, estatística e arquitetura:</p>
        </div>

        <div class="quiz-levels-grid">
          ${[1, 2, 3, 4, 5].map(lvl => {
            const meta = LEVEL_NAMES[lvl];
            return `
              <div class="quiz-level-card" onclick="window.startQuizAtLevel(${lvl})">
                <div class="qlc-header">
                  <span class="qlc-badge" style="background: ${meta.color}22; color: ${meta.color}; border: 1px solid ${meta.color}55;">Nível ${lvl} · ${meta.title}</span>
                  <span class="qlc-pts">+${meta.points} pts / acerto</span>
                </div>
                <h4>${meta.tag}</h4>
                <p>5 perguntas de múltipla escolha com explicação técnica imediata.</p>
              </div>
            `;
          }).join('')}
        </div>

        <div class="quiz-actions" style="margin-top: 1.25rem;">
          <button class="console-btn-action" onclick="window.closeQuizGame()">Voltar ao Console R</button>
        </div>
      </div>
    `;
  }

  window.startQuizAtLevel = function(lvl) {
    currentLevel = lvl;
    currentQuestionIndex = 0;
    currentQuestionsList = [...QUIZ_QUESTIONS[lvl]];
    userSelectedOption = null;
    renderCurrentQuestion();
  };

  function renderCurrentQuestion() {
    const containerEl = document.getElementById('console-plot-area');
    if (!containerEl) return;

    const meta = LEVEL_NAMES[currentLevel];
    const qData = currentQuestionsList[currentQuestionIndex];
    if (!qData) {
      renderLevelCompleted();
      return;
    }

    containerEl.innerHTML = `
      <div class="quiz-overlay-game">
        <div class="quiz-header">
          <div class="quiz-title">
            <span class="quiz-icon">⚡</span>
            <div>
              <strong>NÍVEL ${currentLevel} · ${meta.title.toUpperCase()}</strong>
              <small>${meta.tag}</small>
            </div>
          </div>
          <div class="quiz-stats">
            <span class="quiz-score-badge">Pontuação: <strong class="tabular-num">${currentScore}</strong> pts</span>
            <span class="quiz-qnum">Questão ${currentQuestionIndex + 1}/5</span>
            <button class="chess-btn-icon" onclick="window.closeQuizGame()" title="Fechar">✕</button>
          </div>
        </div>

        <div class="quiz-question-box">
          <p class="quiz-q-text">${qData.q}</p>
        </div>

        <div class="quiz-options-list" id="quizOptionsList">
          ${qData.options.map((opt, idx) => `
            <button class="quiz-option-btn" onclick="window.handleSelectOption(${idx})" id="qOpt_${idx}">
              <span class="quiz-opt-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="quiz-opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="quiz-feedback-box" id="quizFeedbackBox" style="display: none;"></div>

        <div class="quiz-footer-actions">
          <button class="console-btn-action" id="btnNextQuestion" onclick="window.handleNextQuestion()" style="display: none;">Próxima Questão ➔</button>
          <button class="console-btn-action" onclick="window.launchQuizGame(document.getElementById('console-plot-area'))">Trocar Nível</button>
          <button class="console-btn-action" onclick="window.launchLeaderboard(document.getElementById('console-plot-area'))">🏆 Leaderboard</button>
        </div>
      </div>
    `;
  }

  window.handleSelectOption = function(selectedIdx) {
    if (userSelectedOption !== null) return; // Já respondeu
    userSelectedOption = selectedIdx;

    const qData = currentQuestionsList[currentQuestionIndex];
    const isCorrect = (selectedIdx === qData.answer);
    const meta = LEVEL_NAMES[currentLevel];

    answeredQuestions++;
    if (isCorrect) {
      correctAnswers++;
      currentScore += meta.points;
    }

    // Estilização visual imediata das opções
    qData.options.forEach((_, idx) => {
      const btn = document.getElementById(`qOpt_${idx}`);
      if (!btn) return;
      btn.disabled = true;
      if (idx === qData.answer) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // Feedback explicativo
    const feedbackBox = document.getElementById('quizFeedbackBox');
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}`;
      feedbackBox.innerHTML = `
        <div class="fb-header">
          <span>${isCorrect ? '✅ Resposta Correta! (+ ' + meta.points + ' pts)' : '❌ Resposta Incorreta'}</span>
        </div>
        <div class="fb-body">${qData.explanation}</div>
      `;
    }

    const nextBtn = document.getElementById('btnNextQuestion');
    if (nextBtn) {
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = (currentQuestionIndex < 4) ? 'Próxima Questão ➔' : 'Ver Resultado do Nível ➔';
    }
  };

  window.handleNextQuestion = function() {
    currentQuestionIndex++;
    userSelectedOption = null;
    if (currentQuestionIndex < 5) {
      renderCurrentQuestion();
    } else {
      renderLevelCompleted();
    }
  };

  function renderLevelCompleted() {
    const containerEl = document.getElementById('console-plot-area');
    if (!containerEl) return;
    const meta = LEVEL_NAMES[currentLevel];

    containerEl.innerHTML = `
      <div class="quiz-overlay-game">
        <div class="quiz-header">
          <div class="quiz-title">
            <span class="quiz-icon">🎉</span>
            <div>
              <strong>NÍVEL ${currentLevel} CONCLUÍDO!</strong>
              <small>${meta.title} (${meta.tag})</small>
            </div>
          </div>
          <button class="chess-btn-icon" onclick="window.closeQuizGame()" title="Fechar">✕</button>
        </div>

        <div class="quiz-summary-card">
          <h3>Seu Desempenho no Nível:</h3>
          <div class="quiz-big-score tabular-num">${currentScore} <small>pontos</small></div>
          <p>Você acertou <strong>${correctAnswers}</strong> de <strong>${answeredQuestions}</strong> questões respondidas até aqui!</p>
        </div>

        <div class="quiz-save-score-form">
          <label for="quizPlayerName">Registre sua pontuação na Leaderboard do EconData:</label>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <input type="text" id="quizPlayerName" placeholder="Seu nome ou @handle" maxlength="16" class="console-prompt-input" style="flex: 1;" />
            <button class="console-btn-action" onclick="window.submitQuizScore()">Salvar Pontuação</button>
          </div>
        </div>

        <div class="quiz-actions" style="margin-top: 1.5rem;">
          ${currentLevel < 5 ? `
            <button class="console-btn-action" onclick="window.startQuizAtLevel(${currentLevel + 1})">Avançar para o Nível ${currentLevel + 1} ➔</button>
          ` : ''}
          <button class="console-btn-action" onclick="window.launchQuizGame(document.getElementById('console-plot-area'))">Escolher Outro Nível</button>
          <button class="console-btn-action" onclick="window.launchLeaderboard(document.getElementById('console-plot-area'))">🏆 Ver Leaderboard</button>
        </div>
      </div>
    `;
  }

  window.submitQuizScore = function() {
    const input = document.getElementById('quizPlayerName');
    const name = input ? input.value.trim() : '';
    saveScore(name || 'Dev_EconData', currentScore, currentLevel);
    window.launchLeaderboard(document.getElementById('console-plot-area'));
  };

  window.closeQuizGame = function() {
    const plotArea = document.getElementById('console-plot-area');
    if (plotArea) {
      plotArea.innerHTML = '<div class="plot-placeholder" id="plot-placeholder">Nenhum gráfico gerado ainda.<br>Gere um gráfico com <code>plot()</code> ou <code>ggplot()</code>.</div>';
    }
    const terminal = document.getElementById('r-terminal-output');
    if (terminal) {
      terminal.textContent += '\n[Easter Egg]: Quiz de Programação finalizado. Console R pronto.';
    }
  };
})();
