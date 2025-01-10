// components/vendor/account/ProfileImageSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProfileActionResult } from "./profile";
import { removeProfileImage, uploadProfileImage } from "./actions";

interface ProfileImageSectionProps {
  profile: ProfileActionResult;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onProfileUpdate: (profile: ProfileActionResult) => void;
}

export function ProfileImageSection({
  profile,
  isLoading,
  setIsLoading,
  onProfileUpdate,
}: ProfileImageSectionProps) {
  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background"
  ) {
    try {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append(type, file);

      const result = await uploadProfileImage(formData, type);
      if (!result.success) {
        throw new Error(result.error);
      }

      onProfileUpdate(result);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImageRemove(type: "avatar" | "background") {
    try {
      setIsLoading(true);
      const result = await removeProfileImage(type);
      if (!result.success) {
        throw new Error(result.error);
      }

      onProfileUpdate(result);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove image"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-black shadow-2xl">
      <CardHeader>
        <CardTitle>Profile Images</CardTitle>
        <CardDescription>
          Update your profile picture and background image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24">
            {profile.avatarUrl ? (
              <>
                <Image
                  src={profile.avatarUrl}
                  alt="Profile Avatar"
                  className="rounded-full object-cover"
                  fill
                  priority
                  sizes="(max-width: 96px) 100vw, 96px"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={() => handleImageRemove("avatar")}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-grow space-y-1">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => handleImageUpload(e, "avatar")}
              disabled={isLoading}
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Square image recommended, maximum size 2MB
            </p>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg">
            {profile.backgroundUrl ? (
              <>
                <Image
                  src={profile.backgroundUrl}
                  alt="Profile Background"
                  className="object-cover"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleImageRemove("background")}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => handleImageUpload(e, "background")}
              disabled={isLoading}
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Recommended size 1920x640 pixels, maximum size 5MB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
