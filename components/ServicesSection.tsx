"use client";

import { Volume2, Layers, Lightbulb, Guitar, Mic, CheckCircle } from "lucide-react";

interface Service {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  isPrimary?: boolean;
  features: string[];
  icon: React.ElementType;
}

const SERVICES: Service[] = [
  {
    number: "01",
    title: "ARTIST COORDINATION",
    subtitle: "Primary Service & Roster Management",
    description:
      "We match event organizers with singers, musicians, acoustic performers, and live music bands based on specific event themes, audience expectations, and budget ranges.",
    isPrimary: true,
    features: [
      "Artist selection & budget negotiation",
      "Performance schedule & setlist alignment",
      "On-site artist hospitality & coordination",
      "Emergency back-up artist contingencies",
    ],
    icon: Mic,
  },
  {
    number: "02",
    title: "SOUND SYSTEM",
    subtitle: "Production Support",
    description:
      "High-grade PA systems, stage monitors, vocal microphones, and sound engineering provided through verified production partners.",
    features: [
      "Event PA & line-array setups",
      "Vocal & instrument microphones",
      "On-site sound technician support",
    ],
    icon: Volume2,
  },
  {
    number: "03",
    title: "STAGE SETUP",
    subtitle: "Production Support",
    description:
      "Custom stage framing, performance platforms, and background backdrops tailored for indoor auditoriums and outdoor venues.",
    features: [
      "Modular stage platforming & risers",
      "Artist backdrop & branding structures",
      "Safety compliant stage framing",
    ],
    icon: Layers,
  },
  {
    number: "04",
    title: "LIGHTING",
    subtitle: "Production Support",
    description:
      "Concert lighting, stage spotlights, LED ambient washes, and mood illumination configured by experienced lighting operators.",
    features: [
      "Stage spot & profile lighting",
      "Mood washes & ambient color FX",
      "Lighting console operator support",
    ],
    icon: Lightbulb,
  },
  {
    number: "05",
    title: "MUSICAL EQUIPMENT",
    subtitle: "Production Support",
    description:
      "Instrument rental and backline support including keyboards, acoustic/electric drums, guitar amplifiers, and audio monitors.",
    features: [
      "Pro keyboards & synthesizer rental",
      "Acoustic & electronic drum kits",
      "Bass & guitar amp backline support",
    ],
    icon: Guitar,
  },
];

export default function ServicesSection() {
  const primaryService = SERVICES.find((s) => s.isPrimary);
  const supportServices = SERVICES.filter((s) => !s.isPrimary);

  return (
    <section id="services" className="py-20 md:py-28 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="text-[#C1121F] font-bold text-xs uppercase tracking-widest">
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#161616] tracking-tight">
            Services & Production Support
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-medium">
            Bengalier Vocals is primarily an artist coordination company, backed by comprehensive event production support through trusted partner networks.
          </p>
        </div>

        {/* Primary Service Featured Hero Card */}
        {primaryService && (
          <div className="mb-16 bg-[#FAFAFA] border-2 border-[#161616] p-8 sm:p-10 md:p-12 relative">
            <div className="absolute top-0 right-0 bg-[#C1121F] text-white text-xs font-bold uppercase tracking-widest px-4 py-2">
              Primary Focus
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl font-extrabold text-[#C1121F]">
                    {primaryService.number}
                  </span>
                  <div className="h-6 w-px bg-stone-300" />
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                    {primaryService.subtitle}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#161616]">
                  {primaryService.title}
                </h3>

                <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                  {primaryService.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {primaryService.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#C1121F] shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-stone-800">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-stone-200 space-y-4">
                <h4 className="text-base font-bold text-[#161616] border-b border-stone-200 pb-3">
                  Why Work With Bengalier Vocals?
                </h4>
                <ul className="space-y-3 text-xs sm:text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C1121F] font-bold">•</span>
                    <span>Direct coordination without bloated middleman commissions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C1121F] font-bold">•</span>
                    <span>Curated recommendations matched specifically to your audience.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C1121F] font-bold">•</span>
                    <span>Seamless integration with sound, stage, and lighting teams.</span>
                  </li>
                </ul>
                <a
                  href="#contact"
                  className="block w-full text-center bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs font-bold uppercase tracking-wider py-3 transition-colors mt-4"
                >
                  Inquire Artist Coordination
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Services Editorial Asymmetric List */}
        <div className="space-y-6">
          <div className="text-xs font-bold uppercase tracking-widest text-stone-500 border-b border-stone-200 pb-2">
            Event Production Support Services (Partner Network)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportServices.map((service) => {
              const IconComp = service.icon;
              return (
                <div
                  key={service.number}
                  className="bg-white border border-stone-200 p-6 flex flex-col justify-between hover:border-[#C1121F] transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-bold text-stone-400 group-hover:text-[#C1121F] transition-colors">
                        {service.number}
                      </span>
                      <IconComp className="w-5 h-5 text-stone-400 group-hover:text-[#C1121F] transition-colors" />
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-[#161616]">
                        {service.title}
                      </h4>
                      <p className="text-xs font-semibold text-stone-500 mt-0.5">
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-stone-100">
                    <ul className="space-y-1.5">
                      {service.features.map((item, idx) => (
                        <li key={idx} className="text-[11px] text-stone-500 flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-[#C1121F] rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
