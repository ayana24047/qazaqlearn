import { useState } from 'react'
import '../styles/sus.css'

const questions = [
  'I think that I would like to use this system frequently.',
  'I found the system unnecessarily complex.',
  'I thought the system was easy to use.',
  'I think that I would need the support of a technical person to be able to use this system.',
  'I found the various functions in this system were well integrated.',
  'I thought there was too much inconsistency in this system.',
  'I would imagine that most people would learn to use this system very quickly.',
  'I found the system very cumbersome to use.',
  'I felt very confident using the system.',
  'I needed to learn a lot of things before I could get going with this system.',
]

const scaleLabels = [
  'Strongly disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly agree',
]

function calculateSUS(responses) {
  const total = responses.reduce((sum, response, index) => {
    return sum + (index % 2 === 0 ? response - 1 : 5 - response)
  }, 0)
  return total * 2.5
}

function SUSPage({ onBack }) {
  const [responses, setResponses] = useState(Array(10).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [saveError, setSaveError] = useState('')

  const completed = responses.filter((value) => value !== null).length
  const allAnswered = completed === questions.length
  const score = submitted ? calculateSUS(responses) : null

  function chooseAnswer(questionIndex, value) {
    if (submitted) return
    setResponses((previous) => previous.map((answer, index) =>
      index === questionIndex ? value : answer
    ))
  }

  function submitAnswers(event) {
    event.preventDefault()
    if (!allAnswered || submitted) return

    const result = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      score: calculateSUS(responses),
      responses: [...responses],
      mode: 'local-demo',
    }

    try {
      const saved = JSON.parse(localStorage.getItem('qazaqlearn-sus-results') || '[]')
      const previous = Array.isArray(saved) ? saved : []
      localStorage.setItem('qazaqlearn-sus-results', JSON.stringify([...previous, result]))
      setSaveError('')
    } catch (error) {
      console.error('SUS result was not saved:', error)
      setSaveError('Your score was calculated but could not be saved in this browser.')
    }

    setSubmitted(true)
    window.scrollTo(0, 0)
  }

  function restart() {
    setResponses(Array(10).fill(null))
    setSubmitted(false)
    setSaveError('')
    window.scrollTo(0, 0)
  }

  return (
    <div className="sus-page">
      <header className="sus-navbar">
        <button className="sus-brand" type="button" onClick={onBack}> QazaqLearn</button>
        <button className="sus-back" type="button" onClick={onBack}>← Back to Home</button>
      </header>

      <main className="sus-container">
        <div className="sus-intro">
          <span className="sus-tag">RESEARCH MODE · USABILITY EVALUATION</span>
          <h1>System Usability Scale</h1>
          <p>
            Please rate your experience of using QazaqLearn. Select one response for
            each statement, based on your own experience with the application.
          </p>
          <p className="sus-demo-note">Local demonstration: responses are stored only in this browser. Do not enter real participant data before consent and approval.</p>
        </div>

        {submitted ? (
          <section className="sus-result" aria-live="polite">
            <span className="sus-tag">QUESTIONNAIRE COMPLETED</span>
            <h2>Thank you for your feedback!</h2>
            <div className="sus-score">{score}<span> / 100</span></div>
            <p>This is your calculated SUS score, not a percentage of correct answers.</p>
            {saveError && <p className="sus-error" role="alert">{saveError}</p>}
            <div className="sus-result-actions">
              <button className="sus-primary" type="button" onClick={restart}>Try another demo response</button>
              <button className="sus-secondary" type="button" onClick={onBack}>Back to Home</button>
            </div>
          </section>
        ) : (
          <form onSubmit={submitAnswers}>
            <div className="sus-progress-info">
              <strong>{completed} of {questions.length} answered</strong>
              <span>{Math.round((completed / questions.length) * 100)}% complete</span>
            </div>
            <div className="sus-progress-track">
              <div className="sus-progress-fill" style={{ width: `${(completed / questions.length) * 100}%` }} />
            </div>
            <div className="sus-questions">
              {questions.map((question, index) => (
                <fieldset className="sus-question" key={question}>
                  <legend><span>Question {index + 1}</span>{question}</legend>
                  <div className="sus-options">
                    {scaleLabels.map((label, optionIndex) => {
                      const value = optionIndex + 1
                      const selected = responses[index] === value
                      return (
                        <label className={`sus-option${selected ? ' selected' : ''}`} key={value}>
                          <input
                            type="radio"
                            name={`sus-question-${index + 1}`}
                            value={value}
                            checked={selected}
                            onChange={() => chooseAnswer(index, value)}
                          />
                          <strong>{value}</strong>
                          <span>{label}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="sus-submit-row">
              <p>Answer all ten statements to submit.</p>
              <button className="sus-primary" type="submit" disabled={!allAnswered}>
                Submit Questionnaire →
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default SUSPage
