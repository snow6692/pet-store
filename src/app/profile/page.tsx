import { cachedUser } from "@/lib/cache/user.cache";
import React from "react";

async function page() {
  const user = await cachedUser();

  // if (!user) return redirect("/login");
  return <div>{user?.name}</div>;
}

export default page;
