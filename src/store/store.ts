import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import { userReducer } from "features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type Rootstate = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<Rootstate> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
