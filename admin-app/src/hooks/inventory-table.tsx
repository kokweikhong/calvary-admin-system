"use client";

import {
  InTableDebouncedInput,
  InTableFilter,
  InTablePagination,
  InventoryTable,
} from "@/components/InventoryTable";
import {
  InventoryIncoming,
  InventoryOutgoing,
  InventoryProduct,
} from "@/interfaces/inventory";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  Table,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

export type SearchableColumnProps = {
  label: string;
  value: string;
  placeholder: string;
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
      className="block w-full rounded-md border-0 p-2 pr-28 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
}

type InTableSearchColumnsInputProps = {
  table: Table<any>;
  searchColumns: SearchableColumnProps[];
};

const InTableSearchColumnsInput = ({
  table,
  searchColumns,
}: InTableSearchColumnsInputProps) => {
  const [keyword, setKeyword] = useState<string>(
    searchColumns[0].value as string
  );
  const [selectedColumn, setSelectedColumn] = useState<Column<any, unknown>>();
  const columns = table.getAllColumns();

  function handleKeywordChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
    if (e.target.value === "") {
      setSelectedColumn(undefined);
      return;
    }
    // set debounce to 300ms
    // table.resetGlobalFilter();
    // table.resetColumnFilters();
    const column = columns.find((column) => column.id === e.target.value);

    console.log(column);
    if (!column) {
      return;
    }
    console.log(column);
    setSelectedColumn(column);
  }

  // useEffect(() => {
  //   console.log(selectedColumn);
  //   if (selectedColumn) {
  //     selectedColumn.setFilterValue("");
  //   }
  // }, [selectedColumn]);

  return (
    <div>
      <div>
        {table.getAllColumns().map((column) => (
          <div key={column.id}>
            {column.getCanFilter() && (
              <InTableFilter column={column} table={table} />
            )}
          </div>
        ))}
      </div>
      <div>
        <select name="" id="">
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        {/* <InTableFilter
          column={table.getColumn("refNo") as Column<any, unknown>}
          table={table}
        /> */}
      </div>
      {/* <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="text"
          name="search-multiple"
          className="block w-full rounded-md border-0 p-2 pr-28 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          // placeholder={`${keyword.placeholder}`}
          value={
            (table.getColumn(`${keyword}`)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(`${keyword}`)?.setFilterValue(event.target.value)
          }
        />
        <div className="inset-y-0 right-0 flex items-center">
          <label htmlFor="keyword" className="sr-only">
            Keyword
          </label>
          <select
            // id="keyword"
            // name="keyword"
            className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            onChange={handleKeywordChange}
            // defaultValue={""}
            value={keyword}
          >
            {searchColumns.map((column) => (
              <option key={column.value} value={column.value}>
                {column.label}
              </option>
            ))}
          </select>
        </div>
      </div> */}
    </div>
  );
};

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

export interface InventoryTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  searchableColumns?: SearchableColumnProps[];
}

export const useInventoryTable = ({
  data,
  columns,
  searchableColumns,
}: InventoryTableProps<
  InventoryProduct | InventoryIncoming | InventoryOutgoing
>) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
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
  }) as Table<InventoryProduct | InventoryIncoming | InventoryOutgoing>;

  return {
    table,
    InventoryTable: () => <InventoryTable table={table} />,
    InTablePagination: () => <InTablePagination table={table} />,
    InTableGlobalSearch: () => (
      <InTableDebouncedInput
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(String(e))}
      />
    ),
    InTableFilter: (columnId: string) => {
      const column = table.getColumn(columnId) as Column<any, unknown>;
      if (!column) {
        return null;
      }
      return <InTableFilter column={column} table={table} />;
    },
    InTableSearchColumnsInput: () => (
      <InTableSearchColumnsInput
        table={table}
        searchColumns={searchableColumns ?? []}
      />
    ),
  };
};
