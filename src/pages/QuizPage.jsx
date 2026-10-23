
import { useState } from 'react'
import { words } from '../data/words'
import '../styles/quiz.css'

function shuffle(items) {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

function createQuestions(categoryId, sessionWords) {
  const categoryWords = sessionWords
    ? sessionWords.slice(0, 6)
    : words.filter((word) => word.categoryId === categoryId)

  const recognitionQuestions = categoryWords.map((word) => {
    const otherWords = shuffle(
      words.filter(
        (item) =>
          item.id !== word.id &&
          item.english !== word.english
      )
    )

    const options = [word.english]

    for (const item of otherWords) {
      if (!options.includes(item.english)) {
        options.push(item.english)
      }
      if (options.length === 4) break
    }

    return {
      id: `${word.id}-recognition`,
      type: 'recognition',
      prompt: word.kazakh,
      correct: word.english,
      options: shuffle(options),
    }
  })

  const recallQuestions = categoryWords.map((word) => ({
    id: `${word.id}-recall`,
    type: 'recall',
    prompt: word.english,
    correct: word.kazakh,
  }))

  return [
    ...shuffle(recognitionQuestions),
    ...shuffle(recallQuestions),
  ]
}

function normalizeAnswer(value) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, ' ')
}

function QuizPage({ category, onBack, onComplete, sessionWords }) {
  const [questions] = useState(() =>
    createQuestions(category.id, sessionWords)
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentIndex]
  const currentIsCorrect = checked && currentQuestion &&
    normalizeAnswer(selectedAnswer) ===
    normalizeAnswer(currentQuestion.correct)

  const correctCount = answers.filter(
    (answer) => answer.isCorrect
  ).length

  const recognitionCorrect = answers.filter(
    (answer) =>
      answer.type === 'recognition' && answer.isCorrect
  ).length

  const recallCorrect = answers.filter(
    (answer) =>
      answer.type === 'recall' && answer.isCorrect
  ).length

  const percentage = questions.length
    ? Math.round((correctCount / questions.length) * 100)
    : 0

  function checkAnswer() {
    if (!selectedAnswer.trim() || checked) return

    const isCorrect =
      normalizeAnswer(selectedAnswer) ===
      normalizeAnswer(currentQuestion.correct)

    setAnswers((previous) => [
      ...previous,
      {
        questionId: currentQuestion.id,
        type: currentQuestion.type,
        prompt: currentQuestion.prompt,
        givenAnswer: selectedAnswer.trim(),
        correctAnswer: currentQuestion.correct,
        isCorrect,
      },
    ])

    setChecked(true)
  }

  function nextQuestion() {
    if (currentIndex === questions.length - 1) {
      const result = {
        id: crypto.randomUUID(),
        categoryId: category.id,
        categoryName: category.name,
        date: new Date().toISOString(),
        total: questions.length,
        correct: correctCount,
        recognitionCorrect,
        recognitionTotal: questions.filter(
          (q) => q.type === 'recognition'
        ).length,
        recallCorrect,
        recallTotal: questions.filter(
          (q) => q.type === 'recall'
        ).length,
        percentage,
        answers,
      }

      setFinished(true)
      onComplete(result)
      return
    }

    setCurrentIndex((previous) => previous + 1)
    setSelectedAnswer('')
    setChecked(false)
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-empty">
        <h1>No quiz questions available</h1>
        <button onClick={onBack}>Back to Categories</button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="quiz-page">
        <header className="quiz-navbar">
          <span className="quiz-logo"> QazaqLearn</span>
        </header>

        <main className="quiz-result">
          <span className="quiz-result-icon">🏆</span>
          <span className="quiz-label">QUIZ COMPLETED</span>

          <h1>Well done!</h1>
          <p>You completed the {category.name} quiz.</p>

          <div className="quiz-score">
            <strong>{percentage}%</strong>
            <span>
              {correctCount} out of {questions.length} correct
            </span>
          </div>

          <div className="quiz-result-grid">
            <div>
              <span>Recognition</span>
              <strong>
                {recognitionCorrect} / {
                  questions.filter(
                    (q) => q.type === 'recognition'
                  ).length
                }
              </strong>
            </div>

            <div>
              <span>Cued Recall</span>
              <strong>
                {recallCorrect} / {
                  questions.filter(
                    (q) => q.type === 'recall'
                  ).length
                }
              </strong>
            </div>
          </div>

          <h2>Review your answers</h2>

          <div className="quiz-review">
            {answers.map((answer) => (
              <div
                key={answer.questionId}
                className="review-item"
              >
                <span>
                  {answer.isCorrect ? '✓' : '✕'}{' '}
                  {answer.prompt}
                </span>

                <strong>{answer.correctAnswer}</strong>

                {!answer.isCorrect && (
                  <small>
                    Your answer: {answer.givenAnswer}
                  </small>
                )}
              </div>
            ))}
          </div>

          <button
            className="quiz-primary"
            onClick={onBack}
          >
            Back to Categories →
          </button>
        </main>
      </div>
    )
  }

  const progress =
    (currentIndex / questions.length) * 100

  return (
    <div className="quiz-page">
      <header className="quiz-navbar">
        <span className="quiz-logo"> QazaqLearn</span>

        <button
          className="quiz-back"
          onClick={onBack}
        >
          Exit Quiz
        </button>
      </header>

      <main className="quiz-container">
        <div className="quiz-heading">
          <span className="quiz-label">
             TEST YOUR KNOWLEDGE
          </span>

          <h1>{category.name} Quiz</h1>

          <p>
            Practice your Kazakh vocabulary
            and see how much you remember.
          </p>
        </div>

        <div className="quiz-progress-info">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>
            {currentQuestion.type === 'recognition'
              ? 'Recognition'
              : 'Cued Recall'}
          </span>
        </div>

        <div className="quiz-progress-track">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <section className="quiz-question-card">
          <span className="question-type">
            {currentQuestion.type === 'recognition'
              ? 'CHOOSE THE TRANSLATION'
              : 'WRITE THE KAZAKH WORD'}
          </span>

          <h2>{currentQuestion.prompt}</h2>

          <p className="quiz-instruction">
            {currentQuestion.type === 'recognition'
              ? 'What does this Kazakh word mean?'
              : 'How do you say this in Kazakh?'}
          </p>

          {currentQuestion.type === 'recognition' ? (
            <div className="quiz-options">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={checked}
                  className={
                    selectedAnswer === option
                      ? 'quiz-option selected'
                      : 'quiz-option'
                  }
                  onClick={() => setSelectedAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              className="quiz-answer-input"
              type="text"
              placeholder="Type the Kazakh word..."
              aria-label="Your Kazakh answer"
              value={selectedAnswer}
              disabled={checked}
              onChange={(event) =>
                setSelectedAnswer(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !checked) {
                  checkAnswer()
                }
              }}
            />
          )}

          {checked && (
            <div
              className={
                currentIsCorrect
                  ? 'quiz-feedback correct'
                  : 'quiz-feedback incorrect'
              }
              role="status"
            >
              <strong>
                {currentIsCorrect
                  ? '✓ Correct answer!'
                  : '✕ Not quite right'}
              </strong>

              <span>
                Correct answer: {currentQuestion.correct}
              </span>
            </div>
          )}

          {!checked ? (
            <button
              className="quiz-primary"
              disabled={!selectedAnswer.trim()}
              onClick={checkAnswer}
            >
              Check Answer →
            </button>
          ) : (
            <button
              className="quiz-primary"
              onClick={nextQuestion}
            >
              {currentIndex === questions.length - 1
                ? 'Finish Quiz →'
                : 'Next Question →'}
            </button>
          )}
        </section>
      </main>
    </div>
  )
}

export default QuizPage
