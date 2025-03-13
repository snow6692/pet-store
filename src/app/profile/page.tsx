import { getUser } from "@/actions/user.action";
import React from "react";

async function page() {
  const user = await getUser();
  console.log("db user "+user);
  

  return (
    <div>
      {user?.name}
      {user?.role}
    </div>
  );
}

export default page;
