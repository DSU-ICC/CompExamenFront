import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import { useContext } from 'react'
import { AuthContext } from '../../context'
import EditTicketsForm from '../../components/common/EditTicketsForm'

const EditTicketsForUko = () => {
  const data = useLocation()
  const examData = data.state

  const redirect = useNavigate();

  const { employeeId } = useContext(AuthContext)

  const [editExamen, isEditLoading] = useFetching(async (examData) => {
    const response = await ExamenService.editExamen(examData)

    if (response.status == 200) {
      alert("Экзамен успешно обновлен!")
      redirect(`/uko/${employeeId}`)
    }
  })

  const handleSubmitForm = (tickets) => {
    examData.tickets = tickets
    editExamen(examData)
  }

  return (
    <section className='create-tickets'>
      <div className="container container--smaller">
        <div className="create-tickets__inner">
          <div className='back-link'>
            <Link to={-1}>
                <svg width="187" height="55" viewBox="0 0 187 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.7451 5.9399C11.3153 2.6184 14.6599 0.5 18.3338 0.5H177C182.247 0.5 186.5 4.7533 186.5 10V45C186.5 50.2467 182.247 54.5 177 54.5H18.3338C14.6599 54.5 11.3153 52.3816 9.7451 49.0601L1.47238 31.5601C0.257292 28.9897 0.257292 26.0103 1.47238 23.4399L5.95204 13.9637L9.7451 5.9399Z" stroke="#0050CF" />
                </svg>
                <span className="back-link__text">Назад</span>
            </Link>
          </div>
          <h1 className='create-tickets__title title'>Редактирование билетов</h1>
          <EditTicketsForm examData={examData} backLink={`/uko/${employeeId}`} onSubmit={handleSubmitForm} isLoading={isEditLoading} />
        </div>
      </div>
    </section>
  )
}

export default EditTicketsForUko