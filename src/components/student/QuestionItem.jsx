import { useState } from 'react'
import TextArea from '../ui/TextArea'

const QuestionItem = ({ question, answer }) => {
  const [textAnswer, setTextAnswer] = useState(answer)

  return (
    <li className='questions__item questions-item'>
        <span className='questions-item__number'>Вопрос №{question.number}</span>
        <div className="questions-item__body">
            <div className="questions-item__inner">
                <p className="questions-item__text" onCopy={(evt) => evt.preventDefault()}>
                    {question.text}
                </p>
                <TextArea onPaste={(evt) => evt.preventDefault() } onChange={(evt) => setTextAnswer(evt.target.value)} className='questions-item__answer-text' value={textAnswer} />
            </div>
        </div>
    </li>
  )
}

export default QuestionItem