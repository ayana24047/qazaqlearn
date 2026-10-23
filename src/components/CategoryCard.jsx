
import { useState } from 'react'

function CategoryCard({ category, onSelect }) {
  const [imageError, setImageError] = useState(false)

  return (
    <article className="category-card">
      <div
        className="category-image"
        style={{ backgroundColor: category.color }}
      >
        {!imageError ? (
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="category-fallback">
            {category.icon}
          </span>
        )}

        <span className="category-count">
          {category.wordCount} words
        </span>
      </div>

      <div className="category-body">
        <div className="category-heading">
          <div>
            <h3>{category.name}</h3>
            <span className="category-kazakh">
              {category.kazakh}
            </span>
          </div>

          <span className="category-small-icon">
            {category.icon}
          </span>
        </div>

        <p>{category.description}</p>

        <button
          className="category-button"
          onClick={() => onSelect(category)}
        >
          Explore Words <span>↗</span>
        </button>
      </div>
    </article>
  )
}

export default CategoryCard
