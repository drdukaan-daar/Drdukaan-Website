import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { ChartTip } from "./Dashboard";
import { LEAD_STATUSES, STATUS_COLORS } from "./Leads";

export default function ReportsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/dashboard")
            .then((res) => setData(res.data))
            .catch((e) => toast.error(formatApiError(e)))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="grid lg:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-64 rounded-2xl bg-white/[0.03] animate-pulse" />
                ))}
            </div>
        );
    if (!data) return <p className="text-slate-500">Could not load reports.</p>;

    const statusMap = Object.fromEntries((data.lead_status || []).map((s) => [s.name, s.value]));
    const funnel = LEAD_STATUSES.map((s) => ({ stage: s, value: statusMap[s] || 0 }));
    const maxFunnel = Math.max(...funnel.map((f) => f.value), 1);

    return (
        <div className="flex flex-col gap-6" data-testid="admin-reports-page">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Reports</h1>
                <p className="text-sm text-slate-400 mt-1">Lead performance and pipeline health. Charts populate as real leads arrive.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Lead Velocity — 30 Days</p>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.leads_over_time} margin={{ top: 5, right: 8, bottom: 0, left: -24 }}>
                                <defs>
                                    <linearGradient id="rlg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<ChartTip />} />
                                <Area type="monotone" dataKey="leads" stroke="#8B5CF6" strokeWidth={2} fill="url(#rlg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Pipeline Funnel</p>
                    <div className="flex flex-col gap-3 py-2">
                        {funnel.map((f, i) => (
                            <div key={f.stage} className="flex items-center gap-3">
                                <span className="w-28 text-xs text-slate-400 shrink-0">{f.stage}</span>
                                <div className="flex-1 h-6 rounded-md bg-white/[0.04] overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(f.value / maxFunnel) * 100}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.08 }}
                                        className="h-full rounded-md"
                                        style={{ background: STATUS_COLORS[f.stage] }}
                                    />
                                </div>
                                <span className="font-mono text-xs text-slate-300 w-8 text-right">{f.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Service Interest</p>
                    {data.service_interest.length === 0 ? (
                        <p className="text-slate-600 text-sm py-16 text-center">No data yet.</p>
                    ) : (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.service_interest} margin={{ top: 5, right: 8, bottom: 40, left: -24 }}>
                                    <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 9, angle: -35, textAnchor: "end" }} axisLine={false} tickLine={false} interval={0} />
                                    <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<ChartTip />} />
                                    <Bar dataKey="value" fill="#00F0FF" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Business Categories</p>
                    {data.business_categories.length === 0 ? (
                        <p className="text-slate-600 text-sm py-16 text-center">No data yet.</p>
                    ) : (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.business_categories} margin={{ top: 5, right: 8, bottom: 40, left: -24 }}>
                                    <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 9, angle: -35, textAnchor: "end" }} axisLine={false} tickLine={false} interval={0} />
                                    <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<ChartTip />} />
                                    <Bar dataKey="value" fill="#25D366" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            <p className="rounded-xl border border-dd-cyan/20 bg-dd-cyan/[0.05] px-4 py-3 text-xs text-slate-300 max-w-3xl">
                Automated monthly client reports, Google Ads and Meta Ads API connections are architected as future modules — this reports foundation is built to extend into them.
            </p>
        </div>
    );
}
