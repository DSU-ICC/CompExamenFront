const AnswerList = ({ questions, answers }) => {
  const getAnswerTextByQuestionId = (questionId) => {
    let answer = answers.find(ans => ans.questionId == questionId)
    return answer.textAnswer
  }

  const isExistAnswer = (questionId) => {
    let answer = answers.find(ans => ans.questionId == questionId)
    if (answer) {
      return true
    } else {
      return false
    }
  }

  return (
    <ul className='answers-check__list'>
      {
        questions.map(question => {
         if (isExistAnswer(question.id)) {
          return (
            <li key={question.id} className='answers-check__item answers-item'>
              <div className="answers-item__wrapper">
                <span className='answers-item__number'>Вопрос №{question.number}</span>
                <p className="answers-item__text">
                  {question.text}
                </p>
              </div>
              <div className="answers-item__wrapper">
                <span className='answers-item__number answers-item__number-answer'>Ответ №{question.number}</span>
                <p className="answers-item__text">
                  {getAnswerTextByQuestionId(question.id)}
                </p>
              </div>
            </li>
          )
         }
        }  
        )
      }
    </ul>

  )
}

export default AnswerList