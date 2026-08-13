// BlinkList Master Application Logic & GST Engine

// 1. Initial Catalog Data with Realistic Indian GST Rates
const PRESET_CATALOG = [
  // Dairy & Bakery
  { id: 'd1', name: 'Amul Taaza T-Special Milk', unit: '1 Litre', price: 33, category: 'Dairy & Bakery', emoji: '🥛', gstRate: 5 },
  { id: 'd2', name: 'Amul Fresh Paneer', unit: '200g', price: 95, category: 'Dairy & Bakery', emoji: '🧀', gstRate: 5 },
  { id: 'd3', name: 'Mother Dairy Fresh Dahi', unit: '400g', price: 35, category: 'Dairy & Bakery', emoji: '🥣', gstRate: 5 },
  { id: 'd4', name: 'English Oven Brown Bread', unit: '400g', price: 50, category: 'Dairy & Bakery', emoji: '🍞', gstRate: 0 },
  { id: 'd5', name: 'Amul Salted Butter', unit: '100g', price: 60, category: 'Dairy & Bakery', emoji: '🧈', gstRate: 12 },

  // Veggies & Fruits
  { id: 'v1', name: 'Fresh Hybrid Tomatoes', unit: '1 kg', price: 32, category: 'Vegetables & Fruits', emoji: '🍅', gstRate: 0 },
  { id: 'v2', name: 'Fresh Red Onions', unit: '1 kg', price: 28, category: 'Vegetables & Fruits', emoji: '🧅', gstRate: 0 },
  { id: 'v3', name: 'New Crop Potatoes', unit: '1 kg', price: 25, category: 'Vegetables & Fruits', emoji: '🥔', gstRate: 0 },
  { id: 'v4', name: 'Robusta Bananas', unit: '6 Pcs', price: 40, category: 'Vegetables & Fruits', emoji: '🍌', gstRate: 0 },
  { id: 'v5', name: 'Fresh Palak (Spinach)', unit: '250g', price: 20, category: 'Vegetables & Fruits', emoji: '🥬', gstRate: 0 },

  // Atta, Rice & Dal
  { id: 'a1', name: 'Aashirvaad Shudh Chakki Atta', unit: '5 kg', price: 240, category: 'Atta, Rice & Dal', emoji: '🌾', gstRate: 5 },
  { id: 'a2', name: 'Fortune Everyday Basmati Rice', unit: '1 kg', price: 110, category: 'Atta, Rice & Dal', emoji: '🍚', gstRate: 5 },
  { id: 'a3', name: 'Unpolished Toor Dal', unit: '1 kg', price: 160, category: 'Atta, Rice & Dal', emoji: '🫘', gstRate: 0 },
  { id: 'a4', name: 'Tata Iodized Salt', unit: '1 kg', price: 28, category: 'Atta, Rice & Dal', emoji: '🧂', gstRate: 5 },

  // Oil & Spices
  { id: 'o1', name: 'Fortune Kachi Ghani Mustard Oil', unit: '1 Litre', price: 145, category: 'Oil, Masala & Spices', emoji: '🧴', gstRate: 5 },
  { id: 'o2', name: 'MDH Deggi Mirch Powder', unit: '100g', price: 85, category: 'Oil, Masala & Spices', emoji: '🌶️', gstRate: 5 },
  { id: 'o3', name: 'Catch Haldi (Turmeric) Powder', unit: '100g', price: 45, category: 'Oil, Masala & Spices', emoji: '🧄', gstRate: 5 },

  // Snacks & Drinks
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

// 3. DOM Selectors
const itemsGrid = document.getElementById('itemsGrid');
const cartItemsList = document.getElementById('cartItemsList');
const emptyCartState = document.getElementById('emptyCartState');
const cartCountBadge = document.getElementById('cartCountBadge');
const searchInput = document.getElementById('searchInput');
const categoryPills = document.getElementById('categoryPills');

// Bill Summary DOMs
const subtotalVal = document.getElementById('subtotalVal');
const cgstVal = document.getElementById('cgstVal');
const sgstVal = document.getElementById('sgstVal');
const totalGstVal = document.getElementById('totalGstVal');
const handlingFeeVal = document.getElementById('handlingFeeVal');
const deliveryFeeVal = document.getElementById('deliveryFeeVal');
const grandTotalVal = document.getElementById('grandTotalVal');
const slabChipsContainer = document.getElementById('slabChipsContainer');
const deliveryProgressBar = document.getElementById('deliveryProgressBar');
const deliveryProgressText = document.getElementById('deliveryProgressText');

// Buttons & Modals
const openCustomModalBtn = document.getElementById('openCustomModalBtn');
const customItemModal = document.getElementById('customItemModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const customItemForm = document.getElementById('customItemForm');

const clearCartBtn = document.getElementById('clearCartBtn');
const viewReceiptBtn = document.getElementById('viewReceiptBtn');
const checkoutReceiptBtn = document.getElementById('checkoutReceiptBtn');
const receiptModal = document.getElementById('receiptModal');
const closeReceiptBtn = document.getElementById('closeReceiptBtn');
const printReceiptBtn = document.getElementById('printReceiptBtn');

// 4. Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  renderCart();
  setupEventListeners();
});

// 5. Render Catalog Grid
function renderCatalog() {
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
        <p>No items match your search "${searchQuery}"</p>
      </div>
    `;
    return;
  }

  itemsGrid.innerHTML = filtered.map(item => {
    const cartItem = cart.find(c => c.id === item.id);
    const qty = cartItem ? cartItem.qty : 0;

    return `
      <div class="item-card" data-id="${item.id}">
        <span class="gst-badge">${item.gstRate}% GST</span>
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
    updateBillTotals(0, 0, 0, {});
    return;
  }

  // Render Cart Item Rows
  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <span class="cart-item-emoji">${item.emoji || '📦'}</span>
        <div>
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <span class="cart-item-tax-badge">₹${item.price} • GST ${item.gstRate}%</span>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  // Indian GST Calculation Engine
  // Consumer price (P) is GST inclusive: P_total = Base_Price + GST
  // Taxable Base Value = P_total / (1 + (GstRate / 100))
  // GST Amount = P_total - Taxable Base Value
  // CGST = GST Amount / 2
  // SGST = GST Amount / 2

  let grossTotal = 0;
  let taxableSubtotal = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let slabBreakdown = {}; // { '5%': totalTax, '12%': totalTax, ... }

  cart.forEach(item => {
    const itemGross = item.price * item.qty;
    const rate = item.gstRate || 0;
    
    const taxableBase = itemGross / (1 + (rate / 100));
    const itemGstAmt = itemGross - taxableBase;
    const itemCgst = itemGstAmt / 2;
    const itemSgst = itemGstAmt / 2;

    grossTotal += itemGross;
    taxableSubtotal += taxableBase;
    totalCgst += itemCgst;
    totalSgst += itemSgst;

    if (rate > 0) {
      slabBreakdown[rate] = (slabBreakdown[rate] || 0) + itemGstAmt;
    }
  });

  updateBillTotals(grossTotal, taxableSubtotal, totalCgst, totalSgst, slabBreakdown);
}

// 8. Update Bill Totals & Delivery Fee Progress Bar
function updateBillTotals(grossTotal, taxableSubtotal, totalCgst, totalSgst, slabBreakdown) {
  const totalGst = totalCgst + totalSgst;
  const handlingFee = cart.length > 0 ? 5 : 0;
  const freeDeliveryThreshold = 199;
  const deliveryFee = grossTotal >= freeDeliveryThreshold || cart.length === 0 ? 0 : 29;
  const grandTotal = grossTotal + handlingFee + deliveryFee;

  // Update UI Elements
  subtotalVal.textContent = `₹${taxableSubtotal.toFixed(2)}`;
  cgstVal.textContent = `₹${totalCgst.toFixed(2)}`;
  sgstVal.textContent = `₹${totalSgst.toFixed(2)}`;
  totalGstVal.textContent = `₹${totalGst.toFixed(2)}`;
  handlingFeeVal.textContent = `₹${handlingFee.toFixed(2)}`;
  deliveryFeeVal.textContent = deliveryFee === 0 ? (cart.length > 0 ? 'FREE' : '₹0.00') : `₹${deliveryFee.toFixed(2)}`;
  grandTotalVal.textContent = `₹${grandTotal.toFixed(2)}`;

  // Render GST Slab Chips
  if (Object.keys(slabBreakdown).length > 0) {
    slabChipsContainer.innerHTML = Object.entries(slabBreakdown).map(([rate, amt]) => `
      <span class="slab-chip">${rate}% Slab: ₹${amt.toFixed(2)}</span>
    `).join('');
  } else {
    slabChipsContainer.innerHTML = `<span class="slab-chip">All items 0% GST (Exempt)</span>`;
  }

  // Delivery Progress Bar logic
  if (grossTotal >= freeDeliveryThreshold) {
    deliveryProgressBar.style.width = '100%';
    deliveryProgressText.textContent = '🎉 You unlocked FREE Delivery!';
  } else {
    const diff = freeDeliveryThreshold - grossTotal;
    const percentage = Math.min(100, (grossTotal / freeDeliveryThreshold) * 100);
    deliveryProgressBar.style.width = `${percentage}%`;
    deliveryProgressText.textContent = `Add ₹${diff.toFixed(2)} more for FREE Delivery!`;
  }
}

// 9. Event Listeners Setup
function setupEventListeners() {
  // Search Input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCatalog();
  });

  // Category Filter Pills
  categoryPills.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.dataset.category;
      renderCatalog();
    }
  });

  // Custom Item Modal
  openCustomModalBtn.addEventListener('click', () => customItemModal.showModal());
  closeModalBtn.addEventListener('click', () => customItemModal.close());
  cancelModalBtn.addEventListener('click', () => customItemModal.close());

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
      gstRate,
      emoji: '✨'
    };

    customItems.push(newItem);
    localStorage.setItem('blinklist_custom_items', JSON.stringify(customItems));

    // Auto add to cart
    addItemToCart(newItem.id);

    // Reset & Close
    customItemForm.reset();
    customItemModal.close();
  });

  // Clear Cart
  clearCartBtn.addEventListener('click', clearCart);

  // Receipt Modal Actions
  viewReceiptBtn.addEventListener('click', openReceiptModal);
  checkoutReceiptBtn.addEventListener('click', openReceiptModal);
  closeReceiptBtn.addEventListener('click', () => receiptModal.close());
  printReceiptBtn.addEventListener('click', () => window.print());
}

// 10. Generate Printable GST Invoice Receipt
function openReceiptModal() {
  if (cart.length === 0) return;

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
  tableBody.innerHTML = cart.map((item, index) => {
    const itemGross = item.price * item.qty;
    const rate = item.gstRate || 0;
    const taxableBase = itemGross / (1 + (rate / 100));
    const gstAmt = itemGross - taxableBase;
    const cgst = gstAmt / 2;
    const sgst = gstAmt / 2;

    invSubtotal += taxableBase;
    invCgst += cgst;
    invSgst += sgst;
    grossTotal += itemGross;

    return `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${escapeHtml(item.name)}</strong> (${escapeHtml(item.unit)})</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-right">₹${item.price.toFixed(2)}</td>
        <td class="text-center">${rate}%</td>
        <td class="text-right">₹${cgst.toFixed(2)} (${(rate/2)}%)</td>
        <td class="text-right">₹${sgst.toFixed(2)} (${(rate/2)}%)</td>
        <td class="text-right"><strong>₹${itemGross.toFixed(2)}</strong></td>
      </tr>
    `;
  }).join('');

  const handlingFee = 5;
  const deliveryFee = grossTotal >= 199 ? 0 : 29;
  const totalExtraCharges = handlingFee + deliveryFee;
  const grandTotal = grossTotal + totalExtraCharges;

  document.getElementById('invSubtotal').textContent = `₹${invSubtotal.toFixed(2)}`;
  document.getElementById('invCgst').textContent = `₹${invCgst.toFixed(2)}`;
  document.getElementById('invSgst').textContent = `₹${invSgst.toFixed(2)}`;
  document.getElementById('invCharges').textContent = `₹${totalExtraCharges.toFixed(2)} (Delivery: ₹${deliveryFee}, Handling: ₹${handlingFee})`;
  document.getElementById('invGrandTotal').textContent = `₹${grandTotal.toFixed(2)}`;

  receiptModal.showModal();
}

// Utility: Escape HTML
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, match => {
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
