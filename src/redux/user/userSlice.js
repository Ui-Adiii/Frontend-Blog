import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  currentUser:null,
  error: null,
  loading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      (state.loading = true), (state.error = false);
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signInOut: (state) => {
      state.loading = false;
      state.loading = false;
      state.currentUser = null;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      (state.currentUser = null), (state.error = action.payload);
    },
    deleteStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    deleteSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signoutSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
    signoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  signInOut,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteStart,
  deleteFailure,
  deleteSuccess,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} = userSlice.actions;

export default userSlice.reducer;