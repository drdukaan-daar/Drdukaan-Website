import React from "react";
import { DdIcon, Reveal, GlowButton } from "@/components/public/kit";
import { PageHero } from "./Services";
import { LeadFormSection } from "@/components/public/Sections3";
import { useMeta } from "@/lib/useMeta";

const PILLARS = [
    { icon: "Globe", title: "Technology", desc: "Fast, modern websites, apps and e-commerce built to convert visitors into customers." },
    { icon: "Palette", title: "Design", desc: "Premium branding and creative that makes your business look as good online as it is offline." },
    { icon: "Megaphone", title: "Marketing", desc: "SEO, Google Ads and Meta Ads that put your business in front of the right customers." },
    { icon: "BarChart3", title: "Analytics", desc: "Clear tracking and reporting so you always know what is actually working." },
    { icon: "TrendingUp", title: "Strategy", desc: "A growth plan built around your business, your customers and your goals." },
];

const PRINCIPLES = [
    "Outcomes over deliverables — we sell growth, not files.",
    "Plain language. If you can't explain it to your accountant, we haven't done our job.",
    "Everything measurable. No vanity metrics, no vague reports.",
    "One partner, full stack — websites, ads, SEO, analytics under one roof.",
    "Honest timelines and honest quotes. No guaranteed-rankings nonsense.",
];

export default function AboutPage() {
    useMeta("About | Dr Dukaan", "Dr Dukaan is your Digital Growth Partner — combining technology, design, marketing, analytics and strategy for local businesses.");
    return (
        <>
            <PageHero
                eyebrow="About Dr Dukaan"
                title="Your Digital Growth Partner."
                sub="Many local businesses have excellent offline operations but a weak digital presence. We exist to bridge that gap."
                testId="about-page-hero"
            />
            <section className="pb-20">
                <div className="mx-auto max-w-5xl px-5 sm:px-8 flex flex-col gap-14">
                    <Reveal>
                        <div className="glass-card rounded-3xl p-8 sm:p-12">
                            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                                Your customers are already online — searching, comparing, messaging, buying.{" "}
                                <span className="text-white font-semibold">The question is whether they find you or your competitor.</span>{" "}
                                Dr Dukaan combines technology, design, marketing, analytics and strategy into one digital growth system, so your business gets found, gets enquiries and keeps growing.
                            </p>
                        </div>
                    </Reveal>

                    <div>
                        <Reveal>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">What We Bring Together</h2>
                        </Reveal>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {PILLARS.map((p, i) => (
                                <Reveal key={p.title} delay={i * 0.07}>
                                    <div className="glass-card rounded-2xl p-6 h-full" data-testid={`about-pillar-${p.title.toLowerCase()}`}>
                                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-dd-cyan/15 to-dd-violet/15 border border-white/10 text-dd-cyan">
                                            <DdIcon name={p.icon} className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Reveal>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">How We Work</h2>
                        </Reveal>
                        <div className="flex flex-col gap-4">
                            {PRINCIPLES.map((p, i) => (
                                <Reveal key={p} delay={i * 0.06}>
                                    <div className="flex items-start gap-4 glass-card rounded-2xl p-5">
                                        <span className="font-mono text-xs text-dd-cyan mt-1">{String(i + 1).padStart(2, "0")}</span>
                                        <p className="text-slate-300 text-sm sm:text-base">{p}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>

                    <Reveal className="flex flex-wrap gap-4">
                        <GlowButton to="/process" variant="ghost" testId="about-process-cta">
                            See How We Grow <DdIcon name="ArrowRight" className="w-4 h-4" />
                        </GlowButton>
                        <GlowButton to="/contact" variant="primary" testId="about-contact-cta">
                            Talk to Us
                        </GlowButton>
                    </Reveal>
                </div>
            </section>
            <LeadFormSection source="about-page" />
        </>
    );
}
