"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  updatePersonalInfoSchema,
  updateAddressSchema,
  updateBusinessInfoSchema,
  updatePasswordSchema,
  type UpdatePersonalInfoValues,
  type UpdateAddressValues,
  type UpdateBusinessInfoValues,
  type UpdatePasswordValues,
} from "../validation";
import {
  updatePersonalInfo,
  updateAddress,
  updateBusinessInfo,
  updatePassword,
} from "../actions";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AddressSection } from "./AddressSection";
import { BusinessSection } from "./BusinessSection";
import { PasswordSection } from "./PasswordSection";
import { StatusMessage } from "./StatusMessage";
import { UpdateUserFormProps } from "../types";

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    success?: string;
    error?: string;
  }>({});

  const personalForm = useForm<UpdatePersonalInfoValues>({
    resolver: zodResolver(updatePersonalInfoSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      website: user.website || "",
      bio: user.bio || "",
    },
  });

  const addressForm = useForm<UpdateAddressValues>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: {
      streetAddress: user.streetAddress,
      addressLine2: user.addressLine2 || "",
      suburb: user.suburb || "",
      townCity: user.townCity,
      postcode: user.postcode,
      country: user.country,
    },
  });

  const businessForm = useForm<UpdateBusinessInfoValues>({
    resolver: zodResolver(updateBusinessInfoSchema),
    defaultValues: {
      companyName: user.companyName,
      vatNumber: user.vatNumber || "",
      ckNumber: user.ckNumber || "",
      position: user.position || "",
      natureOfBusiness: user.natureOfBusiness,
      currentSupplier: user.currentSupplier,
      otherSupplier: user.otherSupplier || "",
      resellingLocation: user.resellingTo || "",
      salesRep: user.salesRep,
    },
  });

  const passwordForm = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmitPersonal = async (data: UpdatePersonalInfoValues) => {
    const result = await updatePersonalInfo(user.id, data);
    setUpdateStatus(
      result.error
        ? { error: result.error }
        : { success: "Personal information updated successfully" }
    );
  };

  const onSubmitAddress = async (data: UpdateAddressValues) => {
    const result = await updateAddress(user.id, data);
    setUpdateStatus(
      result.error
        ? { error: result.error }
        : { success: "Address information updated successfully" }
    );
  };

  const onSubmitBusiness = async (data: UpdateBusinessInfoValues) => {
    const result = await updateBusinessInfo(user.id, data);
    setUpdateStatus(
      result.error
        ? { error: result.error }
        : { success: "Business information updated successfully" }
    );
  };

  const onSubmitPassword = async (data: UpdatePasswordValues) => {
    const result = await updatePassword(user.id, data);
    if (result.error) {
      setUpdateStatus({ error: result.error });
    } else {
      passwordForm.reset();
      setShowPasswordUpdate(false);
      setUpdateStatus({ success: "Password updated successfully" });
    }
  };

  return (
    <div className="relative space-y-12  mx-auto py-8 bg-background text-foreground">
      <div className="rounded-lg shadow-2xl shadow-black border border-border bg-card p-6">
        <PersonalInfoSection form={personalForm} onSubmit={onSubmitPersonal} />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-2xl shadow-black">
        <AddressSection form={addressForm} onSubmit={onSubmitAddress} />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-2xl shadow-black">
        <BusinessSection form={businessForm} onSubmit={onSubmitBusiness} />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-2xl shadow-black">
        <PasswordSection
          form={passwordForm}
          onSubmit={onSubmitPassword}
          showPasswordUpdate={showPasswordUpdate}
          setShowPasswordUpdate={setShowPasswordUpdate}
        />
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <StatusMessage
          success={updateStatus.success}
          error={updateStatus.error}
        />
      </div>
    </div>
  );
};

export default UpdateUserForm;
