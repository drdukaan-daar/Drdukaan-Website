import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

const SiteContext = createContext(null);

const DEFAULTS = {
  whatsapp: {
    number: "919985510295",
    display: "+91 9985510295",
    default_message: "Hi Dr Dukaan, I want to grow my business online. I'd like to discuss your digital growth options.",
    hero_message: "Hi Dr Dukaan, I want to take my business online and would like to discuss a digital growth solution.",
    quote_message: "Hi Dr Dukaan, I'd like to get a quote for my business. Please share the details.",
  },
  website: { brand_name: "Dr Dukaan", tagline: "Digital Growth Partner for Local Businesses." },
  contact: { email: "drdukaan@gmail.com", locations: ["Hyderabad, Telangana", "Kurnool, Andhra Pradesh"] },
  analytics: { ga4_id: "" },
  seo: {},
};

function loadGtag(id) {
  if (!id || document.getElementById("dd-ga4")) return;
  const s = document.createElement("script");
  s.id = "dd-ga4";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id);
}

export function SiteProvider({ children }) {
  const [data, setData] = useState({ settings: DEFAULTS, services: [], industries: [], caseStudies: [], pricingPlans: [], faqs: [], testimonials: [] });
  const [loaded, setLoaded] = useState(false);
  const gaLoaded = useRef(false);

  useEffect(() => {
    let mounted = true;
    api
      .get("/public/bootstrap")
      .then((res) => {
        if (!mounted) return;
        const merged = { ...res.data };
        merged.settings = { ...DEFAULTS, ...(res.data.settings || {}) };
        setData(merged);
        setLoaded(true);
        const ga4 = merged.settings?.analytics?.ga4_id || process.env.REACT_APP_GA4_ID;
        if (ga4 && !gaLoaded.current) {
          gaLoaded.current = true;
          loadGtag(ga4);
        }
      })
      .catch(() => setLoaded(true));
    return () => {
      mounted = false;
    };
  }, []);

  const whatsappUrl = useCallback(
    (messageKey = "default_message") => {
      const wa = data.settings?.whatsapp || DEFAULTS.whatsapp;
      const num = (wa.number || "").replace(/\D/g, "");
      const msg = wa[messageKey] || wa.default_message || "";
      return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
    },
    [data.settings]
  );

  const track = useCallback((type, label = "") => {
    try {
      api.post("/public/events", { type, label, path: window.location.pathname }).catch(() => {});
      if (window.gtag) window.gtag("event", type, { event_label: label });
    } catch (e) {
      /* noop */
    }
  }, []);

  const value = { ...data, loaded, whatsappUrl, track };
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
