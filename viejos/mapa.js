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
    tocopilla:        [-22.092, -70.197],
    mejillones:       [-23.098, -70.454],
    maria_elena:      [-22.353, -69.660],
    sierra_gorda:     [-22.896, -69.322],
    taltal:           [-25.395, -70.481],
    san_pedro_atacama:[-22.909, -68.200],
    // III - Atacama
    copiapo:          [-27.366, -70.332],
    caldera:          [-27.069, -70.823],
    tierra_amarilla:  [-27.490, -70.273],
    chanaral:         [-26.349, -70.622],
    diego_almagro:    [-26.374, -70.044],
    vallenar:         [-28.574, -70.760],
    freirina:         [-28.512, -71.077],
    huasco:           [-28.459, -71.219],
    // IV - Coquimbo
    la_serena:        [-29.902, -71.252],
    coquimbo:         [-29.953, -71.343],
    ovalle:           [-30.603, -71.198],
    illapel:          [-31.635, -71.165],
    los_vilos:        [-31.912, -71.509],
    vicuna:           [-30.032, -70.712],
    andacollo:        [-30.231, -71.085],
    monte_patria:     [-30.694, -70.966],
    combarbala:       [-31.178, -71.020],
    salamanca:        [-31.773, -70.965],
    paihuano:         [-30.001, -70.503],
    // V - Valparaíso
    valparaiso:       [-33.045, -71.620],
    viña_del_mar:     [-33.024, -71.552],
    quilpue:          [-33.042, -71.443],
    villa_alemana:    [-33.041, -71.373],
    san_antonio:      [-33.594, -71.619],
    quillota:         [-32.876, -71.247],
    los_andes:        [-32.834, -70.598],
    san_felipe:       [-32.750, -70.724],
    la_ligua:         [-32.455, -71.232],
    limache:          [-33.000, -71.267],
    olmue:            [-32.987, -71.192],
    isla_de_pascua:   [-27.112, -109.349],
    rancagua_v:       [-33.316, -71.526],
    cartagena:        [-33.555, -71.614],
    san_pedro_valpo:  [-33.628, -71.464],
    // RM - Región Metropolitana
    santiago:         [-33.448, -70.669],
    puente_alto:      [-33.610, -70.576],
    maipu:            [-33.519, -70.758],
    la_florida:       [-33.517, -70.598],
    las_condes:       [-33.416, -70.574],
    san_bernardo:     [-33.594, -70.712],
    penalolen:        [-33.491, -70.546],
    providencia:      [-33.432, -70.618],
    vitacura:         [-33.393, -70.579],
    lo_barnechea:     [-33.352, -70.516],
    buin:             [-33.731, -70.742],
    melipilla:        [-33.691, -71.212],
    talagante:        [-33.661, -70.928],
    colina:           [-33.199, -70.676],
    lampa:            [-33.283, -70.880],
    quilicura:        [-33.365, -70.742],
    conchali:         [-33.374, -70.659],
    recoleta:         [-33.397, -70.639],
    independencia:    [-33.420, -70.650],
    el_bosque:        [-33.571, -70.666],
    estacion_central: [-33.455, -70.710],
    padre_hurtado:    [-33.558, -70.820],
    paine:            [-33.811, -70.739],
    // VI - O'Higgins
    rancagua:         [-34.170, -70.744],
    san_fernando:     [-34.585, -70.985],
    rengo:            [-34.399, -70.862],
    machalí:          [-34.177, -70.653],
    santa_cruz:       [-34.637, -71.362],
    pichilemu:        [-34.387, -72.000],
    graneros:         [-34.068, -70.724],
    codegua:          [-34.033, -70.649],
    // VII - Maule
    talca:            [-35.426, -71.655],
    curico:           [-34.979, -71.239],
    linares:          [-35.848, -71.597],
    constitución:     [-35.329, -72.413],
    cauquenes:        [-35.968, -72.321],
    molina:           [-35.113, -71.281],
    parral:           [-36.155, -71.827],
    san_javier:       [-35.596, -71.740],
    maule_ciudad:     [-35.496, -71.673],
    // XVI - Ñuble
    chillan:          [-36.606, -72.103],
    chillan_viejo:    [-36.623, -72.118],
    san_carlos:       [-36.422, -71.955],
    bulnes:           [-36.742, -72.296],
    quirihue:         [-36.286, -72.535],
    yungay:           [-37.113, -72.010],
    coelemu:          [-36.486, -72.706],
    // VIII - Biobío
    concepcion:       [-36.820, -73.044],
    talcahuano:       [-36.713, -73.116],
    los_angeles:      [-37.470, -72.351],
    hualpén:          [-36.773, -73.095],
    chiguayante:      [-36.921, -73.016],
    san_pedro_de_la_paz: [-36.844, -73.100],
    coronel:          [-37.021, -73.147],
    lota:             [-37.089, -73.158],
    lebu:             [-37.608, -73.651],
    cañete:           [-37.799, -73.396],
    arauco:           [-37.246, -73.317],
    tome:             [-36.619, -72.957],
    penco:            [-36.737, -72.986],
    cabrero:          [-37.031, -72.412],
    yumbel:           [-37.100, -72.531],
    nacimiento:       [-37.504, -72.671],
    mulchen:          [-37.718, -72.233],
    // IX - Araucanía
    temuco:           [-38.739, -72.590],
    padre_las_casas:  [-38.771, -72.598],
    angol:            [-37.799, -72.709],
    victoria:         [-38.229, -72.330],
    pitrufquen:       [-38.977, -72.647],
    lautaro:          [-38.528, -72.444],
    nueva_imperial:   [-38.744, -72.952],
    villarrica:       [-39.284, -72.226],
    pucon:            [-39.272, -71.978],
    carahue:          [-38.706, -73.157],
    cunco:            [-38.928, -72.020],
    curacautin:       [-38.423, -71.883],
    // XIV - Los Ríos
    valdivia:         [-39.819, -73.245],
    la_union:         [-40.294, -73.081],
    rio_bueno:        [-40.326, -72.961],
    panguipulli:      [-39.641, -72.337],
    los_lagos_lr:     [-39.849, -72.824],
    futrono:          [-40.130, -72.394],
    corral:           [-39.883, -73.433],
    // X - Los Lagos
    puerto_montt:     [-41.469, -72.944],
    puerto_varas:     [-41.319, -72.988],
    osorno:           [-40.574, -73.135],
    castro:           [-42.481, -73.763],
    ancud:            [-41.869, -73.830],
    calbuco:          [-41.771, -73.131],
    llanquihue:       [-41.254, -73.005],
    frutillar:        [-41.126, -73.055],
    chonchi:          [-42.622, -73.769],
    quemchi:          [-42.143, -73.473],
    chaitén:          [-42.917, -72.707],
    cochamo:          [-41.487, -72.296],
    // XI - Aysén
    coyhaique:        [-45.571, -72.068],
    aysen_ciudad:     [-45.403, -72.703],
    chile_chico:      [-46.538, -71.724],
    cochrane:         [-47.244, -72.561],
    villa_ohiggins:   [-48.468, -72.571],
    puyuhuapi:        [-44.333, -72.574],
    lago_verde:       [-44.271, -71.843],
    // XII - Magallanes
    punta_arenas:     [-53.163, -70.907],
    puerto_natales:   [-51.727, -72.494],
    porvenir:         [-53.299, -70.371],
    puerto_williams:  [-54.935, -67.613],
    punta_delgada:    [-52.436, -69.646]
};

// ── Coordenadas por región (fallback) ──────────────────────
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
let markerCiudad = null;

// ── Toggle visibilidad del mapa ─────────────────────────────
function toggleMapa() {
    const contenedor = document.getElementById('contenedor_mapa');
    const isHidden = contenedor.style.display === 'none';

    contenedor.style.display = isHidden ? 'block' : 'none';

    if (isHidden && !mapaRadar) {
        inicializarMapa();
    } else if (isHidden) {
        setTimeout(() => mapaRadar.invalidateSize(), 100);
        actualizarMarcadorCiudad();
        dibujarDatos();
    }
}

// ── Inicializar mapa ────────────────────────────────────────
function inicializarMapa() {
    mapaRadar = L.map('mapa-radar').setView([-35.6751, -71.5429], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© RadarAPR / OpenStreetMap'
    }).addTo(mapaRadar);

    actualizarMarcadorCiudad();
    dibujarDatos();

    // Actualizar marcador cuando cambia la ciudad
    const selectCiudad = document.getElementById('ciudad');
    if (selectCiudad) {
        selectCiudad.addEventListener('change', () => {
            if (mapaRadar && document.getElementById('contenedor_mapa').style.display !== 'none') {
                actualizarMarcadorCiudad();
            }
        });
    }
}

// ── Marcador de ciudad seleccionada ────────────────────────
function actualizarMarcadorCiudad() {
    const selectCiudad = document.getElementById('ciudad');
    if (!selectCiudad || !mapaRadar) return;

    const ciudadVal = selectCiudad.value;
    const nombreCiudad = selectCiudad.options[selectCiudad.selectedIndex].text;

    // Obtener coordenadas: ciudad → región como fallback
    let coords = COORDENADAS_CIUDADES[ciudadVal];
    if (!coords) {
        const region = document.getElementById('region')?.value;
        coords = COORDENADAS_REGIONES[region] || [-35.6751, -71.5429];
    }

    // Ícono personalizado
    const icono = L.divIcon({
        className: '',
        html: `<div style="
            background: #d35400;
            border: 3px solid #fff;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            width: 22px; height: 22px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 22]
    });

    // Eliminar marcador anterior
    if (markerCiudad) mapaRadar.removeLayer(markerCiudad);

    markerCiudad = L.marker(coords, { icon: icono })
        .addTo(mapaRadar)
        .bindPopup(`<strong>📍 ${nombreCiudad}</strong><br><small>Ciudad seleccionada para análisis</small>`)
        .openPopup();

    mapaRadar.flyTo(coords, 9, { animate: true, duration: 1.2 });
}

// ── Capa de calor histórica por región ─────────────────────
async function dibujarDatos() {
    mapaRadar.eachLayer((layer) => {
        if (layer instanceof L.Circle) mapaRadar.removeLayer(layer);
    });

    let historial = [];

    if (window.supabase) {
        try {
            const { data, error } = await supabase
                .from('consultas_salariales')
                .select('region, sueldo_ofrecido');
            
            if (error) throw error;
            
            // Adaptar los datos de Supabase al formato que espera el mapa
            if (data) {
                historial = data.map(row => ({
                    region: row.region,
                    ofrecido: row.sueldo_ofrecido
                }));
            }
        } catch (err) {
            console.error('Error cargando historial de Supabase:', err);
            // Fallback en caso de error
            historial = JSON.parse(localStorage.getItem('radar_logs') || '[]');
        }
    } else {
        // Fallback si Supabase no está cargado
        historial = JSON.parse(localStorage.getItem('radar_logs') || '[]');
    }

    const conteo = {};

    historial.forEach(item => {
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
                <strong>Promedio Ofrecido:</strong> $${Math.round(promedio).toLocaleString('es-CL')}
              `);
        }
    }
}