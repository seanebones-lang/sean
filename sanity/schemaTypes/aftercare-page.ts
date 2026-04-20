import { defineField, defineType } from "sanity";

export const aftercarePageType = defineType({
  name: "aftercarePage",
  title: "Aftercare Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Page Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 3 }),
    defineField({
      name: "steps",
      title: "Aftercare Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Step heading", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "Step detail", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "heading", subtitle: "body" } },
        },
      ],
    }),
    defineField({
      name: "warningNote",
      title: "Warning / Important Note",
      type: "text",
      rows: 3,
      description: "Shown as a highlighted callout (e.g. 'Contact us immediately if you notice signs of infection').",
    }),
    defineField({
      name: "productRecommendations",
      title: "Recommended Products",
      type: "text",
      rows: 3,
      description: "Plain text list of recommended aftercare products.",
    }),
    defineField({ name: "content", title: "Additional content (rich text)", type: "array", of: [{ type: "block" }] }),
  ],
});
