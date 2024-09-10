import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itemCount: 0, // Corrected typo here
};

export const ItemCountSlice = createSlice({
  name: 'itemcount',
  initialState,
  reducers: {
    setItemCount: (state, action) => {
      state.itemCount = action.payload; // Corrected typo here
    },
  },
});

export const { setItemCount } = ItemCountSlice.actions;

export const selectItemCount = (state) => state.itemcount.itemCount; // Corrected typo here

export default ItemCountSlice.reducer;
