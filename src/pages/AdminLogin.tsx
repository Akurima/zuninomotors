import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Credenciales inválidas");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl text-secondary-foreground text-center mb-8">
          ZUNINO MOTORS
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-secondary border border-secondary-foreground/20 text-secondary-foreground px-4 py-3 text-sm font-body placeholder:text-secondary-foreground/40 focus:outline-none focus:border-secondary-foreground/50"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-secondary border border-secondary-foreground/20 text-secondary-foreground px-4 py-3 text-sm font-body placeholder:text-secondary-foreground/40 focus:outline-none focus:border-secondary-foreground/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary-foreground text-secondary py-3 text-sm font-medium tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <a
          href="/"
          className="block text-center mt-6 text-xs text-secondary-foreground/50 hover:text-secondary-foreground/70 transition-colors tracking-wide uppercase"
        >
          ← Volver al sitio
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
