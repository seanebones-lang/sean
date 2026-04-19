import { defineField, defineType } from "sanity";

export const portfolioPieceType = defineType({
  name: "portfolioPiece",
  title: "Portfolio Piece",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "artist", title: "Artist", type: "reference", to: [{ type: "artist" }] }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({
      name: "styleTags",
      title: "Style Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "healedImage",
      title: "Healed Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional healed / settled photo for before-after comparison.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
