// --- Easter Egg: Jogo de Xadrez (Chess) vs IA Minimax ---
// Ativado exclusivamente quando o usuário digita "XADREZ" ou "CHESS" no Console R

(function() {
  // Peças de Xadrez
  // 'w' = White (Humano), 'b' = Black (IA EconData)
  // P = Peão, N = Cavalo, B = Bispo, R = Torre, Q = Rainha, K = Rei
  const SYMBOLS = {
    'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
    'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
  };

  const PIECE_VALUES = {
    'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000
  };

  // Positional heatmaps para incentivar jogo tático e desenvolvimento de centro
  const PAWN_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ];

  const KNIGHT_TABLE = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ];

  const BISHOP_TABLE = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ];

  let board = [];
  let selectedSquare = null;
  let validMovesForSelected = [];
  let isGameOver = false;
  let isAiTurn = false;
  let turn = 'w'; // 'w' joga primeiro
  let scores = { human: 0, ai: 0, draws: 0 };
  let moveLog = [];

  function createInitialBoard() {
    return [
      ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
      ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
      ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
    ];
  }

  function cloneBoard(b) {
    return b.map(row => [...row]);
  }

  function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  // Gera movimentos pseudo-legais para uma peça na posição (r, c)
  function getMoves(b, r, c) {
    const piece = b[r][c];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];
    const moves = [];

    const enemy = color === 'w' ? 'b' : 'w';

    if (type === 'P') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;

      // 1 passo à frente
      if (inBounds(r + dir, c) && !b[r + dir][c]) {
        moves.push([r + dir, c]);
        // 2 passos do início
        if (r === startRow && inBounds(r + 2 * dir, c) && !b[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }

      // Capturas nas diagonais
      for (const dc of [-1, 1]) {
        const nr = r + dir;
        const nc = c + dc;
        if (inBounds(nr, nc) && b[nr][nc] && b[nr][nc][0] === enemy) {
          moves.push([nr, nc]);
        }
      }
    } else if (type === 'N') {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightOffsets) {
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc)) {
          if (!b[nr][nc] || b[nr][nc][0] === enemy) {
            moves.push([nr, nc]);
          }
        }
      }
    } else if (type === 'B' || type === 'R' || type === 'Q') {
      const directions = [];
      if (type === 'B' || type === 'Q') {
        directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }
      if (type === 'R' || type === 'Q') {
        directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }

      for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;
        while (inBounds(nr, nc)) {
          if (!b[nr][nc]) {
            moves.push([nr, nc]);
          } else {
            if (b[nr][nc][0] === enemy) {
              moves.push([nr, nc]);
            }
            break; // Bloqueado
          }
          nr += dr;
          nc += dc;
        }
      }
    } else if (type === 'K') {
      const kingOffsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      for (const [dr, dc] of kingOffsets) {
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc)) {
          if (!b[nr][nc] || b[nr][nc][0] === enemy) {
            moves.push([nr, nc]);
          }
        }
      }
    }

    return moves;
  }

  // Verifica se o Rei de uma determinada cor foi capturado ou se está presente
  function findKing(b, color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c] === color + 'K') return [r, c];
      }
    }
    return null;
  }

  // Todos os movimentos de um lado
  function getAllMoves(b, color) {
    const all = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c] && b[r][c][0] === color) {
          const targets = getMoves(b, r, c);
          for (const [tr, tc] of targets) {
            all.push({ from: [r, c], to: [tr, tc], piece: b[r][c], target: b[tr][tc] });
          }
        }
      }
    }
    return all;
  }

  // Aplica movimento com promoção de peão automática para Dama
  function makeMove(b, from, to) {
    const newBoard = cloneBoard(b);
    const piece = newBoard[from[0]][from[1]];
    newBoard[from[0]][from[1]] = null;

    // Promoção
    if (piece === 'wP' && to[0] === 0) {
      newBoard[to[0]][to[1]] = 'wQ';
    } else if (piece === 'bP' && to[0] === 7) {
      newBoard[to[0]][to[1]] = 'bQ';
    } else {
      newBoard[to[0]][to[1]] = piece;
    }

    return newBoard;
  }

  // Avaliação heurística do tabuleiro (Positivo para Pretas/IA, Negativo para Brancas/Humano)
  function evaluateBoard(b) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = b[r][c];
        if (!piece) continue;
        const color = piece[0];
        const type = piece[1];
        let val = PIECE_VALUES[type] || 0;

        // Bônus posicional
        if (type === 'P') {
          val += color === 'w' ? PAWN_TABLE[r][c] : PAWN_TABLE[7 - r][c];
        } else if (type === 'N') {
          val += color === 'w' ? KNIGHT_TABLE[r][c] : KNIGHT_TABLE[7 - r][c];
        } else if (type === 'B') {
          val += color === 'w' ? BISHOP_TABLE[r][c] : BISHOP_TABLE[7 - r][c];
        }

        if (color === 'b') {
          score += val;
        } else {
          score -= val;
        }
      }
    }
    return score;
  }

  // Minimax com Poda Alpha-Beta (Profundidade 2-3 para resposta rápida e tática)
  function minimax(b, depth, alpha, beta, isMaximizing) {
    if (depth === 0) {
      return { score: evaluateBoard(b) };
    }

    const whiteKing = findKing(b, 'w');
    const blackKing = findKing(b, 'b');
    if (!whiteKing) return { score: 99999 }; // Pretas ganharam
    if (!blackKing) return { score: -99999 }; // Brancas ganharam

    const color = isMaximizing ? 'b' : 'w';
    const moves = getAllMoves(b, color);

    if (moves.length === 0) {
      return { score: 0 }; // Empate por afogamento
    }

    // Ordenação simples de movimentos para otimizar poda alpha-beta (capturas primeiro)
    moves.sort((a, bMove) => {
      const valA = a.target ? PIECE_VALUES[a.target[1]] || 0 : 0;
      const valB = bMove.target ? PIECE_VALUES[bMove.target[1]] || 0 : 0;
      return valB - valA;
    });

    if (isMaximizing) {
      let maxScore = -Infinity;
      let bestMove = null;
      for (const m of moves) {
        const nb = makeMove(b, m.from, m.to);
        const result = minimax(nb, depth - 1, alpha, beta, false);
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
      let bestMove = null;
      for (const m of moves) {
        const nb = makeMove(b, m.from, m.to);
        const result = minimax(nb, depth - 1, alpha, beta, true);
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
  window.launchChessGame = function(containerEl) {
    if (!containerEl) return;
    board = createInitialBoard();
    selectedSquare = null;
    validMovesForSelected = [];
    isGameOver = false;
    isAiTurn = false;
    turn = 'w';
    moveLog = [];

    containerEl.innerHTML = `
      <div class="chess-overlay-game">
        <div class="chess-header">
          <div class="chess-title">
            <span class="chess-icon">♟</span>
            <div>
              <strong>XADREZ · EconData Analytics</strong>
              <small>Desafie a IA Minimax (Você joga com as Brancas)</small>
            </div>
          </div>
          <div class="chess-stats">
            <span title="Vitórias do Jogador">Você: <strong id="chessHumanScore">${scores.human}</strong></span>
            <span title="Vitórias da IA">IA: <strong id="chessAiScore">${scores.ai}</strong></span>
            <button class="chess-btn-icon" onclick="window.closeChessGame()" title="Fechar jogo">✕</button>
          </div>
        </div>

        <div class="chess-board-wrapper">
          <div class="chess-board" id="chessBoard"></div>
        </div>

        <div class="chess-status" id="chessStatus">Sua vez: Selecione uma peça branca para mover.</div>

        <div class="chess-actions">
          <button class="console-btn-action" onclick="window.resetChessGame()">Nova Partida</button>
          <button class="console-btn-action" onclick="window.closeChessGame()">Sair do Jogo</button>
        </div>
      </div>
    `;

    renderBoard();
  };

  window.closeChessGame = function() {
    const plotArea = document.getElementById('console-plot-area');
    if (plotArea) {
      plotArea.innerHTML = '<div class="plot-placeholder" id="plot-placeholder">Nenhum gráfico gerado ainda.<br>Gere um gráfico com <code>plot()</code> ou <code>ggplot()</code>.</div>';
    }
    const terminal = document.getElementById('r-terminal-output');
    if (terminal) {
      terminal.textContent += '\n[Easter Egg]: Partida de Xadrez encerrada. Console R pronto.';
    }
  };

  window.resetChessGame = function() {
    board = createInitialBoard();
    selectedSquare = null;
    validMovesForSelected = [];
    isGameOver = false;
    isAiTurn = false;
    turn = 'w';
    const statusEl = document.getElementById('chessStatus');
    if (statusEl) {
      statusEl.textContent = 'Nova partida iniciada! Sua vez (Peças Brancas).';
      statusEl.style.color = '';
    }
    renderBoard();
  };

  function renderBoard() {
    const boardEl = document.getElementById('chessBoard');
    if (!boardEl) return;
    boardEl.innerHTML = '';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        square.className = `chess-sq ${isLight ? 'light' : 'dark'}`;
        square.dataset.row = r;
        square.dataset.col = c;

        // Destaca selecionado
        if (selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c) {
          square.classList.add('selected');
        }

        // Destaca movimentos válidos
        const isValid = validMovesForSelected.some(([vr, vc]) => vr === r && vc === c);
        if (isValid) {
          square.classList.add(board[r][c] ? 'valid-capture' : 'valid-move');
        }

        const piece = board[r][c];
        if (piece) {
          const pieceSpan = document.createElement('span');
          pieceSpan.className = `chess-piece ${piece[0] === 'w' ? 'white-piece' : 'black-piece'}`;
          pieceSpan.textContent = SYMBOLS[piece] || '?';
          square.appendChild(pieceSpan);
        }

        square.addEventListener('click', () => handleSquareClick(r, c));
        boardEl.appendChild(square);
      }
    }
  }

  function handleSquareClick(r, c) {
    if (isGameOver || isAiTurn) return;

    // Se já havia uma peça selecionada e o clique foi em um movimento válido
    if (selectedSquare) {
      const [sr, sc] = selectedSquare;
      const isValid = validMovesForSelected.some(([vr, vc]) => vr === r && vc === c);

      if (isValid) {
        // Executar movimento do jogador
        board = makeMove(board, [sr, sc], [r, c]);
        selectedSquare = null;
        validMovesForSelected = [];
        renderBoard();

        // Verificar vitória imediata
        if (!findKing(board, 'b')) {
          endGame('HUMAN');
          return;
        }

        // Passa a vez para a IA
        turn = 'b';
        isAiTurn = true;
        const statusEl = document.getElementById('chessStatus');
        if (statusEl) statusEl.textContent = 'IA EconData calculando jogada...';

        setTimeout(makeAiMove, 350);
        return;
      }
    }

    // Seleção de peça própria (Branca)
    const clickedPiece = board[r][c];
    if (clickedPiece && clickedPiece[0] === 'w') {
      selectedSquare = [r, c];
      validMovesForSelected = getMoves(board, r, c);
      renderBoard();
    } else {
      selectedSquare = null;
      validMovesForSelected = [];
      renderBoard();
    }
  }

  function makeAiMove() {
    if (isGameOver) return;

    // Busca Minimax profundidade 2 (rápido e inteligente para jogos web)
    const depth = 2;
    const result = minimax(board, depth, -Infinity, Infinity, true);

    if (result.move) {
      board = makeMove(board, result.move.from, result.move.to);
      renderBoard();

      if (!findKing(board, 'w')) {
        endGame('AI');
        return;
      }
    } else {
      // IA sem movimentos
      endGame('DRAW');
      return;
    }

    turn = 'w';
    isAiTurn = false;
    const statusEl = document.getElementById('chessStatus');
    if (statusEl) statusEl.textContent = 'Sua vez de jogar (Peças Brancas).';
  }

  function endGame(winner) {
    isGameOver = true;
    isAiTurn = false;
    const statusEl = document.getElementById('chessStatus');

    if (winner === 'HUMAN') {
      scores.human++;
      const scoreEl = document.getElementById('chessHumanScore');
      if (scoreEl) scoreEl.textContent = scores.human;
      if (statusEl) {
        statusEl.textContent = '🏆 Xeque-mate! Você venceu a IA!';
        statusEl.style.color = '#10B981';
      }
    } else if (winner === 'AI') {
      scores.ai++;
      const scoreEl = document.getElementById('chessAiScore');
      if (scoreEl) scoreEl.textContent = scores.ai;
      if (statusEl) {
        statusEl.textContent = '🤖 Xeque-mate da IA EconData! Bom jogo!';
        statusEl.style.color = '#EF4444';
      }
    } else {
      scores.draws++;
      if (statusEl) {
        statusEl.textContent = '🤝 Partida empatada por afogamento!';
        statusEl.style.color = '#F59E0B';
      }
    }
  }
})();
