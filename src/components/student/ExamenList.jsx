import { useContext, useState } from 'react'
import ExamenItem from './ExamenItem'
import Popup from '../ui/Popup'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import { AuthContext } from '../../context'

const ExamenList = ({ examens, studentId }) => {
  const {showToast} = useContext(AuthContext)

  const [modalActive, setModalActive] = useState(false)
  const [examenId, setExamenId] = useState(null)
  const redirect = useNavigate()

  const [startExamen, isStartLoading, startError] = useFetching(async (studentId, examenId) => {
    const response = await ExamenService.startExamen(studentId, examenId)

    if (response.status == 200) {
      let startExamenData = response.data

      let discipline = examens.find(e => e.examenId == examenId)?.discipline
    
      redirect(`/examen/${examenId}`, {
        state: {...startExamenData, discipline}
      })
    } else {
      showToast("error", `Статус ${response.status}`, response.data)
    }
  })

  return (
    <>
      <ul className='examens__list'>
        {
          examens.map(examen =>
            <ExamenItem onClick={() => { setExamenId(examen.examenId); setModalActive(true)}} key={examen.examenId} examen={examen} />
          )
        }
      </ul>
      <Popup active={modalActive} setActive={setModalActive}>
        <h2 className="popup__title title">Вы действительно хотите начать экзамен?</h2>
        <div className="confirm-buttons">
          <Button onClick={() => startExamen(studentId, examenId)} className={`confirm-button confirm-button--yes${isStartLoading ? ' loading' : ''}`}><span>Да</span></Button>
          <Button className="confirm-button confirm-button--no" onClick={() => setModalActive(false)}>Нет</Button>
        </div>
      </Popup>
    </>
  )
}

export default ExamenList