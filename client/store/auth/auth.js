import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
  user: null,
};

const slice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.access_token = action.payload.token;
      state.user = action.payload.user;
    },
    signUp: (state, action) => {
      state.user = action.payload.user;
      state.access_token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
    },
    becomeInstructor: (state) => {
      let i = state;
      i.user.role.splice(0, 1, "Instructor");
    },
  },
});

export const { reducer: authReducer, actions: authActions } = slice;
