import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryAppearanceState: false, // Consistent naming
};

export const categoryAppearanceSlice = createSlice({
  name: 'categoryAppearance',
  initialState,
  reducers: {
    setCategoryAppearance: (state, action) => {
      state.categoryAppearanceState = action.payload;
    },
  },
});


export const { setCategoryAppearance } = categoryAppearanceSlice.actions;


export const selectCategoryAppearance = (state) => state.categoryAppearance.categoryAppearanceState;

export default categoryAppearanceSlice.reducer;
