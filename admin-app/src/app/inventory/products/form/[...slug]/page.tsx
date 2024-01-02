"use client";

import { InventoryProduct } from "@/interfaces/inventory";

import useFilesystem from "@/hooks/useFilesystem";
import useInventoryProducts from "@/hooks/useInventoryProducts";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { imageLoader } from "@/lib/utils";

const emptyProduct: InventoryProduct = {
  id: 0,
  name: "",
  code: "",
  brand: "",
  standardUnit: "",
  thumbnail: "",
  supplier: "",
  remarks: "",
  isExist: true,
  createdBy: "",
  createdAt: "",
  updatedBy: "",
  updatedAt: "",
};

const standardUnits: { label: string; value: string }[] = [
  { label: "Square Feet", value: "sqft" },
  { label: "Square Meter", value: "sqm" },
  { label: "Kilogram", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Liter", value: "litre" },
  { label: "Pieces", value: "pcs" },
];

export default function InventoryProductFormPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const {
    useGetInventoryProduct,
    useCreateInventoryProduct,
    useUpdateInventoryProduct,
  } = useInventoryProducts();
  const { useUploadFile, useDeleteFile } = useFilesystem();
  const router = useRouter();
  const formType = params.slug[0];
  const productId = params.slug.length > 1 ? params.slug[1] : "";
  const product = useGetInventoryProduct(productId);
  const createProduct = useCreateInventoryProduct();
  const updateProduct = useUpdateInventoryProduct(productId);
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const [coverPhoto, setCoverPhoto] = React.useState<File | null>(null);
  const form = useForm<InventoryProduct>();

  const onCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      setCoverPhoto(e.target.files[0]);
    }
    console.log(e.target.files);
  };

  React.useEffect(() => {
    if (formType === "create") {
      form.reset(emptyProduct);
    } else if (product.data && formType === "update") {
      form.reset(product.data);
    }
  }, [form, formType, product.data]);

  const onSubmit: SubmitHandler<InventoryProduct> = async (data) => {
    if (coverPhoto) {
      const formData = new FormData();
      formData.append("file", coverPhoto);
      formData.append("saveDir", "inventory/products");
      await uploadFile.mutateAsync(formData, {
        onSuccess: async (path) => {
          if (form.watch("thumbnail") !== "") {
            await deleteFile.mutateAsync(form.watch("thumbnail"));
          }
          form.setValue("thumbnail", path);
          data.thumbnail = path;
          setCoverPhoto(null);
        },
      });
    }

    if (formType === "create") {
      await Swal.fire({
        title: "Are you sure want to create this product?",
        text: "You will not be able to recover this product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, create it!",
        cancelButtonText: "No, keep it.",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await createProduct.mutateAsync(data);
            await Swal.fire(
              "Created!",
              "Your product has been created.",
              "success"
            );
            router.push("/inventory/products");
          } catch (error) {
            Swal.fire("Error!", `Create product failed. ${error}`, "error");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your product is safe :)", "error");
        }
      });
    } else if (formType === "update") {
      Swal.fire({
        title: "Are you sure want to update this product with id " + productId,
        text: "You will not be able to recover this product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, keep it.",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateProduct.mutateAsync(data);
            await Swal.fire(
              "Updated!",
              "Your product has been updated.",
              "success"
            );
            router.push("/inventory/products");
          } catch (error) {
            Swal.fire("Error!", `Update product failed. ${error}`, "error");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your product is safe :)", "error");
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
              Inventory Product Form
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              {formType === "create"
                ? "Create a new product"
                : `Update ${product.data?.code}`}
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              {/* Product Code */}
              <Controller
                control={form.control}
                name="code"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="code"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product Code
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="code"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Product Name */}
              <Controller
                control={form.control}
                name="name"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product Name
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Brand */}
              <Controller
                control={form.control}
                name="brand"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Brand
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="brand"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      />
                    </div>
                  </div>
                )}
              />

              {/* Standard Unit */}
              <Controller
                control={form.control}
                name="standardUnit"
                defaultValue=""
                rules={{ required: "Standard Unit is required" }}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="standardUnit"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Standard Unit
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        id="standardUnit"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        {...field}
                      >
                        <option value="" disabled>
                          Please select an unit
                        </option>
                        {standardUnits.map((unit) => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              />

              {/* Supplier */}
              <Controller
                control={form.control}
                name="supplier"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Supplier
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="supplier"
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

              {/* Is Exist */}
              <Controller
                control={form.control}
                name="isExist"
                defaultValue={true}
                render={({ field }) => (
                  <fieldset>
                    <legend className="sr-only">By Email</legend>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-6">
                      <div
                        className="text-sm font-semibold leading-6 text-gray-900"
                        aria-hidden="true"
                      >
                        Product Is Exist?
                      </div>
                      <div className="mt-4 sm:col-span-2 sm:mt-0">
                        <div className="max-w-lg space-y-6">
                          <div className="relative flex gap-x-3">
                            <div className="flex h-6 items-center">
                              <input
                                id="isExist"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                }}
                              />
                            </div>
                            <div className="text-sm leading-6">
                              <label
                                htmlFor="isExist"
                                className="font-medium text-gray-900"
                              >
                                Is Exist
                              </label>
                              <p className="mt-1 text-gray-600">
                                The product is exist in the inventory.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                )}
              />

              <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center gap-x-3">
                    {coverPhoto ? (
                      <React.Fragment>
                        <span className="inline-flex items-center gap-x-0.5 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                          new
                          <button
                            type="button"
                            className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-yellow-600/20"
                            onClick={() => setCoverPhoto(null)}
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
                        <span>{coverPhoto.name}</span>
                      </React.Fragment>
                    ) : form.watch("thumbnail") !== "" ? (
                      <React.Fragment>
                        <span className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          server
                        </span>
                        <span>{form.watch("thumbnail")}</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <PhotoIcon
                          className="h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <span>No Photo</span>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>

              <Controller
                control={form.control}
                name="thumbnail"
                defaultValue={""}
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="thumbnail"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product Thumbnail
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <div className="flex max-w-2xl mb-2 justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center relative w-full min-h-[300px]">
                          {coverPhoto ? (
                            <Image
                              src={URL.createObjectURL(coverPhoto)}
                              alt=""
                              fill
                              className="object-contain"
                            />
                          ) : field.value !== "" ? (
                            <Image
                              loader={imageLoader}
                              src={
                                field.value !== ""
                                  ? field.value
                                  : "/images/placeholder.png"
                              }
                              alt=""
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PhotoIcon
                                className="h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <PhotoIcon
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
                                onChange={(e) => onCoverPhotoChange(e)}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
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
