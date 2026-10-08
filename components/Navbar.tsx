"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, MessageSquare, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import ContactModal from "./ContactModal";

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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 dark:bg-stone-950/95 backdrop-blur-md shadow-sm border-b border-stone-200 dark:border-stone-800 py-3"
            : "bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            
            {/* Logo Section - Increased Size */}
            <Link
              href="#home"
              className="flex items-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[#C1121F] rounded-sm"
            >
              <div className="relative h-14 sm:h-18 md:h-20 lg:h-22 w-52 sm:w-72 md:w-80 lg:w-96 transition-all duration-200">
                <Image
                  src="/logo.jpg"
                  alt="Bengalier Vocals Logo"
                  fill
                  className="object-contain object-left dark:brightness-110"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - Larger text & clean spacing for Laptop/Desktop */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {NAV_ITEMS.map((item) => {
                const sectionId = item.href.substring(1);
                const isActive = activeSection === sectionId;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-base font-bold tracking-wide transition-colors duration-150 relative py-1 ${
                      isActive
                        ? "text-[#C1121F]"
                        : "text-stone-800 dark:text-stone-200 hover:text-[#C1121F] dark:hover:text-[#C1121F]"
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
            <div className="hidden md:flex items-center gap-3.5">
              {/* Contact Button with Phone Icon & "Contact" label */}
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-extrabold border border-stone-300 dark:border-stone-700 px-4 py-2.5 flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                aria-label="Open Contact Information"
              >
                <Phone className="w-4 h-4 text-[#C1121F]" />
                <span>Contact</span>
              </button>

              {/* Dark Mode Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 text-stone-800 dark:text-stone-200 hover:text-[#C1121F] dark:hover:text-[#C1121F] bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
                aria-label="Toggle Dark Mode"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-700" />
                )}
              </button>

              {/* Book Artist Primary CTA */}
              <a
                href="#contact"
                className="bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs uppercase tracking-wider font-extrabold px-5 py-2.5 transition-colors duration-150 inline-flex items-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Book Artist</span>
              </a>
            </div>

            {/* Mobile View Controls (Only visible on Mobile Phones < 768px) */}
            <div className="flex md:hidden items-center gap-2">
              {/* Contact Trigger Mobile */}
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 text-xs font-extrabold px-3 py-2 flex items-center gap-1.5"
                aria-label="Contact Information"
              >
                <Phone className="w-3.5 h-3.5 text-[#C1121F]" />
                <span>Contact</span>
              </button>

              {/* Dark Mode Toggle Mobile */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-700" />
                )}
              </button>

              {/* Hamburger Burger Menu Button - STRICTLY FOR PHONES */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-800 dark:text-stone-200 hover:text-[#C1121F] focus:outline-none"
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

        {/* Mobile Burger Menu Dropdown (Phone aspect ratio) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 px-4 pt-4 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-stone-900 dark:text-stone-100 hover:text-[#C1121F] dark:hover:text-[#C1121F] font-bold text-lg py-2 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center"
                >
                  <span>{item.label}</span>
                  <span className="text-[#C1121F] text-sm font-mono">→</span>
                </Link>
              ))}
            </div>

            <div className="pt-2 flex flex-col space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full text-center py-3 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-extrabold text-base flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C1121F]" />
                <span>Contact Details (Call & WhatsApp)</span>
              </button>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#C1121F] text-white font-extrabold text-sm uppercase tracking-wider py-3.5 shadow-sm"
              >
                Book an Artist Now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Interactive Contact Modal Card System */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
