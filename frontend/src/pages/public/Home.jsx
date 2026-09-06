import React from "react";
import Hero from "@/components/public/Hero";
import { Marquee } from "@/components/public/kit";
import { TrustServices, GrowthSystem, Journey } from "@/components/public/Sections1";
import { IndustriesSelector, Ecosystem, AnalyticsShowcase } from "@/components/public/Sections2";
import { CaseStudiesSection, TestimonialsSection, PricingSection, FaqSection, LeadFormSection, ContactSection, FinalCta } from "@/components/public/Sections3";
import { useMeta } from "@/lib/useMeta";
import { useSite } from "@/context/SiteContext";

const MARQUEE_ITEMS = [
    "Websites That Convert", "Local SEO", "Google Ads", "Meta Ads", "WhatsApp Commerce",
    "E-Commerce Stores", "Mobile Apps", "GA4 Analytics", "Lead Generation", "Brand Identity",
];

export default function HomePage() {
    const { settings } = useSite();
    const seo = settings?.seo || {};
    useMeta(
        seo.home_title || "Dr Dukaan — Digital Growth Partner for Local Businesses",
        seo.home_description || "We take local businesses online and help them grow."
    );
    return (
        <>
            <Hero />
            <Marquee items={MARQUEE_ITEMS} />
            <TrustServices />
            <GrowthSystem />
            <Journey />
            <IndustriesSelector />
            <Ecosystem />
            <AnalyticsShowcase />
            <CaseStudiesSection />
            <TestimonialsSection />
            <PricingSection />
            <LeadFormSection />
            <FaqSection />
            <ContactSection />
            <FinalCta />
        </>
    );
}
