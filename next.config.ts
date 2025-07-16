import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
},
  reactStrictMode: true,
};

export default nextConfig;
