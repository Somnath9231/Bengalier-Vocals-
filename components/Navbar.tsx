"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, MessageSquare, Sun, Moon, ArrowRight, Music2 } from "lucide-react";
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

  // Lock body scroll when mobile slide menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

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
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            
            {/* Logo Section */}
            <Link
              href="#home"
              className="flex items-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[#C1121F] rounded-sm"
            >
              <div className="relative h-12 sm:h-16 md:h-20 lg:h-22 w-44 sm:w-64 md:w-80 lg:w-96 transition-all duration-200">
                <Image
                  src="/logo.jpg"
                  alt="Bengalier Vocals Logo"
                  fill
                  className="object-contain object-left dark:brightness-110"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation (Unchanged for Laptop/Desktop) */}
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
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-extrabold border border-stone-300 dark:border-stone-700 px-4 py-2.5 flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                aria-label="Open Contact Information"
              >
                <Phone className="w-4 h-4 text-[#C1121F]" />
                <span>Contact</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full bg-stone-200 dark:bg-stone-800 p-1 transition-colors duration-300 border border-stone-300 dark:border-stone-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
                role="switch"
                aria-checked={theme === "dark"}
                aria-label="Toggle Light and Dark Mode"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <Moon className="w-3.5 h-3.5 text-stone-400 dark:text-amber-300" />
                </div>
                <span
                  className={`pointer-events-none z-10 inline-block h-6 w-6 rounded-full bg-white dark:bg-[#C1121F] shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                    theme === "dark" ? "translate-x-6" : "translate-x-0"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </span>
              </button>

              <a
                href="#contact"
                className="bg-[#C1121F] hover:bg-[#8F0D16] text-white text-xs uppercase tracking-wider font-extrabold px-5 py-2.5 transition-colors duration-150 inline-flex items-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Book Artist</span>
              </a>
            </div>

            {/* Mobile View Controls (Strictly Mobile < 768px) */}
            {/* Note: Theme toggle is positioned to the LEFT of the Contact button on Mobile header */}
            <div className="flex md:hidden items-center gap-2">
              {/* Dark / Light Mode Toggle Switch Mobile - Positioned to the Left */}
              <button
                type="button"
                onClick={toggleTheme}
                className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-stone-200 dark:bg-stone-800 p-0.5 transition-colors duration-300 border border-stone-300 dark:border-stone-700 shadow-inner"
                role="switch"
                aria-checked={theme === "dark"}
                aria-label="Toggle Theme"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                  <Sun className="w-3 h-3 text-amber-500" />
                  <Moon className="w-3 h-3 text-stone-400 dark:text-amber-300" />
                </div>
                <span
                  className={`pointer-events-none z-10 inline-block h-5 w-5 rounded-full bg-white dark:bg-[#C1121F] shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="w-3 h-3 text-white" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-500" />
                  )}
                </span>
              </button>

              {/* Contact Trigger Mobile */}
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 text-xs font-extrabold px-2.5 py-1.5 flex items-center gap-1 cursor-pointer"
                aria-label="Contact Information"
              >
                <Phone className="w-3.5 h-3.5 text-[#C1121F]" />
                <span>Contact</span>
              </button>

              {/* Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-stone-800 dark:text-stone-200 hover:text-[#C1121F] focus:outline-none cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Side Slide Pull Drawer Menu (Mobile Phones Only) */}
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sliding Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-white dark:bg-stone-950 border-l border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out transform md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Drawer Header with Title & Close Button */}
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <Music2 className="w-5 h-5 text-[#C1121F]" />
              <span className="font-extrabold text-base tracking-wide text-stone-900 dark:text-white uppercase">
                Navigation
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-stone-500 hover:text-[#C1121F] dark:text-stone-400 dark:hover:text-white bg-stone-100 dark:bg-stone-900 transition-colors cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.substring(1);
              const isActive = activeSection === sectionId;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-lg font-extrabold py-3 px-3 rounded-md transition-all ${
                    isActive
                      ? "bg-[#C1121F]/10 text-[#C1121F]"
                      : "text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-[#C1121F]"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? "text-[#C1121F] translate-x-1" : "text-stone-400"}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-3">
          {/* Mobile Theme Toggle Row in Drawer */}
          <div className="flex items-center justify-between px-3 py-2 bg-stone-50 dark:bg-stone-900/60 rounded-md border border-stone-200 dark:border-stone-800">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-stone-200 dark:bg-stone-800 p-0.5 transition-colors duration-300 border border-stone-300 dark:border-stone-700 shadow-inner"
              role="switch"
              aria-checked={theme === "dark"}
              aria-label="Toggle Theme"
            >
              <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                <Sun className="w-3 h-3 text-amber-500" />
                <Moon className="w-3 h-3 text-stone-400 dark:text-amber-300" />
              </div>
              <span
                className={`pointer-events-none z-10 inline-block h-5 w-5 rounded-full bg-white dark:bg-[#C1121F] shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              >
                {theme === "dark" ? (
                  <Moon className="w-3 h-3 text-white" />
                ) : (
                  <Sun className="w-3 h-3 text-amber-500" />
                )}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsContactModalOpen(true);
            }}
            className="w-full text-center py-3 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-extrabold text-sm flex items-center justify-center gap-2 rounded-md hover:border-[#C1121F] transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#C1121F]" />
            <span>Contact Details (Call & WhatsApp)</span>
          </button>

          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full block text-center bg-[#C1121F] hover:bg-[#8F0D16] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-md shadow-sm transition-colors"
          >
            Book an Artist Now
          </a>
        </div>
      </div>

      {/* Interactive Contact Modal Card System */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
