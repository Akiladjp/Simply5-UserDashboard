import {createSlice} from '@reduxjs/toolkit';

const initialState= {
  addCount : 0,
}
export const AddbuttonCountSlice = createSlice({
  name:"addCount",
  initialState,
  reducers:{
    setbuttonCount:(state,action)=>{
      state.addCount = action.payload;
    }
  }
})
export const {setbuttonCount} = AddbuttonCountSlice.actions;
export const selectaddCount = (state) =>state.addCount.addCount;
export default AddbuttonCountSlice.reducer;