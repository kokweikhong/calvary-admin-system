"use client";

import UserProfileForm from "@/components/UserProfileForm";
import { emptyUser } from "@/interfaces/user";

export default function CreateUserPage() {
  return (
    <div>
      <UserProfileForm user={emptyUser} action="create" isAdmin={true} />
    </div>
  );
}
