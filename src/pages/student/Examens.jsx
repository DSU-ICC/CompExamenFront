import { useContext, useEffect, useState } from 'react'
import ExamenList from '../../components/student/ExamenList'
import { useFetching } from '../../hooks/useFetching'
import { useParams } from 'react-router-dom'
import ExamenService from '../../api/ExamenService'
import { AuthContext } from '../../context'

const Examens = () => {
  const {showToast} = useContext(AuthContext)
  
  const [examens, setExamens] = useState([])
  const urlParams = useParams()
  const [getExamensByStudentId, isExamensLoading, examError] = useFetching(async (studentId) => {
    const response = await ExamenService.getExamensByStudentId(studentId)
    if (response.status == 200) {
      setExamens(response.data)
    } else {
      showToast("error", `Статус ${response.status}`, "Ошибка при получении списка экзаменов!")
    }
  })

  useEffect(() => {
    getExamensByStudentId(urlParams.id)
  }, [])

  return (
   <section className='examens'>
      <div className='container container--smaller'>
        <h1 className='examens__title title'>Экзамены</h1>
        {
          isExamensLoading ? <div>Идет загрузка экзаменов...</div> : <ExamenList examens={examens} studentId={urlParams.id} />
        }
      </div>
   </section>
  )
}

export default Examens