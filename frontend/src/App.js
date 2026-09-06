import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SiteProvider } from "@/context/SiteContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useLenis } from "@/hooks/useLenis";

import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";

import HomePage from "@/pages/public/Home";
import { ServicesPage, ServiceDetailPage } from "@/pages/public/Services";
import { IndustriesPage, IndustryDetailPage } from "@/pages/public/Industries";
import ProcessPage from "@/pages/public/Process";
import { CaseStudiesPage, CaseStudyDetailPage } from "@/pages/public/CaseStudies";
import PricingPage from "@/pages/public/Pricing";
import { BlogPage, BlogPostPage } from "@/pages/public/Blog";
import AboutPage from "@/pages/public/About";
import ContactPage from "@/pages/public/Contact";
import { PrivacyPolicyPage, TermsPage, CookiePolicyPage } from "@/pages/public/Legal";
import NotFoundPage from "@/pages/public/NotFound";

import AdminLoginPage from "@/pages/admin/Login";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import { LeadsPage, LeadDetailPage } from "@/pages/admin/Leads";
import { ServicesAdmin, IndustriesAdmin, CaseStudiesAdmin, TestimonialsAdmin, PricingAdmin, FaqsAdmin, BlogAdmin, ClientsAdmin } from "@/pages/admin/CrudPages";
import { WebsiteContentPage, WhatsAppSettingsPage, ContactSettingsPage, SeoSettingsPage, AnalyticsSettingsPage, SiteSettingsPage } from "@/pages/admin/Settings";
import MediaPage from "@/pages/admin/Media";
import ReportsPage from "@/pages/admin/Reports";
import ActivityLogsPage from "@/pages/admin/ActivityLogs";

function ScrollManager() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            let tries = 0;
            const attempt = () => {
                const el = document.getElementById(hash.slice(1));
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else if (tries++ < 12) setTimeout(attempt, 250);
            };
            setTimeout(attempt, 100);
        } else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [pathname, hash]);
    return null;
}

function PublicLayout() {
    useLenis(true);
    return (
        <div className="relative">
            <div className="noise-overlay" aria-hidden="true" />
            <Navbar />
            <main id="main-content">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
}

function ProtectedAdmin() {
    const { admin } = useAuth();
    if (admin === null)
        return (
            <div className="min-h-screen bg-[#0B0D14] flex items-center justify-center" data-testid="admin-loading">
                <div className="h-10 w-10 rounded-full border-2 border-dd-cyan/30 border-t-dd-cyan animate-spin" />
            </div>
        );
    if (admin === false) return <Navigate to="/admin/login" replace />;
    return <AdminLayout />;
}

function LoginGate() {
    const { admin } = useAuth();
    if (admin) return <Navigate to="/admin/dashboard" replace />;
    return <AdminLoginPage />;
}

function App() {
    return (
        <BrowserRouter>
            <SiteProvider>
                <AuthProvider>
                    <ScrollManager />
                    <Routes>
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/services" element={<ServicesPage />} />
                            <Route path="/services/:slug" element={<ServiceDetailPage />} />
                            <Route path="/industries" element={<IndustriesPage />} />
                            <Route path="/industries/:slug" element={<IndustryDetailPage />} />
                            <Route path="/process" element={<ProcessPage />} />
                            <Route path="/case-studies" element={<CaseStudiesPage />} />
                            <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
                            <Route path="/pricing" element={<PricingPage />} />
                            <Route path="/blog" element={<BlogPage />} />
                            <Route path="/blog/:slug" element={<BlogPostPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>

                        <Route path="/admin/login" element={<LoginGate />} />
                        <Route path="/admin" element={<ProtectedAdmin />}>
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="leads" element={<LeadsPage />} />
                            <Route path="leads/:id" element={<LeadDetailPage />} />
                            <Route path="clients" element={<ClientsAdmin />} />
                            <Route path="services" element={<ServicesAdmin />} />
                            <Route path="industries" element={<IndustriesAdmin />} />
                            <Route path="case-studies" element={<CaseStudiesAdmin />} />
                            <Route path="testimonials" element={<TestimonialsAdmin />} />
                            <Route path="pricing" element={<PricingAdmin />} />
                            <Route path="faqs" element={<FaqsAdmin />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="blog" element={<BlogAdmin />} />
                            <Route path="media" element={<MediaPage />} />
                            <Route path="content" element={<WebsiteContentPage />} />
                            <Route path="seo" element={<SeoSettingsPage />} />
                            <Route path="analytics" element={<AnalyticsSettingsPage />} />
                            <Route path="whatsapp" element={<WhatsAppSettingsPage />} />
                            <Route path="contact-settings" element={<ContactSettingsPage />} />
                            <Route path="settings" element={<SiteSettingsPage />} />
                            <Route path="activity-logs" element={<ActivityLogsPage />} />
                        </Route>
                    </Routes>
                    <Toaster theme="dark" position="top-right" richColors />
                </AuthProvider>
            </SiteProvider>
        </BrowserRouter>
    );
}

export default App;
