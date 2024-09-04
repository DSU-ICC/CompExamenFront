import { useContext, useEffect, useState } from 'react'
import StudentScoreList from '../../components/teacher/StudentScoreList'
import { AuthContext } from '../../context'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import { getExamenSeason, getExamenYears } from '../../utils/statement'
import {formatDate} from '../../utils/date'
import Button from '../../components/ui/Button'
import { printElement } from '../../utils/print'

const ExamenResults = () => {
  const { employeeId } = useContext(AuthContext)
  const { id } = useParams()
  const data = useLocation()
  const { course, group, deptName, examenName, examDate } = data.state

  const [studentsScore, setStudentsScore] = useState([])
  const [getStudentsScore, isScoreLoading, scoreError] = useFetching(async (examenId) => {
    const response = await ExamenService.getStudentsByExamenId(examenId)

    if (response.status == 200) {
      setStudentsScore(response.data)
    }
  })

  useEffect(() => {
    getStudentsScore(id)
  }, [])

  return (
    <section className='examen-results'>
      <div className="container">
        <div className="examen-results__statement statement">
          <div className="statement__header statement-header">
            <div className="statement-header__data">
              <span className='statement-header__data-item statement-header__data-item_study-year'><strong>Учебный год</strong></span>
              <span className='statement-header__data-item statement-header__data-item_years'><strong>{getExamenYears()}</strong></span>
              <span className='statement-header__data-item statement-header__data-item_season'>{getExamenSeason(examDate)}</span>
            </div>
            <div className="statement-header__captions">
              <h1 className="statement-header__title"><strong>МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ</strong></h1>
              <h2 className="statement-header__subtitle"><strong>Дагестанский государственный университет</strong></h2>
            </div>
          </div>
          <div className="statement__body statement-body">
            <ul className="statement-body__list">
              <li className="statement-body__item statement-info">
                <p className='statement-info__name'><strong>Факультет/институт:</strong></p>
                <p className='statement-info__value'>{studentsScore[0]?.faculty?.facName}</p>
              </li>
              <li className="statement-body__item statement-info">
                <p className='statement-info__name'><strong>Направление/специальность:</strong></p>
                <p className='statement-info__value'>{deptName}</p>
              </li>
              <li className="statement-body__item statement-info">
                <p className='statement-info__name'><strong>Курс:</strong></p>
                <p className='statement-info__value'>{course}</p>
              </li>
              <li className="statement-body__item statement-info">
                <p className='statement-info__name'><strong>Группа:</strong></p>
                <p className='statement-info__value'>{group}</p>
              </li>
              <li className="statement-body__item statement-info">
                <p className='statement-info__name'><strong>Дисциплина:</strong></p>
                <p className='statement-info__value'>{examenName}</p>
              </li>
              <li className="statement-body__item statement-info">
                <p className='statement-info__name'><strong>Преподаватель:</strong></p>
                <p className='statement-info__value'>{studentsScore[0]?.fioTeacher}</p>
              </li>
              <li className="statement-body__item statement-info">
                <p className='statement-info__name'><strong>Дата проведения:</strong></p>
                <p className='statement-info__value'>{formatDate(new Date(examDate))}</p>
              </li>
            </ul>
          </div>
          <div className="statement__table">
            <table>
              <thead>
                <tr>
                  <th>№<br/>п/п</th>
                  <th>ФИО</th>
                  <th>Баллы</th>
                  <th>Начало</th>
                  <th>Конец</th>
                </tr>
              </thead>
              <tbody>
                {
                  !isScoreLoading
                  &&
                    studentsScore.map((student, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{`${student.firstName} ${student.lastName} ${student.patr}`}</td>
                        <td>{(student.answerBlank != null && student.answerBlank?.totalScore != null) ? student.answerBlank.totalScore : " - "}</td>
                        <td>{(student.answerBlank != null && student.answerBlank?.createDateTime != null) ? formatDate(new Date(student.answerBlank.createDateTime)) : " - "}</td>
                        <td>{(student.answerBlank != null && student.answerBlank?.endExamenDateTime != null) ? formatDate(new Date(student.answerBlank.endExamenDateTime)) : " - "}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="examen-results__container container container--smaller">
        <div className='back-link'>
          <Link to={`/teacher/examens/${employeeId}`}>
              <svg width="187" height="55" viewBox="0 0 187 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.7451 5.9399C11.3153 2.6184 14.6599 0.5 18.3338 0.5H177C182.247 0.5 186.5 4.7533 186.5 10V45C186.5 50.2467 182.247 54.5 177 54.5H18.3338C14.6599 54.5 11.3153 52.3816 9.7451 49.0601L1.47238 31.5601C0.257292 28.9897 0.257292 26.0103 1.47238 23.4399L5.95204 13.9637L9.7451 5.9399Z" stroke="#0050CF" />
              </svg>
              <span className="back-link__text">Экзамены</span>
          </Link>
        </div>
        <div className="examen-results__body">
          <h1 className='examen-results__title title'>{examenName}</h1>
          <div className="examen-results__data data">
            <span className='data__stage'>{`${course} курс ${group} группа`}</span>
            <span className='data__department'>{deptName}</span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <Button onClick={() => printElement(".statement")}>Распечатать ведомость</Button>
          </div>
          {isScoreLoading ? <div className='loader'>Идет загрузка результатов...</div> : <StudentScoreList deptName={deptName} scores={studentsScore} />}
        </div>
      </div>
    </section>
  )
}

export default ExamenResults