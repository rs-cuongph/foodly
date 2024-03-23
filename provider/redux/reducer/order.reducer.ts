import { createSlice } from "@reduxjs/toolkit";
import { createOrder, fetchListOrder } from "../thunk/order.thunk";
import { ListOrderResponseI } from "../types/order";
interface OrderState {
  loadingCreate: boolean;
  error: any;
  orders: ListOrderResponseI;
}

const initialState: OrderState = {
  loadingCreate: false,
  error: null,
  orders: {
    data: [],
    pagination: {
      page: 1,
      total_record: 0,
    },
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loadingCreate = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loadingCreate = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loadingCreate = false;
        state.error = action.error.message;
      });
    builder.addCase(fetchListOrder.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export const {} = orderSlice.actions;
export default orderSlice;
