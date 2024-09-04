export const formatDate = (date) => {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    let minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
    return `${dd}.${mm}.${yy} ${date.getHours()}:${minutes}`
}

export const parsingDate = (str) => {
    let arr = str.split(" ")
    let dateStr = arr[0]
    let timeStr = arr[1]

    let dateArr = dateStr.split(".")
    let day = parseInt(dateArr[0])
    let month = parseInt(dateArr[1])
    let year = parseInt(dateArr[2])

    let timeArr = timeStr.split(":")
    let hours = parseInt(timeArr[0])
    let minutes = parseInt(timeArr[1])

    return new Date(year, month - 1, day, hours, minutes)
}

export const diffBetweenDatesInSeconds = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    const diffSeconds = Math.floor(diffTime / 1000); 
    return diffSeconds
}

export const diffBetweenDatesInDays = (date1, date2) => {
    const diffTime = date1.getTime() - date2.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays
}

export const isStartExamen = (dateExamen) => {
    return dateExamen.getTime() <= new Date().getTime()
}