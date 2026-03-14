import { motion } from "framer-motion";
import heroImage from "@/assets/hero-showroom.jpg";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Zunino Motors showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary-foreground/70 text-sm tracking-[0.3em] uppercase mb-4 font-body"
        >
          Parada Rodó · Canelones · Uruguay
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl text-primary-foreground leading-none mb-6"
        >
          ZUNINO
          <br />
          MOTORS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-primary-foreground/80 text-lg md:text-xl max-w-xl mx-auto mb-10 font-body font-light"
        >
          Compra, venta y permuta de vehículos.
          <br />
          Encontrá tu próximo auto con confianza.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#vehiculos"
            className="bg-primary-foreground text-foreground px-8 py-3.5 text-sm font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            Ver Vehículos
          </a>
          <a
            href="https://wa.me/59891094375"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-primary-foreground/40 text-primary-foreground px-8 py-3.5 text-sm font-medium tracking-wider uppercase hover:bg-primary-foreground/10 transition-colors"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-primary-foreground/40"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
