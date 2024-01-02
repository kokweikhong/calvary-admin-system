import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InventoryIncoming,
  InventoryOutgoing,
  InventoryProduct,
} from "@/interfaces/inventory";
import { config } from "@/lib/config";
import { cn, isImageExt } from "@/lib/utils";
import {
  DocumentTextIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import Swal from "sweetalert2";
import useInventoryIncomings from "./useInventoryIncomings";
import useInventoryOutgoings from "./useInventoryOutgoings";
import useInventoryProducts from "./useInventoryProducts";
import useFilesystem from "./useFilesystem";
import { imageLoader } from "@/lib/utils";

const columnHelperInProduct = createColumnHelper<InventoryProduct>();

export const useInventoryProductColumns = () => {
  const { useDeleteInventoryProduct } = useInventoryProducts();
  const { useDeleteFile } = useFilesystem();
  const deleteProduct = useDeleteInventoryProduct();
  const deleteFile = useDeleteFile();

  async function handleDelete(data: InventoryProduct) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct.mutateAsync(data.id.toString());
          if (data.thumbnail !== "") {
            await deleteFile.mutateAsync(data.thumbnail);
          }
          Swal.fire({
            title: "Deleted!",
            text: "Your product has been deleted.",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "#10B981",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `${error}`,
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#EF4444",
          });
        }
      }
    });
  }

  return useMemo(
    () => [
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
                <Link
                  href={`/inventory/products/form/update/${info.row.original.id}`}
                  className={cn(
                    "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <PencilSquareIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className={cn(
                    "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                  onClick={() => handleDelete(info.row.original)}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
      columnHelperInProduct.accessor("thumbnail", {
        header: "Thumbnail",
        cell: (info) =>
          isImageExt(info.row.original.thumbnail) ? (
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
              <Image
                loader={imageLoader}
                // src={`${config.mainServiceURL}/${info.row.original.thumbnail}`}
                src={info.row.original.thumbnail}
                alt="Profile Image"
                sizes="(min-width: 640px) 300px, 50vw (max-width: 640px 100vw)"
                width={500}
                height={500}
                priority={true}
                className="h-full w-full object-contain object-center cursor-pointer group-hover:opacity-75"
                onClick={() => {
                  info.row.toggleSelected(!info.row.getIsSelected());
                }}
              />
            </div>
          ) : (
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
              <PhotoIcon
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
    ],
    [handleDelete]
  );
};

const columnHelperInIncoming = createColumnHelper<InventoryIncoming>();

export const useInventoryIncomingColumns = () => {
  const { useDeleteInventoryIncoming } = useInventoryIncomings();
  const { useDeleteFile } = useFilesystem();
  const { mutateAsync: deleteIncoming } = useDeleteInventoryIncoming();
  const deleteFile = useDeleteFile();

  function handleDelete(data: InventoryIncoming) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this incoming!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteIncoming(data.id.toString());
          if (data.refDoc !== "") {
            await deleteFile.mutateAsync(data.refDoc);
          }
          Swal.fire({
            title: "Deleted!",
            text: "Your incoming has been deleted.",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "#10B981",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong!",
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#EF4444",
          });
        }
      }
    });
  }

  return useMemo(
    () => [
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
                <Link
                  href={`/inventory/incomings/form/update/${info.row.original.id}`}
                  className={cn(
                    "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <PencilSquareIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className={cn(
                    "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                  onClick={() => handleDelete(info.row.original as unknown as InventoryIncoming)}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
      columnHelperInIncoming.accessor("productCode", {
        header: "P.Code",
      }),
      columnHelperInIncoming.accessor("productName", {
        header: "P.Name",
      }),
      columnHelperInIncoming.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-800 ring-1 ring-inset ring-indigo-600/20">
            {info.row.original.status}
          </span>
        ),
      }),
      columnHelperInIncoming.accessor("refNo", {
        header: "Doc",
        cell: (info) => (
          <a
            target="_blank"
            href={`${config.mainServiceURL}/${info.row.original.refDoc}`}
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
    [handleDelete]
  );
};

const columnHelperInOutgoing = createColumnHelper<InventoryOutgoing>();

export const useInventoryOutgoingColumns = () => {
  const { useDeleteInventoryOutgoing } = useInventoryOutgoings();
  const { useDeleteFile } = useFilesystem();
  const deleteOutgoing = useDeleteInventoryOutgoing();
  const deleteFile = useDeleteFile();

  function handleDelete(data: InventoryOutgoing) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this outgoing!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOutgoing.mutateAsync(data.id.toString());
          if (data.refDoc !== "") {
            await deleteFile.mutateAsync(data.refDoc);
          }
          Swal.fire({
            title: "Deleted!",
            text: "Your outgoing has been deleted.",
            icon: "success",
            confirmButtonText: "Ok",
            confirmButtonColor: "#10B981",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong!",
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#EF4444",
          });
        }


      }
    });
  }

  return useMemo(
    () => [
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
                <Link
                  href={`/inventory/outgoings/form/update/${info.row.original.id}`}
                  className={cn(
                    "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <PencilSquareIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className={cn(
                    "text-gray-700",
                    "group flex items-center px-4 py-2 text-sm"
                  )}
                  onClick={() => handleDelete(info.row.original)}
                >
                  <TrashIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
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
            <svg
              className="h-1.5 w-1.5 fill-indigo-500"
              viewBox="0 0 6 6"
              aria-hidden="true"
            >
              <circle cx={3} cy={3} r={3} />
            </svg>
            {info.row.original.productCode}
          </span>
        ),
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
            href={`${config.mainServiceURL}/${info.row.original.refDoc}`}
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
};
