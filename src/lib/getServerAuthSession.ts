import { getToken } from "next-auth/jwt";
import type { GetServerSidePropsContext } from "next";

export const getServerAuthSession = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken({ req: ctx.req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) return null;

  return {
    user: {
      id: token.id as string,
      email: token.email as string,
      role: token.role as "USER" | "ADMIN",
      status: token.status as "APPROVED" | "PENDING" | "REJECTED",
    },
    expires: token.exp as unknown as string,
  };
};
