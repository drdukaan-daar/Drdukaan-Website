import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Globe, Smartphone, ShoppingCart, TrendingUp, Target, Megaphone, Search, Palette, BarChart3,
    Dumbbell, Stethoscope, Store, Boxes, UtensilsCrossed, GraduationCap, Scissors, Building2, Car, Wrench,
    MessageCircle, Phone, Mail, MapPin, ArrowRight, Sparkles, Check, ChevronDown, Menu, X, Clock,
    Instagram, Facebook, Linkedin, Twitter, Youtube, ExternalLink, Trash2, Pencil, Plus, Eye, EyeOff, LogOut,
    LayoutDashboard, Users, FileText, Settings, Image as ImageIcon, Activity, Tag, Briefcase, Newspaper,
    MessageSquare, Share2, Shield, Database, LineChart, Loader2, Star, Quote, Download, Copy, CheckCircle2,
} from "lucide-react";

const ICONS = {
    Globe, Smartphone, ShoppingCart, TrendingUp, Target, Megaphone, Search, Palette, BarChart3,
    Dumbbell, Stethoscope, Store, Boxes, UtensilsCrossed, GraduationCap, Scissors, Building2, Car, Wrench,
    MessageCircle, Phone, Mail, MapPin, ArrowRight, Sparkles, Check, ChevronDown, Menu, X, Clock,
    Instagram, Facebook, Linkedin, Twitter, Youtube, ExternalLink, Trash2, Pencil, Plus, Eye, EyeOff, LogOut,
    LayoutDashboard, Users, FileText, Settings, Image: ImageIcon, Activity, Tag, Briefcase, Newspaper,
    MessageSquare, Share2, Shield, Database, LineChart, Loader2, Star, Quote, Download, Copy, CheckCircle2,
};

export function DdIcon({ name, className = "w-5 h-5", ...rest }) {
    const Icon = ICONS[name] || Sparkles;
    return <Icon className={className} {...rest} />;
}

export function Reveal({ children, delay = 0, y = 28, className = "", once = true }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

export function Chapter({ num, label }) {
    return (
        <div className="flex items-center gap-3" data-testid={`chapter-${label?.toLowerCase().replace(/\s+/g, "-")}`}>
            <span className="font-mono text-xs text-dd-cyan tracking-[0.25em]">{String(num).padStart(2, "0")}</span>
            <span className="h-px w-10 bg-gradient-to-r from-dd-cyan/70 to-transparent" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">{label}</span>
        </div>
    );
}

export function SectionHeading({ chapter, num, eyebrow, title, sub, align = "left" }) {
    const alignCls = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
    return (
        <div className={`flex flex-col gap-4 max-w-3xl ${alignCls}`}>
            {num ? <Chapter num={num} label={chapter || eyebrow} /> : eyebrow ? (
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-dd-cyan">{eyebrow}</span>
            ) : null}
            {title && (
                <Reveal>
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.12]">{title}</h2>
                </Reveal>
            )}
            {sub && (
                <Reveal delay={0.1}>
                    <p className="text-base sm:text-lg text-slate-400 leading-relaxed">{sub}</p>
                </Reveal>
            )}
        </div>
    );
}

export function GlowButton({ children, href, to, onClick, variant = "primary", className = "", testId, external, type = "button" }) {
    const base =
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display font-semibold text-sm tracking-wide transition-[transform,box-shadow,background-color] duration-300 active:scale-[0.97] min-h-[48px]";
    const styles = {
        primary: "bg-dd-cyan text-[#06222b] hover:shadow-[0_0_36px_rgba(0,240,255,0.45)] hover:-translate-y-0.5",
        whatsapp: "bg-dd-wa text-[#062b16] hover:shadow-[0_0_36px_rgba(37,211,102,0.4)] hover:-translate-y-0.5",
        ghost: "border border-white/15 text-white hover:border-dd-cyan/60 hover:text-dd-cyan hover:-translate-y-0.5 bg-white/[0.03]",
        violet: "bg-dd-violet text-white hover:shadow-[0_0_36px_rgba(139,92,246,0.45)] hover:-translate-y-0.5",
    };
    const cls = `${base} ${styles[variant]} ${className}`;
    if (to)
        return (
            <Link to={to} className={cls} onClick={onClick} data-testid={testId}>
                {children}
            </Link>
        );
    if (href)
        return (
            <a href={href} className={cls} onClick={onClick} data-testid={testId} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
            </a>
        );
    return (
        <button type={type} className={cls} onClick={onClick} data-testid={testId}>
            {children}
        </button>
    );
}

export function DemoBadge({ label = "DEMO DATA" }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-dd-violet/40 bg-dd-violet/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-dd-violet">
            <Sparkles className="w-3 h-3" />
            {label}
        </span>
    );
}

export function Marquee({ items }) {
    const row = (
        <div className="flex shrink-0 items-center">
            {items.map((item, i) => (
                <span key={i} className="flex items-center">
                    <span className="font-display text-lg sm:text-xl font-medium text-slate-500 px-6 whitespace-nowrap">{item}</span>
                    <span className="text-dd-cyan/60 text-xs">◆</span>
                </span>
            ))}
        </div>
    );
    return (
        <div className="relative overflow-hidden border-y border-white/5 bg-dd-surface/40 py-5" aria-hidden="true" data-testid="editorial-marquee">
            <div className="marquee-track">
                {row}
                {row}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-dd-bg to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-dd-bg to-transparent" />
        </div>
    );
}
