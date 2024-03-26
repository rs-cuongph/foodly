"use client";
import styled from "styled-components";
import bgImg from "@/public/images/banner-img.jpeg";
const MainWrapper = styled.main((props) => {
  return `
  padding-top: 70px;
  padding-bottom: 50px;
  flex: 1;
  overflow-y: hidden;
  width: 100%;
  background: url(${bgImg.src}), lightgray 50% / cover no-repeat;
  background-position: center;
  background-size: cover;
  .content {
    width: 100%;
  }
  @media (max-width: 765px) {
    padding-bottom: 80px;
  }
`;
});
interface MainProps {
  children: React.ReactNode;
  className: string;
}

export default function Main({ children, className }: MainProps) {
  return <MainWrapper className={className}>{children}</MainWrapper>;
}
