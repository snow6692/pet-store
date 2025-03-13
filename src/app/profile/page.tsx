import prisma from "@/lib/db";
import React from "react";

async function page() {
  const user = await prisma.user.findMany();
  return <div>{user[0].name}</div>;
}

export default page;
