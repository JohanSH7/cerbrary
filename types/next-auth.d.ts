import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "USER" | "ADMIN";
      status: "PENDING" | "APPROVED" | "REJECTED";
    };
  }

  interface User {
    id: string;
    role: "USER" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED";
  }
}
