import React from "react";
import { Link, useParams } from "react-router-dom";
import { DdIcon, Reveal, GlowButton, DemoBadge } from "@/components/public/kit";
import { PageHero } from "./Services";
import { CaseStudiesSection, LeadFormSection } from "@/components/public/Sections3";
import { useSite } from "@/context/SiteContext";
import { useMeta } from "@/lib/useMeta";

export function CaseStudiesPage() {
    useMeta("Case Studies | Dr Dukaan", "Demo projects showing how the Dr Dukaan digital growth system works across industries.");
    return (
        <>
            <PageHero
                eyebrow="Case Studies"
                title="The Growth System, Applied."
                sub="Illustrative demo projects that show how we approach real business problems. Clearly labelled — never fake claims."
                testId="case-studies-page-hero"
            />
            <div className="-mt-16">
                <CaseStudiesSection />
            </div>
            <LeadFormSection source="case-studies-page" />
        </>
    );
}

const BLOCKS = [
    { key: "challenge", label: "The Challenge", color: "text-rose-400", border: "border-l-rose-400/60" },
    { key: "strategy", label: "The Strategy", color: "text-dd-cyan", border: "border-l-dd-cyan/60" },
    { key: "solution", label: "The Digital Solution", color: "text-dd-blue", border: "border-l-dd-blue/60" },
    { key: "marketing", label: "The Marketing Approach", color: "text-dd-violet", border: "border-l-dd-violet/60" },
    { key: "tracking", label: "The Tracking", color: "text-dd-wa", border: "border-l-dd-wa/60" },
];

export function CaseStudyDetailPage() {
    const { slug } = useParams();
    const { caseStudies, whatsappUrl, track, loaded } = useSite();
    const cs = (caseStudies || []).find((c) => c.slug === slug);
    useMeta(cs?.seo_title || `${cs?.title || "Case Study"} | Dr Dukaan`, cs?.seo_description || "");

    if (loaded && !cs) {
        return <PageHero eyebrow="Case Studies" title="Case study not found." sub="This project doesn't exist or has been moved." testId="case-study-not-found" />;
    }
    if (!cs) return <div className="min-h-screen" />;

    return (
        <>
            <section className="relative pt-36 pb-10 overflow-hidden" data-testid="case-study-detail-hero">
                <div className="mx-auto max-w-5xl px-5 sm:px-8 flex flex-col gap-6">
                    <Reveal>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <Link to="/case-studies" className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 hover:text-dd-cyan transition-colors">
                                ← All Case Studies
                            </Link>
                            {cs.isDemoProject && <DemoBadge label="DEMO PROJECT" />}
                        </div>
                    </Reveal>
                    <Reveal delay={0.06}>
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-dd-cyan">{cs.industry}</span>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">{cs.title}</h1>
                    </Reveal>
                </div>
            </section>

            {cs.featured_image && (
                <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-10">
                    <Reveal>
                        <div className="overflow-hidden rounded-3xl border border-white/8">
                            <img src={cs.featured_image} alt={cs.title} className="w-full h-64 sm:h-96 object-cover" loading="lazy" />
                        </div>
                    </Reveal>
                </div>
            )}

            <section className="pb-20">
                <div className="mx-auto max-w-5xl px-5 sm:px-8 flex flex-col gap-6">
                    {BLOCKS.filter((b) => cs[b.key]).map((b, i) => (
                        <Reveal key={b.key} delay={i * 0.05}>
                            <div className={`glass-card rounded-2xl p-7 border-l-2 ${b.border}`}>
                                <p className={`font-mono text-xs uppercase tracking-[0.25em] mb-3 ${b.color}`}>{b.label}</p>
                                <p className="text-slate-300 leading-relaxed">{cs[b.key]}</p>
                            </div>
                        </Reveal>
                    ))}
                    {cs.results?.length > 0 && (
                        <Reveal>
                            <div className="glass-card glow-border rounded-2xl p-7">
                                <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-dd-cyan">Outcomes</p>
                                    {cs.isDemoProject && <DemoBadge label="DEMO OUTCOMES" />}
                                </div>
                                <ul className="flex flex-col gap-3">
                                    {cs.results.map((r) => (
                                        <li key={r} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-300">
                                            <DdIcon name="TrendingUp" className="w-4 h-4 text-dd-wa shrink-0 mt-1" /> {r}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-5 text-xs text-slate-500">Results shown are illustrative for this demo project. We never promise guaranteed outcomes — we build measurable systems.</p>
                            </div>
                        </Reveal>
                    )}
                    <Reveal className="flex flex-wrap gap-4 pt-2">
                        <GlowButton
                            variant="primary"
                            testId="case-study-cta"
                            onClick={() => {
                                track("cta_click", `case_study_${cs.slug}`);
                                document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Build Something Like This
                        </GlowButton>
                        <GlowButton variant="whatsapp" href={whatsappUrl("default_message")} external testId="case-study-whatsapp" onClick={() => track("whatsapp_click", `case_study_${cs.slug}`)}>
                            <DdIcon name="MessageCircle" className="w-4 h-4" /> Chat on WhatsApp
                        </GlowButton>
                    </Reveal>
                </div>
            </section>
            <LeadFormSection source={`case-study-${cs.slug}`} />
        </>
    );
}
