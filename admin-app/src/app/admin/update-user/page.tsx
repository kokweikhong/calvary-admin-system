"use client";

import { useEffect, useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import { cn } from '@/lib/utils';
import useUsers from '@/hooks/useUsers';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image'
import { isImageExt } from '@/lib/utils';
import { config } from '@/lib/config';
import { User } from '@/interfaces/user';
import SlideOver from '@/components/SlideOver';
import UserProfileForm from '@/components/UserProfileForm';

export default function UpdateUserPage() {
  const { useGetUsers } = useUsers();
  const { data: users, error, isLoading } = useGetUsers();
  const [query, setQuery] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [openForm, setOpenForm] = useState(false)

  const filteredUsers =
    query === ''
      ? users
      : users?.filter((user) => {
        return user.username.toLowerCase().includes(query.toLowerCase())
      })

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    throw error;
  }

  if (!users) {
    return <div>No users found</div>;
  }

  return (
    <main>
      <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Combobox.Label>
        <div className="relative mt-2">
          <Combobox.Input
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(user: User) => user?.username}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {filteredUsers && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredUsers.map((user) => (
                <Combobox.Option
                  key={user.id}
                  value={user}
                  className={({ active }) =>
                    cn(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <div className="flex items-center">

                        {isImageExt(user.profileImage) ? (
                          <Image
                            className="flex-shrink-0 rounded-full bg-gray-300"
                            src={`${config.mainServiceURL}/${user.profileImage}`}
                            alt={user.username}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                            <span className="text-sm font-medium leading-none text-white">
                              {user.username.slice(0, 2).toUpperCase()}
                            </span>
                          </span>
                        )}
                        <span className={cn('ml-3 truncate', selected && 'font-semibold')}>{user.username}</span>
                      </div>

                      {selected && (
                        <span
                          className={cn(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-indigo-600'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>

      <button onClick={() => setOpenForm(true)}>Open form</button>

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
    </main>
  )
}
