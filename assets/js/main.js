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
  if (drawerLabel) drawerLabel.textContent = isLight ? '🌙 Mudar para Tema Escuro' : '☀️ Mudar para Tema Claro';
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
  // Atualiza ícones após DOM pronto
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  window.setTheme(current);

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
