import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import VehiclesSection from "@/components/VehiclesSection";
import CTABanner from "@/components/CTABanner";
import ServicesSection from "@/components/ServicesSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <VehiclesSection />
      <CTABanner />
      <ServicesSection />
      <HowWeWorkSection />
      <TestimonialsSection />
      <TrustSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
