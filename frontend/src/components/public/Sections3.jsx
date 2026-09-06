import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DdIcon, Reveal, SectionHeading, GlowButton, DemoBadge } from "./kit";
import { useSite } from "@/context/SiteContext";
import { api, formatApiError } from "@/lib/api";

// ---------------- Case Studies ----------------

export function CaseStudiesSection({ limit }) {
    const { caseStudies, track } = useSite();
    const items = limit ? (caseStudies || []).slice(0, limit) : caseStudies || [];
    return (
        <section className="relative py-24 sm:py-32" data-testid="case-studies-section">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col gap-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <SectionHeading
                        num={7}
                        chapter="Proof of System"
                        title="See the Growth System in Action."
                        sub="Example projects showing how the Dr Dukaan system works for different businesses. Demo projects — illustrative, not client claims."
                    />
                    <DemoBadge label="DEMO PROJECTS" />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    {items.map((cs, i) => (
                        <Reveal key={cs.id || cs.slug} delay={(i % 2) * 0.1}>
                            <Link
                                to={`/case-studies/${cs.slug}`}
                                onClick={() => track("cta_click", `case_study_${cs.slug}`)}
                                className="group relative block overflow-hidden rounded-2xl glass-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(0,102,255,0.12)]"
                                data-testid={`case-study-card-${cs.slug}`}
                            >
                                {cs.featured_image && (
                                    <div className="relative h-52 sm:h-60 overflow-hidden">
                                        <img
                                            src={cs.featured_image}
                                            alt={cs.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dd-bg via-dd-bg/30 to-transparent" />
                                        <span className="absolute top-4 left-4"><DemoBadge label="DEMO PROJECT" /></span>
                                    </div>
                                )}
                                <div className="p-6 sm:p-7 flex flex-col gap-3">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dd-cyan">{cs.industry}</span>
                                    <h3 className="font-display text-xl sm:text-2xl font-bold">{cs.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{cs.challenge}</p>
                                    <span className="inline-flex items-center gap-2 text-sm font-medium text-dd-cyan mt-1">
                                        View Project <DdIcon name="ArrowRight" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ---------------- Testimonials ----------------

export function TestimonialsSection() {
    const { testimonials } = useSite();
    if (!testimonials?.length) return null;
    return (
        <section className="relative py-20 sm:py-24 bg-dd-surface/30" data-testid="testimonials-section">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col gap-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <SectionHeading eyebrow="What Clients Say" title="Trusted by Businesses Like Yours." />
                    <DemoBadge label="DEMO TESTIMONIALS" />
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                    {testimonials.slice(0, 3).map((t, i) => (
                        <Reveal key={t.id || i} delay={i * 0.1}>
                            <figure className="h-full rounded-2xl glass-card p-7 flex flex-col gap-4" data-testid={`testimonial-${i}`}>
                                <DdIcon name="Quote" className="w-6 h-6 text-dd-cyan/60" />
                                <blockquote className="text-sm text-slate-300 leading-relaxed flex-1">{t.testimonial}</blockquote>
                                <figcaption className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-display font-semibold text-sm">{t.name}</p>
                                        <p className="text-xs text-slate-500">{t.role}{t.business ? ` · ${t.business}` : ""}</p>
                                    </div>
                                    <span className="flex gap-0.5" aria-label={`${t.rating} star rating`}>
                                        {Array.from({ length: t.rating || 5 }).map((_, s) => (
                                            <DdIcon key={s} name="Star" className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        ))}
                                    </span>
                                </figcaption>
                                {t.isDemo && <DemoBadge label="DEMO TESTIMONIAL" />}
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ---------------- Pricing ----------------

export function PricingSection() {
    const { pricingPlans, whatsappUrl, track } = useSite();
    return (
        <section className="relative py-24 sm:py-32" data-testid="pricing-section">
            <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-dd-violet/[0.07] blur-[130px]" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 flex flex-col gap-14">
                <SectionHeading
                    align="center"
                    num={8}
                    chapter="Pricing"
                    title="Simple Packages. Serious Growth."
                    sub="Every business is different, so we quote for your goals — not a generic rate card. Tell us where you want to go."
                />
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                    {(pricingPlans || []).map((plan, i) => (
                        <Reveal key={plan.id || plan.slug} delay={i * 0.1} className="h-full">
                            <div
                                className={`relative h-full rounded-3xl p-8 flex flex-col gap-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-2 ${
                                    plan.highlighted
                                        ? "glass-card glow-border shadow-[0_0_60px_rgba(0,240,255,0.12)]"
                                        : "glass-card"
                                }`}
                                data-testid={`pricing-plan-${plan.slug || plan.name.toLowerCase()}`}
                            >
                                {plan.badge && (
                                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-dd-cyan px-4 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#06222b] font-medium">
                                        {plan.badge}
                                    </span>
                                )}
                                <div>
                                    <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{plan.description}</p>
                                </div>
                                <div>
                                    <p className="font-display text-3xl font-extrabold glow-text">{plan.price || "Get Quote"}</p>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">{plan.billing_type}</p>
                                </div>
                                <ul className="flex flex-col gap-2.5 flex-1">
                                    {(plan.features || []).map((f) => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                                            <DdIcon name="Check" className="w-4 h-4 text-dd-cyan shrink-0 mt-0.5" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-col gap-3">
                                    <GlowButton
                                        variant={plan.highlighted ? "primary" : "ghost"}
                                        testId={`pricing-plan-${(plan.slug || plan.name).toLowerCase()}-cta`}
                                        onClick={() => {
                                            track("quote_click", `pricing_${plan.name}`);
                                            document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                                        }}
                                    >
                                        {plan.cta || "Get Quote"}
                                    </GlowButton>
                                    <a
                                        href={whatsappUrl("quote_message")}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => track("whatsapp_click", `pricing_${plan.name}`)}
                                        className="text-center text-sm text-slate-400 hover:text-dd-wa transition-colors"
                                        data-testid={`pricing-whatsapp-${(plan.slug || plan.name).toLowerCase()}`}
                                    >
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ---------------- FAQ ----------------

export function FaqSection() {
    const { faqs } = useSite();
    if (!faqs?.length) return null;
    return (
        <section id="faq" className="relative py-24 sm:py-32 bg-dd-surface/30" data-testid="faq-section">
            <div className="mx-auto max-w-3xl px-5 sm:px-8 flex flex-col gap-12">
                <SectionHeading
                    align="center"
                    num={9}
                    chapter="FAQ"
                    title="Questions? Good. Here Are Honest Answers."
                    sub="Straight answers for business owners — no jargon, no unrealistic promises."
                />
                <Accordion type="single" collapsible className="flex flex-col gap-3" data-testid="faq-accordion">
                    {faqs.map((f, i) => (
                        <AccordionItem key={f.id || i} value={`faq-${i}`} className="rounded-xl glass-card px-5 border-white/8 overflow-hidden" data-testid={`faq-item-${i}`}>
                            <AccordionTrigger className="text-left font-display font-medium text-base hover:text-dd-cyan hover:no-underline py-5">
                                {f.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-slate-400 leading-relaxed pb-5">{f.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

// ---------------- Lead Form ----------------

const BUDGETS = ["Just exploring", "Under ₹15,000 / month", "₹15,000 – ₹40,000 / month", "₹40,000 – ₹1,00,000 / month", "Above ₹1,00,000 / month"];

export function LeadFormSection({ source = "quote-form" }) {
    const { services, industries, whatsappUrl, track } = useSite();
    const empty = { name: "", business_name: "", phone: "", whatsapp: "", email: "", business_type: "", current_website: "", budget: "", message: "" };
    const [form, setForm] = useState(empty);
    const [selected, setSelected] = useState([]);
    const [hp, setHp] = useState("");
    const [status, setStatus] = useState("idle"); // idle | submitting | success
    const [error, setError] = useState("");

    useEffect(() => {
        const handler = (e) => {
            const d = e.detail || {};
            setForm((f) => ({ ...f, business_name: d.business_name || f.business_name, business_type: d.business_type || f.business_type, phone: d.phone || f.phone }));
        };
        window.addEventListener("dd:lead-prefill", handler);
        return () => window.removeEventListener("dd:lead-prefill", handler);
    }, []);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const toggleService = (name) => setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

    const inputCls =
        "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-sm placeholder:text-slate-500 focus:border-dd-cyan/60 focus:outline-none transition-colors";

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.name.trim().length < 2) return setError("Please enter your name.");
        if (form.phone.replace(/\D/g, "").length < 8) return setError("Please enter a valid phone number.");
        setStatus("submitting");
        try {
            await api.post("/public/leads", { ...form, services: selected, source, website_hp: hp });
            track("cta_click", "lead_form_submit");
            if (window.gtag) window.gtag("event", "lead_submit", { event_label: source });
            setStatus("success");
        } catch (err) {
            setStatus("idle");
            setError(formatApiError(err));
        }
    };

    return (
        <section id="quote" className="relative py-24 sm:py-32" data-testid="lead-form-section">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-dd-blue/[0.07] to-transparent" />
            <div className="relative mx-auto max-w-6xl px-5 sm:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
                <div className="flex flex-col gap-6 lg:sticky lg:top-28">
                    <SectionHeading
                        num={10}
                        chapter="Get Started"
                        title="Let's Build Your Digital Growth Plan."
                        sub="Tell us about your business. We'll respond with practical growth options — usually within one business day."
                    />
                    <ul className="flex flex-col gap-3">
                        {["No pressure, no jargon — a real conversation", "Clear options matched to your budget", "You keep full control of every decision"].map((t) => (
                            <li key={t} className="flex items-center gap-3 text-sm text-slate-300">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dd-cyan/10 border border-dd-cyan/30">
                                    <DdIcon name="Check" className="w-3.5 h-3.5 text-dd-cyan" />
                                </span>
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>

                <Reveal>
                    {status === "success" ? (
                        <div className="glass-card glow-border rounded-3xl p-10 flex flex-col items-center text-center gap-5" data-testid="lead-form-success">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-dd-wa/15 border border-dd-wa/40">
                                <DdIcon name="CheckCircle2" className="w-8 h-8 text-dd-wa" />
                            </span>
                            <h3 className="font-display text-2xl font-bold">We've got it, {form.name.split(" ")[0]}.</h3>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                                Your growth request is in. Want a faster response? Message us on WhatsApp right now.
                            </p>
                            <GlowButton variant="whatsapp" href={whatsappUrl("quote_message")} external testId="lead-success-whatsapp" onClick={() => track("whatsapp_click", "lead_success")}>
                                <DdIcon name="MessageCircle" className="w-4 h-4" /> Continue on WhatsApp
                            </GlowButton>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="glass-card glow-border rounded-3xl p-6 sm:p-9 flex flex-col gap-4" data-testid="lead-form" noValidate>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <input value={form.name} onChange={set("name")} placeholder="Your Name *" aria-label="Your name" required className={inputCls} data-testid="lead-input-name" />
                                <input value={form.business_name} onChange={set("business_name")} placeholder="Business Name" aria-label="Business name" className={inputCls} data-testid="lead-input-business" />
                                <input value={form.phone} onChange={set("phone")} placeholder="Phone *" aria-label="Phone" required inputMode="tel" className={inputCls} data-testid="lead-input-phone" />
                                <input value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp Number" aria-label="WhatsApp number" inputMode="tel" className={inputCls} data-testid="lead-input-whatsapp" />
                                <input value={form.email} onChange={set("email")} type="email" placeholder="Email" aria-label="Email" className={inputCls} data-testid="lead-input-email" />
                                <select value={form.business_type} onChange={set("business_type")} aria-label="Business type" className={`${inputCls} appearance-none text-slate-300`} data-testid="lead-select-business-type">
                                    <option value="" className="bg-dd-surface">Business Type</option>
                                    {(industries || []).map((i) => (
                                        <option key={i.slug} value={i.name} className="bg-dd-surface">{i.name}</option>
                                    ))}
                                    <option value="Other" className="bg-dd-surface">Other</option>
                                </select>
                            </div>
                            <input value={form.current_website} onChange={set("current_website")} placeholder="Current Website (if any)" aria-label="Current website" className={inputCls} data-testid="lead-input-website" />

                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-3">Services You're Interested In</p>
                                <div className="flex flex-wrap gap-2" data-testid="lead-services-select">
                                    {(services || []).map((s) => {
                                        const on = selected.includes(s.name);
                                        return (
                                            <button
                                                key={s.slug}
                                                type="button"
                                                onClick={() => toggleService(s.name)}
                                                aria-pressed={on}
                                                className={`rounded-full px-4 py-2 text-xs font-medium border transition-[background-color,border-color,color] duration-200 ${
                                                    on ? "bg-dd-cyan/15 border-dd-cyan/60 text-dd-cyan" : "border-white/12 text-slate-400 hover:border-white/30 hover:text-white"
                                                }`}
                                                data-testid={`lead-service-${s.slug}`}
                                            >
                                                {s.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <select value={form.budget} onChange={set("budget")} aria-label="Monthly marketing budget" className={`${inputCls} appearance-none text-slate-300`} data-testid="lead-select-budget">
                                <option value="" className="bg-dd-surface">Monthly Marketing Budget</option>
                                {BUDGETS.map((b) => (
                                    <option key={b} value={b} className="bg-dd-surface">{b}</option>
                                ))}
                            </select>

                            <textarea value={form.message} onChange={set("message")} placeholder="Tell us about your business and goals..." aria-label="Message" rows={4} className={`${inputCls} resize-none`} data-testid="lead-input-message" />

                            {/* honeypot */}
                            <input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" name="company_hp" />

                            {error && (
                                <p role="alert" className="text-sm text-rose-400" data-testid="lead-form-error">
                                    {error}
                                </p>
                            )}

                            <GlowButton type="submit" variant="primary" className="w-full" testId="lead-form-submit-button">
                                {status === "submitting" ? (
                                    <>
                                        <DdIcon name="Loader2" className="w-4 h-4 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Get My Quote <DdIcon name="ArrowRight" className="w-4 h-4" />
                                    </>
                                )}
                            </GlowButton>
                            <p className="text-center text-xs text-slate-500">We respect your privacy. Your details are used only to respond to your enquiry.</p>
                        </form>
                    )}
                </Reveal>
            </div>
        </section>
    );
}

// ---------------- Contact ----------------

export function ContactSection() {
    const { settings, whatsappUrl, track } = useSite();
    const contact = settings?.contact || {};
    const wa = settings?.whatsapp || {};
    return (
        <section className="relative py-24 sm:py-32 bg-dd-surface/30" data-testid="contact-section">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col gap-12">
                <SectionHeading
                    num={11}
                    chapter="Contact"
                    title="Talk to a Real Growth Partner."
                    sub={contact.service_area || "Serving businesses remotely across India."}
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {(contact.locations || []).map((loc, i) => (
                        <Reveal key={loc} delay={i * 0.08}>
                            <div className="glass-card rounded-2xl p-6 flex flex-col gap-3 h-full" data-testid={`contact-location-${i}`}>
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dd-cyan/10 border border-dd-cyan/25 text-dd-cyan">
                                    <DdIcon name="MapPin" className="w-5 h-5" />
                                </span>
                                <h3 className="font-display font-semibold text-lg">{loc}</h3>
                                <p className="text-xs text-slate-500">{contact.business_hours || "Mon–Sat, 10:00 AM – 7:00 PM IST"}</p>
                            </div>
                        </Reveal>
                    ))}
                    <Reveal delay={0.16}>
                        <a
                            href={whatsappUrl("default_message")}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track("whatsapp_click", "contact_section")}
                            className="glass-card rounded-2xl p-6 flex flex-col gap-3 h-full hover:border-dd-wa/40 transition-colors"
                            data-testid="contact-whatsapp-card"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dd-wa/10 border border-dd-wa/30 text-dd-wa">
                                <DdIcon name="MessageCircle" className="w-5 h-5" />
                            </span>
                            <h3 className="font-display font-semibold text-lg">WhatsApp</h3>
                            <p className="text-sm text-slate-400">{wa.display || "+91 9985510295"}</p>
                        </a>
                    </Reveal>
                    <Reveal delay={0.24}>
                        <a href={`mailto:${contact.email || "drdukaan@gmail.com"}`} className="glass-card rounded-2xl p-6 flex flex-col gap-3 h-full hover:border-dd-cyan/40 transition-colors" data-testid="contact-email-card">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dd-violet/10 border border-dd-violet/30 text-dd-violet">
                                <DdIcon name="Mail" className="w-5 h-5" />
                            </span>
                            <h3 className="font-display font-semibold text-lg">Email</h3>
                            <p className="text-sm text-slate-400 break-all">{contact.email || "drdukaan@gmail.com"}</p>
                        </a>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

// ---------------- Final CTA ----------------

export function FinalCta() {
    const { settings, whatsappUrl, track } = useSite();
    const w = settings?.website || {};
    return (
        <section className="relative py-28 sm:py-40 overflow-hidden" data-testid="final-cta-section">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dd-cyan/[0.07] blur-[140px]" />
            <div className="relative mx-auto max-w-4xl px-5 sm:px-8 flex flex-col items-center text-center gap-8">
                <Reveal>
                    <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]" data-testid="final-cta-title">
                        {w.final_cta_title_1 || "Your Business Is Already Growing Offline."}
                        <br />
                        <span className="glow-text">{w.final_cta_title_2 || "Let's Make It Grow Online."}</span>
                    </h2>
                </Reveal>
                <Reveal delay={0.15}>
                    <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                        {w.final_cta_subtitle || "Tell us where your business is today. We'll help you identify the digital opportunities that can move it forward."}
                    </p>
                </Reveal>
                <Reveal delay={0.25} className="flex flex-wrap justify-center gap-4">
                    <GlowButton
                        variant="primary"
                        testId="final-cta-primary"
                        onClick={() => {
                            track("cta_click", "final_consultation");
                            document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        Get a Free Digital Growth Consultation
                    </GlowButton>
                    <GlowButton variant="whatsapp" href={whatsappUrl("default_message")} external testId="final-cta-whatsapp" onClick={() => track("whatsapp_click", "final_cta")}>
                        <DdIcon name="MessageCircle" className="w-4 h-4" /> Chat on WhatsApp
                    </GlowButton>
                </Reveal>
            </div>
        </section>
    );
}
