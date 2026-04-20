import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Sanity webhook endpoint.
 *
 * Configure in Sanity Studio → API → Webhooks:
 *   URL:    https://<your-site>/api/revalidate
 *   Secret: set the same value as SANITY_REVALIDATE_SECRET env var
 *   Filter: _type in ["portfolioPiece","artist","testimonial","siteSettings","faqItem","aftercarePage","sponsorPartner"]
 *   Method: POST
 *
 * Payload example:
 *   { "_type": "portfolioPiece", "slug": { "current": "..." } }
 */
export async function POST(req: NextRequest) {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, error: "SANITY_REVALIDATE_SECRET is not set" },
      { status: 500 }
    );
  }

  const providedSecret =
    req.headers.get("sanity-webhook-signature") ??
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-sanity-secret");

  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } | string } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is OK — we'll just revalidate everything
  }

  const type = body?._type;
  const slug = typeof body?.slug === "string" ? body.slug : body?.slug?.current;

  const revalidated: string[] = [];

  try {
    if (type === "portfolioPiece") {
      for (const locale of ["en", "es"]) {
        revalidatePath(`/${locale}/portfolio`);
        revalidated.push(`/${locale}/portfolio`);
        if (slug) {
          revalidatePath(`/${locale}/portfolio/${slug}`);
          revalidated.push(`/${locale}/portfolio/${slug}`);
        }
        revalidatePath(`/${locale}`);
        revalidated.push(`/${locale}`);
      }
    } else if (type === "artist") {
      for (const locale of ["en", "es"]) {
        revalidatePath(`/${locale}/artists`);
        revalidated.push(`/${locale}/artists`);
        if (slug) {
          revalidatePath(`/${locale}/artists/${slug}`);
          revalidated.push(`/${locale}/artists/${slug}`);
        }
      }
    } else if (type === "testimonial") {
      for (const locale of ["en", "es"]) {
        revalidatePath(`/${locale}/testimonials`);
        revalidatePath(`/${locale}`);
        revalidated.push(`/${locale}/testimonials`, `/${locale}`);
      }
    } else if (type === "siteSettings") {
      revalidatePath("/", "layout");
      revalidated.push("/ (layout)");
    } else if (type === "faqItem") {
      for (const locale of ["en", "es"]) {
        revalidatePath(`/${locale}/faq`);
        revalidated.push(`/${locale}/faq`);
      }
    } else if (type === "aftercarePage") {
      for (const locale of ["en", "es"]) {
        revalidatePath(`/${locale}/aftercare`);
        revalidated.push(`/${locale}/aftercare`);
      }
    } else if (type === "sponsorPartner") {
      for (const locale of ["en", "es"]) {
        revalidatePath(`/${locale}`);
        revalidated.push(`/${locale}`);
      }
    } else {
      // Fallback: revalidate sitemap + layout
      revalidatePath("/", "layout");
      revalidated.push("/ (layout)");
    }

    return NextResponse.json({ ok: true, type, slug, revalidated });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Sanity revalidate endpoint. Send a POST with _type (+ optional slug).",
  });
}
