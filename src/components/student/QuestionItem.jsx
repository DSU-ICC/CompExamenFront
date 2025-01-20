import { useEffect, useState } from 'react'
import TextArea from '../ui/TextArea'

const QuestionItem = ({ question, answer }) => {
  const [text, setText] = useState(answer)

  return (
    <li className='questions__item questions-item'>
        <span className='questions-item__number'>Вопрос №{question.number}</span>
        <div className="questions-item__body">
            <div className="questions-item__inner">
                <p className="questions-item__text" onCopy={(evt) => evt.preventDefault()}>
                    {question.text}
                </p>
                <TextArea onPaste={(evt) => evt.preventDefault() } data-question-id={question.id} className='questions-item__answer-text' defaultValue={answer} />
            </div>
        </div>
    </li>
  )
}

export default QuestionItem