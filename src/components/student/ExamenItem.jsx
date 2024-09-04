import { formatDate } from '../../utils/date'

const ExamenItem = ({ examen, onClick }) => {
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
    <li className={`examens__item examens-item${!examen.isActiveNow ? ' examens__item--disable' : (examen.isActiveNow && examen.answerBlank?.endExamenDateTime != null) ? ' examens__item--passed' : ''}`}>
      <span className='examens-item__date'>{dateExamen}</span>
      <button onClick={() => onClick()} className='discipline-btn'>{examen.discipline}</button>
    </li>
  )
}

export default ExamenItem