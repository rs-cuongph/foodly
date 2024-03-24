"use client";

import Image from "next/image";
import photoUrl from "@/public/images/banner-img.jpeg";
import {
  ActionStyled,
  ButtonWrapper,
  DetailHeaderStyled,
  DetailOrderStyled,
  ImageWrapperStyled,
  InfoHeaderStyled,
  OrderDate,
  OrderId,
  OrderListStyled,
} from "./styled";
import {
  ClockIcon,
  EllipsisHorizontalIcon,
  HashtagIcon,
  PencilIcon,
  ShareIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

import { Scroller } from "@/components/atoms/Scroller";
import { useWindowSize } from "@/hooks/window-size";
import { useParams, useRouter } from "next/navigation";
import ModalOrder from "../../molecules/ModalOrder";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import { deleteRoom, fetchRoomDetail } from "@/provider/redux/thunk/room.thunk";
import { formatTime, getTimeFromNow } from "@/shared/helpers/format";
import Spinner from "@/components/atoms/Spinner";
import { useCopyToClipboard } from "@/hooks/useCopy";
import { showNotify } from "@/provider/redux/reducer/common.reducer";
import { RemainingTime } from "@/components/atoms/GroupOrderItem/styled";
import { ROUTES } from "@/shared/constants";
import ModalCreateRoom from "../../molecules/ModalCreateRoom";
import { setOpenModalCreateRoom } from "@/provider/redux/reducer/room.reducer";
import OrderTable from "../../molecules/OrderTable";
import {
  deleteOrder,
  fetchListOrder,
} from "@/provider/redux/thunk/order.thunk";
import ModalDeleteRoom from "@/components/molecules/ModalDelete";

export default function DetailOrder() {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [_, copy] = useCopyToClipboard();
  const [isOpenModalDeleteRoom, setOpenModalDeleteRoom] = useState(false);
  const [isOpenModalOrder, setOpenModalOrder] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.userInfo);
  const { room, isFetchingRoom: isLoading } = useAppSelector(
    (state) => state.room
  );

  const isCreator = useMemo(
    () => room.creator.id === currentUser?.id,
    [currentUser, room]
  );
  const [time, setTime] = useState<string | number>(0);

  const renderMoreItem = useCallback(() => {
    return (
      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <EllipsisHorizontalIcon className="h-6 w-6 text-primary cursor-pointer" />
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Static Actions">
          {isCreator ? (
            <DropdownItem
              key="edit"
              onClick={goToEdit}
              startContent={<PencilIcon className="h-4 w-4 text-[#444]" />}
            >
              Chỉnh sửa
            </DropdownItem>
          ) : (
            (null as unknown as React.JSX.Element) // DropdownMenu just only accept type Element
          )}
          <DropdownItem
            key="share"
            onClick={handleShare}
            startContent={<ShareIcon className="h-4 w-4 text-[#444]" />}
          >
            Chia sẻ
          </DropdownItem>
          {isCreator ? (
            <DropdownItem
              key="remove"
              className="text-danger"
              onClick={openModalDelete}
              startContent={<TrashIcon className="h-4 w-4 text-red" />}
            >
              Xoá
            </DropdownItem>
          ) : (
            (null as unknown as React.JSX.Element) // DropdownMenu just only accept type Element
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }, [isCreator]);

  const goToEdit = useCallback(() => {
    dispatch(setOpenModalCreateRoom(true));
  }, [id]);

  const openModalOrder = useCallback(() => {
    setOpenModalOrder(true);
  }, []);

  const openModalDelete = useCallback(() => {
    setOpenModalDeleteRoom(true);
  }, []);

  const handleShare = useCallback(() => {
    copy(window.location.href)
      .then(() => {
        dispatch(
          showNotify({
            messages: "Sao chép liên kết thành công",
            type: "success",
          })
        );
      })
      .catch((error) => {
        dispatch(
          showNotify({
            messages: "Copy Link Order Fail",
            type: "error",
          })
        );
      });
  }, [copy, dispatch]);

  const onDelete = useCallback(async () => {
    const res = await dispatch(deleteRoom(room.id));
    if (res.type === "room/delete/fulfilled") {
      setOpenModalDeleteRoom(false);
      router.replace(ROUTES.HOME);
    }
  }, [room]);

  //useEffect
  useEffect(() => {
    if (!id) return;
    dispatch(fetchRoomDetail(id as string));
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTimeFromNow(room.public_time_end));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [room.public_time_end]);

  if (isLoading) return <Spinner />;

  return (
    <DetailOrderStyled className="w-[100%]">
      <Scroller
        height={`calc(100vh - ${isMobile ? 160 : 80}px)`}
        noScrollPadding={true}
      >
        <DetailHeaderStyled className="flex gap-5 flex-wrap">
          <ImageWrapperStyled className=" sm:max-w-[250px]">
            <Image
              className="rounded-medium p-[1px] bg-white  shadow-[0px_3px_5px_1px_#cbd5e0]"
              src={photoUrl.src}
              alt=""
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
              width={120}
              height={75}
            />
          </ImageWrapperStyled>
          <InfoHeaderStyled className="bg-white rounded-medium min-w-[250px] min-h-[150px] flex justify-between gap-1 flex-col md:flex-row">
            <div className="flex flex-row justify-between">
              <div>
                <div className="flex gap-2 mb-2">
                  <OrderDate className="bg-gray-600 flex flex-row gap-1">
                    {room.created_at &&
                      formatTime(room.created_at, "YYYY-MM-DD HH:mm")}
                  </OrderDate>
                  <OrderId className="bg-primary flex flex-row gap-0">
                    <HashtagIcon className="h-4 w-4 text-white" />
                    {room.room_id}
                  </OrderId>
                  <RemainingTime className="flex flex-row gap-[2px]">
                    <ClockIcon className="h-4 w-4 text-primary" />
                    {time}
                  </RemainingTime>
                </div>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
              </div>
              <>{isMobile && renderMoreItem()}</>
            </div>
            <ActionStyled
              className={`flex gap-[5px] max-w-[${
                isMobile ? "100%" : "170px"
              }] flex-col justify-between items-end`}
            >
              {!isMobile && renderMoreItem()}

              <ButtonWrapper
                color="primary"
                size={isMobile ? "sm" : "md"}
                fullWidth
                onClick={openModalOrder}
              >
                <ShoppingCartIcon className="h-4 w-4 text-white" />
                Đặt
              </ButtonWrapper>
            </ActionStyled>
          </InfoHeaderStyled>
        </DetailHeaderStyled>
        <OrderListStyled className="mt-2">
          <OrderTable data={room} />
        </OrderListStyled>
      </Scroller>
      <ModalDeleteRoom
        open={isOpenModalDeleteRoom}
        setOpen={setOpenModalDeleteRoom}
        onSubmit={onDelete}
      />

      <ModalOrder
        open={isOpenModalOrder}
        setOpen={setOpenModalOrder}
        data={room}
      />
      <ModalCreateRoom editData={room} />
    </DetailOrderStyled>
  );
}
