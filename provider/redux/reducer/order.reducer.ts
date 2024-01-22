import { createSlice } from "@reduxjs/toolkit"
import { createOrder } from "../thunk/order.thunk"
interface OrderState {
  loadingCreate: boolean
  error: any
}

const initialState: OrderState = {
  loadingCreate: false,
  error: null
}

const orderSlice = createSlice({
  name: 'order',
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
  }
})

export const {

} = orderSlice.actions
export default orderSlice