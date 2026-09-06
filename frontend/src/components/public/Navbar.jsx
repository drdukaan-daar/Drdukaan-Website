import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DdIcon } from "./kit";
import { useSite } from "@/context/SiteContext";

const LINKS = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Industries", to: "/industries" },
    { label: "How We Grow", to: "/process" },
    { label: "Case Studies", to: "/case-studies" },
    { label: "Pricing", to: "/pricing" },
    { label: "FAQ", to: "/#faq" },
    { label: "Contact", to: "/contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { whatsappUrl, track, settings } = useSite();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setOpen(false), [location.pathname, location.hash]);

    const goQuote = () => {
        track("cta_click", "navbar_get_quote");
        if (location.pathname === "/") {
            document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/#quote");
        }
    };

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
                scrolled ? "bg-[#090A0F]/85 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
            }`}
            data-testid="main-navbar"
        >
            <nav className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-[72px]" aria-label="Main navigation">
                <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo" aria-label="Dr Dukaan home">
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-dd-cyan to-dd-blue font-display font-extrabold text-[#06222b] text-lg">
                        D
                        <span className="absolute -inset-1 rounded-xl bg-dd-cyan/25 blur-md -z-10" />
                    </span>
                    <span className="font-display font-bold text-lg tracking-tight">
                        Dr Dukaan
                        <span className="text-dd-cyan">.</span>
                    </span>
                </Link>

                <div className="hidden lg:flex items-center gap-7">
                    {LINKS.map((l) =>
                        l.to.includes("#") ? (
                            <Link key={l.label} to={l.to} className="text-sm text-slate-300 hover:text-dd-cyan transition-colors duration-200" data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>
                                {l.label}
                            </Link>
                        ) : (
                            <NavLink
                                key={l.label}
                                to={l.to}
                                className={({ isActive }) =>
                                    `text-sm transition-colors duration-200 ${isActive ? "text-dd-cyan" : "text-slate-300 hover:text-dd-cyan"}`
                                }
                                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                                {l.label}
                            </NavLink>
                        )
                    )}
                </div>

                <div className="hidden lg:flex items-center gap-3">
                    <a
                        href={whatsappUrl("default_message")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("whatsapp_click", "navbar")}
                        className="flex items-center gap-2 text-sm text-slate-300 hover:text-dd-wa transition-colors"
                        data-testid="nav-whatsapp-link"
                        aria-label={`Chat on WhatsApp ${settings?.whatsapp?.display || ""}`}
                    >
                        <DdIcon name="MessageCircle" className="w-4 h-4" />
                        <span className="font-mono text-xs">{settings?.whatsapp?.display || "+91 9985510295"}</span>
                    </a>
                    <button
                        onClick={goQuote}
                        className="rounded-full bg-dd-cyan px-6 py-2.5 font-display font-semibold text-sm text-[#06222b] transition-[box-shadow,transform] duration-300 hover:shadow-[0_0_28px_rgba(0,240,255,0.45)] hover:-translate-y-0.5 active:scale-95"
                        data-testid="nav-get-quote-button"
                    >
                        Get Quote
                    </button>
                </div>

                <button
                    className="lg:hidden p-2.5 text-slate-200"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    data-testid="mobile-menu-toggle"
                >
                    <DdIcon name={open ? "X" : "Menu"} className="w-6 h-6" />
                </button>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden overflow-hidden bg-[#0B0D14]/97 backdrop-blur-2xl border-b border-white/8"
                        data-testid="mobile-menu"
                    >
                        <div className="px-6 py-6 flex flex-col gap-1">
                            {LINKS.map((l, i) => (
                                <motion.div key={l.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                                    <Link to={l.to} className="block py-3 font-display text-lg text-slate-200 hover:text-dd-cyan border-b border-white/5" data-testid={`mobile-nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>
                                        {l.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="flex gap-3 pt-5">
                                <button onClick={goQuote} className="flex-1 rounded-full bg-dd-cyan py-3.5 font-display font-semibold text-sm text-[#06222b]" data-testid="mobile-get-quote-button">
                                    Get Quote
                                </button>
                                <a
                                    href={whatsappUrl("default_message")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => track("whatsapp_click", "mobile_menu")}
                                    className="flex-1 rounded-full bg-dd-wa py-3.5 font-display font-semibold text-sm text-[#062b16] text-center"
                                    data-testid="mobile-whatsapp-button"
                                >
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
