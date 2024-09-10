import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  buttonState: false, // Corrected typo here
};

export const AddbuttonSlice = createSlice({
  name: 'addButton',
  initialState,
  reducers: {
    setButtonState: (state, action) => {
      state.buttonState = action.payload; // Corrected typo here
    },
  },
});

export const { setButtonState } = AddbuttonSlice.actions;

export const selectButtonState = (state) => state.addButton.buttonState; // Corrected typo here

export default AddbuttonSlice.reducer;
