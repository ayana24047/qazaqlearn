
import { words } from './words'

const STORAGE_KEY = 'qazaqlearn-daily-set'

function getToday() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function shuffleWords(items) {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export function getDailyWords() {
  const today = getToday()

  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || 'null'
    )

    if (
      saved?.date === today &&
      Array.isArray(saved.wordIds) &&
      saved.wordIds.length > 0
    ) {
      const savedWords = saved.wordIds
        .map((id) => words.find((word) => word.id === id))
        .filter(Boolean)

      if (savedWords.length === Math.min(60, words.length)) {
        return savedWords
      }
    }
  } catch (error) {
    console.warn('Could not load daily words:', error)
  }

  const dailyWords = shuffleWords(words).slice(0, 60)

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: today,
        wordIds: dailyWords.map((word) => word.id),
      })
    )
  } catch (error) {
    console.warn('Could not save daily words:', error)
  }

  return dailyWords
}
