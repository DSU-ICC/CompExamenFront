import { useState } from 'react'
import Popup from '../../components/ui/Popup'
import Button from '../../components/ui/Button'
import AnswerList from '../../components/teacher/AnswerList'
import Input from '../../components/ui/Input'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import AnswerBlankService from '../../api/AnswerBlankService'

const AnswersCheckTeacher = () => {
  const [totalScore, setTotalScore] = useState(null)
  const [modalActive, setModalActive] = useState(false)
  const data = useLocation()
  const studentData = data.state

  const redirect = useNavigate()
  const [updateAnswerBlank, isUpdateLoading, updateError] = useFetching(async (answerBlank) => {
    const response = await AnswerBlankService.updateAnswerBlank(answerBlank)

    if (response.status == 200) {
      alert("Баллы успешно выставлены!")
      redirect(-1)
    }
  })

  const onSubmit = () => {
    const newAnswerBlank = {
      id: studentData.answerBlank.id,
      studentId: studentData.answerBlank.studentId,
      examTicketId: studentData.answerBlank.examTicketId,
      examTicket: null,
      totalScore: totalScore,
      answers: studentData.answerBlank.answers,
      createDateTime: studentData.answerBlank.createDateTime,
      endExamenDateTime: studentData.answerBlank.endExamenDateTime,
      isDeleted: studentData.answerBlank.isDeleted
    }

    updateAnswerBlank(newAnswerBlank)
  }

  const totalScroreValidate = () => {
    if (totalScore != null) {
      setModalActive(true)
    } else {
      alert("Выставите баллы за экзамен!")
    }
  }

  return (
    <section className='answers-check'>
      <div className="answers-check__container container container--smaller">
        <div className='answer-check__wrapper'>
          <div className="back-link">
          <Link to={-1}>
              <svg width="187" height="55" viewBox="0 0 187 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.7451 5.9399C11.3153 2.6184 14.6599 0.5 18.3338 0.5H177C182.247 0.5 186.5 4.7533 186.5 10V45C186.5 50.2467 182.247 54.5 177 54.5H18.3338C14.6599 54.5 11.3153 52.3816 9.7451 49.0601L1.47238 31.5601C0.257292 28.9897 0.257292 26.0103 1.47238 23.4399L5.95204 13.9637L9.7451 5.9399Z" stroke="#0050CF" />
              </svg>
              <span className="back-link__text">Назад</span>
          </Link>
          </div>
          <div className='answers-check__student answers-check__student--no-checking'>{studentData.studentId}</div>
        </div>
        <div className="answers-check__body">
          <h1 className='answers-check__title title'>{studentData.answerBlank.examTicket.examen.discipline}</h1>
          <div className="answers-check__data data">
            <span className='data__teacher'>{`Преподаватель: ${studentData.fioTeacher}`}</span>
            <span className='data__stage'>{`${studentData.answerBlank.examTicket.examen.course} курс ${studentData.answerBlank.examTicket.examen.nGroup} группа`}</span>
            <span className='data__department'>{studentData.deptName}</span>
          </div>
          <AnswerList questions={studentData.answerBlank.examTicket.questions} answers={studentData.answerBlank.answers} />

          <div className='answers-check__bottom'>
            <div className='answers-check__score'>
              <p className='answers-check__score-label'>Выставить баллы</p>
              <Input className='answers-check__score-input' onChange={(evt) => setTotalScore(parseInt(evt.target.value))} />
            </div>
            <Button className='answers-check__btn' onClick={() => totalScroreValidate()}>Закончить проверку</Button>
          </div>
          
        </div>
      </div>
      <Popup active={modalActive} setActive={setModalActive}>
        <h2 className="popup__title title">Вы действительно хотите закончить проверку?</h2>
        <div className="confirm-buttons">
          <Button onClick={() => onSubmit()} className={`confirm-button confirm-button--yes${isUpdateLoading ? ' loading' : ''}`}><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={() => setModalActive(false)}>Нет</Button>
        </div>
      </Popup>
    </section>
  )
}

export default AnswersCheckTeacher