"use client";

import { ShieldCheck, HeartHandshake, Music, Users, Radio, Wrench } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-[#C1121F] font-bold text-xs uppercase tracking-widest">
              About Bengalier Vocals
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#161616] tracking-tight leading-tight">
              Connecting Event Organizers With Real Live Music & Stage Production.
            </h2>
            
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-medium">
              Bengalier Vocals is an emerging music coordination company built around connecting event organizers with artists and the technical professionals needed to bring a live performance together seamlessly.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We bridge the gap between clients seeking authentic musical talent and a curated network of senior virtuosos, emerging acoustic voices, sound engineers, stage contractors, lighting designers, and instrument rental partners.
            </p>

            {/* Network Ecosystem Pill Grid */}
            <div className="pt-4 border-t border-stone-200">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                Our Collaborative Ecosystem
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#FAFAFA] border border-stone-200 flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#C1121F]" />
                  <span className="text-xs font-bold text-stone-800">Senior Artists</span>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-stone-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C1121F]" />
                  <span className="text-xs font-bold text-stone-800">Emerging Performers</span>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-stone-200 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#C1121F]" />
                  <span className="text-xs font-bold text-stone-800">Sound Partners</span>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-stone-200 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#C1121F]" />
                  <span className="text-xs font-bold text-stone-800">Stage Contractors</span>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-stone-200 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#C1121F]" />
                  <span className="text-xs font-bold text-stone-800">Lighting Specialists</span>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-stone-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C1121F]" />
                  <span className="text-xs font-bold text-stone-800">Rental Partners</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Value Proposition Callout Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#161616] text-white p-8 sm:p-10 border-l-4 border-[#C1121F] space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                Our Commitment To You
              </h3>

              <div className="space-y-4 text-sm text-stone-300">
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="text-[#C1121F]">✓</span> Honest Pricing
                  </div>
                  <p className="text-stone-400 text-xs">
                    Clear artist quotes and technical cost estimates without hidden surcharges.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="text-[#C1121F]">✓</span> Reliable Scheduling
                  </div>
                  <p className="text-stone-400 text-xs">
                    Punctual artist arrival, dedicated sound check times, and strict performance timings.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="text-[#C1121F]">✓</span> Event Alignment
                  </div>
                  <p className="text-stone-400 text-xs">
                    Matching songs, volume levels, and stage demeanor strictly to your occasion.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 italic">
                "We focus on creating smooth live music experiences for every host and organizer."
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
