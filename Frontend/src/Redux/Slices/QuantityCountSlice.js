import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  quantityCount: 0,
  checkCount: false,
};

export const quantityCountSlice = createSlice({
  name: 'quantityCount',
  initialState,
  reducers: {
    setQuantityCount: (state, action) => {
      state.quantityCount = action.payload;
    },
    setCheckCount: (state, action) => {
      state.checkCount = action.payload;
    },
  },
});

export const { setQuantityCount, setCheckCount } = quantityCountSlice.actions;

export const selectQuantityCount = (state) => state.quantityCount.quantityCount;
export const selectCheckCount = (state) => state.quantityCount.checkCount;

export default quantityCountSlice.reducer;
