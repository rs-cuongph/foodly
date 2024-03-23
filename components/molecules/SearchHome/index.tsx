"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ModalCreateRoom from "../ModalCreateRoom";
import { Button, Input } from "@nextui-org/react";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { useAppDispatch } from "@/hooks/stores.hook";
import {
  setOpenModalCreateRoom,
  setParams,
} from "@/provider/redux/reducer/room.reducer";
import { useSession } from "next-auth/react";
import { showNotify } from "@/provider/redux/reducer/common.reducer";
import { setOpenModalLogin } from "@/provider/redux/reducer/auth.reducer";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function SearchHeaderHome() {
  const dispatch = useAppDispatch();
  const session = useSession();

  const debouncedSearch = useCallback(
    debounce(async function (val: string) {
      dispatch(
        setParams({
          page: 1,
          name: val,
        })
      );
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch?.cancel();
    };
  }, []);

  return (
    <div className="px-2 flex justify-between gap-2">
      <Input
        type="text"
        label=""
        placeholder="Nhập để tìm kiếm..."
        labelPlacement="outside"
        className="w-[250px] "
        classNames={{
          inputWrapper: ["!bg-white"],
        }}
        onValueChange={(value) => debouncedSearch(value)}
        startContent={
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 pointer-events-none flex-shrink-0" />
        }
      />

      <Button
        variant="shadow"
        color="primary"
        size="md"
        onClick={() => {
          if (session.status === "authenticated")
            dispatch(setOpenModalCreateRoom(true));
          else {
            dispatch(
              showNotify({
                messages: "vui lòng đăng nhập trước",
                type: "warning",
                duration: 2000,
              })
            );
            dispatch(setOpenModalLogin(true));
          }
        }}
      >
        <PlusIcon className="h-6 w-6 text-white " />
        <span className="text-[13px] hidden sm:block">Đặt Nhóm Ngay</span>
      </Button>
      <ModalCreateRoom />
    </div>
  );
}
