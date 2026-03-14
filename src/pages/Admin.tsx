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


 // Verificar login
 useEffect(()=>{

  const checkUser = async ()=>{

   const { data } = await supabase.auth.getUser()

   if(!data.user){
    window.location.href="/login"
   }

  }

  checkUser()

 },[])

 // Cargar autos
 const loadCars = async ()=>{

  const { data, error } = await supabase
   .from("vehicles")
   .select("*")
   .eq("is_active",true)
   .order("created_at",{ascending:false})

  console.log(data,error)

  setCars(data || [])

 }

 useEffect(()=>{
  loadCars()
 },[])

 // Subir imagen
 const uploadImage = async(file:File)=>{

  const fileName = Date.now()+"-"+file.name

  const { error } = await supabase
   .storage
   .from("vehicles")
   .upload(fileName,file)

  if(error){
   console.log(error)
   return null
  }

  const { data } = supabase
   .storage
   .from("vehicles")
   .getPublicUrl(fileName)

  return data.publicUrl

 }

 // Agregar auto
 const addVehicle = async()=>{

  let imageUrl=""

  if(image){
   const uploaded=await uploadImage(image)
   if(uploaded) imageUrl=uploaded
  }

  const { error } = await supabase
   .from("vehicles")
   .insert([
    {
     brand,
     model,
     year:Number(year),
     price,
     km,
     fuel:"Nafta",
     image_url:imageUrl,
     is_active:true
    }
   ])

  if(error){
   console.log(error)
   alert("Error al agregar vehículo")
  }else{
   alert("Vehículo agregado")
   loadCars()
  }

 }

 // Eliminar auto
const deleteVehicle = async(id:string)=>{

 const confirmDelete = confirm("¿Eliminar vehículo definitivamente?")

 if(!confirmDelete) return

 const { error } = await supabase
  .from("vehicles")
  .delete()
  .eq("id",id)

 if(error){
  console.log(error)
  alert("Error al eliminar vehículo")
 }else{
  alert("Vehículo eliminado")
  loadCars()
 }

}


 const updateVehicle = async()=>{

 if(!editingCar) return

 const { error } = await supabase
  .from("vehicles")
  .update({
   brand:editingCar.brand,
   model:editingCar.model,
   year:editingCar.year,
   price:editingCar.price,
   km:editingCar.km
  })
  .eq("id",editingCar.id)

 if(error){
  console.log(error)
  alert("Error al actualizar")
 }else{
  alert("Vehículo actualizado")
  setEditingCar(null)
  loadCars()
 }

}


 return(

 <div className="p-10">

  <h1 className="text-3xl mb-6">Panel Zunino Motors</h1>

  {/* FORMULARIO */}

  <div className="flex flex-col gap-3 max-w-sm mb-10">

   <input
    placeholder="Marca"
    onChange={(e)=>setBrand(e.target.value)}
   />

   <input
    placeholder="Modelo"
    onChange={(e)=>setModel(e.target.value)}
   />

   <input
    placeholder="Año"
    onChange={(e)=>setYear(e.target.value)}
   />

   <input
    placeholder="Precio"
    onChange={(e)=>setPrice(e.target.value)}
   />

   <input
    placeholder="KM"
    onChange={(e)=>setKm(e.target.value)}
   />

   <input
    type="file"
    onChange={(e)=>setImage(e.target.files?.[0] || null)}
   />

   <button
    onClick={addVehicle}
    className="bg-black text-white p-2"
   >
    Agregar vehículo
   </button>

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

       {car.image_url && (
        <img
         src={car.image_url}
         className="w-24"
        />
       )}

      </td>

      <td>
       {car.brand} {car.model}
      </td>

      <td>
       {car.year}
      </td>

      <td>
       USD {car.price}
      </td>

     <td>

<button
 onClick={()=>setEditingCar(car)}
 className="bg-blue-500 text-white px-3 py-1 mr-2"
>
Editar
</button>

<button
 onClick={()=>deleteVehicle(car.id)}
 className="bg-red-500 text-white px-3 py-1"
>
Eliminar
</button>


</td>


      

     </tr>
    ))}

   </tbody>

  </table>

{editingCar && (

<div className="mt-10 p-6 border max-w-md">

<h2 className="text-xl mb-4">
Editar vehículo
</h2>

<input
 value={editingCar.brand}
 onChange={(e)=>setEditingCar({...editingCar,brand:e.target.value})}
/>

<input
 value={editingCar.model}
 onChange={(e)=>setEditingCar({...editingCar,model:e.target.value})}
/>

<input
 value={editingCar.year}
 onChange={(e)=>setEditingCar({...editingCar,year:Number(e.target.value)})}
/>

<input
 value={editingCar.price}
 onChange={(e)=>setEditingCar({...editingCar,price:e.target.value})}
/>

<input
 value={editingCar.km}
 onChange={(e)=>setEditingCar({...editingCar,km:e.target.value})}
/>

<button
 onClick={updateVehicle}
 className="bg-green-600 text-white p-2 mt-4"
>
Guardar cambios
</button>

<button
 onClick={()=>setEditingCar(null)}
 className="ml-4"
>
Cancelar
</button>

</div>

)}

  

  <br/>

  

  {/* LOGOUT */}

  <button
   onClick={async()=>{
    await supabase.auth.signOut()
    window.location.href="/login"
   }}
   className="bg-gray-800 text-white px-4 py-2"
  >
   Cerrar sesión
  </button>

 </div>

 )

}
