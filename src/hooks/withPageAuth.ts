import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { getServerAuthSession } from "@/lib/getServerAuthSession";
import { Session } from "next-auth";

type Role = "USER" | "ADMIN";

interface Options {
  allowedRoles?: Role[];
}

export function withPageAuth<T extends { [key: string]: unknown }>(
  handler: (
    ctx: GetServerSidePropsContext,
    session: Session
  ) => Promise<GetServerSidePropsResult<T>>,
  options: Options = { allowedRoles: ["USER", "ADMIN"] }
): GetServerSideProps<T> {
  return async (ctx) => {
    const session = await getServerAuthSession(ctx) as Session | null;

    if (!session || session.user.status !== "APPROVED") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (
      options.allowedRoles &&
      !options.allowedRoles.includes(session.user.role)
    ) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return handler(ctx, session);
  };
}
