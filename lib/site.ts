function normalizeSiteUrl(value: string | undefined): string {
  const raw = (value ?? "").trim();
  if (!raw) return "http://localhost:3000";

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export const siteConfig = {
  name: "Sean E Bones",
  description:
    "Sean E. Bones — award-winning tattoo artist with 25+ years of experience since 1999, trained under Troy \"Rabbit\" Fox. Internationally published, award winning art. Private studio in Mansfield, Texas — by appointment only.",
  email: "seanebones@gmail.com",
  instagram: "https://www.instagram.com/sean_e_bones_official/",
  facebook: "https://www.facebook.com/profile.php?id=100090242529349",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  giftCardUrl: process.env.NEXT_PUBLIC_GIFT_CARD_URL ?? "",
  reviews: {
    google: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? "",
    yelp: process.env.NEXT_PUBLIC_YELP_URL ?? "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_REVIEW_URL ?? "",
  },
  address: {
    locality: "Mansfield",
    region: "TX",
    country: "US",
    lat: 32.5632,
    lng: -97.1417,
  },
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
};

export const navItems = [
  { href: "/", key: "home" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/artists", key: "artists" },
  { href: "/about", key: "about" },
  { href: "/booking", key: "booking" },
  { href: "/aftercare", key: "aftercare" },
  { href: "/journal", key: "journal" },
  { href: "/faq", key: "faq" },
  { href: "/policies", key: "policies" },
  { href: "/testimonials", key: "testimonials" },
  { href: "/contact", key: "contact" },
] as const;
