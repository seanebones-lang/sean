export const siteConfig = {
  name: "Cody Meneley",
  description:
    "Premium tattoo craftsmanship by Cody Meneley. Tattooing since 2004, sponsored artist, with a black and grey specialty.",
  email: "codymeneley@gmail.com",
  instagram: "https://www.instagram.com/cwaynetattoo/",
  facebook: "https://www.facebook.com/profile.php?id=100090738856963",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const navItems = [
  { href: "/", key: "home" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/artists", key: "artists" },
  { href: "/about", key: "about" },
  { href: "/booking", key: "booking" },
  { href: "/aftercare", key: "aftercare" },
  { href: "/faq", key: "faq" },
  { href: "/policies", key: "policies" },
  { href: "/testimonials", key: "testimonials" },
  { href: "/contact", key: "contact" },
] as const;
