import { getUser } from "@/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const user = await getUser();
  if (!user) return redirect("/login");
  return <div>{user.name}</div>;
}

export default page;
