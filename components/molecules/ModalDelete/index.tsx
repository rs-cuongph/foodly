"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
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
}
export default function ModalDelete({ onSubmit, ...rest }: ModalDeleteProps) {
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
              Xác nhận xoá
            </ModalHeader>
            <ModalBody>
              <p>Bạn thực sự có muốn xoá không ?</p>
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
