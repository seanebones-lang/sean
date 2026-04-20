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
      description: "Short bio shown in the site footer (e.g., 'Tattooing since 2004...').",
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
  ],
});
