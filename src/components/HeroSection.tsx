import { motion } from "framer-motion";
import heroDesktop from "@/assets/background.png";
import heroMobile from "@/assets/movilebackground.png";

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        
        {/* 📱 Mobile */}
        <img
          src={heroMobile}
          alt="Zunino Motors mobile"
          className="w-full h-full object-cover object-[58%_center] md:hidden"
        />

        {/* 📲 Tablet + 💻 Desktop */}
        <img
          src={heroDesktop}
          alt="Zunino Motors desktop"
          className="hidden md:block w-full h-full object-contain bg-black lg:object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-end min-h-screen pb-16 md:pb-28 lg:pb-40">
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white text-base md:text-xl lg:text-2xl mx-auto mb-8 md:mb-10 font-light max-w-xl md:max-w-2xl lg:max-w-3xl"
        >
          <b>Vehículos seleccionados, excelentes oportunidades y atención personalizada.</b>
          <br />
          <b>Comprá, vendé o permutá tu auto con confianza.</b>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#vehiculos"
            className="bg-white text-black px-8 py-3.5 text-sm font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            Ver Vehículos
          </a>

          <a
            href="https://wa.me/59891094375"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/40 text-white px-8 py-3.5 text-sm font-medium tracking-wider uppercase hover:bg-white/10 transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10 bg-white/40"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;