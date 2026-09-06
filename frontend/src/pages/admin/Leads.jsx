import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { DdIcon } from "@/components/public/kit";
import { api, formatApiError } from "@/lib/api";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
export const STATUS_COLORS = { New: "#00F0FF", Contacted: "#0066FF", Qualified: "#8B5CF6", "Proposal Sent": "#F59E0B", Won: "#25D366", Lost: "#64748B" };

export function StatusPill({ status }) {
    const c = STATUS_COLORS[status] || "#64748B";
    return (
        <span className="inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider border" style={{ color: c, borderColor: `${c}55`, background: `${c}14` }}>
            {status}
        </span>
    );
}

function waLink(num, name) {
    const n = (num || "").replace(/\D/g, "");
    if (!n) return null;
    return `https://wa.me/${n.length === 10 ? "91" + n : n}?text=${encodeURIComponent(`Hi ${name || ""}, this is Dr Dukaan following up on your enquiry.`)}`;
}

export function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("newest");

    const load = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (status) params.set("status", status);
        params.set("sort", sort);
        api.get(`/admin/leads?${params.toString()}`)
            .then((res) => setLeads(res.data))
            .catch((e) => toast.error(formatApiError(e)))
            .finally(() => setLoading(false));
    }, [q, status, sort]);

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [load]);

    const del = async (id) => {
        if (!window.confirm("Delete this lead permanently?")) return;
        try {
            await api.delete(`/admin/leads/${id}`);
            toast.success("Lead deleted");
            load();
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    return (
        <div className="flex flex-col gap-6" data-testid="admin-leads-page">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">Leads</h1>
                    <p className="text-sm text-slate-400 mt-1">{leads.length} lead{leads.length === 1 ? "" : "s"}</p>
                </div>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search name, business, phone..."
                    aria-label="Search leads"
                    className="rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-dd-cyan/60 focus:outline-none w-56"
                    data-testid="lead-search-input"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setStatus("")} className={`rounded-full px-4 py-1.5 text-xs border transition-colors ${!status ? "border-dd-cyan/60 text-dd-cyan bg-dd-cyan/10" : "border-white/10 text-slate-400 hover:text-white"}`} data-testid="lead-filter-all">
                    All
                </button>
                {LEAD_STATUSES.map((s) => (
                    <button key={s} onClick={() => setStatus(status === s ? "" : s)} className={`rounded-full px-4 py-1.5 text-xs border transition-colors ${status === s ? "border-dd-cyan/60 text-dd-cyan bg-dd-cyan/10" : "border-white/10 text-slate-400 hover:text-white"}`} data-testid={`lead-filter-${s.toLowerCase().replace(/\s+/g, "-")}`}>
                        {s}
                    </button>
                ))}
                <button onClick={() => setSort(sort === "newest" ? "oldest" : "newest")} className="ml-auto flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs border border-white/10 text-slate-400 hover:text-white transition-colors" data-testid="lead-sort-toggle">
                    Date {sort === "newest" ? "↓" : "↑"}
                </button>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/8 text-left">
                                {["Name", "Business", "Phone", "Services", "Date", "Status", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="px-4 py-14 text-center text-slate-500"><DdIcon name="Loader2" className="w-5 h-5 animate-spin inline-block mr-2" />Loading leads...</td></tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-14 text-center text-slate-500" data-testid="leads-empty">No leads found. Leads from the website quote form appear here.</td></tr>
                            ) : (
                                leads.map((l) => {
                                    const wa = waLink(l.whatsapp || l.phone, l.name);
                                    return (
                                        <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors" data-testid={`lead-row-${l.id}`}>
                                            <td className="px-4 py-3.5">
                                                <Link to={`/admin/leads/${l.id}`} className="text-white font-medium hover:text-dd-cyan transition-colors" data-testid={`lead-open-${l.id}`}>
                                                    {l.name}
                                                </Link>
                                                {l.is_duplicate && <span className="ml-2 font-mono text-[9px] uppercase text-amber-400">dup</span>}
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-400">{l.business_name || l.business_type || "—"}</td>
                                            <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">{l.phone}</td>
                                            <td className="px-4 py-3.5 text-slate-400 text-xs">{(l.services || []).slice(0, 2).join(", ") || "—"}{(l.services || []).length > 2 ? ` +${l.services.length - 2}` : ""}</td>
                                            <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                                            <td className="px-4 py-3.5"><StatusPill status={l.status} /></td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex justify-end gap-1.5">
                                                    {wa && (
                                                        <a href={wa} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-dd-wa hover:bg-dd-wa/10 transition-colors" aria-label={`WhatsApp ${l.name}`} data-testid={`lead-whatsapp-${l.id}`}>
                                                            <DdIcon name="MessageCircle" className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <a href={`tel:${l.phone}`} className="p-2 rounded-lg text-slate-400 hover:text-dd-cyan hover:bg-dd-cyan/10 transition-colors" aria-label={`Call ${l.name}`} data-testid={`lead-call-${l.id}`}>
                                                        <DdIcon name="Phone" className="w-4 h-4" />
                                                    </a>
                                                    <button onClick={() => del(l.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors" aria-label={`Delete ${l.name}`} data-testid={`lead-delete-${l.id}`}>
                                                        <DdIcon name="Trash2" className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function LeadDetailPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");
    const [savingNote, setSavingNote] = useState(false);

    const load = useCallback(() => {
        api.get(`/admin/leads/${id}`)
            .then((res) => setData(res.data))
            .catch((e) => toast.error(formatApiError(e)))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(load, [load]);

    const setStatus = async (s) => {
        try {
            await api.patch(`/admin/leads/${id}`, { status: s });
            toast.success(`Status → ${s}`);
            load();
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    const addNote = async (e) => {
        e.preventDefault();
        if (!note.trim()) return;
        setSavingNote(true);
        try {
            await api.patch(`/admin/leads/${id}`, { note: note.trim() });
            setNote("");
            toast.success("Note added");
            load();
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setSavingNote(false);
        }
    };

    if (loading) return <div className="flex justify-center py-24"><DdIcon name="Loader2" className="w-7 h-7 animate-spin text-dd-cyan" /></div>;
    if (!data) return <p className="text-slate-500">Lead not found.</p>;

    const { lead, activity } = data;
    const wa = waLink(lead.whatsapp || lead.phone, lead.name);

    return (
        <div className="flex flex-col gap-6 max-w-5xl" data-testid="lead-detail-page">
            <Link to="/admin/leads" className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-dd-cyan transition-colors" data-testid="lead-detail-back">
                ← All Leads
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">{lead.name}</h1>
                    <p className="text-sm text-slate-400 mt-1">{lead.business_name || "—"} · {lead.business_type || "—"}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600 mt-1">
                        {new Date(lead.created_at).toLocaleString("en-IN")} · via {lead.source}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="lead-status-select" className="sr-only">Lead status</label>
                    <select
                        id="lead-status-select"
                        value={lead.status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-dd-cyan/60 focus:outline-none appearance-none"
                        data-testid="lead-status-select"
                    >
                        {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-dd-surface">{s}</option>
                        ))}
                    </select>
                    {wa && (
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-dd-wa px-5 py-2.5 text-sm font-semibold text-[#062b16]" data-testid="lead-detail-whatsapp">
                            <DdIcon name="MessageCircle" className="w-4 h-4" /> WhatsApp
                        </a>
                    )}
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-slate-200 hover:border-dd-cyan/50 transition-colors" data-testid="lead-detail-call">
                        <DdIcon name="Phone" className="w-4 h-4" /> Call
                    </a>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex flex-col gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Contact</p>
                    <InfoRow label="Phone" value={lead.phone} />
                    <InfoRow label="WhatsApp" value={lead.whatsapp || "—"} />
                    <InfoRow label="Email" value={lead.email || "—"} />
                    <InfoRow label="Website" value={lead.current_website || "—"} />
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex flex-col gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Enquiry</p>
                    <InfoRow label="Budget" value={lead.budget || "—"} />
                    <div>
                        <p className="text-xs text-slate-500 mb-1.5">Services interested in</p>
                        <div className="flex flex-wrap gap-1.5">
                            {(lead.services || []).length === 0 ? (
                                <span className="text-sm text-slate-500">—</span>
                            ) : (
                                lead.services.map((s) => (
                                    <span key={s} className="rounded-full bg-dd-cyan/10 border border-dd-cyan/25 px-3 py-1 text-xs text-dd-cyan">{s}</span>
                                ))
                            )}
                        </div>
                    </div>
                    {lead.message && (
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Message</p>
                            <p className="text-sm text-slate-300 leading-relaxed">{lead.message}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex flex-col gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Notes</p>
                <form onSubmit={addNote} className="flex gap-3">
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (call summary, next step...)" className="flex-1 rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-dd-cyan/60 focus:outline-none" data-testid="lead-note-input" />
                    <button type="submit" disabled={savingNote} className="rounded-full bg-dd-cyan px-5 py-2.5 font-display font-semibold text-sm text-[#06222b] disabled:opacity-60" data-testid="lead-note-add">
                        Add
                    </button>
                </form>
                {(lead.notes || []).length === 0 ? (
                    <p className="text-sm text-slate-600">No notes yet.</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {[...lead.notes].reverse().map((n) => (
                            <li key={n.id} className="rounded-xl bg-white/[0.03] border border-white/5 p-3.5" data-testid={`lead-note-${n.id}`}>
                                <p className="text-sm text-slate-300">{n.text}</p>
                                <p className="font-mono text-[10px] text-slate-600 mt-1.5">{n.by} · {new Date(n.created_at).toLocaleString("en-IN")}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex flex-col gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Activity History</p>
                {activity.length === 0 ? (
                    <p className="text-sm text-slate-600">No activity recorded yet.</p>
                ) : (
                    <ul className="flex flex-col gap-2.5">
                        {activity.map((a) => (
                            <li key={a.id} className="flex items-center gap-3 text-sm" data-testid={`lead-activity-${a.id}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-dd-cyan shrink-0" />
                                <span className="text-slate-300">{a.action}</span>
                                <span className="text-slate-600 text-xs">by {a.actor}</span>
                                <span className="ml-auto font-mono text-[10px] text-slate-600">{new Date(a.created_at).toLocaleString("en-IN")}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-sm text-slate-200 text-right break-all">{value}</span>
        </div>
    );
}
