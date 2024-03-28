import { ChipProps } from "@nextui-org/react";

const columns = [
  { name: "Ngày", uid: "created_at", sortable: true, width: "110px" },
  { name: "ID Nhóm", uid: "room_id", sortable: true },
  { name: "Tên Nhóm", uid: "room_name" },
  { name: "Người đặt", uid: "creator" },
  { name: "Món", uid: "content" },
  { name: "Giá", uid: "price", minWidth: "110px" },
  { name: "Số lượng", uid: "quanlity" },
  { name: "Tổng Tiền", uid: "amount", minWidth: "110px" },
  { name: "Trạng thái", uid: "status", sortable: true },
  { name: "Phương thức TT", uid: "payment_method" },
  { name: "Hành động", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  processing: "warning",
  pending: "warning",
  reviewing: "warning",
  paid: "success",
  cancelled: "danger",
  refunding: "secondary",
  refunded: "success",
};

const statusOptions = [
  { name: "Chưa Thanh Toán", uid: "init" },
  { name: "TT Thành Công", uid: "paid" },
  { name: "Đã Huỷ", uid: "cancelled" },
  { name: "Đang Hoàn Tiền", uid: "refunding" },
  { name: "Đã Hoàn Tiền", uid: "refunded" },
  { name: "Đang Xem Xét", uid: "reviewing" },
  { name: "Tạm Hoãn", uid: "pending" },
  {
    name: "Đã Thanh Toán",
    uid: "processing",
    note: "trạng thái đã hoàn thành chuyển khoản nhưng chưa được chủ nhóm xác nhận",
  },
];

const searchByOptions = [
  {
    name: "Nhóm",
    uid: "room",
  },
  {
    name: "Người đặt",
    uid: "order",
  },
];

const INITIAL_VISIBLE_COLUMNS = [
  "room_id",
  "creator",
  "content",
  "amount",
  "status",
  "actions",
];

export {
  statusColorMap,
  statusOptions,
  searchByOptions,
  INITIAL_VISIBLE_COLUMNS,
  columns,
};
