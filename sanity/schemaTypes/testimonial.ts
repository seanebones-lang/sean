import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Display Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: "clientLocation",
      title: "Client Location (e.g. Portland, OR)",
      type: "string",
    }),
    defineField({
      name: "reviewDate",
      title: "Review Date",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: "verified",
      title: "Verified Client",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "reference",
      to: [{ type: "artist" }],
    }),
    defineField({
      name: "relatedPiece",
      title: "Related Portfolio Piece",
      type: "reference",
      to: [{ type: "portfolioPiece" }],
    }),
    defineField({
      name: "source",
      title: "Source (e.g. Google, Yelp, In-Person)",
      type: "string",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "quote" },
  },
});
