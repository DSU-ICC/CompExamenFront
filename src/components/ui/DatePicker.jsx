import { forwardRef, useState } from 'react'
import ReactDatePicker from 'react-datepicker' 
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css'

const DatePicker = forwardRef(({ onChange, value, showTimeSelect = true, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const onChangeDate = (newDate) => {
    if (!newDate) {
      onChange(null)
      return
    }

    if (!showTimeSelect) {
      onChange(new Date(newDate.setHours(0, 0, 0)))
      return
    }

    onChange(newDate)
  }

  return (
    <div className={`datepicker-wrapper${isOpen ? ' open' : ''}`}>
        <ReactDatePicker 
            locale={ru}
            showIcon
            ref={ref}
            showTimeSelect={showTimeSelect}
            selected={value}
            className='datepicker'
            dateFormat={showTimeSelect ? 'dd.MM.yyyy HH:mm' :'dd.MM.yyyy'}
            timeCaption='Время'
            timeIntervals={15}
            onChange={onChangeDate}      
            onCalendarOpen={() => setIsOpen(true)}
            onCalendarClose={() => setIsOpen(false)}
            
            {...props}
        />
    </div>
  )
})

export default DatePicker