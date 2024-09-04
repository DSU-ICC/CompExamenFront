import {useState, useRef, useEffect } from 'react'
import {formatTime} from '../../utils/time'

const Countdown = ({seconds, onTimeOver}) => {
  const [countdown, setCountdown] = useState(seconds > 0 ? seconds : 0)
  const timerId = useRef()

  useEffect(() => {
    
    timerId.current = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      clearInterval(timerId.current)
      onTimeOver && onTimeOver()
    }
  }, [countdown])

  return (
    <div className='countdown'>
      <span className='countdown__message'>До окончания экзамена: </span>
      <span className='countdown__time'>{formatTime(countdown)}</span>
    </div>
  )
}

export default Countdown