// ============================================
// BlinkList — Register Page Script
// ============================================
// Handles theme toggling and the step-by-step
// registration wizard: Account -> Personal ->
// Contact -> Done. Fully UI only — no backend
// is wired up, forms just advance to the next
// step on submit.
// ============================================

const REGISTER_STEP_ORDER = ['accountStep', 'personalInfoStep', 'contactInfoStep', 'doneStep'];

let registerThemeToggleBtn;
let registerSteps;
let progressSteps;
let progressLines;
let accountForm, personalInfoForm, contactInfoForm;
let backStepButtons;
let socialButtons;

function initRegisterApp() {
  cacheRegisterDOMElements();
  initRegisterTheme();
  setupRegisterEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRegisterApp);
} else {
  initRegisterApp();
}

function cacheRegisterDOMElements() {
  registerThemeToggleBtn = document.getElementById('registerThemeToggleBtn');
  registerSteps = document.querySelectorAll('.register-step');
  progressSteps = document.querySelectorAll('.progress-step');
  progressLines = document.querySelectorAll('.progress-line');
  accountForm = document.getElementById('accountForm');
  personalInfoForm = document.getElementById('personalInfoForm');
  contactInfoForm = document.getElementById('contactInfoForm');
  backStepButtons = document.querySelectorAll('.register-back-step-btn');
  socialButtons = document.querySelectorAll('.social-btn');
}

// Theme (Light / Dark) Handling — kept in sync via the same
// 'blinklist_theme' localStorage key used across all pages.
function initRegisterTheme() {
  const savedTheme = localStorage.getItem('blinklist_theme') || 'dark';
  applyRegisterTheme(savedTheme, false);
}

function applyRegisterTheme(theme, persist) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  if (persist) {
    localStorage.setItem('blinklist_theme', theme);
  }
}

function toggleRegisterTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyRegisterTheme(next, true);
}

// Step Navigation
function showRegisterStep(stepId) {
  registerSteps.forEach((step) => {
    step.classList.toggle('is-active', step.id === stepId);
  });
  updateProgress(stepId);
}

function updateProgress(stepId) {
  const targetIndex = REGISTER_STEP_ORDER.indexOf(stepId);

  progressSteps.forEach((stepEl) => {
    const stepNum = parseInt(stepEl.getAttribute('data-step'), 10);
    const stepIndex = stepNum - 1;
    stepEl.classList.remove('is-active', 'is-complete');
    if (stepIndex === targetIndex) {
      stepEl.classList.add('is-active');
    } else if (stepIndex < targetIndex) {
      stepEl.classList.add('is-complete');
    }
  });

  progressLines.forEach((lineEl, i) => {
    lineEl.classList.toggle('is-complete', i < targetIndex);
  });
}

function goToNextStep(currentStepId) {
  const currentIndex = REGISTER_STEP_ORDER.indexOf(currentStepId);
  const nextStepId = REGISTER_STEP_ORDER[currentIndex + 1];
  if (nextStepId) {
    showRegisterStep(nextStepId);
  }
}

function setupRegisterEventListeners() {
  if (registerThemeToggleBtn) {
    registerThemeToggleBtn.addEventListener('click', toggleRegisterTheme);
  }

  // Forms are UI only — submitting just advances the wizard, no data
  // is sent anywhere or persisted.
  if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('regPassword');
      const confirmPassword = document.getElementById('regConfirmPassword');
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('Passwords do not match');
        confirmPassword.reportValidity();
        return;
      }
      if (confirmPassword) {
        confirmPassword.setCustomValidity('');
      }
      goToNextStep('accountStep');
    });
  }

  if (personalInfoForm) {
    personalInfoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      goToNextStep('personalInfoStep');
    });
  }

  if (contactInfoForm) {
    contactInfoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      goToNextStep('contactInfoStep');
    });
  }

  backStepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) {
        showRegisterStep(target);
      }
    });
  });

  // Google / Microsoft / Apple buttons are UI only for now — no OAuth
  // is wired up. Clicking them intentionally does nothing.
  socialButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}