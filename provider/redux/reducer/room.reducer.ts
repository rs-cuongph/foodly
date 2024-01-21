import { ListRoomI, ListUserI, SearchParamsI } from "@/provider/redux/types/room"
import { PAGINATION_PARAMS } from "@/shared/constants"
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from '@reduxjs/toolkit'
import { createRoom, fetchListRoom, fetchListUser } from "../thunk/room.thunk"

interface roomState {
  isFetchingList: boolean,
  isFetchingListUser: boolean,
  isCreating: boolean,
  error?: string | null
  rooms: ListRoomI
  users: ListUserI,
  searchParams: SearchParamsI
}

const initialState: roomState = {
  isFetchingList: false,
  isFetchingListUser: false,
  isCreating: false,
  error: null,
  searchParams: {
    page: 1,
    page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
    name: '',
    room_id: ''
  },
  rooms: {
    count: 0,
    items: []
  },
  users: {
    count: 0,
    items: []
  },
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<SearchParamsI>) => {
      state.searchParams = {
        ...state.searchParams,
        ...action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListRoom.pending, (state) => {
        state.isFetchingList = true;
      })
      .addCase(fetchListRoom.fulfilled, (state, action) => {
        state.isFetchingList = false;
        state.rooms = action.payload;
      })
      .addCase(fetchListRoom.rejected, (state, action) => {
        state.isFetchingList = false;
        state.error = action.error.message;
      });

    builder
      .addCase(createRoom.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isCreating = false;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchListUser.pending, (state) => {
        state.isFetchingListUser = true;
      })
      .addCase(fetchListUser.fulfilled, (state, action) => {
        state.isFetchingListUser = false;
        state.users = action.payload
      })
      .addCase(fetchListUser.rejected, (state, action) => {
        state.isFetchingListUser = false;
        state.error = action.error.message;
      });
  },
})

export const {
  setParams
} = roomSlice.actions
export default roomSlice