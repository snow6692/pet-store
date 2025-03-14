import React, { ReactNode } from "react";

function CategoryLayout({ children }: { children: ReactNode }) {
  return <div className="mx-5 mt-10">{children}</div>;
}

export default CategoryLayout;
