import TextArea from '../../components/ui/TextArea'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useFetching } from '../../hooks/useFetching'
import ExamenService from '../../api/ExamenService'
import TicketService from '../../api/TicketService'
import QuestionService from '../../api/QuestionService'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context'

const EditTicketsForm = () => {
  const data = useLocation()
  const examData = data.state

  const redirect = useNavigate();

  const { employeeId } = useContext(AuthContext)

  const [tickets, setTickets] = useState([])
  const [questionIdLoading, setQuestionLoadingId] = useState(null)
  const [ticketIdLoading, setTicketIdLoading] = useState(null)

  const [editExamen, isExamenLoading, examError] = useFetching(async (examData) => {
    const response = await ExamenService.editExamen(examData)

    if (response.status == 200) {
      alert("Экзамен успешно обновлен!")
      redirect(`/uko/${employeeId}`)
    }
  })

  const [getTickets, isTicketsLoading, ticketsErr] = useFetching(async (examenId) => {
    const response = await TicketService.getTicketsByExamenId(examenId)

    if (response.status == 200) {
      setTickets(response.data)
    }
  })

  useEffect(() => {
      getTickets(examData.id)
    }, []
  )

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

  const onSubmit = () => {
    let isFormValid = validateQuestions()

    if (isFormValid) {
      examData.employeeId = employeeId
      examData.tickets = tickets
      editExamen(examData)
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
    const newQuestion =  {
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
          {
            isTicketsLoading ? <div className='loader'>Идет загрузка билетов экзамена...</div>
            :
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
                            <div style={{ display: "flex"}} key={idx}>
                              <div style={{ display: "flex" }}>
                                <span style={{ fontSize: "24px" }}>№</span>
                                <Input style={{ width: "122px", height: "40px" }} disabled={true} value={idx + 1} />
                              </div>
                              <div style={{ width: "100%" }}>
                                <TextArea onChange={(evt) => changeQuestionText(ticket.id, question.number, evt.target.value)} style={{ height: "200px" }} placeholder='Введите вопросы' value={question.text} />
                                <div style={{ display: "flex", gap: "20px" }}>
                                  {
                                    ticket.questions.length !== 1 && <Button type="button" className={`ticket-item__remove${(isDeleteQuestionLoading && questionIdLoading == question.id) ? ' loading': ''}`} onClick={() => { setQuestionLoadingId(question.id); removeQuestion(question.id, ticket.number, question.number)  }}>Удалить вопрос</Button>
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
                <Button onClick={() => onSubmit()} className={`${isExamenLoading ? 'loading' : ''}`} disabled={isExamenLoading}>
                  <span>Завершить редактирование</span>
                </Button>
                <Button onClick={() => redirect(`/teacher/examens/${employeeId}`)} className='cancel__btn btn'>Отмена</Button>
              </div>
            </ul>
          }
        </div>
      </div>
    </section>
  )
}

export default EditTicketsForm