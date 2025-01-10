// components/vendor/account/VendorAccountManager.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileActionResult } from "./profile";
import { ProfileImageSection } from "./ProfileImageSection";
import { ProfileInformationForm } from "./ProfileInformationForm";

interface VendorAccountManagerProps {
  initialProfile: ProfileActionResult;
  vendorSlug: string;
}

export function VendorAccountManager({
  initialProfile,
  vendorSlug,
}: VendorAccountManagerProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = (updatedProfile: ProfileActionResult) => {
    setProfile(updatedProfile);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
          <CardDescription>
            Manage your profile, business information, and account preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ProfileImageSection
            profile={profile}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onProfileUpdate={handleProfileUpdate}
          />
          <ProfileInformationForm
            profile={profile}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onProfileUpdate={handleProfileUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
