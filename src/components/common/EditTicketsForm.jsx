import TextArea from '../ui/TextArea'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import TicketService from '../../api/TicketService'
import QuestionService from '../../api/QuestionService'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context'

const EditTicketsForm = ({ backLink, onSubmit, isLoading, ticketsData }) => {
  const data = useLocation()
  const examData = data.state

  const redirect = useNavigate();

  const { employeeId } = useContext(AuthContext)

  const [tickets, setTickets] = useState(ticketsData)
  const [questionIdLoading, setQuestionLoadingId] = useState(null)
  const [ticketIdLoading, setTicketIdLoading] = useState(null)

  const [deleteQuestion, isDeleteQuestionLoading, questionErr] = useFetching(async (id) => {
    const response = await QuestionService.deleteQuestion(id)

    if (response.status == 200) {
      alert("Вопрос успешно удален!")
      setQuestionLoadingId(null)
    }
  })

  const [deleteTicket, isDeleteTicketLoading, ticketErr] = useFetching(async (id) => {
    const response = await TicketService.deleteTicket(id)

    if (response.status == 200) {
      alert("Билет успешно удален!")
      setTicketIdLoading(null)
    }
  })

  const handleSubmit = () => {
    let isFormValid = validateQuestions()

    if (isFormValid) {
      examData.employeeId = employeeId
      examData.tickets = tickets
      onSubmit(examData)
    } else {
      alert("Некоторые поля вопросов не заполнены!")
    }
  }

  const validateQuestions = () => {
    let isValid = true

    let questionsTextArea = document.querySelectorAll(".textarea")
    questionsTextArea.forEach(questionArea => {
      if (questionArea.value == '') {
        isValid = false
        questionArea.classList.add("error")
      } else {
        questionArea.classList.remove("error")
      }
    })

    return isValid
  }

  const appendQuestion = (ticketId, numberQuestion) => {
    const newQuestion = {
      id: 0,
      examTicketId: ticketId,
      number: numberQuestion + 1,
      text: '',
      isDeleted: false
    }

    let newTickets = tickets.map(ticket => {
      if (ticket.id == ticketId) {
        let questions = ticket.questions
        questions.push(newQuestion)
        return {
          ...ticket, questions: questions
        }
      } else {
        return ticket
      }
    })

    setTickets(newTickets)
    //добавить в состояние
  }

  const removeQuestion = (questionId, numberTicket, numberQuestion) => {
    if (questionId != 0) {
      deleteQuestion(questionId)
    }

    let newTickets = tickets
    newTickets = newTickets.map(ticket => {
      if (ticket.number == numberTicket) {
        let questions = ticket.questions.filter(q => q.number != numberQuestion)
        return {
          ...ticket, questions: questions
        }
      } else {
        return ticket
      }
    })

    newTickets = newTickets.map(ticket => {
      if (ticket.number == numberTicket) {
        let questions = ticket.questions.map((question, index) => {
          return {
            ...question, number: index + 1
          }
        })
        return {
          ...ticket, questions: questions
        }
      } else {
        return ticket
      }

    })

    setTickets(newTickets)
  }

  const changeQuestionText = (ticketId, numberQuestion, newText) => {
    let newTickets = tickets.map(ticket => {
      if (ticket.id == ticketId) {
        let questions = ticket.questions.map(question => {
          if (question.number == numberQuestion) {
            return {
              ...question, text: newText
            }
          } else {
            return question
          }
        })
        return {
          ...ticket, questions: questions
        }
      } else {
        return ticket
      }
    })

    setTickets(newTickets)
  }

  const appendTicket = (examenId, numberTicket) => {
    const newTicket = {
      id: 0,
      number: numberTicket + 1,
      examenId: examenId,
      questions: [
        {
          id: 0,
          examTicketId: 0,
          number: 1,
          text: '',
          isDeleted: false
        },
        {
          id: 0,
          examTicketId: 0,
          number: 2,
          text: '',
          isDeleted: false
        },
        {
          id: 0,
          examTicketId: 0,
          number: 3,
          text: '',
          isDeleted: false
        }
      ],
      isDeleted: false
    }

    setTickets([...tickets, newTicket])
  }

  const removeTicket = (ticketId, numberTicket) => {
    if (ticketId != 0) {
      deleteTicket(ticketId)
    }

    let newTickets = tickets
    newTickets = newTickets.filter(t => t.number != numberTicket)
    newTickets = newTickets.map((ticket, idx) => {
      return {
        ...ticket, number: idx + 1
      }
    })

    setTickets(newTickets)
  }

  return (
    <ul className='create-tickets__list'>
      {
        tickets.map((ticket, index) =>
          <li key={index} className='create-tickets__item ticket-item'>
            <div className="ticket-item__body">
              <div className='ticket-item__number'>
                <span style={{ fontSize: "24px" }} >Билет №</span>
                <Input style={{ width: "100px" }} disabled={true} value={index + 1} />
              </div>
              <div className='ticket-item__question'>
                {
                  ticket.questions.map((question, idx) =>
                    <div style={{ display: "flex" }} key={idx}>
                      <div style={{ display: "flex" }}>
                        <span style={{ fontSize: "24px" }}>№</span>
                        <Input style={{ width: "122px", height: "40px" }} disabled={true} value={idx + 1} />
                      </div>
                      <div style={{ width: "100%" }}>
                        <TextArea onChange={(evt) => changeQuestionText(ticket.id, question.number, evt.target.value)} style={{ height: "200px" }} placeholder='Введите вопросы' value={question.text} />
                        <div style={{ display: "flex", gap: "20px" }}>
                          {
                            ticket.questions.length !== 1 && <Button type="button" className={`ticket-item__remove${(isDeleteQuestionLoading && questionIdLoading == question.id) ? ' loading' : ''}`} onClick={() => { setQuestionLoadingId(question.id); removeQuestion(question.id, ticket.number, question.number) }}>Удалить вопрос</Button>
                          }
                          {
                            ticket.questions.length - 1 == idx && <Button type="button" className='ticket-item__add' onClick={() => appendQuestion(ticket.id, ticket.questions.length)}>Добавить вопрос</Button>
                          }
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
            <div className='btns'>
              {
                tickets.length !== 1 && <Button type="button" className={`ticket-item__remove${(isDeleteTicketLoading && ticketIdLoading == ticket.id) ? ' loading' : ''}`} onClick={() => { setTicketIdLoading(ticket.id); removeTicket(ticket.id, ticket.number) }}>Удалить билет</Button>
              }
            </div>
          </li>
        )
      }
      <div className='btns'>
        <Button onClick={() => appendTicket(examData.id, tickets.length)} className='ticket-item__add'>Добавить билет</Button>
        <Button onClick={() => handleSubmit()} className={`${isLoading ? 'loading' : ''}`} disabled={isLoading}>
          <span>Завершить редактирование</span>
        </Button>
        <Button onClick={() => redirect(backLink)} className='cancel__btn btn'>Отмена</Button>
      </div>
    </ul>
  )
}

export default EditTicketsForm