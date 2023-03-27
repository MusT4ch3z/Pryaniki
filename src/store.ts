import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { userApi, companyApi } from "./services/fetchAPI.api";

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [companyApi.reducerPath]: companyApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat(userApi.middleware, companyApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
