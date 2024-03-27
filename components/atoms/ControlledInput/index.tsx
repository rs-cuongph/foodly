import { Input, SlotsToClasses } from "@nextui-org/react";
import { FocusEventHandler, ReactNode, FocusEvent } from "react";
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
  size?: "sm" | "md" | "lg";
  classNames?:
    | SlotsToClasses<
        | "description"
        | "base"
        | "input"
        | "label"
        | "errorMessage"
        | "mainWrapper"
        | "inputWrapper"
        | "innerWrapper"
        | "clearButton"
        | "helperWrapper"
      >
    | undefined;
  onChange?: (value: string) => void;
  disabled?: boolean;
  endContent?: ReactNode;
  onBlur?: (e: FocusEvent<Element>) => void;
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
          size={props?.size}
          type={props?.type || "text"}
          label={props?.label}
          labelPlacement={props?.labelPlacement || "inside"}
          placeholder={props?.placeholder}
          isInvalid={!!props?.errorMessage?.length}
          errorMessage={props?.errorMessage}
          maxLength={props?.maxLength}
          className={props?.className}
          classNames={props?.classNames}
          endContent={props.endContent}
          {...field}
          isDisabled={props?.disabled}
          onValueChange={(value) => {
            field.onChange(value);
            props?.onChange?.(value);
          }}
          onBlur={props.onBlur}
        />
      )}
    />
  );
}
