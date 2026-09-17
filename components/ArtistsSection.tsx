"use client";

import { UserCheck, Sparkles, Send, Music2, Mic2 } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  isFeatured?: boolean;
}

const ARTIST_NETWORK: Artist[] = [
  {
    id: "tanmay-kar",
    name: "Tanmay Kar & Friends",
    category: "Senior Performance Group & Live Band",
    description:
      "A renowned musical ensemble known for soul-stirring vocal harmonies, live acoustic arrangements, and captivating stage presence across public fests and private galas.",
    badge: "Featured Artist",
    isFeatured: true,
  },
  {
    id: "sujan-media",
    name: "Sujan Media",
    category: "Concert Ensemble & Folk/Fusion Vocalists",
    description:
      "Dynamic live music collective bringing rich Bengali & Indian vocal traditions blended with contemporary instrumentals suitable for grand stage productions.",
    badge: "Featured Artist",
    isFeatured: true,
  },
  {
    id: "the-local-pharmacy",
    name: "The Local Pharmacy",
    category: "Live Performance Band",
    description:
      "An energetic live performance band bringing dynamic stage presence and acoustic/rock arrangements ideal for college events, concerts, and private celebrations.",
    badge: "Featured Band",
    isFeatured: true,
  },
  {
    id: "senior-artists",
    name: "Senior Artists Network",
    category: "Established Vocal Virtuosos & Classical Masters",
    description:
      "A curated roster of veteran singers, classic vocalists, and experienced instrumentalists available for prestigious cultural events, weddings, and concerts.",
    badge: "Established Roster",
    isFeatured: false,
  },
  {
    id: "emerging-artists",
    name: "Junior & Emerging Voices",
    category: "Fresh Musical Talent & Acoustic Performers",
    description:
      "Promising young singers, solo acoustic acts, and energetic emerging bands ideal for intimate celebrations, corporate events, and youthful music nights.",
    badge: "Rising Talent",
    isFeatured: false,
  },
];

export default function ArtistsSection() {
  const handleEnquire = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="artists" className="py-20 md:py-28 bg-[#FAFAFA] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="flex items-center gap-2 text-[#C1121F] font-bold text-xs uppercase tracking-widest">
            <Mic2 className="w-4 h-4" />
            <span>Artists for Every Occasion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#161616] tracking-tight">
            Artists We Coordinate With
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-medium">
            From college events and private celebrations to public events, concerts, corporate galas, and cultural programs, we connect you with the right artists for your occasion.
          </p>
        </div>

        {/* Featured Artists Showcase (Editorial Large Layout) */}
        <div className="space-y-8 mb-12">
          {ARTIST_NETWORK.filter((a) => a.isFeatured).map((artist, idx) => (
            <div
              key={artist.id}
              className="bg-white border border-stone-200 p-6 sm:p-8 md:p-10 transition-all hover:border-[#C1121F] grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Number & Name */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-stone-100 text-stone-800 uppercase tracking-widest border border-stone-200">
                    {artist.badge}
                  </span>
                  <span className="text-stone-400 font-mono text-sm">0{idx + 1}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#161616]">
                  {artist.name}
                </h3>
                
                <div className="text-sm font-semibold text-[#C1121F] uppercase tracking-wider flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  <span>{artist.category}</span>
                </div>
                
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  {artist.description}
                </p>
              </div>

              {/* Right Column: CTA & Action Box */}
              <div className="md:col-span-5 flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-stone-200 pt-6 md:pt-0 md:pl-8 space-y-4">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Available for Booking via Bengalier Vocals
                </div>
                
                <button
                  onClick={() => handleEnquire()}
                  className="w-full sm:w-auto bg-[#161616] hover:bg-[#C1121F] text-white text-xs uppercase tracking-wider font-bold px-6 py-3.5 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enquire for Booking</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ARTIST_NETWORK.filter((a) => !a.isFeatured).map((artist, idx) => (
            <div
              key={artist.id}
              className="bg-white border border-stone-200 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#C1121F] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-stone-100 text-stone-700 uppercase tracking-wider border border-stone-200">
                    {artist.badge}
                  </span>
                  <span className="text-stone-400 font-mono text-xs">0{idx + 4}</span>
                </div>
                
                <h4 className="text-xl font-bold text-[#161616]">{artist.name}</h4>
                <div className="text-xs font-semibold text-[#C1121F] uppercase tracking-wider">
                  {artist.category}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {artist.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">Custom Program Enquiries</span>
                <button
                  onClick={() => handleEnquire()}
                  className="text-xs font-bold uppercase tracking-wider text-[#C1121F] hover:text-[#8F0D16] flex items-center gap-1 group"
                >
                  <span>Enquire</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Music Formats & Genre Coverage Bar */}
        <div className="mt-12 bg-white border border-stone-200 p-6 sm:p-8 space-y-4">
          <div className="text-xs font-mono font-bold text-[#C1121F] uppercase tracking-widest">
            Diverse Genres & Formats
          </div>
          <p className="text-stone-800 text-sm sm:text-base font-semibold leading-relaxed">
            From Bollywood and Tollywood to Hindi, Bengali and folk music, our artist network includes solo performers, bands, male and female vocalists, and artists across different experience levels.
          </p>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
            {["Bollywood", "Tollywood", "Hindi Music", "Bengali Music", "Bengali Folk", "Live Bands", "Solo Artists", "Male Vocalists", "Female Vocalists", "College Fests", "Private Events", "Concerts"].map((tag) => (
              <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-[#FAFAFA] border border-stone-200 text-stone-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Custom Artist Request Callout */}
        <div className="mt-8 bg-stone-900 text-white p-8 md:p-10 border-l-4 border-[#C1121F] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C1121F]">
              <Sparkles className="w-4 h-4" />
              <span>Custom Artist Match</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold">
              Looking for a Specific Artist or Genre?
            </h4>
            <p className="text-stone-300 text-sm max-w-2xl">
              We work closely with artists across classical, folk, fusion, acoustic, and modern genres. Tell us your preference and budget, and we will source the perfect performer.
            </p>
          </div>

          <a
            href="#contact"
            className="shrink-0 bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 transition-colors"
          >
            Request Custom Artist
          </a>
        </div>

      </div>
    </section>
  );
}

