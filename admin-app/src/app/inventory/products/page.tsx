"use client";

import { Card, CardBody, CardHeader } from "@/components/Card";
import InventoryTable from "@/components/InventoryTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useInventoryProductColumns } from "@/hooks/inventoryColumns";
import useInventoryProducts from "@/hooks/useInventoryProducts";
import Link from "next/link";

export default function InventoryProductsPage() {
  const { useGetInventoryProducts } = useInventoryProducts();
  const products = useGetInventoryProducts();
  const columns = useInventoryProductColumns();

  if (products.isLoading) {
    return <LoadingSpinner label="products data" />;
  }

  if (products.isError) throw products.error;

  if (!products.data) {
    return <div>No products found</div>;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Inventory Products
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                List of inventory products
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Link
                href="/inventory/products/form/create"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                New Inventory Product
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <InventoryTable data={products.data} columns={columns as any} />
        </CardBody>
      </Card>
    </div>
  );
}
