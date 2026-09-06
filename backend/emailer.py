import ipaddress
import logging
import os
import re
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx

from deps import get_settings_section

logger = logging.getLogger("drdukaan.email")

# Emergent managed email proxy — constant by design, never from env.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Dr Dukaan")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = (
    "reply with your password", "reply with the code", "send your password", "cvv",
    "send us your password", "enter your password below", "confirm your card number",
    "your full card number", "seed phrase", "recovery phrase", "verify your card",
    "social security number", "confirm your bank details",
)
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _row(label: str, value: str) -> str:
    if not value:
        return ""
    return (
        f'<tr><td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #f0f0f0">{escape(label)}</td>'
        f'<td style="padding:8px 12px;font-size:13px;color:#111;border-bottom:1px solid #f0f0f0">{escape(value)}</td></tr>'
    )


async def notify_new_lead(lead: dict) -> None:
    """Fire-and-forget lead alert to the business inbox. Never raises."""
    try:
        if not EMAIL_KEY:
            logger.warning("EMERGENT_EMAIL_KEY not set — skipping lead email")
            return
        contact = await get_settings_section("contact")
        to = contact.get("email") or os.environ.get("OWNER_EMAIL") or "drdukaan@gmail.com"
        name = escape(lead.get("name", "Unknown"))
        subject = f"New enquiry: {name} — {lead.get('business_name') or lead.get('business_type') or 'Dr Dukaan website'}"
        phone = escape(lead.get("phone", ""))
        whatsapp = escape(lead.get("whatsapp") or lead.get("phone", ""))
        rows = "".join(
            [
                _row("Name", lead.get("name", "")),
                _row("Business", lead.get("business_name", "")),
                _row("Business type", lead.get("business_type", "")),
                _row("Email", lead.get("email") or ""),
                _row("Budget", lead.get("budget", "")),
                _row("Services", ", ".join(lead.get("services") or [])),
                _row("Message", lead.get("message", "")),
                _row("Source", lead.get("source", "")),
            ]
        )
        wa_digits = re.sub(r"\D", "", whatsapp)
        html = (
            '<table role="presentation" width="100%" style="background:#f6f7f9;padding:24px 0"><tr><td align="center">'
            '<table role="presentation" width="560" style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,sans-serif">'
            '<tr><td style="background:#090A0F;padding:20px 24px"><span style="color:#00F0FF;font-size:18px;font-weight:bold">Dr Dukaan</span>'
            '<span style="color:#94A3B8;font-size:12px"> — New website enquiry</span></td></tr>'
            f'<tr><td style="padding:20px 24px"><p style="font-size:15px;color:#111;margin:0 0 12px"><strong>{name}</strong> just asked for a growth quote.</p>'
            f'<table role="presentation" width="100%" style="border-collapse:collapse">{rows}</table>'
            f'<p style="margin:16px 0 0"><a href="tel:{phone}" style="display:inline-block;background:#00F0FF;color:#06222b;text-decoration:none;font-weight:bold;font-size:13px;padding:10px 18px;border-radius:24px;margin-right:8px">Call {phone}</a>'
            f'<a href="https://wa.me/{wa_digits}" style="display:inline-block;background:#25D366;color:#062b16;text-decoration:none;font-weight:bold;font-size:13px;padding:10px 18px;border-radius:24px">WhatsApp</a></p>'
            '</td></tr>'
            '<tr><td style="padding:14px 24px;background:#fafafa"><p style="font-size:11px;color:#999;margin:0">Sent by Dr Dukaan lead alerts. We never ask for passwords or card details by email.</p></td></tr>'
            "</table></td></tr></table>"
        )
        email_id = await send_email(to=to, subject=subject, html=html)
        logger.info("Lead alert emailed to %s (id=%s)", to, email_id)
    except Exception as e:  # never break lead capture
        logger.error("Lead alert email failed: %s", e)
