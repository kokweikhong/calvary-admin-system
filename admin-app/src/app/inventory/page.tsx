"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import {
  InventoryProduct,
  fakeInventoryProducts,
} from "../../interfaces/inventory";

export default function InventoryPage() {
  const products: InventoryProduct[] = fakeInventoryProducts;

  const [filteredProducts, setFilteredProducts] =
    useState<InventoryProduct[]>(products);

  // maximum of 8 products per page
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  // const [pageProducts, setPageProducts] = useState<InventoryProduct[]>([]);
  // function handlePageChange(page: number) {
  //   setCurrentPage(page);
  //   const start = (page - 1) * productsPerPage;
  //   const end = start + productsPerPage;
  //   setPageProducts(filteredProducts.slice(start, end));
  // }
  // useEffect(() => {
  //   const pages = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     pages.push(i);
  //   }
  //   setPageNumbers(pages);
  //   handlePageChange(1);
  // }, [totalPages]);
  // useEffect(() => {
  //   setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
  // }, [filteredProducts, productsPerPage]);
  // useEffect(() => {
  //   handlePageChange(currentPage);
  // }, [currentPage]);
  // useEffect(() => {
  //   handlePageChange(1);
  // }, [filteredProducts]);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
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
                    <div className="relative aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                      {product.thumbnail !== "" ? (
                        <Image
                          loader={({ src, width, quality }) => {
                            return `${src}?w=${width}&q=${quality || 75}`;
                          }}
                          src={product.thumbnail}
                          alt={`${product.name} product shot`}
                          fill
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
                      <div className="mt-3 flex flex-col items-center">
                        <p className="mt-1 text-sm text-gray-500">
                          {product.code}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.brand}
                        </p>
                      </div>
                      <p className="mt-4 text-base font-medium text-gray-900">
                        15 mm
                      </p>
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
