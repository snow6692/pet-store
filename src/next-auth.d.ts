import { UserRole } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { AdapterUser as CoreAdapterUser } from "@auth/core/adapters";

// Extend NextAuth Session and User
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole | null;
    };
  }

  interface User extends DefaultUser {
    role: UserRole | null;
  }
}

// Extend JWT
declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role: UserRole | null;
  }
}

// Extend Core AdapterUser to include role
declare module "@auth/core/adapters" {
  interface AdapterUser extends CoreAdapterUser {
    role: UserRole | null;
  }
}
