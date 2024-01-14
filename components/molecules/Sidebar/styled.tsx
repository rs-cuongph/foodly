import styled from "styled-components";

const SidebarStyled = styled.div`
  margin-left: 10px;
  width: 280px;
  height: 600px;
  z-index: 999;

  @media (max-width: 765px) {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0;
    height: 80px;
    width: 100%;
  }

  @media (max-width: 765px) {
    padding: 10px;
  }
`;

const MenuWrapper = styled.div`
  border-radius: 15px;
  padding: 15px 10px;
  flex-direction: column;
  width: 280px;
  height: 600px;
  background: #fff;

  @media (max-width: 765px) {
    width: 100%;
    flex-direction: row;
    height: 60px;
    padding: 5px 60px 5px 10px;
  }
`;

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 10px;
  font-size: 14px;

  span {
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  @media (max-width: 765px) {
    gap: 5px;
    height: auto;
  }

  @media (max-width: 450px) {
    span {
      display: none;
    }
  }
`;

const ButtonLogout = styled.button`
  position: absolute;
  bottom: 15px;
  left: 20px;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  padding: 8px 14px;
  border-radius: 28.5px;
  background: #fe724c;
  box-shadow: 0px 10px 30px 0px rgba(254, 114, 76, 0.2);
  color: #fff;
  span {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%; /* 16px */
  }

  @media (max-width: 765px) {
    right: 10px;
    bottom: 12px;
    left: unset;
    span {
      display: none;
    }
  }
`;

export { MenuItem, MenuWrapper, ButtonLogout, SidebarStyled };
