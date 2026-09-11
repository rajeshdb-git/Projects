const detailShell = document.querySelector('.detail-shell');
const productId = Number(detailShell.dataset.productId);
const cartKey = 'brandNameCart';
const wishlistKey = 'brandNameWishlist';

const money = (value) => `₹${value.toLocaleString('en-IN')}`;
const readItems = (key) => JSON.parse(localStorage.getItem(key) || '[]');

function renderSimilarProducts(products, product) {
  const similar = products
    .filter((item) => item.id !== product.id)
    .map((item) => ({
      item,
      score: Number(item.category === product.category) * 4
        + Number(item.fabric === product.fabric) * 3
        + Number(item.occasion === product.occasion) * 2
        + Number(item.color === product.color),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ item }) => item);

  const section = document.querySelector('#similar-products');
  section.innerHTML = similar.map((item) => `
    <article class="detail-recommendation-card" data-detail-url="/products/${item.id}/">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <p>${item.category}</p>
      <h3>${item.name}</h3>
      <div><strong>${money(item.price)}</strong> <del>${money(item.originalPrice)}</del> <span>${item.discount}% OFF</span></div>
      <button type="button" data-similar-bag-id="${item.id}">ADD TO BAG</button>
    </article>
  `).join('');

  section.querySelectorAll('.detail-recommendation-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (!event.target.closest('button')) window.location.href = card.dataset.detailUrl;
    });
  });
  section.querySelectorAll('[data-similar-bag-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const cart = readItems(cartKey);
      cart.push(Number(button.dataset.similarBagId));
      localStorage.setItem(cartKey, JSON.stringify(cart));
      button.textContent = 'ADDED TO BAG';
    });
  });
}

fetch('/api/products/')
  .then((response) => response.json())
  .then((products) => {
    const product = products.find((item) => item.id === productId);
    if (!product) throw new Error('Product not found');
    detailShell.innerHTML = `
      <div class="detail-product">
        <div class="detail-image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="detail-info">
          <p class="detail-category">${product.category}</p>
          <h1>${product.name}</h1>
          <p class="detail-rating">★ ${product.rating} <span>(${product.reviews} reviews)</span></p>
          <div class="detail-price"><strong>${money(product.price)}</strong> <del>${money(product.originalPrice)}</del> <span>${product.discount}% OFF</span></div>
          <p class="detail-description">${product.description}</p>
          <div class="detail-facts"><div><strong>Fabric</strong><span>${product.fabric}</span></div><div><strong>Colour</strong><span>${product.color}</span></div><div><strong>Occasion</strong><span>${product.occasion}</span></div><div><strong>Availability</strong><span>${product.stock} pieces in stock</span></div></div>
          <div class="detail-actions"><button id="detail-bag" type="button">ADD TO BAG</button><button id="detail-wishlist" type="button">♡ ADD TO WISHLIST</button></div>
        </div>
      </div>
      <div class="detail-information">
        <section><h2>✓ SAREE &amp; BLOUSE INFORMATION</h2><p>The saree is approximately 5.5 metres (6 yards) long.</p><p>An unstitched blouse piece of approximately 0.90 metres is included. Any stitched blouse shown in the photographs is strictly for shoot styling and is not included.</p></section>
        <section><h2>🚚 DISPATCH &amp; FINISHING</h2><p>Dispatch generally takes 2–3 working days after roll polish, dry cleaning and final post-purchase quality checks.</p><p>Fall and pico can be completed on request. Tassels can be added on request at an additional charge.</p></section>
        <section><h2>✓ CARE &amp; EXCHANGE</h2><p><strong>Care:</strong> Dry clean only. For long-term storage, wrap the saree in a clean breathable cloth.</p><p><strong>Exchange:</strong> Available for eligible products when the request is raised within 48 hours of delivery, subject to the applicable exchange policy.</p></section>
      </div>
      <section class="detail-recommendations">
        <p class="detail-recommendations-label">You may also like</p>
        <h2>Similar sarees</h2>
        <div class="detail-recommendation-grid" id="similar-products"></div>
      </section>`;

    document.querySelector('#detail-bag').addEventListener('click', (event) => {
      const cart = readItems(cartKey);
      cart.push(product.id);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      event.target.textContent = 'ADDED TO BAG';
    });
    document.querySelector('#detail-wishlist').addEventListener('click', (event) => {
      const wishlist = readItems(wishlistKey);
      const next = wishlist.includes(product.id) ? wishlist.filter((id) => id !== product.id) : [...wishlist, product.id];
      localStorage.setItem(wishlistKey, JSON.stringify(next));
      event.target.textContent = next.includes(product.id) ? '♥ ADDED TO WISHLIST' : '♡ ADD TO WISHLIST';
    });
    renderSimilarProducts(products, product);
  })
  .catch(() => { detailShell.innerHTML = '<p class="detail-loading">Product details unavailable.</p>'; });
