// BlinkList Master Application Logic & GST Engine

// 1. Initial Catalog Data with Realistic Indian GST Rates for EVERY Item
const PRESET_CATALOG = [
  // Dairy & Bakery
  { id: 'd1', name: 'Amul Taaza T-Special Milk', unit: '1 Litre', price: 33, category: 'Dairy & Bakery', emoji: '🥛', gstRate: 5 },
  { id: 'd2', name: 'Amul Fresh Paneer', unit: '200g', price: 95, category: 'Dairy & Bakery', emoji: '🧀', gstRate: 5 },
  { id: 'd3', name: 'Mother Dairy Fresh Dahi', unit: '400g', price: 35, category: 'Dairy & Bakery', emoji: '🥣', gstRate: 5 },
  { id: 'd4', name: 'English Oven Brown Bread', unit: '400g', price: 50, category: 'Dairy & Bakery', emoji: '🍞', gstRate: 5 },
  { id: 'd5', name: 'Amul Salted Butter', unit: '100g', price: 60, category: 'Dairy & Bakery', emoji: '🧈', gstRate: 12 },

  // Veggies & Fruits (0% GST Exempt Staples)
  { id: 'v1', name: 'Fresh Hybrid Tomatoes', unit: '1 kg', price: 32, category: 'Vegetables & Fruits', emoji: '🍅', gstRate: 0 },
  { id: 'v2', name: 'Fresh Red Onions', unit: '1 kg', price: 28, category: 'Vegetables & Fruits', emoji: '🧅', gstRate: 0 },
  { id: 'v3', name: 'New Crop Potatoes', unit: '1 kg', price: 25, category: 'Vegetables & Fruits', emoji: '🥔', gstRate: 0 },
  { id: 'v4', name: 'Robusta Bananas', unit: '6 Pcs', price: 40, category: 'Vegetables & Fruits', emoji: '🍌', gstRate: 0 },
  { id: 'v5', name: 'Fresh Palak (Spinach)', unit: '250g', price: 20, category: 'Vegetables & Fruits', emoji: '🥬', gstRate: 0 },

  // Atta, Rice & Dal (Branded Staples 5% GST)
  { id: 'a1', name: 'Aashirvaad Shudh Chakki Atta', unit: '5 kg', price: 240, category: 'Atta, Rice & Dal', emoji: '🌾', gstRate: 5 },
  { id: 'a2', name: 'Fortune Everyday Basmati Rice', unit: '1 kg', price: 110, category: 'Atta, Rice & Dal', emoji: '🍚', gstRate: 5 },
  { id: 'a3', name: 'Unpolished Toor Dal', unit: '1 kg', price: 160, category: 'Atta, Rice & Dal', emoji: '🫘', gstRate: 5 },
  { id: 'a4', name: 'Tata Iodized Salt', unit: '1 kg', price: 28, category: 'Atta, Rice & Dal', emoji: '🧂', gstRate: 5 },

  // Oil & Spices (5% GST)
  { id: 'o1', name: 'Fortune Kachi Ghani Mustard Oil', unit: '1 Litre', price: 145, category: 'Oil, Masala & Spices', emoji: '🧴', gstRate: 5 },
  { id: 'o2', name: 'MDH Deggi Mirch Powder', unit: '100g', price: 85, category: 'Oil, Masala & Spices', emoji: '🌶️', gstRate: 5 },
  { id: 'o3', name: 'Catch Haldi (Turmeric) Powder', unit: '100g', price: 45, category: 'Oil, Masala & Spices', emoji: '🧄', gstRate: 5 },

  // Snacks & Drinks (12% & 18% GST)
  { id: 's1', name: 'Maggi 2-Minute Masala Noodles', unit: '4 Pack (280g)', price: 56, category: 'Snacks & Drinks', emoji: '🍜', gstRate: 12 },
  { id: 's2', name: "Lay's India's Magic Masala Chips", unit: '50g', price: 20, category: 'Snacks & Drinks', emoji: '🥔', gstRate: 12 },
  { id: 's3', name: 'Cadbury Dairy Milk Silk', unit: '150g', price: 175, category: 'Snacks & Drinks', emoji: '🍫', gstRate: 18 },
  { id: 's4', name: 'Coca-Cola Original Taste', unit: '750 ml', price: 40, category: 'Snacks & Drinks', emoji: '🥤', gstRate: 18 }
];

// 2. Application State
let cart = JSON.parse(localStorage.getItem('blinklist_cart')) || [];
let customItems = JSON.parse(localStorage.getItem('blinklist_custom_items')) || [];
let activeCategory = 'all';
let searchQuery = '';

// 3. DOM Elements Cache
let itemsGrid, cartItemsList, cartCountBadge, searchInput, categoryPills;
let subtotalVal, cgstVal, sgstVal, totalGstVal, handlingFeeVal, deliveryFeeVal, grandTotalVal;
let slabChipsContainer, deliveryProgressBar, deliveryProgressText, deliveryBadge;
let openCustomModalBtn, customItemModal, closeModalBtn, cancelModalBtn, customItemForm;
let clearCartBtn, viewReceiptBtn, checkoutReceiptBtn, receiptModal, closeReceiptBtn, printReceiptBtn;

// 4. Initialization Guard
function initApp() {
  cacheDOMElements();
  renderCatalog();
  renderCart();
  setupEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function cacheDOMElements() {
  itemsGrid = document.getElementById('itemsGrid');
  cartItemsList = document.getElementById('cartItemsList');
  cartCountBadge = document.getElementById('cartCountBadge');
  searchInput = document.getElementById('searchInput');
  categoryPills = document.getElementById('categoryPills');

  subtotalVal = document.getElementById('subtotalVal');
  cgstVal = document.getElementById('cgstVal');
  sgstVal = document.getElementById('sgstVal');
  totalGstVal = document.getElementById('totalGstVal');
  handlingFeeVal = document.getElementById('handlingFeeVal');
  deliveryFeeVal = document.getElementById('deliveryFeeVal');
  grandTotalVal = document.getElementById('grandTotalVal');
  slabChipsContainer = document.getElementById('slabChipsContainer');
  deliveryProgressBar = document.getElementById('deliveryProgressBar');
  deliveryProgressText = document.getElementById('deliveryProgressText');
  deliveryBadge = document.getElementById('deliveryBadge');

  openCustomModalBtn = document.getElementById('openCustomModalBtn');
  customItemModal = document.getElementById('customItemModal');
  closeModalBtn = document.getElementById('closeModalBtn');
  cancelModalBtn = document.getElementById('cancelModalBtn');
  customItemForm = document.getElementById('customItemForm');

  clearCartBtn = document.getElementById('clearCartBtn');
  viewReceiptBtn = document.getElementById('viewReceiptBtn');
  checkoutReceiptBtn = document.getElementById('checkoutReceiptBtn');
  receiptModal = document.getElementById('receiptModal');
  closeReceiptBtn = document.getElementById('closeReceiptBtn');
  printReceiptBtn = document.getElementById('printReceiptBtn');
}

// 5. Render Catalog Grid
function renderCatalog() {
  if (!itemsGrid) return;
  const allAvailableItems = [...PRESET_CATALOG, ...customItems];
  
  const filtered = allAvailableItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    itemsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
        <p>No items match your search "${escapeHtml(searchQuery)}"</p>
      </div>
    `;
    return;
  }

  itemsGrid.innerHTML = filtered.map(item => {
    const cartItem = cart.find(c => c.id === item.id);
    const qty = cartItem ? cartItem.qty : 0;
    const gstDisplay = item.gstRate === 0 ? '0% GST (Exempt)' : `${item.gstRate}% GST`;

    return `
      <div class="item-card" data-id="${item.id}">
        <span class="gst-badge">${gstDisplay}</span>
        <div class="item-emoji">${item.emoji || '🛍️'}</div>
        <div class="item-details">
          <h3 class="item-name">${escapeHtml(item.name)}</h3>
          <span class="item-unit">${escapeHtml(item.unit)}</span>
        </div>
        <div class="item-bottom">
          <span class="item-price">₹${item.price.toFixed(2)}</span>
          ${qty > 0 ? `
            <div class="stepper-control">
              <button class="stepper-btn" onclick="updateQty('${item.id}', ${qty - 1})">-</button>
              <span class="stepper-count">${qty}</span>
              <button class="stepper-btn" onclick="updateQty('${item.id}', ${qty + 1})">+</button>
            </div>
          ` : `
            <button class="btn-add-item" onclick="addItemToCart('${item.id}')">ADD</button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

// 6. Cart Management Functions
function addItemToCart(itemId) {
  const allAvailableItems = [...PRESET_CATALOG, ...customItems];
  const target = allAvailableItems.find(i => i.id === itemId);
  if (!target) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...target, qty: 1 });
  }

  saveCart();
  renderCatalog();
  renderCart();
}

function updateQty(itemId, newQty) {
  if (newQty <= 0) {
    cart = cart.filter(c => c.id !== itemId);
  } else {
    const item = cart.find(c => c.id === itemId);
    if (item) item.qty = newQty;
  }

  saveCart();
  renderCatalog();
  renderCart();
}

function removeItem(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  saveCart();
  renderCatalog();
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm('Are you sure you want to clear your grocery list?')) {
    cart = [];
    saveCart();
    renderCatalog();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem('blinklist_cart', JSON.stringify(cart));
}

// 7. Render Active Grocery Cart & Live Tax Calculation
function renderCart() {
  if (!cartCountBadge || !cartItemsList) return;

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountBadge.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

  // Toggle View & Checkout buttons state
  viewReceiptBtn.disabled = cart.length === 0;
  checkoutReceiptBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-icon">🛒</div>
        <h3>Your list is empty</h3>
        <p>Add items from the catalog or create custom items with GST rates!</p>
      </div>
    `;
    updateBillTotals(0, 0, 0, 0, {});
    return;
  }

  // Render Cart Item Rows with explicit GST tax rate indicator
  cartItemsList.innerHTML = cart.map(item => {
    const gstText = item.gstRate === 0 ? 'Exempt (0%)' : `GST ${item.gstRate}%`;
    return `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <span class="cart-item-emoji">${item.emoji || '📦'}</span>
          <div class="cart-item-text-wrapper">
            <span class="cart-item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
            <span class="cart-item-tax-badge">₹${item.price} • ${gstText}</span>
          </div>
        </div>
        <div class="cart-item-actions">
          <div class="stepper-control">
            <button class="stepper-btn" onclick="updateQty('${item.id}', ${item.qty - 1})">-</button>
            <span class="stepper-count">${item.qty}</span>
            <button class="stepper-btn" onclick="updateQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
          <span class="cart-item-total">₹${(item.price * item.qty).toFixed(2)}</span>
          <button class="btn-remove-item" onclick="removeItem('${item.id}')" title="Delete item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Indian GST Calculation Engine
  let grossTotal = 0;
  let taxableSubtotal = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let slabBreakdown = {};

  cart.forEach(item => {
    const itemGross = item.price * item.qty;
    const rate = item.gstRate !== undefined ? item.gstRate : 5;
    
    const taxableBase = itemGross / (1 + (rate / 100));
    const itemGstAmt = itemGross - taxableBase;
    const itemCgst = itemGstAmt / 2;
    const itemSgst = itemGstAmt / 2;

    grossTotal += itemGross;
    taxableSubtotal += taxableBase;
    totalCgst += itemCgst;
    totalSgst += itemSgst;

    slabBreakdown[rate] = (slabBreakdown[rate] || 0) + itemGstAmt;
  });

  updateBillTotals(grossTotal, taxableSubtotal, totalCgst, totalSgst, slabBreakdown);
}

// 8. Update Bill Totals & Reset Delivery Fee Progress Bar cleanly
function updateBillTotals(grossTotal, taxableSubtotal, totalCgst, totalSgst, slabBreakdown) {
  const totalGst = totalCgst + totalSgst;
  const handlingFee = cart.length > 0 ? 5 : 0;
  const freeDeliveryThreshold = 199;
  const deliveryFee = grossTotal >= freeDeliveryThreshold || cart.length === 0 ? 0 : 29;
  const grandTotal = grossTotal + handlingFee + deliveryFee;

  // Update UI Elements
  if (subtotalVal) subtotalVal.textContent = `₹${taxableSubtotal.toFixed(2)}`;
  if (cgstVal) cgstVal.textContent = `₹${totalCgst.toFixed(2)}`;
  if (sgstVal) sgstVal.textContent = `₹${totalSgst.toFixed(2)}`;
  if (totalGstVal) totalGstVal.textContent = `₹${totalGst.toFixed(2)}`;
  if (handlingFeeVal) handlingFeeVal.textContent = `₹${handlingFee.toFixed(2)}`;
  if (deliveryFeeVal) deliveryFeeVal.textContent = deliveryFee === 0 ? (cart.length > 0 ? 'FREE' : '₹0.00') : `₹${deliveryFee.toFixed(2)}`;
  if (grandTotalVal) grandTotalVal.textContent = `₹${grandTotal.toFixed(2)}`;

  // Render GST Slab Chips
  if (slabChipsContainer) {
    if (Object.keys(slabBreakdown).length > 0) {
      slabChipsContainer.innerHTML = Object.entries(slabBreakdown).map(([rate, amt]) => {
        const rateLabel = rate === '0' ? '0% (Exempt)' : `${rate}% Slab`;
        return `<span class="slab-chip">${rateLabel}: ₹${amt.toFixed(2)}</span>`;
      }).join('');
    } else {
      slabChipsContainer.innerHTML = `<span class="slab-chip">All items 0% GST (Exempt)</span>`;
    }
  }

  // Delivery Progress Bar Logic
  if (deliveryProgressBar && deliveryProgressText && deliveryBadge) {
    if (cart.length === 0 || grossTotal === 0) {
      deliveryProgressBar.style.width = '0%';
      deliveryProgressText.textContent = 'Add items to get FREE Delivery!';
      deliveryBadge.textContent = 'Target: ₹199';
    } else if (grossTotal >= freeDeliveryThreshold) {
      deliveryProgressBar.style.width = '100%';
      deliveryProgressText.textContent = '🎉 You unlocked FREE Delivery!';
      deliveryBadge.textContent = 'UNLOCKED';
    } else {
      const diff = freeDeliveryThreshold - grossTotal;
      const percentage = Math.min(100, (grossTotal / freeDeliveryThreshold) * 100);
      deliveryProgressBar.style.width = `${percentage}%`;
      deliveryProgressText.textContent = `Add ₹${diff.toFixed(2)} more for FREE Delivery!`;
      deliveryBadge.textContent = `Target: ₹199`;
    }
  }
}

// 9. Event Listeners Setup
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  if (categoryPills) {
    categoryPills.addEventListener('click', (e) => {
      if (e.target.classList.contains('pill')) {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        activeCategory = e.target.dataset.category;
        renderCatalog();
      }
    });
  }

  // Top Action Buttons
  if (openCustomModalBtn && customItemModal) {
    openCustomModalBtn.onclick = () => {
      if (typeof customItemModal.showModal === 'function') {
        customItemModal.showModal();
      } else {
        customItemModal.setAttribute('open', '');
      }
    };
  }

  if (closeModalBtn && customItemModal) {
    closeModalBtn.onclick = () => closeModal();
  }

  if (cancelModalBtn && customItemModal) {
    cancelModalBtn.onclick = () => closeModal();
  }

  function closeModal() {
    if (typeof customItemModal.close === 'function') {
      customItemModal.close();
    } else {
      customItemModal.removeAttribute('open');
    }
  }

  if (customItemForm) {
    customItemForm.onsubmit = (e) => {
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
      localStorage.setItem('blinklist_custom_items', JSON.stringify(customItems));

      addItemToCart(newItem.id);
      customItemForm.reset();
      closeModal();
    };
  }

  if (clearCartBtn) {
    clearCartBtn.onclick = () => clearCart();
  }

  // Receipt Modal Actions
  if (viewReceiptBtn) viewReceiptBtn.onclick = openReceiptModal;
  if (checkoutReceiptBtn) checkoutReceiptBtn.onclick = openReceiptModal;
  if (closeReceiptBtn && receiptModal) {
    closeReceiptBtn.onclick = () => {
      if (typeof receiptModal.close === 'function') receiptModal.close();
      else receiptModal.removeAttribute('open');
    };
  }
  if (printReceiptBtn) printReceiptBtn.onclick = () => window.print();
}

// 10. Generate Printable GST Invoice Receipt
function openReceiptModal() {
  if (cart.length === 0 || !receiptModal) return;

  const now = new Date();
  document.getElementById('invDate').textContent = now.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  document.getElementById('invNum').textContent = `BL-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let invSubtotal = 0;
  let invCgst = 0;
  let invSgst = 0;
  let grossTotal = 0;

  const tableBody = document.getElementById('invoiceTableBody');
  if (tableBody) {
    tableBody.innerHTML = cart.map((item, index) => {
      const itemGross = item.price * item.qty;
      const rate = item.gstRate !== undefined ? item.gstRate : 5;
      const taxableBase = itemGross / (1 + (rate / 100));
      const gstAmt = itemGross - taxableBase;
      const cgst = gstAmt / 2;
      const sgst = gstAmt / 2;

      invSubtotal += taxableBase;
      invCgst += cgst;
      invSgst += sgst;
      grossTotal += itemGross;

      const rateDisplay = rate === 0 ? '0% (Exempt)' : `${rate}%`;

      return `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${escapeHtml(item.name)}</strong> (${escapeHtml(item.unit)})</td>
          <td class="text-center">${item.qty}</td>
          <td class="text-right">₹${item.price.toFixed(2)}</td>
          <td class="text-center">${rateDisplay}</td>
          <td class="text-right">₹${cgst.toFixed(2)} (${(rate/2)}%)</td>
          <td class="text-right">₹${sgst.toFixed(2)} (${(rate/2)}%)</td>
          <td class="text-right"><strong>₹${itemGross.toFixed(2)}</strong></td>
        </tr>
      `;
    }).join('');
  }

  const handlingFee = 5;
  const deliveryFee = grossTotal >= 199 ? 0 : 29;
  const totalExtraCharges = handlingFee + deliveryFee;
  const grandTotal = grossTotal + totalExtraCharges;

  if (document.getElementById('invSubtotal')) document.getElementById('invSubtotal').textContent = `₹${invSubtotal.toFixed(2)}`;
  if (document.getElementById('invCgst')) document.getElementById('invCgst').textContent = `₹${invCgst.toFixed(2)}`;
  if (document.getElementById('invSgst')) document.getElementById('invSgst').textContent = `₹${invSgst.toFixed(2)}`;
  if (document.getElementById('invCharges')) document.getElementById('invCharges').textContent = `₹${totalExtraCharges.toFixed(2)} (Delivery: ₹${deliveryFee}, Handling: ₹${handlingFee})`;
  if (document.getElementById('invGrandTotal')) document.getElementById('invGrandTotal').textContent = `₹${invGrandTotal.toFixed(2)}`;

  if (typeof receiptModal.showModal === 'function') {
    receiptModal.showModal();
  } else {
    receiptModal.setAttribute('open', '');
  }
}

// Utility: Escape HTML
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, match => {
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
