import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { DdIcon } from "@/components/public/kit";
import { useAuth } from "@/context/AuthContext";

const NAV = [
    { section: "Overview" },
    { label: "Dashboard", to: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Leads", to: "/admin/leads", icon: "Users" },
    { label: "Clients", to: "/admin/clients", icon: "Briefcase" },
    { label: "Reports", to: "/admin/reports", icon: "LineChart" },
    { label: "Activity Logs", to: "/admin/activity-logs", icon: "Activity" },
    { section: "CMS" },
    { label: "Services", to: "/admin/services", icon: "Globe" },
    { label: "Industries", to: "/admin/industries", icon: "Store" },
    { label: "Case Studies", to: "/admin/case-studies", icon: "FileText" },
    { label: "Testimonials", to: "/admin/testimonials", icon: "MessageSquare" },
    { label: "Pricing", to: "/admin/pricing", icon: "Tag" },
    { label: "FAQs", to: "/admin/faqs", icon: "MessageCircle" },
    { label: "Blog", to: "/admin/blog", icon: "Newspaper" },
    { label: "Media", to: "/admin/media", icon: "Image" },
    { section: "Site" },
    { label: "Website Content", to: "/admin/content", icon: "Pencil" },
    { label: "SEO", to: "/admin/seo", icon: "Search" },
    { label: "Analytics", to: "/admin/analytics", icon: "BarChart3" },
    { label: "WhatsApp", to: "/admin/whatsapp", icon: "MessageCircle" },
    { label: "Contact Settings", to: "/admin/contact-settings", icon: "Phone" },
    { label: "Site Settings", to: "/admin/settings", icon: "Settings" },
];

export default function AdminLayout() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const doLogout = () => {
        logout();
        navigate("/admin/login");
    };

    const sidebar = (
        <div className="flex h-full flex-col bg-[#0B0D14] border-r border-white/5">
            <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-dd-cyan to-dd-blue font-display font-extrabold text-[#06222b]">D</span>
                <div>
                    <p className="font-display font-bold text-sm text-white leading-none">Dr Dukaan</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 mt-0.5">Admin</p>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5" aria-label="Admin navigation">
                {NAV.map((item, i) =>
                    item.section ? (
                        <p key={`s-${i}`} className="px-3 pt-4 pb-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600">
                            {item.section}
                        </p>
                    ) : (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                    isActive ? "bg-dd-cyan/10 text-dd-cyan" : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`
                            }
                            data-testid={`admin-sidebar-${item.label.toLowerCase().replace(/\s+/g, "-")}-link`}
                        >
                            <DdIcon name={item.icon} className="w-4 h-4 shrink-0" />
                            {item.label}
                        </NavLink>
                    )
                )}
            </nav>
            <div className="border-t border-white/5 p-4 flex flex-col gap-2">
                <Link to="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-dd-cyan transition-colors px-1" data-testid="admin-view-site-link">
                    <DdIcon name="ExternalLink" className="w-3.5 h-3.5" /> View public site
                </Link>
                <button onClick={doLogout} className="flex items-center gap-2 text-xs text-slate-500 hover:text-rose-400 transition-colors px-1" data-testid="admin-logout-button">
                    <DdIcon name="LogOut" className="w-3.5 h-3.5" /> Sign out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0F1118] flex" data-testid="admin-layout">
            <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0">{sidebar}</aside>
            {open && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 w-64">{sidebar}</aside>
                </div>
            )}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 h-16 bg-[#0F1118]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5 sm:px-8">
                    <button className="lg:hidden p-2 text-slate-300" onClick={() => setOpen(true)} aria-label="Open admin menu" data-testid="admin-mobile-menu-toggle">
                        <DdIcon name="Menu" className="w-5 h-5" />
                    </button>
                    <div className="hidden lg:block" />
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-xs text-slate-400" data-testid="admin-user-email">{admin?.email}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dd-violet/20 border border-dd-violet/40 font-display font-bold text-xs text-dd-violet">
                            {(admin?.name || "A").slice(0, 1).toUpperCase()}
                        </span>
                    </div>
                </header>
                <main className="flex-1 p-5 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
