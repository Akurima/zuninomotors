import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

export default function Login(){

 const [email,setEmail] = useState("")
 const [password,setPassword] = useState("")
 const navigate = useNavigate()

 const handleLogin = async () => {

  const { data, error } = await supabase.auth.signInWithPassword({
   email,
   password
  })

  if(error){
   alert("Credenciales incorrectas, contacta con un administrador si crees que esto es un error.")
  } else {
   navigate("/admin")
  }

 }

 return(

  <div className="h-screen flex items-center justify-center">

   <div className="flex flex-col gap-4 w-80">

    <h1 className="text-center text-2xl ">Zunino Motors <br />    Panel Administraivo</h1>

    <input
     placeholder="Correo electrónico"
     onChange={(e)=>setEmail(e.target.value)}
    />

    <input
     type="password"
     placeholder="Contraseña"
     onChange={(e)=>setPassword(e.target.value)}
    />

    <button onClick={handleLogin} style={{backgroundColor: "#333", color: "#fff"}} className="p-2"  >
     Ingresar
    </button>

   </div>

  </div>

 )

}
