"use client";
import styled from "styled-components";

const MainWrapper = styled.main`
  padding-top: 70px;
  padding-bottom: 50px;
  flex: 1;
  overflow-y: hidden;
  width: 100%;
  background: url(/images/banner-img.jpeg), lightgray 50% / cover no-repeat;
  background-position: center;
  background-size: cover;
  .content {
    width: 100%;
  }
  @media (max-width: 765px) {
    padding-bottom: 80px;
  }
`;
interface MainProps {
  children: React.ReactNode;
  className: string;
}

export default function Main({ children, className }: MainProps) {
  return <MainWrapper className={className}>{children}</MainWrapper>;
}
