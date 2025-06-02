import { useContext, useEffect, useState, useRef } from 'react'
import Countdown from '../../components/ui/Countdown'
import QuestionList from '../../components/student/QuestionList'
import Button from '../../components/ui/Button'
import Popup from '../../components/ui/Popup'
import { useFetching } from '../../hooks/useFetching'
import { useLocation, useNavigate } from 'react-router-dom'
import AnswerBlankService from '../../api/AnswerBlankService'
import { AppContext } from '../../context'
import { TIME_TO_AUTOSAVE_IN_MINUTES } from '../../utils/constants'


const Examen = () => {
  const { showToast } = useContext(AppContext)
  const autoSaveTimerId = useRef()
  const saveBtnRef = useRef(null)

  const [modalActive, setModalActive] = useState(false)
  const [examenAnswers, setExamenAnswers] = useState([])
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
    clearInterval(autoSaveTimerId.current)

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

  useEffect(() => {  
    autoSaveTimerId.current = setInterval(() => {
      if (isAnswersLoading || isSaveLoading) {
        return
      }
  
      saveBtnRef.current.click()
    }, TIME_TO_AUTOSAVE_IN_MINUTES * 60000)

    return () => clearInterval(autoSaveTimerId.current)
  }, [])

  const getStudentAnswers = (currentExamenAnswers) => {
    const newAnswers = []

    const textFields = document.querySelectorAll("textarea")
    textFields.forEach(textField => {
      const questionId = parseInt(textField.dataset.questionId)
      const fieldValue = textField.value.trim() || null
      const answer = currentExamenAnswers.find(e => e.questionId == questionId)

      if (answer) {
        newAnswers.push({ ...answer, textAnswer: fieldValue })
      } else {
        if (fieldValue) {
          let newAnswer = {
            id: 0,
            studentId: examenData.studentId,
            questionId,
            answerBlankId: examenData.id,
            textAnswer: fieldValue,
            isDeleted: false
          }
          newAnswers.push(newAnswer)
        }
      }
    })

    return newAnswers
  }

  const saveAnswers = (examenAnswers, isEndExamen = false) => {
    const newExamData = { ...examenData }
    newExamData.answers = getStudentAnswers(examenAnswers)
    newExamData.examTicket = null
    saveAnswerBlank(newExamData, isEndExamen)
  }

  return (
    <>
      <section className='examen'>
        <div className='container container--smaller'>
          <div className="examen__head">
            <h1 className="examen__title title">{examenData.discipline}</h1>
            {!isAnswersLoading && <Countdown onTimeOver={() => { showToast("info", "Время экзамена истекло!", ""); saveAnswers(examenAnswers, true) }} seconds={timeToEnd} />}
          </div>
          <div className="examen__questions questions">
            {!isAnswersLoading && <QuestionList examenAnswers={examenAnswers} questions={examenData.examTicket.questions} />}
          </div>
          <Button ref={saveBtnRef} className={isSaveLoading ? "loading" : ""} onClick={() => saveAnswers(examenAnswers)}><span>Сохранить ответы</span></Button>
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
          <Button onClick={() => saveAnswers(examenAnswers, true)} className={`confirm-button confirm-button--yes${isEndLoading ? ' loading' : ''}`}><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={() => setModalActive(false)}>Нет</Button>
        </div>
      </Popup>
    </>
  )
}

export default Examen