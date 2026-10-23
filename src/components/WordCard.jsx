
import { useState } from 'react'

function WordCard({ word, showTranslation }) {
  const [imageError, setImageError] = useState(false)

  return (
    <article className="word-card">
      <div className="word-image">
        {!imageError ? (
          <img
            src={word.image}
            alt={word.english}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="missing-photo">
            <span>Image not added yet</span>
            <small>{word.image}</small>
          </div>
        )}
      </div>

      <div className="word-information">
        <span className="word-label">
          KAZAKH VOCABULARY
        </span>

        <h2>{word.kazakh}</h2>

        <div className="translation-box">
          {showTranslation ? (
            <>
              <span>ENGLISH TRANSLATION</span>
              <strong>{word.english}</strong>
            </>
          ) : (
            <span>
              Try to remember the meaning,
              then reveal the translation.
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default WordCard
