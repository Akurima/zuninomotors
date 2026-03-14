import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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

const VehicleCard = ({ vehicle, index }: { vehicle: DemoVehicle | Vehicle; index: number }) => {
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
          <a
            href={`https://wa.me/59891094375?text=Hola%2C%20me%20interesa%20el%20${vehicle.brand}%20${vehicle.model}%20${vehicle.year}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground px-5 py-2 text-xs font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            Consultar
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const VehiclesSection = () => {
  const [dbVehicles, setDbVehicles] = useState<Vehicle[]>([]);
  const [loaded, setLoaded] = useState(false);

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
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehiclesSection;
