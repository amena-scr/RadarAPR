/**
 * RadarAPR - Motor de Visualización Geográfica (Leaflet)
 * Marca la ciudad seleccionada + calor histórico por región
 */

// ── Coordenadas por ciudad ──────────────────────────────────
const COORDENADAS_CIUDADES = {
    // XV - Arica y Parinacota
    arica:            [-18.478, -70.312],
    putre:            [-18.196, -69.556],
    camarones:        [-19.010, -70.170],
    general_lagos:    [-17.898, -69.650],
    // I - Tarapacá
    iquique:          [-20.213, -70.150],
    alto_hospicio:    [-20.268, -70.101],
    pozo_almonte:     [-20.260, -69.786],
    pica:             [-20.497, -69.329],
    colchane:         [-19.276, -68.637],
    huara:            [-19.997, -69.779],
    camiña:           [-19.311, -69.424],
    // II - Antofagasta
    antofagasta:      [-23.650, -70.397],
    calama:           [-22.455, -68.925],
    taltal:           [-25.407, -70.483],
    mejillones:       [-23.101, -70.454],
    tocopilla:        [-22.086, -70.197],
    sierra_gorda:     [-22.892, -69.323],
    san_pedro_atacama:[-22.911, -68.199],
    ollague:          [-21.229, -68.252],
    maria_elena:      [-22.343, -69.661],
    // III - Atacama
    copiapo:          [-27.366, -70.332],
    vallenar:         [-28.576, -70.758],
    caldera:          [-27.067, -70.820],
    chañaral:         [-26.348, -70.622],
    diego_almagro:    [-26.392, -70.046],
    huasco:           [-28.468, -71.219],
    freirina:         [-28.506, -71.077],
    tierra_amarilla:  [-27.482, -70.265],
    alto_del_carmen:  [-28.759, -70.485],
    // IV - Coquimbo
    la_serena:        [-29.953, -71.343],
    coquimbo:         [-29.963, -71.339],
    ovalle:           [-30.598, -71.200],
    illapel:          [-31.631, -71.169],
    vicuña:           [-30.032, -70.713],
    salamanca:        [-31.779, -70.964],
    los_vilos:        [-31.913, -71.514],
    combarbala:       [-31.180, -71.003],
    andacollo:        [-30.229, -71.085],
    canela:           [-31.396, -71.458],
    monte_patria:     [-30.694, -70.946],
    punitaqui:        [-30.830, -71.258],
    rio_hurtado:      [-30.280, -70.822],
    paiguano:         [-30.032, -70.523],
    // V - Valparaíso
    valparaiso:       [-33.045, -71.620],
    vina_del_mar:     [-33.024, -71.552],
    quillota:         [-32.880, -71.246],
    san_antonio:      [-33.594, -71.613],
    san_felipe:       [-32.751, -70.725],
    los_andes:        [-32.834, -70.598],
    marga_marga:      [-33.050, -71.400],
    quintero:         [-32.784, -71.531],
    villa_alemana:    [-33.042, -71.373],
    quilpue:          [-33.048, -71.441],
    la_ligua:         [-32.449, -71.231],
    limache:          [-33.015, -71.264],
    // RM - Metropolitana
    santiago:         [-33.448, -70.669],
    puente_alto:      [-33.617, -70.575],
    san_bernardo:     [-33.592, -70.705],
    maipu:            [-33.510, -70.766],
    la_florida:       [-33.522, -70.557],
    colina:           [-33.202, -70.674],
    melipilla:        [-33.685, -71.214],
    talagante:        [-33.666, -70.927],
    buin:             [-33.732, -70.742],
    quilicura:        [-33.361, -70.733],
    pudahuel:         [-33.442, -70.803],
    lampa:            [-33.284, -70.875],
    // VI - O'Higgins
    rancagua:         [-34.170, -70.744],
    san_fernando:     [-34.584, -70.989],
    pichilemu:        [-34.385, -72.004],
    rengo:            [-34.406, -70.857],
    san_vicente:      [-34.439, -71.079],
    machali:          [-34.181, -70.650],
    graneros:         [-34.062, -70.723],
    mostazal:         [-33.990, -70.718],
    chimbarongo:      [-34.697, -71.045],
    santa_cruz:       [-34.639, -71.366],
    // VII - Maule
    talca:            [-35.426, -71.655],
    curico:           [-34.985, -71.239],
    linares:          [-35.845, -71.593],
    cauquenes:        [-35.967, -72.315],
    constitucion:     [-35.333, -72.417],
    san_javier:       [-35.590, -71.737],
    molina:           [-35.112, -71.281],
    parral:           [-36.143, -71.826],
    tलेca_clemente:    [-35.531, -71.491],
    // XVI - Ñuble
    chillan:          [-36.606, -72.103],
    san_carlos:       [-36.425, -71.958],
    bulnes:           [-36.742, -72.298],
    coelemu:          [-36.488, -72.702],
    yungay:           [-37.120, -72.019],
    quirihue:         [-36.284, -72.539],
    el_carmen:        [-36.897, -72.025],
    // VIII - Biobío
    concepcion:       [-36.820, -73.044],
    talcahuano:       [-36.724, -73.116],
    los_angeles:      [-37.469, -72.353],
    coronel:          [-37.030, -73.139],
    chiguayante:      [-36.914, -73.023],
    san_pedro_paz:    [-36.842, -73.095],
    penco:            [-36.716, -72.996],
    hualpen:          [-36.795, -73.104],
    tome:             [-36.584, -72.955],
    arauco:           [-37.247, -73.316],
    lebu:             [-37.610, -73.655],
    cañete:           [-37.799, -73.396],
    // IX - Araucanía
    temuco:           [-38.739, -72.590],
    padre_las_casas:  [-38.766, -72.599],
    villarrica:       [-39.281, -72.227],
    angol:            [-37.797, -72.716],
    lautaro:          [-38.531, -72.436],
    victoria:         [-38.214, -72.332],
    pucon:            [-39.273, -71.975],
    nueva_imperial:   [-38.743, -72.950],
    collipulli:       [-37.954, -72.435],
    carahue:          [-38.704, -73.165],
    // XIV - Los Ríos
    valdivia:         [-39.819, -73.245],
    la_union:         [-40.292, -73.082],
    panguipulli:      [-39.643, -72.332],
    rio_bueno:        [-40.332, -72.964],
    mariquina:        [-39.518, -72.969],
    lanco:            [-39.444, -72.791],
    los_lagos_com:    [-39.851, -72.833],
    paillaco:         [-40.077, -72.888],
    // X - Los Lagos
    puerto_montt:     [-41.469, -72.944],
    osorno:           [-40.574, -73.133],
    castro:           [-42.472, -73.764],
    ancud:            [-41.868, -73.828],
    puerto_varas:     [-41.320, -72.985],
    quellon:          [-43.118, -73.615],
    calbuco:          [-41.774, -73.131],
    frutillar:        [-41.114, -73.048],
    purranque:        [-40.916, -73.161],
    chaiten:          [-42.923, -72.709],
    // XI - Aysén
    coyhaique:        [-45.571, -72.068],
    puerto_aysen:     [-45.405, -72.695],
    chile_chico:      [-46.541, -71.722],
    cochrane:         [-47.255, -72.571],
    cisnes:           [-44.747, -72.699],
    guaitecas:        [-43.886, -73.754],
    // XII - Magallanes
    punta_arenas:     [-53.163, -70.907],
    puerto_natales:   [-51.724, -72.506],
    porvenir:         [-53.296, -70.363],
    cabo_hornos:      [-54.935, -67.610]
};

// ── Coordenadas por región para el calor ────────────────────
const COORDENADAS_REGIONES = {
    arica:         [-18.478, -70.312],
    tarapaca:      [-20.213, -70.150],
    antofagasta:   [-23.650, -70.397],
    atacama:       [-27.366, -70.332],
    coquimbo:      [-29.953, -71.343],
    valparaiso:    [-33.045, -71.620],
    metropolitana: [-33.448, -70.669],
    ohiggins:      [-34.170, -70.744],
    maule:         [-35.426, -71.655],
    nuble:         [-36.606, -72.103],
    biobio:        [-36.820, -73.044],
    araucania:     [-38.739, -72.590],
    los_rios:      [-39.819, -73.245],
    los_lagos:     [-41.469, -72.944],
    aysen:         [-45.571, -72.068],
    magallanes:    [-53.163, -70.907]
};

let mapaRadar = null;
let marcadorCiudad = null;

/**
 * Muestra u oculta la sección del mapa
 */
function toggleMapa() {
    const contenedor = document.getElementById('contenedor_mapa');
    if (!contenedor) return;
    
    const isHidden = contenedor.style.display === 'none';
    contenedor.style.display = isHidden ? 'block' : 'none';

    if (isHidden) {
        if (!mapaRadar) {
            inicializarMapa();
        } else {
            setTimeout(() => {
                mapaRadar.invalidateSize();
                marcarCiudadActual();
                dibujarDatos();
            }, 150);
        }
    }
}

/**
 * Inicializa la instancia del mapa centrado en Chile
 */
function inicializarMapa() {
    mapaRadar = L.map('mapa-radar').setView([-35.6751, -71.5429], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© RadarAPR / OpenStreetMap'
    }).addTo(mapaRadar);

    marcarCiudadActual();
    dibujarDatos();
}

/**
 * Pone un marcador azul en la ciudad que el usuario seleccionó en el formulario
 */
function marcarCiudadActual() {
    if (!mapaRadar) return;

    const ciudadSelect = document.getElementById('ciudad');
    if (!ciudadSelect) return;

    const ciudadValue = ciudadSelect.value;

    if (marcadorCiudad) {
        mapaRadar.removeLayer(marcadorCiudad);
        marcadorCiudad = null;
    }

    if (COORDENADAS_CIUDADES[ciudadValue]) {
        const coords = COORDENADAS_CIUDADES[ciudadValue];
        
        marcadorCiudad = L.marker(coords).addTo(mapaRadar)
            .bindPopup(`📍 <strong>Oferta evaluada aquí</strong>`)
            .openPopup();
            
        mapaRadar.setView(coords, 8);
    }
}

/**
 * Obtiene el historial de Supabase (o localStorage) y dibuja círculos de calor
 */
async function dibujarDatos() {
    if (!mapaRadar) return;

    // Limpiar círculos previos
    mapaRadar.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
            mapaRadar.removeLayer(layer);
        }
    });

    let historial = [];

    // CORRECCIÓN: Uso de window.supabaseClient en lugar de la palabra clave global supabase
    if (window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient
                .from('consultas_salariales')
                .select('region, sueldo_ofrecido');

            if (error) {
                console.error('Error cargando datos desde Supabase para mapa:', error);
                historial = JSON.parse(localStorage.getItem('radar_logs') || '[]');
            } else if (data) {
                historial = data.map(item => ({
                    region: item.region,
                    ofrecido: item.sueldo_ofrecido
                }));
            }
        } catch (err) {
            console.error('Excepción al conectar con Supabase desde mapa.js.obfuscated.js:', err);
            historial = JSON.parse(localStorage.getItem('radar_logs') || '[]');
        }
    } else {
        historial = JSON.parse(localStorage.getItem('radar_logs') || '[]');
    }

    const conteo = {};

    historial.forEach(item => {
        if (!item.region) return;
        if (!conteo[item.region]) {
            conteo[item.region] = { cantidad: 0, sueldos: [] };
        }
        conteo[item.region].cantidad++;
        if (item.ofrecido) {
            conteo[item.region].sueldos.push(item.ofrecido);
        }
    });

    for (const reg in conteo) {
        if (COORDENADAS_REGIONES[reg]) {
            const data = conteo[reg];
            const promedio = data.sueldos.length > 0 
                ? data.sueldos.reduce((a, b) => a + b, 0) / data.sueldos.length 
                : 0;

            const radio = 15000 + (data.cantidad * 8000);
            const color = data.cantidad > 5 ? '#c0392b' : (data.cantidad > 2 ? '#e67e22' : '#27ae60');

            L.circle(COORDENADAS_REGIONES[reg], {
                color: color,
                fillColor: color,
                fillOpacity: 0.4,
                radius: Math.min(radio, 80000)
            }).addTo(mapaRadar)
              .bindPopup(`
                <strong>Región:</strong> ${reg.toUpperCase()}<br>
                <strong>Consultas:</strong> ${data.cantidad}<br>
                <strong>Promedio Ofrecido:</strong> ${promedio > 0 ? '$' + Math.round(promedio).toLocaleString('es-CL') : 'No especificado'}
              `);
        }
    }
}

// Escuchar cambios en el selector de ciudades del formulario para mover el mapa dinámicamente
document.addEventListener('DOMContentLoaded', () => {
    const ciudadSelect = document.getElementById('ciudad');
    if (ciudadSelect) {
        ciudadSelect.addEventListener('change', () => {
            const contenedor = document.getElementById('contenedor_mapa');
            if (contenedor && contenedor.style.display !== 'none') {
                marcarCiudadActual();
            }
        });
    }
});