import { getUser } from "@/actions/user.action";
import AdminNavbar from "@/components/dashboard/AdminNavbar";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user || user?.role === "USER") return redirect("/");
  return (
    <div className=" mt-10">
      <AdminNavbar />
      {children}
    </div>
  );
}

export default DashboardLayout;
