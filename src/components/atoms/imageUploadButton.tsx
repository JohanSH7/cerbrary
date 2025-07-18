"use client";
import { Label } from "@/components/ui/label";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadButton = ({ onChange }: Props) => (
  <label className="relative flex justify-center">
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
    <div className="bg-primary text-white rounded-full px-4 py-2 text-sm text-center cursor-pointer">
      Subir imagen
    </div>
  </label>
);