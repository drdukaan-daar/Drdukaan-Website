import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DdIcon } from "@/components/public/kit";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function AdminLoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/admin/dashboard");
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0D14] flex items-center justify-center px-5 grid-bg" data-testid="admin-login-page">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md glass-card glow-border rounded-3xl p-8 sm:p-10"
            >
                <div className="flex items-center gap-2.5 mb-8">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dd-cyan to-dd-blue font-display font-extrabold text-[#06222b] text-lg">D</span>
                    <div>
                        <p className="font-display font-bold leading-none">Dr Dukaan</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 mt-1">Admin Console</p>
                    </div>
                </div>

                <h1 className="font-display text-2xl font-bold mb-1">Welcome back.</h1>
                <p className="text-sm text-slate-400 mb-7">Sign in to manage your growth platform.</p>

                <form onSubmit={submit} className="flex flex-col gap-4" data-testid="admin-login-form">
                    <div>
                        <label htmlFor="admin-email" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Email</label>
                        <input
                            id="admin-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 text-sm focus:border-dd-cyan/60 focus:outline-none transition-colors"
                            placeholder="admin@drdukaan.com"
                            data-testid="admin-login-email"
                        />
                    </div>
                    <div>
                        <label htmlFor="admin-password" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Password</label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPw ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3.5 pr-12 text-sm focus:border-dd-cyan/60 focus:outline-none transition-colors"
                                placeholder="••••••••"
                                data-testid="admin-login-password"
                            />
                            <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" aria-label={showPw ? "Hide password" : "Show password"} data-testid="admin-login-toggle-password">
                                <DdIcon name={showPw ? "EyeOff" : "Eye"} className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-rose-400" data-testid="admin-login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 rounded-full bg-dd-cyan py-3.5 font-display font-semibold text-sm text-[#06222b] transition-[box-shadow,transform] duration-300 hover:shadow-[0_0_28px_rgba(0,240,255,0.4)] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                        data-testid="admin-login-submit"
                    >
                        {loading && <DdIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <Link to="/" className="mt-6 block text-center text-xs text-slate-500 hover:text-dd-cyan transition-colors" data-testid="admin-login-back">
                    ← Back to website
                </Link>
            </motion.div>
        </div>
    );
}
