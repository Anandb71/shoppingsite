// CHECKOUT.JS - Checkout Page Logic

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderSummary = document.getElementById("order-summary");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");

function renderSummary() {
  let total = 0;

  if (cart.length === 0) {
    orderSummary.innerHTML = "<p>Your cart is empty.</p>";
    checkoutTotal.textContent = "";
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * 80 * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.style.marginBottom = "1rem";
    div.style.borderBottom = "1px solid var(--border)";
    div.style.paddingBottom = "0.5rem";

    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="color:var(--text-primary); margin-bottom:0.2rem;">${item.title}</h4>
          <small style="color:var(--text-secondary);">Size: ${item.size} | Qty: ${item.quantity}</small>
        </div>
        <span style="font-weight:600; color:var(--accent);">₹${itemTotal.toFixed(2)}</span>
      </div>
    `;
    orderSummary.appendChild(div);
  });

  checkoutTotal.textContent = `Total Payable: ₹${total.toFixed(2)}`;
}

// Handle Form Submit
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Order placed successfully! (This is a demo)");
  localStorage.removeItem("cart"); // Clear cart
  window.location.href = "index.html";
});

renderSummary();
