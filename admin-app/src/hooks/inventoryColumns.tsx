import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { config } from "@/interfaces/config";
import { InventoryIncoming, InventoryOutgoing, InventoryProduct } from "@/interfaces/inventory";
import { DocumentTextIcon, EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const columnHelperInProduct = createColumnHelper<InventoryProduct>();

export const useInventoryProductColumns = () =>
  useMemo(() => [
    columnHelperInProduct.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a
                href="#"
                className={cn(
                  'text-gray-700',
                  'group flex items-center px-4 py-2 text-sm'
                )}
              >
                <PencilSquareIcon
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                Edit
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className={cn(
                  'text-gray-700',
                  'group flex items-center px-4 py-2 text-sm'
                )}
              >
                <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
    columnHelperInProduct.accessor("thumbnail", {
      header: "Thumbnail",
      cell: (info) => (
        <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
          <Image
            src={`${config.MainServiceURL}/${info.row.original.thumbnail}`}
            alt="Profile Image"
            sizes="(min-width: 640px) 300px, 50vw (max-width: 640px 100vw)"
            width={500}
            height={500}
            priority={true}
            className="h-full w-full object-cover object-center cursor-pointer group-hover:opacity-75"
            onClick={() => {
              info.row.toggleSelected(!info.row.getIsSelected());
            }}
          />
        </div>
      ),
    }),
    columnHelperInProduct.accessor("code", {
      header: "Code",
    }),
    columnHelperInProduct.accessor("name", {
      header: "Name",
    }),
    columnHelperInProduct.accessor("brand", {
      header: "Brand",
    }),
    columnHelperInProduct.accessor("supplier", {
      header: "Supplier",
    }),
    columnHelperInProduct.accessor("standardUnit", {
      header: "Std.Unit",
    }),
    columnHelperInProduct.accessor("isExist", {
      header: "Exist",
      cell: (info) => (
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
            info.row.original.isExist
              ? "bg-green-50 text-green-700 ring-green-600/20"
              : "bg-red-50 text-red-700 ring-red-600/20"
          )}
        >
          {info.row.original.isExist ? "Active" : "Inactive"}
        </span>
      ),
    }),
    columnHelperInProduct.accessor("remarks", {
      header: "Remarks",
    }),
  ], []);

const columnHelperInOutgoing = createColumnHelper<InventoryOutgoing>();

export const useInventoryOutgoingColumns = () =>
  useMemo(() => [
    columnHelperInOutgoing.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a
                href="#"
                className={cn(
                  'text-gray-700',
                  'group flex items-center px-4 py-2 text-sm'
                )}
              >
                <PencilSquareIcon
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                Edit
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className={cn(
                  'text-gray-700',
                  'group flex items-center px-4 py-2 text-sm'
                )}
              >
                <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
    columnHelperInOutgoing.accessor("productCode", {
      header: "Product Code",
      cell: (info) => (
        <span
          onClick={() => {
            info.row.toggleSelected(!info.row.getIsSelected());
          }}
          className={cn(
            "inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200",
            "cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <svg className="h-1.5 w-1.5 fill-indigo-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          {info.row.original.productCode}
        </span>
      )

    }),
    columnHelperInOutgoing.accessor("productName", {
      header: "Product Name",
    }),
    columnHelperInOutgoing.accessor("status", {
      header: "Status",
    }),
    columnHelperInOutgoing.accessor("quantity", {
      header: "Qty",
    }),
    columnHelperInOutgoing.accessor("standardQuantity", {
      header: "Std.Qty",
    }),
    columnHelperInOutgoing.accessor("standardUnit", {
      header: "Std.Unit",
    }),
    columnHelperInOutgoing.accessor("cost", {
      header: "Cost",
    }),
    columnHelperInOutgoing.accessor("refNo", {
      header: "Ref No",
    }),
    columnHelperInOutgoing.accessor("refDoc", {
      header: "Ref Doc",
      cell: (info) => (
        <a
          target="_blank"
          href={`${config.MainServiceURL}/${info.row.original.refDoc}`}
          className="hover:text-indigo-500"
        >
          <DocumentTextIcon className="w-4 h-4" />
        </a>
      ),
    }),
    columnHelperInOutgoing.accessor("remarks", {
      header: "Remarks",
    }),
  ],
    []
  );

const columnHelperInIncoming = createColumnHelper<InventoryIncoming>();

export const useInventoryIncomingColumns = () =>
  useMemo(
    () => [
      columnHelperInIncoming.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <Popover>
            <PopoverTrigger>a</PopoverTrigger>
            <PopoverContent>b</PopoverContent>
          </Popover>
          // <DropdownMenu incomingId={info.row.original.id.toString()} />
        ),
      }),
      columnHelperInIncoming.accessor("productCode", {
        header: "P.Code",
      }),
      columnHelperInIncoming.accessor("productName", {
        header: "P.Name",
      }),
      columnHelperInIncoming.accessor("refNo", {
        header: "Doc",
        cell: (info) => (
          <a
            target="_blank"
            href={`${config.MainServiceURL}/${info.row.original.refDoc}`}
            className="hover:text-indigo-500"
          >
            <DocumentTextIcon className="w-4 h-4" />
          </a>
        ),
      }),
      columnHelperInIncoming.accessor("cost", {
        header: "Cost",
      }),
      columnHelperInIncoming.accessor("standardQuantity", {
        header: "Std.Qty",
      }),
      columnHelperInIncoming.accessor("standardUnit", {
        header: "Std.Unit",
        cell: (info) => (
          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            {info.row.original.standardUnit}
          </span>
        ),
      }),
      columnHelperInIncoming.accessor("quantity", {
        header: "AC.Qty",
      }),
      columnHelperInIncoming.accessor("unit", {
        header: "AC.Unit",
        cell: (info) => (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            {info.row.original.unit}
          </span>
        ),
      }),
      columnHelperInIncoming.accessor("length", {
        header: "L",
      }),
      columnHelperInIncoming.accessor("width", {
        header: "W",
      }),
      columnHelperInIncoming.accessor("height", {
        header: "H",
      }),
      columnHelperInIncoming.accessor("storeCountry", {
        header: "Country",
      }),
      columnHelperInIncoming.accessor("storeLocation", {
        header: "Location",
      }),
      columnHelperInIncoming.accessor("remarks", {
        header: "Remarks",
      }),
    ],
    []
  );
