"use client";

import UserProfileForm from "@/components/UserProfileForm";
import { User } from "@/interfaces/user";
import useUsers from "@/hooks/useUsers";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function UserUpdatePage({
  params,
}: {
  params: { slug: string };
}) {
  const userId = params.slug;
  const { useGetUser } = useUsers()
  const user = useGetUser(userId)

  // if (user.isLoading) {
  //   return <LoadingSpinner />;
  // }

  if (user.isError) {
    return <div>failed to load</div>;
  }

  if (!user.data) {
    return <div>no user</div>;
  }

  return (
    <div>
      <UserProfileForm
        user={user.data as User}
        action="update"
        isAdmin={user.data.role === "admin"} />
    </div>
  );
}
