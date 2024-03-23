"use client";

import GroupOrderItem from "@/components/atoms/GroupOrderItem";
import { Scroller } from "@/components/atoms/Scroller";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import { useWindowSize } from "@/hooks/window-size";
import { fetchListRoom } from "@/provider/redux/thunk/room.thunk";
import { Room } from "@/provider/redux/types/room";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
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

export default function GroupOrderList() {
  const { isMobile } = useWindowSize();
  const session = useSession();
  const dispatch = useAppDispatch();
  const params = useAppSelector((state) => state.room.searchParams);
  const loading = useAppSelector((state) => state.room.isFetchingList);
  const rooms = useAppSelector((state) => state.room.rooms);

  useEffect(() => {
    dispatch(fetchListRoom(params));
  }, [session]);

  if (loading)
    return (
      <div className="flex p-2 justify-center bg-white rounded">
        <Spinner color="primary" />
      </div>
    );

  return rooms.pagination.total_record ? (
    <Scroller height={`calc(100vh - ${isMobile ? 190 : 130}px)`}>
      <OrderListStyled>
        {rooms.data.map((item: Room) => (
          <GroupOrderItem key={item.id} data={item} />
        ))}
      </OrderListStyled>
    </Scroller>
  ) : (
    <div className="bg-white p-2 rounded text-center text-[14px]">No Data</div>
  );
}
