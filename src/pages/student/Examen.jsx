import { useContext, useEffect, useState } from 'react'
import Countdown from '../../components/ui/Countdown'
import QuestionList from '../../components/student/QuestionList'
import Button from '../../components/ui/Button'
import Popup from '../../components/ui/Popup'
import { useFetching } from '../../hooks/useFetching'
import { useLocation, useNavigate } from 'react-router-dom'
import AnswerBlankService from '../../api/AnswerBlankService'
import { AuthContext } from '../../context'


const Examen = () => {
  const {showToast} = useContext(AuthContext)
  
  const [modalActive, setModalActive] = useState(false)
  const [examenAnswers, setExamenAnswers] = useState(null)
  const [timeToEnd, setTimeToEnd] = useState(915)

  const startExamenData = useLocation()
  const examenData = startExamenData.state

  const redirect = useNavigate()

  const [getAnswers, isAnswersLoading, answersError] = useFetching(async (answerBlankId) => {
    const response = await AnswerBlankService.getAnswerBlankById(answerBlankId)

    if (response.status == 200) {
      setExamenAnswers(response.data.answerBlank.answers)
      setTimeToEnd(response.data.timeToEndInSeconds)
    } else {
      showToast("error", `Статус ${response.status}`, "Ошибка при получении бланка ответов!")
    }
  })

  const [saveAnswerBlank, isSaveLoading, saveAnsError] = useFetching(async (answerBlank, isEndExamen = false) => {
    const response = await AnswerBlankService.updateAnswerBlank(answerBlank)

    if (response.status == 200) {
      if (!isEndExamen) {
        showToast("success", 'Статус 200', "Ответы сохранены!")
        getAnswers(examenData.id)
      } else {
        endExamen(examenData.id)
      }
    } else {
      showToast("error", `Статус ${response.status}`, "Ошибка при сохранении ответов!")
    }
  })

  const [endExamen, isEndLoading, endError] = useFetching(async (answerBlankId) => {
    const response = await AnswerBlankService.endExamenForStudent(answerBlankId)

    if (response.status == 200) {
      showToast("success", `Статус 200`, "Ответы сохранены!")
      showToast("success", `Статус 200`, "Экзамен завершен успешно!")
      redirect(`/examens/${examenData.studentId}`)
    } else {
      showToast("error", `Статус ${response.status}`, "Ошибка при завершении экзамена!")
    }
  })

  useEffect(() => {
    getAnswers(examenData.id)
  }, [])

  const saveAnswers = (isEndExamen = false) => {
    let questionItems = document.querySelectorAll(".questions-item")
    let newAnswers = []
    for (let i = 0; i < questionItems.length; i++) {
      let numberQuestionBlock = questionItems[i].querySelector(".questions-item__number")
      if (!numberQuestionBlock) {
        showToast("error", "Ошибка при формировании списка ответов", `Не найден номер вопроса при парсинге ${i + 1}-го блока вопросов билета!`)
        return;
      }

      let numberQuestion = parseInt(numberQuestionBlock.textContent.split("№")[1])
      let question = examenData.examTicket.questions.find(q => q.number == numberQuestion)
      if (!question) {
        showToast("error", "Ошибка при формировании списка ответов", `Вопрос с таким номером (${numberQuestion}) нет в бланке ответов!`)
        return;
      }
      let questionAnswer = questionItems[i].querySelector("textarea").value

      const answer = examenAnswers.find(e => e.questionId == question.id)
      if (answer) {
        answer.textAnswer = questionAnswer
        newAnswers.push(answer)
      } else {
        if (questionAnswer.trim().length > 0) {
          let newAnswer = {
            id: 0,
            studentId: examenData.studentId,
            questionId: question.id,
            answerBlankId: examenData.id,
            textAnswer: questionAnswer,
            isDeleted: false
          }
          newAnswers.push(newAnswer)
        }
      }
    }

    const newExamData = {...examenData}
    newExamData.answers = newAnswers
    newExamData.examTicket = null
    saveAnswerBlank(newExamData, isEndExamen)
  }

  return (
    <>
      <section className='examen'>
        <div className='container container--smaller'>
          <div className="examen__head">
            <h1 className="examen__title title">{examenData.discipline}</h1>
            {!isAnswersLoading && <Countdown onTimeOver={() => { showToast("info", "Время экзамена истекло!", ""); saveAnswers(true)}} seconds={timeToEnd} />}
          </div>
          <div className="examen__questions questions">
            {!isAnswersLoading && <QuestionList isStop={isEndLoading} onUpdate={() => getAnswers(examenData.id)} studentId={examenData.studentId} answerBlank={examenData} examenAnswers={examenAnswers} questions={examenData.examTicket.questions} />}
          </div>
          <Button className={isSaveLoading ? "loading" : ""} onClick={() => saveAnswers()}><span>Сохранить ответы</span></Button>
          <div className="examen__bottom">
            <Button className='examen__btn' onClick={() => setModalActive(true)}>Завершить экзамен</Button>
            {!isAnswersLoading && <Countdown seconds={timeToEnd} />}
          </div>
        </div>
      </section>
      <Popup active={modalActive} setActive={setModalActive}>
        {!isAnswersLoading && <Countdown seconds={timeToEnd} />}
        <h2 className="popup__title title">Вы действительно хотите завершить экзамен?</h2>
        <div className="confirm-buttons">
          <Button onClick={() => saveAnswers(true)} className={`confirm-button confirm-button--yes${isEndLoading ? ' loading' : ''}`}><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={() => setModalActive(false)}>Нет</Button>
        </div>
      </Popup>
    </>
  )
}

export default Examen