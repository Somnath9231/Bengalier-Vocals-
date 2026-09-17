"use client";

import Image from "next/image";
import { ArrowRight, Music, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-white overflow-hidden border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Editorial Messaging */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-stone-200 bg-[#FAFAFA]">
              <span className="w-2 h-2 rounded-full bg-[#C1121F] animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-bold text-stone-800">
                Artist Coordination & Event Support
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#161616] tracking-tight leading-[1.08]">
              Music That Belongs On Your Stage.
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-stone-600 font-medium leading-relaxed max-w-2xl">
              Bengalier Vocals connects event organizers with singers, musicians, live bands, and stage production support for private celebrations, public events, and live performances.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#contact"
                className="bg-[#C1121F] hover:bg-[#8F0D16] text-white text-sm font-bold uppercase tracking-wider px-8 py-4 text-center transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Book an Artist</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#artists"
                className="border-2 border-[#161616] hover:bg-[#161616] hover:text-white text-[#161616] text-sm font-bold uppercase tracking-wider px-8 py-4 text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore Artists</span>
              </a>
            </div>

            {/* Credibility & Scope Highlights */}
            <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C1121F] shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-stone-700">Senior Virtuosos & Emerging Voices</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C1121F] shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-stone-700">Private Parties & Public Festivals</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C1121F] shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-stone-700">Complete Sound & Stage Technicals</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative border-4 border-stone-900 bg-stone-900 shadow-xl overflow-hidden">
              
              {/* High-quality concert image banner */}
              <div className="relative h-[380px] sm:h-[460px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
                  alt="Live Music Concert Stage Performance"
                  fill
                  className="object-cover grayscale brightness-90 contrast-110 hover:grayscale-0 transition-all duration-500"
                  priority
                />
                
                {/* Clean dark subtle gradient overlay for text readability only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Overlay Editorial Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white border-l-4 border-[#C1121F]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#C1121F]">
                        Bengalier Vocals Network
                      </div>
                      <div className="text-base font-extrabold text-[#161616] mt-0.5">
                        Live Performance & Coordination
                      </div>
                    </div>
                    <Music className="w-6 h-6 text-[#C1121F]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle decorative line accent */}
            <div className="hidden sm:block absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-[#C1121F] pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
