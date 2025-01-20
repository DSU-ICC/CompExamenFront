import { useContext, useEffect, useState } from 'react'
import Countdown from '../../components/ui/Countdown'
import QuestionList from '../../components/student/QuestionList'
import Button from '../../components/ui/Button'
import Popup from '../../components/ui/Popup'
import { useFetching } from '../../hooks/useFetching'
import { useLocation, useNavigate } from 'react-router-dom'
import AnswerBlankService from '../../api/AnswerBlankService'
import { AuthContext } from '../../context'
import { TIME_TO_AUTOSAVE_IN_MINUTES } from '../../utils/constants'


const Examen = () => {
  const { showToast } = useContext(AuthContext)
  let autoSaveDate = new Date(localStorage.getItem("timeToAutoSaveInMinutes"))

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
    localStorage.removeItem("timeToAutoSaveInMinutes")

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

  const getStudentAnswers = () => {
    const newAnswers = []

    const textFields = document.querySelectorAll("textarea")
    textFields.forEach(textField => {
      const questionId = textField.dataset.questionId
      const fieldValue = textField.value.trim() || null

      const answer = examenAnswers.find(e => e.questionId == questionId)
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

  const hanldeChangeTime = async () => {
    if (isAnswersLoading || isSaveLoading) {
      return
    }

    const dateNow = new Date()
    if (dateNow >= autoSaveDate) {
      const newExamData = { ...examenData }
      newExamData.answers = getStudentAnswers()
      newExamData.examTicket = null

      await AnswerBlankService.updateAnswerBlank(newExamData)
      autoSaveDate.setMinutes(autoSaveDate.getMinutes() + TIME_TO_AUTOSAVE_IN_MINUTES)
      localStorage.setItem("timeToAutoSaveInMinutes", autoSaveDate)
    }
  }

  // const onChangeAnswer = (questionId, questionAnswer) => {
  //   const answer = examenAnswers.find(e => e.questionId == questionId)

  //   if (answer) {
  //     setExamenAnswers(prevState =>
  //       prevState.map(item =>
  //         item.questionId === questionId
  //           ? { ...item, textAnswer: questionAnswer }
  //           : item
  //       )
  //     )
  //   } else {
  //     setExamenAnswers([...examenAnswers, {
  //       id: 0,
  //       studentId: examenData.studentId,
  //       questionId,
  //       answerBlankId: examenData.id,
  //       textAnswer: questionAnswer,
  //       isDeleted: false
  //     }])
  //   }
  // }

  const saveAnswers = (isEndExamen = false) => {
    const newExamData = { ...examenData }
    newExamData.answers = getStudentAnswers()
    newExamData.examTicket = null
    saveAnswerBlank(newExamData, isEndExamen)
  }

  return (
    <>
      <section className='examen'>
        <div className='container container--smaller'>
          <div className="examen__head">
            <h1 className="examen__title title">{examenData.discipline}</h1>
            {!isAnswersLoading && <Countdown onChange={hanldeChangeTime} onTimeOver={() => { showToast("info", "Время экзамена истекло!", ""); saveAnswers(true) }} seconds={timeToEnd} />}
          </div>
          <div className="examen__questions questions">
            {!isAnswersLoading && <QuestionList examenAnswers={examenAnswers} questions={examenData.examTicket.questions} />}
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