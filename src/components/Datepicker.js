import React, { useRef } from 'react'
import { Calendar } from 'react-feather'

const Datepicker = (props) => {
    const dateRef = useRef();
    const handleOnKeyPress = (key) => {
        if (key.keyCode === 13 || key.keyCode === 32) {
            dateRef.current?.showPicker()
        }
      }
    return (
        <>
            <input
                className="custom-field"
                type="text"
                tabIndex={'1'}
                onBlur={props.onBlur}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onFocus={() => dateRef.current?.showPicker()}
            />
            <Calendar tabIndex={'1'} aria-label={`Choose ${props.placeholder} Button`} className='calendarIcon' style={{ width: 20, height: 20 }} onClick={() => dateRef.current?.showPicker()} onKeyDown={(e) => handleOnKeyPress(e)} />
            <input
                ref={dateRef}
                className='hidden-date-field'
                type={'date'}
                onChange={props.onChange}
            />
        </>
    )
}

export default Datepicker