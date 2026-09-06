import React from "react";
import { Link } from "react-router-dom";
import { DdIcon, GlowButton } from "@/components/public/kit";

export default function NotFoundPage() {
    return (
        <section className="min-h-screen flex items-center justify-center grid-bg px-6" data-testid="not-found-page">
            <div className="text-center flex flex-col items-center gap-6">
                <p className="font-display text-[120px] sm:text-[160px] font-extrabold leading-none glow-text">404</p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold">This page went offline.</h1>
                <p className="text-slate-400 max-w-md">The page you're looking for doesn't exist. Let's get you back to growing your business.</p>
                <div className="flex gap-4 flex-wrap justify-center">
                    <GlowButton to="/" variant="primary" testId="not-found-home">
                        Back to Home
                    </GlowButton>
                    <GlowButton to="/services" variant="ghost" testId="not-found-services">
                        Explore Services <DdIcon name="ArrowRight" className="w-4 h-4" />
                    </GlowButton>
                </div>
                <Link to="/contact" className="text-sm text-slate-500 hover:text-dd-cyan transition-colors">
                    Think something's broken? Tell us
                </Link>
            </div>
        </section>
    );
}
