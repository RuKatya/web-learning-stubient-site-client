import { createSlice } from '@reduxjs/toolkit';

import { IAuthState } from '../types';

import { regThunk, loginThunk, loginOutThunk, checkUserCookies } from './authAPI';

const initialState = {
  user: {
    userName: '',
    userRole: 'user',
    isLogin: false,
  },
  message: '',
  status: 'idle',
  continueWork: false,
} as IAuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessageContinueWork(state) {
      state.message = '';
      state.continueWork = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(regThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(regThunk.fulfilled, (state, { payload: { message, continueWork } }) => {
        state.status = 'idle';
        state.message = message ? message : '';
        state.continueWork = continueWork ? continueWork : false;
      })
      .addCase(regThunk.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.message = payload ? payload : '';
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginThunk.fulfilled, (state, { payload: { continueWork, userRole, userName } }) => {
        state.status = 'idle';
        state.continueWork = continueWork;
        state.user = {
          ...state.user,
          isLogin: true,
          userRole: userRole,
          userName: userName,
        };
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.message = payload ? payload : '';
      })
      .addCase(loginOutThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginOutThunk.fulfilled, (state, { payload: { continueWork, isLogin } }) => {
        // console.log('login', continueWork, isLogin);
        state.status = 'idle';
        state.continueWork = continueWork;
        state.user = {
          isLogin: isLogin,
          userRole: 'user',
          userName: '',
        };
      })
      .addCase(loginOutThunk.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.message = payload ? payload : '';
      })
      .addCase(checkUserCookies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkUserCookies.fulfilled, (state, { payload: { continueWork, isLogin, userName, userRole } }) => {
        state.status = 'idle';
        state.continueWork = continueWork;
        state.user = {
          isLogin,
          userRole,
          userName,
        };
      })
      .addCase(checkUserCookies.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.message = payload ? payload : '';
      });
  },
});

export const { clearMessageContinueWork } = authSlice.actions;
export const thunk = { regThunk, loginThunk, loginOutThunk, checkUserCookies };

export default authSlice.reducer;
