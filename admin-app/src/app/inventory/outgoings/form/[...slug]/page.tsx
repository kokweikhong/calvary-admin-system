"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useFilesystem from "@/hooks/useFilesystem";
import useInventoryIncomings from "@/hooks/useInventoryIncomings";
import useInventoryOutgoings from "@/hooks/useInventoryOutgoings";
import useInventoryProducts from "@/hooks/useInventoryProducts";
import {
  InventoryOutgoing,
  emptyInventoryIncoming,
} from "@/interfaces/inventory";
import { cn } from "@/lib/utils";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Swal, { SweetAlertOptions } from "sweetalert2";

const statuses: { label: string; value: string }[] = [
  { label: "Collected", value: "collected" },
  { label: "Reserved", value: "reserved" },
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

export default function InventoryOutgoingFormPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { useGetInventoryProducts } = useInventoryProducts();
  const { useGetInventoryIncomings } = useInventoryIncomings();
  const {
    useGetInventoryOutgoing,
    useCreateInventoryOutgoing,
    useUpdateInventoryOutgoing,
  } = useInventoryOutgoings();
  const { useUploadFile, useDeleteFile } = useFilesystem();

  const router = useRouter();
  const formType = params.slug[0];
  const outgoingId = params.slug.length > 1 ? params.slug[1] : "";
  const outgoing = useGetInventoryOutgoing(outgoingId);
  const products = useGetInventoryProducts().data ?? [];
  const incomings = useGetInventoryIncomings().data ?? [];
  const createOutgoing = useCreateInventoryOutgoing();
  const updateOutgoing = useUpdateInventoryOutgoing(outgoingId);
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();

  const [refDoc, setRefDoc] = React.useState<File | null>(null);

  const form = useForm<InventoryOutgoing>();

  const onRefDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      setRefDoc(e.target.files[0]);
    }
  };

  const sweetAlerOptions = (formType: string): SweetAlertOptions => {
    const options: SweetAlertOptions = {
      title: `Are you confirm to ${formType.toLowerCase()} this outgoing?`,
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${formType.toLowerCase()} it!`,
      cancelButtonText: "No, cancel!",
    };
    return options;
  };

  async function handleCreateOutgoing(data: InventoryOutgoing) {
    try {
      await createOutgoing.mutateAsync(data);
      await Swal.fire({
        title: "Created!",
        text: "Your outgoing has been created.",
        icon: "success",
      });
      router.push("/inventory/outgoings");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `${error}`,
        icon: "error",
      });
    }
  }

  async function handleUpdateOutgoing(data: InventoryOutgoing) {
    try {
      await updateOutgoing.mutateAsync(data);
      await Swal.fire({
        title: "Updated!",
        text: "Your outgoing has been updated.",
        icon: "success",
      });
      router.push("/inventory/outgoings");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `${error}`,
        icon: "error",
      });
    }
  }

  React.useEffect(() => {
    if (formType === "create") {
      form.reset(emptyInventoryIncoming);
    } else if (outgoing.data && formType === "update") {
      form.reset(outgoing.data);
    }
  }, [form, formType, outgoing.data]);

  const onSubmit: SubmitHandler<InventoryOutgoing> = async (data) => {
    if (refDoc) {
      const formData = new FormData();
      formData.append("file", refDoc);
      formData.append("saveDir", "inventory/outgoings");
      await uploadFile.mutateAsync(formData, {
        onSuccess: async (path) => {
          if (form.watch("refDoc") !== "") {
            await deleteFile.mutateAsync(form.watch("refDoc"));
          }
          form.setValue("refDoc", path);
          data.refDoc = path;
          setRefDoc(null);
        },
      });
    }
    if (formType === "create") {
      Swal.fire(sweetAlerOptions("create")).then(async (result) => {
        if (result.isConfirmed) {
          handleCreateOutgoing(data);
        }
      });
    } else if (formType === "update") {
      Swal.fire(sweetAlerOptions("update")).then(async (result) => {
        if (result.isConfirmed) {
          handleUpdateOutgoing(data);
        }
      });
    }
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Inventory Outgoing Form
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              {formType === "create"
                ? "Create a new outgoing"
                : `Update outgoing id ${outgoing.data?.id}`}
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
                          form.setValue("incomingId", 0);
                        }}
                      >
                        <option value="0" disabled>
                          Please select a product
                        </option>
                        {products.map((product) => (
                          <option key={product.code} value={product.id}>
                            {product.code} | {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              />

              {/* Incoming Id */}
              <Controller
                control={form.control}
                name="incomingId"
                defaultValue={0}
                rules={{ required: "Product is required" }}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="incomingId"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Incoming
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        id="incomingId"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                        disabled={form.watch("productId") < 1}
                      >
                        <option value="0" disabled>
                          Please select an incoming
                        </option>
                        {incomings.map(
                          (incoming) =>
                            incoming.productId === form.watch("productId") && (
                              <option key={incoming.id} value={incoming.id}>
                                {incoming.id}
                                {" > "}
                                {incoming.balanceStdQty} {incoming.standardUnit}
                                {" > ("}
                                {incoming.balanceQty}
                                {") "}
                                {incoming.length > 0
                                  ? incoming.length + " x "
                                  : ""}{" "}
                                {incoming.width > 0
                                  ? incoming.width + " x "
                                  : ""}{" "}
                                {incoming.height > 0 ? incoming.height : ""}{" "}
                                {incoming.length > 0 ||
                                  incoming.width > 0 ||
                                  incoming.height > 0
                                  ? incoming.unit
                                  : ""}
                              </option>
                            )
                        )}
                      </select>

                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {form.watch("incomingId") > 0 ? (
                          <HoverCard>
                            <HoverCardTrigger>
                              <FlatBadge
                                color="blue"
                                label={
                                  incomings.find(
                                    (i) => i.id === form.watch("incomingId")
                                  )?.productCode ?? "N/A"
                                }
                              />
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <ScrollArea className="h-96">
                                <div className="flex flex-col gap-y-2">
                                  {Object.entries(
                                    incomings.find(
                                      (i) => i.id === form.watch("incomingId")
                                    ) ?? {}
                                  ).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex items-center gap-x-2"
                                    >
                                      <span className="text-xs font-medium text-gray-500">
                                        {key}
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        {value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <FlatBadge color="blue" label={"N/A"} />
                        )}
                      </p>
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
                              products.find(
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
