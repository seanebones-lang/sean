# Sean E Bones — Tattoo Site

Multilingual web presence for **Sean E Bones** (*Tattoos by Sean E Bones*), built with Next.js 16 App Router.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- `next-intl` locale routing (`/en`, `/es`)
- Motion + React Three Fiber hero experience
- Sanity schema/client scaffolding
- Resend-backed contact form server action

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill required values:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BOOKING_URL` (PrimeCraft / scheduler embed URL)
- `NEXT_PUBLIC_DEPOSIT_URL` (optional — Stripe Payment Link, Square, etc.)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (default in `.env.example`: `7sodez5h`)
- `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_TOKEN`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (verified sender in Resend; typically `seanebones@gmail.com`)
- `CONTACT_INBOX_EMAIL` (where form submissions are delivered; typically `nextelevenstudios@gmail.com`)

Public contact shown on the site comes from [`lib/site.ts`](lib/site.ts) (`seanebones@gmail.com`) unless overridden in Sanity **Site Settings → Contact Email**. Leave that Sanity field empty or set it to the same address if you do not want the studio inbox shown publicly.

For Sanity Studio, copy [`sanity/.env.example`](sanity/.env.example) to `sanity/.env`.

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run studio` — run Sanity Studio (`sanity/.env` with `SANITY_STUDIO_*` vars)

## Booking and deposits

The **Booking** page can show:

1. **Schedule** — an embedded iframe when `bookingUrl` is set (Sanity **Site Settings** overrides `NEXT_PUBLIC_BOOKING_URL`).
2. **Deposit** — a “Pay deposit” button when `depositPaymentUrl` is set (Sanity **Site Settings** overrides `NEXT_PUBLIC_DEPOSIT_URL`). Checkout opens in a **new tab**.

If the scheduler blocks iframes, use **Open booking in a new tab** on the booking page.

After changing Sanity fields, the page refreshes within about a minute (ISR). After changing env vars on Vercel, **redeploy**.

## Notes

- Booking / deposit URLs are merged from **Sanity Site Settings** first, then env fallbacks.
- Contact form sends from `RESEND_FROM_EMAIL` to `CONTACT_INBOX_EMAIL` (fallback: public email in `lib/site.ts`).
