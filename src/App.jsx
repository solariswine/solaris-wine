export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="overlay">
          <h1>Solaris Wine</h1>
          <p>Curated Portuguese Wines</p>

          <div className="buttons">
            <a href="#collection" className="btn">
              Explore Collection
            </a>

            <a
              href="https://wa.me/66961544263"
              target="_blank"
              className="btn secondary"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="section" id="collection">
        <h2>Featured Wines</h2>

        <div className="cards">
          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=1200"
              alt="Mariana Red"
            />
            <h3>Mariana Red</h3>
            <p>Rich, elegant and smooth Portuguese red wine.</p>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200"
              alt="Goivo"
            />
            <h3>Goivo Vinho Verde</h3>
            <p>Fresh, vibrant and refreshing white wine.</p>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1474722883778-792e7990302f?q=80&w=1200"
              alt="Rocim"
            />
            <h3>Herdade do Rocim</h3>
            <p>Premium wines imported directly from Portugal.</p>
          </div>
        </div>
      </section>

      <section className="story">
        <div className="story-content">
          <h2>The Story of Rocim</h2>

          <p>
            Solaris Wine brings carefully selected Portuguese wines to Thailand,
            Laos and beyond — combining modern elegance with authentic
            winemaking heritage.
          </p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Solaris Wine</p>
      </footer>
    </div>
  );
}
