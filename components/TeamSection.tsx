"use client";

import { User } from "lucide-react";

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12">
          <div className="text-[#C1121F] font-bold text-xs uppercase tracking-widest mb-1">
            Leadership & Coordination
          </div>
          <h2 className="text-3xl font-extrabold text-[#161616] tracking-tight">
            Meet Our Team
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            The dedicated individuals behind Bengalier Vocals artist booking and event support.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
          
          {/* Ayon - Founder */}
          <div className="bg-white border border-stone-200 p-8 flex items-start gap-6 hover:border-[#C1121F] transition-all">
            <div className="w-14 h-14 bg-[#161616] text-white flex items-center justify-center font-bold text-xl shrink-0">
              A
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#161616]">Ayon</h3>
              <div className="text-xs font-bold uppercase tracking-wider text-[#C1121F]">
                Founder & Key Coordinator
              </div>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Leads artist network relationships, client consultations, and event positioning for Bengalier Vocals.
              </p>
              <a
                href="https://wa.me/916290713080"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-stone-900 hover:text-[#C1121F] pt-1"
              >
                Contact via WhatsApp →
              </a>
            </div>
          </div>

          {/* Somnath - Support & Coordination */}
          <div className="bg-white border border-stone-200 p-8 flex items-start gap-6 hover:border-[#C1121F] transition-all">
            <div className="w-14 h-14 bg-stone-200 text-[#161616] flex items-center justify-center font-bold text-xl shrink-0 border border-stone-300">
              S
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#161616]">Somnath</h3>
              <div className="text-xs font-bold uppercase tracking-wider text-[#C1121F]">
                Support & Production Logistics
              </div>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Manages technical vendor partners, sound/stage schedule logistics, and event day support.
              </p>
              <a
                href="https://wa.me/919432882915"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-stone-900 hover:text-[#C1121F] pt-1"
              >
                Contact via WhatsApp →
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
