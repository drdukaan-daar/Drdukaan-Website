import re
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field, field_validator

from deps import client_ip, db, get_settings_section, log_activity, new_id, now_iso, rate_limit

router = APIRouter(prefix="/api/public", tags=["public"])

SECTIONS = ["website", "whatsapp", "contact", "seo", "analytics"]


async def _list(coll_name: str, visible_field: str = "visible"):
    items = await db[coll_name].find({}, {"_id": 0}).to_list(2000)
    if visible_field:
        items = [i for i in items if i.get(visible_field, True)]
    items.sort(key=lambda x: (x.get("order", 999), x.get("created_at", "")))
    return items


@router.get("/bootstrap")
async def bootstrap():
    settings = {}
    for s in SECTIONS:
        settings[s] = await get_settings_section(s)
    case_studies = await db.case_studies.find({"published": True}, {"_id": 0}).to_list(200)
    case_studies.sort(key=lambda x: x.get("order", 999))
    testimonials = [t for t in await _list("testimonials", None) if t.get("published", True)]
    return {
        "settings": settings,
        "services": await _list("services"),
        "industries": await _list("industries"),
        "caseStudies": case_studies,
        "pricingPlans": await _list("pricing_plans"),
        "faqs": await _list("faqs"),
        "testimonials": testimonials,
    }


@router.get("/blog")
async def list_blog():
    posts = await db.blog_posts.find({"published": True}, {"_id": 0, "content": 0}).to_list(500)
    posts.sort(key=lambda x: x.get("published_at", ""), reverse=True)
    return posts


@router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


class LeadIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    business_name: str = Field(default="", max_length=160)
    phone: str = Field(min_length=8, max_length=20)
    whatsapp: str = Field(default="", max_length=20)
    email: Optional[EmailStr] = None
    business_type: str = Field(default="", max_length=120)
    current_website: str = Field(default="", max_length=300)
    services: List[str] = Field(default_factory=list)
    budget: str = Field(default="", max_length=60)
    message: str = Field(default="", max_length=2000)
    source: str = Field(default="quote-form", max_length=60)
    website_hp: str = ""  # honeypot

    @field_validator("email", mode="before")
    @classmethod
    def empty_email_to_none(cls, v):
        return None if v in ("", None) else v


@router.post("/leads", status_code=201)
async def create_lead(lead: LeadIn, request: Request):
    if lead.website_hp:  # honeypot filled by bots — pretend success
        return {"ok": True}
    ip = client_ip(request)
    rate_limit(f"lead:{ip}", limit=5, window_seconds=3600)

    digits = re.sub(r"\D", "", lead.phone)
    if len(digits) < 8:
        raise HTTPException(status_code=422, detail="Please enter a valid phone number.")

    day_ago = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    duplicate = await db.leads.find_one({"phone": lead.phone, "created_at": {"$gte": day_ago}}, {"_id": 0, "id": 1})

    doc = lead.model_dump(exclude={"website_hp"})
    doc.update(
        {
            "id": new_id(),
            "status": "New",
            "notes": [],
            "is_duplicate": bool(duplicate),
            "created_at": now_iso(),
            "updated_at": now_iso(),
        }
    )
    await db.leads.insert_one(doc)
    doc.pop("_id", None)
    await log_activity("public", "lead_created", "leads", doc["id"], f"{doc['name']} — {doc.get('business_name') or 'n/a'}")
    if not duplicate:
        from emailer import notify_new_lead

        asyncio.create_task(notify_new_lead(doc))
    return {"ok": True, "id": doc["id"], "duplicate": bool(duplicate)}


ALLOWED_EVENTS = {"cta_click", "whatsapp_click", "quote_click", "page_view", "service_interest"}


@router.post("/events", status_code=201)
async def track_event(request: Request):
    ip = client_ip(request)
    rate_limit(f"event:{ip}", limit=120, window_seconds=3600)
    body = await request.json()
    etype = str(body.get("type", ""))[:40]
    if etype not in ALLOWED_EVENTS:
        raise HTTPException(status_code=422, detail="Unknown event type")
    await db.events.insert_one(
        {
            "id": new_id(),
            "type": etype,
            "label": str(body.get("label", ""))[:160],
            "path": str(body.get("path", ""))[:200],
            "created_at": now_iso(),
        }
    )
    return {"ok": True}


@router.get("/sitemap.xml")
async def sitemap(request: Request):
    base = str(request.base_url).rstrip("/")
    static_paths = ["", "services", "industries", "process", "case-studies", "pricing", "blog", "about", "contact"]
    urls = list(static_paths)
    for slug in [s.get("slug") for s in await db.services.find({"visible": True}, {"_id": 0, "slug": 1}).to_list(100)]:
        urls.append(f"services/{slug}")
    for slug in [i.get("slug") for i in await db.industries.find({"visible": True}, {"_id": 0, "slug": 1}).to_list(100)]:
        urls.append(f"industries/{slug}")
    for slug in [c.get("slug") for c in await db.case_studies.find({"published": True}, {"_id": 0, "slug": 1}).to_list(100)]:
        urls.append(f"case-studies/{slug}")
    for slug in [b.get("slug") for b in await db.blog_posts.find({"published": True}, {"_id": 0, "slug": 1}).to_list(500)]:
        urls.append(f"blog/{slug}")
    xml_urls = "".join(f"<url><loc>{base}/{p}</loc></url>" for p in urls)
    xml = f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{xml_urls}</urlset>'
    from fastapi.responses import Response

    return Response(content=xml, media_type="application/xml")
