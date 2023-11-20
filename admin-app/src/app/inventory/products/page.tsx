"use client";

import Link from "next/link";
import { useGetInventoryProducts } from "@/queries/inventory-products";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDeleteInventoryProduct } from "@/queries/inventory-products";
import Swal from "sweetalert2";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function InventoryProductsPage() {
  const products = useGetInventoryProducts();
  const deleteProduct = useDeleteInventoryProduct();

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
    return <div>Loading...</div>;
  }

  if (products.isError) {
    return <div>Error loading products</div>;
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
        <div className="mt-8 flow-root overflow-auto">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Code
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      Brand
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Supplier
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Unit
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Exist
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Remarks
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.map((product, productIdx) => (
                    <tr key={product.code}>
                      <td
                        className={classNames(
                          productIdx !== products.data.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                        )}
                      >
                        {product.name}
                      </td>
                      <td
                        className={classNames(
                          productIdx !== products.data.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell"
                        )}
                      >
                        {product.code}
                      </td>
                      <td
                        className={classNames(
                          productIdx !== products.data.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {product.brand}
                      </td>
                      <td
                        className={classNames(
                          productIdx !== products.data.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        )}
                      >
                        {product.supplier}
                      </td>
                      <td
                        className={classNames(
                          productIdx !== products.data.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        )}
                      >
                        {product.standardUnit}
                      </td>
                      <td
                        className={classNames(
                          productIdx !== products.data.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        )}
                      >
                        {product.isExist ? "Yes" : "No"}
                      </td>
                      <td
                        className={classNames(
                          productIdx !== products.data.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        )}
                      >
                        {product.remarks}
                      </td>
                      <td
                        className={classNames(
                          productIdx !== products.data.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8"
                        )}
                      >
                        <span className="isolate inline-flex rounded-md shadow-sm">
                          <Link
                            href={`/inventory/products/form/update/${product.id}`}
                            className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                          >
                            <span className="sr-only">Previous</span>
                            <PencilIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </Link>
                          <button
                            type="button"
                            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                            onClick={() =>
                              handleDeleteProduct(product.id.toString())
                            }
                          >
                            <span className="sr-only">Next</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
