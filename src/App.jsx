import React from 'react'
import Quiz from './components/Quiz'
import Homepage from './components/Homepage'

function App() {

  const [start, setStart] = React.useState(false)
  const [quizStyle, setQuizStyle] = React.useState('')

  function handleClick(quizData) {
    setStart(true)
    setQuizStyle(quizData)
  }

  return (
    <div className="container">
      {start ? <Quiz quizStyle={quizStyle} /> : <Homepage handleClick={handleClick} setQuizStyle={setQuizStyle} />}
    </div>
  )
}

export default App
