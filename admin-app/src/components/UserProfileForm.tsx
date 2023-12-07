"use client";

import { User } from "@/interfaces/user";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useUsers from "@/hooks/useUsers";
import { useState } from "react";
import { isImageExt } from "@/lib/utils";

type UserProfileFormProps = {
  user: User;
  action: "create" | "update";
  isAdmin?: boolean;
};

const NotAdminMessage = () => (
  <p className="mt-2 text-xs text-red-500 italic">
    This field is disabled because you are not an admin.
  </p>
);

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const departments = [
  { value: "hq", label: "Headquarters" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
];

const positions = [
  { value: "ceo", label: "CEO" },
  { value: "cto", label: "CTO" },
  { value: "cfo", label: "CFO" },
  { value: "coo", label: "COO" },
  { value: "vp", label: "VP" },
  { value: "director", label: "Director" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
  { value: "other", label: "Other" },
];

export default function UserProfileForm({
  user,
  action,
  isAdmin = false,
}: UserProfileFormProps) {
  const { useCreateUser } = useUsers();

  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

  const form = useForm<User>({
    defaultValues: user,
  });

  const onSubmit: SubmitHandler<User> = (data) => {
    console.log(coverPhoto);
    console.log(data);
    
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-12 sm:space-y-16">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {action === "create" ? "Create New User" : "Update User"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>
        </div>

        <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
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
                    id="username"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                    {...field}
                  />
                </div>
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            defaultValue=""
            render={({ field }) => (
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Email address
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                    {...field}
                    disabled={!isAdmin}
                  />
                </div>
                {!isAdmin && <NotAdminMessage />}
              </div>
            )}
          />

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
                    id="password"
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                    {...field}
                  />
                </div>
              </div>
            )}
          />

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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                    {...field}
                    disabled={!isAdmin}
                  >
                    <option value="" disabled>
                      Please select a role
                    </option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!isAdmin && <NotAdminMessage />}
              </div>
            )}
          />

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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                    {...field}
                    disabled={!isAdmin}
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
                {!isAdmin && <NotAdminMessage />}
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="position"
            defaultValue=""
            render={({ field }) => (
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Position
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <select
                    id="position"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                    {...field}
                    disabled={!isAdmin}
                  >
                    <option value={""} disabled>
                      {" "}
                      Please select a position{" "}
                    </option>
                    {positions.map((position) => (
                      <option key={position.value} value={position.value}>
                        {position.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!isAdmin && <NotAdminMessage />}
              </div>
            )}
          />

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
            >
              Cover photo
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <div className="flex space-x-2 items-center justify-start">
                <PhotoIcon
                  className="h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <span className="text-gray-500 text-sm italic">
                  {user.profileImage}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
            >
              Upload photo
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
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && isImageExt(file.name)) {
                            setCoverPhoto(file);
                          }
                        }}
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

          <div className="mt-6 flex items-center justify-end gap-x-6">
            {isAdmin && (
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="capitalize inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {action}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
