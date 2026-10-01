// --- Easter Egg: Jogo de Damas Clássico (Checkers / Draughts) vs IA Minimax ---
// Ativado exclusivamente quando o usuário digita "DAMAS" ou "CHECKERS" no Console R

(function() {
  const EMPTY = 0;
  const HUMAN = 1;      // Peão Branco (sobe o tabuleiro)
  const HUMAN_KING = 2; // Dama Branca
  const AI = 3;         // Peão Preto (desce o tabuleiro)
  const AI_KING = 4;    // Dama Preta

  let board = [];
  let selectedSquare = null;
  let validMovesForSelected = [];
  let isGameOver = false;
  let isAiTurn = false;
  let scores = { human: 0, ai: 0, draws: 0 };

  function isHumanPiece(val) {
    return val === HUMAN || val === HUMAN_KING;
  }

  function isAiPiece(val) {
    return val === AI || val === AI_KING;
  }

  function createInitialBoard() {
    const b = Array(8).fill(null).map(() => Array(8).fill(EMPTY));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          if (r < 3) b[r][c] = AI;
          else if (r > 4) b[r][c] = HUMAN;
        }
      }
    }
    return b;
  }

  function cloneBoard(b) {
    return b.map(row => [...row]);
  }

  function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  // Gera capturas obrigatórias para uma peça
  function getCaptures(b, r, c) {
    const piece = b[r][c];
    if (piece === EMPTY) return [];
    const isH = isHumanPiece(piece);
    const isK = piece === HUMAN_KING || piece === AI_KING;
    const enemyCheck = isH ? isAiPiece : isHumanPiece;
    const captures = [];

    const dirs = isK 
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] 
      : isH ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

    // Peão simples também pode capturar para trás na regra tradicional brasileira/internacional
    const jumpDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    for (const [dr, dc] of jumpDirs) {
      const midR = r + dr;
      const midC = c + dc;
      const destR = r + 2 * dr;
      const destC = c + 2 * dc;

      if (inBounds(destR, destC)) {
        if (enemyCheck(b[midR][midC]) && b[destR][destC] === EMPTY) {
          captures.push({
            from: [r, c],
            to: [destR, destC],
            jumped: [midR, midC],
            isCapture: true
          });
        }
      }
    }

    return captures;
  }

  // Gera movimentos simples (sem captura)
  function getSimpleMoves(b, r, c) {
    const piece = b[r][c];
    if (piece === EMPTY) return [];
    const isH = isHumanPiece(piece);
    const isK = piece === HUMAN_KING || piece === AI_KING;
    const moves = [];

    const dirs = isK 
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] 
      : isH ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && b[nr][nc] === EMPTY) {
        moves.push({
          from: [r, c],
          to: [nr, nc],
          jumped: null,
          isCapture: false
        });
      }
    }

    return moves;
  }

  // Lista todos os movimentos legais de um lado (regra da captura obrigatória)
  function getAllMoves(b, forHuman) {
    const checkFn = forHuman ? isHumanPiece : isAiPiece;
    const captures = [];
    const simples = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (checkFn(b[r][c])) {
          const pieceCaps = getCaptures(b, r, c);
          if (pieceCaps.length > 0) {
            captures.push(...pieceCaps);
          } else {
            simples.push(...getSimpleMoves(b, r, c));
          }
        }
      }
    }

    // Regra da captura obrigatória: se houver capturas, apenas capturas são legais
    return captures.length > 0 ? captures : simples;
  }

  // Aplica movimento no tabuleiro com coroação de Dama
  function applyMove(b, m) {
    const nb = cloneBoard(b);
    const piece = nb[m.from[0]][m.from[1]];
    nb[m.from[0]][m.from[1]] = EMPTY;

    if (m.jumped) {
      nb[m.jumped[0]][m.jumped[1]] = EMPTY;
    }

    // Promoção para Dama
    if (piece === HUMAN && m.to[0] === 0) {
      nb[m.to[0]][m.to[1]] = HUMAN_KING;
    } else if (piece === AI && m.to[0] === 7) {
      nb[m.to[0]][m.to[1]] = AI_KING;
    } else {
      nb[m.to[0]][m.to[1]] = piece;
    }

    return nb;
  }

  // Avaliação de tabuleiro para Damas (Positivo para IA, Negativo para Humano)
  function evaluateDamas(b) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const val = b[r][c];
        if (val === EMPTY) continue;
        if (val === HUMAN) score -= 100 + (7 - r) * 10;
        else if (val === HUMAN_KING) score -= 280;
        else if (val === AI) score += 100 + r * 10;
        else if (val === AI_KING) score += 280;
      }
    }
    return score;
  }

  // Minimax com Alpha-Beta para Damas
  function minimaxDamas(b, depth, alpha, beta, isMaximizing) {
    const moves = getAllMoves(b, !isMaximizing);

    if (moves.length === 0) {
      return { score: isMaximizing ? -10000 : 10000 };
    }

    if (depth === 0) {
      return { score: evaluateDamas(b) };
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      let bestMove = moves[0];
      for (const m of moves) {
        const nb = applyMove(b, m);
        const result = minimaxDamas(nb, depth - 1, alpha, beta, false);
        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = m;
        }
        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha) break;
      }
      return { score: maxScore, move: bestMove };
    } else {
      let minScore = Infinity;
      let bestMove = moves[0];
      for (const m of moves) {
        const nb = applyMove(b, m);
        const result = minimaxDamas(nb, depth - 1, alpha, beta, true);
        if (result.score < minScore) {
          minScore = result.score;
          bestMove = m;
        }
        beta = Math.min(beta, minScore);
        if (beta <= alpha) break;
      }
      return { score: minScore, move: bestMove };
    }
  }

  // --- Renderização e Interface ---
  window.launchDamasGame = function(containerEl) {
    if (!containerEl) return;
    board = createInitialBoard();
    selectedSquare = null;
    validMovesForSelected = [];
    isGameOver = false;
    isAiTurn = false;

    containerEl.innerHTML = `
      <div class="damas-overlay-game">
        <div class="damas-header">
          <div class="damas-title">
            <span class="damas-icon">⚪</span>
            <div>
              <strong>JOGO DE DAMAS · EconData Analytics</strong>
              <small>Captura Obrigatória • Peão Coroado vira Dama • Você é o Branco</small>
            </div>
          </div>
          <div class="damas-stats">
            <span title="Vitórias do Jogador">Você: <strong id="damasHumanScore">${scores.human}</strong></span>
            <span title="Vitórias da IA">IA: <strong id="damasAiScore">${scores.ai}</strong></span>
            <button class="chess-btn-icon" onclick="window.closeDamasGame()" title="Fechar jogo">✕</button>
          </div>
        </div>

        <div class="damas-board-wrapper">
          <div class="damas-board" id="damasBoard"></div>
        </div>

        <div class="damas-status" id="damasStatus">Sua vez (Peças Brancas). Selecione uma peça para mover.</div>

        <div class="damas-actions">
          <button class="console-btn-action" onclick="window.resetDamasGame()">Nova Partida</button>
          <button class="console-btn-action" onclick="window.closeDamasGame()">Sair do Jogo</button>
        </div>
      </div>
    `;

    renderBoard();
  };

  window.closeDamasGame = function() {
    const plotArea = document.getElementById('console-plot-area');
    if (plotArea) {
      plotArea.innerHTML = '<div class="plot-placeholder" id="plot-placeholder">Nenhum gráfico gerado ainda.<br>Gere um gráfico com <code>plot()</code> ou <code>ggplot()</code>.</div>';
    }
    const terminal = document.getElementById('r-terminal-output');
    if (terminal) {
      terminal.textContent += '\n[Easter Egg]: Partida de Damas encerrada. Console R pronto.';
    }
  };

  window.resetDamasGame = function() {
    board = createInitialBoard();
    selectedSquare = null;
    validMovesForSelected = [];
    isGameOver = false;
    isAiTurn = false;
    const statusEl = document.getElementById('damasStatus');
    if (statusEl) {
      statusEl.textContent = 'Nova partida iniciada! Sua vez (Peças Brancas).';
      statusEl.style.color = '';
    }
    renderBoard();
  };

  function renderBoard() {
    const boardEl = document.getElementById('damasBoard');
    if (!boardEl) return;
    boardEl.innerHTML = '';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = document.createElement('div');
        const isDark = (r + c) % 2 === 1;
        square.className = `damas-sq ${isDark ? 'dark' : 'light'}`;
        square.dataset.row = r;
        square.dataset.col = c;

        if (selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c) {
          square.classList.add('selected');
        }

        const validMove = validMovesForSelected.find(m => m.to[0] === r && m.to[1] === c);
        if (validMove) {
          square.classList.add(validMove.isCapture ? 'valid-capture' : 'valid-move');
        }

        const val = board[r][c];
        if (val !== EMPTY) {
          const pieceEl = document.createElement('div');
          const isH = isHumanPiece(val);
          const isK = val === HUMAN_KING || val === AI_KING;
          pieceEl.className = `damas-piece ${isH ? 'piece-human' : 'piece-ai'} ${isK ? 'is-king' : ''}`;
          if (isK) {
            pieceEl.setAttribute('data-crown', '👑');
          }
          square.appendChild(pieceEl);
        }

        square.addEventListener('click', () => handleSquareClick(r, c));
        boardEl.appendChild(square);
      }
    }
  }

  function handleSquareClick(r, c) {
    if (isGameOver || isAiTurn) return;

    if (selectedSquare) {
      const matchMove = validMovesForSelected.find(m => m.to[0] === r && m.to[1] === c);
      if (matchMove) {
        board = applyMove(board, matchMove);
        selectedSquare = null;
        validMovesForSelected = [];

        // Checar se o jogo acabou
        const aiMoves = getAllMoves(board, false);
        if (aiMoves.length === 0) {
          renderBoard();
          endGame('HUMAN');
          return;
        }

        renderBoard();

        isAiTurn = true;
        const statusEl = document.getElementById('damasStatus');
        if (statusEl) statusEl.textContent = 'IA EconData calculando melhor lance...';

        setTimeout(makeAiMove, 350);
        return;
      }
    }

    const val = board[r][c];
    if (val !== EMPTY && isHumanPiece(val)) {
      const allHumanMoves = getAllMoves(board, true);
      const pieceMoves = allHumanMoves.filter(m => m.from[0] === r && m.from[1] === c);

      if (pieceMoves.length > 0) {
        selectedSquare = [r, c];
        validMovesForSelected = pieceMoves;
        renderBoard();
      } else {
        const hasCaptures = allHumanMoves.some(m => m.isCapture);
        const statusEl = document.getElementById('damasStatus');
        if (statusEl && hasCaptures) {
          statusEl.textContent = '⚠️ Captura obrigatória! Selecione a peça que pode capturar.';
          statusEl.style.color = '#F59E0B';
        }
      }
    } else {
      selectedSquare = null;
      validMovesForSelected = [];
      renderBoard();
    }
  }

  function makeAiMove() {
    if (isGameOver) return;

    const result = minimaxDamas(board, 3, -Infinity, Infinity, true);

    if (result && result.move) {
      board = applyMove(board, result.move);

      const humanMoves = getAllMoves(board, true);
      if (humanMoves.length === 0) {
        renderBoard();
        endGame('AI');
        return;
      }

      renderBoard();
      isAiTurn = false;
      const statusEl = document.getElementById('damasStatus');
      if (statusEl) {
        statusEl.textContent = 'Sua vez de jogar (Peças Brancas).';
        statusEl.style.color = '';
      }
    } else {
      endGame('HUMAN');
    }
  }

  function endGame(winner) {
    isGameOver = true;
    isAiTurn = false;
    const statusEl = document.getElementById('damasStatus');

    if (winner === 'HUMAN') {
      scores.human++;
      const scoreEl = document.getElementById('damasHumanScore');
      if (scoreEl) scoreEl.textContent = scores.human;
      if (statusEl) {
        statusEl.textContent = '🏆 Parabéns! Você venceu a IA no Jogo de Damas!';
        statusEl.style.color = '#10B981';
      }
    } else if (winner === 'AI') {
      scores.ai++;
      const scoreEl = document.getElementById('damasAiScore');
      if (scoreEl) scoreEl.textContent = scores.ai;
      if (statusEl) {
        statusEl.textContent = '🤖 A IA EconData venceu esta partida de Damas!';
        statusEl.style.color = '#EF4444';
      }
    }
  }
})();
