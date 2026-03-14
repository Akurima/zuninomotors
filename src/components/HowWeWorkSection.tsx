import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Elegí tu vehículo", description: "Explorá nuestro inventario y encontrá el auto ideal para vos." },
  { number: "02", title: "Coordiná una visita", description: "Contactanos por WhatsApp o teléfono para agendar una visita." },
  { number: "03", title: "Evaluamos permuta", description: "Si tenés un auto para entregar, lo tasamos al instante." },
  { number: "04", title: "Cerramos la operación", description: "Proceso rápido, transparente y con toda la documentación al día." },
];

const HowWeWorkSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body">
            Proceso
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">
            CÓMO TRABAJAMOS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <span className="font-display text-7xl text-muted/80 block mb-4">
                {step.number}
              </span>
              <h3 className="font-display text-xl text-foreground mb-2 tracking-wide uppercase">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWorkSection;
