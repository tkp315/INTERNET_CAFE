"use client"
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice"; 
import serviceReducer from "./slices/services.slice";
import FilterReducer from "./slices/filteration.slice"; 



export const store = configureStore({
  reducer: {
    user: userReducer, 
    services:serviceReducer,
    filter:FilterReducer

  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;