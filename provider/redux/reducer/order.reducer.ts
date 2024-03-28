import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AdminGroupAcceptOrder,
  createOrder,
  deleteOrder,
  fetchListDebt,
  fetchListMyOrder,
  fetchListOrder,
} from "../thunk/order.thunk";
import { ListOrderI, ListOrderResponseI } from "../types/order";
import { PAGINATION_PARAMS } from "@/shared/constants";
import { statusOptions } from "@/components/molecules/OrderTable/contants";
interface OrderState {
  loadingCreate: boolean;
  loadingList: boolean;
  loadingDelete: boolean;
  error: any;
  orders: ListOrderResponseI;
  searchQuery: ListOrderI;
}

interface SearchParamsI {
  room_id?: string;
  page?: string | number;
  sort_by?: string;
  sort_type?: "DESC" | "ASC";
  keywords?: string;
  status?: string[];
  search_by?: string | null;
}

const initialState: OrderState = {
  searchQuery: {
    page: PAGINATION_PARAMS.DEFAULT_PAGE,
    room_id: "",
    page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
    status: statusOptions.map((i) => i.uid),
    keywords: "",
    sort_by: "created_at",
    sort_type: "DESC",
    search_by: null,
  },
  loadingCreate: false,
  loadingList: false,
  loadingDelete: false,
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
  reducers: {
    setSearchQuery: (state, action: PayloadAction<SearchParamsI>) => {
      state.searchQuery = {
        ...state.searchQuery,
        ...action.payload,
      };
    },
    resetStateOrder: () => initialState,
  },
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

    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loadingDelete = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.error.message;
      });

    builder.addCase(fetchListOrder.pending, (state) => {
      state.loadingList = true;
    });
    builder.addCase(fetchListOrder.rejected, (state) => {
      state.loadingList = false;
    });
    builder.addCase(fetchListOrder.fulfilled, (state, action) => {
      state.loadingList = false;
      state.orders = action.payload;
    });

    builder.addCase(fetchListDebt.pending, (state) => {
      state.loadingList = true;
    });
    builder.addCase(fetchListDebt.rejected, (state) => {
      state.loadingList = false;
    });
    builder.addCase(fetchListDebt.fulfilled, (state, action) => {
      state.loadingList = false;
      state.orders = {
        ...action.payload,
        data: action.payload.data.map((i) => ({
          ...i,
          room_name: i.room.name,
          room_id: i.room.room_id,
        })),
      };
    });

    builder.addCase(fetchListMyOrder.pending, (state) => {
      state.loadingList = true;
    });
    builder.addCase(fetchListMyOrder.rejected, (state) => {
      state.loadingList = false;
    });
    builder.addCase(fetchListMyOrder.fulfilled, (state, action) => {
      state.loadingList = false;
      state.orders = {
        ...action.payload,
        data: action.payload.data.map((i) => ({
          ...i,
          room_name: i.room.name,
          room_id: i.room.room_id,
        })),
      };
    });
  },
});

export const { setSearchQuery, resetStateOrder } = orderSlice.actions;
export default orderSlice;
