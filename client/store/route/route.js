import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current_route: null,
};

const slice = createSlice({
  name: "current_route",
  initialState: initialState,
  reducers: {
    current_route: (state, action) => {
      state.current_route = action.payload.current_route;
    },
  },
});

export const { reducer: routeReducer, actions: routeActions } = slice;
