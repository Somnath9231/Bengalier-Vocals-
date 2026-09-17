"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MessageSquare, Heart } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
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

export default function Footer() {

  return (
    <footer className="bg-[#161616] text-white pt-16 pb-12 border-t-4 border-[#C1121F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Logo Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white p-3 inline-block border border-stone-700">
              <div className="relative h-[4.5rem] w-[18rem] sm:w-[20rem]">
                <Image
                  src="/logo.jpg"
                  alt="Bengalier Vocals Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            
            <p className="text-stone-400 text-sm max-w-md font-medium">
              Bengalier Vocals — Artist Coordination & Event Production Support for private celebrations, public events, and live stage performances.
            </p>

            <div className="text-xs font-mono text-stone-500 uppercase tracking-widest pt-2">
              Based in Kolkata, West Bengal
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C1121F]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-stone-300">
              <li>
                <Link href="#home" className="hover:text-[#C1121F] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#artists" className="hover:text-[#C1121F] transition-colors">
                  Artist Network
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-[#C1121F] transition-colors">
                  Services & Sound/Stage
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-[#C1121F] transition-colors">
                  About Bengalier Vocals
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-[#C1121F] transition-colors">
                  Contact & Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Summary Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C1121F]">
              Management & Contact
            </h4>
            
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">Founder:</span>
                <span className="font-bold text-white">Ayon</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">Support & Logistics:</span>
                <span className="font-bold text-white">Somnath</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">Calls / WhatsApp:</span>
                <a
                  href="tel:+916290713080"
                  className="font-bold text-[#C1121F] hover:underline"
                >
                  +91 62907 13080
                </a>
              </div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                <span className="text-stone-400">WhatsApp Support:</span>
                <a
                  href="https://wa.me/919432882915"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-stone-200 hover:text-[#C1121F]"
                >
                  +91 94328 82915
                </a>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-stone-400">Instagram:</span>
                <a
                  href="https://www.instagram.com/bengaliervocals/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-stone-200 hover:text-[#C1121F] flex items-center gap-1"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#C1121F]" />
                  <span>@bengaliervocals</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © 2026 Bengalier Vocals. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted for live music events with passion & clarity</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
