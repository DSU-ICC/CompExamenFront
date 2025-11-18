import ExamenItemUko from './ExamensItemUko'
import { isStartExamen } from '../../utils/date'
import ExamensItemArchiveUko from './ExamensItemArchiveUko'

const ExamensListArchiveUko = ({ examens }) => {
  const examensActive = examens.filter(e => isStartExamen(new Date(e.examDate))).sort((a, b) => new Date(b.examDate) - new Date(a.examDate))
  const examensNotActive = examens.filter(e => !isStartExamen(new Date(e.examDate))).sort((a, b) => new Date(b.examDate) - new Date(a.examDate))

  return (
    <div className='examens-uko'>
      <h1 className='title'>Будущие экзамены</h1>
      <ul className='examens-teacher__list'>
        {
          examensNotActive.map(examen =>
            <ExamensItemArchiveUko key={examen.examenId} examen={examen} />
          )
        }
      </ul>
      <div className="examens-teacher__passed">
        <h2 className='title'>Текущие и пройденные экзамены</h2>
        <ul className='examens-teacher__list'>
          {
            examensActive.map(examen =>
              <ExamensItemArchiveUko key={examen.examenId} examen={examen} />
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default ExamensListArchiveUko