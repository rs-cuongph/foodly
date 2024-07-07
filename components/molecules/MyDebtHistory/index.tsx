"use client";
import {
  DropdownMenu,
  Input,
  SortDescriptor,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Selection,
  Tooltip,
  Chip,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownItem,
  Pagination,
  Table,
  Spinner,
} from "@nextui-org/react";
import classes from "./index.module.css";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  resetStateOrder,
  setSearchQuery,
} from "@/provider/redux/reducer/order.reducer";
import {
  ChevronDownIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  QrCodeIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { formatCurrency } from "@/shared/helpers/currency";
import { formatTime } from "@/shared/helpers/format";
import { Order } from "@/provider/redux/types/order";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import {
  INITIAL_VISIBLE_COLUMNS,
  columns,
  searchByOptions,
  statusColorMap,
  statusOptions,
} from "./constants";
import {
  confirmPaid,
  fetchListMyOrder,
} from "@/provider/redux/thunk/order.thunk";
import {
  hideLoading,
  showLoading,
  showNotify,
} from "@/provider/redux/reducer/common.reducer";
import { PAGINATION_PARAMS } from "@/shared/constants";
import { OrderId } from "../ListDebtHistory/styled";
import { capitalize } from "@/shared/helpers/capitalize";
import ModalQrPayment, { SubmitData } from "../ModalQrPayment";
interface Props {}

const classNames = {
  wrapper: ["max-h-[400px]"],
  th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
  td: [
    // changing the rows border radius
    // first
    "group-data-[first=true]:first:before:rounded-none",
    "group-data-[first=true]:last:before:rounded-none",
    // middle
    "group-data-[middle=true]:before:rounded-none",
    // last
    "group-data-[last=true]:first:before:rounded-none",
    "group-data-[last=true]:last:before:rounded-none",
  ],
};
export default function MyDebtHistory(props: Props) {
  const session = useSession();
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.order.searchQuery);
  const loading = useAppSelector((state) => state.common.loading);
  const debtList = useAppSelector((state) => state.order.orders);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "descending",
  });
  const [searchByKey, setSearchByKey] = useState(new Set(["room"]));
  const [isOpenModalConfirm, setOpenModalConfirm] = useState(false);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const searchByValue = useMemo(() => {
    return searchByOptions.find((i) => Array.from(searchByKey).includes(i.uid))
      ?.name;
  }, [searchByKey]);

  const handleOpenModalConfirm = useCallback((order: Order) => {
    setOrder(order);
    setOpenModalConfirm(true);
  }, []);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const onConfirmPaid = async (data: SubmitData) => {
    if (!order) return;
    dispatch(showLoading());
    const res = await dispatch(
      confirmPaid({
        room_id: data.room_id,
        order_id: data.order_id,
        coupon_code: data.coupon_code,
        payment_method: data.payment_method,
      })
    );
    dispatch(hideLoading());
    if (res.type === "order/confirm-paid/fulfilled") {
      dispatch(
        showNotify({
          messages: "Cập nhật trạng thái thanh toán thành công",
          type: "success",
        })
      );
      dispatch(fetchListMyOrder(searchQuery));
      setOpenModalConfirm(false);
    }
  };

  const totalPage = useMemo(() => {
    if (!debtList.pagination.total_record) return 1;
    return Math.ceil(
      debtList.pagination.total_record / PAGINATION_PARAMS.DEFAULT_PAGE_SIZE
    );
  }, [debtList.pagination.total_record]);

  const renderCell = useCallback((order: Order, columnKey: string) => {
    switch (columnKey) {
      case "status": {
        const status = statusOptions.find((stt) => stt.uid === order.status);
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[order.status]}
            size="sm"
            variant="dot"
          >
            <div className="flex items-center gap-1">
              {status?.name}
              {status?.note && (
                <Tooltip
                  content={status?.note}
                  color="default"
                  classNames={{
                    content: ["py-2 px-4 shadow-xl", "text-black bg-gray-50"],
                  }}
                >
                  <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
                </Tooltip>
              )}
            </div>
          </Chip>
        );
      }
      case "created_at": {
        return (
          <div className="min-w-[140px]">
            {formatTime(order.created_at, "DD-MM-YYYY HH:mm")}
          </div>
        );
      }
      case "room_id": {
        return (
          <OrderId className="flex flex-row gap-[2px] bg-primary text-white">
            <HashtagIcon className="h-4 w-4 text-white" />
            {order.room.room_id}
          </OrderId>
        );
      }
      case "room_name": {
        return order.room.name;
      }
      case "price": {
        return (
          <div className="min-w-[100px]">{formatCurrency(order.price)}</div>
        );
      }
      case "amount": {
        return (
          <div className="min-w-[100px]">{formatCurrency(order.amount)}</div>
        );
      }
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Button
              onClick={() => handleOpenModalConfirm(order)}
              color="success"
              variant={"light"}
              isIconOnly
              isDisabled={order.status !== "init"}
            >
              <QrCodeIcon className="h-5 w-5 text-success" />
            </Button>
          </div>
        );
      default:
        return (order as any)[columnKey];
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="w-full max-w-[60%] flex gap-2 flex-wrap sm:flex-nowrap">
            <Input
              isClearable
              classNames={{
                base: "min-w-[200px]",
                inputWrapper: "border-1",
              }}
              placeholder="tìm kiếm..."
              size="sm"
              startContent={<MagnifyingGlassIcon className="h-4 w-4" />}
              variant="bordered"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  dispatch(
                    setSearchQuery({
                      keywords: (e.target as any).value,
                    })
                  );
                }
              }}
            />
            <Button className="min-w-[130px]" size="sm" variant="flat">
              Tìm theo:<span className="text-primary">{searchByValue}</span>
            </Button>
          </div>

          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="h-3 w-3" />}
                  size="sm"
                  variant="flat"
                >
                  Cột
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-default-400 text-small">
            {debtList.summary?.total_quanlity ?? 0} phần -{" "}
            {formatCurrency(debtList.summary?.total_amount, "")} vnđ -{" "}
            <span className="text-red-500">
              {formatCurrency(debtList.summary?.bill, "")} vnđ (chưa thanh toán)
              {debtList.summary?.bill && <Button color="success" variant="flat" className="ml-2">
                Thanh Toán Ngay
              </Button>  }
            </span>
          </p>
        </div>
      </div>
    );
  }, [searchByKey, visibleColumns, debtList.pagination.total_record]);

  const bottomContent = useMemo(() => {
    console.log(totalPage);
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          initialPage={1}
          color="primary"
          total={totalPage}
          variant="light"
          onChange={setPage}
        />
      </div>
    );
  }, [page, totalPage]);

  useEffect(() => {
    dispatch(showLoading());
    dispatch(fetchListMyOrder(searchQuery)).then(() => {
      dispatch(hideLoading());
    });
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      dispatch(resetStateOrder());
    };
  }, []);

  useEffect(() => {
    dispatch(
      setSearchQuery({
        page,
        search_by: Array.from(searchByKey)[0],
        sort_by: sortDescriptor.column?.toString(),
        sort_type: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      })
    );
  }, [page, searchByKey, sortDescriptor]);

  return (
    <div className="bg-white px-[30px] py-[30px] rounded-[10px] ">
      <h3 className={`${classes["payment-setting__title"]} text-primary`}>
        Lịch Sử Nợ
      </h3>
      <div className="flex gap-2 flex-col">
        <Table
          aria-label="table"
          aria-labelledby="table"
          isCompact
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={classNames}
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={!loading ? "Không có dữ liệu" : ""}
            items={debtList.data}
            loadingState={loading ? "loading" : "idle"}
            loadingContent={<Spinner />}
            className="max-h-[300px]"
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey.toString())}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ModalQrPayment
        open={isOpenModalConfirm}
        setOpen={setOpenModalConfirm}
        order={order}
        onSubmit={(data) => onConfirmPaid(data)}
      />
    </div>
  );
}
