"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import { resetPassword, validateResetToken } from "../login/actions";
import { FormValues, resetPasswordSchema } from "./validation";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string>();
  const [isValidating, setIsValidating] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setError("Invalid password reset link");
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateResetToken(token);
        if (!result.valid) {
          setError(result.error || "Invalid or expired reset token");
        }
      } catch (err) {
        setError("Failed to validate reset token");
      } finally {
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token]);

  // Early return if no token or during validation
  if (!token || isValidating) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error || "Validating reset token..."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    if (!token) return; // Type guard for TypeScript

    setError(undefined);
    startTransition(async () => {
      try {
        const result = await resetPassword({
          token: token,
          newPassword: values.newPassword,
        });

        if (result.error) {
          setError(result.error);
        } else if (result.success && result.redirectTo) {
          router.push(result.redirectTo);
        }
      } catch (err) {
        setError("Failed to reset password");
      }
    });
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">Enter your new password below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton type="submit" loading={isPending} className="w-full">
            Reset Password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
