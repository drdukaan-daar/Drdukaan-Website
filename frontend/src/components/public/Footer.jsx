import React from "react";
import { Link } from "react-router-dom";
import { DdIcon } from "./kit";
import { useSite } from "@/context/SiteContext";

export default function Footer() {
    const { settings, services, industries, whatsappUrl, track, t, tw } = useSite();
    const contact = settings?.contact || {};
    const wa = settings?.whatsapp || {};
    const year = new Date().getFullYear();
    const social = contact.social || {};
    const socials = [
        { key: "instagram", icon: "Instagram" },
        { key: "facebook", icon: "Facebook" },
        { key: "linkedin", icon: "Linkedin" },
        { key: "twitter", icon: "Twitter" },
        { key: "youtube", icon: "Youtube" },
    ].filter((s) => social[s.key]);

    return (
        <footer className="border-t border-white/5 bg-[#07080D]" data-testid="site-footer">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <Link to="/" className="flex items-center gap-2.5" data-testid="footer-logo">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-dd-cyan to-dd-blue font-display font-extrabold text-[#06222b] text-lg">D</span>
                        <span className="font-display font-bold text-lg">
                            {settings?.website?.brand_name || "Dr Dukaan"}
                            <span className="text-dd-cyan">.</span>
                        </span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{tw("footer_tagline", "Digital Growth Partner for Local Businesses.")}</p>
                    <div className="flex flex-col gap-2 text-sm text-slate-400">
                        {(contact.locations || []).map((loc) => (
                            <span key={loc} className="flex items-center gap-2">
                                <DdIcon name="MapPin" className="w-4 h-4 text-dd-cyan" /> {loc}
                            </span>
                        ))}
                        <a href={`mailto:${contact.email || "drdukaan@gmail.com"}`} className="flex items-center gap-2 hover:text-dd-cyan transition-colors" data-testid="footer-email-link">
                            <DdIcon name="Mail" className="w-4 h-4 text-dd-cyan" /> {contact.email || "drdukaan@gmail.com"}
                        </a>
                        <a
                            href={whatsappUrl("default_message")}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track("whatsapp_click", "footer")}
                            className="flex items-center gap-2 hover:text-dd-wa transition-colors"
                            data-testid="footer-whatsapp-link"
                        >
                            <DdIcon name="MessageCircle" className="w-4 h-4 text-dd-wa" /> {wa.display || "+91 9985510295"}
                        </a>
                    </div>
                    {socials.length > 0 && (
                        <div className="flex gap-3 pt-2">
                            {socials.map((s) => (
                                <a key={s.key} href={social[s.key]} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-white/10 text-slate-400 hover:text-dd-cyan hover:border-dd-cyan/50 transition-colors" aria-label={s.key} data-testid={`footer-social-${s.key}`}>
                                    <DdIcon name={s.icon} className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <FooterCol title={t("footer_services", "Services")} links={(services || []).slice(0, 7).map((s) => ({ label: s.name, to: `/services/${s.slug}` }))} testPrefix="footer-service" />
                <FooterCol title={t("footer_industries", "Industries")} links={(industries || []).slice(0, 7).map((i) => ({ label: i.name, to: `/industries/${i.slug}` }))} testPrefix="footer-industry" />
                <div className="flex flex-col gap-6">
                    <FooterCol
                        title={t("footer_company", "Company")}
                        links={[
                            { label: "About", to: "/about" },
                            { label: "How We Grow", to: "/process" },
                            { label: "Case Studies", to: "/case-studies" },
                            { label: "Blog", to: "/blog" },
                            { label: "Contact", to: "/contact" },
                        ]}
                        testPrefix="footer-company"
                    />
                    <FooterCol
                        title={t("footer_resources", "Resources")}
                        links={[
                            { label: "Pricing", to: "/pricing" },
                            { label: "FAQ", to: "/#faq" },
                            { label: "Privacy Policy", to: "/privacy-policy" },
                            { label: "Terms", to: "/terms" },
                            { label: "Cookie Policy", to: "/cookie-policy" },
                        ]}
                        testPrefix="footer-resource"
                    />
                </div>
            </div>
            <div className="border-t border-white/5">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="font-mono text-xs text-slate-500" data-testid="footer-copyright">
                        © {year} Dr Dukaan. {t("rights", "All Rights Reserved.")}
                    </p>
                    <p className="font-mono text-xs text-slate-600">Build. Launch. Market. Measure. Grow.</p>
                </div>
            </div>
        </footer>
    );
}

function FooterCol({ title, links, testPrefix }) {
    return (
        <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 mb-4">{title}</h3>
            <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                    <li key={l.label}>
                        <Link to={l.to} className="text-sm text-slate-400 hover:text-dd-cyan transition-colors" data-testid={`${testPrefix}-${l.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
