"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploadButton } from "@/components/atoms/imageUploadButton";

interface Props {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileImageUpload = ({ imagePreview, onImageChange }: Props) => (
  <div className="flex flex-col items-center gap-2">
    <Avatar className="w-20 h-20">
      {imagePreview ? (
        <AvatarImage src={imagePreview} alt="Preview" />
      ) : (
        <AvatarFallback>IMG</AvatarFallback>
      )}
    </Avatar>
    <ImageUploadButton onChange={onImageChange} />
  </div>
);