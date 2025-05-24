import { Link } from 'react-router-dom'
import { formatDate, isStartExamen } from '../../utils/date'
import Button from '../ui/Button'
import { useContext } from 'react'
import { UkoContext } from '../../context'

const ExamenItemUko = ({ examen }) => {
  const { setExamenId, setModalDeleteConfirmActive, setModalCopyActive } = useContext(UkoContext)

  let dateExamen = ''
  let dateNow = new Date()
  let dateTimeExamen = new Date(examen.examDate)

  if (dateNow.getDate() == dateTimeExamen.getDate() && dateNow.getMonth() == dateTimeExamen.getMonth()) {
    let minutes = dateTimeExamen.getMinutes() 
    dateExamen = `Сегодня в ${dateTimeExamen.getHours()}:${minutes > 9 ? minutes : "0" + minutes}` 
  } else {
    dateNow.setDate(dateNow.getDate() + 1)
    if (dateNow.getDate() == dateTimeExamen.getDate() && dateNow.getMonth() == dateTimeExamen.getMonth()) {
      let minutes = dateTimeExamen.getMinutes()
      dateExamen = `Завтра в ${dateTimeExamen.getHours()}:${minutes > 9 ? minutes : "0" + minutes}` 
    } else {
      dateExamen = formatDate(new Date(examen.examDate))
    }
  }

  return (
    <li className={`examens__item examens-item${!isStartExamen(new Date(examen.examDate)) ? ' examens__item--disable' : (isStartExamen(new Date(examen.examDate)) && examen.endExamDate != null) ? ' examens__item--passed' : ''}`}>
      <span className='examens-item__date'>{dateExamen}</span>
      <div className='examens-item__data data'>
        <span className='data__stage'>{`${examen.course} курс ${examen.group} группа`}</span>
        <span className='data__department'>{examen.department.deptName}</span>
      </div>
      <div className="examens-item__btns">
        {
          (isStartExamen(new Date(examen.examDate)) && examen.endExamDate == null)
          ? <div className='discipline-btn'>{examen.discipline}</div>
          : <Link to={`/uko/examen-results/${examen.examenId}`} state={ { course: examen.course, group: examen.group, deptName: examen.department.deptName, examenName: examen.discipline, examDate: examen.examDate } } className='discipline-btn'>{examen.discipline}</Link>
        }
        {
          <>
            <Link to='/uko/edit-examen' state={examen.examenId} title="Изменить экзамен" className='edit-examen btn'></Link>
            <Button onClick={() => {
              setExamenId(examen.examenId)
              setModalDeleteConfirmActive(true)
            }} title="Удалить экзамен" className='delete-examen'></Button>
            <Button onClick={() => {
              setExamenId(examen.examenId)
              setModalCopyActive(true)
            }} className='copy-examen' title="Создать пересдачу"></Button>
          </>
        }
      </div>
    </li>
  )
}

export default ExamenItemUko