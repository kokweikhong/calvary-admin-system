"use client"

import { useState, useEffect } from "react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { KeyIcon } from "@heroicons/react/24/outline"

type ResetPasswordProps = {
  email: string
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  // const [newPassword, setNewPassword] = useState("")
  // const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string>("")

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const newPassword = form.watch("password")

  const confirmPassword = form.watch("confirmPassword")

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
    } else {
      setPasswordError("")
    }
  }, [newPassword, confirmPassword])

  const onSubmit: SubmitHandler<ResetPasswordProps> = async (data) => {
    console.log(data)
  }


  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-10">
        <div>
          <KeyIcon className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset your password
          </h2>
        </div>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              type="email"
              autoComplete="email"
              className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Email address"
              {...form.register("email", { required: true })}
            />
          </div>
          <div className="relative -space-y-px rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />

            <div>
              <label htmlFor="password" className="sr-only">
                New password
              </label>
              <input
                id="password"
                type="password"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="New password"
                {...form.register("password", { required: true })}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Confirm password"
                {...form.register("confirmPassword", { required: true })}
              />
            </div>
          </div>

          {passwordError !== "" && (
            <p className="text-sm font-medium leading-5 text-red-500 italic">{passwordError}</p>
          )}


          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Reset password
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
