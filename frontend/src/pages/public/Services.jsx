import React from "react";
import { Link, useParams } from "react-router-dom";
import { DdIcon, Reveal, GlowButton, SectionHeading } from "@/components/public/kit";
import { LeadFormSection } from "@/components/public/Sections3";
import { useSite } from "@/context/SiteContext";
import { useMeta } from "@/lib/useMeta";

export function PageHero({ eyebrow, title, sub, testId }) {
    return (
        <section className="relative pt-36 pb-16 sm:pb-20 overflow-hidden grid-bg" data-testid={testId}>
            <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-dd-blue/12 blur-[130px]" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 flex flex-col gap-5">
                {eyebrow && (
                    <Reveal>
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-dd-cyan">{eyebrow}</span>
                    </Reveal>
                )}
                <Reveal delay={0.08}>
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] max-w-3xl">{title}</h1>
                </Reveal>
                {sub && (
                    <Reveal delay={0.16}>
                        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">{sub}</p>
                    </Reveal>
                )}
            </div>
        </section>
    );
}

export function ServicesPage() {
    const { services, track } = useSite();
    useMeta("Services | Dr Dukaan", "Websites, apps, e-commerce, digital marketing, Google Ads, Meta Ads, SEO, branding and analytics for local businesses.");
    return (
        <>
            <PageHero
                eyebrow="Services"
                title="One Digital Partner. Everything You Need."
                sub="From your first website to full-scale growth campaigns — every service is built to bring you more customers."
                testId="services-page-hero"
            />
            <section className="pb-24 sm:pb-32">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(services || []).map((s, i) => (
                        <Reveal key={s.id || s.slug} delay={(i % 3) * 0.08}>
                            <Link
                                to={`/services/${s.slug}`}
                                onClick={() => track("service_interest", s.name)}
                                className="group block h-full rounded-2xl glass-card p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-dd-cyan/30"
                                data-testid={`services-page-card-${s.slug}`}
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-dd-cyan/15 to-dd-violet/15 border border-white/10 text-dd-cyan transition-transform duration-300 group-hover:scale-110">
                                    <DdIcon name={s.icon} className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-xl font-semibold mb-1">{s.name}</h2>
                                <p className="font-display text-sm text-dd-cyan/90 mb-3">{s.headline}</p>
                                <p className="text-sm text-slate-400 leading-relaxed mb-5">{s.short_description}</p>
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-dd-cyan">
                                    {s.cta} <DdIcon name="ArrowRight" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>
            <LeadFormSection source="services-page" />
        </>
    );
}

export function ServiceDetailPage() {
    const { slug } = useParams();
    const { services, whatsappUrl, track, loaded } = useSite();
    const service = (services || []).find((s) => s.slug === slug);
    useMeta(
        service?.seo_title || `${service?.name || "Service"} | Dr Dukaan`,
        service?.seo_description || service?.short_description || ""
    );

    if (loaded && !service) {
        return (
            <PageHero eyebrow="Services" title="Service not found." sub="The service you're looking for doesn't exist or has been moved." testId="service-not-found" />
        );
    }
    if (!service) return <div className="min-h-screen" />;

    return (
        <>
            <section className="relative pt-36 pb-16 overflow-hidden grid-bg" data-testid="service-detail-hero">
                <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[560px] rounded-full bg-dd-cyan/10 blur-[130px]" />
                <div className="relative mx-auto max-w-5xl px-5 sm:px-8 flex flex-col gap-7">
                    <Reveal>
                        <Link to="/services" className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 hover:text-dd-cyan transition-colors">
                            ← All Services
                        </Link>
                    </Reveal>
                    <Reveal delay={0.05}>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-dd-cyan/15 to-dd-violet/15 border border-white/10 text-dd-cyan">
                            <DdIcon name={service.icon} className="w-7 h-7" />
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] max-w-3xl">{service.headline || service.name}</h1>
                    </Reveal>
                    <Reveal delay={0.18}>
                        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">{service.long_description || service.short_description}</p>
                    </Reveal>
                    <Reveal delay={0.26} className="flex flex-wrap gap-4">
                        <GlowButton
                            variant="primary"
                            testId="service-detail-cta"
                            onClick={() => {
                                track("cta_click", `service_${service.slug}`);
                                document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            {service.cta || "Get Quote"}
                        </GlowButton>
                        <GlowButton variant="whatsapp" href={whatsappUrl("quote_message")} external testId="service-detail-whatsapp" onClick={() => track("whatsapp_click", `service_${service.slug}`)}>
                            <DdIcon name="MessageCircle" className="w-4 h-4" /> Chat on WhatsApp
                        </GlowButton>
                    </Reveal>
                </div>
            </section>
            <section className="pb-24">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <Reveal>
                        <div className="glass-card rounded-3xl p-7 sm:p-10">
                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-dd-cyan mb-6">What You Get</p>
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4" data-testid="service-benefits-list">
                                {(service.benefits || []).map((b) => (
                                    <div key={b} className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dd-cyan/10 border border-dd-cyan/30">
                                            <DdIcon name="Check" className="w-3.5 h-3.5 text-dd-cyan" />
                                        </span>
                                        <span className="text-sm sm:text-base text-slate-300">{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
            <LeadFormSection source={`service-${service.slug}`} />
        </>
    );
}
