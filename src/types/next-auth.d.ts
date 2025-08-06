declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: "admin" | "user" | "doctor";
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: "admin" | "user" | "doctor";
  }
}