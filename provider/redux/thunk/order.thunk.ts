import { request } from "@/shared/axios";
import { getRoute } from "@/shared/helpers/route";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateOrderI, ListOrderI, ListOrderResponseI } from "../types/order";
import qs from "qs";
import { omit } from "lodash";
export const createOrder = createAsyncThunk<void, CreateOrderI>(
  "order/create",
  async (data) => {
    return request({
      url: getRoute("rooms/:room_id/orders", {
        room_id: data.room_id,
      }),
      method: "POST",
      data,
    });
  }
);

export const fetchListOrder = createAsyncThunk<ListOrderResponseI, ListOrderI>(
  "order/list",
  async (data) => {
    return request({
      url:
        getRoute("rooms/:room_id/orders", {
          room_id: data.room_id,
        }) + qs.stringify(omit(data, ["room_id"]), { addQueryPrefix: true }),
      method: "GET",
    });
  }
);
