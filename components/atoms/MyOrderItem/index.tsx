"use client";

import {
  BanknotesIcon,
  ClockIcon,
  HashtagIcon,
} from "@heroicons/react/24/solid";
import {
  BadgeStatus,
  ButtonWrapper,
  CardAction,
  CardDescription,
  CardTitle,
  CardWrapper,
  OrderDate,
  OrderId,
  Price,
} from "./styled";

export default function MyOrderItem() {
  return (
    <CardWrapper className="flex justify-between gap-2 xs:flex-col sm:flex-row relative overflow-hidden">
      <BadgeStatus className="is-not-paid">not paid yet</BadgeStatus>
      <div>
        <CardTitle>
          <div className="flex flex-row flex-wrap gap-2 mb-2">
            <OrderDate className="bg-gray-600 flex flex-row gap-1">
              <ClockIcon className="h-4 w-4 text-white" />
              20/11/2020
            </OrderDate>
            <OrderId className="bg-primary flex flex-row gap-0">
              <HashtagIcon className="h-4 w-4 text-white" />
              11111
            </OrderId>
            <Price className="flex flex-row gap-0 is-paid">
              <span className="unit">$</span>
              25.000
            </Price>
          </div>
          Chicken Hawaiian
        </CardTitle>
        <CardDescription className="flex flex-col mt-2">
          <span>- sườn nướng</span>
          <span>- thịt ba chỉ kho</span>
        </CardDescription>
      </div>
      <CardAction className="">
        <ButtonWrapper color="primary" className="min-w-[100px]">
          <BanknotesIcon className="h-4 w-4 text-white" />
          Pay
        </ButtonWrapper>

        {/* <ButtonWrapper color="primary" variant="bordered">
          <ShoppingCartIcon className="h-4 w-4 text-primary" />
          Info
        </ButtonWrapper> */}
      </CardAction>
    </CardWrapper>
  );
}
