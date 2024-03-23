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
} from "@nextui-org/react";
import {
  INITIAL_VISIBLE_COLUMNS,
  columns,
  statusColorMap,
  statusOptions,
} from "./contants";
import { capitalize } from "@/shared/helpers/capitalize";
import { useState, useMemo, Key, useCallback, useEffect } from "react";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { ListOrderI, Order } from "@/provider/redux/types/order";
import { useAppDispatch, useAppSelector } from "@/hooks/stores.hook";
import { fetchListOrder } from "@/provider/redux/thunk/order.thunk";
import { PAGINATION_PARAMS } from "@/shared/constants";
import { formatCurrency } from "@/shared/helpers/currency";
import { debounce } from "lodash";

export default function OrderTable({ roomId }: { roomId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const loadingState = useMemo(
    () => (isLoading ? "loading" : "idle"),
    [isLoading]
  );
  const dispatch = useAppDispatch();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const orders = useAppSelector((state) => state.order.orders);

  const totalPage = useMemo(() => {
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

  // const filteredItems = useMemo(() => {
  //   let filteredUsers = [...orderItems];

  //   if (hasSearchFilter) {
  //     filteredUsers = filteredUsers.filter((user) =>
  //       user.name.toLowerCase().includes(filterValue.toLowerCase())
  //     );
  //   }
  //   if (
  //     statusFilter !== "all" &&
  //     Array.from(statusFilter).length !== statusOptions.length
  //   ) {
  //     filteredUsers = filteredUsers.filter((user) =>
  //       Array.from(statusFilter).includes(user.status)
  //     );
  //   }

  //   return filteredUsers;
  // }, [orderItems, filterValue, statusFilter]);

  const renderCell = useCallback((order: Order, columnKey: string) => {
    switch (columnKey) {
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[order.status]}
            size="sm"
            variant="dot"
          >
            {statusOptions.find((stt) => stt.uid === order.status)?.name}
          </Chip>
        );
      case "creator": {
        return order.creator.email;
      }
      case "price": {
        return formatCurrency(order.price);
      }
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <PencilSquareIcon className="h-5 w-5 text-[#fe724c] cursor-pointer" />
            <TrashIcon className="h-5 w-5 text-red-500  cursor-pointer" />
          </div>
        );
      default:
        return (order as any)[columnKey];
    }
  }, []);
  const fetchList = async (query: ListOrderI) => {
    dispatch(fetchListOrder(query));
  };

  const debouncedSearch = useCallback(
    debounce((value?: string) => {
      if (value && page !== 1) {
        setPage(1);
      }
      fetchList({
        room_id: roomId,
        page: 1,
        page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
        keywords: value,
        sort_by: "created_at",
        sort_type: "DESC",
      });
    }, 500),
    [page]
  );

  useEffect(() => {
    fetchList({
      room_id: roomId,
      page,
      page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
      sort_by: sortDescriptor.column?.toString(),
      sort_type: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
    });
  }, [sortDescriptor]);

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
            onClear={() => debouncedSearch("")}
            onValueChange={debouncedSearch}
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
                onSelectionChange={setStatusFilter}
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
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng {orders.pagination.total_record} đơn
          </span>
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
          color="primary"
          page={page}
          total={totalPage}
          variant="light"
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, page, totalPage, orders.data.length]);

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
  return (
    <Table
      aria-label="table"
      aria-labelledby="table"
      isCompact
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={classNames}
      selectedKeys={selectedKeys}
      //   selectionMode="multiple"
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
  );
}
