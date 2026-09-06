import React from "react";
import CrudPage from "@/components/admin/CrudPage";
import { DemoBadge } from "@/components/public/kit";

const SwitchBadge = ({ on, yes = "Visible", no = "Hidden" }) => (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${on ? "bg-dd-wa/15 text-dd-wa" : "bg-white/5 text-slate-500"}`}>
        {on ? yes : no}
    </span>
);

const seoFields = [
    { name: "seo_title", label: "SEO Title", full: true },
    { name: "seo_description", label: "SEO Description", type: "textarea", full: true },
];

export function ServicesAdmin() {
    return (
        <CrudPage
            title="Services" subtitle="Manage the 9 growth services shown across the site."
            endpoint="services" testPrefix="admin-services"
            labelOf={(i) => i.name}
            columns={[
                { key: "order", label: "#" },
                { key: "name", label: "Service" },
                { key: "cta", label: "CTA" },
                { key: "visible", label: "Status", render: (i) => <SwitchBadge on={i.visible} /> },
            ]}
            fields={[
                { name: "name", label: "Name", placeholder: "Website Development" },
                { name: "slug", label: "Slug", placeholder: "auto-generated" },
                { name: "icon", label: "Icon", type: "icon" },
                { name: "order", label: "Order", type: "number" },
                { name: "headline", label: "Headline", full: true },
                { name: "short_description", label: "Short Description", type: "textarea", full: true },
                { name: "long_description", label: "Long Description", type: "textarea", rows: 4, full: true },
                { name: "benefits", label: "Benefits (one per line)", type: "list" },
                { name: "cta", label: "CTA Text", placeholder: "Build My Website" },
                { name: "featured", label: "Featured", type: "switch" },
                { name: "visible", label: "Visible", type: "switch" },
                ...seoFields,
            ]}
            defaults={{ visible: true, order: 99, benefits: [], icon: "Sparkles" }}
        />
    );
}

export function IndustriesAdmin() {
    return (
        <CrudPage
            title="Industries" subtitle="Industry pages with problems, solutions and recommended services."
            endpoint="industries" testPrefix="admin-industries"
            labelOf={(i) => i.name}
            columns={[
                { key: "order", label: "#" },
                { key: "name", label: "Industry" },
                { key: "visible", label: "Status", render: (i) => <SwitchBadge on={i.visible} /> },
            ]}
            fields={[
                { name: "name", label: "Name" },
                { name: "slug", label: "Slug", placeholder: "auto-generated" },
                { name: "icon", label: "Icon", type: "icon" },
                { name: "order", label: "Order", type: "number" },
                { name: "description", label: "Description", type: "textarea", full: true },
                { name: "problem", label: "Common Problem", type: "textarea", full: true },
                { name: "solutions", label: "Solutions (one per line)", type: "list" },
                { name: "recommended_services", label: "Recommended Services (one per line)", type: "list" },
                { name: "benefits", label: "Expected Outcomes (one per line)", type: "list" },
                { name: "visible", label: "Visible", type: "switch" },
                ...seoFields,
            ]}
            defaults={{ visible: true, order: 99, solutions: [], recommended_services: [], benefits: [], icon: "Store" }}
        />
    );
}

export function CaseStudiesAdmin() {
    return (
        <CrudPage
            title="Case Studies" subtitle="Demo and real projects. Demo projects are always labelled on the site."
            endpoint="case-studies" testPrefix="admin-case-studies"
            labelOf={(i) => i.title}
            columns={[
                { key: "title", label: "Title" },
                { key: "industry", label: "Industry" },
                { key: "isDemoProject", label: "Type", render: (i) => (i.isDemoProject ? <DemoBadge label="DEMO" /> : <SwitchBadge on yes="REAL" no="REAL" />) },
                { key: "published", label: "Status", render: (i) => <SwitchBadge on={i.published} yes="Live" no="Draft" /> },
            ]}
            fields={[
                { name: "title", label: "Title" },
                { name: "slug", label: "Slug", placeholder: "auto-generated" },
                { name: "industry", label: "Industry" },
                { name: "order", label: "Order", type: "number" },
                { name: "challenge", label: "Challenge", type: "textarea", full: true },
                { name: "strategy", label: "Strategy", type: "textarea", full: true },
                { name: "solution", label: "Digital Solution", type: "textarea", full: true },
                { name: "marketing", label: "Marketing Approach", type: "textarea", full: true },
                { name: "tracking", label: "Tracking", type: "textarea", full: true },
                { name: "results", label: "Results (one per line)", type: "list" },
                { name: "featured_image", label: "Featured Image URL", full: true },
                { name: "isDemoProject", label: "Demo Project (labelled)", type: "switch" },
                { name: "featured", label: "Featured", type: "switch" },
                { name: "published", label: "Published", type: "switch" },
                ...seoFields,
            ]}
            defaults={{ isDemoProject: true, published: true, order: 99, results: [] }}
        />
    );
}

export function TestimonialsAdmin() {
    return (
        <CrudPage
            title="Testimonials" subtitle="Client testimonials. Demo testimonials are labelled on the site."
            endpoint="testimonials" testPrefix="admin-testimonials"
            labelOf={(i) => i.name}
            columns={[
                { key: "name", label: "Name" },
                { key: "business", label: "Business" },
                { key: "rating", label: "Rating" },
                { key: "isDemo", label: "Type", render: (i) => (i.isDemo ? <DemoBadge label="DEMO" /> : <SwitchBadge on yes="REAL" no="REAL" />) },
                { key: "published", label: "Status", render: (i) => <SwitchBadge on={i.published} yes="Live" no="Hidden" /> },
            ]}
            fields={[
                { name: "name", label: "Name" },
                { name: "business", label: "Business" },
                { name: "role", label: "Role" },
                { name: "rating", label: "Rating (1-5)", type: "number" },
                { name: "photo", label: "Photo URL", full: true },
                { name: "testimonial", label: "Testimonial", type: "textarea", rows: 4, full: true },
                { name: "isDemo", label: "Demo Testimonial (labelled)", type: "switch" },
                { name: "published", label: "Published", type: "switch" },
            ]}
            defaults={{ isDemo: false, published: true, rating: 5 }}
        />
    );
}

export function PricingAdmin() {
    return (
        <CrudPage
            title="Pricing Plans" subtitle="Manage packages. Keep 'Get Quote' as the price to quote per business."
            endpoint="pricing-plans" testPrefix="admin-pricing"
            labelOf={(i) => i.name}
            columns={[
                { key: "order", label: "#" },
                { key: "name", label: "Plan" },
                { key: "price", label: "Price" },
                { key: "badge", label: "Badge", render: (i) => i.badge || "—" },
                { key: "visible", label: "Status", render: (i) => <SwitchBadge on={i.visible} /> },
            ]}
            fields={[
                { name: "name", label: "Plan Name" },
                { name: "slug", label: "Slug", placeholder: "auto-generated" },
                { name: "price", label: "Price (e.g. Get Quote)" },
                { name: "billing_type", label: "Billing Type" },
                { name: "description", label: "Description", type: "textarea", full: true },
                { name: "features", label: "Features (one per line)", type: "list" },
                { name: "badge", label: "Badge (e.g. Most Popular)" },
                { name: "cta", label: "CTA Text" },
                { name: "order", label: "Order", type: "number" },
                { name: "highlighted", label: "Highlighted", type: "switch" },
                { name: "visible", label: "Visible", type: "switch" },
            ]}
            defaults={{ visible: true, order: 99, features: [], cta: "Get Quote", price: "Get Quote" }}
        />
    );
}

export function FaqsAdmin() {
    return (
        <CrudPage
            title="FAQs" subtitle="Questions shown in the public FAQ section."
            endpoint="faqs" testPrefix="admin-faqs"
            labelOf={(i) => i.question}
            columns={[
                { key: "order", label: "#" },
                { key: "question", label: "Question", render: (i) => i.question.slice(0, 70) },
                { key: "visible", label: "Status", render: (i) => <SwitchBadge on={i.visible} /> },
            ]}
            fields={[
                { name: "question", label: "Question", full: true },
                { name: "answer", label: "Answer", type: "textarea", rows: 4, full: true },
                { name: "order", label: "Order", type: "number" },
                { name: "visible", label: "Visible", type: "switch" },
            ]}
            defaults={{ visible: true, order: 99 }}
        />
    );
}

export function BlogAdmin() {
    return (
        <CrudPage
            title="Blog" subtitle="Articles published at /blog."
            endpoint="blog-posts" testPrefix="admin-blog"
            labelOf={(i) => i.title}
            columns={[
                { key: "title", label: "Title", render: (i) => i.title.slice(0, 50) },
                { key: "category", label: "Category" },
                { key: "author", label: "Author" },
                { key: "published", label: "Status", render: (i) => <SwitchBadge on={i.published} yes="Live" no="Draft" /> },
            ]}
            fields={[
                { name: "title", label: "Title" },
                { name: "slug", label: "Slug", placeholder: "auto-generated" },
                { name: "category", label: "Category" },
                { name: "author", label: "Author" },
                { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
                { name: "content", label: "Content", type: "textarea", rows: 10, full: true },
                { name: "featured_image", label: "Featured Image URL", full: true },
                { name: "published", label: "Published", type: "switch" },
                ...seoFields,
            ]}
            defaults={{ published: false, author: "Dr Dukaan Team" }}
        />
    );
}

const CLIENT_STATUSES = ["Onboarding", "Active", "Paused", "Completed"];

export function ClientsAdmin() {
    return (
        <CrudPage
            title="Clients" subtitle="Your client accounts. A client portal can be added on this foundation later."
            endpoint="clients" testPrefix="admin-clients"
            labelOf={(i) => i.business_name}
            columns={[
                { key: "business_name", label: "Business" },
                { key: "contact_name", label: "Contact" },
                { key: "phone", label: "Phone" },
                {
                    key: "status", label: "Status",
                    render: (i) => (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                            i.status === "Active" ? "bg-dd-wa/15 text-dd-wa" : i.status === "Onboarding" ? "bg-dd-cyan/15 text-dd-cyan" : i.status === "Paused" ? "bg-amber-400/15 text-amber-300" : "bg-white/5 text-slate-400"
                        }`}>{i.status}</span>
                    ),
                },
                { key: "renewal_date", label: "Renewal", render: (i) => i.renewal_date || "—" },
            ]}
            fields={[
                { name: "business_name", label: "Business Name" },
                { name: "contact_name", label: "Owner / Contact Name" },
                { name: "phone", label: "Phone" },
                { name: "email", label: "Email" },
                { name: "business_type", label: "Business Type" },
                { name: "website", label: "Website" },
                { name: "services", label: "Services (one per line)", type: "list" },
                { name: "start_date", label: "Start Date", type: "date" },
                { name: "renewal_date", label: "Renewal Date", type: "date" },
                { name: "status", label: "Status", type: "select", options: CLIENT_STATUSES },
                { name: "notes", label: "Notes", type: "textarea", rows: 3, full: true },
            ]}
            defaults={{ status: "Onboarding", services: [] }}
        />
    );
}
