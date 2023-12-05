"use client";

import useUsers from "@/hooks/useUsers";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/20/solid";
import { config } from "@/lib/config";
import { isImageExt } from "@/lib/utils";

export default function Example() {
  const { getUsers } = useUsers();
  const { data: users, error, isLoading } = getUsers();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    throw error;
  }

  if (!users) {
    return <div>No users found</div>;
  }

  console.log(users);
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {users.map((user) => (
        <li
          key={user.email}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">
                  {user.username}
                </h3>
                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {user.role}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">
                {user.department}
              </p>
            </div>
            {isImageExt(user.profileImage) ? (
              <Image
                className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                src={`${config.mainServiceURL}/${user.profileImage}`}
                alt={user.username}
              />
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                <span className="text-sm font-medium leading-none text-white">
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
              </span>
            )}
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`mailto:${user.email}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <EnvelopeIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Email
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
