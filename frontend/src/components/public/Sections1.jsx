import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { DdIcon, Reveal, SectionHeading, GlowButton, Chapter } from "./kit";
import { useSite } from "@/context/SiteContext";

export function TrustServices() {
    const { services, track, t } = useSite();
    return (
        <section id="services" className="relative py-24 sm:py-32" data-testid="trust-services-section">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col gap-14">
                <SectionHeading
                    num={1}
                    chapter="The Ecosystem"
                    title={t("services_title", "Everything Your Business Needs to Grow Online.")}
                    sub={t("services_sub", "One digital partner instead of managing multiple agencies, freelancers and platforms.")}
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(services || []).map((s, i) => (
                        <Reveal key={s.id || s.slug} delay={(i % 3) * 0.08}>
                            <Link
                                to={`/services/${s.slug}`}
                                onClick={() => track("service_interest", s.name)}
                                className="group relative block h-full rounded-2xl glass-card p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,240,255,0.08)] hover:border-dd-cyan/30"
                                data-testid={`service-card-${s.slug}`}
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-dd-cyan/15 to-dd-violet/15 border border-white/10 text-dd-cyan transition-transform duration-300 group-hover:scale-110">
                                    <DdIcon name={s.icon} className="w-6 h-6" />
                                </div>
                                <h3 className="font-display text-xl font-semibold mb-2">{s.name}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-5">{s.short_description}</p>
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-dd-cyan">
                                    {s.cta}
                                    <DdIcon name="ArrowRight" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function GrowthSystem() {
    const { tw } = useSite();
    const parts = ["Website", "Google", "SEO", "Ads", "WhatsApp", "Analytics", "Leads"];
    return (
        <section className="relative py-24 sm:py-32 overflow-hidden" data-testid="growth-system-section">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-dd-blue/[0.05] to-transparent" />
            <div className="relative mx-auto max-w-6xl px-5 sm:px-8 flex flex-col items-center text-center gap-10">
                <Chapter num={2} label="The Difference" />
                <Reveal>
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-300">
                        {tw("differentiator_title", "We Don't Just Build Your Website.")}
                    </h2>
                </Reveal>
                <Reveal delay={0.15}>
                    <p className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight glow-text leading-[1.12]" data-testid="growth-system-statement">
                        {tw("differentiator_statement", "WE BUILD YOUR DIGITAL GROWTH SYSTEM.")}
                    </p>
                </Reveal>
                <Reveal delay={0.25}>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl" data-testid="growth-system-formula">
                        {parts.map((p, i) => (
                            <React.Fragment key={p}>
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.09 }}
                                    className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 font-mono text-xs sm:text-sm text-slate-200"
                                >
                                    {p}
                                </motion.span>
                                {i < parts.length - 1 && <span className="text-dd-cyan font-bold">+</span>}
                            </React.Fragment>
                        ))}
                        <span className="text-dd-cyan font-bold text-xl mx-1">=</span>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.85 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + parts.length * 0.09 }}
                            className="rounded-full bg-dd-cyan px-5 py-2 font-display font-bold text-sm text-[#06222b] shadow-[0_0_30px_rgba(0,240,255,0.35)]"
                        >
                            Business Growth
                        </motion.span>
                    </div>
                </Reveal>
                <Reveal delay={0.35}>
                    <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                        {tw("differentiator_copy", "Launching a website is only the beginning. We help you build the complete digital system around your business and continuously improve it.")}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

const JOURNEY_STEPS = [
    { title: "Discover", desc: "Understand your business, customers, competitors and goals." },
    { title: "Plan", desc: "Create a digital strategy based on your business objectives." },
    { title: "Build", desc: "Develop your website, app, e-commerce platform and digital assets." },
    { title: "Launch", desc: "Connect your digital presence with Google, WhatsApp, analytics and advertising platforms." },
    { title: "Attract", desc: "Use SEO, Google Ads, Meta Ads and digital campaigns to attract relevant customers." },
    { title: "Measure", desc: "Track visitors, leads, calls, enquiries and conversions." },
    { title: "Optimize", desc: "Identify what works and improve campaigns and digital experiences." },
    { title: "Grow", desc: "Turn data into better decisions and continuous business growth." },
];

export function Journey() {
    const { t } = useSite();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
    const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

    return (
        <section className="relative py-24 sm:py-32" data-testid="journey-section">
            <div className="mx-auto max-w-5xl px-5 sm:px-8 flex flex-col gap-16">
                <SectionHeading
                    num={3}
                    chapter="The Journey"
                    title={t("journey_title", "Your Digital Growth Journey.")}
                    sub={t("journey_sub", "Eight deliberate steps. No guesswork, no jargon — a system that compounds.")}
                />
                <div ref={ref} className="relative pl-8 sm:pl-0">
                    <div className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-white/8 sm:-translate-x-1/2" />
                    <motion.div
                        className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-dd-cyan via-dd-blue to-dd-violet origin-top sm:-translate-x-1/2"
                        style={{ scaleY }}
                    />
                    <div className="flex flex-col gap-14">
                        {JOURNEY_STEPS.map((step, i) => (
                            <Reveal key={step.title} delay={0.05} className={`relative sm:w-1/2 ${i % 2 ? "sm:ml-auto sm:pl-12" : "sm:pr-12 sm:text-right"}`}>
                                <span
                                    className={`absolute top-1 -left-8 sm:left-auto h-4 w-4 rounded-full border-2 border-dd-cyan bg-dd-bg shadow-[0_0_14px_rgba(0,240,255,0.6)] ${
                                        i % 2 ? "sm:-left-2" : "sm:-right-2"
                                    }`}
                                />
                                <span className="font-mono text-xs tracking-[0.3em] text-dd-cyan">{String(i + 1).padStart(2, "0")}</span>
                                <h3 className="font-display text-2xl font-bold mt-1 mb-2 uppercase tracking-wide" data-testid={`journey-step-${i + 1}`}>
                                    {step.title}
                                </h3>
                                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{step.desc}</p>
                            </Reveal>
                        ))}
                    </div>
                </div>
                <Reveal className="flex justify-center">
                    <GlowButton to="/contact" variant="ghost" testId="journey-cta">
                        Start My Digital Journey <DdIcon name="ArrowRight" className="w-4 h-4" />
                    </GlowButton>
                </Reveal>
            </div>
        </section>
    );
}

export { Chapter } from "./kit";
