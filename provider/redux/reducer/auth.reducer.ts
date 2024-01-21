import { AuthResponse, UserInfo } from "@/provider/redux/types/auth"
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from '@reduxjs/toolkit'
import { getCurrentUser, signIn, signUp } from "../thunk/auth.thunk"
import { STORAGE_KEYS } from "@/shared/axios"

interface AuthState {
  userInfo: null | UserInfo['info']
  openModal: boolean
  loading: boolean
}

const initialState: AuthState = {
  loading: false,
  userInfo: null,
  openModal: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOpenModalLogin(state, payload: PayloadAction<boolean>) {
      state.openModal = payload.payload
    },
    logout(state) {
      state.userInfo = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state, action) => {
      state.loading = true
    }),
      builder.addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as unknown as AuthResponse
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.access_token)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refresh_token)
      })
    builder.addCase(signUp.pending, (state, action) => {
      state.loading = true
    }),
      builder.addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as unknown as AuthResponse
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.access_token)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refresh_token)
      }),
      builder.addCase(getCurrentUser.pending, (state, action) => {
        state.loading = true
      }),
      builder.addCase(getCurrentUser.fulfilled, (state, action) => {
        const payload = action.payload as unknown as UserInfo
        state.userInfo = payload.info
      })
  },
})

export const {
  setOpenModalLogin,
  logout,
} = authSlice.actions
export default authSlice