import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArtistsSection from "@/components/ArtistsSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorks from "@/components/HowItWorks";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <Navbar />
      <Hero />
      <ArtistsSection />
      <ServicesSection />
      <HowItWorks />
      <AboutSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
