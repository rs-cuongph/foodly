"use client";

import ModalOrder from "@/components/molecules/ModalOrder";
import MyGroupOrderList from "@/components/molecules/MyGroupOrderList";
import SearchHeaderHome from "@/components/molecules/SearchHome";
import { useAppDispatch } from "@/hooks/stores.hook";
import {
  setOpenModalOrder,
  setOrderIForModalOrder,
  setRoomIForModalOrder,
} from "@/provider/redux/reducer/common.reducer";
import { useEffect } from "react";

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(setOpenModalOrder(false));
      dispatch(setOrderIForModalOrder(null));
      dispatch(setRoomIForModalOrder(null));
    };
  }, []);

  return (
    <>
      <SearchHeaderHome />
      <div className="mt-5">
        <MyGroupOrderList />
      </div>
    </>
  );
}
