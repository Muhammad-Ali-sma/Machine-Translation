import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        popup: {
            type: '',
            message: ''
        }
    },
    reducers: {
        setNotification(state, action) {
            state.popup = action.payload
        },            
    }
})

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;