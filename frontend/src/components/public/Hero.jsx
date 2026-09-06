import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DdIcon, GlowButton } from "./kit";
import { Fallback2D } from "@/components/three/HeroScene";
import { useSite } from "@/context/SiteContext";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

function MaskedLine({ children, delay }) {
    return (
        <span className="block overflow-hidden pb-1">
            <motion.span
                className="block"
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.span>
        </span>
    );
}

function Counter({ value, suffix = "", label }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const start = performance.now();
        const dur = 1400;
        let raf;
        const step = (t) => {
            const p = Math.min(1, (t - start) / dur);
            setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [inView, value]);
    return (
        <div ref={ref} className="flex flex-col items-center gap-1 px-4" data-testid={`stat-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                {display}
                <span className="text-dd-cyan">{suffix}</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 text-center">{label}</span>
        </div>
    );
}

function HeroLeadForm() {
    const navigate = useNavigate();
    const { industries, track, t } = useSite();
    const [form, setForm] = useState({ business_name: "", business_type: "", phone: "" });
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        track("cta_click", "hero_growth_options");
        window.dispatchEvent(new CustomEvent("dd:lead-prefill", { detail: form }));
        if (window.location.pathname === "/") {
            document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/#quote");
        }
    };

    return (
        <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card glow-border rounded-2xl p-5 sm:p-6 w-full max-w-md"
            data-testid="hero-mini-form"
        >
            <p className="font-display font-semibold text-base mb-1">{t("mini_form_title", "Tell us about your business.")}</p>
            <p className="text-xs text-slate-400 mb-4">{t("mini_form_sub", "Get a digital growth plan built for your business.")}</p>
            <div className="flex flex-col gap-3">
                <input
                    value={form.business_name}
                    onChange={set("business_name")}
                    placeholder={t("form_business", "Business Name")}
                    aria-label="Business Name"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm placeholder:text-slate-500 focus:border-dd-cyan/60 focus:outline-none transition-colors"
                    data-testid="hero-form-input-business"
                />
                <select
                    value={form.business_type}
                    onChange={set("business_type")}
                    aria-label="Business Type"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-slate-300 focus:border-dd-cyan/60 focus:outline-none transition-colors appearance-none"
                    data-testid="hero-form-select-type"
                >
                    <option value="" className="bg-dd-surface">{t("form_business_type", "Business Type")}</option>
                    {(industries || []).map((i) => (
                        <option key={i.slug} value={i.name} className="bg-dd-surface">{i.name}</option>
                    ))}
                    <option value="Other" className="bg-dd-surface">Other</option>
                </select>
                <input
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder={t("form_phone", "Phone / WhatsApp")}
                    aria-label="Phone or WhatsApp"
                    inputMode="tel"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm placeholder:text-slate-500 focus:border-dd-cyan/60 focus:outline-none transition-colors"
                    data-testid="hero-form-input-phone"
                />
                <GlowButton type="submit" variant="primary" className="w-full" testId="hero-form-submit-button">
                    {t("mini_form_button", "Show Me My Growth Options")} <DdIcon name="ArrowRight" className="w-4 h-4" />
                </GlowButton>
            </div>
        </motion.form>
    );
}

export default function Hero() {
    const { whatsappUrl, track, t, tw } = useSite();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
    const sceneY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);

    const scrollToServices = () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });

    return (
        <section ref={sectionRef} className="relative min-h-screen overflow-hidden grid-bg" data-testid="hero-section">
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-dd-blue/15 blur-[140px]" />
            <div className="pointer-events-none absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-dd-violet/12 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 -left-40 h-[380px] w-[380px] rounded-full bg-dd-cyan/10 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-32 lg:pt-36 pb-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
                <motion.div style={{ y: textY }} className="flex flex-col gap-7">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-dd-cyan/25 bg-dd-cyan/[0.06] px-4 py-1.5"
                        data-testid="hero-eyebrow"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-dd-cyan animate-pulse" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-dd-cyan">
                            {tw("hero_eyebrow", "Digital Growth Partner for Local Businesses")}
                        </span>
                    </motion.div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]" data-testid="hero-headline">
                        <MaskedLine delay={0.15}>{tw("hero_title_1", "Take Your Local Business")}</MaskedLine>
                        <MaskedLine delay={0.3}>{tw("hero_title_2", "From Offline to")}</MaskedLine>
                        <MaskedLine delay={0.45}>
                            <span className="glow-text">{tw("hero_title_accent", "Online.")}</span>
                        </MaskedLine>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.7 }}
                        className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl"
                        data-testid="hero-subtitle"
                    >
                        {tw("hero_subtitle", "We build the digital systems, marketing and growth strategy that help local businesses attract more customers.")}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.85 }}
                        className="font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-slate-500"
                        data-testid="hero-growth-statement"
                    >
                        {tw("growth_statement", "Build. Launch. Market. Measure. Grow.")}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.6 }} className="flex flex-wrap items-center gap-4">
                        <GlowButton
                            variant="primary"
                            testId="hero-cta-primary"
                            onClick={() => {
                                track("cta_click", "hero_consultation");
                                document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            {tw("hero_primary_cta", "Get a Free Digital Growth Consultation")}
                        </GlowButton>
                        <GlowButton
                            variant="whatsapp"
                            href={whatsappUrl("hero_message")}
                            external
                            testId="hero-cta-whatsapp"
                            onClick={() => track("whatsapp_click", "hero")}
                        >
                            <DdIcon name="MessageCircle" className="w-4 h-4" /> {tw("hero_secondary_cta", "Chat on WhatsApp")}
                        </GlowButton>
                        <button
                            onClick={scrollToServices}
                            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-dd-cyan transition-colors"
                            data-testid="hero-cta-explore"
                        >
                            {tw("hero_tertiary_cta", "Explore Our Services")}
                            <DdIcon name="ArrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>

                    <HeroLeadForm />
                </motion.div>

                <motion.div
                    style={{ y: sceneY }}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative h-[380px] sm:h-[480px] lg:h-[560px] overflow-hidden rounded-3xl"
                >
                    <Suspense fallback={<Fallback2D />}>
                        <HeroScene />
                    </Suspense>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                className="relative mx-auto max-w-7xl px-5 sm:px-8 pb-14"
            >
                <div className="glass-card rounded-2xl py-6 px-2 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5" data-testid="hero-stats-bar">
                    <Counter value={9} label={t("stat_services", "Growth Services")} />
                    <Counter value={10} label={t("stat_industries", "Industries Served")} />
                    <Counter value={8} label={t("stat_steps", "Step Growth System")} />
                    <Counter value={100} suffix="%" label={t("stat_measurable", "Measurable Results")} />
                </div>
            </motion.div>
        </section>
    );
}
