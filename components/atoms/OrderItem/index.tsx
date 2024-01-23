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
import { useAppSelector } from "@/hooks/stores.hook";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { diffTime } from "@/shared/helpers/format";
import { useCallback, useEffect, useState } from "react";
import ModalOrder from "@/components/molecules/ModalOrder";
import { useRouter } from "next/navigation";
import { getRoute } from "@/shared/helpers/route";
import { ROUTES } from "@/shared/constants";

interface OrderItemProps {
  data: Room;
}

export default function OrderItem({ data }: OrderItemProps) {
  const currentUser = useAppSelector((state) => state.auth.userInfo);
  const [time, setTime] = useState(diffTime(data.public_time_end));
  const [isOpenModalOrder, setOpenModalOrder] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(diffTime(data.public_time_end));
    }, 60000); // Update every minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [data.public_time_end]);

  const goToDetail = useCallback(() => {
    router.push(
      getRoute(ROUTES.MY_ORDER_DETAIL, {
        id: data.id,
      })
    );
  }, [data.id]);

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
          {time}&apos;
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
        {time !== 0 && (
          <div className="mt-[20px] flex flex-row gap-2">
            <ButtonWrapper color="primary" onClick={goToDetail}>
              {data.creator.id === currentUser?.id ? (
                <>
                  <PencilIcon className="h-4 w-4 text-white" />
                  Edit{" "}
                </>
              ) : (
                <>
                  <InformationCircleIcon className="h-4 w-4 text-white" />
                  Detail
                </>
              )}
            </ButtonWrapper>

            <ButtonWrapper
              color="primary"
              variant="bordered"
              onClick={() => {
                setOpenModalOrder(true);
              }}
            >
              <ShoppingCartIcon className="h-4 w-4 text-primary" />
              Order
            </ButtonWrapper>
          </div>
        )}
      </div>
      <ModalOrder
        open={isOpenModalOrder}
        setOpen={setOpenModalOrder}
        data={data}
      />
    </CardWrapper>
  );
}
