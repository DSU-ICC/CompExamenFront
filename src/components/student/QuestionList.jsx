import QuestionItem from './QuestionItem'

const QuestionList = ({ examenAnswers, questions, onUpdate }) => {

  const getAnswerQuestionById = (id) => {
    if (examenAnswers) {
      let textAnswer = examenAnswers.find(ans => ans.questionId == id)?.textAnswer
      if (textAnswer != null) {
        return textAnswer
      } else {
        return ''
      } 
    } else {
      return ''
    }
  }     
    
  return (
    <>
      <ul className='questions__list'>
        {
          questions.map(question =>
            <QuestionItem 
              key={question.id} 
              question={question} 
              answer={getAnswerQuestionById(question.id)} 
              onChange={(questionAnswer) => onUpdate(question.id, questionAnswer)}
            />
          )
        }
      </ul>
    </>
  )
}

export default QuestionList