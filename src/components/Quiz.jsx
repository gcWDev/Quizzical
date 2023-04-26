import React from "react";
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
import Confetti from 'react-confetti'


export default function Quiz(props) {


    //Import form data from the quiz homepage 
    const { trivia_category, trivia_difficulty, trivia_type } = props.quizStyle

    // State for questions data, user's answers, question status, and shuffled options
    const [questions, setQuestions] = React.useState([])
    const [formData, setFormData] = React.useState({})
    const [questionStatus, setQuestionStatus] = React.useState([])
    const [shuffledOptions, setShuffledOptions] = React.useState([]);


    // Fetch questions data when the component mounts
    React.useEffect(() => {

        const url = `https://opentdb.com/api.php?amount=5&category=${trivia_category}&difficulty=${trivia_difficulty}&type=${trivia_type}`

        async function getData() {
            const resp = await fetch(url)
            const data = await resp.json()
            setQuestions(data.results)
        }
        getData(url)

    }, [])

    // Shuffle options for each question when questions data is updated
    React.useEffect(() => {
        if (questions.length > 0) {
            const shuffled = questions.map((question) => {
                const questionOptions = getOptions(question);
                return questionOptions.sort(() => Math.random() - 0.5);
            });
            setShuffledOptions(shuffled);
        }
    }, [questions]);

    // Create quiz elements (questions and options) and footer with a button
    function createElementArr() {
        const elementArr = questions.map((question, questionIndex) => {
            const questionHeading = decodeHtmlEntities(question.question)
            const optionContainer = getOptionContainer(shuffledOptions[questionIndex], questionIndex)
            return (
                <div className="question-container" key={nanoid()} id={nanoid()}>
                    <h6 className="header-question">{questionHeading}</h6>
                    <div className="option-container">
                        {optionContainer}
                    </div>
                    <div className="linebreak"></div>
                </div>
            )
        })
        elementArr.push(
            <div className="footer-container" key={nanoid()}>
                {questionStatus.length > 0 ?
                    <p className="answer-count" key={nanoid()}>{`You scored ${countArr(questionStatus)}/5`}</p>
                    : ''
                }
                <button
                    className={questionStatus.length > 0 ? "play-again-button" : "submit-button"}
                    key={nanoid()}
                    type={questionStatus.length > 0 ? 'submit' : 'button'}
                    onClick={questionStatus.length > 0 ? null : handleSubmit}
                >{questionStatus.length > 0 ? "Play Again" : "Check Answers"}</button>
            </div>
        )
        return elementArr
    }

    // Decode HTML entities in a given text, used for all data in questions var
    function decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    // Extract and combine correct and incorrect options for a question
    function getOptions(question) {
        const newArr = [question.correct_answer]
        question.incorrect_answers.map(option => {
            newArr.push(option)
        })
        return newArr
    }

    // Generate option container elements for a question
    function getOptionContainer(options, questionIndex) {
        if (options && options.length > 0) {
            const newArr = options.map(option => {
                const newOption = decodeHtmlEntities(option)
                const valueStatus = formData[`Q${questionIndex}`] == newOption
                return (
                    <label
                        className={questionStatus.length > 0 ?
                            questionStatus[questionIndex] ?
                                newOption == decodeHtmlEntities(questions[questionIndex].correct_answer) ?
                                    "option-correct" :
                                    'option-unselected'
                                :
                                newOption == decodeHtmlEntities(questions[questionIndex].correct_answer) ?
                                    "option-correct" :
                                    formData[`Q${questionIndex}`] == newOption ?
                                        "option-incorrect" :
                                        "option-unselected"
                            :

                            valueStatus ?
                                "option-selected" :
                                "option"
                        }
                        key={nanoid()}
                    >
                        <input
                            type="radio"
                            value={newOption}
                            name={`Q${questionIndex}`}
                            checked={valueStatus}
                            onChange={handleClick}
                            disabled={questionStatus.length > 0}
                        />
                        <span className="label-text">{newOption}</span>
                    </label>
                )
            })
            return newArr
        }
        return null
    }

    // Count the number of true values in an array
    function countArr(arr) {
        let count = 0;
        arr.map((status) => {
            if (status) {
                count += 1;
            }
        })
        return count;
    }

    // Handle radio button clicks and update formData state
    function handleClick(event) {
        const { value, name } = event.target
        setFormData(prev => {
            return ({
                ...prev,
                [name]: value
            })
        })
    }

    // Check user's answers and update questionStatus state
    function handleSubmit() {
        const newArr = []
        questions.map((question, index) => {
            const selectedVal = formData[`Q${index}`]
            if (selectedVal == decodeHtmlEntities(question.correct_answer)) {
                newArr[index] = true
            } else {
                newArr[index] = false
            }
        })
        setQuestionStatus(newArr)
    }


    // Render the quiz component
    return (
        <div className="test-container">
            {questionStatus.length > 0 && <Confetti colors={['#FFFAD1', '#DEEBF8']} />}
            <form className="quiz-container" >
                {questions.length > 0 ?
                    createElementArr()
                    :
                    <p className="loading-screen">Loading...</p>}
            </form>
        </div>
    )

}