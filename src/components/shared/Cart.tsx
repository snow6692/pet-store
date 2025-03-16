import Link from "next/link";
import React from "react";

function Cart() {
  return (
    <Link href="/cart" className="relative">
      <span className="text-gray-700 hover:text-blue-600 text-lg">🛒</span>
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
        0
      </span>
    </Link>
  );
}

export default Cart;
