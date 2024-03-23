"use client";

import { ROUTES } from "@/shared/constants";
import {
  ArrowRightEndOnRectangleIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ButtonLogout, MenuWrapper, MenuItem, SidebarStyled } from "./styled";
import { useAppDispatch } from "@/hooks/stores.hook";
import { setOpenModalLogin } from "@/provider/redux/reducer/auth.reducer";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const session = useSession();
  const dispatch = useAppDispatch();

  const handleLoginLogout = useCallback(() => {
    if (session.status === "authenticated") {
      signOut({
        redirect: false,
      });
    } else {
      dispatch(setOpenModalLogin(true));
    }
  }, [session]);

  const items = [
    {
      name: "Trang Chủ",
      icon: <HomeIcon className="h-6 w-6 text-[#fe724c]" />,
      key: 1,
      pathRegex: new RegExp(/^\/home+$/g),
      onClick: () => {
        router.push(ROUTES.HOME);
      },
    },
    {
      name: "Đơn Của Tôi",
      icon: <ClipboardDocumentListIcon className="h-6 w-6 text-[#fe724c]" />,
      key: 2,
      pathRegex: new RegExp(/^\/my-orders/g),
      onClick: () => {
        router.push(ROUTES.MY_ORDERS);
      },
    },
    {
      name: "Cài đặt",
      icon: <UserCircleIcon className="h-6 w-6 text-[#fe724c]" />,
      key: 4,
      pathRegex: new RegExp(/^\/my-page+$/g),
      onClick: () => {
        router.push(ROUTES.MY_PAGE);
      },
    },
  ];

  const checkIsActive = useCallback(
    (pathRegex: RegExp) => {
      if (pathRegex.test(pathName)) {
        return "bg-[#fe724c40] text-[#fe724c]";
      }
      return "";
    },
    [pathName]
  );

  return (
    <SidebarStyled className="shadow-2xl shadow-blue-500/20 backdrop-blur-sm">
      <MenuWrapper className="relative flex gap-1">
        {items.map((item) => {
          return (
            <MenuItem
              key={item.key}
              className={clsx(
                "hover:text-[#fe724c] hover:bg-[#fe724c40] rounded-xl",
                checkIsActive(item.pathRegex)
              )}
              onClick={item.onClick}
            >
              {checkIsActive(item.pathRegex)}
              <div className="w-6 h-6">{item.icon}</div>
              <span>{item.name}</span>
            </MenuItem>
          );
        })}
        <ButtonLogout onClick={handleLoginLogout}>
          {session.status === "authenticated" ? (
            <div className="flex gap-1 items-center">
              <PowerIcon className="h-5 w-5 text-white" />
              <span>Đăng Xuất</span>
            </div>
          ) : (
            <div className="flex gap-1 items-center">
              <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-white" />
              <span className="font-bold">Đăng Nhập</span>
            </div>
          )}
        </ButtonLogout>
      </MenuWrapper>
    </SidebarStyled>
  );
}
