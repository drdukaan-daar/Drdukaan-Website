import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DdIcon } from "@/components/public/kit";
import { Field } from "@/components/admin/CrudPage";
import { api, formatApiError } from "@/lib/api";

function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setPath(obj, path, value) {
    const keys = path.split(".");
    const clone = { ...obj };
    let cur = clone;
    for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...(cur[keys[i]] || {}) };
        cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    return clone;
}

export function SettingsEditor({ section, title, subtitle, fields, note, languages = false }) {
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [langTab, setLangTab] = useState("en");
    const effFields =
        languages && langTab !== "en" ? fields.map((f) => ({ ...f, name: `${f.name}_${langTab}`, label: `${f.label} (${langTab.toUpperCase()})` })) : fields;

    const load = useCallback(() => {
        api.get(`/admin/settings/${section}`)
            .then((res) => setForm(res.data))
            .catch((e) => toast.error(formatApiError(e)));
    }, [section]);

    useEffect(load, [load]);

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/admin/settings/${section}`, form);
            toast.success("Settings saved — live on the site now");
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setSaving(false);
        }
    };

    if (!form) return <div className="h-40 rounded-2xl bg-white/[0.03] animate-pulse" />;

    return (
        <form onSubmit={save} className="flex flex-col gap-6 max-w-4xl" data-testid={`settings-${section}-page`}>
            <div>
                <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
            </div>
            {languages && (
                <div className="flex items-center gap-2" data-testid="content-lang-tabs">
                    {[
                        { code: "en", label: "English" },
                        { code: "hi", label: "हिंदी" },
                        { code: "te", label: "తెలుగు" },
                    ].map((l) => (
                        <button
                            type="button"
                            key={l.code}
                            onClick={() => setLangTab(l.code)}
                            className={`rounded-full px-5 py-2 text-sm border transition-colors ${
                                langTab === l.code ? "border-dd-cyan/60 text-dd-cyan bg-dd-cyan/10" : "border-white/10 text-slate-400 hover:text-white"
                            }`}
                            data-testid={`content-lang-${l.code}`}
                        >
                            {l.label}
                        </button>
                    ))}
                    {langTab !== "en" && (
                        <span className="text-xs text-slate-500 ml-2">Translate any field — blank fields fall back to the built-in default translation, then English.</span>
                    )}
                </div>
            )}
            {note && <p className="rounded-xl border border-dd-cyan/20 bg-dd-cyan/[0.05] px-4 py-3 text-xs text-slate-300">{note}</p>}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 grid sm:grid-cols-2 gap-4">
                {effFields.map((f) => (
                    <Field key={f.name} field={f} value={getPath(form, f.name)} onChange={(v) => setForm((prev) => setPath(prev, f.name, v))} testId={`settings-${section}-${f.name.replace(/\./g, "-")}`} />
                ))}
            </div>
            <div>
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-full bg-dd-cyan px-7 py-3 font-display font-semibold text-sm text-[#06222b] disabled:opacity-60 hover:shadow-[0_0_24px_rgba(0,240,255,0.35)] transition-shadow" data-testid={`settings-${section}-save`}>
                    {saving && <DdIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

export function WebsiteContentPage() {
    return (
        <SettingsEditor
            section="website"
            title="Website Content"
            subtitle="Edit hero, headlines and CTA copy. Use the language tabs to provide Hindi and Telugu versions. Changes go live immediately — no code edits needed."
            languages
            fields={[
                { name: "brand_name", label: "Brand Name" },
                { name: "tagline", label: "Tagline" },
                { name: "hero_eyebrow", label: "Hero Eyebrow", full: true },
                { name: "hero_title_1", label: "Hero Title — Line 1", full: true },
                { name: "hero_title_2", label: "Hero Title — Line 2" },
                { name: "hero_title_accent", label: "Hero Title — Accent (gradient)" },
                { name: "hero_subtitle", label: "Hero Subtitle", type: "textarea", full: true },
                { name: "growth_statement", label: "Growth Statement", full: true },
                { name: "hero_primary_cta", label: "Hero Primary CTA" },
                { name: "hero_secondary_cta", label: "Hero Secondary CTA" },
                { name: "hero_tertiary_cta", label: "Hero Tertiary CTA" },
                { name: "footer_tagline", label: "Footer Tagline" },
                { name: "differentiator_title", label: "Differentiator Title", full: true },
                { name: "differentiator_statement", label: "Differentiator Big Statement", full: true },
                { name: "differentiator_copy", label: "Differentiator Copy", type: "textarea", full: true },
                { name: "final_cta_title_1", label: "Final CTA — Line 1", full: true },
                { name: "final_cta_title_2", label: "Final CTA — Line 2 (gradient)", full: true },
                { name: "final_cta_subtitle", label: "Final CTA Subtitle", type: "textarea", full: true },
            ]}
        />
    );
}

export function WhatsAppSettingsPage() {
    return (
        <SettingsEditor
            section="whatsapp"
            title="WhatsApp Settings"
            subtitle="One place to control every WhatsApp button on the site."
            note="Number format: country code + number, digits only (e.g. 919985510295). All WhatsApp CTAs across the site update automatically when you save."
            fields={[
                { name: "number", label: "WhatsApp Number (digits only)", placeholder: "919985510295" },
                { name: "display", label: "Display Format", placeholder: "+91 9985510295" },
                { name: "default_message", label: "Default Message", type: "textarea", full: true },
                { name: "hero_message", label: "Hero Message", type: "textarea", full: true },
                { name: "quote_message", label: "Quote Message", type: "textarea", full: true },
            ]}
        />
    );
}

export function ContactSettingsPage() {
    return (
        <SettingsEditor
            section="contact"
            title="Contact Settings"
            subtitle="Email, locations, hours and social links shown across the site."
            fields={[
                { name: "email", label: "Email" },
                { name: "business_hours", label: "Business Hours" },
                { name: "service_area", label: "Service Area Note", full: true },
                { name: "google_maps_url", label: "Google Maps URL (optional)", full: true },
                { name: "locations", label: "Locations (one per line)", type: "list" },
                { name: "social.instagram", label: "Instagram URL" },
                { name: "social.facebook", label: "Facebook URL" },
                { name: "social.linkedin", label: "LinkedIn URL" },
                { name: "social.twitter", label: "Twitter / X URL" },
                { name: "social.youtube", label: "YouTube URL" },
            ]}
        />
    );
}

export function SeoSettingsPage() {
    return (
        <SettingsEditor
            section="seo"
            title="SEO Settings"
            subtitle="Homepage metadata. Service, industry, case study and blog pages carry their own SEO fields."
            note="Sitemap is auto-generated at /api/public/sitemap.xml and robots.txt points to it."
            fields={[
                { name: "home_title", label: "Homepage Title", full: true },
                { name: "home_description", label: "Homepage Description", type: "textarea", full: true },
                { name: "og_title", label: "OG Title", full: true },
                { name: "og_description", label: "OG Description", type: "textarea", full: true },
                { name: "og_image", label: "OG Image URL", full: true },
                { name: "keywords", label: "Default Keywords", type: "textarea", full: true },
            ]}
        />
    );
}

export function AnalyticsSettingsPage() {
    return (
        <SettingsEditor
            section="analytics"
            title="Analytics (GA4)"
            subtitle="Connect Google Analytics 4 to the public website."
            note="Paste your GA4 Measurement ID (starts with G-). Find it in Google Analytics → Admin → Data Streams. The site starts tracking automatically after save — no code changes."
            fields={[
                { name: "ga4_id", label: "GA4 Measurement ID", placeholder: "G-XXXXXXXXXX", full: true },
                { name: "track_page_views", label: "Track Page Views", type: "switch" },
                { name: "track_cta_clicks", label: "Track CTA Clicks", type: "switch" },
                { name: "track_whatsapp_clicks", label: "Track WhatsApp Clicks", type: "switch" },
                { name: "track_form_submissions", label: "Track Form Submissions", type: "switch" },
            ]}
        />
    );
}

export function SiteSettingsPage() {
    const [profile, setProfile] = useState({ name: "", email: "" });
    const [pw, setPw] = useState({ current_password: "", new_password: "" });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    useEffect(() => {
        api.get("/auth/me").then((res) => setProfile({ name: res.data.name || "Admin", email: res.data.email })).catch(() => {});
    }, []);

    const saveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await api.put("/auth/profile", profile);
            toast.success("Profile updated. Use the new email next login.");
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setSavingProfile(false);
        }
    };

    const savePassword = async (e) => {
        e.preventDefault();
        if (pw.new_password.length < 8) return toast.error("New password must be at least 8 characters.");
        setSavingPw(true);
        try {
            await api.post("/auth/change-password", pw);
            setPw({ current_password: "", new_password: "" });
            toast.success("Password changed");
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setSavingPw(false);
        }
    };

    const inputCls = "w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-dd-cyan/60 focus:outline-none transition-colors";

    return (
        <div className="flex flex-col gap-8 max-w-2xl" data-testid="site-settings-page">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Site Settings</h1>
                <p className="text-sm text-slate-400 mt-1">Admin account and security.</p>
            </div>

            <form onSubmit={saveProfile} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 flex flex-col gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Admin Profile</p>
                <div>
                    <label htmlFor="admin-name" className="block font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1.5">Display Name</label>
                    <input id="admin-name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className={inputCls} data-testid="settings-profile-name" />
                </div>
                <div>
                    <label htmlFor="admin-email-edit" className="block font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1.5">Login Email</label>
                    <input id="admin-email-edit" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={inputCls} data-testid="settings-profile-email" />
                </div>
                <div>
                    <button type="submit" disabled={savingProfile} className="rounded-full bg-dd-cyan px-6 py-2.5 font-display font-semibold text-sm text-[#06222b] disabled:opacity-60" data-testid="settings-profile-save">
                        {savingProfile ? "Saving..." : "Save Profile"}
                    </button>
                </div>
            </form>

            <form onSubmit={savePassword} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 flex flex-col gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Change Password</p>
                <p className="text-xs text-slate-500">Change the seeded development password before going live. Production credentials can also be set via the ADMIN_EMAIL / ADMIN_PASSWORD environment variables.</p>
                <div>
                    <label htmlFor="pw-current" className="block font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1.5">Current Password</label>
                    <input id="pw-current" type="password" value={pw.current_password} onChange={(e) => setPw((p) => ({ ...p, current_password: e.target.value }))} className={inputCls} data-testid="settings-password-current" />
                </div>
                <div>
                    <label htmlFor="pw-new" className="block font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1.5">New Password (min 8 characters)</label>
                    <input id="pw-new" type="password" value={pw.new_password} onChange={(e) => setPw((p) => ({ ...p, new_password: e.target.value }))} className={inputCls} data-testid="settings-password-new" />
                </div>
                <div>
                    <button type="submit" disabled={savingPw} className="rounded-full bg-dd-violet px-6 py-2.5 font-display font-semibold text-sm text-white disabled:opacity-60" data-testid="settings-password-save">
                        {savingPw ? "Changing..." : "Change Password"}
                    </button>
                </div>
            </form>
        </div>
    );
}
