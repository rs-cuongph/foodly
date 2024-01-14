import styled from "styled-components";
import { Button } from "@nextui-org/react";

export const BadgeStatus = styled.div`
  position: absolute;
  padding: 0px 2px;
  width: 102px;
  font-size: 12px;
  font-weight: 700;
  top: 14px;
  right: -20px;
  rotate: 41deg;
  border: none;
  color: #fff;
  &.is-paid {
    text-align: center;
    background: #19ac2c;
  }
  &.is-not-paid {
    padding-left: 20px;
    background: #c8212e;
  }
`;

export const CardWrapper = styled.div`
  background: #fff;
  border-radius: 15px;
  width: 100%;

  border: 1px solid #fff;
  padding: 20px 20px;
  @media (min-width: 1024px) {
    max-width: 70%;
    padding: 10px 20px;
  }
  @media (min-width: 1024px) {
    max-width: 70%;
    padding: 10px 20px;
  }
`;

export const CardTitle = styled.div`
  color: #000;
  font-size: 18.214px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const OrderId = styled.div`
  width: fit-content;
  border-radius: 5px;
  color: #fff;
  box-shadow: 2px 1px 5px 0px rgba(211, 209, 216, 1);
  padding: 5px 10px;
  min-width: 50px;
  min-height: 25px;

  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const OrderDate = styled.div`
  width: fit-content;
  border-radius: 5px;
  color: #fff;
  box-shadow: 2px 1px 5px 0px rgba(211, 209, 216, 1);
  padding: 5px 10px;
  min-width: 50px;
  min-height: 25px;

  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const CardDescription = styled.div`
  color: #0000009c;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const Price = styled.div`
  width: fit-content;
  border-radius: 5px;
  color: #fff;
  box-shadow: 2px 1px 5px 0px rgba(211, 209, 216, 1);
  padding: 5px 10px;
  min-width: 50px;
  min-height: 25px;

  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  &.is-paid {
    background: #19ac2c;
  }
  &.is-not-paid {
    background: #c8212e;
  }

  .unit {
    font-weight: 700;
    margin-right: 3px;
  }
`;

export const CardAction = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const ButtonWrapper = styled(Button)``;
