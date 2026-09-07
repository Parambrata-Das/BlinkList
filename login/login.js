// ============================================
// BlinkList — Login Page Script
// ============================================
// Handles theme toggling and step navigation
// (role selection -> customer form / admin form).
// The email/password forms and the Google /
// Microsoft / Apple buttons are UI only — no
// backend or OAuth is wired up yet.
// ============================================

let loginThemeToggleBtn;
let loginSteps;
let roleCards;
let stepBackButtons;
let customerLoginForm, adminLoginForm;
let socialButtons;

function initLoginApp() {
  cacheLoginDOMElements();
  initLoginTheme();
  setupLoginEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginApp);
} else {
  initLoginApp();
}

function cacheLoginDOMElements() {
  loginThemeToggleBtn = document.getElementById('loginThemeToggleBtn');
  loginSteps = document.querySelectorAll('.login-step');
  roleCards = document.querySelectorAll('.role-card');
  stepBackButtons = document.querySelectorAll('.login-step-back');
  customerLoginForm = document.getElementById('customerLoginForm');
  adminLoginForm = document.getElementById('adminLoginForm');
  socialButtons = document.querySelectorAll('.social-btn');
}

// Theme (Light / Dark) Handling — kept in sync via the same
// 'blinklist_theme' localStorage key used across all pages.
function initLoginTheme() {
  const savedTheme = localStorage.getItem('blinklist_theme') || 'dark';
  applyLoginTheme(savedTheme, false);
}

function applyLoginTheme(theme, persist) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  if (persist) {
    localStorage.setItem('blinklist_theme', theme);
  }
}

function toggleLoginTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyLoginTheme(next, true);
}

// Step Navigation
function showStep(stepId) {
  loginSteps.forEach((step) => {
    step.classList.toggle('is-active', step.id === stepId);
  });
}

function setupLoginEventListeners() {
  if (loginThemeToggleBtn) {
    loginThemeToggleBtn.addEventListener('click', toggleLoginTheme);
  }

  roleCards.forEach((card) => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-target');
      if (target) {
        showStep(target);
      }
    });
  });

  stepBackButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) {
        showStep(target);
      }
    });
  });

  // Forms are UI only for now — no backend is wired up.
  if (customerLoginForm) {
    customerLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }

  // Google / Microsoft / Apple buttons are UI only for now — no OAuth
  // is wired up. Clicking them intentionally does nothing.
  socialButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}