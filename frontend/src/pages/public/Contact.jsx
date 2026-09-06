import React from "react";
import { PageHero } from "./Services";
import { ContactSection, LeadFormSection } from "@/components/public/Sections3";
import { useMeta } from "@/lib/useMeta";

export default function ContactPage() {
    useMeta("Contact | Dr Dukaan", "Talk to Dr Dukaan — WhatsApp +91 9985510295 or email drdukaan@gmail.com. Hyderabad & Kurnool, serving businesses across India.");
    return (
        <>
            <PageHero
                eyebrow="Contact"
                title="Let's Talk About Your Business."
                sub="WhatsApp us, email us, or fill the form — whichever is easiest for you."
                testId="contact-page-hero"
            />
            <div className="-mt-10">
                <ContactSection />
            </div>
            <LeadFormSection source="contact-page" />
        </>
    );
}
