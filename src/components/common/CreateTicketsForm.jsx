import TextArea from '../../components/ui/TextArea'
import Button from '../../components/ui/Button'
import { useForm, Controller } from 'react-hook-form'
import { useLocation, Link } from 'react-router-dom'
import { parsingExamTicket } from '../../utils/tickets'
import { useContext } from 'react'
import { AuthContext } from '../../context'

const CreateTicketsForm = ({ backLink, onSubmit, isLoading }) => {
    const data = useLocation()
    const examData = data.state

    const { control, handleSubmit } = useForm({
        mode: "onSubmit"
    });

    const { employeeId } = useContext(AuthContext)

    const handleSubmitForm = (data) => {
        examData.employeeId = employeeId

        examData.tickets = parsingExamTicket(data.tickets)
        onSubmit(examData)
    }

    return (
        <form className='create-tickets__form' onSubmit={handleSubmit(handleSubmitForm)}>
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
                    <TextArea className={error ? 'error' : ''} onChange={(newValue) => onChange(newValue)} placeholder='Введите вопросы' />
                )}
            />
            <div className='btns'>
                <Button className={`${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                    <span>Создать экзамен</span>
                </Button>
                <Link to={backLink} className='cancel__btn btn'>Отмена</Link>
            </div>
        </form>
    )
}

export default CreateTicketsForm