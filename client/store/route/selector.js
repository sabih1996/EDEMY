import { createSelector } from "@reduxjs/toolkit";

const selectDomain = (state) => state.route;

export const selectCurrentRoute = createSelector(
  selectDomain,
  (route) => route.current_route
);
