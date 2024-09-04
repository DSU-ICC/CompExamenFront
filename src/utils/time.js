export const formatTime = (time) => {
    let hours = Math.floor(time / 3600)
    let minutes = Math.floor((time - hours * 3600) / 60)
    let seconds = Math.floor((time - hours * 3600) - minutes * 60)

    if (minutes < 10) minutes = '0' + minutes
    if (seconds < 10) seconds = '0' + seconds

    if (hours > 0) {
        hours = '0' + hours + ':'
    } else {
        hours = '00:'
    }

    return hours + minutes + ':' + seconds 
}

export const convertMinutesToSeconds = (minutes) => minutes * 60