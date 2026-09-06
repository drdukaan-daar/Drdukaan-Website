import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DdIcon, Reveal, SectionHeading, GlowButton, DemoBadge } from "./kit";
import { useSite } from "@/context/SiteContext";

// ---------------- Industries ----------------

export function IndustriesSelector() {
    const { industries, track, t } = useSite();
    const [active, setActive] = useState(0);
    const current = industries?.[active];

    return (
        <section className="relative py-24 sm:py-32 bg-dd-surface/30" data-testid="industries-section">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col gap-12">
                <SectionHeading
                    num={4}
                    chapter="Industries"
                    title={t("industries_title", "Built for Businesses Like Yours.")}
                    sub={t("industries_sub", "Select your industry and see exactly how we solve its digital problems.")}
                />
                <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-8">
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2" role="tablist" aria-label="Industries">
                        {(industries || []).map((ind, i) => (
                            <button
                                key={ind.slug}
                                role="tab"
                                aria-selected={active === i}
                                onClick={() => setActive(i)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-[background-color,border-color,transform] duration-300 border ${
                                    active === i
                                        ? "bg-dd-cyan/[0.08] border-dd-cyan/40 text-white"
                                        : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:border-white/15"
                                }`}
                                data-testid={`industry-selector-tab-${ind.slug}`}
                            >
                                <DdIcon name={ind.icon} className={`w-5 h-5 shrink-0 ${active === i ? "text-dd-cyan" : "text-slate-500"}`} />
                                <span className="font-display font-medium text-sm">{ind.name}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {current && (
                            <motion.div
                                key={current.slug}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="glass-card glow-border rounded-2xl p-7 sm:p-9 flex flex-col gap-7"
                                data-testid="industry-panel"
                            >
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-rose-400 mb-2">{t("ind_problem", "The Problem")}</p>
                                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{current.problem}</p>
                                </div>
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-dd-cyan mb-3">{t("ind_solution", "The Digital Solution")}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(current.solutions || []).map((s) => (
                                            <span key={s} className="rounded-full border border-dd-cyan/25 bg-dd-cyan/[0.06] px-3.5 py-1.5 text-xs sm:text-sm text-slate-200">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-3">Recommended Services</p>
                                        <ul className="flex flex-col gap-2">
                                            {(current.recommended_services || []).map((r) => (
                                                <li key={r} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <DdIcon name="Check" className="w-4 h-4 text-dd-cyan shrink-0" /> {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-3">Expected Outcomes</p>
                                        <ul className="flex flex-col gap-2">
                                            {(current.benefits || []).map((b) => (
                                                <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <DdIcon name="TrendingUp" className="w-4 h-4 text-dd-wa shrink-0" /> {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <GlowButton to={`/industries/${current.slug}`} variant="ghost" testId="industry-panel-cta" onClick={() => track("cta_click", `industry_${current.slug}`)}>
                                        {t("ind_panel_cta", "See what we can build for your business")} <DdIcon name="ArrowRight" className="w-4 h-4" />
                                    </GlowButton>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

// ---------------- Ecosystem ----------------

const ECO_NODES = ["Website", "Google", "SEO", "Ads", "WhatsApp", "App", "E-Commerce", "Analytics", "Leads", "Customers"];
const ECO_COLORS = ["#00F0FF", "#0066FF", "#8B5CF6", "#0066FF", "#25D366", "#8B5CF6", "#00F0FF", "#00F0FF", "#25D366", "#0066FF"];

export function Ecosystem() {
    const { t } = useSite();
    const nodes = useMemo(
        () =>
            ECO_NODES.map((label, i) => {
                const angle = (i / ECO_NODES.length) * Math.PI * 2 - Math.PI / 2;
                return { label, color: ECO_COLORS[i], x: 50 + Math.cos(angle) * 38, y: 50 + Math.sin(angle) * 38 };
            }),
        []
    );

    return (
        <section className="relative py-24 sm:py-32 overflow-hidden" data-testid="ecosystem-section">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
            <div className="relative mx-auto max-w-6xl px-5 sm:px-8 flex flex-col items-center gap-14">
                <SectionHeading
                    align="center"
                    num={5}
                    chapter="The System"
                    title={t("ecosystem_title", "One Business. One Connected Ecosystem.")}
                    sub={t("ecosystem_sub", "Every channel connected. Every enquiry tracked. Every decision backed by data.")}
                />
                <div className="relative w-full max-w-3xl aspect-square sm:aspect-[16/10]">
                    <svg viewBox="0 0 100 62" className="absolute inset-0 w-full h-full" aria-hidden="true">
                        {nodes.map((n, i) => (
                            <motion.line
                                key={n.label}
                                x1="50" y1="31" x2={n.x} y2={n.y * 0.62}
                                stroke={n.color} strokeOpacity="0.4" strokeWidth="0.25" className="flow-line"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.9, delay: i * 0.12 }}
                            />
                        ))}
                    </svg>
                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 120, damping: 14 }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-28 w-28 sm:h-36 sm:w-36 flex-col items-center justify-center rounded-full bg-gradient-to-br from-dd-cyan to-dd-blue text-center shadow-[0_0_60px_rgba(0,240,255,0.35)]"
                        data-testid="ecosystem-center"
                    >
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#06222b]/70">Your</span>
                        <span className="font-display font-extrabold text-[#06222b] text-sm sm:text-base leading-tight">BUSINESS</span>
                    </motion.div>
                    {nodes.map((n, i) => (
                        <motion.div
                            key={n.label}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 160, damping: 14 }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                            style={{ left: `${n.x}%`, top: `${n.y * 0.62 + 19}%` }}
                        >
                            <span
                                className="float-slow inline-block rounded-full px-3 py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-[0.14em] whitespace-nowrap"
                                style={{ color: n.color, border: `1px solid ${n.color}55`, background: "rgba(9,10,15,0.8)", animationDelay: `${i * 0.35}s` }}
                            >
                                {n.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
                <Reveal>
                    <p className="font-display text-xl sm:text-2xl font-semibold text-slate-200 text-center" data-testid="ecosystem-tagline">
                        {t("ecosystem_tagline_a", "All connected.")} <span className="text-dd-cyan">{t("ecosystem_tagline_b", "All measurable.")}</span> {t("ecosystem_tagline_c", "Built for growth.")}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

// ---------------- Analytics Showcase ----------------

const TRAFFIC = [
    { m: "Jan", visitors: 420, leads: 18 }, { m: "Feb", visitors: 780, leads: 31 }, { m: "Mar", visitors: 1150, leads: 47 },
    { m: "Apr", visitors: 1620, leads: 66 }, { m: "May", visitors: 2380, leads: 92 }, { m: "Jun", visitors: 3150, leads: 128 },
];
const SOURCES = [
    { name: "Google Search", value: 42, color: "#00F0FF" },
    { name: "Google Ads", value: 24, color: "#0066FF" },
    { name: "Meta Ads", value: 18, color: "#8B5CF6" },
    { name: "Direct", value: 10, color: "#25D366" },
    { name: "Referral", value: 6, color: "#64748B" },
];
const FUNNEL = [
    { stage: "Visitors", value: 3150, pct: 100 },
    { stage: "Enquiries", value: 214, pct: 34 },
    { stage: "Qualified Leads", value: 128, pct: 20 },
    { stage: "Customers", value: 41, pct: 7 },
];
const METRICS = [
    { label: "Website Visitors", value: "3,150" }, { label: "Leads", value: "128" }, { label: "WhatsApp Enquiries", value: "64" },
    { label: "Calls", value: "37" }, { label: "Ad Reach", value: "48.2K" }, { label: "Ad Spend", value: "₹32,400" },
    { label: "Conversions", value: "41" }, { label: "Store Orders", value: "86" },
];
const INSIGHTS = [
    { q: "What happened?", a: "Traffic grew 2.4x this quarter and enquiries grew with it — the system is compounding." },
    { q: "What worked?", a: "Google Search and local SEO brought the highest-intent visitors. WhatsApp CTAs converted best." },
    { q: "What needs improvement?", a: "Landing page conversion on mobile and Meta ad creative fatigue in week 3–4." },
    { q: "What should we do next?", a: "Shift 15% of budget to top search campaigns, refresh creatives, and add a reviews engine." },
];

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-white/10 bg-dd-surface px-3 py-2 text-xs shadow-xl">
            <p className="font-mono text-slate-400 mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} style={{ color: p.color || p.stroke }} className="font-medium">
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    );
}

export function AnalyticsShowcase() {
    const { track, t } = useSite();
    return (
        <section className="relative py-24 sm:py-32 bg-dd-surface/30" data-testid="analytics-section">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col gap-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <SectionHeading
                        num={6}
                        chapter="Measurement"
                        title={t("analytics_title", "Stop Guessing. Start Measuring.")}
                        sub={t("analytics_sub", "Every digital growth decision should be backed by data. This is what your monthly growth dashboard looks like.")}
                    />
                    <DemoBadge label="DEMO DATA" />
                </div>

                <Reveal>
                    <div className="glass-card glow-border rounded-3xl p-5 sm:p-8 flex flex-col gap-6" data-testid="analytics-dashboard-preview">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-rose-500/70" />
                                <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                                <span className="h-3 w-3 rounded-full bg-dd-wa/70" />
                            </div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">growth.drdukaan.com — demo</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {METRICS.map((m, i) => (
                                <motion.div
                                    key={m.label}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
                                    data-testid={`metric-${m.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                >
                                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500 mb-1.5">{m.label}</p>
                                    <p className="font-display text-xl sm:text-2xl font-bold text-white">{m.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 rounded-xl border border-white/8 bg-white/[0.02] p-4">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">Traffic & Lead Trend</p>
                                <div className="h-52">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={TRAFFIC} margin={{ top: 5, right: 8, bottom: 0, left: -18 }}>
                                            <defs>
                                                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.35} />
                                                    <stop offset="100%" stopColor="#00F0FF" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                                                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="m" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Area type="monotone" dataKey="visitors" stroke="#00F0FF" strokeWidth={2} fill="url(#gv)" />
                                            <Area type="monotone" dataKey="leads" stroke="#8B5CF6" strokeWidth={2} fill="url(#gl)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">Traffic Sources</p>
                                <div className="h-40">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={SOURCES} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={3} stroke="none">
                                                {SOURCES.map((s) => (
                                                    <Cell key={s.name} fill={s.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<ChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                    {SOURCES.map((s) => (
                                        <span key={s.name} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} /> {s.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">Conversion Funnel</p>
                                <div className="flex flex-col gap-2.5">
                                    {FUNNEL.map((f) => (
                                        <div key={f.stage} className="flex items-center gap-3">
                                            <span className="w-28 sm:w-32 text-xs text-slate-400 shrink-0">{f.stage}</span>
                                            <div className="flex-1 h-7 rounded-md bg-white/[0.04] overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${f.pct}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                                    className="h-full rounded-md bg-gradient-to-r from-dd-cyan to-dd-blue"
                                                />
                                            </div>
                                            <span className="font-mono text-xs text-slate-300 w-12 text-right">{f.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">Campaign Performance</p>
                                <div className="h-44">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[{ c: "Search", leads: 52 }, { c: "Maps", leads: 21 }, { c: "Meta", leads: 38 }, { c: "Display", leads: 9 }, { c: "Remarket", leads: 8 }]} margin={{ top: 5, right: 8, bottom: 0, left: -22 }}>
                                            <XAxis dataKey="c" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <Cell key={i} fill={["#00F0FF", "#0066FF", "#8B5CF6", "#25D366", "#64748B"][i]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {INSIGHTS.map((ins, i) => (
                                <div key={ins.q} className="rounded-xl border border-dd-violet/20 bg-dd-violet/[0.05] p-4" data-testid={`insight-${i}`}>
                                    <p className="font-display font-semibold text-sm text-dd-violet mb-1.5">{ins.q}</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">{ins.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <Reveal className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                    <p className="text-slate-400 text-sm">Want to know what's actually working in your business?</p>
                    <GlowButton to="/services/analytics-reporting" variant="ghost" testId="analytics-cta" onClick={() => track("cta_click", "analytics_showcase")}>
                        Track My Growth <DdIcon name="ArrowRight" className="w-4 h-4" />
                    </GlowButton>
                </Reveal>
            </div>
        </section>
    );
}
