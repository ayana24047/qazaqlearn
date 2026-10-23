
import { useState } from 'react'
import HomePage from './pages/HomePage'
import CategoriesPage from './pages/CategoriesPage'
import FlashcardsPage from './pages/FlashcardsPage'
import QuizPage from './pages/QuizPage'
import ProgressPage from './pages/ProgressPage'
import { getDailyWords } from './data/dailyPractice'
import './App.css'
import ControlGroupPage from './pages/ControlGroupPage'
import SUSPage from './pages/SUSPage'
import BaselineTestPage from './pages/BaselineTestPage'
import ImmediatePostTestPage from './pages/ImmediatePostTestPage'
import DelayedPostTestPage from './pages/DelayedPostTestPage'



const dailyCategory = {
  id: 'daily',
  name: 'Daily Practice',
  kazakh: 'Күнделікті жаттығу',
  icon: '🌿',
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [dailyWords, setDailyWords] = useState([])
  const [quizAttempt, setQuizAttempt] = useState(0)

  function navigate(page) {
    if (page === 'daily') {
      startDailyPractice()
      return
    }

    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  function selectCategory(category) {
    setDailyWords([])
    setSelectedCategory(category)
    navigate('flashcards')
  }

  
function startDailyPractice() {
  const selectedWords = getDailyWords()

  console.log('Daily words count:', selectedWords.length)
  console.log('First daily word:', selectedWords[0])

  setDailyWords(selectedWords)
  setSelectedCategory(dailyCategory)
  setCurrentPage('flashcards')
  window.scrollTo(0, 0)
}


  function openQuiz() {
    setQuizAttempt((previous) => previous + 1)
    navigate('quiz')
  }

  function saveQuizResult(result) {
    try {
      const previous = JSON.parse(
        localStorage.getItem('qazaqlearn-quiz-results') || '[]'
      )

      const results = Array.isArray(previous)
        ? previous
        : []

      localStorage.setItem(
        'qazaqlearn-quiz-results',
        JSON.stringify([...results, result])
      )
    } catch (error) {
      console.error('Could not save quiz result:', error)
    }
  }

  if (currentPage === 'home') {
    return <HomePage onNavigate={navigate} />
  }

  if (currentPage === 'categories') {
    return (
      <CategoriesPage
        onBack={() => navigate('home')}
        onSelectCategory={selectCategory}
      />
    )
  }

  if (currentPage === 'flashcards' && selectedCategory) {
    return (
      <FlashcardsPage
        key={selectedCategory.id}
        category={selectedCategory}
        sessionWords={
          selectedCategory.id === 'daily'
            ? dailyWords
            : undefined
        }
        onBack={() => navigate('categories')}
        onFinish={openQuiz}
      />
    )
  }

  if (currentPage === 'quiz' && selectedCategory) {
    return (
      <QuizPage
        key={`${selectedCategory.id}-${quizAttempt}`}
        category={selectedCategory}
        sessionWords={
          selectedCategory.id === 'daily'
            ? dailyWords
            : undefined
        }
        onBack={() => navigate('categories')}
        onComplete={saveQuizResult}
      />
    )
  }

  if (currentPage === 'progress') {
    return (
      <ProgressPage
        onBack={() => navigate('home')}
        onCategories={() => navigate('categories')}
      />
    )
  }


if (currentPage === 'control-group') {
  return (
    <ControlGroupPage
      onBack={() => navigate('home')}
    />
  )
}


if (currentPage === 'sus') {
  return (
    <SUSPage
      onBack={() => navigate('home')}
    />
  )
}


if (currentPage === 'baseline-test') {
  return (
    <BaselineTestPage
      onBack={() => navigate('home')}
    />
  )
}

if (currentPage === 'immediate-post-test') {
  return (
    <ImmediatePostTestPage
      onBack={() => navigate('home')}
    />
  )
}

if (currentPage === 'delayed-post-test') {
  return (
    <DelayedPostTestPage
      onBack={() => navigate('home')}
    />
  )
}




  return <HomePage onNavigate={navigate} />
}

export default App
