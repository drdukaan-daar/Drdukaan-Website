import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/activity-logs")
            .then((res) => setLogs(res.data))
            .catch((e) => toast.error(formatApiError(e)))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col gap-6" data-testid="admin-activity-page">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Activity Logs</h1>
                <p className="text-sm text-slate-400 mt-1">Audit trail of admin actions and incoming leads.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/8 text-left">
                                {["Time", "Actor", "Action", "Entity", "Detail"].map((h) => (
                                    <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="px-4 py-14 text-center text-slate-500">Loading...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-14 text-center text-slate-500" data-testid="activity-empty">No activity yet.</td></tr>
                            ) : (
                                logs.map((l) => (
                                    <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.03]" data-testid={`activity-row-${l.id}`}>
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{new Date(l.created_at).toLocaleString("en-IN")}</td>
                                        <td className="px-4 py-3 text-slate-300">{l.actor}</td>
                                        <td className="px-4 py-3"><span className="rounded-full bg-dd-cyan/10 border border-dd-cyan/25 px-2.5 py-0.5 font-mono text-[10px] uppercase text-dd-cyan">{l.action}</span></td>
                                        <td className="px-4 py-3 text-slate-400">{l.entity}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{l.detail || "—"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
