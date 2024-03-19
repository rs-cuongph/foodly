"use client";

import { useAppDispatch } from "@/hooks/stores.hook";
import { deleteRoom } from "@/provider/redux/thunk/room.thunk";
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
  roomId: string;
  open: boolean;
  onDeleteSuccess: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ModalDeleteOrder({
  roomId,
  onDeleteSuccess,
  ...rest
}: ModalDeleteOrderProps) {
  const dispatch = useAppDispatch();

  const onClose = useCallback(() => {
    rest.setOpen(false);
  }, [rest]);

  const onSubmit = async () => {
    const res = await dispatch(deleteRoom(roomId));
    if (res.type === "room/delete/fulfilled") {
      rest.setOpen(false);
      onDeleteSuccess();
    }
  };

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
              <Button color="primary" onPress={onSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
