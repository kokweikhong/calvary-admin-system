"use client";

import { InventoryProduct } from "@/app/interfaces/inventory";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

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
];

export default function InventoryProductFormPage({
  params,
}: {
  params: { slug: string[] };
}) {
  console.log(params.slug);
  const formType = params.slug[0];

  const [isCoverPhotoChange, setIsCoverPhotoChange] = React.useState(false);
  const [coverPhoto, setCoverPhoto] = React.useState<File | null>(null);

  const form = useForm<InventoryProduct>({
    defaultValues: emptyProduct,
  });

  const onCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCoverPhotoChange(false);
      setCoverPhoto(e.target.files[0]);
    }
  };

  const onSubmit: SubmitHandler<InventoryProduct> = (data) => {
    console.log(data);
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
              {formType === "create" ? "Create a new product" : "Edit product"}
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

              <Controller
                control={form.control}
                name="thumbnail"
                defaultValue=""
                render={({ field }) => (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="thumbnail"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product Thumbnail
                    </label>
                    <input type="text" {...field} hidden />
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      {field.value !== "" ||
                        (coverPhoto && !isCoverPhotoChange && (
                          <div className="flex max-w-2xl mb-2 justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center relative w-full min-h-[300px]">
                              <Image
                                src={
                                  field.value !== ""
                                    ? field.value
                                    : coverPhoto
                                    ? URL.createObjectURL(coverPhoto)
                                    : ""
                                }
                                alt=""
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                        ))}
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
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
