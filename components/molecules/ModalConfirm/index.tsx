"use client";

import { useAppSelector } from "@/hooks/stores.hook";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useCallback } from "react";

interface ModalDeleteProps {
  open: boolean;
  onSubmit: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  content?: string;
}
export default function ModalConfirm({
  onSubmit,
  title = "Xác Nhận",
  content = "Bạn chắc chắn chưa?",
  ...rest
}: ModalDeleteProps) {
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
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{content}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button color="primary" onPress={onSubmit} isLoading={loading}>
                Xác nhận
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
