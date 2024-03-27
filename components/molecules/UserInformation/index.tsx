"use client";
import classes from "./index.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { CheckCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useWindowSize } from "@/hooks/window-size";
import { FormBasicInfoType, useBasicInfoForm } from "./validate";
import ControlledInput from "@/components/atoms/ControlledInput";
import {
  hideLoading,
  showLoading,
} from "@/provider/redux/reducer/common.reducer";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import { updateUser } from "@/provider/redux/thunk/auth.thunk";
import { Button } from "@nextui-org/react";
interface Props {}
export default function UserInformation(props: Props) {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [disabled, setDisable] = useState(true);
  const loading = useAppSelector((state) => state.common.loading);
  const dispatch = useAppDispatch();
  const { isMobile } = useWindowSize();
  const basicInfoForm = useBasicInfoForm();
  const { formState, getValues, setValue, control, watch, handleSubmit } =
    basicInfoForm;
  const { errors } = formState;

  useEffect(() => {
    setValue("username", userInfo?.username || "");
  }, [userInfo?.username]);

  const onSubmit = async (values: FormBasicInfoType) => {
    dispatch(showLoading());
    const res = await dispatch(
      updateUser({
        username: values.username,
      })
    );
    if (res.type === "auth/update-user-info/fulfilled") {
      setDisable(true);
    }
    dispatch(hideLoading());
  };

  return (
    <div className="bg-white px-[30px] py-[30px] rounded-[10px] max-w-[768px]">
      <h3 className={`${classes["user-info__title"]} text-primary`}>
        Thông Tin Cơ Bản
      </h3>
      <div className="flex gap-2 flex-col">
        <div className={`${classes["user-info__row"]}`}>
          <div className="flex gap-2 items-center">
            <ControlledInput
              type="text"
              control={control}
              formField="username"
              label="Tên người dùng"
              labelPlacement={isMobile ? "outside" : "outside-left"}
              className="max-w-[400px]"
              classNames={{
                label: ["font-bold inline-block w-[150px]"],
              }}
              disabled={disabled}
              errorMessage={errors?.username?.message}
            />

            <Button
              type={"button"}
              size="sm"
              color="primary"
              variant="light"
              startContent={
                disabled ? (
                  <PencilSquareIcon className="h-6 w-6 text-primary"></PencilSquareIcon>
                ) : (
                  <CheckCircleIcon className="h-6 w-6 text-primary" />
                )
              }
              onClick={
                disabled ? () => setDisable(false) : handleSubmit(onSubmit)
              }
              isIconOnly={true}
            ></Button>
          </div>
        </div>

        <div className={classes["user-info__row"]}>
          <div className={classes["label"]}>Email: </div>
          <div className={classes["value"]}>{userInfo?.email}</div>
        </div>
      </div>
    </div>
  );
}
