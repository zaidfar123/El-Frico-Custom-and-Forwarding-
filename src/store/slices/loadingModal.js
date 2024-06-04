import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hasImage: false,
    open: false,
    description : "",
    button : false,
    buttonAction : null
};

// ==============================|| SLICE - SNACKBAR ||============================== //

const loadingModal = createSlice({
    name: 'loadingModal',
    initialState,
    reducers: {
        openLoader(state, action) {
            const { open, hasImage, description,button,buttonAction } = action.payload;

            state.open = open || initialState.open;
            state.hasImage = hasImage || initialState.hasImage;
            state.description = description || initialState.description;
            state.button = button || initialState.button;
            state.buttonAction = buttonAction || initialState.buttonAction;
        },

        closeLoader(state) {
            state.open =  initialState.open;
            state.hasImage =  initialState.hasImage;
            state.description = initialState.description;
            state.button = initialState.button;
            state.buttonAction = initialState.buttonAction;
        }
    }
});

export default loadingModal.reducer;

export const { closeLoader, openLoader } = loadingModal.actions;
