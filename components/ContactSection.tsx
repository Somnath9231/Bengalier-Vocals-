"use client";

import Image from "next/image";
import { Phone, MessageSquare } from "lucide-react";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="text-[#C1121F] font-bold text-xs uppercase tracking-widest">
            Direct Contact & Booking
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#161616] tracking-tight">
            Planning an Event?
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-medium">
            Tell us what you&apos;re planning, and we&apos;ll help you find the right artist and production support for your event. Reach out to us directly via phone, WhatsApp, or Instagram.
          </p>
        </div>

        {/* 3-Column Direct Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Ayon (Founder) Direct Calls & WhatsApp */}
          <div className="md:col-span-6 lg:col-span-5 bg-[#FAFAFA] border-2 border-stone-900 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C1121F]">
                Founder & Key Coordinator (Ayon)
              </div>
              <h3 className="text-2xl font-extrabold text-[#161616]">
                Call or WhatsApp Directly
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Connect directly for artist availability, performance bookings, setlists, and event scheduling.
              </p>

              <div className="pt-2">
                <a
                  href="tel:+916290713080"
                  className="text-xl font-extrabold text-[#161616] hover:text-[#C1121F] flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#C1121F]" />
                  +91 62907 13080
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
              <a
                href="tel:+916290713080"
                className="bg-[#161616] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Now
              </a>
              <a
                href="https://wa.me/916290713080?text=Hi%20Bengalier%20Vocals%2C%20I%20would%20like%20to%20enquire%20about%20booking%20an%20artist%20for%20an%20event."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C1121F] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 hover:bg-[#8F0D16] transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Ayon
              </a>
            </div>
          </div>

          {/* Card 2: Somnath (Support & Logistics) */}
          <div className="md:col-span-6 lg:col-span-4 bg-[#FAFAFA] border border-stone-200 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#C1121F] transition-all">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Support & Technical Queries (Somnath)
              </div>
              <h3 className="text-2xl font-extrabold text-[#161616]">
                Technical & Logistics Support
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Contact for sound equipment PA setups, stage framing, lighting arrangements, and instrument rentals.
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/919432882915"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-extrabold text-[#161616] hover:text-[#C1121F] flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-[#C1121F]" />
                  +91 94328 82915
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <a
                href="https://wa.me/919432882915?text=Hi%20Bengalier%20Vocals%2C%20I%20have%20an%20event%20query."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-stone-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 hover:bg-stone-900 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Support
              </a>
            </div>
          </div>

          {/* Card 3: Instagram QR Code Display & Link */}
          <div className="md:col-span-12 lg:col-span-3 bg-white border border-stone-200 p-6 sm:p-8 flex flex-col items-center justify-between text-center space-y-6 hover:border-[#C1121F] transition-all">
            <div className="space-y-3 flex flex-col items-center">
              <div className="flex items-center gap-2 text-[#C1121F]">
                <InstagramIcon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Instagram
                </span>
              </div>
              
              <div className="relative w-36 h-36 border-2 border-stone-900 p-1 bg-white my-2">
                <Image
                  src="/insta.jpg"
                  alt="Bengalier Vocals Instagram QR Code"
                  fill
                  className="object-contain"
                />
              </div>

              <h4 className="text-base font-extrabold text-[#161616]">
                @bengaliervocals
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed">
                Scan QR code to view live performance videos and updates.
              </p>
            </div>

            <a
              href="https://www.instagram.com/bengaliervocals/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-stone-100 hover:bg-[#C1121F] hover:text-white text-stone-900 text-xs font-bold uppercase tracking-wider py-3 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Visit Profile</span>
              <span>→</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
