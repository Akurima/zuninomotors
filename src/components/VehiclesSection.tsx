import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Fallback images for demo
import carCorolla from "@/assets/car-corolla.jpg";
import carGolf from "@/assets/car-golf.jpg";
import carOnix from "@/assets/car-onix.jpg";
import carEcosport from "@/assets/car-ecosport.jpg";
import carDuster from "@/assets/car-duster.jpg";
import carCronos from "@/assets/car-cronos.jpg";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

interface DemoVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: string;
  price: string;
  fuel: string;
  image_url: string;
}

const demoVehicles: DemoVehicle[] = [
  { id: "demo-1", brand: "Toyota", model: "Corolla", year: 2016, km: "110.000", price: "16.500", fuel: "Nafta", image_url: carCorolla },
  { id: "demo-2", brand: "Volkswagen", model: "Golf", year: 2018, km: "78.000", price: "19.900", fuel: "Nafta", image_url: carGolf },
  { id: "demo-3", brand: "Chevrolet", model: "Onix", year: 2020, km: "45.000", price: "14.800", fuel: "Nafta", image_url: carOnix },
  { id: "demo-4", brand: "Ford", model: "EcoSport", year: 2019, km: "62.000", price: "18.200", fuel: "Nafta", image_url: carEcosport },
  { id: "demo-5", brand: "Renault", model: "Duster", year: 2017, km: "95.000", price: "15.500", fuel: "Nafta", image_url: carDuster },
  { id: "demo-6", brand: "Fiat", model: "Cronos", year: 2021, km: "32.000", price: "17.300", fuel: "Nafta", image_url: carCronos },
];

const VehicleCard = ({ vehicle, index, onDetails }: { vehicle: DemoVehicle | Vehicle; index: number; onDetails: (v: DemoVehicle | Vehicle) => void }) => {
const imgSrc =
 vehicle.image_url && vehicle.image_url !== ""
  ? vehicle.image_url
  : carCorolla;
  const fuel = ('fuel' in vehicle && vehicle.fuel) || "Nafta";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={imgSrc}
          alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-2xl text-card-foreground">
          {vehicle.brand} {vehicle.model}
        </h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-body">
          <span>{vehicle.year}</span>
          <span className="w-px h-3 bg-border" />
          <span>{vehicle.km} km</span>
          <span className="w-px h-3 bg-border" />
          <span>{fuel}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="font-display text-2xl text-card-foreground">
            USD {vehicle.price}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onDetails(vehicle)}
              className="border border-border text-foreground px-4 py-2 text-xs font-medium tracking-wider uppercase hover:bg-muted transition-colors"
            >
              Saber más
            </button>
            <a
              href={`https://wa.me/59891094375?text=Hola%2C%20me%20interesa%20el%20${vehicle.brand}%20${vehicle.model}%20${vehicle.year}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-4 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              Consultar
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VehicleDetailModal = ({ vehicle, onClose }: { vehicle: DemoVehicle | Vehicle | null; onClose: () => void }) => {
  if (!vehicle) return null;
  const imgSrc = vehicle.image_url && vehicle.image_url !== "" ? vehicle.image_url : carCorolla;
  const fuel = ('fuel' in vehicle && vehicle.fuel) || "Nafta";
  const transmission = ('transmission' in vehicle && vehicle.transmission) || "Manual";
  const description = ('description' in vehicle && vehicle.description) || "Vehículo en excelente estado, revisado y listo para transferir. Consultanos para más información.";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm p-2 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={imgSrc}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <h3 className="font-display text-4xl text-card-foreground">
              {vehicle.brand} {vehicle.model}
            </h3>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground font-body">
              <span className="bg-muted px-3 py-1">{vehicle.year}</span>
              <span className="bg-muted px-3 py-1">{vehicle.km} km</span>
              <span className="bg-muted px-3 py-1">{fuel}</span>
              <span className="bg-muted px-3 py-1">{transmission}</span>
            </div>

            <p className="font-display text-3xl text-card-foreground mt-6">
              USD {vehicle.price}
            </p>

            <div className="mt-6 border-t border-border pt-6">
              <h4 className="font-display text-lg text-card-foreground mb-2 uppercase tracking-wider">Descripción</h4>
              <p className="text-muted-foreground font-body leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href={`https://wa.me/59891094375?text=Hola%2C%20me%20interesa%20el%20${vehicle.brand}%20${vehicle.model}%20${vehicle.year}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
              >
                Consultar por WhatsApp
              </a>
              <button
                onClick={onClose}
                className="border border-border text-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase hover:bg-muted transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const VehiclesSection = () => {
  const [dbVehicles, setDbVehicles] = useState<Vehicle[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<DemoVehicle | Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setDbVehicles(data);
      setLoaded(true);
    };
    fetchVehicles();
  }, []);

  const displayVehicles = dbVehicles.length > 0 ? dbVehicles : demoVehicles;

  return (
    <section id="vehiculos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body">
            Inventario
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">
            VEHÍCULOS DISPONIBLES
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} onDetails={setSelectedVehicle} />
          ))}
        </div>
      </div>

      {selectedVehicle && (
        <VehicleDetailModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
      )}
    </section>
  );
};

export default VehiclesSection;
