"use client";
import { Button } from "@nextui-org/react";
import classes from "./index.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { BanknotesIcon, PlusIcon } from "@heroicons/react/24/solid";
import ControlledInput from "@/components/atoms/ControlledInput";
import { FormPaymentSettingType, usePaymentSettingForm } from "./validate";
import { PAYMENT_METHODS } from "@/shared/constants";
import Image from "next/image";
import CashImg from "@/public/bank-images/cash.png";
import VcbImg from "@/public/bank-images/vietcombank.png";
import VpbImg from "@/public/bank-images/vpbank.svg";
import ControlledSelect from "@/components/atoms/ControlledSelect";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import {
  hideLoading,
  showLoading,
} from "@/provider/redux/reducer/common.reducer";
import { updateUser } from "@/provider/redux/thunk/auth.thunk";
import { setPaymentSetting } from "@/provider/redux/reducer/auth.reducer";
import { UserInfo } from "@/provider/redux/types/auth";
import { capitalize } from "@/shared/helpers/capitalize";
import { lowerCase } from "lodash";

interface Props {}
export default function PaymentSetting(props: Props) {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const loading = useAppSelector((state) => state.common.loading);
  const dispatch = useAppDispatch();
  const [openBlockAddPayment, setOpenBlockAddPayment] = useState(false);

  const paymentSettingForm = usePaymentSettingForm();
  const { formState, reset, control, watch, handleSubmit } = paymentSettingForm;
  const { errors } = formState;

  const getIcon = (key: string) => {
    switch (key) {
      case "cash":
        return (
          <Image
            width={50}
            height={50}
            src={CashImg.src}
            alt="cash"
            className={classes["logo"]}
          />
        );
      case "vietcombank":
        return (
          <Image width={50} height={50} src={VcbImg.src} alt="vietcombank" />
        );
      case "vpbank":
        return (
          <Image width={50} height={50} src={VpbImg.src} alt="vietcombank" />
        );
      default:
        return "";
    }
  };

  const onSubmit = async (values: FormPaymentSettingType) => {
    dispatch(showLoading());
    const res = await dispatch(
      updateUser({
        payment_setting: [
          ...(userInfo?.payment_setting as FormPaymentSettingType[]),
          {
            ...values,
            method: lowerCase(values.method),
            account_name: capitalize(values.account_name),
          },
        ],
      })
    );
    if (res.type === "auth/update-user-info/fulfilled") {
      dispatch(
        setPaymentSetting((res.payload as UserInfo["info"]).payment_setting)
      );
      reset();
      setOpenBlockAddPayment(false);
    }
    dispatch(hideLoading());
  };

  return (
    <div className="bg-white px-[30px] py-[30px] rounded-[10px] max-w-[768px]">
      <h3 className={`${classes["payment-setting__title"]} text-primary`}>
        Cài Đặt Thanh Toán
      </h3>
      <div className="flex gap-2 flex-col">
        {(userInfo?.payment_setting || []).map((setting) => (
          <div
            className="px-4 py-2 w-fit rounded-[12px] bg-[#e4e4e7]"
            key={setting.id}
          >
            <p className="text-[14px]">
              <strong>Phương thức:</strong> {setting.method?.toUpperCase()}
            </p>
            {setting.method !== "cash" && (
              <p className="text-[14px]">
                <strong>Tên/Số thẻ:</strong> {setting.account_name} /{" "}
                {setting.account_number}
              </p>
            )}
          </div>
        ))}
      </div>
      {openBlockAddPayment && (
        <div className="px-5 py-3 mb-2 bg-gray-200 rounded-lg w-[400px]  mt-4">
          <form
            className="flex gap-2 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <ControlledSelect
              options={PAYMENT_METHODS.map((pay) => ({
                ...pay,
                startContent: getIcon(pay.value),
              }))}
              size={"sm"}
              label="Phương thức"
              control={control}
              formField={"method"}
              labelPlacement="outside-left"
              classNames={{
                label: ["min-w-[100px] font-bold"],
                base: ["items-center"],
              }}
              errorMessage={errors?.method?.message}
            />
            {watch("method") !== "cash" && (
              <>
                <ControlledInput
                  label="Tên"
                  type="text"
                  control={control}
                  formField={"account_name"}
                  size={"sm"}
                  labelPlacement={"outside-left"}
                  classNames={{
                    label: ["min-w-[100px] font-bold"],
                  }}
                  errorMessage={errors?.account_name?.message}
                />
                <ControlledInput
                  label="Số Thẻ"
                  type="text"
                  control={control}
                  formField={"account_number"}
                  size={"sm"}
                  labelPlacement={"outside-left"}
                  classNames={{
                    label: ["min-w-[100px] font-bold"],
                  }}
                  errorMessage={errors?.account_number?.message}
                />
              </>
            )}
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                size="sm"
                color="primary"
                variant="shadow"
                startContent={<PlusIcon className="h-4 w-4 " />}
              >
                Lưu
              </Button>
            </div>
          </form>
        </div>
      )}
      {!openBlockAddPayment &&
        userInfo?.payment_setting &&
        userInfo.payment_setting.length <= 3 && (
          <Button
            className="mt-2"
            size="sm"
            color="primary"
            variant="bordered"
            startContent={<PlusIcon className="h-4 w-4 text-primary" />}
            onClick={() => {
              if (userInfo?.payment_setting?.length > 3) return;
              setOpenBlockAddPayment(true);
            }}
          >
            Thêm
          </Button>
        )}
    </div>
  );
}
