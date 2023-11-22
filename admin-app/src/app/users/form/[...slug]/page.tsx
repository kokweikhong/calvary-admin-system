"use client";

import { User, emptyUser } from "@/interfaces/user";
import { useUploadFile } from "@/queries/filesystem";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type OptionProps = {
  value: string;
  label: string;
};

const roles: OptionProps[] = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const positions: OptionProps[] = [
  { value: "ceo", label: "CEO" },
  { value: "cto", label: "CTO" },
  { value: "coo", label: "COO" },
  { value: "cfo", label: "CFO" },
];

const departments: OptionProps[] = [
  { value: "engineering", label: "Engineering" },
  { value: "human-resources", label: "Human Resources" },
  { value: "customer-success", label: "Customer Success" },
  { value: "marketing", label: "Marketing" },
];

export default function UserFormPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const formType = params.slug[0];
  const uploadFile = useUploadFile();
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<User>();

  useEffect(() => {
    if (formType === "create") {
      form.reset(emptyUser);
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  const onSubmit: SubmitHandler<User> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-12 sm:space-y-16">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            {/* Username */}
            <Controller
              control={form.control}
              name="username"
              defaultValue=""
              render={({ field }) => (
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Username
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      id="username"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      {...field}
                    />
                  </div>
                </div>
              )}
            />

            {/* Email Address */}
            <Controller
              control={form.control}
              name="email"
              defaultValue=""
              render={({ field }) => (
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Email Address
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      type="email"
                      id="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      {...field}
                    />
                  </div>
                </div>
              )}
            />

            {/* Password */}
            <Controller
              control={form.control}
              name="password"
              defaultValue=""
              render={({ field }) => (
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Password
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      type="password"
                      id="password"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      {...field}
                    />
                  </div>
                </div>
              )}
            />

            {/* Role */}
            <Controller
              control={form.control}
              name="role"
              defaultValue=""
              render={({ field }) => (
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Role
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <select
                      id="role"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      {...field}
                    >
                      <option value={""} disabled>
                        Please select a role
                      </option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            />

            {/* Position */}
            <Controller
              control={form.control}
              name="position"
              defaultValue=""
              render={({ field }) => (
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Position
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <select
                      id="position"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      {...field}
                    >
                      <option value={""} disabled>
                        Please select a position
                      </option>
                      {positions.map((position) => (
                        <option key={position.value} value={position.value}>
                          {position.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            />

            {/* Department */}
            <Controller
              control={form.control}
              name="department"
              defaultValue=""
              render={({ field }) => (
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Department
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <select
                      id="department"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      {...field}
                    >
                      <option value={""} disabled>
                        Please select a department
                      </option>
                      {departments.map((department) => (
                        <option key={department.value} value={department.value}>
                          {department.label}
                        </option>
                      ))}
                    </select>
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
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="isExist"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Department
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="isExist"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="isExist"
                          className="font-medium text-gray-900"
                        >
                          Is Exist?
                        </label>
                        <p className="mt-1 text-gray-600">
                          Is this user exist?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />

            <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile Image
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-x-3">
                  {file ? (
                    <div className="flex space-x-2 items-center">
                      <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        New
                      </span>
                      <div className="relative h-12 w-12 rounded-full border">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="Profile Image"
                          fill
                          className="rounded-full object-contain"
                        />
                      </div>
                    </div>
                  ) : form.watch("profileImage") !== "" ? (
                    <div className="flex space-x-2 items-center">
                      <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        Server
                      </span>
                      <UserCircleIcon
                        className="h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div className="flex space-x-2 items-center">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        No Image
                      </span>
                      <UserCircleIcon
                        className="h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Image Upload
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
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
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="capitalize inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {formType}
        </button>
      </div>
    </form>
  );
}
