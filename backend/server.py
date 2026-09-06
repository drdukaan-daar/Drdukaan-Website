import os
import logging
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

from deps import db, hash_password, new_id, now_iso, client, UPLOAD_DIR
from routes_public import router as public_router
from routes_admin import router as admin_router
import seed_data

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("drdukaan")

app = FastAPI(title="Dr Dukaan API")
app.include_router(public_router)
app.include_router(admin_router)

app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def secure_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.get("/api")
async def root():
    return {"message": "Dr Dukaan API", "status": "ok"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}


async def seed_collection(name: str, items: list):
    count = await db[name].count_documents({})
    if count:
        return
    docs = []
    for item in items:
        doc = dict(item)
        doc["id"] = new_id()
        doc.setdefault("created_at", now_iso())
        doc.setdefault("updated_at", now_iso())
        if name in ("services", "industries", "faqs"):
            doc.setdefault("visible", True)
        docs.append(doc)
    if docs:
        await db[name].insert_many(docs)
        logger.info("Seeded %s (%d docs)", name, len(docs))


@app.on_event("startup")
async def startup():
    await db.admins.create_index("email", unique=True)
    await db.leads.create_index([("created_at", -1)])
    await db.leads.create_index("status")
    await db.leads.create_index("phone")
    await db.activity_logs.create_index([("created_at", -1)])
    await db.events.create_index([("created_at", -1)])
    await db.login_attempts.create_index("identifier")
    await db.blog_posts.create_index("slug")
    await db.services.create_index("slug")
    await db.industries.create_index("slug")
    await db.case_studies.create_index("slug")

    # Seed admin (idempotent; password refresh if env changed)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@drdukaan.com").strip().lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin1234")
    existing = await db.admins.find_one({"email": admin_email})
    if not existing:
        await db.admins.insert_one(
            {
                "id": new_id(),
                "email": admin_email,
                "name": "Super Admin",
                "role": "super_admin",
                "password_hash": hash_password(admin_password),
                "must_change_password": True,
                "created_at": now_iso(),
                "updated_at": now_iso(),
            }
        )
        logger.info("Seeded admin %s", admin_email)
    else:
        from deps import verify_password

        if not verify_password(admin_password, existing["password_hash"]):
            await db.admins.update_one(
                {"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password), "updated_at": now_iso()}}
            )

    # Seed content collections
    await seed_collection("services", seed_data.SERVICES)
    await seed_collection("industries", seed_data.INDUSTRIES)
    await seed_collection("case_studies", seed_data.CASE_STUDIES)
    await seed_collection("testimonials", seed_data.TESTIMONIALS)
    await seed_collection("pricing_plans", seed_data.PRICING_PLANS)
    await seed_collection("faqs", seed_data.FAQS)
    blog = seed_data.BLOG_POSTS
    for post in blog:
        post.setdefault("published_at", now_iso())
    await seed_collection("blog_posts", blog)

    # Seed settings sections
    for section, data in seed_data.SETTINGS.items():
        exists = await db.settings.find_one({"section": section})
        if not exists:
            await db.settings.insert_one({"section": section, "data": data, "updated_at": now_iso()})
            logger.info("Seeded settings: %s", section)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
