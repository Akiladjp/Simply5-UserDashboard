import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menubuttonState: false, // Corrected typo here
};

export const MenuButtonSlice = createSlice({
  name: 'menuButton',
  initialState,
  reducers: {
    setMenuButtonState: (state, action) => {
      state.menubuttonState = action.payload; // Corrected typo here
    },
  },
});

export const { setMenuButtonState } = MenuButtonSlice.actions;

export const selectMenuButtonState = (state) => state.menuButton.menubuttonState; // Corrected typo here

export default MenuButtonSlice.reducer;
