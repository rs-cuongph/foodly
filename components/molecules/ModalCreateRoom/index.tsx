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
import { FormCreateRoomType, useCreateRoomForm } from "./validate";
import { SHARE_SCOPE } from "@/shared/constants";
import {
  hideLoading,
  showLoading,
  showNotify,
} from "@/provider/redux/reducer/common.reducer";
import {
  createRoom,
  editRoom,
  fetchListRoom,
  fetchListUser,
} from "@/provider/redux/thunk/room.thunk";
import { useSession } from "next-auth/react";
import { setOpenModalCreateRoom } from "@/provider/redux/reducer/room.reducer";
import { delay } from "lodash";
import ControlledInput from "@/components/atoms/ControlledInput";
import ControlledTextarea from "@/components/atoms/ControlledTextarea";
import { Room } from "@/provider/redux/types/room";

interface CreateRoomProps {
  editData?: Room;
}

export default function ModalCreateRoom({ editData }: CreateRoomProps) {
  const [mode, setMode] = useState(false);
  const session = useSession();
  const dispatch = useAppDispatch();
  const form = useCreateRoomForm();
  const usersState = useAppSelector((state) => state.room.users);
  const open = useAppSelector((state) => state.room.isOpenModalCreateOrder);
  const { formState, getValues, setValue, watch, reset, register, control } =
    form;
  const { errors } = formState;
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const onClose = () => {
    dispatch(setOpenModalCreateRoom(false));
  };

  const onSubmit = async (values: FormCreateRoomType) => {
    dispatch(showLoading());
    const action = await dispatch(
      editData
        ? editRoom({
            id: editData.id,
            name: values.name,
            description: values.description,
            price: values.price,
            public_time_start: values.public_time_start
              ? dayjs(values.public_time_start).toISOString()
              : undefined,
            public_time_end: values.public_time_end
              ? dayjs(values.public_time_end).toISOString()
              : undefined,
            invited_people: values.invited_people,
            share_scope: values.share_scope,
          })
        : createRoom({
            name: values.name,
            description: values.description,
            price: values.price,
            public_time_start: values.public_time_start
              ? dayjs(values.public_time_start).toISOString()
              : undefined,
            public_time_end: values.public_time_end
              ? dayjs(values.public_time_end).toISOString()
              : undefined,
            invited_people: values.invited_people,
            share_scope: values.share_scope,
          })
    );
    if (
      action.type === "rooms/create/rejected" ||
      action.type === "rooms/edit/rejected"
    ) {
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
            messages: editData ? "Sửa thành công" : "Tạo thành công",
            type: "success",
          })
        ),
      ]);
    }
    dispatch(hideLoading());
  };

  useEffect(() => {
    setUsers(
      usersState.items.map((user) => ({ label: user.username, value: user.id }))
    );
  }, [usersState]);

  useEffect(() => {
    // if (getValues("share_scope") === SHARE_SCOPE.LIMIT) {
    //   dispatch(fetchListUser({ page: 1, page_size: 999 }));
    // }
  }, [watch("share_scope")]);

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          description: editData.description,
          name: editData.name,
          price: editData.price,
          public_time_start: dayjs(editData.public_time_start).format(
            "YYYY-MM-DD HH:mm"
          ),
          public_time_end: dayjs(editData.public_time_end).format(
            "YYYY-MM-DD HH:mm"
          ),
          share_scope: editData.share_scope as SHARE_SCOPE,
          invited_people: [],
        });
      } else {
        reset();
      }
    }
  }, [open]);

  return (
    <>
      <Modal size="lg" isOpen={open} onClose={onClose} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={form.handleSubmit(onSubmit)} className={""}>
                <ModalHeader className="flex flex-col gap-1 text-center">
                  <div>{editData ? "Chỉnh Sửa" : "Tạo Mới"} </div>
                </ModalHeader>
                <ModalBody>
                  <ControlledInput
                    label="Tên nhóm"
                    type="text"
                    control={control}
                    formField={"name"}
                    errorMessage={errors?.description?.message}
                  />
                  {!mode && (
                    <ControlledTextarea
                      label="Thực đơn"
                      control={control}
                      formField={"description"}
                      errorMessage={errors?.description?.message}
                      maxLength={250}
                    />
                  )}
                  <div className="flex items-start gap-3">
                    <ControlledInput
                      type="datetime-local"
                      labelPlacement="outside"
                      className="w-[200px]"
                      control={control}
                      formField={"public_time_start"}
                      errorMessage={errors?.public_time_start?.message}
                    />
                    <span className="mt-2">~</span>
                    <ControlledInput
                      type="datetime-local"
                      labelPlacement="outside"
                      className="w-[200px]"
                      control={control}
                      formField={"public_time_end"}
                      errorMessage={errors?.public_time_end?.message}
                    />
                  </div>
                  {!mode && (
                    <ControlledInput
                      type="text"
                      label={"Giá"}
                      labelPlacement="inside"
                      className="w-[200px]"
                      control={control}
                      formField={"price"}
                      maxLength={7}
                      errorMessage={errors?.price?.message}
                      onChange={(value) => {
                        let _value = value.replace(/[^0-9]/g, "");
                        if (!_value?.length) _value = "0";
                        if (parseInt(_value) > 1000000) _value = "1000000";
                        setValue("price", parseInt(_value));
                      }}
                    />
                  )}
                  {/* <RadioGroup
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
                  </RadioGroup> */}
                  {/* {getValues("share_scope") === SHARE_SCOPE.LIMIT && (
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
                  )} */}
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
