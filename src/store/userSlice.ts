import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { User } from "utils/types";
import { db, firebaseSignout } from "configs/firebase";
import { Rootstate } from "./store";

interface InitialState {
  status: "loading" | "successfull" | "failed" | "idle";
  user: User | null;
  error: string | null;
}

const initialState: InitialState = {
  status: "loading",
  user: null,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = "successfull";
    },
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      firebaseSignout();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserInfo.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.status = "successfull";
          state.user = action.payload;
        }
      )
      .addCase(fetchUserInfo.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      });
  },
});

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (args: { uid: string; email: string }) => {
    const docRef = doc(db, "userdetails", args.uid);
    const response = await getDoc(docRef);
    const userdetails = {
      ...response.data(),
      email: args.email,
      id: args.uid,
    } as User;
    return userdetails;
  }
);

export const { logout, login } = userSlice.actions;

export const selectUser = (state: Rootstate) => state.user.user;
export const selectUserApiStatus = (state: Rootstate) => state.user.status;

export const userReducer = userSlice.reducer;
