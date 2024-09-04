import ExamenItemUko from './ExamensItemUko'
import { isStartExamen } from '../../utils/date'


const ExamensListUko = ({ examens }) => {
  const examensActive = examens.filter(e => isStartExamen(new Date(e.examDate)))
  const examensNotActive = examens.filter(e => !isStartExamen(new Date(e.examDate)))

  return (
    <>
      <h1 className='title'>Будущие экзамены</h1>
      <ul className='examens-teacher__list'>
        {
          examensNotActive.map(examen =>
            <ExamenItemUko key={examen.examenId} examen={examen} />
          )
        }
      </ul>
      <div className="examens-teacher__passed">
        <h2 className='title'>Текущие и пройденные экзамены</h2>
        <ul className='examens-teacher__list'>
          {
            examensActive.map(examen =>
              <ExamenItemUko key={examen.examenId} examen={examen} />
            )
          }
        </ul>
      </div>
    </>
  )
}

export default ExamensListUko