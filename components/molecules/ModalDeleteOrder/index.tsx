"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useCallback } from "react";

interface ModalDeleteOrderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ModalDeleteOrder({ ...rest }: ModalDeleteOrderProps) {
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
              Confirm Deletion
            </ModalHeader>
            <ModalBody>
              <p>Do you really want to delete this order?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
