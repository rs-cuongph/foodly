"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ModalCreateRoom from "../ModalCreateRoom";
import { Input } from "@nextui-org/react";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { useAppDispatch } from "@/hooks/stores.hook";
import { setParams } from "@/provider/redux/reducer/room.reducer";

export default function SearchHeaderHome() {
  const dispatch = useAppDispatch();

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
        placeholder="Type to search..."
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

      <ModalCreateRoom />
    </div>
  );
}
