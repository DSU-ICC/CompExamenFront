import { forwardRef, useState } from 'react'
import ReactDatePicker from 'react-datepicker' 
import 'react-datepicker/dist/react-datepicker.css'
import ru from 'date-fns/locale/ru';

const DatePicker = forwardRef(({ onChange, value, showTimeSelect = true }, ref) => {
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
        />
    </div>
  )
})

export default DatePicker