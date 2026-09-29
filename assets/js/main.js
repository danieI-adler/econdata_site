// --- Gerenciamento de Idioma (Português / Inglês) ---
const LANG_STORAGE_KEY = 'econdata_lang';

window.setLanguage = function(lang) {
  const currentLang = (lang === 'en') ? 'en' : 'pt';
  document.documentElement.setAttribute('lang', currentLang === 'en' ? 'en' : 'pt-BR');
  try {
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  } catch (e) {}

  const translations = window.ECONDATA_TRANSLATIONS ? window.ECONDATA_TRANSLATIONS[currentLang] : null;
  if (!translations) return;

  // Atualiza título da página
  if (translations.siteTitle) {
    document.title = translations.siteTitle;
  }

  // Atualiza todos os elementos que possuem data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] !== undefined) {
      el.textContent = translations[key];
    }
  });

  // Atualiza elementos com data-i18n-html (para textos que contêm tags HTML como <strong> ou <span>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (translations[key] !== undefined) {
      el.innerHTML = translations[key];
    }
  });

  // Atualiza placeholders de inputs
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key] !== undefined) {
      el.setAttribute('placeholder', translations[key]);
    }
  });

  // Atualiza labels dos botões de alternância de idioma
  const navLangLabel = document.getElementById('langToggleLabel');
  const drawerLangLabel = document.getElementById('drawerLangLabel');
  const langFlag = document.getElementById('langToggleFlag');

  if (navLangLabel) navLangLabel.textContent = currentLang === 'en' ? 'EN' : 'PT';
  if (langFlag) langFlag.textContent = currentLang === 'en' ? '🇺🇸' : '🇧🇷';
  if (drawerLangLabel) {
    drawerLangLabel.textContent = currentLang === 'en' ? '🇧🇷 Mudar para Português' : '🇺🇸 Switch to English';
  }
};

window.toggleLanguage = function() {
  const current = localStorage.getItem(LANG_STORAGE_KEY) || 'pt';
  window.setLanguage(current === 'en' ? 'pt' : 'en');
};

// Inicialização imediata do idioma (Default: pt)
(function initLanguage() {
  let savedLang = 'pt';
  try {
    savedLang = localStorage.getItem(LANG_STORAGE_KEY) || 'pt';
  } catch (e) {}
  // Executa após carregamento do DOM se o dicionário ainda não estiver presente
  if (window.ECONDATA_TRANSLATIONS) {
    window.setLanguage(savedLang);
  }
})();

// --- Gerenciamento de Tema (Claro / Escuro) ---
const THEME_STORAGE_KEY = 'econdata_theme';

window.setTheme = function(theme) {
  const isLight = theme === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
  try {
    localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark');
  } catch (e) {}

  const icon = document.getElementById('themeToggleIcon');
  const drawerLabel = document.getElementById('drawerThemeLabel');
  if (icon) icon.textContent = isLight ? '🌙' : '☀️';
  if (drawerLabel) {
    const currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'pt';
    if (currentLang === 'en') {
      drawerLabel.textContent = isLight ? '🌙 Switch to Dark Theme' : '☀️ Switch to Light Theme';
    } else {
      drawerLabel.textContent = isLight ? '🌙 Mudar para Tema Escuro' : '☀️ Mudar para Tema Claro';
    }
  }
};

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  window.setTheme(current === 'light' ? 'dark' : 'light');
};

// Inicialização imediata do tema (Default: Dark)
(function initTheme() {
  let saved = 'dark';
  try {
    saved = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  } catch (e) {}
  window.setTheme(saved);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Idioma e Tema após DOM pronto
  let savedLang = 'pt';
  try {
    savedLang = localStorage.getItem(LANG_STORAGE_KEY) || 'pt';
  } catch (e) {}
  window.setLanguage(savedLang);

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  window.setTheme(currentTheme);

  // Filter Projects by Category
  const filterBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'flex';
        } else {
          const categories = card.getAttribute('data-category') || '';
          if (categories.includes(filterValue)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
});

