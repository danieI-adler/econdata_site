// --- Easter Egg: Jogo de Xadrez (Chess) Completo com Roque, Xeque-Mate Oficial e IA Minimax Calibrada ---
// Ativado exclusivamente quando o usuário digita "XADREZ" ou "CHESS" no Console R

(function() {
  const SYMBOLS = {
    'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
    'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
  };

  const PIECE_VALUES = {
    'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000
  };

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
  let castling = { wK: true, wQ: true, bK: true, bQ: true };
  let selectedSquare = null;
  let validMovesForSelected = [];
  let isGameOver = false;
  let isAiTurn = false;
  let turn = 'w';
  let scores = { human: 0, ai: 0, draws: 0 };
  let inCheckColor = null;

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

  function findKing(b, color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c] === color + 'K') return [r, c];
      }
    }
    return null;
  }

  // Verifica se uma casa (r, c) está sob ataque por peças de 'byColor'
  function isSquareAttacked(b, r, c, byColor) {
    // 1. Ataque de peões
    const pawnDir = byColor === 'w' ? 1 : -1; // Se atacante for branco, vem de r+1
    for (const dc of [-1, 1]) {
      const pr = r + pawnDir;
      const pc = c + dc;
      if (inBounds(pr, pc) && b[pr][pc] === byColor + 'P') return true;
    }

    // 2. Cavalos
    const knightOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightOffsets) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && b[nr][nc] === byColor + 'N') return true;
    }

    // 3. Bispos e Rainhas (diagonais)
    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (inBounds(nr, nc)) {
        const piece = b[nr][nc];
        if (piece) {
          if (piece === byColor + 'B' || piece === byColor + 'Q') return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // 4. Torres e Rainhas (retas)
    const straightDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of straightDirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (inBounds(nr, nc)) {
        const piece = b[nr][nc];
        if (piece) {
          if (piece === byColor + 'R' || piece === byColor + 'Q') return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // 5. Rei adjacente
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc) && b[nr][nc] === byColor + 'K') return true;
      }
    }

    return false;
  }

  function isKingInCheck(b, color) {
    const kingPos = findKing(b, color);
    if (!kingPos) return true;
    const enemy = color === 'w' ? 'b' : 'w';
    return isSquareAttacked(b, kingPos[0], kingPos[1], enemy);
  }

  // Gera movimentos pseudo-legais (incluindo Roque)
  function getPseudoMoves(b, r, c, cRights) {
    const piece = b[r][c];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];
    const moves = [];
    const enemy = color === 'w' ? 'b' : 'w';

    if (type === 'P') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;

      if (inBounds(r + dir, c) && !b[r + dir][c]) {
        moves.push([r + dir, c]);
        if (r === startRow && inBounds(r + 2 * dir, c) && !b[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
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
        if (inBounds(nr, nc) && (!b[nr][nc] || b[nr][nc][0] === enemy)) {
          moves.push([nr, nc]);
        }
      }
    } else if (type === 'B' || type === 'R' || type === 'Q') {
      const directions = [];
      if (type === 'B' || type === 'Q') directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      if (type === 'R' || type === 'Q') directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);

      for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;
        while (inBounds(nr, nc)) {
          if (!b[nr][nc]) {
            moves.push([nr, nc]);
          } else {
            if (b[nr][nc][0] === enemy) moves.push([nr, nc]);
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
    } else if (type === 'K') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (inBounds(nr, nc) && (!b[nr][nc] || b[nr][nc][0] === enemy)) {
            moves.push([nr, nc]);
          }
        }
      }

      // Roque (Castling)
      if (cRights) {
        const baseRow = color === 'w' ? 7 : 0;
        if (r === baseRow && c === 4 && !isSquareAttacked(b, baseRow, 4, enemy)) {
          // Roque Pequeno (Rei-lado: col 4 para col 6)
          const kRight = color === 'w' ? cRights.wK : cRights.bK;
          if (kRight && b[baseRow][7] === color + 'R') {
            if (!b[baseRow][5] && !b[baseRow][6]) {
              if (!isSquareAttacked(b, baseRow, 5, enemy) && !isSquareAttacked(b, baseRow, 6, enemy)) {
                moves.push([baseRow, 6]);
              }
            }
          }
          // Roque Grande (Dama-lado: col 4 para col 2)
          const qRight = color === 'w' ? cRights.wQ : cRights.bQ;
          if (qRight && b[baseRow][0] === color + 'R') {
            if (!b[baseRow][1] && !b[baseRow][2] && !b[baseRow][3]) {
              if (!isSquareAttacked(b, baseRow, 3, enemy) && !isSquareAttacked(b, baseRow, 2, enemy)) {
                moves.push([baseRow, 2]);
              }
            }
          }
        }
      }
    }

    return moves;
  }

  // Aplica movimento no tabuleiro com promoção e roque
  function applyMove(b, from, to) {
    const nb = cloneBoard(b);
    const piece = nb[from[0]][from[1]];
    nb[from[0]][from[1]] = null;

    // Movimento de Roque: mover a torre junto
    if (piece === 'wK' || piece === 'bK') {
      if (from[1] === 4 && to[1] === 6) {
        // Roque curto
        nb[from[0]][5] = nb[from[0]][7];
        nb[from[0]][7] = null;
      } else if (from[1] === 4 && to[1] === 2) {
        // Roque longo
        nb[from[0]][3] = nb[from[0]][0];
        nb[from[0]][0] = null;
      }
    }

    // Promoção de Peão para Rainha
    if (piece === 'wP' && to[0] === 0) {
      nb[to[0]][to[1]] = 'wQ';
    } else if (piece === 'bP' && to[0] === 7) {
      nb[to[0]][to[1]] = 'bQ';
    } else {
      nb[to[0]][to[1]] = piece;
    }

    return nb;
  }

  function updateCastlingRights(cRights, from, to, piece) {
    const next = { ...cRights };
    if (piece === 'wK') { next.wK = false; next.wQ = false; }
    if (piece === 'bK') { next.bK = false; next.bQ = false; }

    if (from[0] === 7 && from[1] === 0) next.wQ = false;
    if (from[0] === 7 && from[1] === 7) next.wK = false;
    if (from[0] === 0 && from[1] === 0) next.bQ = false;
    if (from[0] === 0 && from[1] === 7) next.bK = false;

    if (to[0] === 7 && to[1] === 0) next.wQ = false;
    if (to[0] === 7 && to[1] === 7) next.wK = false;
    if (to[0] === 0 && to[1] === 0) next.bQ = false;
    if (to[0] === 0 && to[1] === 7) next.bK = false;

    return next;
  }

  // Gera APENAS movimentos estritamente legais (que não deixam o próprio Rei em xeque)
  function getLegalMoves(b, r, c, cRights) {
    const pseudo = getPseudoMoves(b, r, c, cRights);
    const piece = b[r][c];
    if (!piece) return [];
    const color = piece[0];
    const legal = [];

    for (const [tr, tc] of pseudo) {
      const nextBoard = applyMove(b, [r, c], [tr, tc]);
      if (!isKingInCheck(nextBoard, color)) {
        legal.push([tr, tc]);
      }
    }
    return legal;
  }

  function getAllLegalMoves(b, color, cRights) {
    const list = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c] && b[r][c][0] === color) {
          const targets = getLegalMoves(b, r, c, cRights);
          for (const target of targets) {
            list.push({ from: [r, c], to: target, piece: b[r][c], targetPiece: b[target[0]][target[1]] });
          }
        }
      }
    }
    return list;
  }

  // Heurística de avaliação posicional
  function evaluateBoard(b) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = b[r][c];
        if (!piece) continue;
        const color = piece[0];
        const type = piece[1];
        let val = PIECE_VALUES[type] || 0;

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

  // Minimax com Poda Alpha-Beta (Profundidade 3 para tática e precisão real)
  function minimax(b, depth, alpha, beta, isMaximizing, cRights) {
    const color = isMaximizing ? 'b' : 'w';
    const moves = getAllLegalMoves(b, color, cRights);

    if (moves.length === 0) {
      if (isKingInCheck(b, color)) {
        return { score: isMaximizing ? -50000 + (3 - depth) * 100 : 50000 - (3 - depth) * 100 };
      }
      return { score: 0 }; // Empate
    }

    if (depth === 0) {
      return { score: evaluateBoard(b) };
    }

    // Ordenação de capturas
    moves.sort((m1, m2) => {
      const val1 = m1.targetPiece ? PIECE_VALUES[m1.targetPiece[1]] || 0 : 0;
      const val2 = m2.targetPiece ? PIECE_VALUES[m2.targetPiece[1]] || 0 : 0;
      return val2 - val1;
    });

    if (isMaximizing) {
      let maxScore = -Infinity;
      let bestMove = moves[0];
      for (const m of moves) {
        const nextBoard = applyMove(b, m.from, m.to);
        const nextCRights = updateCastlingRights(cRights, m.from, m.to, m.piece);
        const result = minimax(nextBoard, depth - 1, alpha, beta, false, nextCRights);
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
        const nextBoard = applyMove(b, m.from, m.to);
        const nextCRights = updateCastlingRights(cRights, m.from, m.to, m.piece);
        const result = minimax(nextBoard, depth - 1, alpha, beta, true, nextCRights);
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
    castling = { wK: true, wQ: true, bK: true, bQ: true };
    selectedSquare = null;
    validMovesForSelected = [];
    isGameOver = false;
    isAiTurn = false;
    turn = 'w';
    inCheckColor = null;

    containerEl.innerHTML = `
      <div class="chess-overlay-game">
        <div class="chess-header">
          <div class="chess-title">
            <span class="chess-icon">♚</span>
            <div>
              <strong>XADREZ PROFISSIONAL · EconData</strong>
              <small>Regras FIDE (Roque, Xeque-Mate Oficial) • IA Minimax Profundidade 3</small>
            </div>
          </div>
          <div class="chess-stats">
            <span title="Vitórias do Jogador">Você: <strong id="chessHumanScore">${scores.human}</strong></span>
            <span title="Vitórias da IA">IA: <strong id="chessAiScore">${scores.ai}</strong></span>
            <span title="Empates">Empates: <strong id="chessDrawScore">${scores.draws}</strong></span>
            <button class="chess-btn-icon" onclick="window.closeChessGame()" title="Fechar jogo">✕</button>
          </div>
        </div>

        <div class="chess-board-wrapper">
          <div class="chess-board" id="chessBoard"></div>
        </div>

        <div class="chess-status" id="chessStatus">Sua vez (Brancas). Selecione uma peça para mover.</div>

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
    castling = { wK: true, wQ: true, bK: true, bQ: true };
    selectedSquare = null;
    validMovesForSelected = [];
    isGameOver = false;
    isAiTurn = false;
    turn = 'w';
    inCheckColor = null;
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

    const kingInCheckPos = inCheckColor ? findKing(board, inCheckColor) : null;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        square.className = `chess-sq ${isLight ? 'light' : 'dark'}`;
        square.dataset.row = r;
        square.dataset.col = c;

        if (selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c) {
          square.classList.add('selected');
        }

        const isValid = validMovesForSelected.some(([vr, vc]) => vr === r && vc === c);
        if (isValid) {
          square.classList.add(board[r][c] ? 'valid-capture' : 'valid-move');
        }

        if (kingInCheckPos && kingInCheckPos[0] === r && kingInCheckPos[1] === c) {
          square.classList.add('in-check');
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

    if (selectedSquare) {
      const [sr, sc] = selectedSquare;
      const isValid = validMovesForSelected.some(([vr, vc]) => vr === r && vc === c);

      if (isValid) {
        const movingPiece = board[sr][sc];
        board = applyMove(board, [sr, sc], [r, c]);
        castling = updateCastlingRights(castling, [sr, sc], [r, c], movingPiece);

        selectedSquare = null;
        validMovesForSelected = [];

        // Verifica estado das pretas após o lance das brancas
        const blackMoves = getAllLegalMoves(board, 'b', castling);
        const blackInCheck = isKingInCheck(board, 'b');

        if (blackMoves.length === 0) {
          if (blackInCheck) {
            inCheckColor = 'b';
            renderBoard();
            endGame('HUMAN');
          } else {
            renderBoard();
            endGame('DRAW');
          }
          return;
        }

        inCheckColor = blackInCheck ? 'b' : null;
        renderBoard();

        // Passa a vez para a IA
        turn = 'b';
        isAiTurn = true;
        const statusEl = document.getElementById('chessStatus');
        if (statusEl) {
          statusEl.textContent = blackInCheck ? 'Xeque! IA calculando resposta...' : 'IA EconData calculando jogada...';
          statusEl.style.color = blackInCheck ? '#EF4444' : '';
        }

        setTimeout(makeAiMove, 300);
        return;
      }
    }

    const clickedPiece = board[r][c];
    if (clickedPiece && clickedPiece[0] === 'w') {
      selectedSquare = [r, c];
      validMovesForSelected = getLegalMoves(board, r, c, castling);
      renderBoard();
    } else {
      selectedSquare = null;
      validMovesForSelected = [];
      renderBoard();
    }
  }

  function makeAiMove() {
    if (isGameOver) return;

    // Busca Minimax profundidade 3
    const result = minimax(board, 3, -Infinity, Infinity, true, castling);

    if (result && result.move) {
      const m = result.move;
      board = applyMove(board, m.from, m.to);
      castling = updateCastlingRights(castling, m.from, m.to, m.piece);

      const whiteMoves = getAllLegalMoves(board, 'w', castling);
      const whiteInCheck = isKingInCheck(board, 'w');

      if (whiteMoves.length === 0) {
        if (whiteInCheck) {
          inCheckColor = 'w';
          renderBoard();
          endGame('AI');
        } else {
          renderBoard();
          endGame('DRAW');
        }
        return;
      }

      inCheckColor = whiteInCheck ? 'w' : null;
      renderBoard();

      turn = 'w';
      isAiTurn = false;
      const statusEl = document.getElementById('chessStatus');
      if (statusEl) {
        statusEl.textContent = whiteInCheck ? '⚠️ SEU REI ESTÁ EM XEQUE! Escolha sua defesa.' : 'Sua vez de jogar (Peças Brancas).';
        statusEl.style.color = whiteInCheck ? '#EF4444' : '';
      }
    } else {
      endGame('DRAW');
    }
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
        statusEl.textContent = '🏆 XEQUE-MATE! Vitória memorável sobre a IA!';
        statusEl.style.color = '#10B981';
      }
    } else if (winner === 'AI') {
      scores.ai++;
      const scoreEl = document.getElementById('chessAiScore');
      if (scoreEl) scoreEl.textContent = scores.ai;
      if (statusEl) {
        statusEl.textContent = '💀 XEQUE-MATE! A IA EconData venceu esta partida.';
        statusEl.style.color = '#EF4444';
      }
    } else {
      scores.draws++;
      const scoreEl = document.getElementById('chessDrawScore');
      if (scoreEl) scoreEl.textContent = scores.draws;
      if (statusEl) {
        statusEl.textContent = '🤝 EMPATE! Rei afogado sem lances legais.';
        statusEl.style.color = '#F59E0B';
      }
    }
  }
})();
