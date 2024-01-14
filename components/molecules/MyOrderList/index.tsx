"use client";

import MyOrderItem from "@/components/atoms/MyOrderItem";
import OrderItem from "@/components/atoms/OrderItem";
import { Scroller } from "@/components/atoms/Scroller";
import { useWindowSize } from "@/hooks/window-size";
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

  return (
    <Scroller height={`calc(100vh - ${isMobile ? 190 : 130}px)`}>
      <OrderListStyled>
        <MyOrderItem />
      </OrderListStyled>
    </Scroller>
  );
}
