import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userAuthenticated: false,
    adminAuthenticated: false
};

const counterSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setUserAuthenticated(state,action) {
            state.userAuthenticated = action.payload;
        },
        setAdminAuthenticated(state,action) {
            state.adminAuthenticated = action.payload;
        } 
    },
});

export const { setUserAuthenticated, setAdminAuthenticated } = counterSlice.actions;

export default counterSlice.reducer;
