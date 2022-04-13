import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from './axios-instance';
import { Credentials } from "./models";

export const login = createAsyncThunk(
  'account/login',
  async (credentials: Credentials) => {
    const response = await instance({
      method: 'POST',
      url: 'api/account/login',
      data: credentials
    });

    return response.data;
  }
)

const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
}

const accountSlice = createSlice({
  name: 'account',
  initialState: { authenticated: isAuthenticated() },
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem('access_token');
      state.authenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem('access_token', action.payload.access_token);
      state.authenticated = true;
    })
  }
})

export const selectAuthenticated = store => store.account.authenticated;
export const { logout } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;