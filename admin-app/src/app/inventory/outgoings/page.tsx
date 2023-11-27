"use client";

import { Card, CardBody, CardHeader } from "@/components/Card";
import InventoryTable from "@/components/InventoryTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useInventoryOutgoingColumns } from "@/hooks/inventoryColumns";
import { useGetInventoryOutgoings } from "@/queries/inventory-outgoing";
// import { fakeInventoryOutgoings } from "@/interfaces/inventory";

export default function InventoryOutgoingPage() {
  const outgoings = useGetInventoryOutgoings();

  const columns = useInventoryOutgoingColumns();

  if (outgoings.isLoading) {
    return <LoadingSpinner label="outgoings data" />;
  }

  if (outgoings.isError) {
    throw new Error(`Error while fetching outgoings: ${outgoings.error}`);
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
            data={outgoings.data || []}
            columns={columns as any}
          />
        </CardBody>
      </Card>
    </div>
  );
}
