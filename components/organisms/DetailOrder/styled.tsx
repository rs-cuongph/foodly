import { Button } from "@nextui-org/react";
import styled from "styled-components";

export const DetailOrderStyled = styled.div`
  max-width: 1200px;
`;

export const DetailHeaderStyled = styled.div``;

export const ImageWrapperStyled = styled.div`
  //   max-width: 250px;
`;

export const InfoHeaderStyled = styled.div`
  flex: 1;
  padding: 16px;
  h3 {
    color: #000;
    font-size: 21px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  p {
    margin-top: 10px;
    color: #5b5b5e;
    font-size: 14.571px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

export const ActionStyled = styled.div``;

export const ButtonWrapper = styled(Button)`
  border: 1px solid;
  border-radius: 28.5px;
  background: #fe724c;
  box-shadow: 0px 10px 30px 0px rgba(254, 114, 76, 0.2);
  color: #fff;
`;

export const OrderListStyled = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
`;

export const OrderItemStyled = styled.div`
  background: white;
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
