import { Input } from "@nextui-org/react";
import {
  Control,
  Controller,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";

interface InputProps {
  type: string;
  label?: string;
  errorMessage?: string;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  onChange?: (value: string) => void;
}
interface OwnProps<Type extends FieldValues> extends Omit<InputProps, "value"> {
  control: Control<FieldValue<Type>>;
  formField: Path<FieldValue<Type>>;
}
export default function ControlledInput<T extends FieldValues>({
  formField,
  control,
  ...props
}: OwnProps<T>): JSX.Element {
  return (
    <Controller
      control={control}
      name={formField}
      render={({ field }) => (
        <Input
          type={props?.type || "text"}
          label={props?.label}
          labelPlacement={props?.labelPlacement || "inside"}
          placeholder={props?.placeholder}
          isInvalid={!!props?.errorMessage?.length}
          errorMessage={props?.errorMessage}
          maxLength={props?.maxLength}
          className={props?.className}
          {...field}
          onValueChange={(value) => {
            field.onChange(value);
            props?.onChange?.(value);
          }}
        />
      )}
    />
  );
}
