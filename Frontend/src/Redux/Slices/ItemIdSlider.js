import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itemID: 0, // Initial state with itemID set to 0
};

export const itemIDSlice = createSlice({
  name: 'itemID',
  initialState,
  reducers: {
    // Action to set the itemID
    setItemID: (state, action) => {
      state.itemID = action.payload; // Update state with the payload
    },
  },
});

// Exporting the action creator setItemID
export const { setItemID } = itemIDSlice.actions;

// Selector to get the itemID from the state
export const selectItemID = (state) => state.itemID.itemID;

// Exporting the reducer to be used in the store
export default itemIDSlice.reducer;
