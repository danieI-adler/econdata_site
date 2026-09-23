// --- Easter Egg: Jogo TERMO (EconData) ---
// Ativado exclusivamente quando o usuário digita "TERMO" no Console R

(function() {
  const TERMO_WORDS = [
    "DADOS", "VALOR", "SELIC", "LUCRO", "ACOES", "BOLSA", "ATIVO", "BANCO", "TAXAS", "RISCO",
    "FUNDO", "MOEDA", "PRECO", "CONTA", "SALDO", "RENDA", "CUSTO", "CAMBIO", "TITULO", "DIVIDA",
    "MERCADO", "PRAZO", "JUROS", "OFERTA", "GANHO", "PERDA", "SALDO", "MACRO", "MICRO", "INDEX",
    "TERMO", "LOGICA", "VETOR", "GRAFO", "MATRIZ", "CHAVE", "LINHA", "SERIE", "TESTE", "MODELO",
    "TEMPO", "POUCO", "MUITO", "CERTO", "FORTE", "PLANO", "METAS", "FONTE", "CASOS", "REGRA",
    "PASSO", "ORDEM", "PONTO", "GRUPO", "BLOCO", "CORPO", "FLUXO", "SIGLA", "FAVOR", "PODER",
    "SABER", "FORMA", "PARTE", "NOITE", "TARDE", "LUGAR", "MUNDO", "MUNDO", "IDEIA", "TEXTO",
    "AUTOR", "VALER", "VIVER", "DIZER", "FAZER", "GERAR", "CRIAR", "SUBIR", "MEDIR", "FIXAR",
    "NOTAS", "CARRO", "CASAL", "FOLHA", "LIVRO", "LETRA", "CAMPO", "PRAIA", "PEDRA", "PORTA",
    "VERDE", "CLARO", "PRETO", "PRATA", "OURO", "BRUTO", "NOBRE", "TOTAL", "UNIAO", "BASE"
  ].filter(w => w.length === 5);

  let targetWord = "";
  let currentAttempt = 0;
  let currentLetter = 0;
  let isGameOver = false;
  const MAX_ATTEMPTS = 6;
  const WORD_LENGTH = 5;

  function pickRandomWord() {
    return TERMO_WORDS[Math.floor(Math.random() * TERMO_WORDS.length)];
  }

  window.launchTermoGame = function(containerEl) {
    if (!containerEl) return;
    targetWord = pickRandomWord();
    currentAttempt = 0;
    currentLetter = 0;
    isGameOver = false;

    containerEl.innerHTML = `
      <div class="termo-overlay-game" id="termoContainer">
        <div class="termo-header">
          <div class="termo-title">
            <span class="termo-badge">EASTER EGG</span>
            <span>TERMO</span>
          </div>
          <button class="termo-close-btn" onclick="closeTermoGame()" title="Sair do jogo">✕</button>
        </div>
        
        <div class="termo-board" id="termoBoard">
          ${Array(MAX_ATTEMPTS).fill(0).map((_, r) => `
            <div class="termo-row" data-row="${r}">
              ${Array(WORD_LENGTH).fill(0).map((_, c) => `
                <div class="termo-cell" data-cell="${c}"></div>
              `).join('')}
            </div>
          `).join('')}
        </div>

        <div class="termo-msg" id="termoMsg">Descubra a palavra certa em 6 tentativas.</div>

        <div class="termo-keyboard" id="termoKeyboard">
          <div class="termo-kb-row">
            ${['Q','W','E','R','T','Y','U','I','O','P'].map(k => `<button class="termo-key" data-key="${k}">${k}</button>`).join('')}
          </div>
          <div class="termo-kb-row">
            ${['A','S','D','F','G','H','J','K','L'].map(k => `<button class="termo-key" data-key="${k}">${k}</button>`).join('')}
          </div>
          <div class="termo-kb-row">
            <button class="termo-key wide" data-key="ENTER">ENTER</button>
            ${['Z','X','C','V','B','N','M'].map(k => `<button class="termo-key" data-key="${k}">${k}</button>`).join('')}
            <button class="termo-key wide" data-key="BACKSPACE">⌫</button>
          </div>
        </div>
      </div>
    `;

    // Listeners do Teclado Virtual
    const kb = containerEl.querySelector('#termoKeyboard');
    if (kb) {
      kb.addEventListener('click', (e) => {
        const btn = e.target.closest('.termo-key');
        if (!btn) return;
        const key = btn.getAttribute('data-key');
        handleTermoInput(key);
      });
    }

    // Listener do Teclado Físico
    window.removeEventListener('keydown', handlePhysicalKey);
    window.addEventListener('keydown', handlePhysicalKey);
  };

  window.closeTermoGame = function() {
    window.removeEventListener('keydown', handlePhysicalKey);
    const plotArea = document.getElementById('console-plot-area');
    if (plotArea) {
      plotArea.innerHTML = '<div class="plot-placeholder" id="plot-placeholder">Nenhum gráfico gerado ainda.<br>Gere um gráfico com <code>plot()</code> ou <code>ggplot()</code>.</div>';
    }
    const terminal = document.getElementById('r-terminal-output');
    if (terminal) {
      terminal.textContent += '\n[Easter Egg]: Jogo TERMO encerrado. Console R pronto.';
    }
  };

  function handlePhysicalKey(e) {
    if (isGameOver) return;
    const key = e.key.toUpperCase();
    if (key === 'ENTER') {
      e.preventDefault();
      handleTermoInput('ENTER');
    } else if (key === 'BACKSPACE') {
      e.preventDefault();
      handleTermoInput('BACKSPACE');
    } else if (/^[A-Z]$/.test(key)) {
      handleTermoInput(key);
    }
  }

  function handleTermoInput(key) {
    if (isGameOver) return;
    const rowEl = document.querySelector(`.termo-row[data-row="${currentAttempt}"]`);
    if (!rowEl) return;
    const cells = rowEl.querySelectorAll('.termo-cell');
    const msgEl = document.getElementById('termoMsg');

    if (key === 'BACKSPACE') {
      if (currentLetter > 0) {
        currentLetter--;
        cells[currentLetter].textContent = '';
        cells[currentLetter].classList.remove('filled');
      }
    } else if (key === 'ENTER') {
      if (currentLetter < WORD_LENGTH) {
        if (msgEl) {
          msgEl.textContent = 'Palavra incompleta! Digite 5 letras.';
          msgEl.classList.add('shake');
          setTimeout(() => msgEl.classList.remove('shake'), 400);
        }
        return;
      }

      // Validar tentativa
      const guess = Array.from(cells).map(c => c.textContent).join('');
      checkGuess(guess, cells, msgEl);
    } else if (/^[A-Z]$/.test(key)) {
      if (currentLetter < WORD_LENGTH) {
        cells[currentLetter].textContent = key;
        cells[currentLetter].classList.add('filled');
        currentLetter++;
      }
    }
  }

  function checkGuess(guess, cells, msgEl) {
    const targetArr = targetWord.split('');
    const guessArr = guess.split('');
    const status = Array(WORD_LENGTH).fill('absent'); // 'correct' (verde), 'present' (amarelo), 'absent' (cinza)
    const letterCount = {};

    for (let char of targetArr) {
      letterCount[char] = (letterCount[char] || 0) + 1;
    }

    // 1ª passagem: verificar acertos exatos (Verde)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArr[i] === targetArr[i]) {
        status[i] = 'correct';
        letterCount[guessArr[i]]--;
      }
    }

    // 2ª passagem: verificar letras na posição errada (Amarelo)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (status[i] !== 'correct' && letterCount[guessArr[i]] > 0) {
        status[i] = 'present';
        letterCount[guessArr[i]]--;
      }
    }

    // Aplicar classes nas células com animação
    cells.forEach((cell, i) => {
      setTimeout(() => {
        cell.classList.add(status[i]);
        updateKeyboardKey(guessArr[i], status[i]);
      }, i * 150);
    });

    if (guess === targetWord) {
      isGameOver = true;
      if (msgEl) {
        setTimeout(() => {
          msgEl.textContent = `🎉 Parabéns! Você acertou em ${currentAttempt + 1} tentativa(s)!`;
          msgEl.style.color = '#10B981';
        }, WORD_LENGTH * 150 + 200);
      }
      return;
    }

    currentAttempt++;
    currentLetter = 0;

    if (currentAttempt >= MAX_ATTEMPTS) {
      isGameOver = true;
      if (msgEl) {
        setTimeout(() => {
          msgEl.textContent = `Fim de jogo! A palavra era: ${targetWord}`;
          msgEl.style.color = '#EF4444';
        }, WORD_LENGTH * 150 + 200);
      }
    } else {
      if (msgEl) msgEl.textContent = `Tentativa ${currentAttempt + 1} de ${MAX_ATTEMPTS}`;
    }
  }

  function updateKeyboardKey(letter, status) {
    const btn = document.querySelector(`.termo-key[data-key="${letter}"]`);
    if (!btn) return;
    if (status === 'correct') {
      btn.className = 'termo-key key-correct';
    } else if (status === 'present' && !btn.classList.contains('key-correct')) {
      btn.className = 'termo-key key-present';
    } else if (status === 'absent' && !btn.classList.contains('key-correct') && !btn.classList.contains('key-present')) {
      btn.className = 'termo-key key-absent';
    }
  }
})();
