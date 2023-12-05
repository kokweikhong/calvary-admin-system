"use client";

import UserProfileForm from "@/components/UserProfileForm";
import { User, emptyUser } from "@/interfaces/user";
import { SubmitHandler, useForm } from "react-hook-form";

export default function UserUpdatePage({
  params,
}: {
  params: { slug: string };
}) {
  const userId = params.slug;
  console.log(userId);

  const form = useForm<User>({
    defaultValues: emptyUser,
  });

  const onSubmit: SubmitHandler<User> = (data) => {
    console.log(data);
  };

  return (
    <div>
      <UserProfileForm user={emptyUser} action="update" />
    </div>
  );
}
