import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DdIcon } from "@/components/public/kit";
import { api, formatApiError } from "@/lib/api";
import { toast } from "sonner";

const STATUS_COLORS = { New: "#00F0FF", Contacted: "#0066FF", Qualified: "#8B5CF6", "Proposal Sent": "#F59E0B", Won: "#25D366", Lost: "#64748B" };

export function StatCard({ label, value, icon, accent = "#00F0FF", testId }) {
    return (
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex items-center gap-4" data-testid={testId}>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border shrink-0" style={{ background: `${accent}14`, borderColor: `${accent}44`, color: accent }}>
                <DdIcon name={icon} className="w-5 h-5" />
            </span>
            <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="font-display text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
}

export function ChartTip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-white/10 bg-[#12141F] px-3 py-2 text-xs shadow-xl">
            {label && <p className="font-mono text-slate-400 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || p.payload?.fill || p.stroke }} className="font-medium">
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="dashboard-loading">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-white/[0.03] animate-pulse" />
                ))}
            </div>
        );
    if (!data) return <p className="text-slate-500" data-testid="dashboard-error">Could not load dashboard data.</p>;

    const s = data.stats;

    return (
        <div className="flex flex-col gap-6" data-testid="admin-dashboard">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-slate-400 mt-1">Your growth platform at a glance.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="New Leads" value={s.new_leads} icon="Users" testId="stat-new-leads" />
                <StatCard label="Total Leads" value={s.total_leads} icon="Database" accent="#0066FF" testId="stat-total-leads" />
                <StatCard label="Active Clients" value={s.active_clients} icon="Briefcase" accent="#8B5CF6" testId="stat-active-clients" />
                <StatCard label="Leads This Month" value={s.monthly_leads} icon="TrendingUp" accent="#25D366" testId="stat-monthly-leads" />
                <StatCard label="Conversion Rate" value={`${s.conversion_rate}%`} icon="Target" accent="#F59E0B" testId="stat-conversion-rate" />
                <StatCard label="CTA Clicks" value={s.cta_clicks} icon="LineChart" testId="stat-cta-clicks" />
                <StatCard label="WhatsApp Clicks" value={s.whatsapp_clicks} icon="MessageCircle" accent="#25D366" testId="stat-whatsapp-clicks" />
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Leads — Last 30 Days</p>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.leads_over_time} margin={{ top: 5, right: 8, bottom: 0, left: -24 }}>
                                <defs>
                                    <linearGradient id="alg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#00F0FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<ChartTip />} />
                                <Area type="monotone" dataKey="leads" stroke="#00F0FF" strokeWidth={2} fill="url(#alg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Lead Status</p>
                    {data.lead_status.length === 0 ? (
                        <p className="text-slate-600 text-sm py-16 text-center">No leads yet — submit the public quote form to see data.</p>
                    ) : (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={data.lead_status} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3} stroke="none">
                                        {data.lead_status.map((d) => (
                                            <Cell key={d.name} fill={STATUS_COLORS[d.name] || "#64748B"} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Service Interest</p>
                    {data.service_interest.length === 0 ? (
                        <p className="text-slate-600 text-sm py-12 text-center">No service interest data yet.</p>
                    ) : (
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.service_interest} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 8 }}>
                                    <XAxis type="number" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<ChartTip />} />
                                    <Bar dataKey="value" fill="#0066FF" radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Recent Leads</p>
                    {data.recent_leads.length === 0 ? (
                        <p className="text-slate-600 text-sm py-12 text-center" data-testid="dashboard-no-leads">No leads yet. Share your site and watch this fill up.</p>
                    ) : (
                        <ul className="flex flex-col divide-y divide-white/5">
                            {data.recent_leads.map((l) => (
                                <li key={l.id}>
                                    <Link to={`/admin/leads/${l.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:bg-white/[0.03] rounded-lg px-2 transition-colors" data-testid={`recent-lead-${l.id}`}>
                                        <div className="min-w-0">
                                            <p className="text-sm text-white truncate">{l.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{l.business_name || l.business_type || "—"}</p>
                                        </div>
                                        <span className="font-mono text-[10px] uppercase tracking-wider shrink-0" style={{ color: STATUS_COLORS[l.status] || "#64748B" }}>
                                            {l.status}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
