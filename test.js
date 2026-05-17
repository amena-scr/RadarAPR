const url = "https://rorbttfsddrvvhdasmlp.supabase.co/rest/v1/consultas_salariales";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmJ0dGZzZGRydnZoZGFzbWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDc0NDEsImV4cCI6MjA5MzA4MzQ0MX0.JJQatb09z8_2VpRTUtWGOe0GWZyB4TLaIIVoK_O3i2U";

fetch(url, {
  method: "POST",
  headers: {
    "apikey": key,
    "Authorization": "Bearer " + key,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  body: JSON.stringify({
    formacion: "tecnico",
    region: "arica",
    ciudad: "arica",
    rubro: "mineria_cielo_abierto",
    experiencia: "junior",
    sueldo_ofrecido: 1000000,
    sueldo_sugerido: 1000000
  })
})
  .then(res => res.text().then(text => ({ status: res.status, body: text })))
  .then(console.log)
  .catch(console.error);
