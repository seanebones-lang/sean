"use server";

import { Resend } from "resend";
import { z } from "zod";
import { headers } from "next/headers";
import { siteConfig } from "@/lib/site";

export type WaitlistActionState = {
  success: boolean;
  message: string;
};

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  note: z.string().optional(),
  artistSlug: z.string().optional(),
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
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function joinWaitlist(
  _prevState: WaitlistActionState,
  formData: FormData
): Promise<WaitlistActionState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    note: formData.get("note"),
    artistSlug: formData.get("artistSlug"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { success: false, message: "Please provide your name and a valid email." };
  }

  if (parsed.data.website) {
    return { success: true, message: "You're on the waitlist." };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return { success: false, message: "Too many requests. Try again later." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      message: "Waitlist service not configured. Set RESEND_API_KEY in environment.",
    };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Tattoo Site <onboarding@resend.dev>";
  const d = parsed.data;

  try {
    await resend.emails.send({
      from,
      to: siteConfig.email,
      replyTo: d.email,
      subject: `Waitlist signup: ${d.name}${d.artistSlug ? ` (${d.artistSlug})` : ""}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nArtist: ${d.artistSlug ?? "(general)"}\n\nNote:\n${d.note ?? "(no note)"}`,
    });
  } catch {
    return { success: false, message: "Could not add to waitlist. Try again shortly." };
  }

  return { success: true, message: "You're on the list. We'll email you when spots open." };
}
