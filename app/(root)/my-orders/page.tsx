"use client";

import MyOrderItem from "@/components/atoms/MyOrderItem";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  DateValue,
  endOfMonth,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { Input, Radio, RadioGroup } from "@nextui-org/react";
import { useState } from "react";
import { RadioBox } from "./styled";

export default function MyOrdersPage() {
  const [dateValue, setDateValue] = useState<DateValue>(
    null as unknown as DateValue
  );
  const dateToday = today(getLocalTimeZone());

  return (
    <>
      <div className="flex gap-1 flex-wrap">
        <Input
          type="text"
          label=""
          placeholder="Nhập để tìm kiếm..."
          labelPlacement="outside"
          className="w-[250px] "
          classNames={{
            inputWrapper: ["!bg-white"],
          }}
          startContent={
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 pointer-events-none flex-shrink-0" />
          }
        />
        <Input
          type="date"
          label=""
          labelPlacement="outside"
          className="w-[130px] "
          classNames={{
            inputWrapper: ["!bg-white"],
          }}
        />
        <RadioBox className="text-white flex items-center p-2 bg-white rounded-medium ">
          <RadioGroup orientation="horizontal">
            <Radio value="buenos-aires" className="radio-custom" size="sm">
              Paid
            </Radio>
            <Radio value="sydney" className="radio-custom" size="sm">
              Not Pay
            </Radio>
          </RadioGroup>
        </RadioBox>
      </div>
      <div className="mt-5 z">
        <MyOrderItem />
      </div>
    </>
  );
}
