const savedGrid = document.querySelector('#saved-items-grid');
const savedCount = document.querySelector('#saved-items-count');
const isWishlist = document.title.startsWith('Wishlist');
const storageKey = isWishlist ? 'brandNameWishlist' : 'brandNameCart';
const recommendationGrid = document.querySelector('#recommendation-grid');
const selectedKey = 'brandNameSelectedCart';
let selectedIds = [];

const addressModal = document.querySelector('#address-modal');

document.querySelector('[data-open-addresses]')?.addEventListener('click', () => {
  addressModal.hidden = false;
});
document.querySelectorAll('[data-close-addresses]').forEach((control) => {
  control.addEventListener('click', () => { addressModal.hidden = true; });
});
document.querySelectorAll('[data-show-address]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.closest('.address-modal-card')) {
      document.querySelector('.address-selector-view').hidden = true;
      document.querySelector('.modal-add-form').hidden = false;
    } else {
      addressModal.hidden = true;
    }
  });
});
document.querySelectorAll('[data-back-addresses]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.modal-add-form').hidden = true;
    document.querySelector('.address-selector-view').hidden = false;
  });
});

function getSavedItems() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
}

function setSavedItems(items) {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

function syncSelectedItems() {
  const cartIds = [...new Set(getSavedItems())];
  let storedIds;
  try {
    storedIds = JSON.parse(localStorage.getItem(selectedKey) || 'null');
  } catch {
    storedIds = null;
  }
  selectedIds = (Array.isArray(storedIds) ? storedIds : cartIds).filter((id) => cartIds.includes(id));
  localStorage.setItem(selectedKey, JSON.stringify(selectedIds));
}

function money(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function renderPriceSummary(products) {
  if (isWishlist) return;
  const savedIds = getSavedItems();
  const cartProducts = savedIds.filter((id) => selectedIds.includes(id)).map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const mrp = cartProducts.reduce((total, product) => total + product.originalPrice, 0);
  const sellingPrice = cartProducts.reduce((total, product) => total + product.price, 0);
  const discount = mrp - sellingPrice;
  const fee = cartProducts.length ? 23 : 0;
  document.querySelector('#summary-count').textContent = `(${cartProducts.length} Item${cartProducts.length === 1 ? '' : 's'})`;
  document.querySelector('#summary-mrp').textContent = money(mrp);
  document.querySelector('#summary-discount').textContent = `- ${money(discount)}`;
  document.querySelector('#summary-fee').textContent = money(fee);
  document.querySelector('#summary-total').textContent = money(sellingPrice + fee);
}

function syncOrderInput(products) {
  const input = document.querySelector('#cart-products-input');
  if (!input) return;
  const counts = {};
  getSavedItems().forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
  input.value = JSON.stringify(selectedIds.map((id) => ({ id, quantity: counts[id] || 1 })));
}

function renderSavedItems(products) {
  const savedIds = getSavedItems();
  syncSelectedItems();
  const entries = isWishlist
    ? savedIds.map((id) => ({ product: products.find((item) => item.id === id), quantity: 1 }))
    : [...new Set(savedIds)].map((id) => ({ product: products.find((item) => item.id === id), quantity: savedIds.filter((savedId) => savedId === id).length }));
  const validEntries = entries.filter((entry) => entry.product);

  savedCount.textContent = `${validEntries.reduce((total, entry) => total + entry.quantity, 0)} item${validEntries.reduce((total, entry) => total + entry.quantity, 0) === 1 ? '' : 's'}`;
  renderPriceSummary(products);
  savedGrid.innerHTML = validEntries.length ? validEntries.map(({ product, quantity }) => `
    <article class="saved-item">
      <img src="${product.image}" alt="${product.name}">
      <div class="saved-item-info">
        ${!isWishlist ? `<input class="cart-select" type="checkbox" data-select-id="${product.id}" ${selectedIds.includes(product.id) ? 'checked' : ''} aria-label="Select ${product.name}">` : ''}
        <p>${product.category}</p>
        <h2>${product.name}</h2>
        <span class="saved-seller">Sold by: Brand_name</span>
        <strong>${money(product.price)}</strong>
        ${isWishlist ? `<button type="button" class="wishlist-add-cart" data-wishlist-cart-id="${product.id}">ADD TO CART</button>` : `<span class="quantity-control"><button type="button" data-quantity-id="${product.id}" data-quantity-change="-1" aria-label="Decrease quantity">−</button><span>Qty: ${quantity}</span><button type="button" data-quantity-id="${product.id}" data-quantity-change="1" aria-label="Increase quantity">+</button></span>`}
        <button type="button" class="remove-saved" data-remove-id="${product.id}">REMOVE</button>
      </div>
    </article>
  `).join('') : `<div class="saved-empty"><p>Your ${isWishlist ? 'wishlist' : 'bag'} is empty.</p><a href="/">Continue shopping</a></div>`;

  document.querySelectorAll('.remove-saved').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.removeId);
      const items = getSavedItems();
      setSavedItems(isWishlist ? items.filter((itemId) => itemId !== id) : items.filter((itemId, index) => itemId !== id || index !== items.indexOf(id)));
      renderSavedItems(products);
    });
  });

  document.querySelectorAll('[data-quantity-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.quantityId);
      const change = Number(button.dataset.quantityChange);
      const items = getSavedItems();
      const itemIndex = items.indexOf(id);
      if (change > 0) items.push(id);
      if (change < 0 && itemIndex !== -1) items.splice(itemIndex, 1);
      setSavedItems(items);
      if (!items.includes(id)) {
        selectedIds = selectedIds.filter((selectedId) => selectedId !== id);
        localStorage.setItem(selectedKey, JSON.stringify(selectedIds));
      }
      renderSavedItems(products);
    });
  });

  document.querySelectorAll('[data-wishlist-cart-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('brandNameCart') || '[]');
      cart.push(Number(button.dataset.wishlistCartId));
      localStorage.setItem('brandNameCart', JSON.stringify(cart));
      button.textContent = 'ADDED TO CART';
      button.classList.add('is-added');
    });
  });

  if (!isWishlist) {
    const selectAll = document.querySelector('#select-all-items');
    const selectionCount = document.querySelector('#selection-count');
    const updateSelectionUi = () => {
      const cartIds = [...new Set(getSavedItems())];
      selectionCount.textContent = `${selectedIds.length}/${cartIds.length} ITEMS SELECTED`;
      selectAll.checked = cartIds.length > 0 && selectedIds.length === cartIds.length;
      renderPriceSummary(products);
      syncOrderInput(products);
    };

    document.querySelectorAll('.cart-select').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const id = Number(checkbox.dataset.selectId);
        selectedIds = checkbox.checked ? [...new Set([...selectedIds, id])] : selectedIds.filter((itemId) => itemId !== id);
        localStorage.setItem(selectedKey, JSON.stringify(selectedIds));
        updateSelectionUi();
      });
    });

    selectAll?.addEventListener('change', () => {
      selectedIds = selectAll.checked ? [...new Set(getSavedItems())] : [];
      localStorage.setItem(selectedKey, JSON.stringify(selectedIds));
      renderSavedItems(products);
    });

    document.querySelector('#remove-selected-items')?.addEventListener('click', () => {
      setSavedItems(getSavedItems().filter((id) => !selectedIds.includes(id)));
      selectedIds = [];
      localStorage.setItem(selectedKey, '[]');
      renderSavedItems(products);
    });

    updateSelectionUi();
    syncOrderInput(products);
  }

  if (recommendationGrid) {
    const savedIds = getSavedItems();
    const recommendations = products.filter((product) => !savedIds.includes(product.id)).slice(0, 10);
    recommendationGrid.innerHTML = recommendations.map((product) => `
      <article class="recommendation-card">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <p>${product.category}</p>
        <h2>${product.name}</h2>
        <div><strong>${money(product.price)}</strong> <del>${money(product.originalPrice)}</del> <span>(${product.discount}% OFF)</span></div>
        <button type="button" data-recommendation-id="${product.id}">ADD TO BAG</button>
      </article>
    `).join('');

    recommendationGrid.querySelectorAll('[data-recommendation-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('brandNameCart') || '[]');
        cart.push(Number(button.dataset.recommendationId));
        localStorage.setItem('brandNameCart', JSON.stringify(cart));
        button.textContent = 'ADDED TO BAG';
      });
    });
  }
}

fetch('/api/products/')
  .then((response) => response.json())
  .then(renderSavedItems)
  .catch(() => {
    savedCount.textContent = 'Products unavailable';
  });
