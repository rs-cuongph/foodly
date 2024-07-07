import { useAppSelector } from "@/hooks/stores.hook";
import { Order } from "@/provider/redux/types/order";
import { PAYMENT_METHODS } from "@/shared/constants";
import { generateQRImage } from "@/shared/helpers/generate";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

export interface SubmitData {
  room_id?: string;
  order_id?: string;
  coupon_code?: string | null;
  payment_method: string;
}
interface ModalQrPaymentProps {
  open: boolean;
  onSubmit: (data: SubmitData) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  order: Order | undefined;
}
export default function ModalQrPayment({
  order,
  onSubmit,
  ...rest
}: ModalQrPaymentProps) {
  const loading = useAppSelector((state) => state.common.loading);
  const [paymentSelected, setPaymentSelected] = useState<string | undefined>();
  const [coupons, setCoupons] = useState<{ value: string; label: string }[]>(
    []
  );

  const onClose = useCallback(() => {
    rest.setOpen(false);
  }, [rest]);

  const paymentMethods = useMemo(() => {
    return order?.room?.creator?.payment_setting ?? [];
  }, [order]);

  const infoQR = useMemo(() => {
    return paymentMethods.find((i) => i.id === paymentSelected);
  }, [paymentMethods, paymentSelected]);

  const contentPayment = useMemo(() => {
    return `${order?.id} `;
  }, [order]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentSelected(e.target.value);
  };

  return (
    <Modal
      size={"xl"}
      isOpen={rest.open}
      onClose={onClose}
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {"Xác Nhận"}
            </ModalHeader>
            <ModalBody className="flex justify-center items-center">
              <div className="flex gap-2 w-[100%] sm:flex-row flex-col">
                <Select
                  size={"sm"}
                  label="Chọn cách thức thanh toán"
                  className="max-w-[220px]"
                  selectedKeys={paymentSelected ? [paymentSelected] : []}
                  onChange={handleSelectionChange}
                >
                  {paymentMethods.map((pay) => {
                    return (
                      <SelectItem key={pay.id} value={pay.id}>
                        {pay.method}
                      </SelectItem>
                    );
                  })}
                </Select>
                <Select size={"sm"} label="Chọn mã giảm giá" className="">
                  {coupons.map((cp) => {
                    return (
                      <SelectItem key={cp.value} value={cp.value}>
                        {cp.label}
                      </SelectItem>
                    );
                  })}
                </Select>
              </div>
              {order && infoQR && (
                <Image
                  width={300}
                  height={300}
                  alt="NextUI hero Image"
                  src={generateQRImage(
                    infoQR.method,
                    infoQR.account_number,
                    infoQR.account_name,
                    order.amount || 0,
                    contentPayment
                  )}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button
                color="primary"
                isDisabled={!paymentSelected}
                onPress={() => {
                  order &&
                    onSubmit({
                      room_id: order.room?.id,
                      coupon_code: null,
                      order_id: order?.id,
                      payment_method: paymentMethods.find(
                        (i) => i.id === paymentSelected
                      )?.method as string,
                    });
                }}
                isLoading={loading}
              >
                Đã Thanh Toán
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
