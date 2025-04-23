export const dynamic = "force-dynamic";

import { getUser } from "@/actions/user.action";
import UpdateUserForm from "@/components/forms/UpdateUserForm";
import React from "react";

async function page() {
  const user = await getUser();
  if (!user) return;

  return <UpdateUserForm user={user} />;
}

export default page;
