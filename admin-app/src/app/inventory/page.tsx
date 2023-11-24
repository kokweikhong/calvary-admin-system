"use client";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  InventoryProduct,
  fakeInventoryProducts,
  InventoryProductSummary,
} from "../../interfaces/inventory";
import {
  useGetInventoryProducts,
  useGetInventoryProductSummary,
} from "@/queries/inventory-products";
import { config } from "@/interfaces/config";

export default function InventoryPage() {
  // const products: InventoryProduct[] = fakeInventoryProducts;
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetInventoryProductSummary();

  const [filteredProducts, setFilteredProducts] = useState<
    InventoryProductSummary[]
  >([]);

  // maximum of 8 products per page
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    if (!products) return;
    setFilteredProducts(products);
  }, [products]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {`${error}`}</div>;

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    if (!products) return;
    const value = e.target.value.toLowerCase();
    const filtered = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(value) ||
        product.code.toLowerCase().includes(value) ||
        product.brand.toLowerCase().includes(value)
      );
    });
    setFilteredProducts(filtered);
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">
        <h2>Products</h2>
        <p className="text-gray-500 text-sm mt-1">{`Total ${filteredProducts.length} products`}</p>
        <div className="mt-1">
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              name="product-search"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search by product name, code, or brand"
              onChange={handleFilter}
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {/* Content goes here */}
        <div className="bg-white">
          <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
            <h2 className="sr-only">Products</h2>

            <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts
                .slice(
                  (currentPage - 1) * productsPerPage,
                  currentPage * productsPerPage
                )
                .map((product) => (
                  <div
                    key={product.id}
                    className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
                  >
                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                      {product.thumbnail !== "" ? (
                        <Image
                          loader={({ src, width, quality }) => {
                            return `${
                              config.MainServiceURL
                            }/${src}?w=${width}&q=${quality || 75}`;
                          }}
                          src={product.thumbnail}
                          alt={`${product.name} product shot`}
                          sizes="(max-width: 640px) 100vw, 640px"
                          width={500}
                          height={500}
                          priority={true}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <PhotoIcon className="h-full w-full object-cover object-center" />
                      )}
                    </div>
                    <div className="pb-4 pt-10 text-center">
                      <h3 className="text-sm font-medium text-gray-900">
                        <a href={""}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.code}
                      </p>
                      <div className="mt-3 flex flex-col items-center">
                        <p className="mt-1 text-sm text-gray-500">
                          {product.brand}
                        </p>
                      </div>
                      <div className="mt-4 text-base font-medium text-gray-900">
                        <div className="inline-flex items-center space-x-1">
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            <ArrowRightCircleIcon className="w-4 h-4 mr-1" />
                            <span>{product.totalIncoming.toFixed(0)}</span>
                          </span>
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-green-600/20">
                            <ArrowLeftCircleIcon className="w-4 h-4 mr-1" />
                            <span>{product.totalOutgoing.toFixed(0)}</span>
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            className="h-1.5 w-1.5 fill-yellow-500"
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          {product.totalBalance.toFixed(0)}{" "}
                          {product.standardUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6">
        {/* Content goes here */}
        {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
        <div className="flex items-center justify-end">
          <span className="isolate inline-flex items-center rounded-md shadow-sm">
            <button
              type="button"
              className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="text-gray-500 text-sm px-4">{`${currentPage} / ${totalPages}`}</span>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
