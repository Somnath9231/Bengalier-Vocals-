"use client";

import { useEffect, useState } from "react";
import { Phone, MessageSquare, X, Copy, Check, Sparkles, UserCheck } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card Content */}
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-[#161616] text-white p-5 sm:p-6 flex items-center justify-between border-b-4 border-[#C1121F]">
          <div>
            <div className="flex items-center gap-2 text-[#C1121F] text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bengalier Vocals Network</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Direct Contact & Booking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-none transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
            Select a contact below to instantly connect via direct phone call or WhatsApp message:
          </p>

          <div className="grid grid-cols-1 gap-4">
            {/* Card 1: Ayan Bose */}
            <div className="bg-[#FAFAFA] dark:bg-stone-800/80 border-2 border-stone-900 dark:border-stone-700 p-5 space-y-4 hover:border-[#C1121F] dark:hover:border-[#C1121F] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-700">
                <div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#C1121F]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C1121F]">
                      Founder & Key Coordinator
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-[#161616] dark:text-white mt-0.5">
                    Ayan Bose
                  </h4>
                </div>
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Artist Booking & Enquiries
                </div>
              </div>

              {/* Phone number display with copy button */}
              <div className="flex items-center justify-between bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-3.5 py-2.5">
                <span className="text-base font-extrabold text-[#161616] dark:text-stone-100 font-mono">
                  +91 62907 13080
                </span>
                <button
                  onClick={() => handleCopy("+916290713080", "ayan")}
                  className="text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#C1121F] flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedId === "ayan" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dual Action Buttons (Call & WhatsApp) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="tel:+916290713080"
                  className="bg-[#161616] hover:bg-black dark:bg-stone-950 dark:hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3 px-3 flex items-center justify-center gap-2 transition-colors border border-stone-800"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C1121F]" />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/916290713080?text=Hi%20Ayan%2C%20I%20would%20like%20to%20enquire%20about%20booking%20an%20artist%20for%20an%20event."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold uppercase tracking-wider py-3 px-3 flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card 2: Somnath Podder */}
            <div className="bg-[#FAFAFA] dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 p-5 space-y-4 hover:border-[#C1121F] dark:hover:border-[#C1121F] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-700">
                <div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                      Support & Technical Logistics
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-[#161616] dark:text-white mt-0.5">
                    Somnath Podder
                  </h4>
                </div>
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Sound, Stage & Lighting Support
                </div>
              </div>

              {/* Phone number display with copy button */}
              <div className="flex items-center justify-between bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-3.5 py-2.5">
                <span className="text-base font-extrabold text-[#161616] dark:text-stone-100 font-mono">
                  +91 94328 82915
                </span>
                <button
                  onClick={() => handleCopy("+919432882915", "somnath")}
                  className="text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-[#C1121F] flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedId === "somnath" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dual Action Buttons (Call & WhatsApp) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="tel:+919432882915"
                  className="bg-[#161616] hover:bg-black dark:bg-stone-950 dark:hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3 px-3 flex items-center justify-center gap-2 transition-colors border border-stone-800"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C1121F]" />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/919432882915?text=Hi%20Somnath%2C%20I%20have%20an%20event%20technical%2Fsound%20query."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold uppercase tracking-wider py-3 px-3 flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>24/7 Artist Coordination Support</span>
            <span>Kolkata, West Bengal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
