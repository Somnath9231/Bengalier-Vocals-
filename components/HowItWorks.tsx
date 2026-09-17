"use client";

const STEPS = [
  {
    number: "01",
    title: "Tell Us About Your Event",
    description:
      "Share your event type, preferred date, venue location, expected audience size, and musical preferences with our team.",
  },
  {
    number: "02",
    title: "Choose The Artist",
    description:
      "We recommend suitable singers, instrumentalists, or live bands from our network matching your style requirements.",
  },
  {
    number: "03",
    title: "Confirm Budget & Arrangements",
    description:
      "We finalize artist fees, schedule timing, and optional sound/stage requirements with transparent pricing.",
  },
  {
    number: "04",
    title: "We Coordinate The Performance",
    description:
      "Our team manages artist arrival, sound check, stage logistics, and performance execution on event day.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12">
          <div className="text-[#C1121F] font-bold text-xs uppercase tracking-widest mb-1">
            Simple Process
          </div>
          <h2 className="text-3xl font-extrabold text-[#161616] tracking-tight">
            How It Works
          </h2>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-white border-t-4 border-[#C1121F] p-6 shadow-xs space-y-3"
            >
              <span className="font-mono text-3xl font-extrabold text-[#C1121F] block">
                {step.number}
              </span>
              <h3 className="text-base font-bold text-[#161616]">
                {step.title}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
