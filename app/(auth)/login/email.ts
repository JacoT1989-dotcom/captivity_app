import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

// Define the EmailProps interface
interface EmailProps {
  to: string;
  subject: string;
  html: string;
}

// Create a singleton transporter instance
let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

function getTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
  if (transporter) return transporter;

  const transporterConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100,
    // Add timeouts
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 10000, // 10 seconds
    tls: {
      minVersion: "TLSv1.2",
    },
  } as SMTPTransport.Options;

  transporter = nodemailer.createTransport(transporterConfig);
  return transporter;
}

export async function sendEmail({ to, subject, html }: EmailProps) {
  try {
    const transport = getTransporter();
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    const info = await transport.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
      priority: "high", // Set email priority to high
    });

    return {
      success: true,
      data: {
        messageId: info.messageId,
        envelope: info.envelope,
        response: info.response,
      },
    };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}
