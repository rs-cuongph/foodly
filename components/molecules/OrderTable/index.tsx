import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  Input,
  SortDescriptor,
  TableCell,
  TableRow,
  Selection,
  Pagination,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Chip,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import {
  INITIAL_VISIBLE_COLUMNS,
  columns,
  statusColorMap,
  statusOptions,
} from "./contants";
import { capitalize } from "@/shared/helpers/capitalize";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  QrCodeIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Order } from "@/provider/redux/types/order";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import {
  confirmPaid,
  deleteOrder,
  fetchListOrder,
} from "@/provider/redux/thunk/order.thunk";
import { PAGINATION_PARAMS } from "@/shared/constants";
import { formatCurrency } from "@/shared/helpers/currency";
import ModalDeleteOrder from "@/components/molecules/ModalDelete";
import { setSearchQuery } from "@/provider/redux/reducer/order.reducer";
import ModalOrder from "../ModalOrder";
import { Room } from "@/provider/redux/types/room";
import { useSession } from "next-auth/react";
import {
  hideLoading,
  setOpenModalOrder,
  setOrderIForModalOrder,
  setRoomIForModalOrder,
  showLoading,
  showNotify,
} from "@/provider/redux/reducer/common.reducer";
import ModalQrPayment, { SubmitData } from "../ModalQrPayment";

interface OrderTableProps {
  data: Room;
}
export default function OrderTable({ data }: OrderTableProps) {
  const isLoading = useAppSelector((state) => state.order.loadingList);
  const searchQuery = useAppSelector((state) => state.order.searchQuery);
  const order = useAppSelector((state) => state.common.modalOrderState.order);
  const session = useSession();
  const loadingState = useMemo(
    () => (isLoading ? "loading" : "idle"),
    [isLoading]
  );
  const dispatch = useAppDispatch();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [isOpenModalDeleteOrder, setOpenModalDeleteOrder] = useState(false);
  const [isOpenModalConfirm, setOpenModalConfirm] = useState(false);
  const [orderPaid, setOrderPaid] = useState<Order | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState(
    new Set(statusOptions.map((i) => i.uid))
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const orders = useAppSelector((state) => state.order.orders);

  const totalPage = useMemo(() => {
    if (!orders.pagination.total_record) return 1;
    return Math.ceil(
      orders.pagination.total_record / PAGINATION_PARAMS.DEFAULT_PAGE_SIZE
    );
  }, [orders.pagination.total_record]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const handleOpenModalConfirmPaid = useCallback((order: Order) => {
    setOrderPaid(order);
    setOpenModalConfirm(true);
  }, []);

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

      case "creator": {
        return order.creator.email;
      }
      case "price": {
        return formatCurrency(order.price);
      }
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            {session.data?.user.authenticated_data.id === data.creator.id && (
              <>
                <Button
                  onClick={() => handleOpenModalEdit(order)}
                  color="primary"
                  variant={"light"}
                  isIconOnly
                >
                  <PencilSquareIcon className="h-5 w-5 text-[#fe724c]" />
                </Button>

                <Button
                  onClick={() => handleOpenModalDelete(order)}
                  color="danger"
                  variant={"light"}
                  isIconOnly
                >
                  <TrashIcon className="h-5 w-5 text-red-500 cursor-pointer" />
                </Button>
              </>
            )}
            {session.data?.user.authenticated_data.id !== data.creator.id &&
              session.data?.user.authenticated_data.id === order.creator.id &&
              order.status === "init" && (
                <Button
                  onClick={() => handleOpenModalConfirmPaid(order)}
                  color="success"
                  variant={"light"}
                  isIconOnly
                >
                  <QrCodeIcon className="h-5 w-5 text-success" />
                </Button>
              )}
          </div>
        );
      default:
        return (order as any)[columnKey];
    }
  }, []);

  const handleOpenModalEdit = useCallback((order: Order) => {
    dispatch(setOpenModalOrder(true));
    dispatch(setRoomIForModalOrder(data));
    dispatch(setOrderIForModalOrder(order));
  }, []);

  const handleOpenModalDelete = useCallback((order: Order) => {
    if (order.status !== "processing") return;
    dispatch(setOrderIForModalOrder(order));
    setOpenModalDeleteOrder(true);
  }, []);

  const onDeleteOrder = async () => {
    if (!order) return;

    dispatch(showLoading());
    const res = await dispatch(
      deleteOrder({ room_id: data.id, order_id: order.id })
    );
    dispatch(hideLoading());

    if (res.type === "order/delete/fulfilled") {
      dispatch(fetchListOrder(searchQuery));
      setOpenModalDeleteOrder(false);
    }
  };

  useEffect(() => {
    dispatch(fetchListOrder(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      setSearchQuery({
        page,
        status: Array.from(statusFilter),
        sort_by: sortDescriptor.column?.toString(),
        sort_type: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
        room_id: data.id,
      })
    );
  }, [page, statusFilter, sortDescriptor]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
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
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="h-3 w-3" />}
                  size="sm"
                  variant="flat"
                >
                  Trạng thái
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(k) =>
                  setStatusFilter(
                    new Set(Array.from(k).map((item) => item.toString()))
                  )
                }
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
        <div className="flex justify-between flex-col">
          <p className="text-primary text-small">
            Tổng: {orders.summary?.total_quanlity ?? 0} phần -{" "}
            {formatCurrency(orders.summary?.total_amount, "")} vnđ
          </p>
        </div>
      </div>
    );
  }, [statusFilter, visibleColumns, orders]);

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

  const classNames = useMemo(
    () => ({
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
    }),
    []
  );

  const onConfirmPaid = async (data: SubmitData) => {
    if (!orderPaid) return;
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
      dispatch(fetchListOrder(searchQuery));
      setOpenModalConfirm(false);
    }
  };

  return (
    <div>
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
          items={orders.data}
          loadingState={loadingState}
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
      <ModalOrder />
      <ModalQrPayment
        open={isOpenModalConfirm}
        setOpen={setOpenModalConfirm}
        order={orderPaid}
        onSubmit={(data) => onConfirmPaid(data)}
      />
    </div>
  );
}
