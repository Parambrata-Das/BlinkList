# ⚡ BlinkList — 10-Min Grocery Manager & GST Tax Calculator

> A modern, high-performance Quick-Commerce styled Grocery List Manager inspired by **Blinkit** & **Zepto**, equipped with a live **Indian GST (CGST + SGST) tax engine**, interactive quantity steppers, custom item creator, and printable tax invoice generator.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- 🛒 **Interactive Item Management**: Easily add items from preset catalog or custom entries, delete items, and modify quantities with responsive `[-] qty [+]` steppers.
- 🇮🇳 **Live Indian GST Engine (CGST & SGST)**:
  - Real-time calculation of **Taxable Base Amount**, **Central GST (CGST)**, and **State GST (SGST)** based on official Indian GST tax slabs.
  - Supports **0%**, **5%**, **12%**, and **18%** GST slabs.
  - Displays GST slab summary chips breaking down exact tax contributions per slab.
- ⚡ **Blinkit & Zepto-Inspired UI**:
  - Sleek dark glassmorphic design system using CSS backdrop filters, neon yellow/green badges, and smooth micro-animations.
  - Interactive **Free Delivery Progress Bar** (unlocked when cart reaches ₹199).
- 🔍 **Live Search & Category Filtering**:
  - Filter items instantly by categories: *Dairy & Bakery*, *Veggies & Fruits*, *Atta, Rice & Dal*, *Oil & Spices*, and *Snacks & Drinks*.
  - Real-time instant search bar.
- ✨ **Custom Grocery Item Modal**:
  - Add any custom grocery item with custom price, unit/weight (e.g. `500g`, `1L`), category, and assigned GST rate slab.
- 🧾 **Printable Official Tax Invoice**:
  - Generate an official computer-generated GST tax receipt complete with GSTIN, invoice date, HSN/SAC representation, itemized CGST/SGST, and a one-click **Print Receipt** trigger (`window.print()`).
- 💾 **LocalStorage State Persistence**:
  - Cart items and custom entries automatically persist across browser refreshes.
- 🚀 **Zero Dependencies**: Pure HTML5, CSS3, and modern Vanilla JavaScript — runs instantly in any browser without needing `npm` or Node build tools!

---

## 🇮🇳 GST Tax Slabs Reference (India)

| GST Slab | Category / Items | CGST % | SGST % |
| :---: | :--- | :---: | :---: |
| **0%** | Fresh Veggies, Fruits, Unbranded Rice/Dal, Milk, Eggs | 0% | 0% |
| **5%** | Standard Staples (Atta, Paneer, Spices, Edible Oils, Salt) | 2.5% | 2.5% |
| **12%** | Processed Foods (Butter, Cheese, Instant Noodles, Juices) | 6% | 6% |
| **18%** | Chocolates, Energy Drinks, Aerated Beverages, Toiletries | 9% | 9% |

---

## 🚀 Quick Start

No installation or node setup required! Simply open the project in any browser.

### Option 1: Clone Repository
```bash
git clone https://github.com/Parambrata-Das/BlinkList.git
cd BlinkList
```
Then double-click or open `index.html` in your browser.

### Option 2: Direct Browser Launch
Open `index.html` directly in **Google Chrome**, **Microsoft Edge**, **Brave**, or **Mozilla Firefox**.

---

## 📁 Project Structure

```
grocery-list-manager/
├── index.html     # Semantic HTML layout, modals, header, and cart sidebar
├── styles.css     # Glassmorphic CSS design system, typography, & print styles
├── app.js         # Cart state, search/filter, GST calculation engine, & receipt builder
└── README.md      # Project documentation
```

---

## 🧾 Invoice Sample View

The app generates a GST compliant retail invoice containing:
- Store GSTIN: `27AAACB1234C1ZV`
- FSSAI License: `10020022001199`
- Itemized Base Rate, CGST %, CGST Amt, SGST %, SGST Amt, and Grand Total.

---

## 🛠️ Built With

- **HTML5**: Semantic tags (`<dialog>`, `<header>`, `<main>`, `<aside>`)
- **CSS3**: Custom properties (CSS variables), Flexbox, Grid, Glassmorphism backdrop-filters, `@media print`
- **JavaScript (ES6+)**: Array methods, dynamic DOM manipulation, `localStorage` API, and Math precision rounding for financial calculations

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.

Made with 💚 for quick grocery shopping & accurate tax calculation!
