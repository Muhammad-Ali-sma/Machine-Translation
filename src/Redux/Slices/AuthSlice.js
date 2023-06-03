import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: 'Logout',
        user: {
            userName: '',
            role: '',
            accessToken: ''
        }
    },
    reducers: {
        toggleLogin(state, action) {
            state.login = action.payload
        }, 
        setUser(state, action) {
            state.user = action.payload
        },           
    }
})

export const { toggleLogin, setUser } = authSlice.actions
export default authSlice.reducer