"use client";

import { InventoryTable, Pagination } from "@/components/InventoryTable";
import { InventoryIncoming } from "@/interfaces/inventory";
import { cn } from "@/lib/utils";
import { useGetInventoryIncomings } from "@/queries/inventory-incoming";
import { Menu, Transition } from "@headlessui/react";
import {
  DocumentTextIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnFiltersState,
  FilterFn,
  SortingState,
  Table,
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { FC, Fragment, useEffect, useState } from "react";
import { config } from "@/interfaces/config";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type DropdownMenuProps = {
  incomingId: string;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ incomingId }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/inventory/incomings/form/update/${incomingId}`}
                  className={cn(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <PencilSquareIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Edit
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={cn(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Delete
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

type SearchableColumn = {
  label: string;
  value: string;
  placeholder: string;
};

const searchableColumns: SearchableColumn[] = [
  {
    label: "P.Code",
    value: "productCode",
    placeholder: "Search by product code",
  },
  {
    label: "P.Name",
    value: "productName",
    placeholder: "Search by product name",
  },
  {
    label: "Std.Unit",
    value: "standardUnit",
    placeholder: "Search by standard unit",
  },
  {
    label: "Country",
    value: "storeCountry",
    placeholder: "Search by store country",
  },
  {
    label: "Location",
    value: "storeLocation",
    placeholder: "Search by store location",
  },
];

// @ts-ignore
const SearchMultipleColumns = ({ table }: { table: Table<T> }) => {
  const [keyword, setKeyword] = useState<SearchableColumn>(
    searchableColumns[0]
  );

  function handleKeywordChange(e: React.ChangeEvent<HTMLSelectElement>) {
    // set debounce to 300ms
    table.resetColumnFilters();
    setInterval(() => {
      setKeyword(
        (prev) =>
          searchableColumns.find((column) => column.value === e.target.value) ??
          prev
      );
    }, 300);
  }

  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="text"
          name="search-multiple"
          className="block w-full rounded-md border-0 p-2 pr-28 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={`${keyword.placeholder}`}
          value={
            (table
              .getColumn(`${keyword?.value}`)
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn(`${keyword?.value}`)
              ?.setFilterValue(event.target.value)
          }
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="keyword" className="sr-only">
            Keyword
          </label>
          <select
            id="keyword"
            name="keyword"
            className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            onChange={handleKeywordChange}
          >
            {searchableColumns.map((column) => (
              <option key={column.value} value={column.value}>
                {column.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

function DebouncedInput({
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
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      className="block w-full rounded-md border-0 p-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      onChange={(e) => setValue(e.target.value)}
    />
  );
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

const columnHelper = createColumnHelper<InventoryIncoming>();

export default function InventoryIncomingPage() {
  const {
    data: incomings,
    isLoading,
    isError,
    error,
  } = useGetInventoryIncomings();
  // const incomings: InventoryIncoming[] = fakeInventoryIncomings;
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <DropdownMenu incomingId={info.row.original.id.toString()} />
      ),
    }),
    columnHelper.accessor("productCode", {
      header: "P.Code",
    }),
    columnHelper.accessor("productName", {
      header: "P.Name",
    }),
    columnHelper.accessor("refNo", {
      header: "Doc",
      cell: (info) => (
        <a
          target="_blank"
          href={`${config.MainServiceURL}/${info.row.original.refDoc}`}
        >
          <DocumentTextIcon className="w-4 h-4" />
        </a>
      ),
    }),
    columnHelper.accessor("cost", {
      header: "Cost",
    }),
    columnHelper.accessor("standardQuantity", {
      header: "Std.Qty",
    }),
    columnHelper.accessor("standardUnit", {
      header: "Std.Unit",
      cell: (info) => (
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          {info.row.original.standardUnit}
        </span>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: "AC.Qty",
    }),
    columnHelper.accessor("unit", {
      header: "AC.Unit",
      cell: (info) => (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          {info.row.original.unit}
        </span>
      ),
    }),
    columnHelper.accessor("length", {
      header: "L",
    }),
    columnHelper.accessor("width", {
      header: "W",
    }),
    columnHelper.accessor("height", {
      header: "H",
    }),
    columnHelper.accessor("storeCountry", {
      header: "Country",
    }),
    columnHelper.accessor("storeLocation", {
      header: "Location",
    }),
    columnHelper.accessor("remarks", {
      header: "Remarks",
    }),
  ];

  const table = useReactTable({
    data: incomings ?? [],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    throw error;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Inventory Incomings
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Details and information about inventory incomings.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href={"/inventory/incomings/form/create"}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              New Incoming
            </Link>
          </div>
        </div>
        <div className="my-2 flex items-center">
          <SearchMultipleColumns table={table} />
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <InventoryTable table={table} />
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <Pagination table={table} />
      </div>
    </div>
  );
}
