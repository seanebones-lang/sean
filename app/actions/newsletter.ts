"use server";

import { Resend } from "resend";
import { z } from "zod";
import { headers } from "next/headers";
import { siteConfig } from "@/lib/site";

export type NewsletterActionState = {
  success: boolean;
  message: string;
};

const schema = z.object({
  email: z.string().email(),
  website: z.string().optional(),
});

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (rateMap.size > 5000) {
    for (const [key, val] of rateMap) {
      if (now > val.resetAt) rateMap.delete(key);
    }
  }
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

export async function joinNewsletter(
  _prevState: NewsletterActionState,
  formData: FormData
): Promise<NewsletterActionState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    website: formData.get("website"),
  });
  if (!parsed.success) {
    return { success: false, message: "Enter a valid email to subscribe." };
  }
  if (parsed.data.website) {
    return { success: true, message: "You're in." };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(ip)) {
    return { success: false, message: "Too many requests. Try again shortly." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      message: "Newsletter is not configured yet. Add RESEND_API_KEY in your environment.",
    };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Tattoo Site <onboarding@resend.dev>";
  const inbox = process.env.NEWSLETTER_INBOX_EMAIL?.trim() || siteConfig.email;

  try {
    await resend.emails.send({
      from,
      to: inbox,
      replyTo: parsed.data.email,
      subject: `Newsletter signup: ${parsed.data.email}`,
      text: `New newsletter signup: ${parsed.data.email}`,
    });
  } catch {
    return { success: false, message: "Could not subscribe right now. Try again shortly." };
  }

  return { success: true, message: "You're subscribed — flash drops land in your inbox." };
}
