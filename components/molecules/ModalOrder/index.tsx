import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import {
  hideLoading,
  setOpenModalOrder,
  setOrderIForModalOrder,
  setRoomIForModalOrder,
  showLoading,
  showNotify,
} from "@/provider/redux/reducer/common.reducer";
import { setSearchQuery } from "@/provider/redux/reducer/order.reducer";
import { setParams } from "@/provider/redux/reducer/room.reducer";
import {
  confirmPaid,
  createOrder,
  editOrder,
} from "@/provider/redux/thunk/order.thunk";
import { Order } from "@/provider/redux/types/order";
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
import { delay } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ModalOrderProps {}
export default function ModalOrder({}: ModalOrderProps) {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.common.modalOrderState.open);
  const room = useAppSelector((state) => state.common.modalOrderState.room);
  const order = useAppSelector((state) => state.common.modalOrderState.order);

  const [orderCreated, setOrder] = useState<Order | null>(null);
  const [step, setStep] = useState(1);
  const [quanlity, setQuanlity] = useState("1");
  const [coupons, setCoupons] = useState<{ value: string; label: string }[]>(
    []
  );
  const [foodSelected, setFoodSelected] = useState<string[]>([]);
  const [paymentSelected, setPaymentSelected] = useState<string>("");
  const loading = useAppSelector((state) => state.common.loading);

  const paymentMethods = useMemo(() => {
    if (!room) return [];
    return room.creator.payment_setting.map((i) => ({
      value: i.id,
      method: i.method,
      account_name: i.account_name,
      account_number: i.account_number,
      label: PAYMENT_METHODS.find((it) => it.value === i.method)?.label,
    }));
  }, [room?.creator?.payment_setting]);

  const infoQR = useMemo(() => {
    return paymentMethods.find((i) => i.value === paymentSelected);
  }, [paymentSelected, paymentMethods]);

  const onClose = useCallback(() => {
    dispatch(setOpenModalOrder(false));
    dispatch(setRoomIForModalOrder(null));
    dispatch(setOrderIForModalOrder(null));
  }, []);

  const foodItems = useMemo(() => {
    const items = room?.description
      .split(/\n/)
      .map((item: string) => item.replace(/^- /, ""));
    return items ?? [];
  }, [room]);

  const callApiToCreateNewOrder = useCallback(async () => {
    if (!room) return;
    const res = await dispatch(
      createOrder({
        room_id: room.id,
        content: foodSelected.join(", "),
        coupon_code: null,
        payment_method: paymentMethods.find((i) => i.value === paymentSelected)
          ?.method as string,
        quanlity: parseInt(quanlity),
        price: room.price,
      })
    );

    if (res.type === "order/create/rejected") {
    } else {
      setOrder(res.payload as Order);
      setStep(2);
      dispatch(
        showNotify({
          messages: "Đặt thành công",
          type: "success",
          duration: 3000,
        })
      );
      dispatch(
        setSearchQuery({
          room_id: room.id,
          page: 1,
        })
      );
      dispatch(
        setParams({
          page: 1,
        })
      );
    }
    dispatch(hideLoading());
  }, [step, setStep, room, dispatch, foodSelected, quanlity]);

  const callApiToConfirmPaid = useCallback(async () => {
    if (!room) return;
    const res = await dispatch(
      confirmPaid({
        room_id: room.id,
        order_id: orderCreated?.id!,
        coupon_code: null,
        payment_method: paymentMethods.find((i) => i.value === paymentSelected)
          ?.method as string,
      })
    );

    if (res.type === "order/confirm-paid/rejected") {
    } else {
      dispatch(
        setSearchQuery({
          room_id: room.id,
          page: 1,
        })
      );

      dispatch(setOpenModalOrder(false));
    }
    dispatch(hideLoading());
  }, [
    step,
    setStep,
    dispatch,
    paymentSelected,
    foodSelected,
    paymentMethods,
    quanlity,
  ]);

  const onCreate = useCallback(async () => {
    dispatch(showLoading());
    if (step == 1) {
      await callApiToCreateNewOrder();
    } else {
      await callApiToConfirmPaid();
    }
  }, [
    step,
    setStep,
    room,
    dispatch,
    paymentSelected,
    foodSelected,
    paymentMethods,
    quanlity,
  ]);

  const onEdit = useCallback(async () => {
    if (!room || !order) return;
    dispatch(showLoading());
    const res = await dispatch(
      editOrder({
        room_id: room.id,
        order_id: order.id,
        content: foodSelected.join(", "),
        quanlity: parseInt(quanlity),
        price: order.price,
      })
    );
    if (res.type === "order/edit/fulfilled") {
      dispatch(
        showNotify({
          messages: "Sửa thành công",
          type: "success",
          duration: 3000,
        })
      );
      dispatch(
        setSearchQuery({
          room_id: room.id,
          page: 1,
        })
      );
      dispatch(setOpenModalOrder(false));
    }
    dispatch(hideLoading());
  }, [room, order, quanlity, foodSelected]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentSelected(e.target.value);
  };

  useEffect(() => {
    if (open) {
      dispatch(hideLoading());
      setStep(1);
      if (order) {
        setQuanlity(order.quanlity.toString());
        setFoodSelected(order.content.split(", "));
      } else {
        setPaymentSelected("");
        setFoodSelected([]);
        setQuanlity("1");
      }
    }
  }, [open, order]);

  useEffect(() => {
    let timerId = 0;
    if (step === 2) {
      dispatch(showLoading());
      timerId = delay(() => {
        dispatch(hideLoading());
      }, 2000);
    }
    return () => clearTimeout(timerId);
  }, [step]);

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
              {order ? "Chỉnh Sửa Đơn" : " Xác Nhận Đơn"}
            </ModalHeader>
            <ModalBody>
              {step === 1 && (
                <>
                  <CheckboxGroup
                    label="Vui lòng chọn món: "
                    // orientation="horizontal"
                    defaultValue={[]}
                    value={foodSelected}
                    onValueChange={(v) => {
                      setFoodSelected(v);
                    }}
                  >
                    {foodItems.map((i, index) => {
                      return (
                        <Checkbox
                          value={i}
                          key={index}
                          style={{
                            minWidth: "50%",
                          }}
                        >
                          {i}
                        </Checkbox>
                      );
                    })}
                  </CheckboxGroup>
                  <Input
                    type="text"
                    label={"Số lượng"}
                    labelPlacement={"outside"}
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
                        room?.price || 0,
                        ""
                      )}
                    />
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              {step === 1 && (
                <Button color="danger" variant="light" onClick={onClose}>
                  {"Đóng"}
                </Button>
              )}
              {order ? (
                <Button color="primary" onClick={onEdit}>
                  Lưu
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={onCreate}
                  className={clsx(
                    ((step === 1 && foodSelected.length === 0) ||
                      (step === 2 && paymentSelected.length === 0)) &&
                      "opacity-60"
                  )}
                  disabled={
                    (step === 1 && foodSelected.length === 0) ||
                    (step === 2 && paymentSelected.length === 0)
                  }
                  isLoading={loading}
                >
                  {step === 1 && (
                    <ChevronDoubleRightIcon className="h-4 w-4 text-white" />
                  )}
                  {step === 2 && (
                    <BanknotesIcon className="h-4 w-4 text-white" />
                  )}
                  {step === 1 ? "Tiếp" : "Đã Thanh Toán"}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
