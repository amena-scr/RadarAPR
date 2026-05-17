// Inicializar cliente Supabase
const SUPABASE_URL = 'https://rorbttfsddrvvhdasmlp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmJ0dGZzZGRydnZoZGFzbWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDc0NDEsImV4cCI6MjA5MzA4MzQ0MX0.JJQatb09z8_2VpRTUtWGOe0GWZyB4TLaIIVoK_O3i2U';

window.supabaseClient = null;

if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Cliente Supabase inicializado correctamente.");
} else {
    console.warn("La librería de Supabase no se cargó correctamente.");
    alert("Error crítico: No se pudo cargar el motor de base de datos de Supabase. Revisa tu conexión a internet o los bloqueadores de anuncios.");
}
