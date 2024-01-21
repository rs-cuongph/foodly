import { ChipProps } from "@nextui-org/react";

const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "FOOD NAME", uid: "food_name" },
    { name: "PRICE", uid: "price" },
    { name: "QUANLITY", uid: "quanlity" },
    { name: "AMOUNT", uid: "amount" },
    { name: "NOTE", uid: "notes" },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "METHOD_PAY", uid: "method_pay" },
    { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
    paid: "success",
    unpaid: "danger",
};

const statusOptions = [
    { name: "Paid", uid: "paid" },
    { name: "Unpaid", uid: "unpaid" },
];

const INITIAL_VISIBLE_COLUMNS = ["id", "name", "food_name", "quanlity", "price", "status", "actions"];

interface OrderItem {
    id: number,
    name: string,
    food_name: string,
    quanlity: number,
    price: number,
    amount: number,
    notes: string,
    status: "paid" | "unpaid"
    method_pay: string,
}

export { statusColorMap, statusOptions, INITIAL_VISIBLE_COLUMNS, columns };
export type { OrderItem };
