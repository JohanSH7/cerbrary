import { BrandInfo } from "@/components/atoms/brandInfo";
import { AuthPanel } from "@/components/organism/authPanel";

export const AuthTemplate = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#fffaf0] text-gray-800">
    <div className="flex w-full max-w-6xl mx-auto rounded-lg overflow-hidden">
      <div className="hidden md:flex flex-col justify-center items-start p-12 w-1/2 bg-transparent">
        <BrandInfo />
      </div>
      <div className="w-full md:w-1/2 px-8 py-10">
        <AuthPanel />
      </div>
    </div>
  </div>
);