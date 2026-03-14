import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://nhpnkbdiqmikdatiobth.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocG5rYmRpcW1pa2RhdGlvYnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MjQzNTIsImV4cCI6MjA4OTEwMDM1Mn0.J0nYGLFBlvbbJYZnaESkb-xd5QoQt1Gn42wbzseyaEM"

export const supabase = createClient(supabaseUrl, supabaseKey)
