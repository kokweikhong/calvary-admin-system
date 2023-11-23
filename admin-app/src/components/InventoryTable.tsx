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
} from "@heroicons/react/24/outline";
import { Column, Table, flexRender } from "@tanstack/react-table";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";

type InTableProps = {
  children: ReactNode;
  className?: string;
};

export const InTable: FC<InTableProps> = ({ children, className }) => {
  return (
    <table className={cn("min-w-full divide-y divide-gray-300", className)}>
      {children}
    </table>
  );
};

export const InTableTh: FC<InTableProps> = ({ children, className }) => {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0",
        className
      )}
    >
      {children}
    </th>
  );
};

export const InTableBody: FC<InTableProps> = ({ children, className }) => {
  return (
    <tbody className={cn("divide-y divide-gray-200 bg-white", className)}>
      {children}
    </tbody>
  );
};

export const InTableTd: FC<InTableProps> = ({ children, className }) => {
  return (
    <td
      className={cn(
        "whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0",
        className
      )}
    >
      {children}
    </td>
  );
};

interface ITable {
  table: Table<InventoryProduct | InventoryIncoming | InventoryOutgoing>;
}

export const InTablePagination: FC<ITable> = ({ table }) => {
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

export const InventoryTable: FC<ITable> = ({ table }) => {
  return (
    <InTable>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <InTableTh key={header.id}>
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
              </InTableTh>
            ))}
          </tr>
        ))}
      </thead>

      <InTableBody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <InTableTd key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </InTableTd>
            ))}
          </tr>
        ))}
      </InTableBody>
    </InTable>
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
      {...props}
      className={cn(
        "block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        props.className
      )}
      placeholder="Search all..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function InTableFilter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <InTableDebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <InTableDebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <InTableDebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}
