import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DdIcon, Reveal } from "@/components/public/kit";
import { PageHero } from "./Services";
import { LeadFormSection } from "@/components/public/Sections3";
import { useMeta } from "@/lib/useMeta";
import { api } from "@/lib/api";

export function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useMeta("Blog | Dr Dukaan", "Practical digital growth guides for local business owners — no jargon, just what works.");

    useEffect(() => {
        api.get("/public/blog")
            .then((res) => setPosts(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <PageHero
                eyebrow="Blog"
                title="Growth Notes for Business Owners."
                sub="Practical, plain-language guides on taking your business online and growing it."
                testId="blog-page-hero"
            />
            <section className="pb-24 sm:pb-32">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-72 rounded-2xl bg-white/[0.03] animate-pulse" />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <p className="text-slate-500 text-center py-16" data-testid="blog-empty">No articles published yet. Check back soon.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {posts.map((p, i) => (
                                <Reveal key={p.id || p.slug} delay={(i % 3) * 0.08}>
                                    <Link
                                        to={`/blog/${p.slug}`}
                                        className="group block h-full overflow-hidden rounded-2xl glass-card transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-dd-cyan/30"
                                        data-testid={`blog-card-${p.slug}`}
                                    >
                                        {p.featured_image && (
                                            <div className="h-44 overflow-hidden">
                                                <img src={p.featured_image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            </div>
                                        )}
                                        <div className="p-6 flex flex-col gap-3">
                                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dd-cyan">{p.category}</span>
                                            <h2 className="font-display text-lg font-semibold leading-snug">{p.title}</h2>
                                            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{p.excerpt}</p>
                                            <span className="text-xs text-slate-500">{p.author}</span>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export function BlogPostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    useMeta(post?.seo_title || `${post?.title || "Article"} | Dr Dukaan`, post?.seo_description || post?.excerpt || "");

    useEffect(() => {
        setLoading(true);
        api.get(`/public/blog/${slug}`)
            .then((res) => setPost(res.data))
            .catch(() => setPost(false))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="min-h-screen pt-40 flex justify-center"><DdIcon name="Loader2" className="w-8 h-8 animate-spin text-dd-cyan" /></div>;
    if (!post) return <PageHero eyebrow="Blog" title="Article not found." sub="This article doesn't exist or has been unpublished." testId="blog-not-found" />;

    return (
        <>
            <article className="pt-36 pb-20" data-testid="blog-post-page">
                <div className="mx-auto max-w-3xl px-5 sm:px-8 flex flex-col gap-6">
                    <Reveal>
                        <Link to="/blog" className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 hover:text-dd-cyan transition-colors">
                            ← All Articles
                        </Link>
                    </Reveal>
                    <Reveal delay={0.05}>
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-dd-cyan">{post.category}</span>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.15]">{post.title}</h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="text-xs text-slate-500">
                            {post.author}
                            {post.published_at ? ` · ${new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}
                        </p>
                    </Reveal>
                    {post.featured_image && (
                        <Reveal delay={0.2}>
                            <img src={post.featured_image} alt={post.title} className="w-full rounded-2xl border border-white/8 object-cover max-h-[420px]" loading="lazy" />
                        </Reveal>
                    )}
                    <Reveal delay={0.25}>
                        <div className="text-slate-300 leading-[1.85] text-base whitespace-pre-line" data-testid="blog-post-content">
                            {post.content}
                        </div>
                    </Reveal>
                </div>
            </article>
            <LeadFormSection source={`blog-${slug}`} />
        </>
    );
}
