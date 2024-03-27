import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FormSignIn,
  FormSignUp,
  FormUpdateUser,
  UserInfo,
} from "../types/auth";
import { request } from "@/shared/axios";
import { getRoute } from "@/shared/helpers/route";

export const signIn = createAsyncThunk<void, FormSignIn>(
  "auth/sign-in",
  async (credentials) => {
    return request({
      url: getRoute("auth/sign-in"),
      method: "POST",
      data: credentials,
    });
  }
);

export const signUp = createAsyncThunk<void, FormSignUp>(
  "auth/sign-up",
  async (credentials) => {
    return request({
      url: getRoute("auth/sign-up"),
      method: "POST",
      data: credentials,
    });
  },
  {
    serializeError: (error: any) => {
      return {
        code: error?.errorCode,
        message: error?.message,
      };
    },
  }
);

export const getCurrentUser = createAsyncThunk<UserInfo>(
  "auth/user-info",
  async () => {
    return request({
      url: getRoute("auth/user-info"),
      method: "GET",
    });
  }
);

export const updateUser = createAsyncThunk<UserInfo, FormUpdateUser>(
  "auth/update-user-info",
  async (data) => {
    return request({
      url: getRoute("auth/user-info"),
      method: "PATCH",
      data,
    });
  }
);
