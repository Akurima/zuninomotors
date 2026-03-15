import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

type Vehicle = {
 id: string
 brand: string
 model: string
 year: number
 price: string
 km: string
 image_url?: string
 description?: string | null
}

type VehicleImage = {
 id: string
 vehicle_id: string
 image_url: string
 display_order: number
}

export default function Admin(){

 const [cars,setCars] = useState<Vehicle[]>([])
 const [brand,setBrand] = useState("")
 const [model,setModel] = useState("")
 const [year,setYear] = useState("")
 const [price,setPrice] = useState("")
 const [km,setKm] = useState("")
 const [image,setImage] = useState<File | null>(null)
 const [editingCar,setEditingCar] = useState<Vehicle | null>(null)
 const [editingImages,setEditingImages] = useState<VehicleImage[]>([])
 const [uploadingImages,setUploadingImages] = useState(false)

 useEffect(()=>{
  const checkUser = async ()=>{
   const { data } = await supabase.auth.getUser()
   if(!data.user) window.location.href="/login"
  }
  checkUser()
 },[])

 const loadCars = async ()=>{
  const { data } = await supabase
   .from("vehicles")
   .select("*")
   .eq("is_active",true)
   .order("created_at",{ascending:false})
  setCars(data || [])
 }

 useEffect(()=>{ loadCars() },[])

 const uploadImage = async(file:File)=>{
  const fileName = Date.now()+"-"+file.name
  const { error } = await supabase.storage.from("vehicles").upload(fileName,file)
  if(error){ console.log(error); return null }
  const { data } = supabase.storage.from("vehicles").getPublicUrl(fileName)
  return data.publicUrl
 }

 const addVehicle = async()=>{
  let imageUrl=""
  if(image){
   const uploaded=await uploadImage(image)
   if(uploaded) imageUrl=uploaded
  }
  const { error } = await supabase
   .from("vehicles")
   .insert([{ brand, model, year:Number(year), price, km, fuel:"Nafta", image_url:imageUrl, is_active:true }])
  if(error){ console.log(error); alert("Error al agregar vehículo") }
  else{ alert("Vehículo agregado"); loadCars() }
 }

 const deleteVehicle = async(id:string)=>{
  if(!confirm("¿Eliminar vehículo definitivamente?")) return
  const { error } = await supabase.from("vehicles").delete().eq("id",id)
  if(error){ console.log(error); alert("Error al eliminar") }
  else{ alert("Vehículo eliminado"); loadCars() }
 }

 const updateVehicle = async()=>{
  if(!editingCar) return
  const { error } = await supabase
   .from("vehicles")
   .update({ brand:editingCar.brand, model:editingCar.model, year:editingCar.year, price:editingCar.price, km:editingCar.km, description:editingCar.description })
   .eq("id",editingCar.id)
  if(error){ console.log(error); alert("Error al actualizar") }
  else{ alert("Vehículo actualizado"); setEditingCar(null); loadCars() }
 }

 // Load images for editing car
 const loadCarImages = async(vehicleId:string)=>{
  const { data } = await supabase
   .from("vehicle_images")
   .select("*")
   .eq("vehicle_id",vehicleId)
   .order("display_order",{ascending:true})
  setEditingImages((data as VehicleImage[]) || [])
 }

 const startEditing = (car:Vehicle)=>{
  setEditingCar(car)
  loadCarImages(car.id)
 }

 const addExtraImages = async(files:FileList)=>{
  if(!editingCar) return
  setUploadingImages(true)
  const maxOrder = editingImages.length > 0 ? Math.max(...editingImages.map(i=>i.display_order)) : 0

  for(let i=0; i<files.length; i++){
   const url = await uploadImage(files[i])
   if(url){
    await supabase.from("vehicle_images").insert([{
     vehicle_id: editingCar.id,
     image_url: url,
     display_order: maxOrder + i + 1
    }])
   }
  }
  await loadCarImages(editingCar.id)
  setUploadingImages(false)
 }

 const deleteExtraImage = async(imageId:string)=>{
  await supabase.from("vehicle_images").delete().eq("id",imageId)
  if(editingCar) await loadCarImages(editingCar.id)
 }

 return(
 <div className="p-10">
  <h1 className="text-3xl mb-6">Panel Zunino Motors</h1>

  {/* FORMULARIO AGREGAR */}
  <div className="flex flex-col gap-3 max-w-sm mb-10">
   <input placeholder="Marca" onChange={(e)=>setBrand(e.target.value)} className="border p-2" />
   <input placeholder="Modelo" onChange={(e)=>setModel(e.target.value)} className="border p-2" />
   <input placeholder="Año" onChange={(e)=>setYear(e.target.value)} className="border p-2" />
   <input placeholder="Precio" onChange={(e)=>setPrice(e.target.value)} className="border p-2" />
   <input placeholder="KM" onChange={(e)=>setKm(e.target.value)} className="border p-2" />
   <input type="file" onChange={(e)=>setImage(e.target.files?.[0] || null)} />
   <button onClick={addVehicle} className="bg-foreground text-background p-2">Agregar vehículo</button>
  </div>

  {/* TABLA */}
  <table className="w-full border">
   <thead>
    <tr className="border">
     <th className="p-2">Foto</th>
     <th>Auto</th>
     <th>Año</th>
     <th>Precio</th>
     <th>Acciones</th>
    </tr>
   </thead>
   <tbody>
    {cars.map((car)=>(
     <tr key={car.id} className="border">
      <td className="p-2">
       {car.image_url && <img src={car.image_url} className="w-24" />}
      </td>
      <td>{car.brand} {car.model}</td>
      <td>{car.year}</td>
      <td>USD {car.price}</td>
      <td>
       <button onClick={()=>startEditing(car)} className="bg-accent text-accent-foreground px-3 py-1 mr-2">Editar</button>
       <button onClick={()=>deleteVehicle(car.id)} className="bg-destructive text-destructive-foreground px-3 py-1">Eliminar</button>
      </td>
     </tr>
    ))}
   </tbody>
  </table>

  {/* EDITAR */}
  {editingCar && (
   <div className="mt-10 p-6 border max-w-lg">
    <h2 className="text-xl mb-4">Editar vehículo</h2>
    <div className="flex flex-col gap-2">
     <input value={editingCar.brand} onChange={(e)=>setEditingCar({...editingCar,brand:e.target.value})} className="border p-2" />
     <input value={editingCar.model} onChange={(e)=>setEditingCar({...editingCar,model:e.target.value})} className="border p-2" />
     <input value={editingCar.year} onChange={(e)=>setEditingCar({...editingCar,year:Number(e.target.value)})} className="border p-2" />
     <input value={editingCar.price} onChange={(e)=>setEditingCar({...editingCar,price:e.target.value})} className="border p-2" />
     <input value={editingCar.km} onChange={(e)=>setEditingCar({...editingCar,km:e.target.value})} className="border p-2" />
     <textarea
      placeholder="Descripción del vehículo"
      value={editingCar.description || ""}
      onChange={(e)=>setEditingCar({...editingCar,description:e.target.value})}
      className="w-full border p-2 min-h-[100px]"
     />
    </div>

    {/* GALERÍA DE IMÁGENES */}
    <div className="mt-6">
     <h3 className="text-lg mb-3">Imágenes adicionales</h3>
     <div className="grid grid-cols-3 gap-3 mb-4">
      {editingImages.map((img)=>(
       <div key={img.id} className="relative group">
        <img src={img.image_url} className="w-full aspect-square object-cover border" />
        <button
         onClick={()=>deleteExtraImage(img.id)}
         className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
         ✕
        </button>
       </div>
      ))}
     </div>
     <input
      type="file"
      multiple
      onChange={(e)=>{ if(e.target.files) addExtraImages(e.target.files) }}
     />
     {uploadingImages && <p className="text-sm text-muted-foreground mt-2">Subiendo imágenes...</p>}
    </div>

    <div className="flex gap-3 mt-6">
     <button onClick={updateVehicle} className="bg-primary text-primary-foreground p-2 px-6">Guardar cambios</button>
     <button onClick={()=>{setEditingCar(null);setEditingImages([])}} className="border p-2 px-6">Cancelar</button>
    </div>
   </div>
  )}

  <br/>
  <button
   onClick={async()=>{ await supabase.auth.signOut(); window.location.href="/login" }}
   className="bg-muted text-muted-foreground px-4 py-2"
  >
   Cerrar sesión
  </button>
 </div>
 )
}
