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
  UserGroupIcon,
  CurrencyDollarIcon,
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
import {
  setOpenModalOrder,
  setRoomIForModalOrder,
  showNotify,
} from "@/provider/redux/reducer/common.reducer";
import {
  Money,
  RemainingTime,
  TotalOrder,
} from "@/components/atoms/GroupOrderItem/styled";
import { ROUTES } from "@/shared/constants";
import ModalCreateRoom from "../../molecules/ModalCreateRoom";
import { setOpenModalCreateRoom } from "@/provider/redux/reducer/room.reducer";
import OrderTable from "../../molecules/OrderTable";
import ModalDeleteRoom from "@/components/molecules/ModalDelete";
import { formatCurrency } from "@/shared/helpers/currency";
import clsx from "clsx";

export default function DetailOrder() {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [_, copy] = useCopyToClipboard();
  const [isShowMore, setShowMore] = useState(false);
  const [isOpenModalDeleteRoom, setOpenModalDeleteRoom] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.userInfo);
  const { room, isFetchingRoom: isLoading } = useAppSelector(
    (state) => state.room
  );

  const isCreator = useMemo(() => {
    return room.creator.id === currentUser?.id;
  }, [currentUser, room]);
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
    dispatch(setOpenModalOrder(true));
    dispatch(setRoomIForModalOrder(room));
  }, [room]);

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
            type: "success",
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

  const lengthDescription = useMemo(() => room.description.split("\n")?.length ?? 0, [room])


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
            <div className="flex flex-row justify-between ">
              <div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <OrderDate className="bg-gray-600 flex flex-row gap-1">
                    {room.created_at &&
                      formatTime(room.created_at, "DD-MM-YYYY HH:mm")}
                  </OrderDate>
                  <OrderId className="bg-primary flex flex-row gap-0">
                    <HashtagIcon className="h-4 w-4 text-white" />
                    {room.room_id}
                  </OrderId>
                  <RemainingTime className="flex flex-row gap-[2px]">
                    <ClockIcon className="h-4 w-4 text-primary" />
                    {time}
                  </RemainingTime>
                  <TotalOrder className="flex flex-row gap-[2px]">
                    <UserGroupIcon className="h-4 w-4 text-primary" />
                    {room.total_item}
                  </TotalOrder>
                  <Money className="flex flex-row gap-[2px]">
                    <CurrencyDollarIcon className="h-4 w-4 text-primary" />
                    {formatCurrency(room.price, "")}
                    <span className="unit ml-1">vnđ</span>
                  </Money>
                </div>
                <h3>{room.name}</h3>
                <div className="relative">
                  <div className={
                    clsx('overflow-hidden', isShowMore ? '' : lengthDescription >= 7 ? 'h-[180px] [mask-image:linear-gradient(180deg,_#000_calc(100%_-_40px),_transparent)]' : '')
                  }>
                    {room.description.split("\n")?.map((_item, index) => {
                      return (
                        <p key={index} className="line-clamp-2">
                          - {_item.replace("-", "")}
                        </p>
                      );
                    })}
                  </div>
                  {lengthDescription >= 7 && <span className="absolute bottom-0 left-[50%] [transform:translatex(-50%)] text-sm font-normal cursor-pointer" onClickCapture={() => {
                    setShowMore(prev => !prev)
                  }}>
                    {isShowMore ? 'rút gọn' : 'xem thêm'}
                  </span>}
                </div>
              </div>
              {isMobile ? renderMoreItem() : <></>}
            </div>
            <ActionStyled
              className={`flex gap-[5px] max-w-[${
                isMobile ? "100%" : "170px"
              }] flex-col justify-between items-end`}
            >
              {!isMobile ? renderMoreItem() : <></>}
              {time !== 0 && (
                <ButtonWrapper
                  color="primary"
                  size={isMobile ? "sm" : "md"}
                  fullWidth
                  onClick={openModalOrder}
                >
                  <ShoppingCartIcon className="h-4 w-4 text-white" />
                  Đặt
                </ButtonWrapper>
              )}
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

      <ModalOrder />
      <ModalCreateRoom editData={room} />
    </DetailOrderStyled>
  );
}
