import { motion } from "framer-motion";
import { Car, ArrowLeftRight, FileText, MessageCircle } from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Venta de Vehículos",
    description: "Autos seleccionados, verificados y listos para transferir. Encontrá el que se ajuste a lo que buscás.",
  },
  {
    icon: ArrowLeftRight,
    title: "Permutas",
    description: "Entregá tu auto como parte de pago. Evaluamos tu vehículo y te ofrecemos las mejores opciones.",
  },
  {
    icon: FileText,
    title: "Consignaciones",
    description: "Dejá tu vehículo en nuestras manos. Nos encargamos de venderlo por vos de forma rápida y segura.",
  },
  {
    icon: MessageCircle,
    title: "Asesoramiento",
    description: "Te guiamos en todo el proceso de compra, venta o cambio de vehículo con atención personalizada.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-secondary-foreground/60 mb-3 font-body">
            Lo que hacemos
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-secondary-foreground">
            NUESTROS SERVICIOS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-secondary-foreground/10 p-8 hover:border-secondary-foreground/30 transition-colors duration-300"
            >
              <service.icon className="w-8 h-8 text-secondary-foreground/70 mb-5" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-secondary-foreground mb-3 tracking-wide">
                {service.title.toUpperCase()}
              </h3>
              <p className="text-sm text-secondary-foreground/60 font-body leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
