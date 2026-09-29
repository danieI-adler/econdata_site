// --- Easter Egg: Jogo da Toupeira (Toca Delivery / Courier Runner) ---
// Ativado exclusivamente quando o usuário digita "TOUPEIRA", "TOCA" ou "DELIVERY" no Console R

(function() {
  window.launchToupeiraGame = function(containerEl) {
    if (!containerEl) return;

    containerEl.innerHTML = `
      <div class="toupeira-overlay-game">
        <div class="toupeira-header">
          <div class="toupeira-title">
            <span class="toupeira-icon">🛵</span>
            <div>
              <strong>TOCA DELIVERY · Underground Courier</strong>
              <small>Direto de Copacabana & Santa Teresa · W/A/S/D ou Setas para pilotar</small>
            </div>
          </div>
          <div class="toupeira-actions-top">
            <button class="console-btn-action" onclick="window.openToupeiraFullscreen()" title="Abrir Toca Delivery em tela cheia">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              <span>Tela Cheia</span>
            </button>
            <button class="chess-btn-icon" onclick="window.closeToupeiraGame()" title="Fechar jogo">✕</button>
          </div>
        </div>

        <div class="toupeira-frame-wrapper">
          <iframe id="toupeiraFrame" src="toca-delivery.html" frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="toupeira-footer">
          <span>Controles: <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Dirigir · <kbd>Espaço</kbd> Cavar Subsolo (Burrow) · <kbd>B</kbd> Caipirinha Boost</span>
        </div>
      </div>
    `;

    // Foca o iframe para capturar comandos de teclado de imediato
    setTimeout(() => {
      const frame = document.getElementById('toupeiraFrame');
      if (frame) {
        try { frame.focus(); } catch (e) {}
      }
    }, 200);
  };

  window.closeToupeiraGame = function() {
    const plotArea = document.getElementById('console-plot-area');
    if (plotArea) {
      plotArea.innerHTML = '<div class="plot-placeholder" id="plot-placeholder">Nenhum gráfico gerado ainda.<br>Gere um gráfico com <code>plot()</code> ou <code>ggplot()</code>.</div>';
    }
    const terminal = document.getElementById('r-terminal-output');
    if (terminal) {
      terminal.textContent += '\n[Easter Egg]: Toca Delivery encerrado. Console R pronto.';
    }
  };

  window.openToupeiraFullscreen = function() {
    window.open('toca-delivery.html', '_blank');
  };
})();
