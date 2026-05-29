:root {
  --bg: #030303;
  --card: #070707;
  --card-soft: #0d0d0d;
  --white: #f7f3ea;
  --muted: #aaa39a;
  --gold: #c8a86a;
  --red: #650900;
  --green: #66d65f;
  --line: rgba(200,168,106,.22);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--white);
  font-family: Arial, Helvetica, sans-serif;
  overflow-x: hidden;
}

a {
  text-decoration: none;
  color: inherit;
}

.hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 18px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(0,0,0,.62), rgba(0,0,0,.88)),
    url("images/hero-wine.webp") center/cover no-repeat;
  filter: brightness(.82);
}

.hero-card {
  position: relative;
  width: min(620px, 92vw);
  padding: 56px 42px;
  border-radius: 34px;
  background: rgba(8,8,8,.78);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 30px 90px rgba(0,0,0,.65);
  text-align: center;
  backdrop-filter: blur(8px);
}

.eyebrow {
  margin: 0 0 18px;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: .34em;
  font-weight: 800;
  font-size: 15px;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  font-size: clamp(58px, 12vw, 112px);
  line-height: .92;
  letter-spacing: -0.06em;
  margin-bottom: 28px;
}

h2 {
  font-size: clamp(42px, 8vw, 82px);
  line-height: .98;
  letter-spacing: -0.055em;
  margin-bottom: 26px;
}

.hero-text,
.intro p,
.contact p {
  color: var(--muted);
  font-size: clamp(21px, 4.8vw, 32px);
  line-height: 1.65;
}

.hero-actions {
  display: grid;
  gap: 16px;
  margin-top: 36px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  padding: 16px 28px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 22px;
  font-weight: 800;
  cursor: pointer;
}

.btn.primary {
  background: var(--red);
  color: var(--green);
}

.btn.outline {
  border-color: rgba(255,255,255,.18);
  color: var(--green);
  background: rgba(0,0,0,.18);
}

.btn.full {
  width: 100%;
}

.section {
  padding: 86px 6vw;
}

.intro {
  max-width: 900px;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 34px;
}

.slider-buttons {
  display: flex;
  gap: 10px;
}

.nav-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #111;
  color: var(--gold);
  font-size: 34px;
  cursor: pointer;
}

.wine-slider {
  display: flex;
  gap: 26px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 24px;
  scrollbar-width: none;
}

.wine-slider::-webkit-scrollbar {
  display: none;
}

.wine-card {
  flex: 0 0 min(390px, 82vw);
  scroll-snap-align: start;
  background:
    radial-gradient(circle at 50% 18%, rgba(255,255,255,.08), transparent 28%),
    linear-gradient(180deg, #080808, #020202);
  border: 1px solid var(--line);
  border-radius: 34px;
  overflow: hidden;
  box-shadow:
    0 35px 70px rgba(0,0,0,.72),
    inset 0 0 40px rgba(255,255,255,.02);
}

.wine-image {
  height: 330px;
  padding: 34px 30px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wine-image img {
  max-height: 100%;
  max-width: 82%;
  object-fit: contain;
  filter:
    drop-shadow(0 34px 26px rgba(0,0,0,.82))
    drop-shadow(0 0 20px rgba(255,255,255,.06));
}

.wine-info {
  padding: 28px 30px 34px;
}

.wine-type {
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: .32em;
  font-weight: 900;
  font-size: 14px;
  margin-bottom: 18px;
}

.wine-info h3 {
  font-size: 34px;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin-bottom: 20px;
}

.wine-info p {
  color: var(--muted);
  font-size: 20px;
  line-height: 1.55;
  min-height: 92px;
}

.price {
  font-size: 32px;
  font-weight: 900;
  margin: 22px 0;
}

.add-btn {
  width: 100%;
  border: 0;
  border-radius: 999px;
  background: var(--red);
  color: var(--white);
  font-size: 20px;
  font-weight: 900;
  padding: 18px;
  cursor: pointer;
}

.cart-section {
  max-width: 900px;
}

.cart-box {
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 30px;
  padding: 34px;
  background: rgba(255,255,255,.015);
}

.cart-items {
  color: var(--muted);
  font-size: 22px;
  line-height: 1.5;
}

.cart-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-control button {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #111;
  color: var(--white);
  font-size: 22px;
  cursor: pointer;
}

.cart-total {
  font-size: clamp(36px, 8vw, 64px);
  font-weight: 900;
  margin: 32px 0;
}

.payment-box {
  border: 1px solid var(--line);
  border-radius: 26px;
  padding: 26px;
  margin-bottom: 28px;
}

.payment-box h3 {
  font-size: 30px;
  margin-bottom: 20px;
}

.payment-option {
  display: flex;
  gap: 16px;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 16px 20px;
  margin-bottom: 14px;
}

.payment-option span {
  color: var(--gold);
  font-size: 24px;
}

.payment-option strong {
  display: block;
  font-size: 22px;
}

.payment-option small {
  display: block;
  color: var(--muted);
  font-size: 15px;
  margin-top: 4px;
}

.payment-note {
  color: var(--muted);
  font-size: 20px;
  line-height: 1.55;
  margin-top: 20px;
}

.contact {
  text-align: center;
}

.contact-grid {
  max-width: 760px;
  margin: 46px auto 0;
  display: grid;
  gap: 18px;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 24px;
  text-align: left;
  padding: 26px 30px;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 24px;
  background: rgba(255,255,255,.015);
}

.contact-card span {
  width: 58px;
  color: var(--gold);
  font-size: 28px;
  font-weight: 900;
}

.contact-card.whatsapp span,
.contact-card.whatsapp strong,
.contact-card.whatsapp small {
  color: var(--green);
}

.contact-card strong {
  display: block;
  font-size: 26px;
  color: var(--gold);
}

.contact-card small {
  display: block;
  font-size: 21px;
  color: var(--gold);
  overflow-wrap: anywhere;
}

footer {
  padding: 36px 20px 70px;
  border-top: 1px solid rgba(255,255,255,.08);
  text-align: center;
  color: var(--muted);
  font-size: 18px;
}

.top-btn {
  position: fixed;
  right: 18px;
  bottom: 22px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 0;
  background: rgba(255,255,255,.16);
  color: white;
  font-size: 26px;
  z-index: 20;
}

@media (max-width: 600px) {
  .hero {
    min-height: 92vh;
    padding: 18px 12px;
  }

  .hero-card {
    padding: 44px 24px;
    border-radius: 28px;
  }

  .eyebrow {
    font-size: 12px;
    letter-spacing: .28em;
  }

  h1 {
    font-size: 64px;
  }

  h2 {
    font-size: 46px;
  }

  .hero-text {
    font-size: 23px;
    line-height: 1.55;
  }

  .btn {
    font-size: 20px;
    min-height: 54px;
  }

  .section {
    padding: 68px 22px;
  }

  .section-head {
    display: block;
  }

  .slider-buttons {
    margin-top: 16px;
  }

  .wine-card {
    flex-basis: 84vw;
    border-radius: 28px;
  }

  .wine-image {
    height: 300px;
    padding-top: 28px;
  }

  .wine-info h3 {
    font-size: 32px;
  }

  .wine-info p {
    font-size: 19px;
  }

  .cart-box {
    padding: 26px 22px;
  }

  .payment-box {
    padding: 22px;
  }

  .contact-card {
    padding: 22px;
    gap: 18px;
  }

  .contact-card small {
    font-size: 18px;
  }
}
