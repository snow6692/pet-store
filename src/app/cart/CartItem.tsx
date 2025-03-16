import { cartItemType } from "@/lib/types/cartTypes";
import React from "react";
interface IProps {
  item: cartItemType;
}
function CartItem({ item }: IProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      {/* صورة المنتج */}
      <img
        src={item.product.images[0]}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded"
      />
      {/* تفاصيل المنتج */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item.product.name}</h2>
        <p className="text-gray-600">Quantity: {item.quantity}</p>
        <p className="text-gray-800 font-bold">${item.product.price}</p>
      </div>
      {/* زر الحذف (سنضيف وظيفته لاحقًا) */}
      <button className="text-red-500 hover:text-red-700">Remove</button>
    </div>
  );
}

export default CartItem;
