// app/forgot-password/page.tsx
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingButton from "@/components/LoadingButton";
import Link from "next/link";
import { initiatePasswordReset } from "../login/actions";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim(),
});

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setError(undefined);
    setSuccess(false);

    startTransition(async () => {
      try {
        const result = await initiatePasswordReset(values);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          form.reset();
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    });
  }

  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground">
          Enter your email address and we will send you a password reset link.
        </p>
      </div>

      {success ? (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              If an account exists with that email address, we have sent a
              password reset link.
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Return to login
            </Link>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      onChange={e => field.onChange(e.target.value.trim())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <LoadingButton
                loading={isPending}
                type="submit"
                className="w-full"
              >
                Send Reset Link
              </LoadingButton>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
