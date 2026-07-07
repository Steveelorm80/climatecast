# ClimateCast → SaaS: Phased Roadmap

**Positioning:** Weather risk intelligence for event planners and outdoor businesses — not a generic weather dashboard. The event risk score is the product.

---

## Phase 0 — Security & Cleanup (1 day)

Goal: safe, lean codebase before building on it.

- Rotate the OpenWeather API key (old one is in git history in `application.properties`).
- Delete empty `backend/api-gateway` and `backend/prediction-service` folders.
- Remove `target/` build artifacts from git; add to `.gitignore`.
- Move all secrets to environment variables only (Render/Vercel dashboards).

**Done when:** no secrets in repo, no dead folders, fresh API key live.

---

## Phase 1 — Consolidate & Persist (1–2 weeks)

Goal: one reliable backend with real data storage.

- Merge weather-service and event-service into a single Spring Boot app (one Render service = one cold start instead of two chained ones).
- Add Postgres (Neon or Supabase free tier) with Spring Data JPA: `events` table to start, schema ready for `users`.
- Re-enable Redis caching via Upstash (cache weather by city+hour, ~10 min TTL) to cut OpenWeather API calls.
- Add basic error handling and request validation.

**Done when:** events survive restarts, repeat city lookups hit cache, single backend URL.

---

## Phase 2 — Auth & Accounts (1–2 weeks)

Goal: every event and preference belongs to a user.

- Clerk (recommended: fastest with Next.js) for signup/login on the frontend.
- JWT validation in Spring Boot; all `/events` endpoints scoped to the authenticated user.
- User profile: saved cities, default location, unit preferences.
- Protect the dashboard route; add a public landing page at `/`.

**Done when:** two users see only their own events; dashboard requires login.

---

## Phase 3 — Billing & Tiers (1 week)

Goal: ability to take money.

- Stripe Checkout + customer portal + webhooks (subscription created/cancelled → update user plan in Postgres).
- Enforce limits server-side:

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 1 saved city, 3 active events |
| Pro | ~$9/mo | Unlimited events, alerts, calendar sync |
| Business | ~$49/mo | API access, team seats (later) |

- Pricing page + upgrade prompts when free limits are hit.

**Done when:** a test user can upgrade, get Pro limits, cancel, and revert to Free.

---

## Phase 4 — Alerts (2 weeks) ← the killer feature

Goal: recurring value that justifies the subscription.

- Spring `@Scheduled` job: re-score all upcoming events every few hours.
- On risk change past a threshold → email via Resend (SMS via Twilio later).
- Alert preferences per event (threshold, channels, quiet hours).
- Notification history in the dashboard.

**Done when:** a Pro user gets an email when their event's risk score changes materially.

---

## Phase 5 — Growth Features (ongoing)

In rough priority order:

1. **Landing page repositioning** — copy, screenshots, and SEO around "event weather risk," not "weather dashboard."
2. **Google Calendar sync** — import events, auto-assess risk on all of them (Pro).
3. **Multi-city comparison** — "best location for your event" view.
4. **Public API** — sell the risk-score endpoint with API keys + rate limiting (Business tier).
5. **Improved risk model** — blend multiple weather providers; add historical climate data for far-future dates.

---

## Sequencing summary

```
Phase 0 (day 1)
  → Phase 1 (foundation)
    → Phase 2 (auth)
      → Phase 3 (billing)   ← can overlap with Phase 4
      → Phase 4 (alerts)
        → Phase 5 (growth, ongoing)
```

Launchable beta = end of Phase 2 (free, invite-only).
Chargeable product = end of Phase 4.

## Cost at launch (est.)

Vercel free + Render starter (~$7/mo, avoids cold starts) + Neon free + Upstash free + Clerk free (<10k users) + Stripe (per-transaction) ≈ **$7–15/mo** until real traction.
