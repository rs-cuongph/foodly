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
export default function PaymentSetting(props: Props) {
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
        Cài đặt thanh toán
      </h3>
      <div className="flex gap-2 flex-col">
        {userInfo.payment_setting.map(
          (setting: {
            id: string;
            method: string;
            account_name: string | number;
            account_number: string | number;
          }) => (
            <div
              className="px-4 py-2 w-fit rounded-[12px] bg-[#e4e4e7] mb-4"
              key={setting.id}
            >
              <p className="text-[14px]">
                <strong>Bank:</strong> {setting.method}
              </p>
              <p className="text-[14px]">
                <strong>Bank Account:</strong> {setting.account_name} /{" "}
                {setting.account_number}
              </p>
            </div>
          )
        )}
        {/* <Input
          type="text"
          label="Tên người dùng "
          labelPlacement={"outside-left"}
          classNames={{
            label: ["font-bold inline-block w-[150px]"],
          }}
        /> */}

        {/* <div className={classes["payment-setting__row"]}>
          <div className={classes["label"]}>Email: </div>
          <div className={classes["value"]}>{userInfo?.email}</div>
        </div> */}
      </div>
    </div>
  );
}
