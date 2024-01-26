"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import { showNotify } from "@/provider/redux/reducer/common.reducer";
import { createOrder } from "@/provider/redux/thunk/order.thunk";
import { Room } from "@/provider/redux/types/room";
import { PAYMENT_METHODS } from "@/shared/constants";
import { generateQRImage } from "@/shared/helpers/generate";
import {
  BanknotesIcon,
  ChevronDoubleRightIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import clsx from "clsx";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ModalOrderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: Room;
}
export default function ModalOrder({ open, setOpen, data }: ModalOrderProps) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [quanlity, setQuanlity] = useState("1");
  const [coupons, setCoupons] = useState<{ value: string; label: string }[]>(
    []
  );
  const [foodSelected, setFoodSelected] = useState<string[]>([]);
  const [paymentSelected, setPaymentSelected] = useState<string>("");
  const loadingCreate = useAppSelector((state) => state.order.loadingCreate);

  const paymentMethods = useMemo(() => {
    if (!data) return [];
    return data.creator.payment_setting.map((i) => ({
      value: i.id,
      method: i.method,
      account_name: i.account_name,
      account_number: i.account_number,
      label: PAYMENT_METHODS.find((it) => it.value === i.method)?.label,
    }));
  }, [data?.creator?.payment_setting]);

  const infoQR = useMemo(() => {
    return paymentMethods.find((i) => i.value === paymentSelected);
  }, [paymentSelected, paymentMethods]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const foodItems = useMemo(() => {
    const items = data?.description
      .split(/\n/)
      .map((item) => item.replace(/^- /, ""));
    return items ?? [];
  }, [data]);

  const handleClose = useCallback(
    (close: () => void) => {
      if (step == 1) close();
      else {
        setStep((prev) => prev - 1);
      }
    },
    [step, setStep]
  );

  const onSubmit = useCallback(async () => {
    if (step == 1) setStep(2);
    else {
      const req = await dispatch(
        createOrder({
          room_id: data.id,
          content: foodSelected.join(", "),
          coupon_code: null,
          payment_method: paymentMethods.find(
            (i) => i.value === paymentSelected
          )?.method as string,
          quanlity: parseInt(quanlity),
          price: data.price,
        })
      );
      if (req.type === "order/create/rejected") {
      } else {
        dispatch(
          showNotify({
            messages: "Create Order Successfully",
            type: "success",
          })
        );
        setOpen(false);
      }
    }
  }, [
    step,
    setOpen,
    setStep,
    data,
    dispatch,
    paymentSelected,
    foodSelected,
    paymentMethods,
    quanlity,
  ]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentSelected(e.target.value);
  };

  useEffect(() => {
    if (open) {
      setStep(1);
      setPaymentSelected("");
      setFoodSelected([]);
      setQuanlity("1");
    }
  }, [open]);

  return (
    <Modal
      size={"2xl"}
      isOpen={open}
      onClose={onClose}
      isDismissable={false}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Your Order
            </ModalHeader>
            <ModalBody>
              {step === 1 && (
                <>
                  <CheckboxGroup
                    label="please choose your food"
                    defaultValue={[]}
                    value={foodSelected}
                    onValueChange={(v) => {
                      setFoodSelected(v);
                    }}
                  >
                    {foodItems.map((i, index) => {
                      return (
                        <Checkbox value={i} key={index}>
                          {i}
                        </Checkbox>
                      );
                    })}
                  </CheckboxGroup>
                  <Input
                    type="text"
                    label={"Quanlity"}
                    labelPlacement={"outside"}
                    placeholder="Enter quanlity"
                    value={quanlity}
                    maxLength={7}
                    classNames={{
                      input: "text-center",
                    }}
                    onValueChange={(value) => {
                      let _value = value.replace(/[^0-9]/g, "");
                      if (!_value?.length) _value = "1";
                      if (parseInt(_value) > 100) _value = "100";
                      setQuanlity(parseInt(_value).toString());
                    }}
                    startContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => {
                          setQuanlity((pre: string) => {
                            const v = parseInt(pre);
                            if (v > 1) return (v - 1).toString();
                            return "1";
                          });
                        }}
                      >
                        <MinusCircleIcon className="h-6 w-6 text-gray-500" />
                      </button>
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => {
                          setQuanlity((pre) => (parseInt(pre) + 1).toString());
                        }}
                      >
                        <PlusCircleIcon className="h-6 w-6 text-gray-500" />
                      </button>
                    }
                    className="max-w-[150px]"
                  />
                </>
              )}
              {step === 2 && (
                <div className="flex flex-col justify-center gap-2 items-center">
                  <div className="flex gap-2 w-[100%] sm:flex-row flex-col">
                    <Select
                      size={"sm"}
                      label="Select an payment method"
                      className="max-w-[220px]"
                      selectedKeys={[paymentSelected]}
                      onChange={handleSelectionChange}
                    >
                      {paymentMethods.map((pay) => {
                        return (
                          <SelectItem key={pay.value} value={pay.value}>
                            {pay.label}
                          </SelectItem>
                        );
                      })}
                    </Select>
                    <Select size={"sm"} label="Select an coupon" className="">
                      {coupons.map((cp) => {
                        return (
                          <SelectItem key={cp.value} value={cp.value}>
                            {cp.label}
                          </SelectItem>
                        );
                      })}
                    </Select>
                  </div>
                  {infoQR && (
                    <Image
                      width={300}
                      alt="NextUI hero Image"
                      src={generateQRImage(
                        infoQR.method,
                        infoQR.account_number,
                        infoQR.account_name,
                        data.price,
                        ""
                      )}
                    />
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={() => handleClose(onClose)}
              >
                {step === 1 ? "Close" : "Back"}
              </Button>
              <Button
                color="primary"
                onClick={onSubmit}
                className={clsx(
                  ((step === 1 && foodSelected.length === 0) ||
                    (step === 2 && paymentSelected.length === 0)) &&
                    "opacity-60"
                )}
                disabled={
                  (step === 1 && foodSelected.length === 0) ||
                  (step === 2 && paymentSelected.length === 0)
                }
                isLoading={loadingCreate}
              >
                {step === 1 && (
                  <ChevronDoubleRightIcon className="h-4 w-4 text-white" />
                )}
                {step === 2 && <BanknotesIcon className="h-4 w-4 text-white" />}
                {step === 1 ? "Next" : "I have paid"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
