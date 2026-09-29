// --- Easter Egg: Jogo 4 em Linha (Connect 4) com IA Nível 7/10 ---
// Ativado exclusivamente quando o usuário digita "LIG4", "CONNECT4" ou "4EMLINHA" no Console R

(function() {
  const ROWS = 6;
  const COLS = 7;
  const EMPTY = 0;
  const HUMAN = 1; // Vermelho
  const AI = 2;    // Amarelo

  let board = [];
  let isGameOver = false;
  let isAiTurn = false;
  let moveHistory = [];
  let scores = { human: 0, ai: 0, ties: 0 };

  // Inicializa matriz 6x7 vazia
  function createBoard() {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
  }

  // Verifica linha disponível mais baixa em uma coluna
  function getLowestEmptyRow(b, col) {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (b[r][col] === EMPTY) return r;
    }
    return -1;
  }

  // Lista colunas com pelo menos uma vaga
  function getValidLocations(b) {
    const valid = [];
    for (let c = 0; c < COLS; c++) {
      if (b[0][c] === EMPTY) valid.push(c);
    }
    return valid;
  }

  // Verifica se há 4 em linha para um determinado jogador
  function checkWin(b, player) {
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (b[r][c] === player && b[r][c+1] === player && b[r][c+2] === player && b[r][c+3] === player) {
          return { win: true, coords: [[r, c], [r, c+1], [r, c+2], [r, c+3]] };
        }
      }
    }
    // Vertical
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS; c++) {
        if (b[r][c] === player && b[r+1][c] === player && b[r+2][c] === player && b[r+3][c] === player) {
          return { win: true, coords: [[r, c], [r+1, c], [r+2, c], [r+3, c]] };
        }
      }
    }
    // Diagonal Positiva (/)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (b[r][c] === player && b[r-1][c+1] === player && b[r-2][c+2] === player && b[r-3][c+3] === player) {
          return { win: true, coords: [[r, c], [r-1, c+1], [r-2, c+2], [r-3, c+3]] };
        }
      }
    }
    // Diagonal Negativa (\)
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (b[r][c] === player && b[r+1][c+1] === player && b[r+2][c+2] === player && b[r+3][c+3] === player) {
          return { win: true, coords: [[r, c], [r+1, c+1], [r+2, c+2], [r+3, c+3]] };
        }
      }
    }
    return { win: false };
  }

  // Avaliação de janela de 4 peças para a Heurística da IA
  function evaluateWindow(window4, player) {
    let score = 0;
    const oppPlayer = player === AI ? HUMAN : AI;
    const playerCount = window4.filter(p => p === player).length;
    const emptyCount = window4.filter(p => p === EMPTY).length;
    const oppCount = window4.filter(p => p === oppPlayer).length;

    if (playerCount === 4) {
      score += 100000;
    } else if (playerCount === 3 && emptyCount === 1) {
      score += 50;
    } else if (playerCount === 2 && emptyCount === 2) {
      score += 10;
    }

    if (oppCount === 3 && emptyCount === 1) {
      score -= 80; // Bloqueio preventivo
    }

    return score;
  }

  // Função Heurística de Tabuleiro
  function scoreBoard(b, player) {
    let score = 0;

    // Preferência estratégica para a coluna central (coluna 3)
    const centerCol = [b[0][3], b[1][3], b[2][3], b[3][3], b[4][3], b[5][3]];
    const centerCount = centerCol.filter(p => p === player).length;
    score += centerCount * 12;

    // Horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const win4 = [b[r][c], b[r][c+1], b[r][c+2], b[r][c+3]];
        score += evaluateWindow(win4, player);
      }
    }
    // Vertical
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 3; r++) {
        const win4 = [b[r][c], b[r+1][c], b[r+2][c], b[r+3][c]];
        score += evaluateWindow(win4, player);
      }
    }
    // Diagonal Positiva
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const win4 = [b[r][c], b[r-1][c+1], b[r-2][c+2], b[r-3][c+3]];
        score += evaluateWindow(win4, player);
      }
    }
    // Diagonal Negativa
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const win4 = [b[r][c], b[r+1][c+1], b[r+2][c+2], b[r+3][c+3]];
        score += evaluateWindow(win4, player);
      }
    }
    return score;
  }

  // Minimax com Alpha-Beta Pruning (Profundidade 4 para velocidade e precisão)
  function minimax(b, depth, alpha, beta, maximizingPlayer) {
    const validLocations = getValidLocations(b);
    const aiWin = checkWin(b, AI).win;
    const humanWin = checkWin(b, HUMAN).win;

    if (aiWin) return { score: 1000000 + depth };
    if (humanWin) return { score: -1000000 - depth };
    if (validLocations.length === 0 || depth === 0) {
      return { score: scoreBoard(b, AI) };
    }

    if (maximizingPlayer) {
      let maxScore = -Infinity;
      let bestCol = validLocations[Math.floor(Math.random() * validLocations.length)];
      for (let col of validLocations) {
        const row = getLowestEmptyRow(b, col);
        b[row][col] = AI;
        const result = minimax(b, depth - 1, alpha, beta, false);
        b[row][col] = EMPTY;
        if (result.score > maxScore) {
          maxScore = result.score;
          bestCol = col;
        }
        alpha = Math.max(alpha, maxScore);
        if (alpha >= beta) break;
      }
      return { col: bestCol, score: maxScore };
    } else {
      let minScore = Infinity;
      let bestCol = validLocations[Math.floor(Math.random() * validLocations.length)];
      for (let col of validLocations) {
        const row = getLowestEmptyRow(b, col);
        b[row][col] = HUMAN;
        const result = minimax(b, depth - 1, alpha, beta, true);
        b[row][col] = EMPTY;
        if (result.score < minScore) {
          minScore = result.score;
          bestCol = col;
        }
        beta = Math.min(beta, minScore);
        if (alpha >= beta) break;
      }
      return { col: bestCol, score: minScore };
    }
  }

  // IA com nível de inteligência 7/10:
  // - 100% de precisão para ganhar imediatamente se houver chance.
  // - 100% de bloqueio se o humano for ganhar na próxima jogada.
  // - 75% das vezes joga o lance ótimo do Minimax (Alpha-Beta).
  // - 25% das vezes comete um erro humano/sub-ótimo escolhendo uma jogada secundária não-suicida.
  function getAiMove() {
    const validLocations = getValidLocations(board);
    if (validLocations.length === 0) return -1;

    // 1. Ganhar de imediato
    for (let c of validLocations) {
      const r = getLowestEmptyRow(board, c);
      board[r][c] = AI;
      const win = checkWin(board, AI).win;
      board[r][c] = EMPTY;
      if (win) return c;
    }

    // 2. Bloquear vitória imediata do Humano
    for (let c of validLocations) {
      const r = getLowestEmptyRow(board, c);
      board[r][c] = HUMAN;
      const block = checkWin(board, HUMAN).win;
      board[r][c] = EMPTY;
      if (block) return c;
    }

    // 3. Aplica IA 7/10: 25% de probabilidade de um pequeno deslize
    const willMakeMistake = Math.random() < 0.25;
    const minimaxResult = minimax(board, 4, -Infinity, Infinity, true);

    if (willMakeMistake && validLocations.length > 1) {
      // Filtra jogadas que não doem vitória imediata ao humano
      const safeMoves = validLocations.filter(c => {
        if (c === minimaxResult.col) return false;
        const r = getLowestEmptyRow(board, c);
        if (r > 0) {
          board[r-1][c] = HUMAN;
          const allowsWin = checkWin(board, HUMAN).win;
          board[r-1][c] = EMPTY;
          if (allowsWin) return false;
        }
        return true;
      });

      if (safeMoves.length > 0) {
        return safeMoves[Math.floor(Math.random() * safeMoves.length)];
      }
    }

    return minimaxResult.col !== undefined ? minimaxResult.col : validLocations[0];
  }

  // Renderização e Controles do Jogo
  window.launchLig4Game = function(containerEl) {
    if (!containerEl) return;
    board = createBoard();
    isGameOver = false;
    isAiTurn = false;
    moveHistory = [];

    containerEl.innerHTML = `
      <div class="lig4-overlay-game" id="lig4Container">
        <div class="lig4-header">
          <div class="lig4-title">
            <span class="lig4-badge">EASTER EGG</span>
            <span>4 EM LINHA</span>
            <span class="lig4-ai-tag">IA Nível 7/10</span>
          </div>
          <button class="termo-close-btn" onclick="closeLig4Game()" title="Sair do jogo">✕</button>
        </div>

        <div class="lig4-scoreboard">
          <div class="lig4-score-item"><span class="lig4-dot human"></span> Você: <strong id="scoreHuman">${scores.human}</strong></div>
          <div class="lig4-score-item"><span class="lig4-dot tie"></span> Empates: <strong id="scoreTies">${scores.ties}</strong></div>
          <div class="lig4-score-item"><span class="lig4-dot ai"></span> IA EconData: <strong id="scoreAi">${scores.ai}</strong></div>
        </div>

        <div class="lig4-board-wrapper">
          <div class="lig4-col-selectors" id="lig4Selectors">
            ${Array(COLS).fill(0).map((_, c) => `
              <button class="lig4-col-btn" data-col="${c}" title="Soltar na coluna ${c + 1}">▼</button>
            `).join('')}
          </div>
          
          <div class="lig4-board" id="lig4Board">
            ${Array(ROWS).fill(0).map((_, r) => `
              <div class="lig4-row" data-row="${r}">
                ${Array(COLS).fill(0).map((_, c) => `
                  <div class="lig4-slot" data-row="${r}" data-col="${c}">
                    <div class="lig4-piece"></div>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lig4-status" id="lig4Status">Sua vez de jogar (Vermelho). Escolha uma coluna!</div>

        <div class="lig4-actions">
          <button class="preset-btn" onclick="resetLig4Game()">Reiniciar Partida</button>
        </div>
      </div>
    `;

    // Event listeners para as colunas
    const selectors = containerEl.querySelector('#lig4Selectors');
    if (selectors) {
      selectors.addEventListener('click', (e) => {
        const btn = e.target.closest('.lig4-col-btn');
        if (!btn || isGameOver || isAiTurn) return;
        const col = parseInt(btn.getAttribute('data-col'), 10);
        handlePlayerMove(col);
      });
    }

    const boardEl = containerEl.querySelector('#lig4Board');
    if (boardEl) {
      boardEl.addEventListener('click', (e) => {
        const slot = e.target.closest('.lig4-slot');
        if (!slot || isGameOver || isAiTurn) return;
        const col = parseInt(slot.getAttribute('data-col'), 10);
        handlePlayerMove(col);
      });
    }
  };

  window.closeLig4Game = function() {
    const plotArea = document.getElementById('console-plot-area');
    if (plotArea) {
      plotArea.innerHTML = '<div class="plot-placeholder" id="plot-placeholder">Nenhum gráfico gerado ainda.<br>Gere um gráfico com <code>plot()</code> ou <code>ggplot()</code>.</div>';
    }
    const terminal = document.getElementById('r-terminal-output');
    if (terminal) {
      terminal.textContent += '\n[Easter Egg]: Jogo 4 em Linha encerrado. Console R pronto.';
    }
  };

  window.resetLig4Game = function() {
    board = createBoard();
    isGameOver = false;
    isAiTurn = false;
    moveHistory = [];
    const statusEl = document.getElementById('lig4Status');
    if (statusEl) {
      statusEl.textContent = 'Nova partida iniciada! Sua vez (Vermelho).';
      statusEl.style.color = '';
    }
    const pieces = document.querySelectorAll('.lig4-slot .lig4-piece');
    pieces.forEach(p => {
      p.className = 'lig4-piece';
    });
  };

  function handlePlayerMove(col) {
    if (isGameOver || isAiTurn) return;
    const row = getLowestEmptyRow(board, col);
    if (row === -1) {
      const statusEl = document.getElementById('lig4Status');
      if (statusEl) {
        statusEl.textContent = 'Esta coluna já está cheia! Escolha outra.';
        statusEl.classList.add('shake');
        setTimeout(() => statusEl.classList.remove('shake'), 400);
      }
      return;
    }

    // Executa jogada do humano
    dropPiece(row, col, HUMAN);
    const winResult = checkWin(board, HUMAN);

    if (winResult.win) {
      endGame('HUMAN', winResult.coords);
      return;
    }

    if (getValidLocations(board).length === 0) {
      endGame('TIE');
      return;
    }

    // Vez da IA
    isAiTurn = true;
    const statusEl = document.getElementById('lig4Status');
    if (statusEl) statusEl.textContent = 'IA EconData pensando... 🤔';

    setTimeout(() => {
      if (isGameOver) return;
      const aiCol = getAiMove();
      if (aiCol !== -1) {
        const aiRow = getLowestEmptyRow(board, aiCol);
        dropPiece(aiRow, aiCol, AI);
        const aiWinResult = checkWin(board, AI);

        if (aiWinResult.win) {
          endGame('AI', aiWinResult.coords);
          return;
        }

        if (getValidLocations(board).length === 0) {
          endGame('TIE');
          return;
        }
      }

      isAiTurn = false;
      if (statusEl) statusEl.textContent = 'Sua vez de jogar (Vermelho).';
    }, 450);
  }

  function dropPiece(row, col, player) {
    board[row][col] = player;
    const slot = document.querySelector(`.lig4-slot[data-row="${row}"][data-col="${col}"] .lig4-piece`);
    if (slot) {
      slot.classList.add(player === HUMAN ? 'piece-human' : 'piece-ai', 'drop');
    }
  }

  function endGame(winner, winCoords = []) {
    isGameOver = true;
    isAiTurn = false;
    const statusEl = document.getElementById('lig4Status');

    if (winner === 'HUMAN') {
      scores.human++;
      const scoreEl = document.getElementById('scoreHuman');
      if (scoreEl) scoreEl.textContent = scores.human;
      if (statusEl) {
        statusEl.textContent = '🏆 Sensacional! Você venceu a IA!';
        statusEl.style.color = '#10B981';
      }
    } else if (winner === 'AI') {
      scores.ai++;
      const scoreEl = document.getElementById('scoreAi');
      if (scoreEl) scoreEl.textContent = scores.ai;
      if (statusEl) {
        statusEl.textContent = '🤖 A IA EconData venceu esta rodada!';
        statusEl.style.color = '#EF4444';
      }
    } else {
      scores.ties++;
      const scoreEl = document.getElementById('scoreTies');
      if (scoreEl) scoreEl.textContent = scores.ties;
      if (statusEl) {
        statusEl.textContent = '🤝 Partida empatada! Ninguém sobrou.';
        statusEl.style.color = '#F59E0B';
      }
    }

    if (winCoords && winCoords.length > 0) {
      winCoords.forEach(([r, c]) => {
        const slot = document.querySelector(`.lig4-slot[data-row="${r}"][data-col="${c}"] .lig4-piece`);
        if (slot) slot.classList.add('win-highlight');
      });
    }
  }
})();
