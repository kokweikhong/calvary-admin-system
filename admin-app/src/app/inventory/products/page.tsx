"use client";

import {
  ColumnFiltersState,
  FilterFn,
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  useDeleteInventoryProduct,
  useGetInventoryProducts,
} from "@/queries/inventory-products";
import {
  DocumentTextIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Swal from "sweetalert2";
import InventoryTable from "@/components/InventoryTable";
import { cn } from "@/lib/utils";
import { InventoryProduct } from "@/app/interfaces/inventory";
import { FC, Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { rankItem } from "@tanstack/match-sorter-utils";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
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

type DropdownMenuProps = {
  productId: string;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ productId }) => {
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
                  href={`/inventory/incomings/form/update/${productId}`}
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

const columnHelper = createColumnHelper<InventoryProduct>();

export default function InventoryProductsPage() {
  const products = useGetInventoryProducts();
  const deleteProduct = useDeleteInventoryProduct();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <DropdownMenu productId={info.row.original.id.toString()} />
      ),
    }),
    columnHelper.accessor("thumbnail", {
      header: "Doc",
      cell: (info) => (
        <a href={`${info.row.original.thumbnail}`}>
          <DocumentTextIcon className="w-4 h-4" />
        </a>
      ),
    }),
    columnHelper.accessor("code", {
      header: "Code",
    }),
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("brand", {
      header: "Brand",
    }),
    columnHelper.accessor("supplier", {
      header: "Supplier",
    }),
    columnHelper.accessor("standardUnit", {
      header: "Std.Unit",
    }),
    columnHelper.accessor("isExist", {
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
    columnHelper.accessor("remarks", {
      header: "Remarks",
    }),
  ];

  const table = useReactTable({
    data: products.data || [],
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

  function handleDeleteProduct(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it.",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct.mutateAsync(id);
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your product is safe :)", "error");
      }
    });
  }

  if (products.isLoading) {
    return <LoadingSpinner label="products data" />;
  }

  if (products.isError) {
    throw new Error(`Error while fetching products: ${products.error}`);
  }

  if (!products.data) {
    return <div>No products found</div>;
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Products
            </h1>
            <p className="mt-2 text-sm text-gray-700">Inventory products.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href={"/inventory/products/form/create"}
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Product
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root overflow-x-auto">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 px-8 align-middle">
              <InventoryTable table={table} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
