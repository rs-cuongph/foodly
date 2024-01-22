"use client";

import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { FormCreateRoomType, useCreateRoomForm } from "./validate";
import { SHARE_SCOPE } from "@/shared/constants";
import { showNotify } from "@/provider/redux/reducer/common.reducer";
import {
  createRoom,
  fetchListRoom,
  fetchListUser,
} from "@/provider/redux/thunk/room.thunk";

export default function ModalCreateRoom() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(false);
  const dispatch = useAppDispatch();
  const form = useCreateRoomForm();
  const usersState = useAppSelector((state) => state.room.users);
  const { formState, getValues, setValue, watch, reset, register } = form;
  const { errors } = formState;
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = async (values: FormCreateRoomType) => {
    const action = await dispatch(
      createRoom({
        name: values.name,
        description: values.description,
        price: values.price,
        public_time_start: values.public_time_start
          ? dayjs(values.public_time_start).toString()
          : undefined,
        public_time_end: values.public_time_end
          ? dayjs(values.public_time_end).toString()
          : undefined,
        invited_people: values.invited_people,
        share_scope: values.share_scope,
      })
    );
    if (action.type === "rooms/create/rejected") {
      //
    } else {
      onClose();
      await Promise.all([
        dispatch(
          fetchListRoom({
            page: 1,
          })
        ),
        dispatch(
          showNotify({
            messages: "Create Successfully",
            type: "success",
          })
        ),
      ]);
    }
  };

  useEffect(() => {
    setUsers(
      usersState.items.map((user) => ({ label: user.username, value: user.id }))
    );
  }, [usersState]);

  useEffect(() => {
    if (getValues("share_scope") === SHARE_SCOPE.LIMIT) {
      dispatch(fetchListUser({ page: 1, page_size: 999 }));
    }
  }, [watch("share_scope")]);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    <>
      <Button
        variant="shadow"
        color="primary"
        size="md"
        onClick={() => {
          setOpen(true);
        }}
      >
        <PlusIcon className="h-6 w-6 text-white " />
        <span className="text-[13px] hidden sm:block">New Order</span>
      </Button>
      <Modal size={"lg"} isOpen={open} onClose={onClose} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={form.handleSubmit(onSubmit)} className={""}>
                <ModalHeader className="flex flex-col gap-1 text-center">
                  <div>CREATE NEW ORDER</div>
                </ModalHeader>
                <ModalBody>
                  {/* <Switch size="sm" isSelected={mode} onValueChange={setMode}>
                    Special Food
                  </Switch> */}
                  <Input
                    type="text"
                    label={"Name*"}
                    labelPlacement={"inside"}
                    isInvalid={!!errors?.name?.message?.length}
                    errorMessage={errors?.name?.message}
                    maxLength={100}
                    {...register("name")}
                  />
                  {!mode && (
                    <Textarea
                      label="Description"
                      placeholder=""
                      isInvalid={!!errors?.description?.message?.length}
                      errorMessage={errors?.description?.message}
                      maxLength={250}
                      {...register("description")}
                    />
                  )}
                  <div className="flex items-start gap-3">
                    <Input
                      type="datetime-local"
                      label=""
                      labelPlacement="outside"
                      className="w-[200px]"
                      isInvalid={!!errors?.public_time_start?.message?.length}
                      errorMessage={errors?.public_time_start?.message}
                      {...register("public_time_start")}
                    />
                    <span className="mt-2">~</span>
                    <Input
                      type="datetime-local"
                      label=""
                      labelPlacement="outside"
                      className="w-[200px]"
                      isInvalid={!!errors?.public_time_end?.message?.length}
                      errorMessage={errors?.public_time_end?.message}
                      {...register("public_time_end")}
                    />
                  </div>
                  {!mode && (
                    <Input
                      type="text"
                      label={"Price"}
                      labelPlacement={"inside"}
                      isInvalid={!!errors?.price?.message?.length}
                      errorMessage={errors?.price?.message}
                      value={watch("price")?.toString()}
                      maxLength={7}
                      onValueChange={(value) => {
                        let _value = value.replace(/[^0-9]/g, "");
                        if (!_value?.length) _value = "0";
                        if (parseInt(_value) > 1000000) _value = "1000000";
                        setValue("price", parseInt(_value));
                      }}
                    />
                  )}
                  {/* {mode && (
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Input
                          type="text"
                          size="sm"
                          labelPlacement={"outside"}
                          label=""
                          placeholder={"Enter food item"}
                          maxLength={100}
                        />
                        <Input
                          type="text"
                          size="sm"
                          labelPlacement={"outside"}
                          label=""
                          maxLength={7}
                          className="max-w-[150px]"
                        />
                      </div>
                    </div>
                  )} */}
                  <RadioGroup
                    label={"Share Scope"}
                    value={watch("share_scope")}
                    onValueChange={(value) => {
                      if (value === SHARE_SCOPE.PUBLIC) {
                        setValue("invited_people", []);
                      }
                      setValue("share_scope", value as SHARE_SCOPE);
                    }}
                    size="md"
                  >
                    <Radio
                      value={SHARE_SCOPE.PUBLIC}
                      description={"Anyone can see this order."}
                    >
                      Public
                    </Radio>
                    <Radio
                      value={SHARE_SCOPE.LIMIT}
                      description={"Only invited people can see this order."}
                    >
                      Limit
                    </Radio>
                  </RadioGroup>
                  {getValues("share_scope") === SHARE_SCOPE.LIMIT && (
                    <Select
                      label="Invite User"
                      selectionMode="multiple"
                      labelPlacement="inside"
                    >
                      {users.map((user) => (
                        <SelectItem key={user.value} value={user.value}>
                          {user.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit" isLoading={false}>
                    Submit
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
