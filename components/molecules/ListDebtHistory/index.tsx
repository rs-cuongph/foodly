import Spinner from "@/components/atoms/Spinner";
import {
  INITIAL_VISIBLE_COLUMNS,
  columns,
  searchByOptions,
  statusColorMap,
  statusOptions,
} from "./contants";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { capitalize } from "@/shared/helpers/capitalize";
import {
  resetStateOrder,
  setSearchQuery,
} from "@/provider/redux/reducer/order.reducer";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import {
  AdminGroupAcceptOrder,
  deleteOrder,
  fetchListDebt,
} from "@/provider/redux/thunk/order.thunk";
import { Order } from "@/provider/redux/types/order";
import { formatCurrency } from "@/shared/helpers/currency";
import { PAGINATION_PARAMS } from "@/shared/constants";
import { formatTime } from "@/shared/helpers/format";
import { OrderId } from "./styled";
import ModalConfirm from "../ModalConfirm";
import ModalDeleteOrder from "@/components/molecules/ModalDelete";
import {
  hideLoading,
  showLoading,
  showNotify,
} from "@/provider/redux/reducer/common.reducer";

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
export default function ListDebtHistory() {
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
  const [isOpenModalDeleteOrder, setOpenModalDeleteOrder] = useState(false);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const searchByValue = useMemo(() => {
    return searchByOptions.find((i) => Array.from(searchByKey).includes(i.uid))
      ?.name;
  }, [searchByKey]);

  const handleOpenModalConfirm = useCallback((order: Order) => {
    setOrder(order);
    setOpenModalConfirm(true);
  }, []);

  const handleOpenModalDelete = useCallback((order: Order) => {
    if (order.status !== "processing") return;
    setOrder(order);
    setOpenModalDeleteOrder(true);
  }, []);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const onDeleteOrder = async () => {
    if (!order) return;
    dispatch(showLoading());
    const res = await dispatch(
      deleteOrder({ room_id: order.room.id, order_id: order.id })
    );
    dispatch(hideLoading());
    if (res.type === "order/delete/fulfilled") {
      dispatch(
        showNotify({
          messages: "Xoá thành công",
          type: "error",
        })
      );
      dispatch(fetchListDebt(searchQuery));
      setOpenModalDeleteOrder(false);
    }
  };

  const onAcceptPayment = async () => {
    if (!order) return;
    dispatch(showLoading());
    const res = await dispatch(
      AdminGroupAcceptOrder({ room_id: order.room.id, order_id: order.id })
    );
    dispatch(hideLoading());
    if (res.type === "order/admin-group-accept-order/fulfilled") {
      dispatch(
        showNotify({
          messages: "Cập nhật trạng thái thanh toán thành công",
          type: "error",
        })
      );
      dispatch(fetchListDebt(searchQuery));
      setOpenModalConfirm(false);
    }
  };

  const totalPage = useMemo(() => {
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
          <div className="min-w-[100px]">{formatTime(order.created_at)}</div>
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
      case "creator": {
        return order.creator.email;
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
            {/* <Button
              onClick={() => handleOpenModalEdit(order)}
              color="primary"
              variant={"light"}
              isIconOnly
            >
              <PencilSquareIcon className="h-5 w-5 text-[#fe724c]" />
            </Button> */}
            <Button
              onClick={() => handleOpenModalConfirm(order)}
              color="success"
              variant={"light"}
              isIconOnly
            >
              <CheckCircleIcon className="h-5 w-5 text-success" />
            </Button>

            <Button
              onClick={() => handleOpenModalDelete(order)}
              color="danger"
              variant={"light"}
              isIconOnly
            >
              <TrashIcon className="h-5 w-5 text-red-500 cursor-pointer" />
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
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="min-w-[180px]"
                  endContent={<ChevronDownIcon className="h-3 w-3" />}
                  size="sm"
                  variant="flat"
                >
                  Tìm theo:<span className="text-primary">{searchByValue}</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={searchByKey}
                selectionMode="single"
                onSelectionChange={(k) =>
                  setSearchByKey(
                    new Set(Array.from(k).map((item) => item.toString()))
                  )
                }
              >
                {searchByOptions.map((item) => (
                  <DropdownItem key={item.uid} className="capitalize">
                    {capitalize(item.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
          <span className="text-default-400 text-small">
            Tổng {debtList.pagination.total_record} bản ghi
          </span>
        </div>
      </div>
    );
  }, [searchByKey, visibleColumns, debtList.pagination.total_record]);

  const bottomContent = useMemo(() => {
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
    dispatch(fetchListDebt(searchQuery));
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
    <div className="bg-white p-[15px] rounded-[10px]">
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
          emptyContent={"Không có dữ liệu"}
          items={debtList.data}
          loadingState={loading ? "loading" : "idle"}
          loadingContent={<Spinner />}
          className="max-h-[300px]"
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ModalDeleteOrder
        open={isOpenModalDeleteOrder}
        setOpen={setOpenModalDeleteOrder}
        onSubmit={onDeleteOrder}
      />
      <ModalConfirm
        open={isOpenModalConfirm}
        setOpen={setOpenModalConfirm}
        onSubmit={() => onAcceptPayment()}
      />
    </div>
  );
}
