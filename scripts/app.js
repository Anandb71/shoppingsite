// APP.JS - Home Page Logic

const productGrid = document.getElementById("product-grid");
const cartBadge = document.querySelector(".cart-count");

// Load products from API
async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    productGrid.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      // Use standard link behavior tailored for robustness
      // Href sets URL, onclick sets backup storage
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" loading="lazy" />
        <h3>${product.title}</h3>
        <p>₹${(product.price * 80).toFixed(2)}</p>
        <a href="product.html?id=${product.id}" class="view-btn" onclick="goToProduct(event, ${product.id})">View Details</a>
      `;
      productGrid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    productGrid.innerHTML = "<p>Failed to load products. API might be down.</p>";
  }
}

// Global navigation function (Backup)
window.goToProduct = function (event, id) {
  // We allow the default link to proceed, but we ALSO save to storage
  // This acts as a redundancy
  console.log("Saving product ID backup:", id);
  localStorage.setItem("current_product_id", id);
};

// Update cart badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) cartBadge.textContent = count;
}

// Init
loadProducts();
updateCartCount();

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
