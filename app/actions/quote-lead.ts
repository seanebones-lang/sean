"use server";

import { Resend } from "resend";
import { z } from "zod";
import { headers } from "next/headers";
import { siteConfig } from "@/lib/site";

export type QuoteLeadActionState = {
  success: boolean;
  message: string;
};

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  idea: z.string().min(10),
  size: z.string().optional(),
  placement: z.string().optional(),
  styleHint: z.string().optional(),
  referralCode: z.string().optional(),
  website: z.string().optional(),
});

const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function submitQuoteLead(
  _prevState: QuoteLeadActionState,
  formData: FormData
): Promise<QuoteLeadActionState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    idea: formData.get("idea"),
    size: formData.get("size"),
    placement: formData.get("placement"),
    styleHint: formData.get("styleHint"),
    referralCode: formData.get("referralCode"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { success: false, message: "Please share a short description of your idea and your contact info." };
  }

  if (parsed.data.website) {
    return { success: true, message: "Got it — we'll follow up." };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return { success: false, message: "Too many requests. Try again later." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      message: "Lead capture is not configured yet. Add RESEND_API_KEY in your environment.",
    };
  }

  const d = parsed.data;
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Tattoo Site <onboarding@resend.dev>";
  const inbox = process.env.CONTACT_INBOX_EMAIL?.trim() || siteConfig.email;

  const lines = [
    `New quote starter lead`,
    ``,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Size: ${d.size || "—"}`,
    `Placement: ${d.placement || "—"}`,
    `Style interest: ${d.styleHint || "—"}`,
    `Referral: ${d.referralCode || "—"}`,
    ``,
    `Idea:`,
    d.idea,
  ];

  try {
    await resend.emails.send({
      from,
      to: inbox,
      replyTo: d.email,
      subject: `Quote lead from ${d.name}${d.size ? ` (${d.size})` : ""}`,
      text: lines.join("\n"),
    });
  } catch {
    return { success: false, message: "Could not send right now. Please try again shortly." };
  }

  return { success: true, message: "Thanks — Sean will follow up within a couple of days." };
}
