
import { useState } from 'react'
import { categories } from '../data/categories'
import CategoryCard from '../components/CategoryCard'
import '../styles/pages.css'
import '../styles/components.css'

function CategoriesPage({ onBack, onSelectCategory }) {
  const [search, setSearch] = useState('')

  const filteredCategories = categories.filter((category) => {
    const query = search.trim().toLowerCase()

    return (
      category.name.toLowerCase().includes(query) ||
      category.kazakh.toLowerCase().includes(query)
    )
  })

  return (
    <div className="categories-page">
      <header className="categories-navbar">
        <button className="categories-logo" onClick={onBack}>
          <span></span> QazaqLearn
        </button>

        <button className="back-home" onClick={onBack}>
          ← Back to Home
        </button>
      </header>

      <main className="categories-container">
        <section className="categories-hero">
          <div className="categories-hero-text">
            <span className="categories-eyebrow">
               EXPLORE & LEARN
            </span>

            <h1>
              Every word is a <br />
              <em>new discovery.</em>
            </h1>

            <p>
              Choose a topic that inspires you and start
              exploring the Kazakh language, one word
              at a time.
            </p>

            <div className="categories-stats">
              <span> 10 Categories</span>
              <span> 60 Target Words</span>
            </div>
          </div>
          <div className="categories-hero-symbol">
            ✺
          </div>
        </section>

        <section className="categories-content">
          <div className="categories-toolbar">
            <div>
              <span className="categories-section-label">
                YOUR VOCABULARY COLLECTION
              </span>
              <h2>Explore Categories</h2>
              <p>
                Find your favorite topic and begin learning.
              </p>
            </div>

            <div className="category-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search categories..."
                aria-label="Search categories"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onSelect={onSelectCategory}
              />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="category-empty">
              No categories found. Try another search.
            </div>
          )}
        </section>
      </main>

      <footer className="categories-footer">
        <span>QazaqLearn</span>
        <span>Learn • Practice • Remember</span>
      </footer>
    </div>
  )
}

export default CategoriesPage
