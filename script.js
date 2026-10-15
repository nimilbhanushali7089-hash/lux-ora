
// LUXORA EYEWEAR - STORE LOGIC

const products = [
  {
    id: 1,
    name: "Classic Aviator",
    category: "Aviator",
    price: 1499,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    name: "Midnight Classic",
    category: "Classic",
    price: 1199,
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    name: "Urban Sport",
    category: "Sport",
    price: 1799,
    tag: "ACTIVE STYLE",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    name: "Golden Luxe",
    category: "Luxury",
    price: 2499,
    tag: "PREMIUM",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    name: "Retro Round",
    category: "Classic",
    price: 999,
    tag: "NEW ARRIVAL",
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    name: "Skyline Aviator",
    category: "Aviator",
    price: 1899,
    tag: "TRENDING",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    name: "Velocity Sport",
    category: "Sport",
    price: 1599,
    tag: "SPORT EDIT",
    image: "https://images.unsplash.com/photo-1506629905607-d9a1d7d0a7e5?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    name: "Royal Signature",
    category: "Luxury",
    price: 2999,
    tag: "EXCLUSIVE",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85"
  }
];

// Store cart quantities by product ID.
const cart = {};

const $ = (selector) => document.querySelector(selector);

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// PRODUCT GALLERY
function renderProducts(category = "all") {
  const filtered = category === "all"
    ? products
    : products.filter((product) => product.category === category);

  $("#product-grid").innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${escapeHTML(product.name)} sunglasses"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x700/f3f0e9/222222?text=LUXORA+Eyewear'">
        <span class="product-tag">${escapeHTML(product.tag)}</span>
      </div>
      <div class="product-info">
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.category)} Collection</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-btn" data-add="${product.id}">
            ADD TO BAG +
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// CAROUSEL
const slides = [
  {
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85",
    label: "LUXORA / 2026"
  },
  {
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=85",
    label: "THE CLASSIC EDIT"
  },
  {
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=85",
    label: "OWN YOUR STYLE"
  }
];

let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;

  $("#hero-image").style.backgroundImage =
    `linear-gradient(90deg, rgba(246,243,237,.12), transparent),
     url("${slides[currentSlide].image}")`;

  $("#hero-image .hero-label").textContent =
    slides[currentSlide].label;

  $("#slide-number").textContent =
    `0${currentSlide + 1} / 0${slides.length}`;
}

$("#prev-slide").addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

$("#next-slide").addEventListener("click", () => {
  showSlide(currentSlide + 1);
});

// PRODUCT FILTER
$("#category-filter").addEventListener("change", (event) => {
  renderProducts(event.target.value);
});

// ADD PRODUCTS TO CART
$("#product-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);

  cart[id] = (cart[id] || 0) + 1;

  renderCart();

  // Update button feedback.
  const originalText = button.textContent;
  button.textContent = "ADDED ✓";
  setTimeout(() => {
    if (button.isConnected) button.textContent = originalText;
  }, 800);
});

// CART RENDERING
function renderCart() {
  const cartEntries = Object.entries(cart)
    .filter(([, quantity]) => quantity > 0);

  const itemCount = cartEntries.reduce(
    (sum, [, quantity]) => sum + quantity, 0
  );

  $("#cart-count").textContent = itemCount;

  if (cartEntries.length === 0) {
    $("#cart-items").innerHTML =
      '<p class="empty-cart">Your bag is waiting for something stylish.</p>';
  } else {
    $("#cart-items").innerHTML = cartEntries.map(([id, quantity]) => {
      const product = products.find((item) => item.id === Number(id));

      return `
        <div class="cart-item">
          <img src="${product.image}"
               alt="${escapeHTML(product.name)}"
               onerror="this.onerror=null;this.src='https://placehold.co/100x120/f3f0e9/222222?text=LUXORA'">
          <div>
            <h4>${escapeHTML(product.name)}</h4>
            <p>${money(product.price)} each</p>
            <div class="quantity-controls">
              <button data-change="${id}" data-delta="-1"
                      aria-label="Decrease quantity">−</button>
              <span>${quantity}</span>
              <button data-change="${id}" data-delta="1"
                      aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-btn" data-remove="${id}">
              Remove item
            </button>
          </div>
          <span class="item-total">${money(product.price * quantity)}</span>
        </div>
      `;
    }).join("");
  }

  updateTotals();
}

// CHANGE QUANTITY OR REMOVE PRODUCT
$("#cart-items").addEventListener("click", (event) => {
  const changeButton = event.target.closest("[data-change]");
  const removeButton = event.target.closest("[data-remove]");

  if (changeButton) {
    const id = Number(changeButton.dataset.change);
    const delta = Number(changeButton.dataset.delta);

    cart[id] = Math.max(0, (cart[id] || 0) + delta);

    if (cart[id] === 0) delete cart[id];

    renderCart();
  }

  if (removeButton) {
    delete cart[Number(removeButton.dataset.remove)];
    renderCart();
  }
});

// BILL CALCULATIONS
function getBill() {
  const subtotal = Object.entries(cart).reduce(
    (sum, [id, quantity]) => {
      const product = products.find((item) => item.id === Number(id));
      return sum + product.price * quantity;
    },
    0
  );

  const shipping = subtotal === 0 || subtotal >= 2000 ? 0 : 99;

  // Product prices include 18% GST.
  const gst = subtotal * 18 / 118;

  return {
    subtotal,
    shipping,
    gst,
    total: subtotal + shipping
  };
}

function updateTotals() {
  const bill = getBill();

  $("#subtotal").textContent = money(bill.subtotal);
  $("#shipping").textContent = money(bill.shipping);
  $("#gst").textContent = money(bill.gst);
  $("#total").textContent = money(bill.total);
}

// GENERATE INVOICE
function generateInvoice(customer, orderId, paymentMethod) {
  const bill = getBill();

  const items = Object.entries(cart)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === Number(id));

      return `
        <tr>
          <td>${escapeHTML(product.name)}</td>
          <td>${quantity}</td>
          <td>${money(product.price)}</td>
          <td>${money(product.price * quantity)}</td>
        </tr>
      `;
    }).join("");

  $("#invoice-details").innerHTML = `
    <div class="invoice-details-grid">
      <div>
        <strong>Bill To</strong><br>
        ${escapeHTML(customer.name)}<br>
        ${escapeHTML(customer.phone)}<br>
        ${escapeHTML(customer.email)}<br>
        ${escapeHTML(customer.address)}
      </div>
      <div>
        <strong>Order ID:</strong> ${escapeHTML(orderId)}<br>
        <strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}<br>
        <strong>Payment:</strong> ${escapeHTML(paymentMethod)}<br>
        <strong>Store:</strong> LUXORA Eyewear
      </div>
    </div>
  `;

  $("#invoice-items").innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>${items}</tbody>
    </table>
  `;

  $("#invoice-total").innerHTML = `
    <div class="invoice-summary">
      <div class="price-row">
        <span>Subtotal (incl. GST)</span>
        <span>${money(bill.subtotal)}</span>
      </div>
      <div class="price-row">
        <span>GST component (18%)</span>
        <span>${money(bill.gst)}</span>
      </div>
      <div class="price-row">
        <span>Shipping</span>
        <span>${money(bill.shipping)}</span>
      </div>
      <div class="price-row total-row">
        <span>Grand Total</span>
        <span>${money(bill.total)}</span>
      </div>
    </div>
  `;

  $("#invoice-section").hidden = false;
}

// CHECKOUT
$("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();

  if (Object.values(cart).every((quantity) => quantity <= 0)) {
    alert("Your cart is empty. Please add a product first.");
    $("#products").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const customer = {
    name: $("#customer-name").value.trim(),
    phone: $("#customer-phone").value.trim(),
    email: $("#customer-email").value.trim(),
    address: $("#customer-address").value.trim()
  };

  const paymentMethod = $("#payment-method").value;

  // Demo order reference, not a payment transaction ID.
  const orderId = "LX" + Date.now().toString().slice(-9);

  generateInvoice(customer, orderId, paymentMethod);

  alert(
    "Demo order created successfully!\n" +
    "Order ID: " + orderId +
    "\nTotal: " + money(getBill().total) +
    "\nNo payment has been collected."
  );

  $("#invoice-section").scrollIntoView({ behavior: "smooth" });
});

// PRINT INVOICE
$("#print-invoice").addEventListener("click", () => {
  window.print();
});

// DOWNLOAD INVOICE AS AN HTML FILE
$("#download-invoice").addEventListener("click", () => {
  const invoiceHTML = $("#invoice").innerHTML;

  const documentHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>LUXORA Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #111;
          max-width: 800px;
          margin: 35px auto;
          padding: 20px;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #111;
          padding-bottom: 20px;
        }
        .invoice-header h2 { letter-spacing: 2px; }
        .invoice-header h2 span { color: #c6a66b; }
        .invoice-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 25px 0;
          font-size: 13px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { padding: 12px 6px; border-bottom: 1px solid #ddd; text-align: left; }
        th:last-child, td:last-child { text-align: right; }
        .invoice-summary { max-width: 300px; margin: 20px 0 0 auto; }
        .price-row { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total-row { font-weight: bold; font-size: 17px; }
        .thank-you { text-align: center; margin-top: 40px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="invoice">${invoiceHTML}</div>
    </body>
    </html>
  `;

  const blob = new Blob([documentHTML], {
    type: "text/html;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "LUXORA-Invoice.html";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// INITIALIZE WEBSITE
renderProducts();
renderCart();
showSlide(0);
