import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { config } from "@/interfaces/config";
import { InventoryIncoming, InventoryOutgoing } from "@/interfaces/inventory";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";

const columnHelperInOutgoing = createColumnHelper<InventoryOutgoing>();

export const useInventoryOutgoingColumns = () =>
  useMemo(
    () => [
      columnHelperInOutgoing.accessor("id", {
        header: "ID",
        cell: (info) => (
          <button
            onClick={() => {
              info.row.toggleSelected(!info.row.getIsSelected());
            }}
          >
            {info.row.original.id} {info.row.getIsSelected() ? "true" : "false"}
          </button>
        ),
      }),
      columnHelperInOutgoing.accessor("productCode", {
        header: "Product Code",
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

export const InventoryIncomingColumns = () =>
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
