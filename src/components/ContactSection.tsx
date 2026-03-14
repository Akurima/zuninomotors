import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contacto" className="py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-secondary-foreground/60 mb-3 font-body">
            Ubicación
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-secondary-foreground">
            CONTACTO
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <MapPin className="w-6 h-6 mx-auto mb-4 text-secondary-foreground/70" strokeWidth={1.5} />
            <h3 className="font-display text-lg tracking-wide mb-1">DIRECCIÓN</h3>
            <p className="text-sm text-secondary-foreground/60 font-body">
              Parada Rodó
              <br />
              Canelones, Uruguay
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <Phone className="w-6 h-6 mx-auto mb-4 text-secondary-foreground/70" strokeWidth={1.5} />
            <h3 className="font-display text-lg tracking-wide mb-1">TELÉFONOS</h3>
            <p className="text-sm text-secondary-foreground/60 font-body">
              091 094 375
              <br />
              098 463 623
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <Clock className="w-6 h-6 mx-auto mb-4 text-secondary-foreground/70" strokeWidth={1.5} />
            <h3 className="font-display text-lg tracking-wide mb-1">HORARIO</h3>
            <p className="text-sm text-secondary-foreground/60 font-body">
              Lunes a Viernes
              <br />
              9:00 – 18:00
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://wa.me/59891094375"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary-foreground text-secondary px-8 py-3.5 text-sm font-medium tracking-wider uppercase text-center hover:opacity-90 transition-opacity"
          >
            WhatsApp
          </a>
          <a
            href="https://maps.google.com/?q=Parada+Rodó+Canelones+Uruguay"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-secondary-foreground/30 text-secondary-foreground px-8 py-3.5 text-sm font-medium tracking-wider uppercase text-center hover:bg-secondary-foreground/10 transition-colors"
          >
            Google Maps
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
