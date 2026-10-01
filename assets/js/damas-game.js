// --- Easter Egg: Jogo de Damas Tradicional (Regra Brasileira/Internacional) vs IA Minimax ---
// Ativado exclusivamente quando o usuário digita "DAMAS" ou "CHECKERS" no Console R
// Regras Oficiais:
// 1. Dama "Voadora": Move-se em diagonal por qualquer número de casas vazias para frente ou para trás.
// 2. Dama pode saltar por cima de uma peça adversária à distância e parar em qualquer casa vazia posterior.
// 3. Captura com peão para frente ou para trás.
// 4. Captura Obrigatória e Cadeia de Capturas (Double Jump / Salto Múltiplo contínuo no mesmo turno).

(function() {
  const EMPTY = 0;
  const HUMAN = 1;      // Peão Branco
  const HUMAN_KING = 2; // Dama Branca (movimento longo diagonal)
  const AI = 3;         // Peão Preto
  const AI_KING = 4;    // Dama Preta (movimento longo diagonal)

  let board = [];
  let selectedSquare = null;
  let validMovesForSelected = [];
  let isGameOver = false;
  let isAiTurn = false;
  let activeMultiCapture = null; // Quando uma peça está no meio de uma sequência de saltos
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

  // Gera movimentos de captura para uma peça em (r, c)
  function getCaptures(b, r, c) {
    const piece = b[r][c];
    if (piece === EMPTY) return [];
    const isH = isHumanPiece(piece);
    const isK = (piece === HUMAN_KING || piece === AI_KING);
    const enemyCheck = isH ? isAiPiece : isHumanPiece;
    const captures = [];

    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    if (!isK) {
      // Peão simples: salta exatamente 1 casa por cima de um adversário adjacente
      for (const [dr, dc] of diagDirs) {
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
    } else {
      // Dama Voadora (Regra Brasileira/Internacional):
      // Move-se em diagonal por casas livres, pode saltar sobre 1 peça adversária
      // e pousar em qualquer casa livre após a peça capturada naquela diagonal.
      for (const [dr, dc] of diagDirs) {
        let step = 1;
        let enemyPos = null;

        while (true) {
          const currR = r + dr * step;
          const currC = c + dc * step;
          if (!inBounds(currR, currC)) break;

          const currVal = b[currR][currC];
          if (currVal === EMPTY) {
            if (enemyPos) {
              // Já pulou o adversário; qualquer casa vazia subsequente é destino válido de captura!
              captures.push({
                from: [r, c],
                to: [currR, currC],
                jumped: enemyPos,
                isCapture: true
              });
            }
          } else if (enemyCheck(currVal)) {
            if (!enemyPos) {
              // Primeiro adversário encontrado nesta diagonal
              enemyPos = [currR, currC];
            } else {
              // Dois adversários seguidos na mesma diagonal: não pode pular ambos
              break;
            }
          } else {
            // Peça da mesma cor bloqueando
            break;
          }
          step++;
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
    const isK = (piece === HUMAN_KING || piece === AI_KING);
    const moves = [];

    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    if (!isK) {
      // Peão simples anda 1 casa para frente
      const forwardDirs = isH ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
      for (const [dr, dc] of forwardDirs) {
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
    } else {
      // Dama Voadora: anda ilimitadas casas vazias na diagonal
      for (const [dr, dc] of diagDirs) {
        let step = 1;
        while (true) {
          const nr = r + dr * step;
          const nc = c + dc * step;
          if (!inBounds(nr, nc)) break;
          if (b[nr][nc] === EMPTY) {
            moves.push({
              from: [r, c],
              to: [nr, nc],
              jumped: null,
              isCapture: false
            });
          } else {
            break; // Peça bloqueia caminho
          }
          step++;
        }
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

    // Regra da captura obrigatória: se houver capturas no tabuleiro, APENAS capturas são permitidas!
    return captures.length > 0 ? captures : simples;
  }

  // Aplica movimento no tabuleiro com promoção para Dama
  function applyMove(b, m) {
    const nb = cloneBoard(b);
    const piece = nb[m.from[0]][m.from[1]];
    nb[m.from[0]][m.from[1]] = EMPTY;

    if (m.jumped) {
      nb[m.jumped[0]][m.jumped[1]] = EMPTY;
    }

    // Promoção para Dama ao alcançar a última fileira
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
        if (val === HUMAN) score -= (100 + (7 - r) * 12);
        else if (val === HUMAN_KING) score -= 350;
        else if (val === AI) score += (100 + r * 12);
        else if (val === AI_KING) score += 350;
      }
    }
    return score;
  }

  // Gera todas as sequências completas de turnos (incluindo saltos múltiplos / double jump)
  function getTurnSequences(b, forHuman) {
    const initialMoves = getAllMoves(b, forHuman);
    if (initialMoves.length === 0) return [];
    if (!initialMoves[0].isCapture) {
      // Movimentos simples são 1 único lance
      return initialMoves.map(m => ({ moves: [m], finalBoard: applyMove(b, m) }));
    }

    // Para capturas, precisamos expandir encadeamentos recursivamente
    const completeSequences = [];

    function expand(currBoard, history) {
      const lastMove = history[history.length - 1];
      const nextCaptures = getCaptures(currBoard, lastMove.to[0], lastMove.to[1]);
      if (nextCaptures.length === 0) {
        completeSequences.push({ moves: history, finalBoard: currBoard });
      } else {
        for (const nc of nextCaptures) {
          const nextB = applyMove(currBoard, nc);
          expand(nextB, [...history, nc]);
        }
      }
    }

    for (const m of initialMoves) {
      const nextB = applyMove(b, m);
      expand(nextB, [m]);
    }

    return completeSequences;
  }

  // Minimax com sequências completas de turno e Alpha-Beta
  function minimaxDamas(b, depth, alpha, beta, isMaximizing) {
    const sequences = getTurnSequences(b, !isMaximizing);

    if (sequences.length === 0) {
      return { score: isMaximizing ? -100000 : 100000 };
    }

    if (depth === 0) {
      return { score: evaluateDamas(b) };
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      let bestSeq = sequences[0];
      for (const seq of sequences) {
        const result = minimaxDamas(seq.finalBoard, depth - 1, alpha, beta, false);
        if (result.score > maxScore) {
          maxScore = result.score;
          bestSeq = seq;
        }
        alpha = Math.max(alpha, maxScore);
        if (beta <= alpha) break;
      }
      return { score: maxScore, seq: bestSeq };
    } else {
      let minScore = Infinity;
      let bestSeq = sequences[0];
      for (const seq of sequences) {
        const result = minimaxDamas(seq.finalBoard, depth - 1, alpha, beta, true);
        if (result.score < minScore) {
          minScore = result.score;
          bestSeq = seq;
        }
        beta = Math.min(beta, minScore);
        if (beta <= alpha) break;
      }
      return { score: minScore, seq: bestSeq };
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
    activeMultiCapture = null;

    containerEl.innerHTML = `
      <div class="damas-overlay-game">
        <div class="damas-header">
          <div class="damas-title">
            <span class="damas-icon">⚪</span>
            <div>
              <strong>JOGO DE DAMAS · EconData Analytics</strong>
              <small>Dama Voadora • Salto Duplo/Múltiplo • Captura Obrigatória</small>
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
    activeMultiCapture = null;
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

    // Se estiver no meio de um double jump, o jogador é forçado a continuar com a mesma peça
    if (activeMultiCapture) {
      const matchMove = validMovesForSelected.find(m => m.to[0] === r && m.to[1] === c);
      if (matchMove) {
        board = applyMove(board, matchMove);
        checkChainCaptureOrPassTurn(matchMove.to[0], matchMove.to[1]);
      }
      return;
    }

    if (selectedSquare) {
      const matchMove = validMovesForSelected.find(m => m.to[0] === r && m.to[1] === c);
      if (matchMove) {
        board = applyMove(board, matchMove);

        if (matchMove.isCapture) {
          // Checar se há salto múltiplo adicional disponível
          checkChainCaptureOrPassTurn(matchMove.to[0], matchMove.to[1]);
          return;
        }

        // Movimento simples concluído -> passar turno para IA
        selectedSquare = null;
        validMovesForSelected = [];
        finishHumanTurn();
        return;
      }
    }

    // Selecionar nova peça
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
          statusEl.textContent = '⚠️ Captura obrigatória! Selecione uma peça que pode capturar.';
          statusEl.style.color = '#F59E0B';
        }
      }
    } else {
      selectedSquare = null;
      validMovesForSelected = [];
      renderBoard();
    }
  }

  // Verifica se há novas capturas em cadeia (Double Jump / Salto Múltiplo)
  function checkChainCaptureOrPassTurn(destR, destC) {
    const furtherCaptures = getCaptures(board, destR, destC);

    if (furtherCaptures.length > 0) {
      // O jogador DEVE continuar capturando nesta mesma jogada!
      activeMultiCapture = [destR, destC];
      selectedSquare = [destR, destC];
      validMovesForSelected = furtherCaptures;
      renderBoard();

      const statusEl = document.getElementById('damasStatus');
      if (statusEl) {
        statusEl.textContent = '🔥 Salto duplo/múltiplo disponível! Continue capturando com a mesma peça.';
        statusEl.style.color = '#10B981';
      }
    } else {
      // Capturas finalizadas
      activeMultiCapture = null;
      selectedSquare = null;
      validMovesForSelected = [];
      finishHumanTurn();
    }
  }

  function finishHumanTurn() {
    renderBoard();

    // Checar se IA ainda tem jogadas
    const aiMoves = getAllMoves(board, false);
    if (aiMoves.length === 0) {
      endGame('HUMAN');
      return;
    }

    isAiTurn = true;
    const statusEl = document.getElementById('damasStatus');
    if (statusEl) {
      statusEl.textContent = 'IA EconData calculando melhor sequência...';
      statusEl.style.color = '';
    }

    setTimeout(makeAiMoveSequence, 400);
  }

  function makeAiMoveSequence() {
    if (isGameOver) return;

    const result = minimaxDamas(board, 3, -Infinity, Infinity, true);

    if (result && result.seq && result.seq.moves && result.seq.moves.length > 0) {
      const moves = result.seq.moves;
      let stepIndex = 0;

      function executeStep() {
        if (stepIndex < moves.length) {
          board = applyMove(board, moves[stepIndex]);
          renderBoard();
          stepIndex++;
          if (stepIndex < moves.length) {
            // Pequeno delay visual para mostrar cada pulo do salto múltiplo da IA
            setTimeout(executeStep, 350);
          } else {
            // Fim do turno da IA
            checkAfterAiTurn();
          }
        }
      }

      executeStep();
    } else {
      endGame('HUMAN');
    }
  }

  function checkAfterAiTurn() {
    const humanMoves = getAllMoves(board, true);
    if (humanMoves.length === 0) {
      renderBoard();
      endGame('AI');
      return;
    }

    isAiTurn = false;
    const statusEl = document.getElementById('damasStatus');
    if (statusEl) {
      statusEl.textContent = 'Sua vez de jogar (Peças Brancas).';
      statusEl.style.color = '';
    }
  }

  function endGame(winner) {
    isGameOver = true;
    isAiTurn = false;
    activeMultiCapture = null;
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
