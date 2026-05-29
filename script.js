const wines = [
  {
    id: 1,
    name: "Mariana Red 2024",
    type: "Red Wine",
    image: "images/mariana-red.webp",
    description: "Ripe dark fruit • Silky texture • Long finish",
    price: 890
  },
  {
    id: 2,
    name: "Mariana White 2024",
    type: "White Wine",
    image: "images/mariana-white.webp",
    description: "Fresh citrus • Mineral elegance • Vibrant acidity",
    price: 750
  },
  {
    id: 3,
    name: "Mariana Rosé 2024",
    type: "Rosé Wine",
    image: "images/mariana-rose.webp",
    description: "Red berries • Crisp freshness • Delicate finish",
    price: 750
  },
  {
    id: 4,
    name: "Goivo Vinho Verde",
    type: "Vinho Verde",
    image: "images/goivo.webp",
    description: "Citrus zest • Light sparkle • Refreshingly crisp",
    price: 690
  },
  {
    id: 5,
    name: "Alicante Bouschet",
    type: "Red Wine",
    image: "images/alicante.webp",
    description: "Rich black fruit • Powerful structure • Exceptional depth",
    price: 1290
  }
];

let cart = [];

const wineSlider = document.getElementById("wineSlider");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function renderWines() {
  wineSlider.innerHTML = wines.map(wine => `
    <article class="wine-card">
      <div class="wine-image">
        <img src="${wine.image}" alt="${wine.name}" loading="lazy">
      </div>

      <div class="wine-info">
        <div class="wine-type">${wine.type}</div>
        <h3>${wine.name}</h3>
        <p>${wine.description}</p>
        <div class="price">${wine.price.toLocaleString()} THB</div>

        <button class="add-btn" onclick="addToCart(${wine.id})">
          Add to Cart
        </button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const wine = wines.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...wine, qty: 1 });
  }

  renderCart();
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
}

function changeQty(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = "No items yet.";
    cartTotal.textContent = "0";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.price.toLocaleString()} THB / bottle</small>
      </div>

      <div class="qty-control">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = total.toLocaleString();
}

function sendOrderWhatsApp() {
  if (cart.length === 0) {
    alert("Please add wine to your order first.");
    return;
  }

  const lines = cart.map(item =>
    `- ${item.name} x ${item.qty} = ${(item.price * item.qty).toLocaleString()} THB`
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message =
`Hello Solaris Wine,

I would like to order:

${lines.join("\n")}

Total: ${total.toLocaleString()} THB

Please confirm stock, delivery fee and payment details.`;

  const url = `https://wa.me/66961644422?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function scrollWines(direction) {
  const amount = 420;
  wineSlider.scrollBy({
    left: direction * amount,
    behavior: "smooth"
  });
}

renderWines();
renderCart();
