"use client";

import OrderItem from "@/components/atoms/OrderItem";
import { Scroller } from "@/components/atoms/Scroller";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import { useWindowSize } from "@/hooks/window-size";
import { fetchListRoom } from "@/provider/redux/thunk/room.thunk";
import { Spinner } from "@nextui-org/react";
import { useEffect } from "react";
import styled from "styled-components";

const OrderListStyled = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  row-gap: 20px;
  column-gap: 30px;

  @media (max-width: 425px) {
    justify-content: space-around;
  }
  @media (max-width: 765px) {
    justify-content: space-between;
  }
`;

export default function OrderList() {
  const { isMobile } = useWindowSize();
  const dispatch = useAppDispatch();
  const params = useAppSelector((state) => state.room.searchParams);
  const loading = useAppSelector((state) => state.room.isFetchingList);
  const data = useAppSelector((state) => state.room.rooms);

  useEffect(() => {
    dispatch(fetchListRoom(params));
  }, []);

  if (loading)
    return (
      <div className="flex p-2 justify-center bg-white rounded">
        <Spinner color="primary" />
      </div>
    );

  return data?.count ? (
    <Scroller height={`calc(100vh - ${isMobile ? 190 : 130}px)`}>
      <OrderListStyled>
        {data.items.map((item) => (
          <OrderItem key={item.id} data={item} />
        ))}
      </OrderListStyled>
    </Scroller>
  ) : (
    <div className="bg-white p-2 rounded text-center text-[14px]">No Data</div>
  );
}
