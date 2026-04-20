"use server";

import { Resend } from "resend";
import { z } from "zod";
import { headers } from "next/headers";
import { siteConfig } from "@/lib/site";

export type ContactActionState = {
  success: boolean;
  message: string;
};

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  idea: z.string().min(20),
  website: z.string().optional(),
  placement: z.string().optional(),
  size: z.string().optional(),
  colorPreference: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  firstTattoo: z.string().optional(),
  coverUp: z.string().optional(),
  ageConfirm: z.string(),
});

// Simple in-memory rate limit: max 3 submissions per IP per hour.
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    idea: formData.get("idea"),
    website: formData.get("website"),
    placement: formData.get("placement"),
    size: formData.get("size"),
    colorPreference: formData.get("colorPreference"),
    budget: formData.get("budget"),
    timeline: formData.get("timeline"),
    firstTattoo: formData.get("firstTattoo"),
    coverUp: formData.get("coverUp"),
    ageConfirm: formData.get("ageConfirm") ?? "",
  });

  if (!parsed.success) {
    return { success: false, message: "Please complete all required fields." };
  }

  if (parsed.data.website) {
    return { success: true, message: "Thanks, message received." };
  }

  if (!parsed.data.ageConfirm) {
    return { success: false, message: "You must confirm you are 18 or older." };
  }

  // Rate limiting
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return {
      success: false,
      message: "Too many requests. Please wait a while before sending another message.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      message:
        "Contact service is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL in your environment.",
    };
  }

  const d = parsed.data;

  const lines = [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    ``,
    `Tattoo Concept:`,
    d.idea,
    ``,
    `Placement: ${d.placement || "Not specified"}`,
    `Size: ${d.size || "Not specified"}`,
    `Color preference: ${d.colorPreference || "Not specified"}`,
    `Budget: ${d.budget || "Not specified"}`,
    `Timeline: ${d.timeline || "Not specified"}`,
    ``,
    `First tattoo: ${d.firstTattoo === "yes" ? "Yes" : "No"}`,
    `Cover-up / rework: ${d.coverUp === "yes" ? "Yes" : "No"}`,
  ];

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Tattoo Site <onboarding@resend.dev>";

  const inbox =
    process.env.CONTACT_INBOX_EMAIL?.trim() || siteConfig.email;

  try {
    await resend.emails.send({
      from,
      to: inbox,
      replyTo: d.email,
      subject: `New consultation request from ${d.name}`,
      text: lines.join("\n"),
    });
  } catch {
    return {
      success: false,
      message: "Message failed to send. Please try again shortly.",
    };
  }

  return {
    success: true,
    message: "Message sent. Sean will get back to you soon.",
  };
}
