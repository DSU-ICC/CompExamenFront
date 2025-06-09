import { useFieldArray, Controller } from "react-hook-form";
import Button from "../../ui/Button";
import TextEditor from "../../ui/TextEditor/TextEditor";

const TicketQuestions = ({ ticketIndex, control, onEmpty }) => {
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: `tickets.${ticketIndex}.questions`
    });

    const handleRemoveQuestion = (questionIndex) => {
        remove(questionIndex)

        const currentQuestions = control._formValues.tickets[ticketIndex].questions
        if (currentQuestions == 0) {
            onEmpty()
            return
        }

        currentQuestions.forEach((q, idx) => {
            // Если номер не совпадает с индексом, обновляем его номер
            if (q.number !== idx + 1) {
                update(idx, { ...q, number: idx + 1 });
            }
        });

        
    }

    const handleAddQuestion = () => {
        append({
            examTicketId: 0,
            number: fields.length + 1,
            text: "",
            isDeleted: false
        })
    }

    return (
        <>
            <ul className="ticket-item__questions ticket-questions">
                {
                    fields.map((field, index) => (
                        <li key={field.id} className='ticket-questions__item ticket-question'>
                            <div className='form__label'>
                                <span className='form__text'>Вопрос №{field.number}</span>
                                <Controller
                                    control={control}
                                    name={`tickets.${ticketIndex}.questions.${index}.text`}
                                    rules={{
                                        required: true
                                    }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <div className="ticket-question__control">
                                            <TextEditor value={value} onChange={onChange} />
                                            <Button onClick={() => handleRemoveQuestion(index)} type="button" className="ticket-question__remove">Удалить</Button>
                                        </div>
                                    )}
                                />
                                {
                                    index == fields.length - 1
                                    &&
                                    <Button type="button" onClick={handleAddQuestion} className='ticket-question__add'>
                                        Добавить вопрос
                                    </Button>
                                }
                            </div>
                        </li>
                    ))
                }
            </ul>

        </>
    )
}

export default TicketQuestions