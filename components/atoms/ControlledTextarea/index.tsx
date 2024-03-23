import { Textarea } from "@nextui-org/react";
import {
  Control,
  Controller,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";

interface InputProps {
  label?: string;
  errorMessage?: string;
  maxLength?: number;
  placeholder?: string;
}
interface OwnProps<Type extends FieldValues>
  extends Omit<InputProps, "onChange" | "value"> {
  control: Control<FieldValue<Type>>;
  formField: Path<FieldValue<Type>>;
}
export default function ControlledTextarea<T extends FieldValues>({
  formField,
  control,
  ...props
}: OwnProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={formField}
      render={({ field }) => (
        <Textarea
          label={props?.label}
          labelPlacement={"inside"}
          isInvalid={!!props?.errorMessage?.length}
          errorMessage={props?.errorMessage}
          maxLength={props?.maxLength}
          {...field}
        />
      )}
    />
  );
}
