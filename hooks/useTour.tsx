import { setOpenModalCreateRoom } from "@/provider/redux/reducer/room.reducer";
import { useAppDispatch } from "./stores.hook";
import { driver } from "driver.js";
import { delay } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ROUTES } from "@/shared/constants";

export const useTour = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const navigate = useCallback((url: string) => {
    router.push(url);
  }, []);

  const STEPS_NEWBIE = [
    {
      element: ".header-wrapper",
      popover: {
        title: "FOODLY BOOKING",
        description: "Chào mừng bạn đến với FOODLY BOOKING!",
        onNextClick: () => {
          localStorage.setItem("isReadGuide", "1");
          driverObj.moveNext();
        },
      },
    },
    {
      element: ".search-element",
      popover: {
        title: "Tìm kiếm",
        description: "Nhập những thứ mà bạn muốn tìm kiếm",
      },
    },
    {
      element: ".group-button-element",
      popover: {
        title: "Tạo nhóm order",
        description: "Click vào Button để thực hiện tạo nhóm",
        onNextClick: () => {
          dispatch(setOpenModalCreateRoom(true));
          delay(function () {
            localStorage.setItem("isReadGuide", "1");
            driverObj.moveNext();
          }, 10);
        },
      },
    },
    {
      element: ".modal-create-group-element",
      popover: {
        title: "Form tạo nhóm",
        description:
          "Thực hiện nhập đầy đủ thông tin nhóm của bạn. Sau đó click vào nút submit để tạo nhóm hoặc close để hủy",
      },
    },
    {
      element: ".nav-item-element-1",
      popover: {
        title: "Trang chủ",
        description: "Click để đi đến trang chủ",
        onPrevClick: () => {
          dispatch(setOpenModalCreateRoom(true));
          delay(function () {
            driverObj.movePrevious();
          }, 10);
        },
      },
    },
    {
      element: ".nav-item-element-2",
      popover: {
        title: "Lịch sử",
        description: "Click để đi đến danh sách lịch sử",
        onNextClick: () => {
          navigate(ROUTES.HISTORY);
          delay(function () {
            driverObj.moveNext();
          }, 500);
        },
      },
    },
    {
      element: ".list-history-header-element",
      popover: {
        title: "Thanh công cụ tìm kiếm",
        description: "Tại đây bạn có thể lọc và tìm kiếm lịch sử bạn mong muốn",
      },
    },
    {
      element: ".nav-item-element-3",
      popover: {
        title: "Nhóm của tôi",
        description: "Click để đi đến danh sách nhóm",
        onNextClick: () => {
          navigate(ROUTES.MY_ORDERS);
          delay(function () {
            driverObj.moveNext();
          }, 2000);
        },
      },
    },
    {
      element: ".nav-item-element-4",
      popover: {
        title: "Tôi",
        description: "Click để đi đến trang cá nhân",
        onNextClick: () => {
          navigate(ROUTES.MY_PAGE);
          driverObj.moveNext();
        },
      },
    },
    {
      popover: {
        title: "Chúc bạn có một trải nghiệm Foodly Booking vui vẻ!",
        onNextClick: () => {
          driverObj.moveNext();
        },
      },
    },
  ];

  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    disableActiveInteraction: true,
    steps: STEPS_NEWBIE,
    nextBtnText: "Tiếp",
    prevBtnText: "Trở về",
    doneBtnText: "Đóng",
  });

  return [driverObj];
};
