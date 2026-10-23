
import { useState } from 'react'
import { categories } from '../data/categories'
import '../styles/progress.css'

const STORAGE_KEY = 'qazaqlearn-quiz-results'

function loadResults() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    return Array.isArray(saved)
      ? saved.filter(
          (item) =>
            item &&
            typeof item.total === 'number' &&
            typeof item.correct === 'number'
        )
      : []
  } catch {
    return []
  }
}

function ProgressPage({ onBack, onCategories }) {
  const [results] = useState(loadResults)

  const attempts = results.length

  const totalQuestions = results.reduce(
    (sum, item) => sum + item.total, 0
  )

  const totalCorrect = results.reduce(
    (sum, item) => sum + item.correct, 0
  )

  const accuracy = totalQuestions > 0
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0

  const completedCategories = new Set(
    results.map((item) => item.categoryId)
  ).size

  const recognitionTotal = results.reduce(
    (sum, item) => sum + (item.recognitionTotal || 0), 0
  )

  const recognitionCorrect = results.reduce(
    (sum, item) => sum + (item.recognitionCorrect || 0), 0
  )

  const recallTotal = results.reduce(
    (sum, item) => sum + (item.recallTotal || 0), 0
  )

  const recallCorrect = results.reduce(
    (sum, item) => sum + (item.recallCorrect || 0), 0
  )

  const recognitionAccuracy = recognitionTotal > 0
    ? Math.round(
        (recognitionCorrect / recognitionTotal) * 100
      )
    : 0

  const recallAccuracy = recallTotal > 0
    ? Math.round((recallCorrect / recallTotal) * 100)
    : 0

  const dates = new Set(
    results
      .filter((item) => item.date)
      .map((item) => item.date.slice(0, 10))
  )

  const categoryProgress = categories.map((category) => {
    const categoryResults = results.filter(
      (result) => result.categoryId === category.id
    )

    const latest = categoryResults.at(-1)

    return {
      ...category,
      attempts: categoryResults.length,
      latestAccuracy: latest
        ? Math.round(
            (latest.correct / latest.total) * 100
          )
        : null,
    }
  })

  const history = [...results].reverse()

  function formatDate(value) {
    if (!value) return 'Unknown date'

    const date = new Date(value)

    return Number.isNaN(date.getTime())
      ? 'Unknown date'
      : date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
  }

  return (
    <div className="progress-page">
      <header className="progress-navbar">
        <button className="progress-brand" onClick={onBack}>
           QazaqLearn
        </button>

        <button className="progress-back" onClick={onBack}>
          ← Back to Home
        </button>
      </header>

      <main className="progress-container">
        <section className="progress-intro">
          <span className="progress-tag">
             MY LEARNING JOURNEY
          </span>

          <h1>Learning Progress</h1>

          <p>
            Track your vocabulary practice, quiz
            performance, and learning journey.
          </p>
        </section>

        <section className="progress-stats">
          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <strong>{attempts}</strong>
            <p>Quizzes Completed</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <strong>
              {attempts ? `${accuracy}%` : '—'}
            </strong>
            <p>Overall Accuracy</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🌿</span>
            <strong>{completedCategories}/10</strong>
            <p>Categories Practiced</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <strong>{dates.size}</strong>
            <p>Active Practice Days</p>
          </div>
        </section>

        <section className="progress-analysis">
          <div className="analysis-heading">
            <span>YOUR LEARNING PERFORMANCE</span>
            <h2>Knowledge Assessment</h2>
            <p>
              Compare recognition and cued recall
              results from your completed quizzes.
            </p>
          </div>

          <div className="analysis-card">
            <div className="analysis-row">
              <div className="analysis-label">
                <strong>Recognition</strong>
                <span>
                  {recognitionTotal
                    ? `${recognitionCorrect}/${recognitionTotal}`
                    : 'No results yet'}
                </span>
              </div>

              <div className="analysis-bar">
                <div
                  className="analysis-fill recognition"
                  style={{ width: `${recognitionAccuracy}%` }}
                />
              </div>

              <strong className="analysis-percent">
                {recognitionTotal
                  ? `${recognitionAccuracy}%`
                  : '—'}
              </strong>
            </div>

            <div className="analysis-row">
              <div className="analysis-label">
                <strong>Cued Recall</strong>
                <span>
                  {recallTotal
                    ? `${recallCorrect}/${recallTotal}`
                    : 'No results yet'}
                </span>
              </div>

              <div className="analysis-bar">
                <div
                  className="analysis-fill recall"
                  style={{ width: `${recallAccuracy}%` }}
                />
              </div>

              <strong className="analysis-percent">
                {recallTotal
                  ? `${recallAccuracy}%`
                  : '—'}
              </strong>
            </div>
          </div>
        </section>

        <section className="progress-categories">
          <div className="progress-section-heading">
            <div>
              <span>EXPLORE YOUR ACHIEVEMENTS</span>
              <h2>Category Progress</h2>
            </div>

            <button onClick={onCategories}>
              Explore Categories →
            </button>
          </div>

          <div className="category-progress-grid">
            {categoryProgress.map((category) => (
              <article
                className="category-progress-card"
                key={category.id}
              >
                <div className="category-progress-top">
                  <span className="progress-category-icon">
                    {category.icon}
                  </span>

                  <span
                    className={
                      category.attempts > 0
                        ? 'category-status practiced'
                        : 'category-status'
                    }
                  >
                    {category.attempts > 0
                      ? 'Practiced'
                      : 'Not started'}
                  </span>
                </div>

                <h3>{category.name}</h3>
                <p>{category.kazakh}</p>

                <div className="category-progress-bottom">
                  <span>
                    {category.attempts} quiz attempts
                  </span>

                  <strong>
                    {category.latestAccuracy === null
                      ? '—'
                      : `${category.latestAccuracy}%`}
                  </strong>
                </div>

                <div className="category-progress-track">
                  <div
                    className="category-progress-fill"
                    style={{
                      width: `${
                        category.latestAccuracy ?? 0
                      }%`,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="progress-history">
          <div className="progress-section-heading">
            <div>
              <span>YOUR PREVIOUS RESULTS</span>
              <h2>Quiz History</h2>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="history-empty">
              <span>🌱</span>
              <h3>Your journey starts here!</h3>
              <p>
                Complete your first vocabulary quiz
                to see your learning results.
              </p>

              <button onClick={onCategories}>
                Start Learning →
              </button>
            </div>
          ) : (
            <div className="history-list">
              {history.map((result, index) => (
                <div
                  className="history-item"
                  key={result.id ?? index}
                >
                  <div>
                    <strong>{result.categoryName}</strong>
                    <span>{formatDate(result.date)}</span>
                  </div>

                  <div className="history-score">
                    <strong>
                      {result.correct}/{result.total}
                    </strong>

                    <span>
                      {Math.round(
                        (result.correct / result.total) * 100
                      )}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="progress-motivation">
          <h2>Keep growing, one word at a time 🌿</h2>
          <p>
            Regular practice helps you build
            confidence in your Kazakh vocabulary.
          </p>
          <button onClick={onCategories}>
            Continue Learning →
          </button>
        </div>
      </main>
    </div>
  )
}

export default ProgressPage
