"use client";
import { Input } from "@nextui-org/react";
import classes from "./index.module.css";
import { useSession } from "next-auth/react";
import {
  AwaitedReactNode,
  FocusEvent,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useMemo,
  useState,
} from "react";
interface Props {}
export default function MyDebtHistory(props: Props) {
  const session = useSession();
  const [userName, setUserName] = useState("");
  const [disable, setDisable] = useState(true);
  const userInfo = useMemo(() => {
    setUserName(session.data?.user.authenticated_data?.username);
    return session.data?.user.authenticated_data || null;
  }, [session.data]);

  const handleOnBlurUserName = (e: FocusEvent<Element>) => {
    const value = (e.target as HTMLInputElement).value;
    setDisable(true);
  };
  return (
    <div className="bg-white px-[30px] py-[30px] rounded-[10px] max-w-[768px]">
      <h3 className={`${classes["payment-setting__title"]} text-primary`}>
        Lịch sử nợ
      </h3>
      <div className="flex gap-2 flex-col"></div>
    </div>
  );
}
