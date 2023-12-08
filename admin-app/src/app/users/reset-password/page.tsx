"use client"

import { useState, useEffect, FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { KeyIcon } from "@heroicons/react/24/outline"
import { resetPassword, updatePassword, getEmailFromToken } from "@/lib/reset-password"
import Swal from "sweetalert2"

type ResetPasswordProps = {
  email: string
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const [passwordError, setPasswordError] = useState<string>("")

  const params = useSearchParams()

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function getEmail(token: string) {
    const response = await getEmailFromToken(token)
    if (response) {
      form.setValue("email", response)
    }
  }

  useEffect(() => {
    if (params.has("token")) {
      getEmail(params.get("token")!)
    }
  }, [params.has("token")])

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
    try {
      await updatePassword(data.email, data.password, params.get("token")!)
      Swal.fire({
        title: "Password updated!",
        text: "Your password has been updated successfully.",
        icon: "success",
        confirmButtonText: "Ok",
      })
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `Update password failed: ${error}`,
        icon: "error",
        confirmButtonText: "Ok",
      })
    }
  }

  const onResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget["email-address-reset"].value
    try {
      await resetPassword(email)
      Swal.fire({
        title: "Email sent!",
        text: "Please check your email for a link to reset your password.",
        icon: "success",
        confirmButtonText: "Ok",
      })
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `Reset password failed: ${error}`,
        icon: "error",
        confirmButtonText: "Ok",
      })
    }
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

        {!params.has("token") ? (
          <form onSubmit={onResetPassword}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email-address-reset" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address-reset"
                  name="email-address-reset"
                  type="email"
                  autoComplete="email"
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                />
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send reset link
              </button>
            </div>
          </form>
        ) : (
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
        )}

      </div>
    </div>
  )
}
