# Dr Dukaan — Digital Growth Partner for Local Businesses

Full-stack platform: immersive public marketing site (React + React Three Fiber) + FastAPI admin CMS + MongoDB.

## 1. Project structure

```
/app
├── backend/
│   ├── server.py          # FastAPI app, startup seeding, security headers, static uploads
│   ├── deps.py            # DB client, JWT, bcrypt, rate limiting, activity logging
│   ├── routes_public.py   # Public API: bootstrap, blog, lead capture, events, sitemap
│   ├── routes_admin.py    # Auth + admin CRUD: leads, clients, all CMS collections, settings, media, logs
│   ├── seed_data.py       # All seeded services/industries/case studies/pricing/FAQs/settings
│   ├── uploads/           # Media library files (served at /api/uploads)
│   └── .env / .env.example
├── frontend/
│   └── src/
│       ├── context/       # SiteContext (bootstrap content + WhatsApp links + GA4), AuthContext
│       ├── components/public/   # Navbar, Footer, Hero (3D), sections 1-3, kit, WhatsAppFloat
│       ├── components/three/    # HeroScene (R3F storefront ecosystem + 2D fallback)
│       ├── components/admin/    # AdminLayout (sidebar), CrudPage (generic CMS editor)
│       └── pages/         # public: Home, Services, Industries, Process, CaseStudies, Pricing,
│                          # Blog, About, Contact, Legal, NotFound — admin: Login, Dashboard,
│                          # Leads, CrudPages, Settings, Media, Reports, ActivityLogs
```

## 2. Technologies
React 19, Tailwind CSS, Framer Motion, Lenis (smooth scroll), Three.js / React Three Fiber + drei, Recharts, Sonner — FastAPI, Motor (async MongoDB), bcrypt, PyJWT.

## 3. Database schema (MongoDB collections)
admins, leads (notes[], status pipeline), clients, services, industries, case_studies (isDemoProject), testimonials (isDemo), pricing_plans, faqs, blog_posts, settings (sections: website/whatsapp/contact/seo/analytics), media, events (CTA/WhatsApp clicks), activity_logs, login_attempts. Indexes on slugs, lead status/phone/created_at, admin email (unique).

## 4. Environment variables
See backend/.env.example. Frontend uses REACT_APP_BACKEND_URL (already set). GA4 is configured from Admin → Analytics (or REACT_APP_GA4_ID fallback).

## 5. Local setup
```
cd backend && pip install -r requirements.txt && uvicorn server:app --host 0.0.0.0 --port 8001
cd frontend && yarn install && yarn start
```
Seeding (admin + all CMS content) runs automatically on first backend start.

## 6. Admin setup
Login at /admin/login with admin@drdukaan.com / admin1234 (development seed). Immediately change it in Admin → Site Settings → Change Password. Production credentials come from ADMIN_EMAIL / ADMIN_PASSWORD env vars.

## 7. Production deployment
Deploy the FastAPI backend (any container host) with env vars from .env.example, and the React frontend (static build via `yarn build`) to any static host or the same ingress. Set CORS_ORIGINS to the production domain. Terminate HTTPS at the host/CDN (automatic on Emergent/Vercel-class platforms).

## 8. Connect drdukaan.com
Point the domain's A/CNAME records at the hosting platform, enable HTTPS, then update CORS_ORIGINS and the sitemap base URL. robots.txt already references /api/public/sitemap.xml.

## 9. Configure GA4
Google Analytics → Admin → Data Streams → copy Measurement ID (G-XXXX) → Admin → Analytics → paste → Save. CTA clicks, WhatsApp clicks and lead submissions are tracked automatically.

## 10. Change WhatsApp number
Admin → WhatsApp → update Number (digits only, with country code) and messages → Save. Every WhatsApp button on the site updates instantly. The number is never hardcoded.

## 11. Edit website content
Admin → Website Content (hero, headlines, CTAs, footer), Services / Industries / Case Studies / Testimonials / Pricing / FAQs / Blog each have full CRUD editors. Changes are live immediately.

## 12. Manage leads
Admin → Leads: search, filter by status, sort, open detail (notes, activity history), change status (New → Won/Lost), WhatsApp/call shortcuts. Reports shows lead velocity, pipeline funnel, service interest and business categories.

## 13. Replace demo data with real clients
Case studies: edit each one, set "Demo Project" off and replace content with real results. Testimonials: create real ones with "Demo Testimonial" off and unpublish/delete the three seeded demos. All demo items are publicly labelled DEMO PROJECT / DEMO TESTIMONIAL / DEMO DATA until you switch them.

## Notes & compliance
- No Social Media Management service is listed anywhere.
- No guaranteed-results claims; all fictional proof is labelled.
- Public API: rate-limited lead capture (5/hour/IP) with honeypot + duplicate detection; admin routes require JWT.
- Future-ready: client portal, invoices, Google/Meta Ads APIs, automated reports — schema and settings sections are designed to extend.
