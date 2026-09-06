# PRD — Dr Dukaan (drdukaan.com)

## Original problem statement
Build a production-quality, responsive full-stack web application for Dr Dukaan — "Digital Growth Partner for Local Businesses." Dark-first premium immersive marketing site (3D hero of a storefront connected to digital nodes, 9 services, growth-system differentiator, 8-step journey, industry selector, ecosystem visual, analytics showcase, demo-labelled case studies, quotable pricing, lead form, WhatsApp everywhere, FAQ, blog, legal pages) plus a secure Super Admin CMS (dashboard, leads CRM, clients, full content/settings management, media library, reports, activity logs). Demo data must always be labelled; no Social Media Management service; WhatsApp number centralized in CMS; GA4 configurable.

## User personas
- Non-technical Indian local business owner (gym, clinic, retailer, wholesaler, restaurant...) evaluating a digital growth partner.
- Super Admin (the Dr Dukaan owner) managing leads and all site content without code.

## Architecture
- Frontend: React 19 + Tailwind + Framer Motion + Lenis + React Three Fiber (lazy 3D hero with 2D SVG fallback, reduced-motion aware) + Recharts. Route-based pages, SiteContext bootstrap from CMS.
- Backend: FastAPI + Motor (MongoDB). /api/public/* (bootstrap, blog, leads w/ honeypot+rate limit+dedupe, events, sitemap.xml) and /api/admin/* + /api/auth/* (JWT bearer, bcrypt, brute-force lockout, activity logging, security headers).
- Admin: separate dark SaaS console at /admin/* with generic CRUD framework for 8 collections.

## Core requirements (static)
- Convert visitors to leads: Get Quote + WhatsApp CTAs everywhere; WhatsApp number/messages CMS-driven.
- All public content CMS-editable; demo content labelled DEMO PROJECT / DEMO TESTIMONIAL / DEMO DATA.
- GA4 via admin setting; internal event tracking for CTA/WhatsApp clicks feeding the dashboard.

## Implemented (2026-09-06)
- Full public site: kinetic masked-reveal hero + R3F storefront ecosystem, hero mini-form → prefill lead form, marquee, 9 services (grid + detail pages), growth-system section, scroll timeline, interactive industry selector + industry pages, ecosystem visual, analytics showcase (DEMO DATA), 4 demo case studies (+detail), demo testimonials, 3 pricing plans, lead form (validation, spam protection, success + WhatsApp), 13 FAQs, contact, final CTA, blog (2 seeded posts), about, privacy/terms/cookies, 404.
- Admin: JWT login (seeded admin@drdukaan.com), dashboard with live stats + charts, leads CRM (list/detail/status/notes/WhatsApp/call/activity), clients, CRUD for services/industries/case studies/testimonials/pricing/FAQs/blog, media library (upload→/api/uploads), settings editors (Website Content, WhatsApp, Contact, SEO, Analytics/GA4), reports, activity logs, profile + password change.
- Security: bcrypt, rate limits, honeypot, lockout, secure headers, /api-admin auth guard, env-based secrets.

## Verified
- API: bootstrap, login, me, lead create/patch/delete, settings PUT round-trip, service CRUD, 401 protection, rate-limit 429, honeypot, sitemap, blog.
- UI: hero render + 3D canvas, all 14 homepage sections, industry tab interaction, lead form end-to-end success, admin login → dashboard stats, leads list → detail, mobile menu, mobile overflow fixed (390px clean).

## Backlog (prioritized)
- P0: (none blocking)
- P1: Email notification to admin on new lead (Resend); force-password-change interstitial on first login flag; canonical/OG injection per route.
- P2: Hindi/Telugu content support (CMS is content-driven already); automated monthly PDF/email reports; Google Business Profile link in contact cards.
- P3 (future architecture hooks ready): client portal, invoices, subscription management, Google Ads / Meta Ads API sync, WhatsApp automation.

## Next tasks
1. Resend email notification on lead creation.
2. OG meta tags per page from CMS seo fields.
3. Admin dashboard date-range filters for reports.
