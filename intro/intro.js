// ============================================
// BlinkList — Intro / Landing Page Script
// ============================================
// Handles the light/dark theme toggle and the
// "Login" button, which now takes the user to
// login.html. "Get Started" is still a placeholder
// — it's not wired up yet, its destination page
// is coming later.
// ============================================

const LOGIN_PAGE_URL = 'login.html';

let introThemeToggleBtn;
let introLoginBtn;

function initIntroApp() {
  cacheIntroDOMElements();
  initIntroTheme();
  setupIntroEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIntroApp);
} else {
  initIntroApp();
}

function cacheIntroDOMElements() {
  introThemeToggleBtn = document.getElementById('introThemeToggleBtn');
  introLoginBtn = document.getElementById('introLoginBtn');
}

// Theme (Light / Dark) Handling — kept in sync with the main app via
// the same 'blinklist_theme' localStorage key.
function initIntroTheme() {
  const savedTheme = localStorage.getItem('blinklist_theme') || 'dark';
  applyIntroTheme(savedTheme, false);
}

function applyIntroTheme(theme, persist) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  if (persist) {
    localStorage.setItem('blinklist_theme', theme);
  }
}

function toggleIntroTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyIntroTheme(next, true);
}

function setupIntroEventListeners() {
  if (introThemeToggleBtn) {
    introThemeToggleBtn.addEventListener('click', toggleIntroTheme);
  }

  if (introLoginBtn) {
    introLoginBtn.addEventListener('click', goToLogin);
  }

  // introGetStartedBtn is intentionally left without a listener —
  // its destination page hasn't been built yet.
}