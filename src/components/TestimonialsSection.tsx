import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Martín R.",
    text: "Excelente atención. Me ayudaron a encontrar el auto ideal y el proceso fue rapidísimo. Muy recomendable.",
    location: "Canelones",
  },
  {
    name: "Laura S.",
    text: "Dejé mi auto en consignación y lo vendieron en menos de dos semanas. Totalmente transparente y profesional.",
    location: "Pando",
  },
  {
    name: "Diego F.",
    text: "Hice una permuta y quedé muy contento. Evaluaron bien mi vehículo y me dieron opciones justas.",
    location: "Las Piedras",
  },
];

const TestimonialsSection = () => {
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
            Testimonios
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">
            LO QUE DICEN NUESTROS CLIENTES
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-border p-8"
            >
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div>
                <p className="font-display text-lg text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground font-body">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
