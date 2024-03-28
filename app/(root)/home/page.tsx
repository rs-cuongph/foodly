"use client";

import GroupOrderList from "@/components/molecules/GroupOrderList";
import ModalOrder from "@/components/molecules/ModalOrder";
import SearchHeaderHome from "@/components/molecules/SearchHome";
import { useAppDispatch } from "@/hooks/stores.hook";
import { resetParams } from "@/provider/redux/reducer/room.reducer";
import { useEffect } from "react";

export default function HomePage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(resetParams());

    return () => {
      dispatch(resetParams());
    };
  }, []);
  return (
    <>
      <SearchHeaderHome />
      <div className="mt-5">
        <GroupOrderList />
      </div>
      <ModalOrder />
    </>
  );
}
