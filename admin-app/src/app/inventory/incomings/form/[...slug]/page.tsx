"use client";

import {
  InventoryIncoming,
  emptyInventoryIncoming,
} from "@/interfaces/inventory";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/queries/filesystem";
import {
  useCreateInventoryIncoming,
  useGetInventoryIncoming,
  useUpdateInventoryIncoming,
} from "@/queries/inventory-incoming";
import useInventoryIncomings from "@/hooks/useInventoryIncomings";
import { useGetInventoryProducts } from "@/queries/inventory-products";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const countries: { label: string; value: string }[] = [
  { label: "Malaysia", value: "malaysia" },
  { label: "Singapore", value: "singapore" },
];

const units: { label: string; value: string }[] = [
  { label: "Square Feet", value: "sqft" },
  { label: "Square Meter", value: "sqm" },
  { label: "Kilogram", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Liter", value: "litre" },
  { label: "Pieces", value: "pcs" },
];

const statuses: { label: string; value: string }[] = [
  { label: "Incoming", value: "incoming" },
  { label: "In-stock", value: "in-stock" },
  { label: "Returned", value: "returned" },
  { label: "Clearance", value: "clearance" },
];

const FlatBadge = ({
  label,
  color,
}: {
  label: string;
  color: "yellow" | "blue";
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        color === "blue" ? "bg-blue-100 text-blue-800" : "",
        color === "yellow" ? "bg-yellow-100 text-yellow-800" : ""
      )}
    >
      {label}
    </span>
  );
};

export default function InventoryIncomingFormPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { getInventoryIncoming } = useInventoryIncomings();
  const router = useRouter();
  const formType = params.slug[0];
  const incomingId = params.slug.length > 1 ? params.slug[1] : "";
  const incoming = useGetInventoryIncoming(incomingId);
  // const products = fakeInventoryProducts;
  const createIncoming = useCreateInventoryIncoming();
  const updateIncoming = useUpdateInventoryIncoming(incomingId);
  const products = useGetInventoryProducts();
  const uploadFile = useUploadFile();

  const [refDoc, setRefDoc] = React.useState<File | null>(null);

  const form = useForm<InventoryIncoming>();

  const onRefDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      setRefDoc(e.target.files[0]);
    }
  };

  React.useEffect(() => {
    if (formType === "create") {
      form.reset(emptyInventoryIncoming);
    } else if (incoming.data && formType === "update") {
      form.reset(incoming.data);
    }
  }, [form, formType, incoming.data]);

  const onSubmit: SubmitHandler<InventoryIncoming> = async (data) => {
    console.log(data);
    if (refDoc) {
      const formData = new FormData();
      formData.append("file", refDoc);
      formData.append("saveDir", "inventory/incomings");
      await uploadFile.mutateAsync(formData, {
        onSuccess: (path) => {
          form.setValue("refDoc", path);
          data.refDoc = path;
          setRefDoc(null);
        },
      });
    }
    if (formType === "create") {
      Swal.fire({
        title: "Are you confirm to create this incoming?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, create it!",
        cancelButtonText: "No, cancel!",
      }).then(async (result) => {
        if (result.isConfirmed) {
        }
      });
    } else if (formType === "update") {
      Swal.fire({
        title: "Are you confirm to update this incoming?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateIncoming.mutateAsync(data);
            Swal.fire({
              title: "Updated!",
              text: "Your incoming has been updated.",
              icon: "success",
            });
            router.push("/inventory/incomings");
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: `Cannot update incoming: ${error}`,
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "Cancelled!",
            text: "Your incoming is not updated.",
            icon: "error",
          });
        }
      });
    }
  };

  if (products.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Inventory Incoming Form
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              {formType === "create"
                ? "Create a new incoming"
                : `Update incoming id ${incoming.data?.id}`}
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              {/* Product Id */}
              <Controller
                control={form.control}
                name="productId"
                defaultValue={0}
                rules={{ required: "Product is required" }}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="productId"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        id="productId"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      >
                        {products.data && products.data.length > 0 ? (
                          <>
                            <option value="" disabled>
                              Please select a product
                            </option>
                            {products.data.map((product) => (
                              <option key={product.code} value={product.id}>
                                {product.code} | {product.name}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option value="" disabled>
                            No product found
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                )}
              />

              {/* Status */}
              <Controller
                control={form.control}
                name="status"
                defaultValue=""
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Status
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        id="status"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      >
                        <option value="" disabled>
                          Please select a status
                        </option>
                        {statuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              />

              {/* Standard Quantity */}
              <Controller
                control={form.control}
                name="standardQuantity"
                defaultValue={0}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="standardQuantity"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Std Quantity
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        step={0.01}
                        id="standardQuantity"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Std unit from product:{" "}
                        {
                          <FlatBadge
                            color="blue"
                            label={
                              products.data?.find(
                                (p) => p.id === form.watch("productId")
                              )?.standardUnit ?? "N/A"
                            }
                          />
                        }
                      </p>
                    </div>
                  </div>
                )}
              />

              {/* Quantity */}
              <Controller
                control={form.control}
                name="quantity"
                defaultValue={0}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Quantity
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        step={0.01}
                        id="quantiy"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {form.watch("length") > 0 && (
                          <FlatBadge
                            label={`L: ${form.watch("length")}`}
                            color="yellow"
                          />
                        )}
                        {"  "}
                        {form.watch("width") > 0 && (
                          <FlatBadge
                            label={`W: ${form.watch("width")}`}
                            color="yellow"
                          />
                        )}
                        {"  "}
                        {form.watch("height") > 0 && (
                          <FlatBadge
                            label={`H: ${form.watch("height")}`}
                            color="yellow"
                          />
                        )}
                        {"  "}
                        {form.watch("unit") !== "" && (
                          <FlatBadge
                            label={`${form.watch("unit")}`}
                            color="blue"
                          />
                        )}
                      </p>
                    </div>
                  </div>
                )}
              />

              {/* Unit */}
              <Controller
                control={form.control}
                name="unit"
                defaultValue=""
                rules={{ required: "Unit is required" }}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="unit"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Unit
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        id="unit"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      >
                        <option value="" disabled>
                          Please select a status
                        </option>
                        {units.map((unit) => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              />

              {/* Length */}
              <Controller
                control={form.control}
                name="length"
                defaultValue={0}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="length"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Length
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        step={0.001}
                        id="length"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Width */}
              <Controller
                control={form.control}
                name="width"
                defaultValue={0}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="width"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Width
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        step={0.001}
                        id="width"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Height */}
              <Controller
                control={form.control}
                name="height"
                defaultValue={0}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Height
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        step={0.001}
                        id="width"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Cost */}
              <Controller
                control={form.control}
                name="cost"
                defaultValue={0}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="cost"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Cost
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="number"
                        step={0.01}
                        id="cost"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Store Country */}
              <Controller
                control={form.control}
                name="storeCountry"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="storeCountry"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Store Country
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        id="storeCountry"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      >
                        <option value="" disabled>
                          Please select a country
                        </option>
                        {countries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              />

              {/* Store Location */}
              <Controller
                control={form.control}
                name="storeLocation"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="storeLocation"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Store Location
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="storeLocation"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Remarks */}
              <Controller
                control={form.control}
                name="remarks"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Remarks
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="remarks"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Reference No */}
              <Controller
                control={form.control}
                name="refNo"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="refNo"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Reference No
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="refNo"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
                <label
                  htmlFor="refDoc"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Reference Document
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center gap-x-3">
                    {refDoc ? (
                      <React.Fragment>
                        <span className="inline-flex items-center gap-x-0.5 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                          new
                          <button
                            type="button"
                            className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-yellow-600/20"
                            onClick={() => setRefDoc(null)}
                          >
                            <span className="sr-only">Remove</span>
                            <svg
                              viewBox="0 0 14 14"
                              className="h-3.5 w-3.5 stroke-yellow-700/50 group-hover:stroke-yellow-700/75"
                            >
                              <path d="M4 4l6 6m0-6l-6 6" />
                            </svg>
                            <span className="absolute -inset-1" />
                          </button>
                        </span>
                        <span>{refDoc.name}</span>
                      </React.Fragment>
                    ) : form.watch("refDoc") !== "" ? (
                      <React.Fragment>
                        <span className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          server
                        </span>
                        <span>{form.watch("refDoc")}</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <DocumentIcon
                          className="h-10 w-10 text-gray-300"
                          aria-hidden="true"
                        />
                        <span>No Document</span>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>

              <Controller
                control={form.control}
                name="refDoc"
                defaultValue={""}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="thumbnail"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Reference Upload
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <DocumentIcon
                            className="mx-auto h-12 w-12 text-gray-300"
                            aria-hidden="true"
                          />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file"
                                name="file"
                                type="file"
                                className="sr-only"
                                onChange={(e) => onRefDocChange(e)}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF, PDF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {formType === "create" ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
