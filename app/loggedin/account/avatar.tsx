"use client";
import { Database } from "@/lib/database.types";
import UserIcon from "@/public/user-icon.svg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import React, { useEffect, useState } from "react";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string;
  url: Profiles["avatar_url"];
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatar_url"]>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {avatarUrl ? (
        <div className="avatar">
          <div className="w-24 rounded-full">
            <Image width={size} height={size} src={avatarUrl} alt="Avatar" />
          </div>
        </div>
      ) : (
        <div className="avatar">
          <div className="w-24 rounded-full">
            <Image width={size} height={size} src={UserIcon} alt="Avatar" />
          </div>
        </div>
      )}
      <div className="form-control w-full max-w-xs ">
        <label className="label ">
          <span className="label-text w-full text-center text-accent-content">
            Upload an avatar image
          </span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered file-input-sm w-full max-w-xs text-base-content"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
