import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Car, DollarSign, LogOut, Package, TrendingUp, Trash2 } from "lucide-react"

type Vehicle = {
  id: string
  brand: string
  model: string
  year: number
  price: string
  km: string
  fuel: string
  transmission?: string
  description?: string | null
  image_url?: string
  is_promo?: boolean
  promo_price?: string | null
  is_active?: boolean
  was_sold?: boolean | null
  final_sale_price?: string | null
  sold_at?: string | null
  deleted_at?: string | null
}

type VehicleImage = {
  id: string
  vehicle_id: string
  image_url: string
  display_order: number
}

function toNumber(value?: string | number | null) {
  if (value === null || value === undefined) return 0
  if (typeof value === "number") return value
  const normalized = String(value).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".")
  const num = Number(normalized)
  return Number.isFinite(num) ? num : 0
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export default function Admin() {
  const [cars, setCars] = useState<Vehicle[]>([])
  const [allCars, setAllCars] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [price, setPrice] = useState("")
  const [km, setKm] = useState("")
  const [fuel, setFuel] = useState("Nafta")
  const [transmission, setTransmission] = useState("Manual")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const [isPromo, setIsPromo] = useState(false)
  const [promoPrice, setPromoPrice] = useState("")

  const [editingCar, setEditingCar] = useState<Vehicle | null>(null)
  const [editingImages, setEditingImages] = useState<VehicleImage[]>([])
  const [mainImage, setMainImage] = useState<File | null>(null)

  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const editRef = useRef<HTMLDivElement>(null)
  const vehiclesPerPage = 15

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) window.location.href = "/login"
    }
    checkUser()
  }, [])

  const loadCars = async () => {
    setLoading(true)

    const [{ data: activeData }, { data: allData }] = await Promise.all([
      supabase
        .from("vehicles")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false }),
    ])

    setCars(activeData || [])
    setAllCars(allData || [])
    setLoading(false)
  }

  useEffect(() => {
    loadCars()
  }, [])

  const uploadImage = async (file: File) => {
    const name = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("vehicles").upload(name, file)
    if (error) {
      alert("Error al subir la imagen")
      return null
    }
    const { data } = supabase.storage.from("vehicles").getPublicUrl(name)
    return data.publicUrl
  }

  const resetAddForm = () => {
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
  }

  const addVehicle = async () => {
    if (!brand || !model || !year || !price || !km) {
      alert("Completa marca, modelo, año, precio y KM")
      return
    }

    let imageUrl = ""
    if (image) {
      const uploaded = await uploadImage(image)
      if (uploaded) imageUrl = uploaded
    }

    const { error } = await supabase.from("vehicles").insert([
      {
        brand,
        model,
        year: Number(year),
        price,
        km,
        fuel,
        transmission,
        description,
        image_url: imageUrl,
        is_promo: isPromo,
        promo_price: isPromo ? promoPrice : null,
        is_active: true,
        was_sold: false,
        final_sale_price: null,
        sold_at: null,
        deleted_at: null,
      },
    ])

    if (error) {
      alert("No se pudo agregar el vehículo")
      return
    }

    alert("Vehículo agregado")
    resetAddForm()
    await loadCars()
  }

  const deleteVehicle = async (car: Vehicle) => {
    const wantsDelete = window.confirm(
      `¿Seguro que quieres quitar de inventario el vehículo ${car.brand} ${car.model} ${car.year}?`
    )

    if (!wantsDelete) return

    const soldAnswer = window.prompt(
      '¿Se vendió?\n\nEscribe "si" para vendido o "no" para retirado sin vender.'
    )

    if (!soldAnswer) return

    const normalized = soldAnswer.trim().toLowerCase()

    if (normalized !== "si" && normalized !== "sí" && normalized !== "no") {
      alert('Respuesta inválida. Escribe "si" o "no".')
      return
    }

    const wasSold = normalized === "si" || normalized === "sí"
    let finalSalePrice: string | null = null
    let soldAt: string | null = null

    if (wasSold) {
      const enteredPrice = window.prompt(
        `¿Cuál fue el valor final de venta de ${car.brand} ${car.model} ${car.year}?`
      )

      if (!enteredPrice || !enteredPrice.trim()) {
        alert("Debes ingresar el valor final de venta")
        return
      }

      finalSalePrice = enteredPrice.trim()
      soldAt = new Date().toISOString()
    }

    const { error } = await supabase
      .from("vehicles")
      .update({
        is_active: false,
        was_sold: wasSold,
        final_sale_price: finalSalePrice,
        sold_at: soldAt,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", car.id)

    if (error) {
      alert("No se pudo retirar el vehículo")
      return
    }

    alert(
      wasSold
        ? "Vehículo marcado como vendido y retirado del inventario."
        : "Vehículo retirado del inventario como no vendido."
    )

    if (editingCar?.id === car.id) {
      setEditingCar(null)
      setEditingImages([])
      setMainImage(null)
    }

    await loadCars()
  }

  const updateVehicle = async () => {
    if (!editingCar) return

    if (!editingCar.brand || !editingCar.model || !editingCar.year || !editingCar.price || !editingCar.km) {
      alert("Completa marca, modelo, año, precio y KM")
      return
    }

    const { error } = await supabase
      .from("vehicles")
      .update({
        brand: editingCar.brand,
        model: editingCar.model,
        year: Number(editingCar.year),
        price: editingCar.price,
        km: editingCar.km,
        fuel: editingCar.fuel,
        transmission: editingCar.transmission,
        description: editingCar.description,
        is_promo: editingCar.is_promo,
        promo_price: editingCar.is_promo ? editingCar.promo_price : null,
      })
      .eq("id", editingCar.id)

    if (error) {
      alert("No se pudo actualizar el vehículo")
      return
    }

    alert("Vehículo actualizado")
    setEditingCar(null)
    setEditingImages([])
    setMainImage(null)
    await loadCars()
  }

  const updateMainImage = async () => {
    if (!editingCar || !mainImage) return

    const url = await uploadImage(mainImage)
    if (!url) return

    const { error } = await supabase
      .from("vehicles")
      .update({ image_url: url })
      .eq("id", editingCar.id)

    if (error) {
      alert("No se pudo actualizar la imagen principal")
      return
    }

    alert("Imagen principal actualizada")
    setMainImage(null)
    await loadCars()
  }

  const loadImages = async (id: string) => {
    const { data } = await supabase
      .from("vehicle_images")
      .select("*")
      .eq("vehicle_id", id)
      .order("display_order")

    setEditingImages(data || [])
  }

  const uploadCarouselImages = async (files: FileList) => {
    if (!editingCar) return

    const currentMaxOrder =
      editingImages.length > 0
        ? Math.max(...editingImages.map((img) => img.display_order || 0))
        : -1

    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i])
      if (url) {
        await supabase.from("vehicle_images").insert([
          {
            vehicle_id: editingCar.id,
            image_url: url,
            display_order: currentMaxOrder + i + 1,
          },
        ])
      }
    }

    await loadImages(editingCar.id)
  }

  const deleteCarouselImage = async (id: string) => {
    await supabase.from("vehicle_images").delete().eq("id", id)
    if (editingCar) await loadImages(editingCar.id)
  }

  const filteredCars = cars.filter((c) => {
    const term = search.toLowerCase()
    return (
      c.brand.toLowerCase().includes(term) ||
      c.model.toLowerCase().includes(term) ||
      `${c.brand} ${c.model}`.toLowerCase().includes(term)
    )
  })

  const indexLast = currentPage * vehiclesPerPage
  const indexFirst = indexLast - vehiclesPerPage
  const currentCars = filteredCars.slice(indexFirst, indexLast)
  const totalPages = Math.ceil(filteredCars.length / vehiclesPerPage)

  const stats = useMemo(() => {
    const activeCars = allCars.filter((c) => c.is_active)
    const soldCars = allCars.filter((c) => c.was_sold === true)
    const removedWithoutSale = allCars.filter((c) => c.is_active === false && c.was_sold === false)

    const activeInventoryValue = activeCars.reduce((acc, car) => {
      const effectivePrice =
        car.is_promo && car.promo_price ? toNumber(car.promo_price) : toNumber(car.price)
      return acc + effectivePrice
    }, 0)

    const baseInventoryValue = activeCars.reduce((acc, car) => acc + toNumber(car.price), 0)

    const promoImpact = activeCars.reduce((acc, car) => {
      if (car.is_promo && car.promo_price) {
        return acc + Math.max(0, toNumber(car.price) - toNumber(car.promo_price))
      }
      return acc
    }, 0)

    const totalSalesRevenue = soldCars.reduce((acc, car) => acc + toNumber(car.final_sale_price), 0)

    const averageSale =
      soldCars.length > 0 ? totalSalesRevenue / soldCars.length : 0

    const mostExpensiveCar = activeCars.reduce<Vehicle | null>((max, car) => {
      if (!max) return car
      const currentPrice = car.is_promo && car.promo_price ? toNumber(car.promo_price) : toNumber(car.price)
      const maxPrice = max.is_promo && max.promo_price ? toNumber(max.promo_price) : toNumber(max.price)
      return currentPrice > maxPrice ? car : max
    }, null)

    const brandCount: Record<string, number> = {}
    activeCars.forEach((car) => {
      brandCount[car.brand] = (brandCount[car.brand] || 0) + 1
    })

    const topBrand =
      Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0] || null

    return {
      activeCars: activeCars.length,
      soldCars: soldCars.length,
      removedWithoutSale: removedWithoutSale.length,
      activeInventoryValue,
      baseInventoryValue,
      promoImpact,
      totalSalesRevenue,
      averageSale,
      mostExpensiveCar,
      topBrand,
    }
  }, [allCars])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black text-zinc-200">
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-white">ZUNINO MOTORS</h1>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = "/login"
          }}
          className="mt-auto flex gap-2 text-red-400"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>

      <div className="flex-1 p-10 space-y-10">
        {/* Información relevante */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Información relevante</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Vehículos activos</span>
                <Car className="text-amber-400" size={18} />
              </div>
              <p className="text-3xl font-bold text-white">{stats.activeCars}</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Vehículos vendidos</span>
                <TrendingUp className="text-green-400" size={18} />
              </div>
              <p className="text-3xl font-bold text-white">{stats.soldCars}</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Retirados sin vender</span>
                <Trash2 className="text-red-400" size={18} />
              </div>
              <p className="text-3xl font-bold text-white">{stats.removedWithoutSale}</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Valor inventario activo</span>
                <DollarSign className="text-emerald-400" size={18} />
              </div>
              <p className="text-3xl font-bold text-white">{formatUsd(stats.activeInventoryValue)}</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Valor lista inventario</span>
                <Package className="text-sky-400" size={18} />
              </div>
              <p className="text-3xl font-bold text-white">{formatUsd(stats.baseInventoryValue)}</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Impacto promos activas</span>
                <TrendingUp className="text-orange-400" size={18} />
              </div>
              <p className="text-3xl font-bold text-white">{formatUsd(stats.promoImpact)}</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Facturación por ventas</span>
                <DollarSign className="text-lime-400" size={18} />
              </div>
              <p className="text-3xl font-bold text-white">{formatUsd(stats.totalSalesRevenue)}</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Ticket promedio venta</span>
                <DollarSign className="text-violet-400" size={18} />
              </div>
              <p className="text-3xl font-bold text-white">{formatUsd(stats.averageSale)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-white font-semibold mb-2">Vehículo más caro en inventario</h3>
              {stats.mostExpensiveCar ? (
                <p className="text-zinc-300">
                  {stats.mostExpensiveCar.brand} {stats.mostExpensiveCar.model} {stats.mostExpensiveCar.year} —{" "}
                  <span className="text-amber-400 font-semibold">
                    {formatUsd(
                      stats.mostExpensiveCar.is_promo && stats.mostExpensiveCar.promo_price
                        ? toNumber(stats.mostExpensiveCar.promo_price)
                        : toNumber(stats.mostExpensiveCar.price)
                    )}
                  </span>
                </p>
              ) : (
                <p className="text-zinc-400">No hay datos suficientes.</p>
              )}
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-white font-semibold mb-2">Marca con más unidades activas</h3>
              {stats.topBrand ? (
                <p className="text-zinc-300">
                  <span className="text-amber-400 font-semibold">{stats.topBrand[0]}</span> con{" "}
                  <span className="text-white font-bold">{stats.topBrand[1]}</span> unidades
                </p>
              ) : (
                <p className="text-zinc-400">No hay datos suficientes.</p>
              )}
            </div>
          </div>
        </div>

        {/* Agregar vehículo */}
        <div className="bg-zinc-900 p-6 rounded-xl space-y-3 max-w-xl">
          <h2 className="font-semibold">Agregar vehículo</h2>

          <input
            placeholder="Marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="bg-white text-black placeholder:text-zinc-500 px-3 py-2 rounded w-full"
          />
          <input
            placeholder="Modelo"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-white text-black placeholder:text-zinc-500 px-3 py-2 rounded w-full"
          />
          <input
            placeholder="Año"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-white text-black placeholder:text-zinc-500 px-3 py-2 rounded w-full"
          />
          <input
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-white text-black placeholder:text-zinc-500 px-3 py-2 rounded w-full"
          />
          <input
            placeholder="KM"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            className="bg-white text-black placeholder:text-zinc-500 px-3 py-2 rounded w-full"
          />

          <select
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="bg-white text-black px-3 py-2 rounded w-full"
          >
            <option value="Nafta">Nafta</option>
            <option value="Diesel">Diesel</option>
            <option value="Eléctrico">Eléctrico</option>
          </select>

          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="bg-white text-black px-3 py-2 rounded w-full"
          >
            <option value="Manual">Manual</option>
            <option value="Automático">Automático</option>
          </select>

          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white text-black placeholder:text-zinc-500 px-3 py-2 rounded w-full"
          />

          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={isPromo} onChange={(e) => setIsPromo(e.target.checked)} />
            Promoción
          </label>

          {isPromo && (
            <input
              placeholder="Precio promoción"
              value={promoPrice}
              onChange={(e) => setPromoPrice(e.target.value)}
              className="bg-white text-black placeholder:text-zinc-500 px-3 py-2 rounded w-full"
            />
          )}

          <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />

          <button onClick={addVehicle} className="bg-amber-500 text-black px-4 py-2 rounded">
            Agregar vehículo
          </button>
        </div>

        {/* Inventario */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
            <h2 className="font-semibold">Inventario</h2>
            <input
              placeholder="Buscar marca o modelo..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-white text-black placeholder:text-zinc-500 px-3 py-2 rounded"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-zinc-700">
                <tr>
                  <th className="text-left py-3">Foto</th>
                  <th className="text-left py-3">Vehículo</th>
                  <th className="text-left py-3">Año</th>
                  <th className="text-left py-3">Precio</th>
                  <th className="text-left py-3">Combustible</th>
                  <th className="text-left py-3">Transmisión</th>
                  <th className="text-left py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentCars.map((car) => (
                  <tr key={car.id} className="border-b border-zinc-800">
                    <td className="py-3">
                      {car.image_url && <img src={car.image_url} className="w-20 h-14 object-cover rounded" />}
                    </td>
                    <td className="py-3">
                      {car.brand} {car.model}
                    </td>
                    <td className="py-3">{car.year}</td>
                    <td className="py-3 text-amber-400">
                      {car.is_promo && car.promo_price ? (
                        <div className="flex flex-col">
                          <span className="line-through text-zinc-500">{car.price}</span>
                          <span>{car.promo_price}</span>
                        </div>
                      ) : (
                        car.price
                      )}
                    </td>
                    <td className="py-3">{car.fuel}</td>
                    <td className="py-3">{car.transmission || "Manual"}</td>
                    <td className="py-3 space-x-2">
                      <button
                        onClick={() => {
                          setEditingCar(car)
                          loadImages(car.id)
                          setTimeout(() => editRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
                        }}
                        className="bg-blue-600 px-3 py-1 rounded"
                      >
                        Editar
                      </button>

                      <button onClick={() => deleteVehicle(car)} className="bg-red-600 px-3 py-1 rounded">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCars.length === 0 && (
            <p className="text-zinc-400 mt-6">No se encontraron vehículos con esa búsqueda.</p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-amber-500 text-black" : "bg-zinc-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Editar vehículo */}
        {editingCar && (
          <div ref={editRef} className="bg-zinc-900 p-6 rounded-xl max-w-xl space-y-3">
            <h2 className="font-semibold">Editar vehículo</h2>

            <input
              value={editingCar.brand}
              onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })}
              className="bg-white text-black px-3 py-2 rounded w-full"
            />

            <input
              value={editingCar.model}
              onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
              className="bg-white text-black px-3 py-2 rounded w-full"
            />

            <input
              value={editingCar.year ?? ""}
              onChange={(e) =>
                setEditingCar({
                  ...editingCar,
                  year: Number(e.target.value),
                })
              }
              className="bg-white text-black px-3 py-2 rounded w-full"
              placeholder="Año"
              type="number"
            />

            <input
              value={editingCar.price}
              onChange={(e) => setEditingCar({ ...editingCar, price: e.target.value })}
              className="bg-white text-black px-3 py-2 rounded w-full"
            />

            <input
              value={editingCar.km}
              onChange={(e) => setEditingCar({ ...editingCar, km: e.target.value })}
              className="bg-white text-black px-3 py-2 rounded w-full"
            />

            <select
              value={editingCar.fuel}
              onChange={(e) => setEditingCar({ ...editingCar, fuel: e.target.value })}
              className="bg-white text-black px-3 py-2 rounded w-full"
            >
              <option value="Nafta">Nafta</option>
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
            </select>

            <select
              value={editingCar.transmission || "Manual"}
              onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value })}
              className="bg-white text-black px-3 py-2 rounded w-full"
            >
              <option value="Manual">Manual</option>
              <option value="Automático">Automático</option>
            </select>

            <textarea
              value={editingCar.description || ""}
              onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
              className="bg-white text-black px-3 py-2 rounded w-full"
            />

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={editingCar.is_promo || false}
                onChange={(e) => setEditingCar({ ...editingCar, is_promo: e.target.checked })}
              />
              Promoción
            </label>

            {editingCar.is_promo && (
              <input
                value={editingCar.promo_price || ""}
                onChange={(e) => setEditingCar({ ...editingCar, promo_price: e.target.value })}
                className="bg-white text-black px-3 py-2 rounded w-full"
                placeholder="Precio promoción"
              />
            )}

            <h3 className="pt-2 font-medium">Imagen principal</h3>
            <input type="file" onChange={(e) => setMainImage(e.target.files?.[0] || null)} />
            <button onClick={updateMainImage} className="bg-amber-500 text-black px-4 py-2 rounded">
              Cambiar imagen principal
            </button>

            <h3 className="pt-2 font-medium">Carousel</h3>
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) uploadCarouselImages(e.target.files)
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {editingImages.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.image_url} className="rounded w-full h-24 object-cover" />
                  <button
                    onClick={() => deleteCarouselImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white px-2 text-xs rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={updateVehicle} className="bg-green-600 px-4 py-2 rounded">
                Guardar cambios
              </button>

              <button
                onClick={() => {
                  setEditingCar(null)
                  setEditingImages([])
                  setMainImage(null)
                }}
                className="bg-zinc-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}