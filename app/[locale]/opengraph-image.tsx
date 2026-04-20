import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = "Sean E Bones — Tattoos by Sean E Bones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OgImage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const metaT = await getTranslations({ locale, namespace: "metadata" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(ellipse at top right, rgba(33,199,255,0.25) 0%, rgba(5,6,7,1) 60%), #050607",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#f4f5f6",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#21c7ff",
              fontWeight: 700,
            }}
          >
            {t("eyebrow")}
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#f4f5f6",
              marginTop: 12,
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1,
            color: "#f4f5f6",
            maxWidth: 1000,
          }}
        >
          {metaT("description")}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            fontSize: 22,
            color: "#b0b6c2",
          }}
        >
          <div>Mansfield, TX • Since 1999 • Internationally published, award winning art</div>
          <div style={{ color: "#21c7ff", fontWeight: 700 }}>Book a consultation →</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
