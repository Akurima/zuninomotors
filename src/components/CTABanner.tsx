import { motion } from "framer-motion";

const CTABanner = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-4xl md:text-6xl text-primary-foreground mb-4">
            ¿TENÉS UN AUTO PARA VENDER?
          </h2>
          <p className="text-primary-foreground/70 text-lg font-body font-light mb-8 max-w-lg mx-auto">
            Recibimos tu vehículo en permuta o lo vendemos por vos en consignación. Consultanos sin compromiso.
          </p>
          <a
            href="https://wa.me/59891094375?text=Hola%2C%20quiero%20consultar%20sobre%20vender%20mi%20auto"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-foreground text-primary px-10 py-4 text-sm font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            Consultar ahora
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
