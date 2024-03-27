import { AuthResponse, UserInfo } from "@/provider/redux/types/auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCurrentUser, signIn, signUp } from "../thunk/auth.thunk";
import { STORAGE_KEYS } from "@/shared/constants";
import authenticationSession from "@/shared/authenticationSession";
import { signOut } from "next-auth/react";

interface AuthState {
  userInfo: null | UserInfo["info"];
  openModal: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  loading: false,
  userInfo: null,
  openModal: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOpenModalLogin(state, payload: PayloadAction<boolean>) {
      state.openModal = payload.payload;
    },
    logout(state) {
      state.userInfo = null;
      authenticationSession.clearAuthentication();
      if (typeof window !== "undefined") {
        signOut({
          callbackUrl: "/home",
          redirect: false,
        });
      }
    },
    setPaymentSetting(
      state,
      payload: PayloadAction<UserInfo["info"]["payment_setting"]>
    ) {
      if (state.userInfo) {
        state.userInfo.payment_setting = payload.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state, action) => {
      state.loading = true;
    }),
      builder.addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as unknown as AuthResponse;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refresh_token);
      });
    builder.addCase(signUp.pending, (state, action) => {
      state.loading = true;
    }),
      builder.addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as unknown as AuthResponse;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refresh_token);
      }),
      builder.addCase(getCurrentUser.pending, (state, action) => {
        state.loading = true;
      }),
      builder.addCase(getCurrentUser.fulfilled, (state, action) => {
        const payload = action.payload as unknown as UserInfo;
        state.userInfo = payload.info;
      });
  },
});

export const { setOpenModalLogin, logout, setPaymentSetting } =
  authSlice.actions;
export default authSlice;
