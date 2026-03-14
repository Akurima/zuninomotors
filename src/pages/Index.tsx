import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VehiclesSection from "@/components/VehiclesSection";
import ServicesSection from "@/components/ServicesSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import TrustSection from "@/components/TrustSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <VehiclesSection />
      <ServicesSection />
      <HowWeWorkSection />
      <TrustSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
