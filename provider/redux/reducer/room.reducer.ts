import {
  ListRoomResponseI,
  ListUserI,
  Room,
  SearchParamsI,
} from "@/provider/redux/types/room";
import { PAGINATION_PARAMS } from "@/shared/constants";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createRoom,
  editRoom,
  fetchListMyRoom,
  fetchListRoom,
  fetchListUser,
  fetchRoomDetail,
} from "../thunk/room.thunk";

interface roomState {
  isFetchingList: boolean;
  isFetchingListUser: boolean;
  isFetchingRoom: boolean;
  isCreating: boolean;
  error?: string | null;
  rooms: ListRoomResponseI;
  users: ListUserI;
  searchParams: SearchParamsI;
  room: Room;
  isOpenModalCreateOrder: boolean;
}

const initialState: roomState = {
  isFetchingList: false,
  isFetchingRoom: false,
  isFetchingListUser: false,
  isCreating: false,
  error: null,
  searchParams: {
    page: 1,
    page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
    keywords: "",
  },
  rooms: {
    data: [],
    pagination: {
      page: 1,
      total_record: 0,
    },
  },
  users: {
    count: 0,
    items: [],
  },
  room: {
    deleted_at: "",
    room_id: "",
    name: "",
    description: "",
    creator: {
      email: "",
      role: "",
      id: "",
      username: "",
      payment_setting: [],
    },
    invited_people: [],
    total_item: 0,
    public_time_start: "",
    public_time_end: "",
    price: 0,
    share_scope: "",
    created_at: "",
    updated_at: "",
    id: "",
  },
  isOpenModalCreateOrder: false,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    resetParams: (state) => {
      state.searchParams = initialState.searchParams;
    },
    setParams: (state, action: PayloadAction<SearchParamsI>) => {
      state.searchParams = {
        ...state.searchParams,
        ...action.payload,
      };
    },
    setOpenModalCreateRoom: (state, action: PayloadAction<boolean>) => {
      state.isOpenModalCreateOrder = action.payload;
    },
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
      .addCase(fetchListMyRoom.pending, (state) => {
        state.isFetchingList = true;
      })
      .addCase(fetchListMyRoom.fulfilled, (state, action) => {
        state.isFetchingList = false;
        state.rooms = action.payload;
      })
      .addCase(fetchListMyRoom.rejected, (state, action) => {
        state.isFetchingList = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchRoomDetail.pending, (state) => {
        state.isFetchingRoom = true;
      })
      .addCase(fetchRoomDetail.fulfilled, (state, action) => {
        state.isFetchingRoom = false;
        state.room = action.payload;
      })
      .addCase(fetchRoomDetail.rejected, (state, action) => {
        state.isFetchingRoom = false;
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
      .addCase(editRoom.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(editRoom.fulfilled, (state, action) => {
        state.isCreating = false;
      })
      .addCase(editRoom.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchListUser.pending, (state) => {
        state.isFetchingListUser = true;
      })
      .addCase(fetchListUser.fulfilled, (state, action) => {
        state.isFetchingListUser = false;
        state.users = action.payload;
      })
      .addCase(fetchListUser.rejected, (state, action) => {
        state.isFetchingListUser = false;
        state.error = action.error.message;
      });
  },
});

export const { setParams, setOpenModalCreateRoom, resetParams } =
  roomSlice.actions;
export default roomSlice;
