import AnswerList from '../../components/teacher/AnswerList'
import Input from '../../components/ui/Input'
import { Link, useLocation } from 'react-router-dom'

const StudentAnswers = () => {
  const data = useLocation()
  const studentData = data.state

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
        </div>
        <div className="answers-check__body">
          <h1 className='answers-check__title title'>{studentData.answerBlank.examTicket.examen.discipline}</h1>
          <div className="answers-check__data data">
            <span className='data__stage'>{`${studentData.answerBlank.examTicket.examen.course} курс ${studentData.answerBlank.examTicket.examen.nGroup} группа`}</span>
            <span className='data__department'>{studentData.deptName}</span>
            <span className='data__teacher'>{`Преподаватель: ${studentData.fioTeacher}`}</span>
            <span className='data__student'>{`Студент: ${studentData.firstName} ${studentData.lastName} ${studentData.patr}`}</span>
          </div>
          <AnswerList questions={studentData.answerBlank.examTicket.questions} answers={studentData.answerBlank.answers} />

          <div className='answers-check__bottom'>
            <div className='answers-check__score'>
              <p className='answers-check__score-label'>Выставленные баллы</p>
              <Input className='answers-check__score-input' disabled={true} value={studentData.answerBlank.totalScore} />
            </div>         
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default StudentAnswers