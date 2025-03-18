import Link from "next/link";
import Login from "./buttons/Login";
import { ModeToggle } from "./buttons/ModeToggle";
import { cachedUser } from "@/lib/cache/user.cache";
import CartIcon from "./icons/CartIcon";
import UserIcon from "./icons/UserIcon";

async function Navbar() {
  const user = await cachedUser();
  return (
    <nav className=" shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MyStore
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            href="/products/1"
            className="text-gray-700 hover:text-blue-600"
          >
            Products
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <CartIcon />
          <ModeToggle />
          {user ? <UserIcon user={user} /> : <Login />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
