import yup from "@/shared/validate/yup-base";
import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type FormPaymentSettingType = {
  method: string;
  account_name?: string;
  account_number?: string;
};

const usePaymentSettingForm = () => {
  const validationScheme = useMemo(
    () =>
      yup.object().shape({
        method: yup
          .string()
          .label("add_payment_setting.method")
          .requiredSelect(),
        account_name: yup
          .string()
          .label("add_payment_setting.account_name")
          .when("method", {
            is: (val: string) => val !== "cash" && val?.length > 0,
            then: (schema) => schema.max(255).required(),
          }),
        account_number: yup
          .string()
          .label("add_payment_setting.account_number")
          .when("method", {
            is: (val: string) => val !== "cash" && val?.length > 0,
            then: (schema) => schema.max(32).required(),
          }),
      }),
    []
  );

  return useForm<FormPaymentSettingType>({
    resolver: yupResolver(validationScheme) as any,
    shouldFocusError: true,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      method: "cash",
      account_name: "",
      account_number: "",
    },
  });
};

export { usePaymentSettingForm };
export type { FormPaymentSettingType };
