import { WebR } from 'https://webr.r-wasm.org/latest/webr.mjs';

    let webRInstance = null;
    let isInitialized = false;
    let isExecuting = false;

    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const statusBadge = document.getElementById('webr-status-badge');
    const btnRun = document.getElementById('btn-run-r');
    const terminalOutput = document.getElementById('r-terminal-output');
    const plotArea = document.getElementById('console-plot-area');
    const plotPlaceholder = document.getElementById('plot-placeholder');
    const codeEditor = document.getElementById('r-code-editor');

    // Alternância de Abas: Página Contínua vs Aba Separada do Console R
    window.showConsoleTab = function() {
      document.body.classList.add('tab-console-active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', '#console');
    };

    window.showMainFlow = function() {
      document.body.classList.remove('tab-console-active');
    };

    // Controle do Menu Drawer (Idêntico ao site do Gama)
    window.openDrawer = function() {
      const drawer = document.getElementById('sideDrawer');
      const overlay = document.getElementById('drawerOverlay');
      if (drawer) drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    window.closeDrawer = function() {
      const drawer = document.getElementById('sideDrawer');
      const overlay = document.getElementById('drawerOverlay');
      if (drawer) drawer.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    // Fechar menu com tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    // Limpar código do editor (deixa 100% em branco)
    window.clearCode = function() {
      codeEditor.value = '';
      codeEditor.focus();
    };

    // Abrir gráfico gerado em tela cheia numa nova aba
    window.openPlotFullscreen = function() {
      const canvas = plotArea.querySelector('canvas');
      if (!canvas) {
        alert('Nenhum gráfico gerado ainda. Execute um script para gerar um gráfico.');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const w = window.open('');
      if (w) {
        w.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Gráfico R — EconData Analytics</title>
              <style>
                body { margin: 0; background: #07101C; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                img { max-width: 95vw; max-height: 95vh; border-radius: 6px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); background: #ffffff; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="Gráfico R">
            </body>
          </html>
        `);
        w.document.close();
      }
    };

    // Fazer download do gráfico gerado em PNG
    window.downloadPlotImage = function() {
      const canvas = plotArea.querySelector('canvas');
      if (!canvas) {
        alert('Nenhum gráfico gerado ainda. Execute um script para gerar um gráfico.');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `econdata_grafico_r_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // Limpar saída: limpa apenas o terminal e a área de gráficos (NUNCA limpa o código do editor)
    window.clearOutput = function() {
      terminalOutput.textContent = '';
      plotArea.innerHTML = '<div class="plot-placeholder" id="plot-placeholder">Nenhum gráfico gerado ainda.<br>Gere um gráfico com <code>plot()</code> ou <code>ggplot()</code>.</div>';
    };

    // --- Gerenciador de Chave de API de IA (Opção A: 100% Local / localStorage) ---
    const API_KEY_STORAGE_KEY = 'econdata_ai_api_key';

    function getSavedApiKey() {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    }

    function updateApiKeyStatusUI() {
      const label = document.getElementById('api-key-status-label');
      const key = getSavedApiKey();
      if (label) {
        if (key) {
          label.textContent = 'Chave Conectada ✓';
          label.style.color = '#10B981';
        } else {
          label.textContent = 'Chave de API';
          label.style.color = '';
        }
      }
    }

    window.openApiKeyModal = function() {
      const modal = document.getElementById('apiKeyModalOverlay');
      const input = document.getElementById('api-key-input');
      if (input) input.value = getSavedApiKey();
      if (modal) modal.classList.add('is-open');
    };

    window.closeApiKeyModal = function() {
      const modal = document.getElementById('apiKeyModalOverlay');
      if (modal) modal.classList.remove('is-open');
    };

    window.saveApiKeyModal = function() {
      const input = document.getElementById('api-key-input');
      const val = input ? input.value.trim() : '';
      if (!val) {
        alert('Por favor, insira uma API Key válida.');
        return;
      }
      localStorage.setItem(API_KEY_STORAGE_KEY, val);
      updateApiKeyStatusUI();
      closeApiKeyModal();
      alert('Chave de API salva com segurança no seu navegador!');
    };

    window.removeSavedApiKey = function() {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      const input = document.getElementById('api-key-input');
      if (input) input.value = '';
      updateApiKeyStatusUI();
      closeApiKeyModal();
      alert('Chave removida do armazenamento local.');
    };

    // Geração de Código R via IA (Google Gemini API ou Groq / OpenAI compatível)
    window.generateCodeWithAI = async function() {
      const promptInput = document.getElementById('ai-prompt-input');
      const userPrompt = promptInput ? promptInput.value.trim() : '';
      if (!userPrompt) {
        alert('Por favor, descreva o gráfico ou análise que você deseja gerar.');
        if (promptInput) promptInput.focus();
        return;
      }

      const apiKey = getSavedApiKey();
      if (!apiKey) {
        openApiKeyModal();
        return;
      }

      const btn = document.getElementById('btn-generate-ai');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="console-status-indicator running" style="margin-right: 4px;"></span> Gerando código...`;

      terminalOutput.textContent = `[Assistente IA]: Conectando com a API para criar código R para: "${userPrompt}"...\n`;

      try {
        let generatedRCode = '';

        if (apiKey.startsWith('AIzaSy') || apiKey.startsWith('AQ.')) {
          // Chamada para Google Gemini API
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Você é um estatístico e econometrista sênior em R especialista em macroeconomia, finanças públicas, ggplot2 e brfinance para o núcleo EconData Analytics da PUC-Rio.
O ambiente WebR tem instalado: R 4.x, ggplot2, dplyr e funções financeiras.
Gere um script R executável, limpo e elegante para atender ao seguinte pedido do usuário:
"${userPrompt}"

DIRETRIZES DE INTELIGÊNCIA ECONÔMICA & DADOS REAIS:
1. DADOS REAIS E OFICIAIS DO BRASIL: Sempre que o usuário solicitar séries reais, históricas ou dados verdadeiros da economia brasileira (como Taxa Selic, IPCA, Câmbio Dólar, etc.), NUNCA invente ou simule dados com seq() ou rnorm().
   Consuma diretamente os dados oficiais do SGS do Banco Central do Brasil em formato CSV com read.csv().
   ATENÇÃO: O SGS do Banco Central EXIGE intervalo de datas para séries diárias (regra dos 10 anos do BCB), SEMPRE inclua os parâmetros dataInicial e dataFinal na URL (formato DD/MM/AAAA):
   - Taxa Selic Meta (% a.a.): "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=csv&dataInicial=01/01/2024&dataFinal=31/12/2026"
   - IPCA Mensal (%): "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=csv&dataInicial=01/01/2024&dataFinal=31/12/2026"
   - IPCA Acumulado 12 meses (%): "https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados?formato=csv&dataInicial=01/01/2024&dataFinal=31/12/2026"
   - Câmbio Dólar Comercial: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=csv&dataInicial=01/01/2024&dataFinal=31/12/2026"
   Exemplo de leitura robusta:
   df <- read.csv("https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=csv&dataInicial=01/01/2024&dataFinal=31/12/2026", sep = ";", dec = ",")
   df$data <- as.Date(df$data, format = "%d/%m/%Y")
   df$valor <- as.numeric(df$valor)
2. Se o pedido for um desenho/arte ou puramente teórico (ex: gatinho, simulação matemática), crie uma composição geométrica elegante com ggplot2 (geom_path, geom_polygon, geom_point).
3. REGRAS TÉCNICAS R:
   - Retorne APENAS código R válido e puro. NUNCA use blocos ou tags markdown (\`\`\`r ou \`\`\`).
   - NUNCA use install.packages().
   - Sempre chame print() no objeto ggplot para garantir renderização imediata no WebR.
   - Use temas elegantes: theme_minimal() com títulos estilizados e paleta profissional.`
                }]
              }]
            })
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `HTTP ${response.status} da API do Gemini.`);
          }

          const data = await response.json();
          generatedRCode = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          // Chamada genérica estilo OpenAI / Groq (para chaves gsk_ ou sk_)
          const endpoint = apiKey.startsWith('gsk_') 
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';
          const modelName = apiKey.startsWith('gsk_') ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                {
                  role: 'system',
                  content: 'Você é um estatístico e econometrista sênior em R especialista em macroeconomia, finanças e ggplot2 para o EconData Analytics da PUC-Rio. Se o usuário pedir dados reais da economia brasileira (Selic, IPCA, Dólar), consuma diretamente o CSV da API do Banco Central (SGS): https://api.bcb.gov.br/dados/serie/bcdata.sgs.<codigo>/dados?formato=csv (432 para Selic Meta, 13522 para IPCA 12m) com read.csv(..., sep=";", dec=","). NUNCA simule números aleatórios com rnorm/seq quando dados reais forem solicitados. Retorne APENAS código R puro, sem blocos markdown.'
                },
                {
                  role: 'user',
                  content: userPrompt
                }
              ]
            })
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `HTTP ${response.status} da API.`);
          }

          const data = await response.json();
          generatedRCode = data.choices?.[0]?.message?.content || '';
        }

        // Limpar possíveis formatações markdown residuais
        generatedRCode = generatedRCode.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

        if (generatedRCode) {
          codeEditor.value = generatedRCode;
          terminalOutput.textContent = `[Assistente IA]: Código R gerado com sucesso! Executando no WebR...\n`;
          runRCode();
        } else {
          terminalOutput.textContent += `[Assistente IA]: Nenhum código retornado pela API.\n`;
        }
      } catch (err) {
        console.error('Erro na chamada de IA:', err);
        terminalOutput.textContent += `\n[Erro na API de IA]: ${err.message}\nVerifique se a chave de API é válida e possui cotas disponíveis.`;
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    };

    async function initWebR() {
      try {
        statusDot.className = 'console-status-indicator running';
        statusText.textContent = 'Carregando WebR...';
        statusBadge.style.color = '#38BDF8';
        statusBadge.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        statusBadge.style.background = 'rgba(56, 189, 248, 0.1)';

        webRInstance = new WebR();
        await webRInstance.init();

        statusText.textContent = 'Pré-instalando ggplot2 e dplyr...';
        terminalOutput.textContent = 'Inicializando motor WebR WebAssembly...\nInstalando pacotes essenciais (ggplot2, dplyr) no ambiente virtual...\n';

        // Habilita shim_install
        await webRInstance.evalRVoid('webr::shim_install()');

        // Pré-instalar ggplot2 e dplyr (rápidos e leves)
        try {
          await webRInstance.installPackages(['ggplot2', 'dplyr']);
          await webRInstance.evalRVoid('library(ggplot2); library(dplyr)');
        } catch (pkgErr) {
          console.warn('Aviso no carregamento de pacotes:', pkgErr);
        }

        // Embutir funções essenciais do brfinance nativamente no ambiente R
        const brfinanceCoreR = `
# brfinance Core Functions (EconData Analytics)
calc_present_value <- function(fv, rate, n) {
  fv / ((1 + rate) ^ n)
}

calc_future_value <- function(pv, rate, n) {
  pv * ((1 + rate) ^ n)
}

calc_loan_pmt <- function(principal, rate, n) {
  principal * (rate * (1 + rate)^n) / ((1 + rate)^n - 1)
}

calc_npv <- function(rate, cash_flows) {
  t <- 0:(length(cash_flows) - 1)
  sum(cash_flows / ((1 + rate) ^ t))
}

calc_irr <- function(cash_flows) {
  uniroot(function(r) calc_npv(r, cash_flows), interval = c(-0.99, 2))$root
}

plot_series_comparison <- function(series1, series2, name1 = "Série 1", name2 = "Série 2", title = "Comparação de Séries") {
  df <- data.frame(
    Periodo = 1:length(series1),
    S1 = series1,
    S2 = series2
  )
  p <- ggplot(df, aes(x = Periodo)) +
    geom_line(aes(y = S1, color = name1), linewidth = 1.2) +
    geom_point(aes(y = S1, color = name1), size = 2) +
    geom_line(aes(y = S2, color = name2), linewidth = 1.2, linetype = "dashed") +
    geom_point(aes(y = S2, color = name2), size = 2) +
    scale_color_manual(values = setNames(c("#0284C7", "#EF4444"), c(name1, name2))) +
    labs(title = title, x = "Período (Meses)", y = "Valor (%)", color = "Indicador") +
    theme_minimal(base_size = 12) +
    theme(legend.position = "bottom")
  return(p)
}
cat("Pacotes ggplot2, dplyr e módulo brfinance carregados com sucesso!\n")
`;
        await webRInstance.evalRVoid(brfinanceCoreR);

        isInitialized = true;
        statusDot.className = 'console-status-indicator ready';
        statusText.textContent = 'R 4.x + ggplot2 + brfinance';
        statusBadge.style.color = '#10B981';
        statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        statusBadge.style.background = 'rgba(16, 185, 129, 0.1)';

        terminalOutput.textContent = '=======================================================\n' +
          'EconData R WebAssembly Environment (Console v2.0)\n' +
          'Pacotes prontos: ggplot2, dplyr, brfinance (core)\n' +
          'Dica: Atalho para executar código: Ctrl + Enter\n' +
          '=======================================================\n';
      } catch (err) {
        console.error('Erro ao inicializar WebR:', err);
        statusDot.className = 'console-status-indicator';
        statusDot.style.background = '#EF4444';
        statusText.textContent = 'Erro ao inicializar WebR';
        terminalOutput.textContent = 'Erro ao carregar o motor WebR:\n' + err.message;
      }
    }

    window.runRCode = async function() {
      if (!isInitialized) {
        alert('O interpretador WebR está inicializando pacotes. Por favor, aguarde alguns instantes.');
        return;
      }
      if (isExecuting) return;

      let code = codeEditor.value.trim();
      if (!code) {
        terminalOutput.textContent = '# O editor está vazio. Digite um código R para executar.';
        return;
      }

      // No R em batch / WebAssembly, objetos ggplot só disparam o canvas gráfico se forem explicitamente impressos com print().
      // Se o script contém ggplot() mas não chama print(), garantimos a impressão do último objeto avaliado (.Last.value)
      if (code.includes('ggplot(') && !code.includes('print(')) {
        code = code + '\nif (exists(".Last.value") && inherits(.Last.value, "ggplot")) { print(.Last.value) }';
      }

      isExecuting = true;
      btnRun.disabled = true;
      btnRun.innerHTML = `<span class="console-status-indicator running" style="margin-right: 4px;"></span> Executando...`;
      terminalOutput.textContent = 'Executando script R...\n';

      try {
        const shelter = await new webRInstance.Shelter();
        const capture = await shelter.captureR(code, {
          captureGraphics: { width: 580, height: 380 }
        });

        // Processar saída de texto
        let outputText = '';
        if (capture.output && capture.output.length > 0) {
          outputText = capture.output
            .map(line => {
              if (line.type === 'stdout' || line.type === 'stderr') {
                return line.data;
              }
              return '';
            })
            .join('\\n');
        }

        terminalOutput.textContent = outputText.trim() ? outputText : '# Executado com sucesso.';

        // Processar gráficos (ImageBitmaps do webr::canvas)
        if (capture.images && capture.images.length > 0) {
          plotArea.innerHTML = '';
          capture.images.forEach(img => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            plotArea.appendChild(canvas);
          });
        }

        await shelter.purge();
      } catch (err) {
        console.error('Erro de execução no R:', err);
        terminalOutput.textContent += '\\n[Erro de Execução no R]: ' + err.message;
      } finally {
        isExecuting = false;
        btnRun.disabled = false;
        btnRun.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Executar Código (Run)`;
      }
    };

    // Suporte ao atalho Ctrl+Enter / Cmd+Enter
    codeEditor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runRCode();
      }
    });

    // Inicia o WebR assim que a página estiver pronta e checa URL hash
    window.addEventListener('DOMContentLoaded', () => {
      initWebR();
      if (window.location.hash === '#console') {
        showConsoleTab();
      }
    });