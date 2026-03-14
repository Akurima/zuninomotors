import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Eye, EyeOff, Upload } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState<VehicleInsert>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    km: "",
    price: "",
    fuel: "Nafta",
    transmission: "Manual",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    checkAuth();
    fetchVehicles();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) navigate("/admin/login");
  };

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Error al cargar vehículos");
    else setVehicles(data || []);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("vehicle-images")
      .upload(fileName, file);
    if (error) {
      toast.error("Error al subir imagen");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("vehicle-images")
      .getPublicUrl(fileName);
    setForm({ ...form, image_url: urlData.publicUrl });
    setUploading(false);
    toast.success("Imagen subida");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      const { error } = await supabase
        .from("vehicles")
        .update(form)
        .eq("id", editingVehicle.id);
      if (error) toast.error("Error al actualizar");
      else toast.success("Vehículo actualizado");
    } else {
      const { error } = await supabase.from("vehicles").insert(form);
      if (error) toast.error("Error al agregar");
      else toast.success("Vehículo agregado");
    }
    resetForm();
    fetchVehicles();
  };

  const handleEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({
      brand: v.brand,
      model: v.model,
      year: v.year,
      km: v.km,
      price: v.price,
      fuel: v.fuel || "Nafta",
      transmission: v.transmission || "Manual",
      description: v.description || "",
      image_url: v.image_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este vehículo?")) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) toast.error("Error al eliminar");
    else {
      toast.success("Vehículo eliminado");
      fetchVehicles();
    }
  };

  const toggleActive = async (v: Vehicle) => {
    const { error } = await supabase
      .from("vehicles")
      .update({ is_active: !v.is_active })
      .eq("id", v.id);
    if (error) toast.error("Error");
    else fetchVehicles();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
    setForm({
      brand: "", model: "", year: new Date().getFullYear(), km: "", price: "",
      fuel: "Nafta", transmission: "Manual", description: "", image_url: "",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const inputClass = "w-full bg-background border border-border px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/" className="font-display text-lg tracking-wider text-foreground">
              ZUNINO MOTORS
            </a>
            <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Panel Admin</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-foreground">VEHÍCULOS</h1>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Agregar
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 border border-border">
              <h2 className="font-display text-2xl text-card-foreground mb-6">
                {editingVehicle ? "EDITAR VEHÍCULO" : "NUEVO VEHÍCULO"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input className={inputClass} placeholder="Marca" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                  <input className={inputClass} placeholder="Modelo" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <input className={inputClass} type="number" placeholder="Año" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
                  <input className={inputClass} placeholder="Km" value={form.km} onChange={(e) => setForm({ ...form, km: e.target.value })} required />
                  <input className={inputClass} placeholder="Precio USD" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select className={inputClass} value={form.fuel || ""} onChange={(e) => setForm({ ...form, fuel: e.target.value })}>
                    <option value="Nafta">Nafta</option>
                    <option value="Diésel">Diésel</option>
                    <option value="GNC">GNC</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                  <select className={inputClass} value={form.transmission || ""} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
                    <option value="Manual">Manual</option>
                    <option value="Automática">Automática</option>
                  </select>
                </div>
                <textarea className={`${inputClass} min-h-[80px]`} placeholder="Descripción (opcional)" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                
                {/* Image upload */}
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2 font-body">Foto del vehículo</label>
                  {form.image_url && (
                    <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover mb-3 border border-border" />
                  )}
                  <label className="flex items-center gap-2 cursor-pointer bg-muted px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase">
                    <Upload size={14} />
                    {uploading ? "Subiendo..." : "Subir imagen"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2.5 text-xs font-medium tracking-wider uppercase hover:opacity-90 transition-opacity">
                    {editingVehicle ? "Guardar Cambios" : "Agregar Vehículo"}
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-border text-xs font-medium tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vehicle List */}
        {loading ? (
          <p className="text-muted-foreground text-sm font-body">Cargando...</p>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 border border-border">
            <p className="text-muted-foreground font-body">No hay vehículos cargados</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm text-foreground underline font-body"
            >
              Agregar el primero
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className={`flex items-center gap-4 p-4 border border-border ${!v.is_active ? "opacity-50" : ""}`}>
                {v.image_url ? (
                  <img src={v.image_url} alt={`${v.brand} ${v.model}`} className="w-24 h-16 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-24 h-16 bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-muted-foreground">Sin foto</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg text-foreground">
                    {v.brand} {v.model} {v.year}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body">
                    {v.km} km · {v.fuel} · {v.transmission} · USD {v.price}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(v)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title={v.is_active ? "Ocultar" : "Mostrar"}>
                    {v.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => handleEdit(v)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
