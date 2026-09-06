import React from "react";
import { PageHero } from "./Services";
import { PricingSection, FaqSection, LeadFormSection } from "@/components/public/Sections3";
import { useMeta } from "@/lib/useMeta";

export default function PricingPage() {
    useMeta("Pricing | Dr Dukaan", "Flexible digital growth packages — Starter, Growth and Scale. Get a quote built for your business goals.");
    return (
        <>
            <PageHero
                eyebrow="Pricing"
                title="Honest Packages. No Surprises."
                sub="Pick a starting point. We quote based on your goals, market and budget — never a one-size-fits-all rate card."
                testId="pricing-page-hero"
            />
            <div className="-mt-20">
                <PricingSection />
            </div>
            <LeadFormSection source="pricing-page" />
            <FaqSection />
        </>
    );
}
