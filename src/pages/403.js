import React from 'react'
import { useDispatch } from 'react-redux';
import Header from '../components/Header'
import { toggleLogin } from '../Redux/Slices/AuthSlice';

const Forbidden = () => {
    const dispatch = useDispatch();
    return (
        <>
            <Header />
            <div className='forbidden'>
                <h1>403</h1>
                <h5>Access forbidden</h5>
                <button className='btn btn-primary' onClick={() => {
                    dispatch(toggleLogin('Logout'));
                }}>Go back</button>
            </div>
        </>
    )
}

export default Forbidden