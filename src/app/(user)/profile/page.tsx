import { cachedUser } from "@/lib/cache/user.cache";
import Link from "next/link";
import React from "react";

async function page() {
  const user = await cachedUser();
  if (!user) return;

  return <Link href={"/profile/update"}>Update your profile</Link>;
}

export default page;
