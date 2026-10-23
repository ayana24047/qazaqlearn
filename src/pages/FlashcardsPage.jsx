
import { useEffect, useState } from 'react'
import { words } from '../data/words'
import WordCard from '../components/WordCard'
import '../styles/flashcards.css'

function FlashcardsPage({
  category,
  onBack,
  onFinish,
  sessionWords,
}) {
  const categoryWords = sessionWords ?? words.filter(
    (word) => word.categoryId === category.id
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranslation, setShowTranslation] =
    useState(false)

  const currentWord = categoryWords[currentIndex]
  const totalWords = categoryWords.length

  const progress = totalWords > 0
    ? ((currentIndex + 1) / totalWords) * 100
    : 0

  useEffect(() => {
    setShowTranslation(false)
  }, [currentIndex])

  function nextWord() {
    if (currentIndex < totalWords - 1) {
      setCurrentIndex((index) => index + 1)
      setShowTranslation(false)
    }
  }

  function previousWord() {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1)
      setShowTranslation(false)
    }
  }

  if (totalWords === 0) {
    return (
      <div className="flashcards-empty">
        <span>📚</span>
        <h1>{category.name}</h1>
        <p>
          Vocabulary for this category
          is being prepared.
        </p>
        <button onClick={onBack}>
          ← Back to Categories
        </button>
      </div>
    )
  }

  return (
    <div className="flashcards-page">
      <header className="flashcards-navbar">
        <button
          className="flashcards-brand"
          onClick={onBack}
        >
           QazaqLearn
        </button>

        <button
          className="flashcards-back"
          onClick={onBack}
        >
          ← Categories
        </button>
      </header>

      <main className="flashcards-container">
        <div className="flashcards-heading">
          <span className="learning-tag">
             LEARNING MODE
          </span>

          <h1>{category.name}</h1>
          <p>{category.kazakh}</p>
        </div>

        <div className="flashcards-progress">
          <div className="progress-heading">
            <span>Your learning journey</span>

            <strong>
              {currentIndex + 1} / {totalWords}
            </strong>
          </div>

          <div className="flashcards-progress-track">
            <div
              className="flashcards-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <WordCard
          key={currentWord.id}
          word={currentWord}
          showTranslation={showTranslation}
        />

        <div className="flashcard-actions">
          <button
            className="previous-word"
            onClick={previousWord}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>

          <button
            className="reveal-word"
            onClick={() =>
              setShowTranslation((value) => !value)
            }
          >
            {showTranslation
              ? 'Hide Translation'
              : 'Show Translation'}
          </button>

          {currentIndex === totalWords - 1 ? (
            <button
              className="next-word"
              onClick={() => onFinish(category)}
            >
              Take Quiz →
            </button>
          ) : (
            <button
              className="next-word"
              onClick={nextWord}
            >
              Next Word →
            </button>
          )}
        </div>

        <div className="learning-tip">
          <span>💡</span>
          <p>
            Try to remember the word before
            revealing its meaning.
          </p>
        </div>
      </main>
    </div>
  )
}

export default FlashcardsPage
