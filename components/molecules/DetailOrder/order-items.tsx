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
  OrderItem,
  columns,
  statusColorMap,
  statusOptions,
} from "./contants";
import { capitalize } from "@/shared/helpers/capitalize";
import { useState, useMemo, Key, useCallback } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

export default function OrderItems() {
  const [isLoading, setIsLoading] = useState(false);
  const loadingState = useMemo(
    () => (isLoading ? "loading" : "idle"),
    [isLoading]
  );

  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    Array.from({ length: 10 }).map((_, index) => {
      return {
        id: index + 1,
        name: "cuongph",
        food_name: "Thịt rim đậu khuôn,Cá lóc kho tộ,Chả cá rim,Cải ngọt luộc",
        quanlity: 1,
        price: 25000,
        amount: 25000,
        notes: "ssssss",
        status: "paid",
        method_pay: "chuyển khoản",
      };
    })
  );
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const pages = Math.ceil(orderItems.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...orderItems];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [orderItems, filterValue, statusFilter]);

  const renderCell = useCallback((order: OrderItem, columnKey: React.Key) => {
    const cellValue = order[columnKey as keyof OrderItem];

    switch (columnKey) {
      // case "name":
      //   return (
      //     <User
      //       avatarProps={{radius: "full", size: "sm", src: user.avatar}}
      //       classNames={{
      //         description: "text-default-500",
      //       }}
      //       description={user.email}
      //       name={cellValue}
      //     >
      //       {user.email}
      //     </User>
      //   );
      // case "role":
      //   return (
      //     <div className="flex flex-col">
      //       <p className="text-bold text-small capitalize">{cellValue}</p>
      //       <p className="text-bold text-tiny capitalize text-default-500">{user.team}</p>
      //     </div>
      //   );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[order.status]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      //   case "actions":
      //     return (
      //       <div className="relative flex justify-end items-center gap-2">
      //         <Dropdown className="bg-background border-1 border-default-200">
      //           <DropdownTrigger>
      //             <Button isIconOnly radius="full" size="sm" variant="light">
      //               <EllipsisVerticalIcon className="h-6 w-6" />
      //             </Button>
      //           </DropdownTrigger>
      //           <DropdownMenu>
      //             <DropdownItem>View</DropdownItem>
      //             <DropdownItem>Edit</DropdownItem>
      //             <DropdownItem>Delete</DropdownItem>
      //           </DropdownMenu>
      //         </Dropdown>
      //       </div>
      //     );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

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
            placeholder="Search by name..."
            size="sm"
            startContent={<MagnifyingGlassIcon className="h-4 w-4" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="h-3 w-3" />}
                  size="sm"
                  variant="flat"
                >
                  Status
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
                  Columns
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
            Total {orderItems.length} orders
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    orderItems.length,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        {/* <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${orderItems.length} selected`}
        </span> */}
      </div>
    );
  }, [selectedKeys, orderItems.length, page, pages, hasSearchFilter]);

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
      aria-label=""
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
        emptyContent={"No users found"}
        items={orderItems}
        loadingState={loadingState}
        loadingContent={<Spinner />}
        className="max-h-[300px]"
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
