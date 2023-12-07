"use client";

import { User } from "@/interfaces/user";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useUsers from "@/hooks/useUsers";
import useFilesystem from "@/hooks/useFilesystem";
import { useState, Fragment } from "react";
import Image from "next/image";
import { isImageExt } from "@/lib/utils";
import Swal from "sweetalert2";

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
  const { useUploadFile } = useFilesystem();
  const { useCreateUser, useUpdateUser } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser(user?.id?.toString() || "");
  const uploadFile = useUploadFile();


  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

  const form = useForm<User>({
    defaultValues: user,
  });

  const onSubmit: SubmitHandler<User> = async (data) => {

    if (coverPhoto) {
      const formData = new FormData();
      formData.append("file", coverPhoto);
      formData.append("saveDir", "users/profiles");
      await uploadFile.mutateAsync(formData, {
        onSuccess: (path) => {
          form.setValue("profileImage", path);
          data.profileImage = path;
          setCoverPhoto(null);
        },
      });
    }
    console.log(coverPhoto);
    console.log(data);

    Swal.fire({
      title: `Are you sure you want to ${action} this user?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: action,
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (action === "create") {
          await createUser.mutateAsync(data);
        } else if (action === "update") {
          await updateUser.mutateAsync(data);
        }
        Swal.fire({
          title: "Success!",
          text: `User has been ${action}d.`,
          icon: "success",
        });
      }
    })


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
                  <Fragment>
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
                  </Fragment>
                ) : form.watch("profileImage") !== "" ? (
                  <Fragment>
                    <span className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      server
                    </span>
                    <span>{form.watch("profileImage")}</span>
                  </Fragment>
                ) : (
                  <Fragment>
                    <PhotoIcon
                      className="h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <span>No Photo</span>
                  </Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
            <label
              htmlFor="profile-image"
              className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
            >
              Profile Image
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

          <Controller
            control={form.control}
            name="profileImage"
            defaultValue={""}
            render={({ field }) => (
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Profile Image Upload
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
                          src={
                            field.value !== ""
                              ? `http://localhost:8080/${field.value}`
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
            )}
          />


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
