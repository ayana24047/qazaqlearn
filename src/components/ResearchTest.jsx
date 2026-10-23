import { useMemo, useState } from 'react'
import { words } from '../data/words'
import '../styles/researchTests.css'

const PHASES = {
  baseline: {
    title: 'Baseline Test',
    description: 'Measure vocabulary knowledge before the learning period.',
    questionsPerCategory: 1,
  },
  immediate: {
    title: 'Immediate Post-test',
    description: 'Measure vocabulary knowledge immediately after the learning period.',
    questionsPerCategory: 2,
  },
  delayed: {
    title: 'Delayed Post-test',
    description: 'Measure vocabulary retention two weeks after the immediate post-test.',
    questionsPerCategory: 6,
  },
}

const STORAGE_KEY = 'qazaqlearn-research-results'

function normalized(text) {
  return String(text).normalize('NFC').trim().toLocaleLowerCase().replace(/\s+/g, ' ')
}

// Stable numeric hash so the same word always gets the same response options.
function hash(text) {
  let value = 2166136261
  for (const character of text) {
    value ^= character.charCodeAt(0)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

function buildQuestions(phase) {
  const questionCount = PHASES[phase]?.questionsPerCategory ?? 6
  const byCategory = new Map()
  words.forEach((word) => {
    const group = byCategory.get(word.categoryId) || []
    group.push(word)
    byCategory.set(word.categoryId, group)
  })

  // Each category contributes the same number of questions.
  // Baseline: one item per category, alternating 5 recognition / 5 recall.
  // Immediate: two items per category, one of each type (10 / 10).
  // Delayed: six items per category, three of each type (30 / 30).
  const questions = []
  let categoryIndex = 0
  for (const categoryWords of byCategory.values()) {
    const selected = questionCount === 1
      ? [categoryWords[categoryIndex % categoryWords.length]]
      : questionCount === 2
        ? [categoryWords[0], categoryWords[3]]
        : categoryWords.slice(0, questionCount)

    selected.forEach((word, index) => {
      const isRecognition = questionCount === 1
        ? categoryIndex % 2 === 0
        : questionCount === 2
          ? index === 0
          : index < 3
      if (isRecognition) {
        const distractors = words
          .filter((other) => other.id !== word.id && other.english !== word.english)
          .sort((a, b) => hash(`${word.id}|${a.id}`) - hash(`${word.id}|${b.id}`))
          .slice(0, 3)
          .map((other) => other.english)
        const options = [word.english, ...distractors]
          .sort((a, b) => hash(`${word.id}|option|${a}`) - hash(`${word.id}|option|${b}`))
        questions.push({ id: word.id, type: 'recognition', prompt: word.kazakh, correct: word.english, options })
      } else {
        questions.push({ id: word.id, type: 'recall', prompt: word.english, correct: word.kazakh })
      }
    })
    categoryIndex++
  }
  return questions
}

export default function ResearchTest({ phase, onBack }) {
  const settings = PHASES[phase]
  const questions = useMemo(() => buildQuestions(phase), [phase])
  const [participantId, setParticipantId] = useState('')
  const [started, setStarted] = useState(false)
  const [responses, setResponses] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [saveError, setSaveError] = useState('')

  if (!settings) return <p>Unknown research test.</p>

  const current = questions[currentIndex]
  const currentAnswer = responses[current.id] || ''
  const completed = questions.filter((q) => (responses[q.id] || '').trim() !== '').length
  const validId = /^[a-zA-Z0-9_-]{3,24}$/.test(participantId.trim())

  function saveAnswer(value) {
    if (result) return
    setResponses((previous) => ({ ...previous, [current.id]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (completed !== questions.length) return

    let recognitionCorrect = 0
    let recallCorrect = 0
    const answers = questions.map((question) => {
      const answer = (responses[question.id] || '').trim()
      const correct = normalized(answer) === normalized(question.correct)
      if (correct && question.type === 'recognition') recognitionCorrect++
      if (correct && question.type === 'recall') recallCorrect++
      return {
        wordId: question.id,
        type: question.type,
        response: answer,
        isCorrect: correct,
      }
    })

    const next = {
      participantId: participantId.trim(),
      phase,
      date: new Date().toISOString(),
      total: questions.length,
      correct: recognitionCorrect + recallCorrect,
      recognitionCorrect,
      recognitionTotal: questions.filter((q) => q.type === 'recognition').length,
      recallCorrect,
      recallTotal: questions.filter((q) => q.type === 'recall').length,
      answers,
      instrumentVersion: 'research-v2-10-20-60',
    }

    try {
      const oldData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const existing = Array.isArray(oldData) ? oldData : []
      // One result per participant and phase; redoing the test replaces the demo record.
      const updated = existing.filter((entry) => !(entry.participantId === next.participantId && entry.phase === phase))
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...updated, next]))
      setSaveError('')
      setResult(next)
    } catch {
      setSaveError('Could not save the result. Check browser storage settings.')
    }
  }

  return (
    <div className="rt-page">
      <header className="rt-nav">
        <button className="rt-logo" type="button" onClick={onBack}>✦ QazaqLearn</button>
        <button className="rt-back" type="button" onClick={onBack}>← Back to Home</button>
      </header>
      <main className="rt-container">
        <section className="rt-intro">
          <span className="rt-tag">RESEARCH MODE · VOCABULARY ASSESSMENT</span>
          <h1>{settings.title}</h1>
          <p>{settings.description}</p>
          <p className="rt-small">This assessment gives no answer feedback. Results are stored locally for prototype testing, not on a research server.</p>
        </section>

        {!started && !result && (
          <section className="rt-panel">
            <h2>Before you begin</h2>
            <p>Enter a non-identifying participant code (3–24 letters, numbers, _ or -). Do not enter a real name or student ID.</p>
            <label className="rt-field-label" htmlFor="participant-code">Participant code</label>
            <input id="participant-code" className="rt-input" value={participantId} maxLength={24} placeholder="e.g. demo_001" onChange={(e) => setParticipantId(e.target.value)} />
            <p className="rt-small">{questions.length} questions: recognition and cued recall. Do not use notes or vocabulary lists during the assessment.</p>
            {phase === 'delayed' && <p className="rt-warning">Schedule this test 14 days after the immediate post-test. The prototype does not automatically verify the study timetable.</p>}
            <button className="rt-primary" type="button" disabled={!validId} onClick={() => setStarted(true)}>Start Test →</button>
          </section>
        )}

        {started && !result && questions.length > 0 && (
          <form className="rt-panel" onSubmit={submit}>
            <div className="rt-progress-text"><span>Question {currentIndex + 1} of {questions.length}</span><span>{completed} answered</span></div>
            <div className="rt-track"><div className="rt-fill" style={{ width: `${completed / questions.length * 100}%` }} /></div>
            <span className="rt-type">{current.type === 'recognition' ? 'CHOOSE THE ENGLISH TRANSLATION' : 'WRITE THE KAZAKH WORD'}</span>
            <h2 className="rt-prompt">{current.prompt}</h2>
            {current.type === 'recognition' ? (
              <div className="rt-options">
                {current.options.map((option) => (
                  <label key={option} className={`rt-option ${currentAnswer === option ? 'rt-option-active' : ''}`}>
                    <input type="radio" name={`answer-${current.id}`} checked={currentAnswer === option} onChange={() => saveAnswer(option)} />
                    {option}
                  </label>
                ))}
              </div>
            ) : (
              <input className="rt-input" type="text" value={currentAnswer} placeholder="Type the Kazakh word" autoComplete="off" onChange={(e) => saveAnswer(e.target.value)} aria-label="Kazakh vocabulary answer" />
            )}
            <div className="rt-actions">
              <button className="rt-secondary" type="button" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>← Previous</button>
              {currentIndex < questions.length - 1 ? (
                <button className="rt-primary" type="button" onClick={() => setCurrentIndex((i) => i + 1)}>Next →</button>
              ) : (
                <button className="rt-primary" type="submit" disabled={completed !== questions.length}>Submit Assessment →</button>
              )}
            </div>
            {completed !== questions.length && currentIndex === questions.length - 1 && <p className="rt-small">Answer all questions before submitting. You can go back to unanswered items.</p>}
            {saveError && <p role="alert" className="rt-error">{saveError}</p>}
          </form>
        )}

        {result && (
          <section className="rt-panel rt-result">
            <span className="rt-tag">ASSESSMENT SAVED LOCALLY</span>
            <h2>{settings.title} completed</h2>
            <div className="rt-score">{result.correct} / {result.total}</div>
            <p>Recognition: {result.recognitionCorrect}/{result.recognitionTotal} · Cued recall: {result.recallCorrect}/{result.recallTotal}</p>
            <p className="rt-small">Correct answers are intentionally hidden to avoid influencing later assessments. Use the same participant code across research phases.</p>
            <button className="rt-primary" type="button" onClick={onBack}>Back to Home →</button>
          </section>
        )}
      </main>
    </div>
  )
}
