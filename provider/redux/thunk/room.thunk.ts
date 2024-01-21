import { FormCreateRoomType } from "@/components/molecules/ModalCreateRoom/validate"
import { requestAuthenticated } from "@/shared/axios"
import { getRoute } from "@/shared/helpers/route"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { ListRoomI, ListUserI, ListUserParamsI, SearchParamsI } from "../types/room"
import { PAGINATION_PARAMS } from "@/shared/constants"

export const createRoom = createAsyncThunk<void, FormCreateRoomType>(
  'rooms/create',
  async (data) => {
    return requestAuthenticated({
      url: getRoute(`rooms`),
      method: 'POST',
      data
    })
  }
)

export const fetchListRoom = createAsyncThunk<ListRoomI, SearchParamsI>(
  'rooms/get-list',
  async (params) => {
    const _params = {
      page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
      ...params,
    }
    return requestAuthenticated({
      url: getRoute(`rooms`),
      method: 'GET',
      params: _params
    })
  }
)


export const fetchListUser = createAsyncThunk<ListUserI, ListUserParamsI>(
  'rooms/get-list-user',
  async (params) => {
    const _params = {
      page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
      ...params,
    }
    return requestAuthenticated({
      url: getRoute(`users`),
      method: 'GET',
      params: _params
    })
  }
)
