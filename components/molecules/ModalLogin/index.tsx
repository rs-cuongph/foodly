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
import {
  getCurrentUser,
  signIn,
  signUp,
} from "@/provider/redux/thunk/auth.thunk";

export default function ModalLogin() {
  const stateModalLogin = useAppSelector((state) => state.auth.openModal);
  const dispatch = useAppDispatch();
  const form = useLoginForm();
  const { formState, getValues, setValue, watch, reset, register } = form;
  const { errors } = formState;
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const onClose = () => dispatch(setOpenModalLogin(false));

  const onSubmit = async (values: FormLoginType) => {
    try {
      if (values.is_sign_in) {
        await dispatch(
          signIn({
            email: values.email,
            password: values.password,
          })
        );
      } else {
        await dispatch(
          signUp({
            email: values.email,
            password: values.password,
            first_name: values.first_name,
            last_name: values.last_name,
          })
        );
      }
      await dispatch(getCurrentUser());
      onClose();
    } catch (error) {}
  };

  useEffect(() => {
    if (stateModalLogin) {
      setValue("is_sign_in", true);
      setIsVisible(false);
    }
  }, [stateModalLogin, setValue]);

  useEffect(() => {
    reset({
      email: undefined,
      password: undefined,
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
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={form.handleSubmit(onSubmit)} className={""}>
              <ModalHeader className="flex flex-col gap-1 text-center">
                {getValues("is_sign_in") ? "SIGN IN" : "SIGN UP"}
              </ModalHeader>
              <ModalBody>
                <div className="md:px-[25px] min-h-[200px]">
                  <div className="flex gap-4 flex-col ">
                    <Input
                      type="email"
                      label={"Email" + (getValues("is_sign_in") ? "" : "*")}
                      labelPlacement={"outside"}
                      placeholder="Enter your email"
                      description={""}
                      isInvalid={!!errors?.email?.message?.length}
                      errorMessage={errors?.email?.message}
                      {...register("email")}
                    />
                    <Input
                      label={"Password" + (getValues("is_sign_in") ? "" : "*")}
                      labelPlacement={"outside"}
                      placeholder="Enter your password"
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
                        label="Re-password*"
                        labelPlacement={"outside"}
                        placeholder="Re-enter your password"
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
                        label="First Name"
                        labelPlacement={"outside"}
                        placeholder="Enter your first name"
                        type="text"
                        className=""
                        isInvalid={!!errors?.first_name?.message?.length}
                        errorMessage={errors?.first_name?.message}
                        {...register("first_name")}
                      />
                    )}
                    {!getValues("is_sign_in") && (
                      <Input
                        label="Last Name"
                        labelPlacement={"outside"}
                        placeholder="Enter your last name"
                        type="text"
                        {...register("last_name")}
                        isInvalid={!!errors?.last_name?.message?.length}
                        errorMessage={errors?.last_name?.message}
                      />
                    )}
                  </div>
                  <p className="mt-5 text-center text-[13px]">
                    {getValues("is_sign_in")
                      ? "Don't have an account?"
                      : "Already have an account?"}{" "}
                    <Link
                      href="#"
                      underline="none"
                      className="text-[13px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setValue("is_sign_in", !getValues("is_sign_in"));
                      }}
                    >
                      {getValues("is_sign_in") ? "Sign Up" : "Sign In"}
                    </Link>{" "}
                    now
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  // isLoading={isLoading || isLoading2 || isLoading3}
                >
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
