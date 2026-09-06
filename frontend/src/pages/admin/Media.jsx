import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DdIcon } from "@/components/public/kit";
import { api, formatApiError } from "@/lib/api";

export default function MediaPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    const load = useCallback(() => {
        setLoading(true);
        api.get("/admin/media")
            .then((res) => setItems(res.data))
            .catch((e) => toast.error(formatApiError(e)))
            .finally(() => setLoading(false));
    }, []);

    useEffect(load, [load]);

    const upload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Only image files are supported.");
        if (file.size > 5 * 1024 * 1024) return toast.error("Max file size is 5MB.");
        setUploading(true);
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                await api.post("/admin/media", { name: file.name, data: reader.result });
                toast.success("Uploaded");
                load();
            } catch (err) {
                toast.error(formatApiError(err));
            } finally {
                setUploading(false);
                if (fileRef.current) fileRef.current.value = "";
            }
        };
        reader.readAsDataURL(file);
    };

    const copyUrl = (url) => {
        const full = `${process.env.REACT_APP_BACKEND_URL}${url}`;
        navigator.clipboard?.writeText(full);
        toast.success("Image URL copied");
    };

    const del = async (item) => {
        if (!window.confirm(`Delete ${item.name}?`)) return;
        try {
            await api.delete(`/admin/media/${item.id}`);
            toast.success("Deleted");
            load();
        } catch (e) {
            toast.error(formatApiError(e));
        }
    };

    return (
        <div className="flex flex-col gap-6" data-testid="admin-media-page">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">Media Library</h1>
                    <p className="text-sm text-slate-400 mt-1">Upload images and copy their URLs into any CMS image field.</p>
                </div>
                <div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden" id="media-upload-input" data-testid="media-upload-input" />
                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 rounded-full bg-dd-cyan px-5 py-2.5 font-display font-semibold text-sm text-[#06222b] disabled:opacity-60"
                        data-testid="media-upload-button"
                    >
                        {uploading ? <DdIcon name="Loader2" className="w-4 h-4 animate-spin" /> : <DdIcon name="Plus" className="w-4 h-4" />}
                        {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="aspect-video rounded-xl bg-white/[0.03] animate-pulse" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center" data-testid="media-empty">
                    <DdIcon name="Image" className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No media yet. Upload your logo, case study images and blog images here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((m) => (
                        <div key={m.id} className="group rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden" data-testid={`media-item-${m.id}`}>
                            <div className="aspect-video bg-black/40 overflow-hidden">
                                <img src={`${process.env.REACT_APP_BACKEND_URL}${m.url}`} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                            </div>
                            <div className="p-3 flex items-center justify-between gap-2">
                                <p className="text-xs text-slate-400 truncate">{m.name}</p>
                                <div className="flex gap-1 shrink-0">
                                    <button onClick={() => copyUrl(m.url)} className="p-1.5 rounded-lg text-slate-500 hover:text-dd-cyan transition-colors" aria-label={`Copy URL of ${m.name}`} data-testid={`media-copy-${m.id}`}>
                                        <DdIcon name="Copy" className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => del(m)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors" aria-label={`Delete ${m.name}`} data-testid={`media-delete-${m.id}`}>
                                        <DdIcon name="Trash2" className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
