import { motion } from "framer-motion";
import { ShieldCheck, Users, Star } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, title: "Autos Verificados", description: "Cada vehículo pasa por una revisión exhaustiva antes de estar disponible." },
  { icon: Users, title: "Clientes Satisfechos", description: "Años de trayectoria en el mercado automotor de Canelones nos respaldan." },
  { icon: Star, title: "Atención Personalizada", description: "Te acompañamos en cada paso del proceso con dedicación y transparencia." },
];

const TrustSection = () => {
  return (
    <section className="py-24 bg-accent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body">
            Confianza
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-accent-foreground">
            ¿POR QUÉ ELEGIRNOS?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 border border-border mb-5">
                <item.icon className="w-7 h-7 text-accent-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-accent-foreground mb-2 tracking-wide uppercase">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
