const filterButtons = document.querySelectorAll('.filters button');
  const productCards = document.querySelectorAll('.product-card');

  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');
  const cartAside = document.getElementById('cart');

  let currentCategory = 'all';
  let cart = {};

  // Filter products by category
  function filterProducts(category) {
    currentCategory = category;
    productCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProducts(btn.dataset.category);
    });
  });

  function updateCartCount() {
    const totalItems = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
    cartCountEl.textContent = totalItems;
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML = '<li style="text-align:center; color:#666;">Your cart is empty.</li>';
      cartTotalEl.textContent = 'Total: $0.00';
      updateCartCount();
      return;
    }

    let total = 0;
    for (const key in cart) {
      const item = cart[key];
      total += item.price * item.qty;
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty" aria-label="Quantity">${item.qty}</span>
        <button class="cart-item-remove" aria-label="Remove ${item.name} from cart" data-id="${item.id}">&times;</button>
      `;
      cartItemsContainer.appendChild(li);
    }
    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
    updateCartCount();
  }

  // Add to cart event
  document.getElementById('products').addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const card = e.target.closest('.product-card');
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      if (cart[id]) {
        cart[id].qty++;
      } else {
        cart[id] = {
          id,
          name,
          price,
          qty: 1,
        };
      }
      renderCart();
    }
  });

  // Remove from cart event
  cartItemsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('cart-item-remove')) {
      const id = e.target.getAttribute('data-id');
      delete cart[id];
      renderCart();
    }
  });

  // Toggle cart visibility
  document.getElementById('cart-toggle').addEventListener('click', () => {
    if (cartAside.hasAttribute('hidden')) {
      cartAside.removeAttribute('hidden');
      cartAside.setAttribute('aria-hidden', 'false');
      document.getElementById('cart-toggle').setAttribute('aria-expanded', 'true');
    } else {
      cartAside.setAttribute('hidden', '');
      cartAside.setAttribute('aria-hidden', 'true');
      document.getElementById('cart-toggle').setAttribute('aria-expanded', 'false');
    }
  });

  // Initial
  filterProducts('all');
  renderCart();+
  