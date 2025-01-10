// PasswordSection.tsx
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdatePasswordValues } from "../validation";

interface PasswordSectionProps {
  form: UseFormReturn<UpdatePasswordValues>;
  onSubmit: (data: UpdatePasswordValues) => Promise<void>;
  showPasswordUpdate: boolean;
  setShowPasswordUpdate: (show: boolean) => void;
}

export const PasswordSection = ({
  form,
  onSubmit,
  showPasswordUpdate,
  setShowPasswordUpdate,
}: PasswordSectionProps) => {
  return (
    <div className="bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Password</h2>
        <Button
          variant="outline"
          onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
          className="border-border bg-background hover:bg-accent hover:text-accent-foreground"
        >
          {showPasswordUpdate ? "Cancel" : "Change Password"}
        </Button>
      </div>

      {showPasswordUpdate && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="bg-background border-input"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="bg-background border-input"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="bg-background border-input"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {form.formState.isSubmitting
                ? "Updating Password..."
                : "Update Password"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
