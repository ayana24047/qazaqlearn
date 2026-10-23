
import { useState } from 'react'
import { words } from '../data/words'
import { categories } from '../data/categories'
import '../styles/controlGroup.css'

function ControlGroupPage({ onBack }) {
  const [search, setSearch] = useState('')

  const filteredWords = words.filter((word) => {
    const query = search.toLocaleLowerCase().trim()

    return (
      word.kazakh.toLocaleLowerCase().includes(query) ||
      word.english.toLocaleLowerCase().includes(query)
    )
  })

  return (
    <div className="control-page">
      <header className="control-navbar">
        <button className="control-logo" onClick={onBack}>
           QazaqLearn
        </button>

        <button className="control-back" onClick={onBack}>
          ← Back to Home
        </button>
      </header>

      <main className="control-container">
        <div className="control-intro">
          <span className="control-tag">
            RESEARCH MODE · CONTROL CONDITION
          </span>

          <h1>Control Group</h1>

          <p>
            Traditional vocabulary learning using a plain word list.
            Study the Kazakh words and their English translations
            without flashcards, pictures, or interactive exercises.
          </p>

          <div className="control-stats">
            <div>
              <strong>{words.length}</strong>
              <span>Vocabulary Words</span>
            </div>

            <div>
              <strong>{categories.length}</strong>
              <span>Categories</span>
            </div>

            <div>
              <strong>Text Only</strong>
              <span>Learning Format</span>
            </div>
          </div>
        </div>

        <section className="control-material">
          <div className="control-material-top">
            <div>
              <span className="control-section-label">
                STUDY MATERIAL
              </span>
              <h2>Kazakh Vocabulary List</h2>
              <p>
                The same vocabulary used in the experimental group.
              </p>
            </div>

            <input
              className="control-search"
              type="search"
              placeholder="Search vocabulary..."
              aria-label="Search vocabulary"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="control-groups">
            {categories.map((category) => {
              const categoryWords = filteredWords.filter(
                (word) => word.categoryId === category.id
              )

              if (categoryWords.length === 0) return null

              return (
                <section
                  className="control-category"
                  key={category.id}
                >
                  <div className="control-category-heading">
                    <div>
                      <span className="control-category-icon">
                        {category.icon || '📖'}
                      </span>
                      <h3>{category.name}</h3>
                    </div>

                    <span>{categoryWords.length} words</span>
                  </div>

                  <table className="control-table">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Kazakh</th>
                        <th>English</th>
                      </tr>
                    </thead>

                    <tbody>
                      {categoryWords.map((word, index) => (
                        <tr key={word.id}>
                          <td>{index + 1}</td>
                          <td className="control-kazakh">
                            {word.kazakh}
                          </td>
                          <td>{word.english}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )
            })}
          </div>

          {filteredWords.length === 0 && (
            <p className="control-empty">
              No matching words found.
            </p>
          )}
        </section>

        <div className="control-bottom">
          <p>
            Research note: Participants should study this list
            according to the assigned study schedule.
          </p>

          <button onClick={onBack}>
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  )
}

export default ControlGroupPage
