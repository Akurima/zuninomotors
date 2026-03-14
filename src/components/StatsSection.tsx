import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    { value: "10+", label: "Años de experiencia" },
    { value: "500+", label: "Vehículos vendidos" },
    { value: "100%", label: "Documentación al día" },
    { value: "⭐", label: "Satisfacción garantizada" },
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <span className="font-display text-4xl md:text-5xl text-primary-foreground block mb-2">
                {stat.value}
              </span>
              <span className="text-xs text-primary-foreground/60 font-body tracking-wider uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
