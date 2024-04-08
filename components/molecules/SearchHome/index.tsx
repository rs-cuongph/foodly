"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import ModalCreateRoom from "../ModalCreateRoom";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useAppDispatch } from "@/hooks/stores.hook";
import {
  resetParams,
  setOpenModalCreateRoom,
  setParams,
} from "@/provider/redux/reducer/room.reducer";
import { useSession } from "next-auth/react";
import { showNotify } from "@/provider/redux/reducer/common.reducer";
import { setOpenModalLogin } from "@/provider/redux/reducer/auth.reducer";
import { PlusIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function SearchHeaderHome() {
  const dispatch = useAppDispatch();
  const session = useSession();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["open"])
  );

  const selectedValue = useMemo(() => {
    if (Array.from(selectedKeys)[0] === "open")
      return {
        value: Array.from(selectedKeys)[0],
        label: "Đang mở",
      };
    return {
      value: Array.from(selectedKeys)[0],
      label: "Đã đóng",
    };
  }, [selectedKeys]);

  const debouncedSearch = useCallback(
    debounce(async function (val: string) {
      dispatch(
        setParams({
          page: 1,
          keywords: val,
        })
      );
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      dispatch(resetParams());
      debouncedSearch?.cancel();
    };
  }, []);

  return (
    <div className="px-2 flex justify-between gap-2">
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          label=""
          placeholder="Nhập để tìm kiếm..."
          labelPlacement="outside"
          className="w-[250px]  search-element"
          classNames={{
            inputWrapper: ["!bg-white"],
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") debouncedSearch((e.target as any).value);
          }}
          startContent={
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 pointer-events-none flex-shrink-0" />
          }
        />
        {/* <Dropdown>
          <DropdownTrigger>
            <Chip
              variant="dot"
              color={selectedValue.value === "open" ? "success" : "danger"}
              className="cursor-pointer"
              classNames={{
                base: [
                  "bg-white px-[10px] h-[34px]",
                  selectedValue.value === "open"
                    ? "border-[#18c964]"
                    : "border-[#dc2626]",
                ],
                content: ["bg-white"],
              }}
            >
              <span
                className={clsx(
                  selectedValue.value === "open"
                    ? "text-[#18c964]"
                    : "text-[#dc2626]"
                )}
              >
                {selectedValue.label}
              </span>
            </Chip>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="open">Đang mở</DropdownItem>
            <DropdownItem key="closed">Đã đóng</DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
      </div>

      <Button
        className="group-button-element"
        variant="shadow"
        color="primary"
        size="md"
        onClick={() => {
          if (session.status === "authenticated") {
            dispatch(setOpenModalCreateRoom(true));
          } else {
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
        <span className="text-[13px] hidden sm:block ">Đặt Nhóm Ngay</span>
      </Button>
      <ModalCreateRoom />
    </div>
  );
}
