import { getUser } from "@/actions/user.action";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user || user?.role === "USER") return redirect("/");
  return <div>{children}</div>;
}

export default DashboardLayout;
