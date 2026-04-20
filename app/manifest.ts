import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cody Meneley — Tattoo Artist",
    short_name: "Cody Meneley",
    description: "Premium tattoo craftsmanship. Tattooing since 2004, sponsored artist, black and grey specialist.",
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
