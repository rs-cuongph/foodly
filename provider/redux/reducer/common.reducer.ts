import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { delay } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { signUp } from "../thunk/auth.thunk";
import { acceptOrder, deleteOrder, editOrder } from "../thunk/order.thunk";

interface NotifyState {
  type: "error" | "success" | "warning";
  duration?: number;
  id?: string | number;
  messages: string;
}

interface CommonState {
  loading: boolean;
  notify: NotifyState[];
}

const initialState: CommonState = {
  loading: false,
  notify: [],
};

export const showNotify = createAsyncThunk(
  "common/showNotify",
  async (payload: NotifyState, { dispatch }) => {
    const _id = uuidv4();
    dispatch(showNotifyAction({ ...payload, id: _id }));

    if (!payload.duration) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(clearNotify(_id));
    }
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    showLoading(state) {
      state.loading = true;
    },
    hideLoading(state) {
      state.loading = false;
    },
    showNotifyAction(state, payload: PayloadAction<NotifyState>) {
      const _id = uuidv4();
      state.notify.push({
        ...payload.payload,
        duration: payload.payload.duration ?? 2000,
        id: _id,
      });
    },
    clearNotify(state, payload: PayloadAction<string | number | undefined>) {
      if (!payload?.payload) state.notify = [];
      else {
        const index = state.notify.findIndex((i) => i.id === payload.payload);
        state.notify.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteOrder.rejected, (state, action) => {
      const _id = uuidv4();
      state.notify.push({
        messages: "Đã xảy ra lỗi !!!",
        type: "error",
        duration: 2000,
        id: _id,
      });
    });
    builder.addCase(editOrder.rejected, (state, action) => {
      const _id = uuidv4();
      state.notify.push({
        messages: "Đã xảy ra lỗi !!!",
        type: "error",
        duration: 2000,
        id: _id,
      });
    });
    builder.addCase(acceptOrder.rejected, (state, action) => {
      const _id = uuidv4();
      state.notify.push({
        messages: "Đã xảy ra lỗi !!!",
        type: "error",
        duration: 2000,
        id: _id,
      });
    });
  },
});

export const { showLoading, hideLoading, showNotifyAction, clearNotify } =
  commonSlice.actions;
export default commonSlice;
