import { request } from "@/shared/axios";
import { getRoute } from "@/shared/helpers/route";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateOrderI,
  DeleteOrderI,
  EditOrderI,
  ListOrderI,
  ListOrderResponseI,
} from "../types/order";
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

export const editOrder = createAsyncThunk<void, EditOrderI>(
  "order/edit",
  async (data) => {
    return request({
      url: getRoute("rooms/:room_id/orders/:order_id", {
        room_id: data.room_id,
        order_id: data.order_id,
      }),
      method: "PATCH",
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
        }) +
        qs.stringify(omit(data, ["room_id"]), {
          addQueryPrefix: true,
          arrayFormat: "brackets",
        }),
      method: "GET",
    });
  },
  {
    serializeError: (error: any) => {
      return {
        code: error?.errorCode,
        message: error?.message,
      };
    },
  }
);

export const fetchListDebt = createAsyncThunk<ListOrderResponseI, ListOrderI>(
  "order/list-debt",
  async (data) => {
    return request({
      url:
        getRoute("debt-list") +
        qs.stringify(data, {
          addQueryPrefix: true,
          arrayFormat: "brackets",
        }),
      method: "GET",
    });
  },
  {
    serializeError: (error: any) => {
      return {
        code: error?.errorCode,
        message: error?.message,
      };
    },
  }
);

export const deleteOrder = createAsyncThunk<void, DeleteOrderI>(
  "order/delete",
  async (data) => {
    return request({
      url: getRoute("rooms/:room_id/orders/:order_id", {
        room_id: data.room_id,
        order_id: data.order_id,
      }),
      method: "DELETE",
    });
  },
  {
    serializeError: (error: any) => {
      return {
        code: error?.errorCode,
        message: error?.message,
      };
    },
  }
);
