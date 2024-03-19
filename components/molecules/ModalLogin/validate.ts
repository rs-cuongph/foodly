import yup from "@/shared/validate/yup-base";
import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type FormLoginType = {
  is_sign_in: boolean;
  email: string;
  password: string;
  re_password?: string;
  first_name?: string;
  last_name?: string;
};

const useLoginForm = () => {
  const validationScheme = useMemo(
    () =>
      yup.object().shape({
        is_sign_in: yup.boolean().required(),
        email: yup.string().label("loginForm.email").email().required(),
        password: yup.string().label("loginForm.password").required(),
        re_password: yup
          .string()
          .label("loginForm.re_password")
          .when("is_sign_in", {
            is: (value: boolean) => !value,
            then: (schema) => schema.required().sameAs("password"),
          }),
        first_name: yup
          .string()
          .when("is_sign_in", {
            is: (value: boolean) => !value,
            then: (schema) => schema.max(255),
          })
          .label("loginForm.first_name"),
        last_name: yup
          .string()
          .when("is_sign_in", {
            is: (value: boolean) => !value,
            then: (schema) => schema.max(255),
          })
          .label("loginForm.last_name"),
      }),
    []
  );

  return useForm<FormLoginType>({
    resolver: yupResolver(validationScheme) as any,
    shouldFocusError: true,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      is_sign_in: true,
      email: "",
      password: "",
    },
  });
};

export { useLoginForm };
export type { FormLoginType };
