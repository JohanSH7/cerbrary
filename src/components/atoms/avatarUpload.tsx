"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const AvatarUpload = ({ onImageChange }: { onImageChange: (image: string) => void }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="w-20 h-20">
        {preview ? <AvatarImage src={preview} alt="Preview" /> : <AvatarFallback>IMG</AvatarFallback>}
      </Avatar>
      <label className="relative flex justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="bg-primary text-white rounded-full px-4 py-2 text-sm text-center cursor-pointer">
          Subir imagen
        </div>
      </label>
    </div>
  );
};