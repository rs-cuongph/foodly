import { FormCreateRoomType } from "@/components/molecules/ModalCreateRoom/validate";
import { request } from "@/shared/axios";
import { getRoute } from "@/shared/helpers/route";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ListRoomResponseI,
  ListUserI,
  ListUserParamsI,
  Room,
  SearchParamsI,
} from "../types/room";
import { PAGINATION_PARAMS } from "@/shared/constants";

export const createRoom = createAsyncThunk<void, FormCreateRoomType>(
  "rooms/create",
  async (data) => {
    return request({
      url: getRoute(`rooms`),
      method: "POST",
      data,
    });
  }
);

export const fetchListRoom = createAsyncThunk<ListRoomResponseI, SearchParamsI>(
  "rooms/get-list",
  async (params) => {
    const _params = {
      page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
      ...params,
    };
    return request({
      url: getRoute(`rooms`),
      method: "GET",
      params: _params,
    });
  }
);

export const fetchListMyRoom = createAsyncThunk<
  ListRoomResponseI,
  SearchParamsI
>("rooms/get-my-list", async (params) => {
  const _params = {
    page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
    ...params,
  };
  return request({
    url: getRoute(`rooms/mine`),
    method: "GET",
    params: _params,
  });
});

export const fetchRoomDetail = createAsyncThunk<Room, string>(
  "rooms/get-detail",
  async (room_id) => {
    return request({
      url: getRoute(`rooms/:room_id`, {
        room_id,
      }),
      method: "GET",
    });
  }
);

export const fetchListUser = createAsyncThunk<ListUserI, ListUserParamsI>(
  "rooms/get-list-user",
  async (params) => {
    const _params = {
      page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
      ...params,
    };
    return request({
      url: getRoute(`users`),
      method: "GET",
      params: _params,
    });
  }
);

export const deleteRoom = createAsyncThunk<any, string>(
  "room/delete",
  async (room_id) => {
    return request({
      url: getRoute(`rooms/:room_id`, {
        room_id,
      }),
      method: "DELETE",
    });
  }
);
