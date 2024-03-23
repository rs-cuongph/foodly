import yup from "@/shared/validate/yup-base";
import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SHARE_SCOPE } from "@/shared/constants";

type FormCreateRoomType = {
  name: string;
  description?: string | null;
  public_time_start?: string;
  public_time_end?: string;
  price?: number;
  share_scope: SHARE_SCOPE;
  invited_people: [] | string[];
};

const useCreateRoomForm = () => {
  const validationScheme = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().label("room.name").max(255).required(),
        description: yup.string().label("room.description").max(255),
        public_time_end: yup
          .string()
          .label("room.public_time_end")
          .minDate("public_time_start"),
        public_time_start: yup
          .string()
          .label("room.public_time_start")
          .when("public_time_end", {
            is: (value?: string) => !!value?.length,
            then: (schema) => schema.required(),
          }),
        price: yup.number().label("room.price"),
        share_scope: yup.string().label("room.share_scope").required(),
        invited_people: yup
          .array()
          .of(yup.string())
          .label("room.invited_people"),
      }),
    []
  );

  return useForm<FormCreateRoomType>({
    resolver: yupResolver(validationScheme) as any,
    shouldFocusError: true,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      public_time_start: undefined,
      public_time_end: undefined,
      price: 0,
      share_scope: SHARE_SCOPE.PUBLIC,
      invited_people: [],
    },
  });
};

export { useCreateRoomForm };
export type { FormCreateRoomType };
