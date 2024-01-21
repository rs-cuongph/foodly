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
import { useCallback, useState } from "react";
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

export default function DetailOrder() {
  const { isMobile } = useWindowSize();
  const { id } = useParams();
  const router = useRouter();
  const [isOpenModalDelete, setOpenModalDelete] = useState(false);
  const [isOpenModalOrder, setOpenModalOrder] = useState(false);

  const renderMoreItem = useCallback(() => {
    return (
      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <ButtonWrapper color="default" size="sm" variant="bordered">
            <EllipsisHorizontalIcon className="h-4 w-4 text-primary" />
          </ButtonWrapper>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Static Actions">
          <DropdownItem key="copy">Copy link</DropdownItem>
          <DropdownItem key="edit">Edit file</DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            Delete file
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }, []);

  const goToEdit = useCallback(() => {
    router.push(
      getRoute(ROUTES.MY_ORDER_EDIT, {
        id: id,
      })
    );
  }, [router, id]);

  const openModalOrder = useCallback(() => {
    console.log("object");
    setOpenModalOrder(true);
  }, []);
  const openModalDeleteOrder = useCallback(() => {}, []);

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
            <div>
              <div className="flex gap-2 mb-2">
                <OrderDate className="bg-gray-600 flex flex-row gap-1">
                  <ClockIcon className="h-4 w-4 text-white" />
                  20/11/2020
                </OrderDate>
                <OrderId className="bg-primary flex flex-row gap-0">
                  <HashtagIcon className="h-4 w-4 text-white" />
                  11111
                </OrderId>
              </div>
              <h3>Chicken Hawaiian</h3>
              <p>Chicken, Cheese and pineapple</p>
            </div>
            <ActionStyled className="flex gap-[5px] max-w-[170px] flex-col">
              <ButtonWrapper
                color="primary"
                size="sm"
                className="w-100"
                onClick={goToEdit}
              >
                <PencilIcon className="h-4 w-4 text-white" />
                Edit
              </ButtonWrapper>
              <ButtonWrapper
                color="primary"
                size="sm"
                variant="bordered"
                onClick={openModalOrder}
              >
                <ShoppingCartIcon className="h-4 w-4 text-primary" />
                Order
              </ButtonWrapper>
              <ButtonWrapper
                color="danger"
                size="sm"
                onClick={() => setOpenModalDelete(true)}
              >
                <TrashIcon className="h-4 w-4 text-white" />
                Delete
              </ButtonWrapper>
              <ButtonWrapper color="default" size="sm">
                <ShareIcon className="h-4 w-4 text-[#444]" />
                Share
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
