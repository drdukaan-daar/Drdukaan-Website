import React from "react";
import { PageHero } from "./Services";
import { useMeta } from "@/lib/useMeta";
import { useSite } from "@/context/SiteContext";

function LegalLayout({ title, updated, children }) {
    return (
        <>
            <PageHero eyebrow="Legal" title={title} sub={`Last updated: ${updated}`} testId={`legal-${title.toLowerCase().replace(/\s+/g, "-")}`} />
            <section className="pb-24">
                <div className="mx-auto max-w-3xl px-5 sm:px-8 flex flex-col gap-8 text-slate-300 text-sm sm:text-base leading-relaxed">{children}</div>
            </section>
        </>
    );
}

function H({ children }) {
    return <h2 className="font-display text-xl font-bold text-white pt-2">{children}</h2>;
}

export function PrivacyPolicyPage() {
    const { settings } = useSite();
    const email = settings?.contact?.email || "drdukaan@gmail.com";
    useMeta("Privacy Policy | Dr Dukaan", "How Dr Dukaan collects, uses and protects your information.");
    return (
        <LegalLayout title="Privacy Policy" updated="January 2026">
            <p>Dr Dukaan ("we", "us") respects your privacy. This policy explains what information we collect through drdukaan.com and how we use it.</p>
            <H>What we collect</H>
            <p>When you submit an enquiry form or contact us, we collect the details you provide: your name, business name, phone number, WhatsApp number, email address, business type and message. We also collect basic, anonymized usage analytics (pages visited, button clicks) to improve the website.</p>
            <H>How we use it</H>
            <p>We use your information only to respond to your enquiry, prepare quotes and proposals, deliver services you ask for, and improve our website. We do not sell your information to anyone.</p>
            <H>Analytics</H>
            <p>We may use Google Analytics 4 to understand website usage. You can opt out using browser settings or Google's opt-out tools.</p>
            <H>Data security</H>
            <p>Your data is stored securely and access is restricted to the Dr Dukaan team. Enquiry data is retained only as long as needed to serve you.</p>
            <H>Contact</H>
            <p>For any privacy questions, email us at <a className="text-dd-cyan hover:underline" href={`mailto:${email}`}>{email}</a>.</p>
        </LegalLayout>
    );
}

export function TermsPage() {
    useMeta("Terms of Service | Dr Dukaan", "Terms governing the use of drdukaan.com and Dr Dukaan services.");
    return (
        <LegalLayout title="Terms of Service" updated="January 2026">
            <p>By using drdukaan.com or engaging Dr Dukaan for services, you agree to these terms.</p>
            <H>Services</H>
            <p>Dr Dukaan provides digital services including website development, app development, e-commerce, digital marketing, advertising management, SEO, branding and analytics. Specific scope, timelines and pricing are agreed per project or engagement in writing.</p>
            <H>No guaranteed outcomes</H>
            <p>We build measurable growth systems and report honestly, but we do not guarantee specific rankings, lead volumes or revenue outcomes. Case studies labelled "Demo Project" are illustrative examples, not client results.</p>
            <H>Quotes and payment</H>
            <p>Quotes are provided after understanding your requirements. Payment terms are defined in individual proposals.</p>
            <H>Website content</H>
            <p>Content on this website is for general information and may be updated at any time.</p>
        </LegalLayout>
    );
}

export function CookiePolicyPage() {
    useMeta("Cookie Policy | Dr Dukaan", "How drdukaan.com uses cookies and similar technologies.");
    return (
        <LegalLayout title="Cookie Policy" updated="January 2026">
            <p>This website uses a minimal set of cookies and similar technologies.</p>
            <H>What we use</H>
            <p>Analytics cookies (such as Google Analytics 4, when enabled) help us understand how visitors use the site so we can improve it. Our admin dashboard uses a secure token stored in your browser to keep you signed in — this is functional, not tracking.</p>
            <H>Your choices</H>
            <p>You can block or delete cookies through your browser settings. Blocking analytics cookies does not affect your ability to use the website.</p>
            <H>Updates</H>
            <p>We may update this policy as the site evolves. Changes will be posted on this page.</p>
        </LegalLayout>
    );
}
