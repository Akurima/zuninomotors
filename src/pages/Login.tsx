import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import zuninoLogo from "@/assets/zunino-logo.png"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) navigate("/admin", { replace: true })
      setCheckingSession(false)
    }
    checkSession()
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) {
      alert("Credenciales incorrectas.")
    } else {
      navigate("/admin", { replace: true })
    }
    setLoading(false)
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white border rounded-xl shadow-sm p-8 w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <img
            src={zuninoLogo}
            alt="Logo"
            className="w-16 h-16 mx-auto object-contain rounded-lg"
          />
          <h1 className="text-2xl font-bold text-slate-800">Zunino Motors</h1>
          <p className="text-slate-500 text-sm tracking-wide">Panel Administrativo</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  )
}
