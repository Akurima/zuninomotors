import { motion } from "framer-motion";

const faqs = [
  {
    q: "¿Qué documentación necesito para comprar un vehículo?",
    a: "Solo necesitás tu cédula de identidad vigente. Nosotros nos encargamos de toda la gestión de transferencia.",
  },
  {
    q: "¿Aceptan mi auto como parte de pago?",
    a: "Sí, trabajamos con permutas. Evaluamos tu vehículo al instante y te damos un valor justo como parte de pago.",
  },
  {
    q: "¿Cómo funciona la consignación?",
    a: "Dejás tu auto con nosotros y nos encargamos de la venta. Te mantenemos informado durante todo el proceso y cobrás cuando se concreta la operación.",
  },
  {
    q: "¿Los vehículos tienen garantía?",
    a: "Todos nuestros vehículos pasan por una revisión completa. Consultá las condiciones específicas de cada unidad.",
  },
  {
    q: "¿Puedo financiar la compra?",
    a: "Trabajamos con opciones de financiamiento. Consultanos por WhatsApp para conocer las alternativas disponibles.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-accent">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body">
            Dudas frecuentes
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-accent-foreground">
            PREGUNTAS FRECUENTES
          </h2>
        </motion.div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group border-b border-border"
            >
              <summary className="flex items-center justify-between py-5 cursor-pointer list-none font-body text-sm font-medium text-accent-foreground hover:text-foreground transition-colors">
                {faq.q}
                <span className="font-display text-xl text-muted-foreground group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <p className="pb-5 text-sm text-muted-foreground font-body leading-relaxed">
                {faq.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
