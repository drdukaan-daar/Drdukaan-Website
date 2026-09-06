import React from "react";
import { PageHero } from "./Services";
import { GrowthSystem, Journey } from "@/components/public/Sections1";
import { Ecosystem } from "@/components/public/Sections2";
import { LeadFormSection } from "@/components/public/Sections3";
import { useMeta } from "@/lib/useMeta";

export default function ProcessPage() {
    useMeta("How We Grow Your Business | Dr Dukaan", "Our 8-step digital growth journey: Discover, Plan, Build, Launch, Attract, Measure, Optimize, Grow.");
    return (
        <>
            <PageHero
                eyebrow="How We Grow"
                title="A System, Not a One-Off Project."
                sub="Most agencies deliver a website and disappear. We build a growth system around your business and keep improving it."
                testId="process-page-hero"
            />
            <div className="-mt-16">
                <GrowthSystem />
                <Journey />
                <Ecosystem />
            </div>
            <LeadFormSection source="process-page" />
        </>
    );
}
