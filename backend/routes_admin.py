from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from deps import (
    client_ip,
    db,
    get_current_admin,
    hash_password,
    log_activity,
    new_id,
    now_iso,
    rate_limit,
    create_access_token,
    verify_password,
    slugify,
    UPLOAD_DIR,
)
import base64
import os
import re
import uuid

router = APIRouter(prefix="/api", tags=["admin"])

LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"]
ALLOWED_SETTINGS = ["website", "whatsapp", "contact", "seo", "analytics"]
CRUD_COLLECTIONS = {
    "services": ("services", "name"),
    "industries": ("industries", "name"),
    "case-studies": ("case_studies", "title"),
    "testimonials": ("testimonials", "name"),
    "pricing-plans": ("pricing_plans", "name"),
    "faqs": ("faqs", "question"),
    "blog-posts": ("blog_posts", "title"),
    "clients": ("clients", "business_name"),
}


class LoginIn(BaseModel):
    email: str
    password: str


@router.post("/auth/login")
async def login(body: LoginIn, request: Request):
    email = body.email.strip().lower()
    ip = client_ip(request)
    rate_limit(f"login:{ip}", limit=20, window_seconds=3600)
    key = f"{ip}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": key}, {"_id": 0})
    if attempt and attempt.get("count", 0) >= 5:
        locked_until = attempt.get("locked_until", "")
        if locked_until and locked_until > now_iso():
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    admin = await db.admins.find_one({"email": email}, {"_id": 0})
    if not admin or not verify_password(body.password, admin["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": key},
            {
                "$inc": {"count": 1},
                "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()},
            },
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": key})
    token = create_access_token(admin["id"], admin["email"])
    await log_activity(admin["email"], "login", "auth", admin["id"])
    return {"token": token, "admin": {"id": admin["id"], "email": admin["email"], "name": admin.get("name", "Admin")}}


@router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


@router.post("/auth/change-password")
async def change_password(body: ChangePasswordIn, admin=Depends(get_current_admin)):
    doc = await db.admins.find_one({"id": admin["id"]}, {"_id": 0})
    if not doc or not verify_password(body.current_password, doc["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await db.admins.update_one(
        {"id": admin["id"]},
        {"$set": {"password_hash": hash_password(body.new_password), "must_change_password": False, "updated_at": now_iso()}},
    )
    await log_activity(admin["email"], "change_password", "auth", admin["id"])
    return {"ok": True}


class ProfileIn(BaseModel):
    email: str
    name: str = "Admin"


@router.put("/auth/profile")
async def update_profile(body: ProfileIn, admin=Depends(get_current_admin)):
    email = body.email.strip().lower()
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise HTTPException(status_code=422, detail="Invalid email")
    existing = await db.admins.find_one({"email": email, "id": {"$ne": admin["id"]}}, {"_id": 0, "id": 1})
    if existing:
        raise HTTPException(status_code=409, detail="Email already in use")
    await db.admins.update_one({"id": admin["id"]}, {"$set": {"email": email, "name": body.name, "updated_at": now_iso()}})
    await log_activity(email, "update_profile", "auth", admin["id"])
    return {"ok": True, "email": email, "name": body.name}


# ---------- Dashboard ----------


@router.get("/admin/dashboard")
async def dashboard(admin=Depends(get_current_admin)):
    leads = await db.leads.find({}, {"_id": 0}).to_list(5000)
    clients = await db.clients.find({}, {"_id": 0}).to_list(1000)
    events = await db.events.find({}, {"_id": 0}).to_list(10000)
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()

    total = len(leads)
    new_leads = sum(1 for l in leads if l.get("status") == "New")
    monthly = sum(1 for l in leads if l.get("created_at", "") >= month_start)
    won = sum(1 for l in leads if l.get("status") == "Won")
    conversion = round((won / total) * 100, 1) if total else 0
    active_clients = sum(1 for c in clients if c.get("status") in ("Active", "Onboarding"))

    cta_clicks = sum(1 for e in events if e.get("type") in ("cta_click", "quote_click"))
    whatsapp_clicks = sum(1 for e in events if e.get("type") == "whatsapp_click")

    # leads over last 30 days
    daily = {}
    for i in range(29, -1, -1):
        d = (now - timedelta(days=i)).strftime("%d %b")
        daily[d] = 0
    cutoff = (now - timedelta(days=30)).isoformat()
    for l in leads:
        if l.get("created_at", "") >= cutoff:
            try:
                d = datetime.fromisoformat(l["created_at"]).strftime("%d %b")
                if d in daily:
                    daily[d] += 1
            except Exception:
                pass
    leads_over_time = [{"date": k, "leads": v} for k, v in daily.items()]

    status_dist = {}
    for l in leads:
        status_dist[l.get("status", "New")] = status_dist.get(l.get("status", "New"), 0) + 1
    service_interest = {}
    for l in leads:
        for s in l.get("services", []) or []:
            service_interest[s] = service_interest.get(s, 0) + 1
    biz_cats = {}
    for l in leads:
        bt = l.get("business_type") or "Other"
        biz_cats[bt] = biz_cats.get(bt, 0) + 1

    return {
        "stats": {
            "new_leads": new_leads,
            "total_leads": total,
            "active_clients": active_clients,
            "monthly_leads": monthly,
            "conversion_rate": conversion,
            "cta_clicks": cta_clicks,
            "whatsapp_clicks": whatsapp_clicks,
        },
        "leads_over_time": leads_over_time,
        "lead_status": [{"name": k, "value": v} for k, v in status_dist.items()],
        "service_interest": [{"name": k, "value": v} for k, v in sorted(service_interest.items(), key=lambda x: -x[1])[:10]],
        "business_categories": [{"name": k, "value": v} for k, v in sorted(biz_cats.items(), key=lambda x: -x[1])[:10]],
        "recent_leads": sorted(leads, key=lambda x: x.get("created_at", ""), reverse=True)[:8],
    }


# ---------- Generic CRUD ----------


def make_crud(path: str, coll_name: str, label_field: str):
    coll = db[coll_name]
    crud = APIRouter()

    @crud.get("")
    async def list_items(admin=Depends(get_current_admin)):
        items = await coll.find({}, {"_id": 0}).to_list(3000)
        items.sort(key=lambda x: (x.get("order", 999) if isinstance(x.get("order"), (int, float)) else 999, x.get("created_at", "")))
        return items

    @crud.post("", status_code=201)
    async def create_item(payload: dict, admin=Depends(get_current_admin)):
        doc = dict(payload)
        doc["id"] = new_id()
        if "slug" in doc or label_field in ("name", "title"):
            doc["slug"] = doc.get("slug") or slugify(doc.get(label_field, ""))
        doc.setdefault("created_at", now_iso())
        doc["updated_at"] = now_iso()
        await coll.insert_one(doc)
        doc.pop("_id", None)
        await log_activity(admin["email"], "create", coll_name, doc["id"], str(doc.get(label_field, "")))
        return doc

    @crud.get("/{item_id}")
    async def get_item(item_id: str, admin=Depends(get_current_admin)):
        doc = await coll.find_one({"id": item_id}, {"_id": 0})
        if not doc:
            raise HTTPException(status_code=404, detail="Not found")
        return doc

    @crud.put("/{item_id}")
    async def update_item(item_id: str, payload: dict, admin=Depends(get_current_admin)):
        existing = await coll.find_one({"id": item_id}, {"_id": 0, "id": 1})
        if not existing:
            raise HTTPException(status_code=404, detail="Not found")
        data = dict(payload)
        data.pop("id", None)
        data.pop("_id", None)
        data.pop("created_at", None)
        if "slug" in data and not data["slug"] and label_field in data:
            data["slug"] = slugify(data[label_field])
        data["updated_at"] = now_iso()
        await coll.update_one({"id": item_id}, {"$set": data})
        await log_activity(admin["email"], "update", coll_name, item_id, str(data.get(label_field, "")))
        return await coll.find_one({"id": item_id}, {"_id": 0})

    @crud.delete("/{item_id}")
    async def delete_item(item_id: str, admin=Depends(get_current_admin)):
        res = await coll.delete_one({"id": item_id})
        if not res.deleted_count:
            raise HTTPException(status_code=404, detail="Not found")
        await log_activity(admin["email"], "delete", coll_name, item_id)
        return {"ok": True}

    return crud


for path, (coll_name, label_field) in CRUD_COLLECTIONS.items():
    router.include_router(make_crud(path, coll_name, label_field), prefix=f"/admin/{path}")


# ---------- Leads ----------


@router.get("/admin/leads")
async def list_leads(
    q: Optional[str] = None,
    status: Optional[str] = None,
    sort: str = "newest",
    admin=Depends(get_current_admin),
):
    query = {}
    if status and status in LEAD_STATUSES:
        query["status"] = status
    leads = await db.leads.find(query, {"_id": 0}).to_list(5000)
    if q:
        needle = q.lower()
        leads = [
            l
            for l in leads
            if needle in (l.get("name", "") + l.get("business_name", "") + l.get("phone", "") + (l.get("email") or "")).lower()
        ]
    reverse = sort != "oldest"
    leads.sort(key=lambda x: x.get("created_at", ""), reverse=reverse)
    return leads


@router.get("/admin/leads/{lead_id}")
async def get_lead(lead_id: str, admin=Depends(get_current_admin)):
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    activity = await db.activity_logs.find({"entity": "leads", "entity_id": lead_id}, {"_id": 0}).to_list(200)
    activity.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return {"lead": lead, "activity": activity}


class LeadUpdate(BaseModel):
    status: Optional[str] = None
    note: Optional[str] = None
    assigned_to: Optional[str] = None


@router.patch("/admin/leads/{lead_id}")
async def update_lead(lead_id: str, body: LeadUpdate, admin=Depends(get_current_admin)):
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    updates = {"updated_at": now_iso()}
    if body.status:
        if body.status not in LEAD_STATUSES:
            raise HTTPException(status_code=422, detail="Invalid status")
        updates["status"] = body.status
        await log_activity(admin["email"], f"status → {body.status}", "leads", lead_id, lead.get("name", ""))
    if body.note:
        note = {"id": new_id(), "text": body.note, "by": admin["email"], "created_at": now_iso()}
        updates["notes"] = (lead.get("notes") or []) + [note]
        await log_activity(admin["email"], "note_added", "leads", lead_id, lead.get("name", ""))
    if body.assigned_to is not None:
        updates["assigned_to"] = body.assigned_to
    await db.leads.update_one({"id": lead_id}, {"$set": updates})
    return await db.leads.find_one({"id": lead_id}, {"_id": 0})


@router.delete("/admin/leads/{lead_id}")
async def delete_lead(lead_id: str, admin=Depends(get_current_admin)):
    res = await db.leads.delete_one({"id": lead_id})
    if not res.deleted_count:
        raise HTTPException(status_code=404, detail="Lead not found")
    await log_activity(admin["email"], "delete", "leads", lead_id)
    return {"ok": True}


# ---------- Settings ----------


@router.get("/admin/settings/{section}")
async def get_settings(section: str, admin=Depends(get_current_admin)):
    if section not in ALLOWED_SETTINGS:
        raise HTTPException(status_code=404, detail="Unknown settings section")
    doc = await db.settings.find_one({"section": section}, {"_id": 0})
    return doc.get("data", {}) if doc else {}


@router.put("/admin/settings/{section}")
async def put_settings(section: str, payload: dict, admin=Depends(get_current_admin)):
    if section not in ALLOWED_SETTINGS:
        raise HTTPException(status_code=404, detail="Unknown settings section")
    await db.settings.update_one(
        {"section": section},
        {"$set": {"data": payload, "updated_at": now_iso(), "updated_by": admin["email"]}},
        upsert=True,
    )
    await log_activity(admin["email"], "update_settings", "settings", section)
    return payload


# ---------- Media ----------


@router.get("/admin/media")
async def list_media(admin=Depends(get_current_admin)):
    items = await db.media.find({}, {"_id": 0}).to_list(1000)
    items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return items


class MediaIn(BaseModel):
    name: str = Field(max_length=200)
    data: str  # base64 data URL


@router.post("/admin/media", status_code=201)
async def upload_media(body: MediaIn, admin=Depends(get_current_admin)):
    if not body.data.startswith("data:image/"):
        raise HTTPException(status_code=422, detail="Only image uploads are supported")
    header, b64 = body.data.split(",", 1)
    if len(b64) > 7_000_000:
        raise HTTPException(status_code=422, detail="Image too large (max ~5MB)")
    ext = "png"
    m = re.search(r"data:image/(\w+)", header)
    if m and m.group(1) in ("png", "jpeg", "jpg", "webp", "gif", "svg+xml"):
        ext = "jpg" if m.group(1) == "jpeg" else m.group(1).replace("+xml", "")
    raw = base64.b64decode(b64)
    filename = f"{uuid.uuid4().hex}.{ext}"
    with open(UPLOAD_DIR / filename, "wb") as f:
        f.write(raw)
    doc = {
        "id": new_id(),
        "name": body.name,
        "url": f"/api/uploads/{filename}",
        "type": f"image/{ext}",
        "size": len(raw),
        "created_at": now_iso(),
    }
    await db.media.insert_one(doc)
    doc.pop("_id", None)
    await log_activity(admin["email"], "upload", "media", doc["id"], body.name)
    return doc


@router.delete("/admin/media/{media_id}")
async def delete_media(media_id: str, admin=Depends(get_current_admin)):
    doc = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    try:
        os.remove(UPLOAD_DIR / os.path.basename(doc["url"]))
    except OSError:
        pass
    await db.media.delete_one({"id": media_id})
    await log_activity(admin["email"], "delete", "media", media_id, doc.get("name", ""))
    return {"ok": True}


# ---------- Activity logs ----------


@router.get("/admin/activity-logs")
async def activity_logs(admin=Depends(get_current_admin)):
    logs = await db.activity_logs.find({}, {"_id": 0}).to_list(2000)
    logs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return logs[:500]
