import { createAsyncThunk } from "@reduxjs/toolkit"
import { FormSignIn, FormSignUp, UserInfo } from "../types/auth"
import { request, requestAuthenticated } from "@/shared/axios"
import { getRoute } from "@/shared/helpers/route"

export const signIn = createAsyncThunk<void, FormSignIn>(
  'auth/sign-in',
  async (credentials) => {
    return request({
      url: getRoute('auth/sign-in'),
      method: 'POST',
      data: credentials,
    })
  }
)

export const signUp = createAsyncThunk<void, FormSignUp>(
  'auth/sign-up',
  async (credentials) => {
    return request({
      url: getRoute('auth/sign-up'),
      method: 'POST',
      data: credentials,
    })
  }
)

export const getCurrentUser = createAsyncThunk<UserInfo>(
  'auth/user-info',
  async () => {
    return requestAuthenticated({
      url: getRoute('auth/user-info'),
      method: 'GET',
    })
  }
)
