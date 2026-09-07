// ============================================
// BlinkList — Admin Panel Script
// ============================================
// Handles: theme toggle, the hamburger dropdown
// menu (Analytics / Status / Stock / Update /
// Partners — these are placeholders, not wired
// to any page yet), and the Add Custom Item
// modal, which IS functional — it writes to the
// same 'blinklist_custom_items' localStorage key
// the customer app (app.js) reads from, so items
// added here show up for customers right away.
// ============================================

let customItems = JSON.parse(localStorage.getItem('blinklist_custom_items')) || [];

let adminThemeToggleBtn;
let adminMenuBtn, adminMenuDropdown, adminMenuItems;
let openCustomModalBtn, customItemModal, closeModalBtn, cancelModalBtn, customItemForm;
let adminCustomItemsList, adminEmptyState, adminItemCountBadge;

function initAdminApp() {
  cacheAdminDOMElements();
  initAdminTheme();
  renderCustomItemsList();
  setupAdminEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminApp);
} else {
  initAdminApp();
}

function cacheAdminDOMElements() {
  adminThemeToggleBtn = document.getElementById('adminThemeToggleBtn');

  adminMenuBtn = document.getElementById('adminMenuBtn');
  adminMenuDropdown = document.getElementById('adminMenuDropdown');
  adminMenuItems = document.querySelectorAll('.admin-menu-item');

  openCustomModalBtn = document.getElementById('openCustomModalBtn');
  customItemModal = document.getElementById('customItemModal');
  closeModalBtn = document.getElementById('closeModalBtn');
  cancelModalBtn = document.getElementById('cancelModalBtn');
  customItemForm = document.getElementById('customItemForm');

  adminCustomItemsList = document.getElementById('adminCustomItemsList');
  adminEmptyState = document.getElementById('adminEmptyState');
  adminItemCountBadge = document.getElementById('adminItemCountBadge');
}

// Theme (Light / Dark) Handling — kept in sync via the same
// 'blinklist_theme' localStorage key used across all pages.
function initAdminTheme() {
  const savedTheme = localStorage.getItem('blinklist_theme') || 'dark';
  applyAdminTheme(savedTheme, false);
}

function applyAdminTheme(theme, persist) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  if (persist) {
    localStorage.setItem('blinklist_theme', theme);
  }
}

function toggleAdminTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyAdminTheme(next, true);
}

// Hamburger Dropdown Menu
function openAdminMenu() {
  if (!adminMenuDropdown || !adminMenuBtn) return;
  adminMenuDropdown.classList.add('is-open');
  adminMenuBtn.classList.add('is-open');
  adminMenuBtn.setAttribute('aria-expanded', 'true');
}

function closeAdminMenu() {
  if (!adminMenuDropdown || !adminMenuBtn) return;
  adminMenuDropdown.classList.remove('is-open');
  adminMenuBtn.classList.remove('is-open');
  adminMenuBtn.setAttribute('aria-expanded', 'false');
}

function toggleAdminMenu() {
  if (adminMenuDropdown && adminMenuDropdown.classList.contains('is-open')) {
    closeAdminMenu();
  } else {
    openAdminMenu();
  }
}

// Add Custom Item — functional, shared with the customer app via
// localStorage. No further backend is wired up.
function openCustomModal() {
  if (!customItemModal) return;
  if (typeof customItemModal.showModal === 'function') {
    customItemModal.showModal();
  } else {
    customItemModal.setAttribute('open', '');
  }
}

function closeCustomModal() {
  if (!customItemModal) return;
  if (typeof customItemModal.close === 'function') {
    customItemModal.close();
  } else {
    customItemModal.removeAttribute('open');
  }
}

function saveCustomItems() {
  localStorage.setItem('blinklist_custom_items', JSON.stringify(customItems));
}

function renderCustomItemsList() {
  if (!adminCustomItemsList) return;

  if (adminItemCountBadge) {
    adminItemCountBadge.textContent = `${customItems.length} item${customItems.length === 1 ? '' : 's'}`;
  }

  if (customItems.length === 0) {
    adminCustomItemsList.innerHTML = `
      <div class="admin-empty-state" id="adminEmptyState">
        <div class="admin-empty-icon">📦</div>
        <p>No custom items yet. Click "Add Custom Item" above to get started.</p>
      </div>
    `;
    return;
  }

  adminCustomItemsList.innerHTML = customItems.map((item) => `
    <div class="admin-item-row" data-item-id="${escapeHtml(item.id)}">
      <div class="admin-item-emoji">${escapeHtml(item.emoji || '✨')}</div>
      <div class="admin-item-info">
        <div class="admin-item-name">${escapeHtml(item.name)}</div>
        <div class="admin-item-meta">${escapeHtml(item.unit)} • ${escapeHtml(item.category)} • ${item.gstRate}% GST</div>
      </div>
      <div class="admin-item-price">₹${Number(item.price).toFixed(2)}</div>
      <button class="admin-item-remove-btn" type="button" data-remove-id="${escapeHtml(item.id)}" title="Remove item" aria-label="Remove item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `).join('');
}

function removeCustomItem(itemId) {
  customItems = customItems.filter((item) => item.id !== itemId);
  saveCustomItems();
  renderCustomItemsList();
}

function setupAdminEventListeners() {
  if (adminThemeToggleBtn) {
    adminThemeToggleBtn.addEventListener('click', toggleAdminTheme);
  }

  if (adminMenuBtn) {
    adminMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAdminMenu();
    });
  }

  // Menu items are placeholders for now — not connected to any page.
  adminMenuItems.forEach((item) => {
    item.addEventListener('click', () => {
      closeAdminMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (
      adminMenuDropdown &&
      adminMenuDropdown.classList.contains('is-open') &&
      !adminMenuDropdown.contains(e.target) &&
      e.target !== adminMenuBtn
    ) {
      closeAdminMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAdminMenu();
    }
  });

  if (openCustomModalBtn) {
    openCustomModalBtn.addEventListener('click', openCustomModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCustomModal);
  }
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', closeCustomModal);
  }

  if (customItemForm) {
    customItemForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('itemName').value.trim();
      const price = parseFloat(document.getElementById('itemPrice').value);
      const unit = document.getElementById('itemUnit').value.trim();
      const category = document.getElementById('itemCategory').value;
      const gstRate = parseFloat(document.getElementById('itemGst').value);

      if (!name || isNaN(price) || price <= 0 || !unit) return;

      const newItem = {
        id: 'custom_' + Date.now(),
        name,
        price,
        unit,
        category,
        gstRate: isNaN(gstRate) ? 5 : gstRate,
        emoji: '✨'
      };

      customItems.push(newItem);
      saveCustomItems();
      renderCustomItemsList();

      customItemForm.reset();
      closeCustomModal();
    });
  }

  if (adminCustomItemsList) {
    adminCustomItemsList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.admin-item-remove-btn');
      if (removeBtn) {
        const itemId = removeBtn.getAttribute('data-remove-id');
        if (itemId) removeCustomItem(itemId);
      }
    });
  }
}

// Utility: Escape HTML
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (match) => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match];
  });
}