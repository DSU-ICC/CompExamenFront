export const parsingExamTicket = (ticketsFromTextArea) => {
    let ticketsArr = ticketsFromTextArea.split("\n\n")
    let tickets = []

    ticketsArr.forEach(ticket => {
      const ticketData = ticket.split("\n")
      const ticketNumber = parseInt(ticketData[0].split("№")[1])
      const ticketQuestions = ticketData.splice(1, ticketData.length - 1)
      
      let questionsItems = []
      ticketQuestions.forEach(question => {
        const questionData = question.split(" - ")
        const numberQuestion = parseInt(questionData[0].substring(1))
        const questionText = questionData[1]
        
        let questionObj = {
            id: 0,
            examTicketId: 0,
            number: numberQuestion,
            text: questionText,
            isDeleted: false
        }

        questionsItems.push(questionObj)
      })

      let ticketObj = {
        id: 0,
        number: ticketNumber,
        examenId: 0,
        questions: questionsItems,
        isDeleted: false
      }

      tickets.push(ticketObj)
    })

    return tickets
}

export const getTicketsForInput = (tickets) => {
  let ticketsRes = []

  if (tickets != null) {
    tickets.forEach(ticket => {
      let ticketStr = `Билет №${ticket.number}\n`
      let questions = []
  
      ticket.questions.forEach(question => {
        let questionStr = `№${question.number} - ${question.text}`
        questions.push(questionStr)
      })
  
      ticketStr += questions.join("\n")
      ticketsRes.push(ticketStr)
    })
  
    return ticketsRes.length > 0 ? ticketsRes.join("\n\n") : ''
  } else {
    return ''
  }
}

export const editTickets = (ticketsFromTextArea, ticketsFromExamen) => {
  let ticketsArr = ticketsFromTextArea.split("\n\n")
  let examenId = ticketsFromExamen[0]?.examenId
  let tickets = []

  ticketsArr.forEach((ticket, index) => {
    const ticketData = ticket.split("\n")
    const ticketNumber = parseInt(ticketData[0].split("№")[1])
    const ticketQuestions = ticketData.splice(1, ticketData.length - 1)
    
    let questionsItems = []
    ticketQuestions.forEach((question, idx) => {
      const questionData = question.split(" - ")
      const numberQuestion = parseInt(questionData[0].substring(1))
      const questionText = questionData[1]

      let questionObj = {
          id: ticketsFromExamen[index]?.questions[idx]?.id ?? 0,
          examTicketId: ticketsFromExamen[index]?.questions[idx]?.examTicketId ?? 0,
          number: numberQuestion,
          text: questionText,
          isDeleted: false
      }

      questionsItems.push(questionObj)
    })

    let ticketObj = {
      id: ticketsFromExamen[index]?.id ?? 0,
      number: ticketNumber,
      examenId: examenId ?? 0,
      questions: questionsItems,
      isDeleted: false
    }

    tickets.push(ticketObj)
  })

  return tickets
}