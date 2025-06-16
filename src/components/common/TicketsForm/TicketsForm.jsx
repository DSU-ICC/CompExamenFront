
import Button from '../../ui/Button'
import { useForm, useFieldArray } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AppContext } from '../../../context'
import TicketQuestions from './TicketQuestions'

const TicketsForm = ({ defaultValues, backLink, onSubmit, isLoading }) => {
    const { control, handleSubmit, reset } = useForm({
        mode: "onSubmit",
        defaultValues
    });

    useEffect(() => {
        reset(defaultValues)
    }, [defaultValues])

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "tickets"
    })

    const {showToast} = useContext(AppContext)

    const handleRemoveTicket = (ticketIndex) => {
        remove(ticketIndex)

        const currentTickets = control._formValues.tickets
        currentTickets.forEach((t, idx) => {
            // Если номер не совпадает с индексом, обновляем его номер
            if (t.number !== idx + 1) {
                update(idx, { ...t, number: idx + 1 });
            }
        });
    }

    const handleAddTicket = () => {
        append({
            number: fields.length + 1,
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
        })
    }

    const onErrors = () => {
        showToast("error", "Некоторые поля вопросов не заполнены")
    }

    return (
        <form className='tickets-form form' onSubmit={handleSubmit(onSubmit, onErrors)}>
            <ul className='tickets-form__list tickets-list'>
                {
                    fields.map((field, index) => (
                        <li key={field.id} className='tickets-list__item ticket-item'>
                            <div className='ticket-item__number'>Билет №{field.number}</div>
                            <TicketQuestions onEmpty={() => handleRemoveTicket(index)} ticketIndex={index} control={control} />
                            <div className="ticket-item__actions">
                                <Button type="button" onClick={() => handleRemoveTicket(index)} className="ticket-item__remove">
                                    Удалить билет
                                </Button>
                                {index == fields.length - 1 && <Button type="button" onClick={handleAddTicket} className='tickets-form__add-ticket'>Добавить билет</Button>}
                            </div>
                        </li>
                    ))
                }
            </ul>
            <div className="tickets-form__btns">
                <Button className={`${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                    <span>Сохранить</span>
                </Button>
                <Link to={backLink} className='cancel__btn btn'>Отмена</Link>
            </div>
        </form>
    )
}

export default TicketsForm