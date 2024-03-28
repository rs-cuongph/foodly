import { request } from "@/shared/axios";
import { getRoute } from "@/shared/helpers/route";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ChangeStatusOrderI,
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

export const fetchListMyOrder = createAsyncThunk<
  ListOrderResponseI,
  ListOrderI
>(
  "order/my-order",
  async (data) => {
    return request({
      url:
        getRoute("my-orders") +
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

export const AdminGroupAcceptOrder = createAsyncThunk<void, ChangeStatusOrderI>(
  "order/admin-group-accept-order",
  async (data) => {
    return request({
      url: getRoute("rooms/:room_id/orders/:order_id/update-status/:status", {
        room_id: data.room_id,
        order_id: data.order_id,
        status: "paid",
      }),
      method: "PATCH",
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

export const confirmPaid = createAsyncThunk<void, ChangeStatusOrderI>(
  "order/confirm-paid",
  async (data) => {
    return request({
      url: getRoute("rooms/:room_id/orders/:order_id/confirm_paid", {
        room_id: data.room_id,
        order_id: data.order_id,
      }),
      method: "PATCH",
      data: {
        payment_method: data.payment_method,
        coupon_code: data.coupon_code,
      },
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
