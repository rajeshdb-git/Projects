const productGrid = document.querySelector('#product-grid');
const productCount = document.querySelector('#product-count');
const sortProducts = document.querySelector('#sort-products');
const searchInput = document.querySelector('.shop-search input');
let products = [];
let activeFilter = 'all';
const cartKey = 'brandNameCart';
const wishlistKey = 'brandNameWishlist';

function readStoredItems(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function saveStoredItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function updateHeaderCounts() {
  const cart = readStoredItems(cartKey);
  const wishlist = readStoredItems(wishlistKey);
  document.querySelector('#bag-count').textContent = cart.length;
  document.querySelector('#wishlist-count').textContent = wishlist.length;
}

function toggleWishlist(productId) {
  const wishlist = readStoredItems(wishlistKey);
  const nextWishlist = wishlist.includes(productId)
    ? wishlist.filter((id) => id !== productId)
    : [...wishlist, productId];
  saveStoredItems(wishlistKey, nextWishlist);
  updateHeaderCounts();
  return nextWishlist.includes(productId);
}

function addToBag(productId) {
  const cart = readStoredItems(cartKey);
  saveStoredItems(cartKey, [...cart, productId]);
  updateHeaderCounts();
}

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`;

function visibleProducts() {
  const query = searchInput.value.trim().toLowerCase();
  return products.filter((product) => {
    const matchesFilter = activeFilter === 'all' || product.category === activeFilter;
    const matchesSearch = !query || `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
}

function renderProducts() {
  const sorted = [...visibleProducts()];
  if (sortProducts.value === 'price-low') sorted.sort((a, b) => a.price - b.price);
  if (sortProducts.value === 'price-high') sorted.sort((a, b) => b.price - a.price);
  if (sortProducts.value === 'rating') sorted.sort((a, b) => b.rating - a.rating);

  productCount.textContent = `${sorted.length} products`;
  productGrid.innerHTML = sorted.length ? sorted.map((product) => `
    <article class="product-card" data-detail-url="/products/${product.id}/">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="discount-badge">${product.discount}% OFF</span>
        <button class="wishlist-button ${readStoredItems(wishlistKey).includes(product.id) ? 'is-liked' : ''}" type="button" data-wishlist-id="${product.id}" aria-label="Add ${product.name} to wishlist">♡</button>
        <button class="add-bag-button" type="button" data-product-id="${product.id}">ADD TO BAG</button>
      </div>
      <div class="product-card-details">
        <p class="product-category">${product.category}</p>
        <h2>${product.name}</h2>
        <p class="product-rating">★ ${product.rating} <span>(${product.reviews})</span></p>
        <div class="product-price"><strong>${formatPrice(product.price)}</strong> <del>${formatPrice(product.originalPrice)}</del> <span>(${product.discount}% OFF)</span></div>
      </div>
    </article>
  `).join('') : '<p class="empty-products">No products match your search.</p>';

  document.querySelectorAll('.add-bag-button').forEach((button) => {
    button.addEventListener('click', () => {
      addToBag(Number(button.dataset.productId));
      button.textContent = 'ADDED TO BAG';
      button.classList.add('is-added');
    });
  });

  document.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (!event.target.closest('button')) window.location.href = card.dataset.detailUrl;
    });
  });

  document.querySelectorAll('.wishlist-button').forEach((button) => {
    button.addEventListener('click', () => {
      const isLiked = toggleWishlist(Number(button.dataset.wishlistId));
      button.classList.toggle('is-liked', isLiked);
      button.setAttribute('aria-label', isLiked ? 'Remove from wishlist' : 'Add to wishlist');
    });
  });
}

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    renderProducts();
  });
});
sortProducts.addEventListener('change', renderProducts);
searchInput.addEventListener('input', renderProducts);
updateHeaderCounts();

fetch('/api/products/')
  .then((response) => response.json())
  .then((data) => {
    products = data;
    renderProducts();
  })
  .catch(() => {
    productCount.textContent = 'Products unavailable';
    productGrid.innerHTML = '<p class="empty-products">Could not load products right now.</p>';
  });
