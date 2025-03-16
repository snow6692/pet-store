import { getCartItems } from "@/actions/cart.action";

export type cartItemsType = Awaited<ReturnType<typeof getCartItems>>;
export type cartItemType = cartItemsType[number];
