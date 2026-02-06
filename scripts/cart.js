// CART.JS - Cart Page Logic

const cartItemsContainer = document.getElementById("cart-items");
const totalAmount = document.getElementById("total-amount");
const cartBadge = document.querySelector(".cart-count");

// State
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update Badge
function updateBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) cartBadge.textContent = count;
}

// Render Cart
function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p style='text-align:center; padding: 2rem; color: var(--text-secondary);'>Your cart is empty.</p>";
    totalAmount.textContent = "";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * 80 * item.quantity;
    total += itemTotal;

    const card = document.createElement("div");
    card.classList.add("cart-item-card");

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-info">
        <h3>${item.title}</h3>
        <p>Size: ${item.size}</p>
        <p>Price: ₹${(item.price * 80).toFixed(2)}</p>
        <div class="quantity-controls">
           <button onclick="updateQty(${index}, -1)">-</button>
           <span>${item.quantity}</span>
           <button onclick="updateQty(${index}, 1)">+</button>
        </div>
        <p>Subtotal: ₹${itemTotal.toFixed(2)}</p>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(card);
  });

  totalAmount.textContent = `Grand Total: ₹${total.toFixed(2)}`;
  updateBadge();
}

// Global functions for inline onclicks
window.updateQty = function (index, change) {
  if (cart[index].quantity + change < 1) return;
  cart[index].quantity += change;
  saveAndRender();
};

window.removeItem = function (index) {
  cart.splice(index, 1);
  saveAndRender();
};

function saveAndRender() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Init
renderCart();
