"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import { setOpenModalLogin } from "@/provider/redux/reducer/auth.reducer";
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FormLoginType, useLoginForm } from "./validate";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { signUp } from "@/provider/redux/thunk/auth.thunk";
import { signIn } from "next-auth/react";
import {
  hideLoading,
  showLoading,
  showNotifyAction,
} from "@/provider/redux/reducer/common.reducer";
import { delay } from "lodash";

export default function ModalLogin() {
  const stateModalLogin = useAppSelector((state) => state.auth.openModal);
  const dispatch = useAppDispatch();
  const form = useLoginForm();
  const { formState, getValues, setValue, watch, reset, register, setError } =
    form;
  const { errors } = formState;
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const isLoading = useAppSelector((state) => state.common.loading);
  const onClose = () => dispatch(setOpenModalLogin(false));

  const onSubmit = async (values: FormLoginType) => {
    if (values.is_sign_in) {
      dispatch(showLoading());
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      dispatch(hideLoading());
      if (res?.error) {
        dispatch(
          showNotifyAction({
            messages: "Email hoặc mật khẩu không đúng",
            type: "error",
          })
        );
        return;
      }
      dispatch(
        showNotifyAction({
          messages: "Đăng nhập thành công",
          type: "success",
        })
      );
      onClose();
    } else {
      dispatch(showLoading());
      const res = await dispatch(
        signUp({
          email: values.email,
          password: values.password,
          first_name: values.first_name,
          last_name: values.last_name,
        })
      );
      dispatch(hideLoading());
      if ("error" in res) {
        dispatch(
          showNotifyAction({
            messages: res.error["message"] ?? "",
            type: "error",
          })
        );
        return;
      }
      setValue("is_sign_in", true);
      dispatch(
        showNotifyAction({
          messages: "Đăng ký thành công",
          type: "success",
        })
      );

      delay(() => {
        setValue("email", values.email);
        setValue("password", values.password);
      }, 500);
    }
  };

  useEffect(() => {
    if (stateModalLogin) {
      setValue("is_sign_in", true);
      setIsVisible(false);
    }
  }, [stateModalLogin, setValue]);

  useEffect(() => {
    reset({
      email: "",
      password: "",
      first_name: undefined,
      last_name: undefined,
      is_sign_in: getValues("is_sign_in"),
    });
  }, [watch("is_sign_in"), reset, getValues]);

  return (
    <Modal
      size={"lg"}
      isOpen={stateModalLogin}
      onClose={onClose}
      isDismissable={false}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={form.handleSubmit(onSubmit)} className={""}>
              <ModalHeader className="flex flex-col gap-1 text-center">
                {getValues("is_sign_in") ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
              </ModalHeader>
              <ModalBody>
                <div className="md:px-[25px] min-h-[200px]">
                  <div className="flex gap-4 flex-col ">
                    <Input
                      type="email"
                      label={"Email" + (getValues("is_sign_in") ? "" : "*")}
                      labelPlacement={"outside"}
                      placeholder="Nhập email"
                      description={""}
                      isInvalid={!!errors?.email?.message?.length}
                      errorMessage={errors?.email?.message}
                      {...register("email")}
                    />
                    <Input
                      label={"Mật khẩu" + (getValues("is_sign_in") ? "" : "*")}
                      labelPlacement={"outside"}
                      placeholder="Nhập mật khẩu"
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => setIsVisible(!isVisible)}
                        >
                          {isVisible ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                      isInvalid={!!errors?.password?.message?.length}
                      errorMessage={errors?.password?.message}
                      {...register("password")}
                    />
                    {!getValues("is_sign_in") && (
                      <Input
                        label="Xác nhận mật khẩu*"
                        labelPlacement={"outside"}
                        placeholder="Nhập lại mật khẩu"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() => setIsVisible2(!isVisible2)}
                          >
                            {isVisible2 ? (
                              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        }
                        type={isVisible2 ? "text" : "password"}
                        isInvalid={!!errors?.re_password?.message?.length}
                        errorMessage={errors?.re_password?.message}
                        {...register("re_password")}
                      />
                    )}
                    {!getValues("is_sign_in") && (
                      <Input
                        label="Họ và tên đệm"
                        labelPlacement={"outside"}
                        placeholder="Nhập họ và tên đệm"
                        type="text"
                        className=""
                        isInvalid={!!errors?.first_name?.message?.length}
                        errorMessage={errors?.first_name?.message}
                        {...register("first_name")}
                      />
                    )}
                    {!getValues("is_sign_in") && (
                      <Input
                        label="Tên"
                        labelPlacement={"outside"}
                        placeholder="Nhập tên"
                        type="text"
                        {...register("last_name")}
                        isInvalid={!!errors?.last_name?.message?.length}
                        errorMessage={errors?.last_name?.message}
                      />
                    )}
                  </div>
                  <p className="mt-5 text-center text-[13px]">
                    {getValues("is_sign_in")
                      ? "Bạn không có tài khoản?"
                      : "Bạn đã có tài khoản?"}{" "}
                    <Link
                      href="#"
                      underline="none"
                      className="text-[13px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setValue("is_sign_in", !getValues("is_sign_in"));
                      }}
                    >
                      {getValues("is_sign_in") ? "Đăng Ký" : "Đăng Nhập"}
                    </Link>{" "}
                    ngay bây giờ
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading}>
                  {"Xác Nhận"}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
