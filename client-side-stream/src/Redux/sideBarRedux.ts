import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    width: window.innerWidth,
    height: window.innerHeight
};

const counterSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setSceenWidth(state, action) {
            state.width = action.payload;
        },
        setScreenHeight(state, action) {
            state.height = action.payload;
        }
    },
});

export const { setSceenWidth, setScreenHeight } = counterSlice.actions;

export default counterSlice.reducer;
