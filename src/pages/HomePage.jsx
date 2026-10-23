
import { useState } from 'react'

function HomePage({ onNavigate }) {
  const [researchOpen, setResearchOpen] = useState(false)

  function openResearchPage(page) {
    setResearchOpen(false)
    onNavigate(page)
  }

  return (
    <div className="home-page">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon"></span>
          <span>QazaqLearn</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <button
            className="nav-link active"
            onClick={() => onNavigate('home')}
          >
            Home
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate('categories')}
          >
            Categories
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate('progress')}
          >
            Progress
          </button>

          <button
            type="button"
            className="nav-link research-nav-button"
            onClick={() => setResearchOpen(true)}
            aria-expanded={researchOpen}
            aria-controls="research-side-panel"
          >
            Research Mode ☰
          </button>
        </nav>

        <div className="nav-avatar">Q</div>
      </header>

      {researchOpen && (
        <div className="research-drawer-overlay">
          <button
            type="button"
            className="research-drawer-backdrop"
            aria-label="Close Research Mode"
            onClick={() => setResearchOpen(false)}
          />

          <aside
            id="research-side-panel"
            className="research-drawer"
            aria-label="Research Mode menu"
          >
            <div className="research-drawer-header">
              <div>
                <span className="research-drawer-label">
                   QAZAQLEARN
                </span>
                <h2>Research Mode</h2>
              </div>

              <button
                type="button"
                className="research-drawer-close"
                aria-label="Close menu"
                onClick={() => setResearchOpen(false)}
              >
                
              </button>
            </div>

            <p className="research-drawer-description">
              Research and Evaluation
            </p>

            <div className="research-drawer-links">
              <button
                type="button"
                onClick={() => openResearchPage('baseline-test')}
              >
                Baseline Test <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => openResearchPage('immediate-post-test')}
              >
                Immediate Post-test <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => openResearchPage('delayed-post-test')}
              >
                Delayed Post-test <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => openResearchPage('control-group')}
              >
                Control Group <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => openResearchPage('sus')}
              >
                SUS Questionnaire <span>→</span>
              </button>
            </div>

            <div className="research-drawer-footer">
              Learn • Practice • Research
            </div>
          </aside>
        </div>
      )}

      <main id="home">
        <section className="hero">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-badge">
              ✨ Your Kazakh learning journey
            </div>

            <h1>
              Discover the beauty <br />
              of the <em>Kazakh language.</em>
            </h1>

            <p className="hero-description">
              Learn everyday Kazakh words through
              beautiful flashcards, interactive quizzes,
              and daily practice.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => onNavigate('categories')}
              >
                Start Learning <span>→</span>
              </button>

              <button
                className="secondary-button"
                onClick={() => onNavigate('progress')}
              >
                View Progress
              </button>
            </div>

            <div className="hero-features">
              <span>✓ Interactive flashcards</span>
              <span>✓ Daily practice</span>
              <span>✓ Vocabulary quizzes</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="section-label">
                YOUR LEARNING SPACE
              </p>
              <h2>Start your learning journey</h2>
              <p>
                Explore new words, practice regularly,
                and track your progress.
              </p>
            </div>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">📚</div>
              <div className="feature-tag">EXPLORE</div>
              <h3>Vocabulary Categories</h3>
              <p>
                Discover 10 themed categories, from
                family and nature to everyday life.
              </p>
              <button
                className="card-link"
                onClick={() => onNavigate('categories')}
              >
                Explore Categories →
              </button>
            </article>

            <article className="feature-card featured">
              <div className="feature-icon">🌿</div>
              <div className="feature-tag">DAILY LEARNING</div>
              <h3>Daily Practice</h3>
              <p>
                Strengthen your memory with daily
                vocabulary practice and quizzes.
              </p>
              <button
                className="card-link"
                onClick={() => onNavigate('daily')}
              >
                Start Practicing →
              </button>
            </article>

            <article className="feature-card">
              <div className="feature-icon">📈</div>
              <div className="feature-tag">YOUR JOURNEY</div>
              <h3>Learning Progress</h3>
              <p>
                Follow your learning journey and
                review your quiz results.
              </p>
              <button
                className="card-link"
                onClick={() => onNavigate('progress')}
              >
                View Progress →
              </button>
            </article>
          </div>

          <div className="motivation-banner">
            <div>
              <span className="motivation-label">
                A LITTLE EVERY DAY
              </span>
              <h2>Small steps. Big progress.</h2>
              <p>
                Every word you learn brings you closer
                to speaking Kazakh with confidence.
              </p>
            </div>

            <span className="motivation-art"></span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span> QazaqLearn</span>
        <span>Learn • Practice • Remember</span>
        <span>Made for Kazakh language learners</span>
      </footer>
    </div>
  )
}

export default HomePage
