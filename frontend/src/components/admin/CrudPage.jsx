import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { DdIcon } from "@/components/public/kit";
import { api, formatApiError } from "@/lib/api";

const ICON_OPTIONS = [
    "Globe", "Smartphone", "ShoppingCart", "TrendingUp", "Target", "Megaphone", "Search", "Palette", "BarChart3",
    "Dumbbell", "Stethoscope", "Store", "Boxes", "UtensilsCrossed", "GraduationCap", "Scissors", "Building2", "Car", "Wrench",
];

export function Field({ field, value, onChange, testId }) {
    const base = "w-full rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-dd-cyan/60 focus:outline-none transition-colors";
    const label = (
        <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1.5" htmlFor={testId}>
            {field.label}
        </label>
    );

    if (field.type === "switch") {
        return (
            <button
                type="button"
                id={testId}
                role="switch"
                aria-checked={!!value}
                onClick={() => onChange(!value)}
                className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-dd-cyan" : "bg-white/10"}`}
                data-testid={testId}
            >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
        );
    }
    if (field.type === "textarea")
        return (
            <div className={field.full ? "sm:col-span-2" : ""}>
                {label}
                <textarea id={testId} rows={field.rows || 3} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`${base} resize-y`} data-testid={testId} placeholder={field.placeholder} />
            </div>
        );
    if (field.type === "list")
        return (
            <div className={field.full !== false ? "sm:col-span-2" : ""}>
                {label}
                <textarea
                    id={testId}
                    rows={4}
                    value={Array.isArray(value) ? value.join("\n") : value || ""}
                    onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                    className={`${base} resize-y font-mono text-xs`}
                    placeholder="One item per line"
                    data-testid={testId}
                />
            </div>
        );
    if (field.type === "select")
        return (
            <div>
                {label}
                <select id={testId} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`${base} appearance-none`} data-testid={testId}>
                    <option value="" className="bg-dd-surface">Select...</option>
                    {(field.options || []).map((o) => (
                        <option key={o} value={o} className="bg-dd-surface">{o}</option>
                    ))}
                </select>
            </div>
        );
    if (field.type === "icon")
        return (
            <div>
                {label}
                <div className="flex items-center gap-3">
                    <select id={testId} value={value || "Sparkles"} onChange={(e) => onChange(e.target.value)} className={`${base} appearance-none flex-1`} data-testid={testId}>
                        {ICON_OPTIONS.map((o) => (
                            <option key={o} value={o} className="bg-dd-surface">{o}</option>
                        ))}
                    </select>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-dd-cyan/10 border border-dd-cyan/30 text-dd-cyan">
                        <DdIcon name={value || "Sparkles"} className="w-4 h-4" />
                    </span>
                </div>
            </div>
        );
    return (
        <div className={field.full ? "sm:col-span-2" : ""}>
            {label}
            <input
                id={testId}
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                value={value ?? ""}
                onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
                className={base}
                placeholder={field.placeholder}
                data-testid={testId}
            />
        </div>
    );
}

export default function CrudPage({ title, subtitle, endpoint, columns, fields, labelOf, testPrefix, defaults = {}, statusColor }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | {mode:'create'|'edit', item}
    const [form, setForm] = useState({});
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");

    const load = useCallback(() => {
        setLoading(true);
        api.get(`/admin/${endpoint}`)
            .then((res) => setItems(res.data))
            .catch((e) => toast.error(formatApiError(e)))
            .finally(() => setLoading(false));
    }, [endpoint]);

    useEffect(load, [load]);

    const openCreate = () => {
        setForm({ ...defaults });
        setModal({ mode: "create" });
    };
    const openEdit = (item) => {
        setForm({ ...item });
        setModal({ mode: "edit", item });
    };

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (modal.mode === "create") {
                await api.post(`/admin/${endpoint}`, form);
                toast.success(`${title.slice(0, -1) || title} created`);
            } else {
                await api.put(`/admin/${endpoint}/${modal.item.id}`, form);
                toast.success("Saved");
            }
            setModal(null);
            load();
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setSaving(false);
        }
    };

    const doDelete = async () => {
        try {
            await api.delete(`/admin/${endpoint}/${deleting.id}`);
            toast.success("Deleted");
            setDeleting(null);
            load();
        } catch (err) {
            toast.error(formatApiError(err));
        }
    };

    const filtered = items.filter((it) => !search || JSON.stringify(it).toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col gap-6" data-testid={`${testPrefix}-page`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
                    {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        aria-label={`Search ${title}`}
                        className="rounded-lg bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-dd-cyan/60 focus:outline-none w-44 sm:w-56"
                        data-testid={`${testPrefix}-search`}
                    />
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-full bg-dd-cyan px-5 py-2.5 font-display font-semibold text-sm text-[#06222b] hover:shadow-[0_0_24px_rgba(0,240,255,0.35)] transition-shadow"
                        data-testid={`${testPrefix}-create-button`}
                    >
                        <DdIcon name="Plus" className="w-4 h-4" /> New
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/8 text-left">
                                {columns.map((c) => (
                                    <th key={c.key} className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 font-medium">{c.label}</th>
                                ))}
                                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={columns.length + 1} className="px-4 py-14 text-center text-slate-500">
                                    <DdIcon name="Loader2" className="w-5 h-5 animate-spin inline-block mr-2" /> Loading...
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={columns.length + 1} className="px-4 py-14 text-center text-slate-500" data-testid={`${testPrefix}-empty`}>
                                    Nothing here yet. Click "New" to create your first entry.
                                </td></tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors" data-testid={`${testPrefix}-row-${item.id}`}>
                                        {columns.map((c) => (
                                            <td key={c.key} className="px-4 py-3.5 text-slate-300">
                                                {c.render ? c.render(item) : String(item[c.key] ?? "—").slice(0, 60)}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3.5">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-dd-cyan hover:bg-dd-cyan/10 transition-colors" aria-label={`Edit ${labelOf(item)}`} data-testid={`${testPrefix}-edit-${item.id}`}>
                                                    <DdIcon name="Pencil" className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleting(item)} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors" aria-label={`Delete ${labelOf(item)}`} data-testid={`${testPrefix}-delete-${item.id}`}>
                                                    <DdIcon name="Trash2" className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)} />
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#12141F] border border-white/10 p-6 sm:p-8"
                            role="dialog"
                            aria-modal="true"
                            data-testid={`${testPrefix}-form-modal`}
                        >
                            <h2 className="font-display text-xl font-bold text-white mb-6">{modal.mode === "create" ? `New ${title.replace(/s$/, "")}` : `Edit ${labelOf(modal.item)}`}</h2>
                            <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
                                {fields.map((f) => (
                                    <Field
                                        key={f.name}
                                        field={f}
                                        value={form[f.name]}
                                        onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
                                        testId={`${testPrefix}-field-${f.name}`}
                                    />
                                ))}
                                <div className="sm:col-span-2 flex justify-end gap-3 pt-3">
                                    <button type="button" onClick={() => setModal(null)} className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-slate-300 hover:border-white/40 transition-colors" data-testid={`${testPrefix}-form-cancel`}>
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-full bg-dd-cyan px-6 py-2.5 font-display font-semibold text-sm text-[#06222b] disabled:opacity-60" data-testid={`${testPrefix}-form-save`}>
                                        {saving && <DdIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
                {deleting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleting(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm rounded-2xl bg-[#12141F] border border-white/10 p-6 flex flex-col gap-4"
                            role="alertdialog"
                            data-testid={`${testPrefix}-delete-modal`}
                        >
                            <h3 className="font-display text-lg font-bold text-white">Delete {labelOf(deleting)}?</h3>
                            <p className="text-sm text-slate-400">This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setDeleting(null)} className="rounded-full border border-white/15 px-5 py-2 text-sm text-slate-300" data-testid={`${testPrefix}-delete-cancel`}>Cancel</button>
                                <button onClick={doDelete} className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white" data-testid={`${testPrefix}-delete-confirm`}>Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
