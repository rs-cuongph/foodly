import authSlice from '@/provider/redux/reducer/auth.reducer'
import commonSlice from '@/provider/redux/reducer/common.reducer'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import roomSlice from './reducer/room.reducer'

const rootReducer = combineReducers({
  common: commonSlice.reducer,
  auth: authSlice.reducer,
  room: roomSlice.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch