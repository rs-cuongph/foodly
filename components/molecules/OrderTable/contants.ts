import { ChipProps } from "@nextui-org/react";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Người đặt", uid: "creator", sortable: true },
  { name: "Món", uid: "content" },
  { name: "Giá", uid: "price" },
  { name: "Số lượng", uid: "quanlity" },
  { name: "Tổng Tiền", uid: "amount" },
  { name: "Ghi chú", uid: "notes" },
  { name: "Trạng thái", uid: "status", sortable: true },
  { name: "Phương thức TT", uid: "method_pay" },
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
  { name: "TT Thành Công", uid: "paid" },
  { name: "Đã Huỷ", uid: "cancelled" },
  { name: "Đang Hoàn Tiền", uid: "refunding" },
  { name: "Đã Hoàn Tiền", uid: "refunded" },
  { name: "Đang Xem Xét", uid: "reviewing" },
  { name: "Tạm Hoãn", uid: "pending" },
  { name: "Đã Thanh Toán", uid: "processing" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "creator",
  "content",
  "quanlity",
  "price",
  "status",
  "actions",
];

export { statusColorMap, statusOptions, INITIAL_VISIBLE_COLUMNS, columns };
