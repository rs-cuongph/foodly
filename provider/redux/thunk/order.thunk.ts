import { requestAuthenticated } from "@/shared/axios"
import { getRoute } from "@/shared/helpers/route"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { CreateOrderI } from "../types/order"

export const createOrder = createAsyncThunk<void, CreateOrderI>(
  'order/create',
  async (data) => {
    return requestAuthenticated({
      url: getRoute('rooms/:room_id/orders', {
        room_id: data.room_id
      }),
      method: 'POST',
      data,
    })
  }
)