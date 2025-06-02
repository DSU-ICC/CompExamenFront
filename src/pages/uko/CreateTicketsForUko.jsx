import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import { useContext } from 'react'
import { AppContext } from '../../context'
import TicketsForm from '../../components/common/TicketsForm/TicketsForm'

const ticketsFormDefaultValues = {
  tickets: [
    {
      number: 1,
      examenId: 0,
      questions: [
        {
          examTicketId: 0,
          number: 1,
          text: "",
          isDeleted: false
        },
        {
          examTicketId: 0,
          number: 2,
          text: "",
          isDeleted: false
        },
        {
          examTicketId: 0,
          number: 3,
          text: "",
          isDeleted: false
        }
      ],
      isDeleted: false
    }
  ]
}

const CreateTicketsForUko = () => {
  const data = useLocation()
  const examData = data.state

  const redirect = useNavigate()

  const { employeeId } = useContext(AppContext)

  const [createExamen, isExamenLoading] = useFetching(async (examData) => {
    const response = await ExamenService.createExamen(examData)
    if (response.status == 200) {
      alert("Экзамен успешно создан!")
      redirect(`/uko/${employeeId}`)
    }
  })

  const onSubmitForm = (data) => {
    examData.employeeId = employeeId
    examData.tickets = data.tickets
    createExamen(examData)
  }

  return (
    <section className='tickets'>
      <div className="container container--smaller">
        <div className='back-link'>
          <Link to={-1}>
            <svg width="187" height="55" viewBox="0 0 187 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.7451 5.9399C11.3153 2.6184 14.6599 0.5 18.3338 0.5H177C182.247 0.5 186.5 4.7533 186.5 10V45C186.5 50.2467 182.247 54.5 177 54.5H18.3338C14.6599 54.5 11.3153 52.3816 9.7451 49.0601L1.47238 31.5601C0.257292 28.9897 0.257292 26.0103 1.47238 23.4399L5.95204 13.9637L9.7451 5.9399Z" stroke="#0050CF" />
            </svg>
            <span className="back-link__text">Назад</span>
          </Link>
        </div>
        <div className="tickets__inner">
          <h1 className='tickets__title title'>Создание билетов</h1>
          <TicketsForm defaultValues={ticketsFormDefaultValues} backLink={`/uko/${employeeId}`} onSubmit={onSubmitForm} isLoading={isExamenLoading} />
        </div>
      </div>
    </section>
  )
}

export default CreateTicketsForUko