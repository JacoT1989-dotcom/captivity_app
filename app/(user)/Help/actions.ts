"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { helpFormSchema, quickContactSchema } from "./validation";
import type { HelpFormResponse } from "./types";

const MAX_SUBMISSIONS = 4;

// Helper function to handle validation errors
function handleValidationError(error: z.ZodError) {
  const errors = error.errors.map(err => ({
    path: err.path.join("."),
    message: err.message,
  }));
  return { error: "Validation failed", validationErrors: errors };
}

// Helper function to check submission count
async function checkSubmissionLimit(email: string) {
  const submissionCount = await prisma.help.count({
    where: { email },
  });

  const remainingSubmissions = MAX_SUBMISSIONS - submissionCount;
  return {
    canSubmit: remainingSubmissions > 0,
    remainingSubmissions,
    submissionCount,
  };
}

// Existing help form action with validation and limits
export async function createHelp(formData: {
  name: string;
  companyName: string;
  email: string;
  assistanceType: string;
  suggestions?: string[];
  helpRequests?: Array<{
    id: number;
    selectedOption: string;
    text: string;
  }>;
  generalInfo?: string[];
}): Promise<HelpFormResponse> {
  try {
    // Validate input data
    const validatedData = await helpFormSchema.parseAsync(formData);

    // Check submission limit
    const { canSubmit, remainingSubmissions } = await checkSubmissionLimit(
      validatedData.email
    );

    if (!canSubmit) {
      return {
        error: `Maximum submission limit reached. You've already submitted ${MAX_SUBMISSIONS} requests.`,
        remainingSubmissions: 0,
        limitReached: true,
      };
    }

    const help = await prisma.help.create({
      data: {
        name: validatedData.name,
        companyName: validatedData.companyName,
        email: validatedData.email,
        assistanceType: validatedData.assistanceType,
        suggestions:
          validatedData.suggestions && validatedData.suggestions.length > 0
            ? validatedData.suggestions
            : { set: null },
        helpRequests:
          validatedData.helpRequests && validatedData.helpRequests.length > 0
            ? validatedData.helpRequests
            : { set: null },
        generalInfo:
          validatedData.generalInfo && validatedData.generalInfo.length > 0
            ? validatedData.generalInfo
            : { set: null },
      },
    });

    revalidatePath("/help");
    return {
      success: true,
      remainingSubmissions: remainingSubmissions - 1,
      message:
        remainingSubmissions > 1
          ? `Request submitted successfully. You have ${remainingSubmissions - 1} submissions remaining.`
          : "Request submitted successfully. This was your last available submission.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    console.error("[HELP_CREATE]", error);
    return {
      error: "Something went wrong while submitting your help request",
    };
  }
}

// Quick contact form action with validation and limits
export async function createQuickContact(formData: {
  name: string;
  lastname: string;
  email: string;
  company: string;
  message: string;
}): Promise<HelpFormResponse> {
  try {
    // Validate input data
    const validatedData = await quickContactSchema.parseAsync(formData);

    // Check submission limit
    const { canSubmit, remainingSubmissions } = await checkSubmissionLimit(
      validatedData.email
    );

    if (!canSubmit) {
      return {
        error: `Maximum submission limit reached. You've already submitted ${MAX_SUBMISSIONS} requests.`,
        remainingSubmissions: 0,
        limitReached: true,
      };
    }

    const help = await prisma.help.create({
      data: {
        name: `${validatedData.name} ${validatedData.lastname}`,
        companyName: validatedData.company,
        email: validatedData.email,
        assistanceType: "General Info",
        generalInfo: [validatedData.message],
        suggestions: { set: null },
        helpRequests: { set: null },
      },
    });

    revalidatePath("/help");
    return {
      success: true,
      remainingSubmissions: remainingSubmissions - 1,
      message:
        remainingSubmissions > 1
          ? `Request submitted successfully. You have ${remainingSubmissions - 1} submissions remaining.`
          : "Request submitted successfully. This was your last available submission.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }
    console.error("[QUICK_CONTACT_CREATE]", error);
    return {
      error: "Something went wrong while submitting your contact request",
    };
  }
}

// Helper action to check remaining submissions
export async function checkRemainingSubmissions(email: string) {
  if (!email) return { error: "Email is required" };

  try {
    const { remainingSubmissions, canSubmit } =
      await checkSubmissionLimit(email);
    return {
      remainingSubmissions,
      canSubmit,
      maxSubmissions: MAX_SUBMISSIONS,
    };
  } catch (error) {
    console.error("[CHECK_SUBMISSIONS]", error);
    return { error: "Failed to check submission limit" };
  }
}
