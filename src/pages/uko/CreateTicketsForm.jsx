import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import { parsingExamTicket } from '../../utils/tickets'
import { useContext } from 'react'
import { AuthContext } from '../../context'

const CreateTicketsForm = () => {
  const data = useLocation()
  const examData = data.state

  const redirect = useNavigate()

  const { control, handleSubmit } = useForm({
    mode: "onSubmit"
  });

  const { employeeId } = useContext(AuthContext)


  const [createExamen, isExamenLoading, examError] = useFetching(async (examData) => {
    const response = await ExamenService.createExamen(examData)

    if (response.status == 200) {
      alert("Экзамен успешно создан!")
      redirect(`/uko/${employeeId}`)
    }
  })

  const onSubmit = (data) => {
    examData.employeeId = employeeId

    examData.tickets = parsingExamTicket(data.tickets)
    createExamen(examData)
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
          <h1 className='create-tickets__title title'>Создание билетов</h1>
          <form className='create-tickets__form' onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name='tickets'
              rules={{
                required: true,
                pattern: {
                  value: /(Билет №\d\n(№\d - .+\n?){1,}\n?){1,}/gmi,
                  message: "1"
                }
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                //<TextArea onChange={(e) => changeTicket(ticket.number, e.target.value)} placeholder='Введите вопросы' width={400} />
                <TextArea className={error ? 'error' : ''} onChange={(newValue) => onChange(newValue)} placeholder='Введите вопросы' />
              )}
            />
            <div className='btns'>
              <Button className={`${isExamenLoading ? 'loading' : ''}`} disabled={isExamenLoading}>
                <span>Создать экзамен</span>
              </Button>
              <Button onClick={() => redirect(`/teacher/examens/${employeeId}`)} className='cancel__btn btn'>Отмена</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default CreateTicketsForm