# Marketing notes

Operational checklist for the Sean E Bones site. Everything here is non-code
work — add-in content, profile setup, and link tagging.

## UTM tagging for outbound links

Every external link pointing back at the site should carry UTM parameters so
that Vercel Analytics can segment sources. Use lower-case, underscore-separated
values.

### Instagram bio link

```
https://seanebones.com/?utm_source=instagram&utm_medium=bio&utm_campaign=link_in_bio
```

### Instagram story / post swipe-up

```
https://seanebones.com/booking?utm_source=instagram&utm_medium=story&utm_campaign=book_now
https://seanebones.com/portfolio?utm_source=instagram&utm_medium=post&utm_campaign=portfolio_push
```

### Google Business Profile

```
https://seanebones.com/?utm_source=google&utm_medium=gbp&utm_campaign=profile
https://seanebones.com/booking?utm_source=google&utm_medium=gbp&utm_campaign=booking_cta
```

### Yelp / Facebook / TikTok

Swap `utm_source` to `yelp`, `facebook`, or `tiktok` — keep `utm_medium` at
`profile` / `bio` / `post` as appropriate. Never reuse the same UTM combination
for two different surfaces; differences are what make the data useful.

### Email signature

```
https://seanebones.com/?utm_source=email&utm_medium=signature&utm_campaign=staff
```

### Print material (shop card, referral card)

```
https://seanebones.com/?utm_source=print&utm_medium=shop_card&utm_campaign=studio
https://seanebones.com/booking?utm_source=print&utm_medium=referral_card&utm_campaign=refer_a_friend
```

## Analytics events surfaced in Vercel Analytics

Custom `track()` calls already emit from the client. When reviewing, filter on
these event names:

- `booking_iframe_opened` — visitor scrolled booking iframe into view.
- `deposit_clicked` — outbound deposit link on `/booking`.
- `quote_lead_submitted` — pre-qualifier form submit.
- `contact_form_submitted` — full contact form submit.
- `newsletter_signup` — footer form.
- `gift_card_clicked` — outbound gift-card checkout link.
- `instagram_clicked` — any Instagram tile / bio link (event name
  `instagram_clicked`; `surface` prop distinguishes home / artist / footer).
- `review_bridge_clicked` — Google / Yelp / Facebook buttons (`platform` prop).
- `sticky_piece_cta_clicked` — scroll CTA on portfolio detail.
- `portfolio_filter_used` — style tag filter (`style` prop).

## Suggested FAQ expansions (content-only)

Added through Sanity `faqItem` — no code change required. Each one maps to a
featured-snippet query and should be written for voice-search friendliness
(one-sentence answer up top, detail below).

1. **Can you tattoo over a scar?** Yes, once the scar is at least one year old
   and fully settled. Darker and bolder designs work best over raised or
   discolored tissue.
2. **What's the minimum age for a tattoo in Texas?** 18 years old with valid
   government-issued ID. Texas does not allow parental consent for minors.
3. **Do you touch up tattoos done elsewhere?** Case-by-case. Send photos of
   the piece and we'll give an honest answer before booking.
4. **How long does a sleeve tattoo take?** Typically 3–6 full-day sessions
   spaced 4–6 weeks apart, depending on detail and color.
5. **Do you do walk-ins?** No. Every session is consultation-first so the
   design is built for you.
6. **Can I bring a friend to the session?** One support person is welcome.
   The studio stays calm and focused, so please leave larger groups behind.
7. **What's the deposit policy?** A non-refundable deposit books your slot
   and comes off the final session price. Rescheduling with 72-hour notice
   keeps the deposit active.
8. **Do you tattoo hands, necks, or faces?** Yes for established clients with
   existing visible work or a clear reason. First-timers should start
   elsewhere on the body.
9. **What should I eat before a session?** A full meal 60–90 minutes before.
   No alcohol the night before. Bring water and snacks for longer sessions.
10. **How should I care for a new tattoo?** See the aftercare page. Short
    version: clean 2–3× daily, thin lotion layer, no soaking or direct sun
    for two weeks.
11. **Do you travel for guest spots?** Occasionally. Follow the Instagram to
    hear first; guest dates sell out in hours.
12. **Can you recreate another artist's work?** No. Every piece is designed
    from scratch. Reference images are welcome as direction, not blueprints.
13. **Do you offer payment plans?** Long projects can be split across
    sessions. Within a single session, full payment is due at the end.
14. **How far in advance should I book?** 4–8 weeks for small pieces, 2–3
    months for large custom work.
15. **What styles don't you offer?** Script-only tattoos, portraits of
    people not known to the client, and any design that conflicts with the
    studio's values.

## Ongoing cadence

- Post to Instagram 3–5× per week; mirror the best 6 into the Sanity
  `instagramFeed` field (used by the home-page strip).
- Add one new `journal` post per month targeting long-tail queries; link each
  post to a relevant portfolio piece.
- Review `aggregateRating` and testimonial freshness quarterly.
- Refresh `heroVideoUrl` in Site Settings seasonally.
