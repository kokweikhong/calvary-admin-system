"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  InventoryIncoming,
  InventoryOutgoing,
  InventoryProduct,
} from "@/interfaces/inventory";
import { cn } from "@/lib/utils";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  Table,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

type InventoryTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
};

const InventoryTable: FC<
  InventoryTableProps<InventoryProduct | InventoryIncoming | InventoryOutgoing>
> = ({ data, columns }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const accessorKeys: { header: string; accessorKey: string }[] = columns.map(
    (column) => column as any
  );

  const filterKeys = [
    { header: "Global", accessorKey: "global" },
    ...accessorKeys.map((column) => column),
  ];

  const table = useReactTable({
    columns: columns,
    data: data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <InTablePopover
        table={table}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        rowSelection={rowSelection}
      />
      <button onClick={() => setOpenDialog(true)}>a</button>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <InTableSearchWithDropDown
              table={table}
              filterKeys={filterKeys}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <InTableColumnVisibilityMenu table={table} />
          </div>
        </div>
      </div>

      <InTable table={table} />

      <div className="sm:flex sm:items-center mt-4">
        <div className="sm:flex-auto">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <InTablePagination table={table} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;

type InTableProps = {
  table: Table<InventoryProduct | InventoryIncoming | InventoryOutgoing>;
  children?: ReactNode;
};

const InTable: FC<InTableProps> = ({ table, children }) => {
  return (
    <div className="mt-8 flow-root">
      <ScrollArea className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <InTableHeader table={table} />
            <InTableBody table={table} />
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

const InTableHeader: FC<InTableProps> = ({ table }) => {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              scope="col"
              className="whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              {header.isPlaceholder ? null : (
                <div
                  {...{
                    className: header.column.getCanSort()
                      ? "cursor-pointer select-none flex justify-between items-center"
                      : "",
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {!header.column.getIsSorted() && (
                    <ChevronUpDownIcon className="inline-block w-4 h-4 ml-2" />
                  )}
                  {{
                    asc: (
                      <ChevronUpIcon className="inline-block w-4 h-4 ml-2" />
                    ),
                    desc: (
                      <ChevronDownIcon className="inline-block w-4 h-4 ml-2" />
                    ),
                    both: (
                      <ChevronUpDownIcon className="inline-block w-4 h-4 ml-2" />
                    ),
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

const InTableBody: FC<InTableProps> = ({ table }) => {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const InTablePagination: FC<InTableProps> = ({ table }) => {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Previous
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">
        <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {/* <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button> */}
        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>
    </nav>
  );
};

const InTableColumnVisibilityMenu: FC<InTableProps> = ({ table }) => {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-gray-100">
        <span className="sr-only">Open Column Views</span>
        <ViewColumnsIcon className="h-7 w-7" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent className="ml-9 sm:mr-9">
        <fieldset>
          <legend className="sr-only">Column Visibility</legend>
          <div className="space-y-2 text-sm">
            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  {...{
                    type: "checkbox",
                    checked: table.getIsAllColumnsVisible(),
                    onChange: table.getToggleAllColumnsVisibilityHandler(),
                  }}
                  id="toggleAll"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label
                  htmlFor="toggleAll"
                  className="font-medium text-gray-900"
                >
                  Toggle All
                </label>{" "}
              </div>
            </div>

            {table.getAllLeafColumns().map((column) => {
              if (column.columnDef.header === undefined) {
                return null;
              }
              return (
                <div
                  key={column.id as string}
                  className="relative flex items-start"
                >
                  <div className="flex h-6 items-center">
                    <input
                      {...{
                        type: "checkbox",
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                      id={column.id as string}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor={column.id as string}
                      className="font-medium text-gray-900"
                    >
                      {column.columnDef.header as string}
                    </label>{" "}
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>
      </PopoverContent>
    </Popover>
  );
};

export function InTableDebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      placeholder="Search all columns..."
      {...props}
      className={cn(
        "block w-full rounded-r-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        props.className
      )}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

type InTableSearchColumnsInputProps = {
  table: Table<InventoryProduct | InventoryIncoming | InventoryOutgoing>;
  filterKeys: { header: string; accessorKey: string }[];
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
};

const InTableSearchWithDropDown: FC<InTableSearchColumnsInputProps> = ({
  table,
  filterKeys,
  globalFilter,
  setGlobalFilter,
}) => {
  const [searchColumnId, setSearchColumnId] = useState<string>("global");
  return (
    <div className="flex mt-2 rounded-md shadow-sm">
      <div className="inset-y-0 left-0 flex items-center">
        <label htmlFor="search-key" className="sr-only">
          Search Key
        </label>
        <select
          id="search-key"
          name="search-key"
          className="h-full rounded-l-md rounded-r-none border bg-white py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          value={searchColumnId}
          onChange={(e) => {
            table.resetColumnFilters();
            table.resetGlobalFilter();
            setSearchColumnId(e.target.value);
          }}
        >
          {filterKeys.map((filterKey) => (
            <option key={filterKey.accessorKey} value={filterKey.accessorKey}>
              {filterKey.header}
            </option>
          ))}
        </select>
      </div>
      {searchColumnId === "global" ? (
        <InTableDebouncedInput
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e as string)}
        />
      ) : (
        <InTableDebouncedInput
          value={
            (table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn(searchColumnId)?.setFilterValue(e as string)
          }
          placeholder={`Search for ${
            table
              .getColumn(searchColumnId)
              ?.columnDef.header?.toString()
              .toLowerCase() ?? "something"
          }...`}
        />
      )}
    </div>
  );
};

type InTablePopoverProps = {
  table: Table<InventoryProduct | InventoryIncoming | InventoryOutgoing>;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  rowSelection?: Record<string, boolean>;
};

const InTablePopover: FC<InTablePopoverProps> = ({
  table,
  openDialog,
  setOpenDialog,
  rowSelection,
}) => {
  console.log(table.getIsSomeRowsSelected() ? table.getSelectedRowModel() : {});
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription></DialogDescription>
          <div>
            <pre>
              <code>{JSON.stringify(rowSelection)}</code>
            </pre>
          </div>
          <div>
            <pre>
              <code className="text-xs">
                {JSON.stringify(
                  table.getIsSomeRowsSelected()
                    ? table.getSelectedRowModel().flatRows[0].original
                    : {},
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
