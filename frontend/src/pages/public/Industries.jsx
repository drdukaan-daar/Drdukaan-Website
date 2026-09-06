import React from "react";
import { Link, useParams } from "react-router-dom";
import { DdIcon, Reveal, GlowButton } from "@/components/public/kit";
import { PageHero } from "./Services";
import { LeadFormSection } from "@/components/public/Sections3";
import { useSite } from "@/context/SiteContext";
import { useMeta } from "@/lib/useMeta";

export function IndustriesPage() {
    const { industries } = useSite();
    useMeta("Industries We Serve | Dr Dukaan", "Digital growth systems for gyms, hospitals, retail, wholesale, restaurants, education, salons, real estate, automotive and local services.");
    return (
        <>
            <PageHero
                eyebrow="Industries"
                title="We Speak Your Business's Language."
                sub="Different businesses need different growth systems. Find yours."
                testId="industries-page-hero"
            />
            <section className="pb-24 sm:pb-32">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(industries || []).map((ind, i) => (
                        <Reveal key={ind.id || ind.slug} delay={(i % 3) * 0.08}>
                            <Link
                                to={`/industries/${ind.slug}`}
                                className="group block h-full rounded-2xl glass-card p-7 transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-dd-cyan/30"
                                data-testid={`industry-card-${ind.slug}`}
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-dd-cyan/15 to-dd-violet/15 border border-white/10 text-dd-cyan transition-transform duration-300 group-hover:scale-110">
                                    <DdIcon name={ind.icon} className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-xl font-semibold mb-2">{ind.name}</h2>
                                <p className="text-sm text-slate-400 leading-relaxed">{ind.description}</p>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>
            <LeadFormSection source="industries-page" />
        </>
    );
}

export function IndustryDetailPage() {
    const { slug } = useParams();
    const { industries, whatsappUrl, track, loaded } = useSite();
    const industry = (industries || []).find((i) => i.slug === slug);
    useMeta(`${industry?.name || "Industry"} | Dr Dukaan`, industry?.description || "");

    if (loaded && !industry) {
        return <PageHero eyebrow="Industries" title="Industry not found." sub="This industry page doesn't exist or has been moved." testId="industry-not-found" />;
    }
    if (!industry) return <div className="min-h-screen" />;

    return (
        <>
            <section className="relative pt-36 pb-16 overflow-hidden grid-bg" data-testid="industry-detail-hero">
                <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[560px] rounded-full bg-dd-violet/10 blur-[130px]" />
                <div className="relative mx-auto max-w-5xl px-5 sm:px-8 flex flex-col gap-7">
                    <Reveal>
                        <Link to="/industries" className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 hover:text-dd-cyan transition-colors">
                            ← All Industries
                        </Link>
                    </Reveal>
                    <Reveal delay={0.05}>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-dd-cyan/15 to-dd-violet/15 border border-white/10 text-dd-cyan">
                            <DdIcon name={industry.icon} className="w-7 h-7" />
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">{industry.name}</h1>
                    </Reveal>
                    <Reveal delay={0.18}>
                        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">{industry.description}</p>
                    </Reveal>
                </div>
            </section>

            <section className="pb-24">
                <div className="mx-auto max-w-5xl px-5 sm:px-8 flex flex-col gap-8">
                    <Reveal>
                        <div className="glass-card rounded-3xl p-7 sm:p-10 border-l-2 border-l-rose-400/60">
                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-rose-400 mb-3">The Common Problem</p>
                            <p className="text-slate-300 leading-relaxed">{industry.problem}</p>
                        </div>
                    </Reveal>
                    <Reveal>
                        <div className="glass-card rounded-3xl p-7 sm:p-10">
                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-dd-cyan mb-5">The Digital Solution</p>
                            <div className="flex flex-wrap gap-2.5">
                                {(industry.solutions || []).map((s) => (
                                    <span key={s} className="rounded-full border border-dd-cyan/25 bg-dd-cyan/[0.06] px-4 py-2 text-sm text-slate-200">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Reveal>
                            <div className="glass-card rounded-3xl p-7 h-full">
                                <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 mb-4">Recommended Services</p>
                                <ul className="flex flex-col gap-3">
                                    {(industry.recommended_services || []).map((r) => (
                                        <li key={r} className="flex items-center gap-2.5 text-sm text-slate-300">
                                            <DdIcon name="Check" className="w-4 h-4 text-dd-cyan shrink-0" /> {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <div className="glass-card rounded-3xl p-7 h-full">
                                <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 mb-4">Expected Outcomes</p>
                                <ul className="flex flex-col gap-3">
                                    {(industry.benefits || []).map((b) => (
                                        <li key={b} className="flex items-center gap-2.5 text-sm text-slate-300">
                                            <DdIcon name="TrendingUp" className="w-4 h-4 text-dd-wa shrink-0" /> {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    </div>
                    <Reveal className="flex flex-wrap gap-4">
                        <GlowButton
                            variant="primary"
                            testId="industry-detail-cta"
                            onClick={() => {
                                track("cta_click", `industry_${industry.slug}`);
                                document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Get My Growth Plan
                        </GlowButton>
                        <GlowButton variant="whatsapp" href={whatsappUrl("default_message")} external testId="industry-detail-whatsapp" onClick={() => track("whatsapp_click", `industry_${industry.slug}`)}>
                            <DdIcon name="MessageCircle" className="w-4 h-4" /> Discuss My Business
                        </GlowButton>
                    </Reveal>
                </div>
            </section>
            <LeadFormSection source={`industry-${industry.slug}`} />
        </>
    );
}
