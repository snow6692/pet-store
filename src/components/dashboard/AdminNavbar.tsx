import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Folder, Package, ShoppingCart } from "lucide-react";

function AdminNavbar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button asChild variant="outline">
        <Link href="/dashboard/products">
          <Package className="mr-2 h-4 w-4" /> Products
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/dashboard/categories">
          <Folder className="mr-2 h-4 w-4" /> Categories
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/dashboard/orders">
          <ShoppingCart className="mr-2 h-4 w-4" /> Orders
        </Link>
      </Button>
    </div>
  );
}

export default AdminNavbar;
