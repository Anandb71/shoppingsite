// PRODUCT.JS - Product Detail Logic

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.product-detail-container');
  const cartBadge = document.querySelector(".cart-count");

  // UNIVERSAL ID RETRIEVAL STRATEGY
  // 1. Try Hash (#123)
  // 2. Try Query Param (?id=123)
  // 3. Try LocalStorage (fallback for stripped URLs)

  let id = null;

  // Check 1: Hash
  if (window.location.hash) {
    id = window.location.hash.substring(1);
    console.log("Found ID in Hash:", id);
  }

  // Check 2: Query Param
  if (!id) {
    const params = new URLSearchParams(window.location.search);
    id = params.get('id');
    if (id) console.log("Found ID in URL:", id);
  }

  // Check 3: LocalStorage
  if (!id) {
    id = localStorage.getItem("current_product_id");
    if (id) console.log("Found ID in LocalStorage:", id);
  }

  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) cartBadge.textContent = count;
  }
  updateCartBadge();

  if (!id) {
    container.innerHTML = `
      <div class="error-msg">
        <p>No product selected.</p>
        <p><small>Debug Info: No ID found in Hash, URL, or Storage.</small></p>
        <a href="index.html">Return to Shop</a>
      </div>`;
    return;
  }

  // Save to storage as backup (in case we came via URL)
  localStorage.setItem("current_product_id", id);

  container.innerHTML = `<p style='text-align:center'>Loading Product...</p>`;

  fetch('https://fakestoreapi.com/products/' + id)
    .then(res => {
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    })
    .then(product => {
      renderProduct(product);
    })
    .catch(err => {
      container.innerHTML = `<p class="error-msg">Failed to load details. <a href="index.html">Go back</a></p>`;
    });

  function renderProduct(product) {
    container.innerHTML = `
      <div class="zoom-container">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-info">
        <h1>${product.title}</h1>
        <p class="price">₹${(product.price * 80).toFixed(2)}</p>
        <p class="description">${product.description}</p>
        
        <label>Size:</label>
        <select id="size">
          <option value="S">S</option>
          <option value="M" selected>M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        
        <div class="quantity-selector">
          <button id="minus">-</button>
          <span id="qty">1</span>
          <button id="plus">+</button>
        </div>
        
        <p class="total-price" id="total">Total: ₹${(product.price * 80).toFixed(2)}</p>
        
        <button id="add-btn">Add to Cart</button>
      </div>
    `;

    // Quantity Logic
    let qty = 1;
    const qtyDisplay = document.getElementById('qty');
    const totalDisplay = document.getElementById('total');
    const unitPrice = product.price * 80;

    document.getElementById('plus').onclick = function () {
      qty++;
      qtyDisplay.textContent = qty;
      totalDisplay.textContent = 'Total: ₹' + (unitPrice * qty).toFixed(2);
    };

    document.getElementById('minus').onclick = function () {
      if (qty > 1) {
        qty--;
        qtyDisplay.textContent = qty;
        totalDisplay.textContent = 'Total: ₹' + (unitPrice * qty).toFixed(2);
      }
    };

    // Add to Cart Logic
    document.getElementById('add-btn').onclick = function () {
      const size = document.getElementById('size').value;
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existing = cart.find(item => item.id === product.id && item.size === size);

      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          size: size,
          quantity: qty
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      alert('Added to cart!');
    };
  }
});
