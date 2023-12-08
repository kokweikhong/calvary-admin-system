"use client";

import { useState } from 'react'
import Image from 'next/image'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import useUsers from '@/hooks/useUsers';
import LoadingSpinner from '@/components/LoadingSpinner';
import { isImageExt } from '@/lib/utils';
import { config } from '@/lib/config';
import { User } from '@/interfaces/user';
import SlideOver from '@/components/SlideOver';
import UserProfileForm from '@/components/UserProfileForm';

export default function UpdateUserPage() {
  const { useGetUsers } = useUsers();
  const { data: users, isError, error, isLoading } = useGetUsers();
  const [selectedPerson, setSelectedPerson] = useState<User>()
  const [openForm, setOpenForm] = useState(false)


  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    throw error;
  }

  if (!users) {
    return <div>No users found</div>;
  }

  return (
    <main>
      <div>
        <ul
          role="list"
          className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
        >
          {users?.map((user) => (
            <li key={user.email} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
              <div className="flex gap-x-4">

                {user.profileImage !== "" &&
                  isImageExt(user.profileImage) ? (
                  <Image
                    className="rounded-full bg-gray-50"
                    src={`${config.mainServiceURL}/${user.profileImage}`}
                    alt={user.username}
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                    <span className="text-sm font-medium leading-none text-white">
                      {user.username.slice(0, 2).toUpperCase()}
                    </span>
                  </span>
                )}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <button
                      onClick={() => {
                        setSelectedPerson(user);
                        setOpenForm(true);
                      }}
                    >
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {user.username}
                    </button>
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    <a href={`mailto:${user.email}`} className="relative truncate hover:underline">
                      {user.email}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900 capitalize">
                    {`${user.position || "No position"} / ${user.department || "No department"}`}
                  </p>
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">{user.role}</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <SlideOver open={openForm} setOpen={setOpenForm}>
        {selectedPerson ? (
          <UserProfileForm
            action='update'
            isAdmin={true}
            user={selectedPerson as User}
          />
        ) : (
          <div
            className="flex-1 flex flex-col justify-center items-center"
          >No user selected</div>
        )}

      </SlideOver>
    </main >
  )
}
