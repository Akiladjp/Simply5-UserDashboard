import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mainpageState: true, // Corrected typo here
};

export const MainPageSlice = createSlice({
  name: 'mainpage',
  initialState,
  reducers: {
    setMainpageState: (state, action) => {
      state.mainpageState = action.payload; // Corrected typo here
    },
  },
});

export const { setMainpageState } = MainPageSlice.actions;

export const selectMainpageState = (state) => state.mainpage.mainpageState; // Corrected typo here

export default MainPageSlice.reducer;
