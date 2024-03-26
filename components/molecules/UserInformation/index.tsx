"use client";
import { Input } from "@nextui-org/react";
import classes from "./index.module.css";
import { useSession } from "next-auth/react";
import { FocusEvent, useMemo, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useWindowSize } from "@/hooks/window-size";
interface Props {}
export default function UserInformation(props: Props) {
  const session = useSession();
  const [userName, setUserName] = useState("");
  const [disable, setDisable] = useState(true);
  const { isMobile } = useWindowSize();

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
      <h3 className={`${classes["user-info__title"]} text-primary`}>
        Thông Tin Cơ Bản
      </h3>
      <div className="flex gap-2 flex-col">
        <div className={classes["user-info__row"]}>
          <Input
            type="text"
            label="Tên người dùng "
            labelPlacement={isMobile ? "outside" : "outside-left"}
            className="max-w-[400px]"
            classNames={{
              label: ["font-bold inline-block w-[150px]"],
            }}
            value={userName}
            disabled={disable}
            onBlur={handleOnBlurUserName}
            endContent={
              <PencilSquareIcon
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={() => setDisable(false)}
              ></PencilSquareIcon>
            }
          />
        </div>

        <div className={classes["user-info__row"]}>
          <div className={classes["label"]}>Email: </div>
          <div className={classes["value"]}>{userInfo?.email}</div>
        </div>
      </div>
    </div>
  );
}
