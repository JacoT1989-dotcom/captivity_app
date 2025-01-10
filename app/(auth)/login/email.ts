import nodemailer from "nodemailer";
import { z } from "zod";
import type { Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

// Define error types
interface SmtpError extends Error {
  code?: string;
  responseCode?: number;
  command?: string;
}

// Validate email parameters
const emailParamsSchema = z.object({
  to: z.string().email("Invalid recipient email address"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "Email content is required"),
});

// Validate SMTP configuration
const smtpConfigSchema = z.object({
  host: z.string().min(1, "SMTP host is required"),
  port: z.number().int().positive(),
  secure: z.boolean(),
  user: z.string().min(1, "SMTP user is required"),
  password: z.string().min(1, "SMTP password is required"),
  fromEmail: z.string().email().optional(),
});

interface EmailProps {
  to: string;
  subject: string;
  html: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail?: string;
}

function checkEnvVariables() {
  const requiredVars = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM_EMAIL",
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  console.log("Environment variables check:", {
    SMTP_HOST: process.env.SMTP_HOST || "NOT_SET",
    SMTP_PORT: process.env.SMTP_PORT || "NOT_SET",
    SMTP_USER: process.env.SMTP_USER || "NOT_SET",
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || "NOT_SET",
    SMTP_SECURE: process.env.SMTP_SECURE || "NOT_SET",
    // Don't log the actual password
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ? "SET" : "NOT_SET",
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

function validateSmtpConfig(): SmtpConfig {
  checkEnvVariables();

  try {
    const port = parseInt(process.env.SMTP_PORT || "587");
    const config = smtpConfigSchema.parse({
      host: process.env.SMTP_HOST!,
      port,
      // For port 587, secure should be false. For port 465, secure should be true
      secure: port === 465,
      user: process.env.SMTP_USER!,
      password: process.env.SMTP_PASSWORD!,
      fromEmail: process.env.SMTP_FROM_EMAIL,
    });

    console.log("SMTP Config validation successful:", {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.user,
      fromEmail: config.fromEmail,
    });

    return config;
  } catch (error) {
    console.error("SMTP Config validation failed:", error);
    throw error;
  }
}

function createTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
  console.log("Starting transporter creation...");

  const config = validateSmtpConfig();

  const transporterConfig = {
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.password,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  } as SMTPTransport.Options;

  console.log("Creating transporter with config:", {
    ...transporterConfig,
    auth: { ...transporterConfig.auth, pass: "[REDACTED]" },
  });

  return nodemailer.createTransport(transporterConfig);
}

let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

export async function sendEmail({ to, subject, html }: EmailProps) {
  try {
    console.log("Starting email send process...");

    // Validate email parameters
    const validatedParams = emailParamsSchema.parse({ to, subject, html });

    const config = validateSmtpConfig();
    const fromEmail = config.fromEmail || config.user;

    console.log("Email parameters validated:", {
      to: validatedParams.to,
      from: fromEmail,
      subject: validatedParams.subject,
      timestamp: new Date().toISOString(),
    });

    // Create new transporter for each send
    transporter = createTransporter();

    console.log("Testing SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const info = await transporter.sendMail({
      from: fromEmail,
      to: validatedParams.to,
      subject: validatedParams.subject,
      html: validatedParams.html,
    });

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope,
    });

    return {
      success: true,
      data: {
        messageId: info.messageId,
        envelope: info.envelope,
        response: info.response,
      },
    };
  } catch (error: unknown) {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      recipient: to,
      environment: process.env.NODE_ENV,
      errorName: error instanceof Error ? error.name : "Unknown Error",
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorCode: (error as SmtpError).code,
      responseCode: (error as SmtpError).responseCode,
      command: (error as SmtpError).command,
      stack: error instanceof Error ? error.stack : undefined,
    };

    console.error("Detailed email sending error:", errorDetails);
    throw error;
  } finally {
    if (transporter) {
      transporter.close();
      transporter = null;
    }
  }
}

export async function testSmtpConnection(): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    console.log("Testing SMTP connection...");
    const transporter = createTransporter();
    await transporter.verify();
    return {
      success: true,
      message: "SMTP connection successful",
    };
  } catch (error: unknown) {
    console.error("SMTP connection test failed:", error);
    return {
      success: false,
      message: "SMTP connection failed",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
