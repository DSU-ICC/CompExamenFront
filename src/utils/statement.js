export const getExamenYears = () => {
    const currentYear = new Date().getFullYear()
    return `${currentYear - 1}-${currentYear}`
}

export const getExamenSeason = (examDate) => {
    const currentMonth = new Date(examDate).getMonth()
    const winterMonths = [11, 0, 1]
    return winterMonths.includes(currentMonth) ? "Зимняя сессия" : "Летняя сессия"
}