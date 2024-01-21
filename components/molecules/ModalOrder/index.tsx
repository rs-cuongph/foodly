"use client";

import {
  BanknotesIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface ModalOrderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ModalOrder({ open, setOpen }: ModalOrderProps) {
  const [step, setStep] = useState(1);
  const onClose = useCallback(() => {
    console.log("object");
    setOpen(false);
  }, [setOpen]);

  const handleClose = useCallback(
    (close: () => void) => {
      console.log("handleClose");
      if (step == 1) close();
      else {
        setStep((prev) => prev - 1);
      }
    },
    [step, setStep]
  );

  const onSubmit = useCallback(() => {
    if (step == 1) setStep(2);
    else {
      setOpen(false);
    }
  }, [step, setOpen, setStep]);

  return (
    <Modal size={"2xl"} isOpen={open} onClose={onClose} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Your Order
            </ModalHeader>
            <ModalBody>
              {step === 1 && (
                <CheckboxGroup
                  label="please choose your food"
                  defaultValue={["buenos-aires", "london"]}
                >
                  <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
                  <Checkbox value="sydney">Sydney</Checkbox>
                  <Checkbox value="san-francisco">San Francisco</Checkbox>
                  <Checkbox value="london">London</Checkbox>
                  <Checkbox value="tokyo">Tokyo</Checkbox>
                </CheckboxGroup>
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
              <Button color="primary" onClick={onSubmit}>
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
