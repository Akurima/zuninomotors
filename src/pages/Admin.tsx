import { useEffect, useState, useRef } from "react"
import { supabase } from "@/integrations/supabase/client"

type Vehicle = {
 id: string
 brand: string
 model: string
 year: number
 price: string
 km: string
 fuel: string
 image_url?: string
 description?: string | null
 is_promo?: boolean
 promo_price?: string | null
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
 const [fuel,setFuel] = useState("Nafta")

 const [editingCar,setEditingCar] = useState<Vehicle | null>(null)
 const [editingImages,setEditingImages] = useState<VehicleImage[]>([])
 const [uploadingImages,setUploadingImages] = useState(false)
 const [mainImage,setMainImage] = useState<File | null>(null)

 const [loading,setLoading] = useState(true)

 const editSectionRef = useRef<HTMLDivElement>(null)

 useEffect(()=>{
  const checkUser = async ()=>{
   const { data } = await supabase.auth.getUser()
   if(!data.user) window.location.href="/login"
  }
  checkUser()
 },[])

 const loadCars = async()=>{
  setLoading(true)

  const { data } = await supabase
   .from("vehicles")
   .select("*")
   .eq("is_active",true)
   .order("created_at",{ascending:false})

  setCars(data || [])
  setLoading(false)
 }

 useEffect(()=>{ loadCars() },[])

 const uploadImage = async(file:File)=>{
  const fileName = Date.now()+"-"+file.name

  const { error } = await supabase.storage
   .from("vehicles")
   .upload(fileName,file)

  if(error){
   console.log(error)
   return null
  }

  const { data } = supabase.storage
   .from("vehicles")
   .getPublicUrl(fileName)

  return data.publicUrl
 }

 const addVehicle = async()=>{

  let imageUrl=""

  if(image){
   const uploaded = await uploadImage(image)
   if(uploaded) imageUrl = uploaded
  }

  const { error } = await supabase
   .from("vehicles")
   .insert([{
    brand,
    model,
    year:Number(year),
    price,
    km,
    fuel,
    image_url:imageUrl,
    is_active:true
   }])

  if(error){
   console.log(error)
   alert("Error al agregar vehículo")
  }else{
   alert("Vehículo agregado")
   loadCars()
  }
 }

 const deleteVehicle = async(id:string)=>{
  if(!confirm("¿Eliminar vehículo definitivamente?")) return

  const { error } = await supabase
   .from("vehicles")
   .delete()
   .eq("id",id)

  if(error){
   console.log(error)
   alert("Error al eliminar")
  }else{
   alert("Vehículo eliminado")
   loadCars()
  }
 }

 const updateVehicle = async()=>{

  if(!editingCar) return

  let imageUrl = editingCar.image_url

  if(mainImage){
   const uploaded = await uploadImage(mainImage)
   if(uploaded) imageUrl = uploaded
  }

   const { error } = await supabase
    .from("vehicles")
    .update({
     brand: editingCar.brand,
     model: editingCar.model,
     year: editingCar.year,
     price: editingCar.price,
     km: editingCar.km,
     fuel: editingCar.fuel,
     description: editingCar.description,
     image_url: imageUrl,
     is_promo: editingCar.is_promo || false,
     promo_price: editingCar.is_promo ? editingCar.promo_price : null
    })
    .eq("id", editingCar.id)

  if(error){
   console.log(error)
   alert("Error al actualizar")
  }else{
   alert("Vehículo actualizado")
   setEditingCar(null)
   setMainImage(null)
   loadCars()
  }

 }

 const loadCarImages = async(vehicleId:string)=>{
  const { data } = await supabase
   .from("vehicle_images")
   .select("*")
   .eq("vehicle_id",vehicleId)
   .order("display_order",{ascending:true})

  setEditingImages((data as VehicleImage[]) || [])
 }

 const addExtraImages = async(files:FileList)=>{
  if(!editingCar) return

  setUploadingImages(true)

  const maxOrder = editingImages.length > 0
   ? Math.max(...editingImages.map(i=>i.display_order))
   : 0

  for(let i=0;i<files.length;i++){

   const url = await uploadImage(files[i])

   if(url){
    await supabase
     .from("vehicle_images")
     .insert([{
      vehicle_id: editingCar.id,
      image_url:url,
      display_order:maxOrder + i + 1
     }])
   }

  }

  await loadCarImages(editingCar.id)

  setUploadingImages(false)
 }

 const deleteExtraImage = async(imageId:string)=>{
  await supabase
   .from("vehicle_images")
   .delete()
   .eq("id",imageId)

  if(editingCar) await loadCarImages(editingCar.id)
 }

 if(loading){
  return(
   <div className="min-h-screen flex items-center justify-center">
    Cargando vehículos...
   </div>
  )
 }

 return(

 <div className="min-h-screen bg-slate-50 py-12 px-6">

 <div className="max-w-6xl mx-auto space-y-12">

 {/* HEADER */}

 <div className="text-center space-y-2">

 <h1 className="text-4xl font-bold text-slate-800">
 Zunino Motors
 </h1>

 <p className="text-slate-500 tracking-wide">
 Panel Administrativo
 </p>

 </div>

 {/* AGREGAR VEHICULO */}

 <div className="bg-white border rounded-xl shadow-sm p-6 max-w-lg mx-auto space-y-4">

 <h2 className="text-xl font-semibold text-slate-700">
 Agregar Vehículo
 </h2>

 <input
 placeholder="Marca"
 onChange={(e)=>setBrand(e.target.value)}
 className="input"
 />

 <input
 placeholder="Modelo"
 onChange={(e)=>setModel(e.target.value)}
 className="input"
 />

 <input
 placeholder="Año"
 onChange={(e)=>setYear(e.target.value)}
 className="input"
 />

 <input
 placeholder="Precio"
 onChange={(e)=>setPrice(e.target.value)}
 className="input"
 />

 <input
 placeholder="KM"
 onChange={(e)=>setKm(e.target.value)}
 className="input"
 />

 <select
 value={fuel}
 onChange={(e)=>setFuel(e.target.value)}
 className="input"
 >

 <option value="Nafta">Nafta</option>
 <option value="Diesel">Diesel</option>
 <option value="Eléctrico">Eléctrico</option>

 </select>

 <input
 type="file"
 onChange={(e)=>setImage(e.target.files?.[0] || null)}
 />

 <button
 onClick={addVehicle}
 className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
 >
 Agregar vehículo
 </button>

 </div>

 {/* INVENTARIO */}

 <div className="bg-white border rounded-xl shadow-sm p-6">

 <h2 className="text-xl font-semibold mb-4">
 Inventario
 </h2>

 <table className="w-full">

 <thead className="border-b text-left text-slate-500">

 <tr>
 <th className="py-2">Foto</th>
 <th>Vehículo</th>
 <th>Año</th>
 <th>Precio</th>
 <th>Acciones</th>
 </tr>

 </thead>

 <tbody>

 {cars.map((car)=>(

 <tr key={car.id} className="border-b">

 <td className="py-2">
 {car.image_url && <img src={car.image_url} className="w-20 rounded"/>}
 </td>

 <td>{car.brand} {car.model}</td>

 <td>{car.year}</td>

 <td>USD {car.price}</td>

 <td className="space-x-2">

 <button
 onClick={()=>{

 setEditingCar(car)

 setTimeout(()=>{
 editSectionRef.current?.scrollIntoView({
 behavior:"smooth"
 })
 },100)

 }}
 className="bg-blue-500 text-white px-3 py-1 rounded"
 >

 Editar

 </button>

 <button
 onClick={()=>deleteVehicle(car.id)}
 className="bg-red-500 text-white px-3 py-1 rounded"
 >

 Eliminar

 </button>

 </td>

 </tr>

 ))}

 </tbody>

 </table>

 </div>

 {/* EDITAR VEHICULO */}

 {editingCar && (

 <div
 ref={editSectionRef}
 className="bg-white border rounded-xl shadow-sm p-6 max-w-xl mx-auto space-y-3"
 >

 <h2 className="text-xl font-semibold">
 Editar vehículo
 </h2>

 <input
 value={editingCar.brand}
 onChange={(e)=>setEditingCar({...editingCar,brand:e.target.value})}
 className="input"
 />

 <input
 value={editingCar.model}
 onChange={(e)=>setEditingCar({...editingCar,model:e.target.value})}
 className="input"
 />

 <input
 value={editingCar.year}
 onChange={(e)=>setEditingCar({...editingCar,year:Number(e.target.value)})}
 className="input"
 />

 <input
 value={editingCar.price}
 onChange={(e)=>setEditingCar({...editingCar,price:e.target.value})}
 className="input"
 />

 <input
 value={editingCar.km}
 onChange={(e)=>setEditingCar({...editingCar,km:e.target.value})}
 className="input"
 />

 <select
 value={editingCar.fuel}
 onChange={(e)=>setEditingCar({...editingCar,fuel:e.target.value})}
 className="input"
 >

 <option value="Nafta">Nafta</option>
 <option value="Diesel">Diesel</option>
 <option value="Eléctrico">Eléctrico</option>

 </select>

 <textarea
 value={editingCar.description || ""}
 onChange={(e)=>setEditingCar({...editingCar,description:e.target.value})}
 className="input min-h-[120px]"
 placeholder="Descripción"
 />

 <label className="flex items-center gap-3 cursor-pointer select-none">
  <input
   type="checkbox"
   checked={editingCar.is_promo || false}
   onChange={(e)=>setEditingCar({...editingCar, is_promo: e.target.checked, promo_price: e.target.checked ? (editingCar.promo_price || "") : null})}
   className="w-5 h-5 accent-green-600"
  />
  <span className="text-sm font-medium text-slate-700">Habilitar promoción</span>
 </label>

 {editingCar.is_promo && (
  <input
   value={editingCar.promo_price || ""}
   onChange={(e)=>setEditingCar({...editingCar, promo_price: e.target.value})}
   className="input"
   placeholder="Precio de promoción (USD)"
  />
 )}

 <input
 type="file"
 onChange={(e)=>setMainImage(e.target.files?.[0] || null)}
 />

 <button
 onClick={updateVehicle}
 className="bg-green-600 text-white p-2 rounded"
 >

 Guardar cambios

 </button>

 </div>

 )}

 {/* LOGOUT */}

 <button
 onClick={async()=>{
 await supabase.auth.signOut()
 window.location.href="/login"
 }}
 className="block mx-auto bg-blue-600 text-white px-6 py-2 rounded-md"
 >

 Cerrar sesión

 </button>

 </div>

 </div>

 )
}