import React from 'react'
import { Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../Redux/Slices/NotificationSlice';

const MessageInfo = () => {
    const Popup = useSelector(state => state.notification.popup);
    const dispatch = useDispatch();

    return (
        <>
            <div className='position-absolute message-box-top' aria-atomic="true" aria-live='polite'>
                {Popup?.message !== '' &&
                    <Alert style={{ width: 'auto' }} variant={Popup?.type} onClose={() => dispatch(setNotification({ message: '', type: '' }))} dismissible>
                        <Alert.Heading style={{ fontSize: '14px' }}>{Popup?.message}</Alert.Heading>
                    </Alert>
                }
            </div>
        </>
    )
}

export default MessageInfo