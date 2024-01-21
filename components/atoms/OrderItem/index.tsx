"use client";

import Image from "next/image";
import {
  ButtonWrapper,
  CardWrapper,
  Money,
  OrderDescription,
  OrderId,
  OrderTitle,
  RemainingTime,
  TotalOrder,
} from "./styled";
import {
  ClockIcon,
  HashtagIcon,
  PencilIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import imageDefault from "@/public/images/image_default.webp";
import { Room } from "@/provider/redux/types/room";
import { formatCurrency } from "@/shared/helpers/currency";

interface OrderItemProps {
  data: Room;
}

export default function OrderItem({ data }: OrderItemProps) {
  return (
    <CardWrapper className="relative">
      <Image
        className="rounded-[15px] h-[165px] object-cover"
        src={imageDefault.src}
        width={323}
        height={165}
        alt=""
      />
      <Money className="absolute top-[10px] left-3">
        {formatCurrency(data.price)}
        <span className="unit ml-1">vnđ</span>
      </Money>
      <div className="absolute top-[150px] left-3 flex flex-row gap-2">
        <OrderId className="flex flex-row gap-[2px]">
          <HashtagIcon className="h-4 w-4 text-primary" />
          {data.room_id}
        </OrderId>
        <TotalOrder className="flex flex-row gap-[2px]">
          <UserGroupIcon className="h-4 w-4 text-primary" />
          {data.total_item}
        </TotalOrder>
        <RemainingTime className="flex flex-row gap-[2px]">
          <ClockIcon className="h-4 w-4 text-primary" />
          30&apos;
        </RemainingTime>
      </div>
      <div className="px-[22px] py-4">
        <OrderTitle>{data.name}</OrderTitle>
        <OrderDescription className="mt-[10px] line-clamp-2">
          {data.description}
        </OrderDescription>
        <div className="mt-[10px] flex flex-row gap-1 items-center">
          <UserIcon className="h-4 w-4 text-primary" />
          <h5 className="m-0 text-[13px] font-[500]">
            {data.creator.username}
          </h5>
        </div>
        <div className="mt-[20px] flex flex-row gap-2">
          <ButtonWrapper color="primary">
            <PencilIcon className="h-4 w-4 text-white" />
            Edit
          </ButtonWrapper>

          <ButtonWrapper color="primary" variant="bordered">
            <ShoppingCartIcon className="h-4 w-4 text-primary" />
            Order
          </ButtonWrapper>
        </div>
      </div>
    </CardWrapper>
  );
}
