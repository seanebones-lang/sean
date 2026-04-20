import { defineField, defineType } from "sanity";

export const portfolioPieceType = defineType({
  name: "portfolioPiece",
  title: "Portfolio Piece",
  type: "document",
  orderings: [
    {
      title: "Featured first",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "_updatedAt", direction: "desc" },
      ],
    },
    { title: "Newest", name: "newest", by: [{ field: "_createdAt", direction: "desc" }] },
    { title: "Title A–Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
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
      description: "e.g. 'Black & Grey', 'Fine Line', 'Realism'",
    }),
    defineField({
      name: "placement",
      title: "Body Placement",
      type: "string",
      options: {
        list: [
          "Arm / Sleeve", "Forearm", "Upper arm", "Hand / Fingers",
          "Chest", "Back", "Ribcage / Side", "Leg / Thigh",
          "Calf / Shin", "Foot / Ankle", "Neck", "Head / Face", "Other",
        ],
      },
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
  preview: {
    select: {
      title: "title",
      artist: "artist.name",
      media: "images.0",
      featured: "featured",
    },
    prepare({ title, artist, media, featured }) {
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: artist ?? "No artist assigned",
        media,
      };
    },
  },
});
