// Inicializar cliente Supabase
const SUPABASE_URL = 'https://rorbttfsddrvvhdasmlp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_AiECFTYcbMxVNZPvtWg9Yw_lbdMKMF_';

// Si la librería de Supabase está cargada (vía CDN), crear el cliente
let supabase = null;
if (typeof supabase !== 'undefined') {
    // Si la importación global existe pero se llama igual
}

if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.warn("Supabase library not loaded.");
}
