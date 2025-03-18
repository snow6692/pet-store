"use client";

import { logout } from "@/actions/user.action";
import { useTransition } from "react";

export default function Logout() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="w-full text-left"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
