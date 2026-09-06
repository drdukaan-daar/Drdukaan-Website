import React from "react";
import { motion } from "framer-motion";
import { DdIcon } from "./kit";
import { useSite } from "@/context/SiteContext";

export default function WhatsAppFloat() {
    const { whatsappUrl, track, settings } = useSite();
    return (
        <motion.a
            href={whatsappUrl("default_message")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", "floating_button")}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 16 }}
            className="wa-pulse fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-dd-wa text-[#062b16] shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-110 active:scale-95"
            aria-label={`Chat on WhatsApp ${settings?.whatsapp?.display || "+91 9985510295"}`}
            data-testid="floating-whatsapp-button"
        >
            <DdIcon name="MessageCircle" className="w-7 h-7" />
        </motion.a>
    );
}
