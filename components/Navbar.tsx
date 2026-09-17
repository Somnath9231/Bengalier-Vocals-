"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, MessageSquare } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Artists", href: "#artists" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track active section
      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200 py-3"
          : "bg-white border-b border-stone-200 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Increased size by 1.5x */}
          <Link
            href="#home"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#C1121F] rounded-sm p-1"
          >
            <div className="relative h-14 sm:h-16 w-48 sm:w-64">
              <Image
                src="/logo.jpg"
                alt="Bengalier Vocals Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.substring(1);
              const isActive = activeSection === sectionId;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-150 relative py-1 ${
                    isActive
                      ? "text-[#C1121F]"
                      : "text-stone-800 hover:text-[#C1121F]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C1121F]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+916290713080"
              className="text-stone-700 hover:text-[#C1121F] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C1121F]" />
              <span>+91 62907 13080</span>
            </a>
            <a
              href="#contact"
              className="bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-none transition-colors duration-150 inline-flex items-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Book an Artist
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#contact"
              className="bg-[#C1121F] text-white text-xs uppercase tracking-wider font-bold px-3 py-2 transition-colors inline-flex items-center"
            >
              Book
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-[#C1121F] focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-stone-900 hover:text-[#C1121F] font-semibold text-base py-2 border-b border-stone-100 flex justify-between items-center"
              >
                <span>{item.label}</span>
                <span className="text-[#C1121F] text-xs font-mono">→</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            <a
              href="tel:+916290713080"
              className="w-full text-center py-2.5 border border-stone-300 text-stone-900 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#C1121F]" />
              Call +91 62907 13080
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#C1121F] text-white font-bold text-sm uppercase tracking-wider py-3 shadow-sm"
            >
              Book an Artist Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
