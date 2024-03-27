import { Select, SelectItem, SlotsToClasses } from "@nextui-org/react";
import { ChangeEventHandler, ReactNode, useMemo } from "react";
import {
  Control,
  Controller,
  FieldValue,
  FieldValues,
  Path,
} from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export interface Option {
  label: string | number | ReactNode;
  value: string | number;
  startContent?: ReactNode;
  endContent?: ReactNode;
}
interface SelectProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  labelPlacement?: "inside" | "outside" | "outside-left";
  classNames?: SlotsToClasses<
    | "description"
    | "base"
    | "label"
    | "value"
    | "listbox"
    | "spinner"
    | "errorMessage"
    | "mainWrapper"
    | "innerWrapper"
    | "helperWrapper"
    | "trigger"
    | "selectorIcon"
    | "listboxWrapper"
    | "popoverContent"
  >;
  className?: string;
  options: Option[];
  errorMessage?: string;
}

interface OwnProps<Type extends FieldValues>
  extends Omit<SelectProps, "value"> {
  control: Control<FieldValue<Type>>;
  formField: Path<FieldValue<Type>>;
}
export default function ControlledSelect<T extends FieldValues>({
  formField,
  control,
  ...props
}: OwnProps<T>): JSX.Element {
  const options = useMemo(() => {
    return props.options.map((i) => ({ ...i, _id: uuidv4() }));
  }, [props.options]);

  return (
    <Controller
      control={control}
      name={formField}
      render={({ field }) => (
        <Select
          size={props.size}
          label={props.label}
          selectedKeys={[field.value]}
          onChange={(v) => {
            field.onChange(v);
          }}
          labelPlacement={props.labelPlacement}
          classNames={props.classNames}
          className={props.className}
          errorMessage={props.errorMessage}
        >
          {options.map((pay) => {
            return (
              <SelectItem
                key={pay.value}
                value={pay.value}
                startContent={pay.startContent}
              >
                {pay.label}
              </SelectItem>
            );
          })}
        </Select>
      )}
    />
  );
}
