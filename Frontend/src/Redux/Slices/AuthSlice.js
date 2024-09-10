import { createSlice } from '@reduxjs/toolkit';

const loadFromSessionStorage = () => {
  const username = sessionStorage.getItem('username') || '';
  const mobileno = sessionStorage.getItem('mobileno') || 0;
  return { username, mobileno };
};

const initialState = loadFromSessionStorage();

export const AuthSlice = createSlice({
  name: "userinfo",
  initialState,
  reducers: {
    setUservalue: (state, action) => {
      state.username = action.payload.username;
      state.mobileno = action.payload.mobileno;
      sessionStorage.setItem('username', action.payload.username);
      sessionStorage.setItem('mobileno', action.payload.mobileno);
    },
    logout: (state) => {
      state.username = '';
      state.mobileno = 0;
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('mobileno');
    },
  }
});

export const { setUservalue, logout } = AuthSlice.actions;

export const selectUsername = (state) => state.userinfo.username;
export const selectMobileno = (state) => state.userinfo.mobileno;

export default AuthSlice.reducer;
