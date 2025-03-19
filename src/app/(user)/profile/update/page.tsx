import UpdateUserForm from "@/components/forms/UpdateUserForm";
import { cachedUser } from "@/lib/cache/user.cache";
import React from "react";

async function page() {
  const user = await cachedUser();
  if (!user) return;

  return <UpdateUserForm user={user} />;
}

export default page;
