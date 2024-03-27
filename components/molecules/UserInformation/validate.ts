import yup from "@/shared/validate/yup-base";
import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type FormBasicInfoType = {
  username: string;
};

const useBasicInfoForm = () => {
  const validationScheme = useMemo(
    () =>
      yup.object().shape({
        username: yup
          .string()
          .label("edit_basic_info.username")
          .max(50)
          .required(),
      }),
    []
  );

  return useForm<FormBasicInfoType>({
    resolver: yupResolver(validationScheme),
    shouldFocusError: true,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });
};

export { useBasicInfoForm };
export type { FormBasicInfoType };
