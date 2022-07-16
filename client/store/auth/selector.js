import { createSelector } from "@reduxjs/toolkit";

const selectDomain = (state) => state.auth;

export const selectToken = createSelector(
  selectDomain,
  (auth) => auth.access_token
);

export const selectUser = createSelector(selectDomain, (auth) => auth.user);
