"use client";

import Image from "next/image";
import {
  ButtonWrapper,
  CardWrapper,
  Money,
  OrderId,
  OrderTitle,
  RemainingTime,
  TotalOrder,
} from "./styled";
import {
  ClockIcon,
  HashtagIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import imageDefault from "@/public/images/image_default.webp";
import { Room } from "@/provider/redux/types/room";
import { formatCurrency } from "@/shared/helpers/currency";
import { useAppDispatch } from "@/hooks/stores.hook";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { getTimeFromNow } from "@/shared/helpers/format";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRoute } from "@/shared/helpers/route";
import { ROUTES } from "@/shared/constants";
import { useSession } from "next-auth/react";
import { setOpenModalLogin } from "@/provider/redux/reducer/auth.reducer";
import {
  setOpenModalOrder,
  setRoomIForModalOrder,
  showNotify,
} from "@/provider/redux/reducer/common.reducer";
import { Chip } from "@nextui-org/react";

interface OrderItemProps {
  data: Room;
}

export default function GroupOrderItem({ data }: OrderItemProps) {
  const [time, setTime] = useState(getTimeFromNow(data.public_time_end));
  const dispatch = useAppDispatch();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTimeFromNow(data.public_time_end));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [data.public_time_end]);

  const goToDetail = useCallback(() => {
    router.push(
      getRoute(ROUTES.DETAIL_GROUP_ORDER, {
        id: data.id,
      })
    );
  }, [data.id]);

  const handleOrder = useCallback(() => {
    if (session.status === "authenticated") {
      dispatch(setOpenModalOrder(true));
      dispatch(setRoomIForModalOrder(data));
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
  }, [session, data]);

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
        {formatCurrency(data.price, "")}
        <span className="unit ml-1">vnđ</span>
      </Money>
      {time !== 0 && (
        <Chip
          color="success"
          variant="dot"
          className="absolute top-[10px] right-3"
          classNames={{
            base: ["border-[#18c964] bg-white backdrop-blur-sm"],
            content: ["text-[#18c964]"],
          }}
        >
          đang mở
        </Chip>
      )}
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
          {time}
        </RemainingTime>
      </div>
      <div className="px-[22px] py-4">
        <OrderTitle>{data.name}</OrderTitle>
        {/* <OrderDescription className="mt-[10px] line-clamp-2">
          {data.description}
        </OrderDescription> */}
        <div className="mt-[10px] flex flex-row gap-1 items-center">
          <UserIcon className="h-4 w-4 text-primary" />
          <h5 className="m-0 text-[13px] font-[500]">
            {data.creator.username}
          </h5>
        </div>
        <div className="mt-[20px] flex flex-row gap-2">
          <ButtonWrapper color="primary" onClick={goToDetail}>
            <InformationCircleIcon className="h-4 w-4 text-white" />
            Chi Tiết
          </ButtonWrapper>

          {time !== 0 && (
            <ButtonWrapper
              color="primary"
              variant="bordered"
              onClick={handleOrder}
            >
              <ShoppingCartIcon className="h-4 w-4 text-primary" />
              Đặt
            </ButtonWrapper>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}
