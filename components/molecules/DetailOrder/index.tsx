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
import { OrderDate } from "@/components/atoms/MyOrderItem/styled";
import { OrderId } from "@/components/atoms/MyOrderItem/styled";
import OrderItems from "./order-items";
import { Scroller } from "@/components/atoms/Scroller";
import { useWindowSize } from "@/hooks/window-size";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants";
import { getRoute } from "@/shared/helpers/route";
import ModalDeleteOrder from "../ModalDeleteOrder";
import ModalOrder from "../ModalOrder";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import { fetchRoomDetail } from "@/provider/redux/thunk/room.thunk";
import { formatTime } from "@/shared/helpers/format";
import Spinner from "@/components/atoms/Spinner";
import { useCopyToClipboard } from "@/hooks/useCopy";
import { showNotify } from "@/provider/redux/reducer/common.reducer";

//-------------------------------------------------------------------------//

export default function DetailOrder() {
  const { isMobile } = useWindowSize();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [_, copy] = useCopyToClipboard();

  const [isOpenModalDelete, setOpenModalDelete] = useState(false);
  const [isOpenModalOrder, setOpenModalOrder] = useState(false);

  const currentUser = useAppSelector((state) => state.auth.userInfo);
  const { room, isFetchingRoom: isLoading } = useAppSelector(
    (state) => state.room
  );

  //method
  const isCreator = useMemo(
    () => room.creator.id === currentUser?.id,
    [currentUser, room]
  );

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
              Edit
            </DropdownItem>
          ) : (
            (null as unknown as React.JSX.Element) // DropdownMenu just only accept type Element
          )}
          <DropdownItem
            key="share"
            onClick={handleShare}
            startContent={<ShareIcon className="h-4 w-4 text-[#444]" />}
          >
            Share
          </DropdownItem>
          {isCreator ? (
            <DropdownItem
              key="remove"
              className="text-danger"
              onClick={openModalDeleteOrder}
              startContent={<TrashIcon className="h-4 w-4 text-red" />}
            >
              Remove
            </DropdownItem>
          ) : (
            (null as unknown as React.JSX.Element) // DropdownMenu just only accept type Element
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }, [isCreator]);

  const goToEdit = useCallback(() => {
    setOpenModalOrder(true);
  }, [id]);

  const openModalOrder = useCallback(() => {
    setOpenModalOrder(true);
  }, []);

  const openModalDeleteOrder = useCallback(() => {
    setOpenModalDelete(true);
  }, []);

  const handleShare = useCallback(() => {
    copy(window.location.href)
      .then(() => {
        dispatch(
          showNotify({
            messages: "Copy Link Order Successfully",
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

  //useEffect
  useEffect(() => {
    if (!id) return;
    dispatch(fetchRoomDetail(id as string));
  }, [id]);

  if (isLoading) return <Spinner />;

  return (
    <DetailOrderStyled className="w-[100%]">
      <Scroller
        height={`calc(100vh - ${isMobile ? 160 : 80}px)`}
        noScrollPadding
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
                    <ClockIcon className="h-4 w-4 text-white" />
                    {room.created_at && formatTime(room.created_at)}
                  </OrderDate>
                  <OrderId className="bg-primary flex flex-row gap-0">
                    <HashtagIcon className="h-4 w-4 text-white" />
                    {room.room_id}
                  </OrderId>
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
                Order
              </ButtonWrapper>
            </ActionStyled>
          </InfoHeaderStyled>
        </DetailHeaderStyled>
        <OrderListStyled className="mt-2">
          <OrderItems />
        </OrderListStyled>
      </Scroller>
      <ModalDeleteOrder open={isOpenModalDelete} setOpen={setOpenModalDelete} />
      <ModalOrder open={isOpenModalOrder} setOpen={setOpenModalOrder} />
    </DetailOrderStyled>
  );
}
