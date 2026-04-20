import { defineField, defineType } from "sanity";

export const artistType = defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverImage",
      title: "Cover / Banner Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "bio", title: "Bio", type: "text" }),
    defineField({
      name: "yearsExperience",
      title: "Years of Experience",
      type: "number",
    }),
    defineField({
      name: "specialties",
      title: "Specialties",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "availabilityStatus",
      title: "Availability Status",
      type: "string",
      options: {
        list: [
          { title: "Booking Open", value: "open" },
          { title: "Waitlist Only", value: "waitlist" },
          { title: "Not Accepting New Clients", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "open",
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        defineField({ name: "hourlyRate", title: "Hourly Rate (USD)", type: "number" }),
        defineField({ name: "minimumCharge", title: "Minimum Charge (USD)", type: "number" }),
        defineField({ name: "depositAmount", title: "Deposit Amount (USD)", type: "number" }),
        defineField({
          name: "priceRange",
          title: "Price Range Label (e.g. $150–$250/hr)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "studioInfo",
      title: "Studio Info",
      type: "object",
      fields: [
        defineField({ name: "studioName", title: "Studio Name", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "stateRegion", title: "State / Region", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
        defineField({ name: "address", title: "Full Address", type: "string" }),
        defineField({ name: "googleMapsUrl", title: "Google Maps URL", type: "url" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok URL", type: "url" }),
        defineField({ name: "email", title: "Contact Email", type: "string" }),
        defineField({ name: "bookingUrl", title: "Booking URL (overrides site default)", type: "url" }),
      ],
    }),
    defineField({ name: "isSponsored", title: "Sponsored Artist", type: "boolean", initialValue: false }),
    defineField({
      name: "certifications",
      title: "Certifications & Awards",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "languages",
      title: "Languages Spoken",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "consultationRequired",
      title: "Consultation Required Before Booking",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "acceptedPayments",
      title: "Accepted Payment Methods",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featuredPieces",
      title: "Featured Portfolio Pieces",
      type: "array",
      of: [{ type: "reference", to: [{ type: "portfolioPiece" }] }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "availabilityStatus",
      media: "profileImage",
      sponsored: "isSponsored",
    },
    prepare({ title, subtitle, media, sponsored }) {
      const statusMap: Record<string, string> = {
        open: "Booking open",
        waitlist: "Waitlist",
        closed: "Closed",
      };
      return {
        title: sponsored ? `★ ${title}` : title,
        subtitle: statusMap[subtitle as string] ?? subtitle,
        media,
      };
    },
  },
});
