import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "footerBio",
      title: "Footer Bio",
      type: "text",
      rows: 3,
      description:
        "Short bio shown in the site footer (e.g., 'Tattooing professionally since 1999 — Mansfield, TX, by appointment.').",
    }),
    defineField({ name: "bookingUrl", title: "Booking URL", type: "url" }),
    defineField({
      name: "depositPaymentUrl",
      title: "Deposit / payment link",
      type: "url",
      description:
        "Stripe Payment Link, Square checkout, or your scheduler's payment page. Opens in a new tab (not embedded).",
    }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
    defineField({ name: "tiktokUrl", title: "TikTok URL", type: "url" }),
    defineField({
      name: "bookingStatus",
      title: "Booking status",
      type: "string",
      options: {
        list: [
          { title: "Open — accepting new clients", value: "open" },
          { title: "Waitlist — join the waitlist", value: "waitlist" },
          { title: "Closed — not accepting bookings", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "open",
    }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "phoneNumber", title: "Phone Number", type: "string" }),
    defineField({
      name: "studioAddress",
      title: "Studio Address",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "businessHours",
      title: "Business Hours (display text)",
      type: "text",
      rows: 4,
      description: "Freeform display of hours, e.g. 'Tue-Sat 12pm-8pm / By appointment only'.",
    }),
    defineField({
      name: "instagramFeed",
      title: "Instagram Feed (manual)",
      description:
        "Up to 8 recent posts to surface on the site. Add an image, the IG post URL, and an optional caption.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Instagram Post URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", title: "Caption (optional)", type: "string" }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        },
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "heroVideoUrl",
      title: "Hero Video URL (optional)",
      type: "url",
      description: "MP4 URL for the hero background loop. Keep under 2MB; muted autoplay is assumed.",
    }),
    defineField({
      name: "heroVideoPoster",
      title: "Hero Video Poster",
      type: "image",
      options: { hotspot: true },
      description: "Image shown before the video loads, and when autoplay is blocked.",
    }),
  ],
});
