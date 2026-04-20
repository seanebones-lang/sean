import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sean E Bones — Tattoo Artist",
    short_name: "Sean E Bones",
    description: "Tattoos by Sean E Bones — professional tattooing in Mansfield, TX. Book online and share your concept.",
    start_url: "/en",
    display: "standalone",
    background_color: "#050607",
    theme_color: "#050607",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
