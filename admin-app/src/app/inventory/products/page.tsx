"use client";

import { useInventoryProductColumns } from "@/hooks/inventoryColumns";
import { useGetInventoryProducts } from "@/queries/inventory-products";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardHeader, CardBody } from "@/components/Card";
import InventoryTable from "@/components/InventoryTable";


export default function InventoryProductsPage() {
  const products = useGetInventoryProducts();
  // const deleteProduct = useDeleteInventoryProduct();
  const columns = useInventoryProductColumns();


  // function handleDeleteProduct(id: string) {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You will not be able to recover this product!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "No, keep it.",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteProduct.mutateAsync(id);
  //       Swal.fire("Deleted!", "Your product has been deleted.", "success");
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire("Cancelled", "Your product is safe :)", "error");
  //     }
  //   });
  // }

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
    <div>
      <Card>
        <CardHeader>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Inventory Outgoings
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                List of inventory outgoings
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                New Inventory Outgoing
              </button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <InventoryTable
            data={products.data}
            columns={columns as any}
          />
        </CardBody>
      </Card>
    </div>
  );
}
