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
} from "@nextui-org/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";

interface ModalQrPaymentProps {
  open: boolean;
  onSubmit: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  order: Order | undefined;
}
export default function ModalQrPayment({
  order,
  onSubmit,
  ...rest
}: ModalQrPaymentProps) {
  const loading = useAppSelector((state) => state.common.loading);

  const onClose = useCallback(() => {
    rest.setOpen(false);
  }, [rest]);
  return (
    <Modal
      size={"md"}
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
            <ModalBody>
              {/* {order && (
                  <Image
                    width={300}
                    alt="NextUI hero Image"
                    src={generateQRImage(
                      order.payment_method,
                      infoQR.account_number,
                      infoQR.account_name,
                      data?.price || 0,
                      ""
                    )}
                  />
                )} */}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button color="primary" onPress={onSubmit} isLoading={loading}>
                Đã Thanh Toán
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
