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
   alert("Credenciales incorrectas")
  } else {
   navigate("/admin")
  }

 }

 return(

  <div className="h-screen flex items-center justify-center">

   <div className="flex flex-col gap-4 w-80">

    <h1 className="text-2xl">Admin Login</h1>

    <input
     placeholder="Email"
     onChange={(e)=>setEmail(e.target.value)}
    />

    <input
     type="password"
     placeholder="Password"
     onChange={(e)=>setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>
     Ingresar
    </button>

   </div>

  </div>

 )

}
