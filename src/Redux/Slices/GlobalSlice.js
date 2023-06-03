import { createSlice } from '@reduxjs/toolkit'

export const globalSlice = createSlice({
    name: 'global',
    initialState: {
        activeTab: "text",
        sourceLanguage: [],
        targetLanguages: [],
        taskStatus: [],
        rework: null,
        clone: null,
    },
    reducers: {
        toggleTab(state, action) {
            state.activeTab = action.payload
        },
        addSourceLanguage(state, action) {
            state.sourceLanguage = action.payload
        },
        addTargetLanguage(state, action) {
            state.targetLanguages = action.payload
        },
        setRework(state, action) {
            state.rework = action.payload
        },
        setClone(state, action) {
            state.clone = action.payload
        },
        setTaskStatus(state, action) {
            state.taskStatus = action.payload
        }
    }
})

export const { toggleTab, addSourceLanguage, addTargetLanguage, setRework, setClone, setTaskStatus } = globalSlice.actions;
export default globalSlice.reducer;