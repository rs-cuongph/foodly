import styled from "styled-components";
import { Button } from "@nextui-org/react";

export const CardWrapper = styled.div`
  background: #fff;
  border-radius: 15px;
  min-width: 280px;
  max-width: 323px;
  width: 100%;
  border: 1px solid #fff;
  box-shadow: 5px 5px rgb(203 245 242 / 40%), 10px 10px rgb(225 244 242 / 30%);
  @media (max-width: 765px) {
    width: calc(50% - 2rem - 5px);
    min-width: 316px;
  }
  @media (max-width: 425px) {
    width: 100%;
  }
`;

export const OrderTitle = styled.h4`
  color: #000;
  font-size: 18.214px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const OrderDescription = styled.p`
  color: #5b5b5e;
  font-size: 14.571px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const OrderId = styled.div`
  border-radius: 12px;
  background: #fff;
  box-shadow: 2px 1px 5px 0px rgba(211, 209, 216, 1);
  padding: 5px 10px;
  min-width: 50px;
  min-height: 25px;

  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const TotalOrder = styled.div`
  border-radius: 12px;
  background: #fff;
  box-shadow: 2px 1px 5px 0px rgba(211, 209, 216, 1);
  padding: 5px 10px;
  min-width: 50px;
  min-height: 25px;

  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const Money = styled.div`
  border-radius: 12px;
  background: #fff;
  box-shadow: 2px 1px 5px 0px rgba(211, 209, 216, 1);
  padding: 4px 10px;
  min-width: 50px;
  min-height: 25px;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  .unit {
    color: #fe724c;
    font-weight: 700;
    margin-right: 3px;
  }
`;

export const RemainingTime = styled.div`
  border-radius: 12px;
  background: #fff;
  box-shadow: 2px 1px 5px 0px rgba(211, 209, 216, 1);
  padding: 5px 10px;
  min-width: 50px;
  min-height: 25px;

  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const ButtonWrapper = styled(Button)`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const ButtonEdit = styled(ButtonWrapper)``;

export const ButtonOrder = styled(ButtonWrapper)``;
