import { useEffect, useState, useRef } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Car, LogOut } from "lucide-react"

type Vehicle = {
  id:string
  brand:string
  model:string
  year:number
  price:string
  km:string
  fuel:string
  transmission?: string
  description?:string | null
  image_url?:string
  is_promo?:boolean
  promo_price?:string | null
}

type VehicleImage = {
  id:string
  vehicle_id:string
  image_url:string
  display_order:number
}

export default function Admin(){

  const [cars,setCars] = useState<Vehicle[]>([])
  const [loading,setLoading] = useState(true)

  const [brand,setBrand] = useState("")
  const [model,setModel] = useState("")
  const [year,setYear] = useState("")
  const [price,setPrice] = useState("")
  const [km,setKm] = useState("")
  const [fuel,setFuel] = useState("Nafta")
  const [transmission,setTransmission] = useState("Manual")
  const [description,setDescription] = useState("")
  const [image,setImage] = useState<File | null>(null)

  const [isPromo,setIsPromo] = useState(false)
  const [promoPrice,setPromoPrice] = useState("")

  const [editingCar,setEditingCar] = useState<Vehicle | null>(null)
  const [editingImages,setEditingImages] = useState<VehicleImage[]>([])
  const [mainImage,setMainImage] = useState<File | null>(null)

  const [search,setSearch] = useState("")
  const [currentPage,setCurrentPage] = useState(1)

  const editRef = useRef<HTMLDivElement>(null)
  const vehiclesPerPage = 15

  useEffect(()=>{
    const checkUser = async()=>{
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

  useEffect(()=>{loadCars()},[])

  const uploadImage = async(file:File)=>{
    const name = Date.now()+"-"+file.name
    const { error } = await supabase.storage
      .from("vehicles")
      .upload(name,file)
    if(error) return null
    const { data } = supabase.storage
      .from("vehicles")
      .getPublicUrl(name)
    return data.publicUrl
  }

  const addVehicle = async()=>{
    let imageUrl=""
    if(image){
      const uploaded = await uploadImage(image)
      if(uploaded) imageUrl = uploaded
    }

    await supabase
      .from("vehicles")
      .insert([{
        brand,
        model,
        year:Number(year),
        price,
        km,
        fuel,
        transmission,
        description,
        image_url:imageUrl,
        is_promo:isPromo,
        promo_price:isPromo ? promoPrice : null,
        is_active:true
      }])

    alert("Vehículo agregado")
    setBrand("")
    setModel("")
    setYear("")
    setPrice("")
    setKm("")
    setFuel("Nafta")
    setTransmission("Manual")
    setDescription("")
    setPromoPrice("")
    setIsPromo(false)
    setImage(null)

    loadCars()
  }

  const deleteVehicle = async(id:string)=>{
    if(!confirm("Eliminar vehículo?")) return
    await supabase
      .from("vehicles")
      .delete()
      .eq("id",id)
    loadCars()
  }

  const updateVehicle = async()=>{
    if(!editingCar) return
    await supabase
      .from("vehicles")
      .update({
        brand:editingCar.brand,
        model:editingCar.model,
        year:editingCar.year,
        price:editingCar.price,
        km:editingCar.km,
        fuel:editingCar.fuel,
        transmission:editingCar.transmission,
        description:editingCar.description,
        is_promo:editingCar.is_promo,
        promo_price:editingCar.is_promo ? editingCar.promo_price : null
      })
      .eq("id",editingCar.id)
    alert("Vehículo actualizado")
    setEditingCar(null)
    loadCars()
  }

  const updateMainImage = async()=>{
    if(!editingCar || !mainImage) return
    const url = await uploadImage(mainImage)
    if(!url) return
    await supabase
      .from("vehicles")
      .update({image_url:url})
      .eq("id",editingCar.id)
    alert("Imagen principal actualizada")
    loadCars()
  }

  const loadImages = async(id:string)=>{
    const { data } = await supabase
      .from("vehicle_images")
      .select("*")
      .eq("vehicle_id",id)
      .order("display_order")
    setEditingImages(data || [])
  }

  const uploadCarouselImages = async(files:FileList)=>{
    if(!editingCar) return
    for(let i=0;i<files.length;i++){
      const url = await uploadImage(files[i])
      if(url){
        await supabase
          .from("vehicle_images")
          .insert([{
            vehicle_id:editingCar.id,
            image_url:url,
            display_order:i
          }])
      }
    }
    loadImages(editingCar.id)
  }

  const deleteCarouselImage = async(id:string)=>{
    await supabase
      .from("vehicle_images")
      .delete()
      .eq("id",id)
    if(editingCar) loadImages(editingCar.id)
  }

  const filteredCars = cars.filter(c =>
    c.brand.toLowerCase().includes(search.toLowerCase())
  )

  const indexLast = currentPage * vehiclesPerPage
  const indexFirst = indexLast - vehiclesPerPage
  const currentCars = filteredCars.slice(indexFirst,indexLast)
  const totalPages = Math.ceil(filteredCars.length / vehiclesPerPage)

  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando...
      </div>
    )
  }

  return(
    <div className="flex min-h-screen bg-black text-zinc-200">
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-white">ZUNINO MOTORS</h1>
        <button
          onClick={async()=>{
            await supabase.auth.signOut()
            window.location.href="/login"
          }}
          className="mt-auto flex gap-2 text-red-400"
        >
          <LogOut size={18}/> Cerrar sesión
        </button>
      </div>

      <div className="flex-1 p-10 space-y-10">

        {/* Agregar vehículo */}
        <div className="bg-zinc-900 p-6 rounded-xl space-y-3 max-w-xl">
          <h2 className="font-semibold">Agregar vehículo</h2>

          <input placeholder="Marca" value={brand} onChange={e=>setBrand(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full"/>
          <input placeholder="Modelo" value={model} onChange={e=>setModel(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full"/>
          <input placeholder="Año" value={year} onChange={e=>setYear(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full"/>
          <input placeholder="Precio" value={price} onChange={e=>setPrice(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full"/>
          <input placeholder="KM" value={km} onChange={e=>setKm(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full"/>

          <select value={fuel} onChange={e=>setFuel(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full">
            <option value="Nafta">Nafta</option>
            <option value="Diesel">Diesel</option>
            <option value="Eléctrico">Eléctrico</option>
          </select>

          <select value={transmission} onChange={e=>setTransmission(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full">
            <option value="Manual">Manual</option>
            <option value="Automático">Automático</option>
          </select>

          <textarea placeholder="Descripción" value={description} onChange={e=>setDescription(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full"/>

          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={isPromo} onChange={e=>setIsPromo(e.target.checked)}/>
            Promoción
          </label>

          {isPromo && (
            <input placeholder="Precio promoción" value={promoPrice} onChange={e=>setPromoPrice(e.target.value)} className="bg-white text-black px-3 py-2 rounded w-full"/>
          )}

          <input type="file" onChange={e=>setImage(e.target.files?.[0] || null)}/>

          <button onClick={addVehicle} className="bg-amber-500 text-black px-4 py-2 rounded">
            Agregar vehículo
          </button>
        </div>

        {/* Inventario */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <div className="flex justify-between mb-6">
            <h2 className="font-semibold">Inventario</h2>
            <input
              placeholder="Buscar marca..."
              value={search}
              onChange={e=>{setSearch(e.target.value);setCurrentPage(1)}}
              className="bg-white text-black px-3 py-2 rounded"
            />
          </div>

          <table className="w-full">
            <thead className="border-b border-zinc-700">
              <tr>
                <th>Foto</th>
                <th>Vehículo</th>
                <th>Año</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentCars.map(car=>(
                <tr key={car.id} className="border-b border-zinc-800">
                  <td>{car.image_url && <img src={car.image_url} className="w-20"/>}</td>
                  <td>{car.brand} {car.model}</td>
                  <td>{car.year}</td>
                  <td className="text-amber-400">{car.price}</td>
                  <td className="space-x-2">
                    <button
                      onClick={()=>{
                        setEditingCar(car)
                        loadImages(car.id)
                        setTimeout(()=>editRef.current?.scrollIntoView({behavior:"smooth"}),100)
                      }}
                      className="bg-blue-600 px-3 py-1 rounded"
                    >
                      Editar
                    </button>

                    <button
                      onClick={()=>deleteVehicle(car.id)}
                      className="bg-red-600 px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({length:totalPages},(_,i)=>(
              <button
                key={i}
                onClick={()=>setCurrentPage(i+1)}
                className={`px-3 py-1 rounded ${currentPage===i+1 ? "bg-amber-500 text-black":"bg-zinc-700"}`}
              >
                {i+1}
              </button>
            ))}
          </div>
        </div>

        {/* Editar vehículo */}
        {editingCar && (
          <div ref={editRef} className="bg-zinc-900 p-6 rounded-xl max-w-xl space-y-3">
            <h2 className="font-semibold">Editar vehículo</h2>

            <input value={editingCar.brand} onChange={e=>setEditingCar({...editingCar,brand:e.target.value})} className="bg-white text-black px-3 py-2 rounded w-full"/>
            <input value={editingCar.model} onChange={e=>setEditingCar({...editingCar,model:e.target.value})} className="bg-white text-black px-3 py-2 rounded w-full"/>
            <input value={editingCar.price} onChange={e=>setEditingCar({...editingCar,price:e.target.value})} className="bg-white text-black px-3 py-2 rounded w-full"/>
            <input value={editingCar.km} onChange={e=>setEditingCar({...editingCar,km:e.target.value})} className="bg-white text-black px-3 py-2 rounded w-full"/>

            <select
              value={editingCar.fuel}
              onChange={e=>setEditingCar({...editingCar,fuel:e.target.value})}
              className="bg-white text-black px-3 py-2 rounded w-full"
            >
              <option value="Nafta">Nafta</option>
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
            </select>

            <select
              value={editingCar.transmission || "Manual"}
              onChange={e=>setEditingCar({...editingCar,transmission:e.target.value})}
              className="bg-white text-black px-3 py-2 rounded w-full"
            >
              <option value="Manual">Manual</option>
              <option value="Automático">Automático</option>
            </select>

            <textarea value={editingCar.description || ""} onChange={e=>setEditingCar({...editingCar,description:e.target.value})} className="bg-white text-black px-3 py-2 rounded w-full"/>

            <label className="flex gap-2 items-center">
              <input type="checkbox" checked={editingCar.is_promo || false} onChange={e=>setEditingCar({...editingCar,is_promo:e.target.checked})}/>
              Promoción
            </label>

            {editingCar.is_promo && (
              <input value={editingCar.promo_price || ""} onChange={e=>setEditingCar({...editingCar,promo_price:e.target.value})} className="bg-white text-black px-3 py-2 rounded w-full"/>
            )}

            <h3>Imagen principal</h3>
            <input type="file" onChange={e=>setMainImage(e.target.files?.[0] || null)}/>
            <button onClick={updateMainImage} className="bg-amber-500 text-black px-4 py-2 rounded">Cambiar imagen principal</button>

            <h3>Carousel</h3>
            <input type="file" multiple onChange={e=>{if(e.target.files) uploadCarouselImages(e.target.files)}}/>
            <div className="grid grid-cols-4 gap-2">
              {editingImages.map(img=>(
                <div key={img.id} className="relative">
                  <img src={img.image_url} className="rounded"/>
                  <button onClick={()=>deleteCarouselImage(img.id)} className="absolute top-1 right-1 bg-red-600 text-white px-2 text-xs rounded">X</button>
                </div>
              ))}
            </div>

            <button onClick={updateVehicle} className="bg-green-600 px-4 py-2 rounded">Guardar cambios</button>
          </div>
        )}

      </div>
    </div>
  )
}