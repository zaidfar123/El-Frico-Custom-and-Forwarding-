import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    model : [],
};

// ==============================|| SLICE - assignScreen ||============================== //

const assignScreen = createSlice({
    name: 'assignScreen',
    initialState,
    reducers: {
        getAssignedScreen(state, action) {
            const { model} = action.payload;
            state.model = model || initialState.model;
        },
        assignedScreen(state, action) {
            const { model } = action.payload;
            state.model = model || initialState.model;
        },
    }
});

export default assignScreen.reducer;

export const { getAssignedScreen,assignedScreen } = assignScreen.actions;
