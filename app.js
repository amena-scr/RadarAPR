/**
 * RadarAPR - Motor de Cálculo Salarial y Validación Legal
 * Versión RESTAURADA ORIGINAL con PDF y Tiempo Custom
 */

// ============================================================
// BASE DE DATOS TÉCNICA (ORIGINAL)
// ============================================================
const DATABASE = {
    sueldosBase: { tecnico: 750000, ingeniero: 980000 },
    mult: {
        region: {
            arica: 1.10, tarapaca: 1.35, antofagasta: 1.50, atacama: 1.30, coquimbo: 1.05, valparaiso: 1.05, metropolitana: 1.00, ohiggins: 0.95, maule: 0.90, nuble: 0.88, biobio: 0.95, araucania: 0.88, los_rios: 0.90, los_lagos: 0.92, aysen: 1.20, magallanes: 1.30
        },
        rubro: {
            mineria_cielo_abierto: 1.45, mineria_subterranea: 1.55, mineria_salares: 1.50, petroleo_gas: 1.45, energias_renovables: 1.35, montaje_industrial: 1.35, obras_civiles: 1.30, edificacion_altura: 1.25, puertos_maritimos: 1.25, transporte_terrestre: 1.20, centros_distribucion: 1.15, forestal_madera: 1.15, agroindustria_pesca: 1.10, manufactura_consumo: 1.05, salud_educacion: 1.05, comercio_retail: 1.00, turismo_gastronomia: 0.95
        },
        experiencia: { junior: 1.00, semi_senior: 1.25, senior: 1.50 },
        contrato: { indefinido: 1.00, plazo_fijo: 1.08, obra_faena: 1.15, tiempo_parcial: 1.00, teletrabajo: 1.00, temporada: 1.10, honorarios: 1.22 },
        trabajadores: { sin_cargo: 1.00, hasta_50: 1.10, hasta_200: 1.20, hasta_500: 1.32, mas_500: 1.45 },
        modalidad: { oficina: 1.00, mixto: 1.12, terreno: 1.25 },
        sector: { privado: 1.00, publico: 0.88 },
        zona_extrema: { no_aplica: 1.00, extremo_norte: 1.15, extremo_sur: 1.20 },
        turno: { lunes_viernes_normal: 1.00, lunes_viernes_art22: 1.15, un_dia_semana: 1.00, turno_4x3: 1.08, turno_nocturno: 1.12, turno_7x7: 1.15, turno_14x14: 1.20, otra_excepcional: 1.15 },
        especializacion: { ninguna: 1.00, sns: 1.05, auditor: 1.08, sernageomin_c: 1.10, sernageomin_b: 1.20, sernageomin_a: 1.35 },
        exp_mineria: { sin_experiencia: 1.00, pequena_mineria: 1.05, mediana_mineria: 1.10, gran_mineria: 1.15 }
    }
};

const INFO_CONTRATOS = {
    indefinido: "Sin fecha de término.", plazo_fijo: "Duración de 1 año o menos.", obra_faena: "Duración 30 días o menos / Mientras dura el servicio.", tiempo_parcial: "Plazo fijo o indefinido, menos de 30 hrs semanales.", teletrabajo: "Funciones fuera de la empresa.", temporada: "Duración algunos meses del año.", honorarios: "Boleta de Honorarios."
};

const CIUDADES_POR_REGION = {
    arica: [{ val: 'arica', txt: 'Arica' }, { val: 'putre', txt: 'Putre' }, { val: 'camarones', txt: 'Camarones' }, { val: 'general_lagos', txt: 'General Lagos' }],
    tarapaca: [{ val: 'iquique', txt: 'Iquique' }, { val: 'alto_hospicio', txt: 'Alto Hospicio' }, { val: 'pozo_almonte', txt: 'Pozo Almonte' }, { val: 'pica', txt: 'Pica' }, { val: 'colchane', txt: 'Colchane' }, { val: 'huara', txt: 'Huara' }, { val: 'camiña', txt: 'Camiña' }],
    antofagasta: [{ val: 'antofagasta', txt: 'Antofagasta' }, { val: 'calama', txt: 'Calama' }, { val: 'taltal', txt: 'Taltal' }, { val: 'mejillones', txt: 'Mejillones' }, { val: 'tocopilla', txt: 'Tocopilla' }, { val: 'sierra_gorda', txt: 'Sierra Gorda' }, { val: 'san_pedro_atacama', txt: 'San Pedro de Atacama' }, { val: 'ollague', txt: 'Ollagüe' }, { val: 'maria_elena', txt: 'María Elena' }],
    atacama: [{ val: 'copiapo', txt: 'Copiapó' }, { val: 'vallenar', txt: 'Vallenar' }, { val: 'caldera', txt: 'Caldera' }, { val: 'chañaral', txt: 'Chañaral' }, { val: 'diego_almagro', txt: 'Diego de Almagro' }, { val: 'huasco', txt: 'Huasco' }, { val: 'freirina', txt: 'Freirina' }, { val: 'tierra_amarilla', txt: 'Tierra Amarilla' }, { val: 'alto_del_carmen', txt: 'Alto del Carmen' }],
    coquimbo: [{ val: 'la_serena', txt: 'La Serena' }, { val: 'coquimbo', txt: 'Coquimbo' }, { val: 'ovalle', txt: 'Ovalle' }, { val: 'illapel', txt: 'Illapel' }, { val: 'vicuña', txt: 'Vicuña' }, { val: 'salamanca', txt: 'Salamanca' }, { val: 'los_vilos', txt: 'Los Vilos' }, { val: 'combarbala', txt: 'Combarbalá' }, { val: 'andacollo', txt: 'Andacollo' }, { val: 'canela', txt: 'Canela' }, { val: 'monte_patria', txt: 'Monte Patria' }, { val: 'punitaqui', txt: 'Punitaqui' }, { val: 'rio_hurtado', txt: 'Río Hurtado' }, { val: 'paiguano', txt: 'Paihuano' }],
    valparaiso: [{ val: 'valparaiso', txt: 'Valparaíso' }, { val: 'vina_del_mar', txt: 'Viña del Mar' }, { val: 'quillota', txt: 'Quillota' }, { val: 'san_antonio', txt: 'San Antonio' }, { val: 'san_felipe', txt: 'San Felipe' }, { val: 'los_andes', txt: 'Los Andes' }, { val: 'marga_marga', txt: 'Marga Marga' }, { val: 'quintero', txt: 'Quintero' }, { val: 'villa_alemana', txt: 'Villa Alemana' }, { val: 'quilpue', txt: 'Quilpué' }, { val: 'la_ligua', txt: 'La Ligua' }, { val: 'limache', txt: 'Limache' }],
    metropolitana: [{ val: 'santiago', txt: 'Santiago' }, { val: 'puente_alto', txt: 'Puente Alto' }, { val: 'san_bernardo', txt: 'San Bernardo' }, { val: 'maipu', txt: 'Maipú' }, { val: 'la_florida', txt: 'La Florida' }, { val: 'colina', txt: 'Colina' }, { val: 'melipilla', txt: 'Melipilla' }, { val: 'talagante', txt: 'Talagante' }, { val: 'buin', txt: 'Buin' }, { val: 'quilicura', txt: 'Quilicura' }, { val: 'pudahuel', txt: 'Pudahuel' }, { val: 'lampa', txt: 'Lampa' }],
    ohiggins: [{ val: 'rancagua', txt: 'Rancagua' }, { val: 'san_fernando', txt: 'San Fernando' }, { val: 'pichilemu', txt: 'Pichilemu' }, { val: 'rengo', txt: 'Rengo' }, { val: 'san_vicente', txt: 'San Vicente' }, { val: 'machali', txt: 'Machalí' }, { val: 'graneros', txt: 'Graneros' }, { val: 'mostazal', txt: 'Mostazal' }, { val: 'chimbarongo', txt: 'Chimbarongo' }, { val: 'santa_cruz', txt: 'Santa Cruz' }],
    maule: [{ val: 'talca', txt: 'Talca' }, { val: 'curico', txt: 'Curicó' }, { val: 'linares', txt: 'Linares' }, { val: 'cauquenes', txt: 'Cauquenes' }, { val: 'constitucion', txt: 'Constitución' }, { val: 'san_javier', txt: 'San Javier' }, { val: 'molina', txt: 'Molina' }, { val: 'parral', txt: 'Parral' }, { val: 'san_clemente', txt: 'San Clemente' }],
    nuble: [{ val: 'chillan', txt: 'Chillán' }, { val: 'san_carlos', txt: 'San Carlos' }, { val: 'bulnes', txt: 'Bulnes' }, { val: 'coelemu', txt: 'Coelemu' }, { val: 'yungay', txt: 'Yungay' }, { val: 'quirihue', txt: 'Quirihue' }, { val: 'el_carmen', txt: 'El Carmen' }],
    biobio: [{ val: 'concepcion', txt: 'Concepción' }, { val: 'talcahuano', txt: 'Talcahuano' }, { val: 'los_angeles', txt: 'Los Ángeles' }, { val: 'coronel', txt: 'Coronel' }, { val: 'chiguayante', txt: 'Chiguayante' }, { val: 'san_pedro_paz', txt: 'San Pedro de la Paz' }, { val: 'penco', txt: 'Penco' }, { val: 'hualpen', txt: 'Hualpén' }, { val: 'tome', txt: 'Tomé' }, { val: 'arauco', txt: 'Arauco' }, { val: 'lebu', txt: 'Lebu' }, { val: 'cañete', txt: 'Cañete' }],
    araucania: [{ val: 'temuco', txt: 'Temuco' }, { val: 'padre_las_casas', txt: 'Padre Las Casas' }, { val: 'villarrica', txt: 'Villarrica' }, { val: 'angol', txt: 'Angol' }, { val: 'lautaro', txt: 'Lautaro' }, { val: 'victoria', txt: 'Victoria' }, { val: 'pucon', txt: 'Pucón' }, { val: 'nueva_imperial', txt: 'Nueva Imperial' }, { val: 'collipulli', txt: 'Collipulli' }, { val: 'carahue', txt: 'Carahue' }],
    los_rios: [{ val: 'valdivia', txt: 'Valdivia' }, { val: 'la_union', txt: 'La Unión' }, { val: 'panguipulli', txt: 'Panguipulli' }, { val: 'rio_bueno', txt: 'Río Bueno' }, { val: 'mariquina', txt: 'Mariquina' }, { val: 'lanco', txt: 'Lanco' }, { val: 'los_lagos_com', txt: 'Los Lagos' }, { val: 'paillaco', txt: 'Paillaco' }],
    los_lagos: [{ val: 'puerto_montt', txt: 'Puerto Montt' }, { val: 'osorno', txt: 'Osorno' }, { val: 'castro', txt: 'Castro' }, { val: 'ancud', txt: 'Ancud' }, { val: 'puerto_varas', txt: 'Puerto Varas' }, { val: 'quellon', txt: 'Quellón' }, { val: 'calbuco', txt: 'Calbuco' }, { val: 'frutillar', txt: 'Frutillar' }, { val: 'purranque', txt: 'Purranque' }, { val: 'chaiten', txt: 'Chaitén' }],
    aysen: [{ val: 'coyhaique', txt: 'Coyhaique' }, { val: 'puerto_aysen', txt: 'Puerto Aysén' }, { val: 'chile_chico', txt: 'Chile Chico' }, { val: 'cochrane', txt: 'Cochrane' }, { val: 'cisnes', txt: 'Cisnes' }, { val: 'guaitecas', txt: 'Guaitecas' }],
    magallanes: [{ val: 'punta_arenas', txt: 'Punta Arenas' }, { val: 'puerto_natales', txt: 'Puerto Natales' }, { val: 'porvenir', txt: 'Porvenir' }, { val: 'cabo_hornos', txt: 'Cabo de Hornos' }]
};

function toggleAvanzados() {
    const panel = document.getElementById('seccion_avanzada');
    const btn = document.querySelector('.btn-avanzados');
    const open = panel.style.display === 'block';
    panel.style.display = open ? 'none' : 'block';
    if (btn) btn.classList.toggle('open', !open);
}

function actualizarCiudades() {
    const regionSelect = document.getElementById('region');
    const ciudadSelect = document.getElementById('ciudad');
    if (!regionSelect || !ciudadSelect) return;
    const region = regionSelect.value;
    ciudadSelect.innerHTML = '<option value="" selected>Seleccione una ciudad (Opcional)</option>';
    if (CIUDADES_POR_REGION[region]) {
        CIUDADES_POR_REGION[region].forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.val; opt.textContent = c.txt;
            ciudadSelect.appendChild(opt);
        });
    }
}

// ============================================================
// FUNCIÓN PRINCIPAL: EVALUAR OFERTA
// ============================================================
function evaluarOferta() {
    const sueldoInput = document.getElementById('sueldo_ofrecido');
    if (!sueldoInput || sueldoInput.value.trim() === "") {
        alert("⚠️ Por favor, ingresa el Sueldo Líquido Ofrecido ($) para realizar el análisis.");
        return;
    }

    const formacion = document.getElementById('formacion').value;
    const region = document.getElementById('region').value;
    const sueldoOfrecido = Number(sueldoInput.value);

    const getVal = id => { const el = document.getElementById(id); return el && el.value !== "" ? el.value : null; };
    const isChecked = id => { const el = document.getElementById(id); return el ? el.checked : false; };
    const getSelectedText = id => {
        const el = document.getElementById(id);
        if (!el || el.value === "") return "No especificado";
        return el.options[el.selectedIndex].text;
    };

    const avanzadosActivos = document.getElementById('seccion_avanzada').style.display === 'block';

    let mBase = DATABASE.sueldosBase[formacion];
    const mRegion = DATABASE.mult.region[region] || 1.00;

    let mRubro = 1.00, mExp = 1.00, mZona = 1.00;
    let mContrato = 1.00, mTrab = 1.00, mModalidad = 1.00, mSector = 1.00;
    let mTurno = 1.00, mEspecializacion = 1.00, mExpMineria = 1.00, mDuracion = 1.00;

    let bdRubro = 'general', bdExp = 'general';
    let redFlags = [], redFlagsNoSeleccionadas = [];
    
    let etiquetaDuracion = "Sueldo sugerido (Mensual)";
    let textoFiltroDuracion = "Indefinida / Mensual";

    // NUEVA LÓGICA DE TIEMPOS PERSONALIZADOS
    if (avanzadosActivos) {
        const cant = Number(getVal('cantidad_duracion')) || 1;
        const uni = getVal('unidad_duracion');

        if (uni !== 'indefinida' && uni !== null) {
            textoFiltroDuracion = `${cant} ${getSelectedText('unidad_duracion')}`;
            if (uni === 'horas') {
                mBase = (mBase / 168) * cant; etiquetaDuracion = `Sugerido por ${cant} hora(s)`; mDuracion = 1.15;
            } else if (uni === 'dias') {
                mBase = (mBase / 30) * cant; etiquetaDuracion = `Sugerido por ${cant} día(s)`; mDuracion = 1.15;
            } else if (uni === 'semanas') {
                mBase = (mBase / 4) * cant; etiquetaDuracion = `Sugerido por ${cant} semana(s)`; mDuracion = 1.10;
            } else if (uni === 'meses') {
                mBase = mBase * cant; etiquetaDuracion = `Sugerido por ${cant} mes(es)`; mDuracion = 1.20;
            } else if (uni === 'anos') {
                mBase = (mBase * 12) * cant; etiquetaDuracion = `Sugerido por ${cant} año(s)`; mDuracion = 1.00;
            }
        }

        const rubroVal = getVal('rubro'); bdRubro = rubroVal || 'general'; mRubro = rubroVal ? (DATABASE.mult.rubro[rubroVal] || 1.00) : 1.00;
        const expVal = getVal('experiencia'); bdExp = expVal || 'general'; mExp = expVal ? (DATABASE.mult.experiencia[expVal] || 1.00) : 1.00;
        
        mZona = getVal('zona_extrema') ? (DATABASE.mult.zona_extrema[getVal('zona_extrema')] || 1.00) : 1.00;
        mContrato = getVal('tipo_contrato') ? (DATABASE.mult.contrato[getVal('tipo_contrato')] || 1.00) : 1.00;
        mTrab = getVal('trabajadores_cargo') ? (DATABASE.mult.trabajadores[getVal('trabajadores_cargo')] || 1.00) : 1.00;
        mModalidad = getVal('modalidad') ? (DATABASE.mult.modalidad[getVal('modalidad')] || 1.00) : 1.00;
        mSector = getVal('sector') ? (DATABASE.mult.sector[getVal('sector')] || 1.00) : 1.00;
        mTurno = getVal('turno') ? (DATABASE.mult.turno[getVal('turno')] || 1.00) : 1.00;
        mEspecializacion = getVal('especializacion') ? (DATABASE.mult.especializacion[getVal('especializacion')] || 1.00) : 1.00;
        mExpMineria = getVal('exp_mineria') ? (DATABASE.mult.exp_mineria[getVal('exp_mineria')] || 1.00) : 1.00;

        const checkFlag = (id, activa, inactiva) => { if (isChecked(id)) redFlags.push(activa); else redFlagsNoSeleccionadas.push(inactiva); };
        checkFlag('tarea_bodega', 'Administrar bodega o materiales', '¿Es obligatorio administrar bodega o entregar materiales?');
        checkFlag('tarea_rrhh', 'Control de asistencia o remuneraciones', '¿Tendré responsabilidades en control de asistencia o RRHH?');
        checkFlag('tarea_logistica', 'Coordinación logística o despachos', '¿Debo coordinar temas de logística o despachos?');
        checkFlag('tarea_contabilidad', 'Funciones contables o finanzas', '¿Me asignarán funciones contables o caja chica?');
        checkFlag('tarea_conduccion', 'Conducción de vehículos empresa', '¿Es requisito conducir vehículos y asumir la responsabilidad civil?');
        checkFlag('tarea_supervision_op', 'Supervisión de la operación', '¿Seré responsable de supervisar la producción además de mi rol?');
    }

    const sueldoJusto = mBase * mRegion * mRubro * mExp * mZona * mContrato * mTrab * mModalidad * mDuracion * mSector * mTurno * mEspecializacion * mExpMineria;
    const diferencia = sueldoOfrecido - sueldoJusto;
    const fmt = n => Math.round(n).toLocaleString('es-CL');

    const resDiv = document.getElementById('resultado_analisis');
    resDiv.style.display = 'block'; resDiv.style.marginTop = '25px'; resDiv.style.padding = '20px'; resDiv.style.borderRadius = '8px';

    let html = `<h4 style="margin-top:0">📊 Análisis de la Oferta</h4>`;

    if (diferencia >= -50000) {
        resDiv.style.backgroundColor = '#d4edda'; resDiv.style.borderLeft = '6px solid #28a745';
        html += `<p>✅ <strong>Valor Competitivo:</strong> El monto ofrecido está al nivel del mercado para la duración especificada.</p>`;
    } else {
        resDiv.style.backgroundColor = '#fff3cd'; resDiv.style.borderLeft = '6px solid #ffc107';
        html += `<p>⚠️ <strong>Valor bajo el mercado:</strong> El valor estimado es <strong>$${fmt(sueldoJusto)}</strong>.<br>
                 <small>La oferta ingresada está <strong>$${fmt(Math.abs(diferencia))}</strong> por debajo.</small></p>`;
    }

    html += `<hr style="border:none;border-top:1px solid #ccc;margin:12px 0">`;
    html += `<p style="font-size:0.85rem;color:#555;margin:0 0 6px"><strong>📌 Filtros y Parámetros Seleccionados:</strong></p>`;
    html += `<ul style="font-size:0.8rem; color:#333; margin:0 0 15px 0; padding-left:20px; column-count: 2; column-gap: 20px;">`;
    html += `<li><strong>Formación:</strong> ${getSelectedText('formacion')}</li>`;
    html += `<li><strong>Región:</strong> ${getSelectedText('region')}</li>`;
    html += `<li><strong>Ciudad:</strong> ${getSelectedText('ciudad')}</li>`;
    if (avanzadosActivos) {
        html += `<li><strong>Duración:</strong> ${textoFiltroDuracion}</li>`;
        html += `<li><strong>Sector:</strong> ${getSelectedText('rubro')}</li>`;
        html += `<li><strong>Experiencia:</strong> ${getSelectedText('experiencia')}</li>`;
        html += `<li><strong>Contrato:</strong> ${getSelectedText('tipo_contrato')}</li>`;
        html += `<li><strong>Modalidad:</strong> ${getSelectedText('modalidad')}</li>`;
        html += `<li><strong>Turno:</strong> ${getSelectedText('turno')}</li>`;
        html += `<li><strong>Especialización:</strong> ${getSelectedText('especializacion')}</li>`;
        html += `<li><strong>Exp. Minería:</strong> ${getSelectedText('exp_mineria')}</li>`;
        html += `<li><strong>Dotación:</strong> ${getSelectedText('trabajadores_cargo')}</li>`;
    }
    html += `</ul>`;

    html += `<hr style="border:none;border-top:1px solid #ccc;margin:12px 0">`;
    html += `<table style="width:100%;font-size:0.80rem;border-collapse:collapse; margin-bottom: 10px;">`;
    html += `<tr><td style="padding:8px 6px;font-weight:bold">${etiquetaDuracion}</td>
                 <td style="padding:8px 6px;text-align:right;font-weight:bold;color:#d35400;font-size:1.05rem">$${fmt(sueldoJusto)}</td></tr>`;
    html += `</table>`;

    if (redFlags.length > 0) {
        resDiv.style.backgroundColor = '#f8d7da'; resDiv.style.borderLeft = '6px solid #dc3545';
        html += `<hr style="border:none;border-top:1px solid #f5c6cb;margin:12px 0">`;
        html += `<p style="color:#721c24;margin:0">🚩 <strong>Alerta de Multifuncionalidad (DS N°44):</strong></p>`;
        html += `<ul style="color:#721c24;font-size:0.85rem;margin:6px 0 0 0;padding-left:20px">`;
        redFlags.forEach(f => { html += `<li>${f}</li>`; });
        html += `</ul>`;
    }

    const preguntas = [];
    if (!avanzadosActivos) {
        preguntas.push({ icono: '📄', pregunta: '¿Cuál es el tipo de contrato, jornada y sistema de turnos?', detalle: 'Condiciones esporádicas justifican valores mayores.' });
    }
    if (avanzadosActivos && redFlagsNoSeleccionadas.length > 0) {
        preguntas.push({
            icono: '🛡️', pregunta: 'Aclarar límites de tu cargo preventivo',
            detalle: 'Sugerimos aclarar esto en entrevista:<br><ul style="margin:6px 0 0;padding-left:18px;font-size:0.78rem;color:#444">' +
                     redFlagsNoSeleccionadas.map(f => `<li>${f}</li>`).join('') + '</ul>'
        });
    }

    if (preguntas.length > 0) {
        html += `<hr style="border:none;border-top:1px solid #ccc;margin:14px 0">`;
        html += `<p style="font-size:0.85rem;font-weight:bold;color:#2c3e50;margin:0 0 4px">💬 Preguntas sugeridas para la entrevista</p>`;
        preguntas.forEach(p => {
            html += `<div style="background:#f0f4f8;border-left:3px solid #2980b9;border-radius:5px;padding:8px 10px;margin-bottom:7px">
                        <p style="margin:0;font-size:0.85rem;font-weight:bold;color:#1a5276">${p.icono} ${p.pregunta}</p>
                        <p style="margin:4px 0 0;font-size:0.78rem;color:#555">${p.detalle}</p>
                     </div>`;
        });
    }

    html += `<div style="margin-top: 20px;">
                <button type="button" class="btn-pdf" onclick="descargarPDF()" style="background: #e74c3c; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: bold; width: 100%; transition: background 0.3s;">
                    📄 Descargar Reporte en PDF
                </button>
             </div>`;

    resDiv.innerHTML = html;

    // Conexión Supabase (ORIGINAL INTACTA)
    if (window.supabaseClient) {
        const ciudad = document.getElementById('ciudad') ? document.getElementById('ciudad').value : '';
        window.supabaseClient.from('consultas_salariales').insert([{
            formacion: formacion, region: region, ciudad: ciudad, rubro: bdRubro,
            experiencia: bdExp, sueldo_ofrecido: Math.round(sueldoOfrecido), sueldo_sugerido: Math.round(sueldoJusto)
        }]).select().then(({ data, error }) => {
            if (!error && typeof dibujarDatos === 'function' && document.getElementById('contenedor_mapa').style.display !== 'none') {
                dibujarDatos();
            }
        });
    }
}

// ============================================================
// EXPORTADOR A PDF (FECHA, HORA Y FONDO BLANCO)
// ============================================================
function descargarPDF() {
    const elemento = document.getElementById('resultado_analisis');
    if (!elemento) return;

    const botonPDF = elemento.querySelector('.btn-pdf');
    if (botonPDF) botonPDF.style.display = 'none';

    const colorFondoOriginal = elemento.style.backgroundColor;
    elemento.style.backgroundColor = '#ffffff';

    let cabecera = document.getElementById('titulo-temporal-pdf');
    if (!cabecera) {
        const fechaActual = new Date().toLocaleString('es-CL');
        cabecera = document.createElement('div');
        cabecera.id = 'titulo-temporal-pdf';
        cabecera.innerHTML = `
            <h2 style="color: #2c3e50; text-align: center; margin-bottom: 2px; font-family: Arial, sans-serif;">RadarAPR 📡</h2>
            <h4 style="color: #7f8c8d; text-align: center; margin-top: 0; margin-bottom: 5px; font-family: Arial, sans-serif;">Reporte de Inteligencia Salarial</h4>
            <p style="color: #95a5a6; text-align: center; margin-top: 0; margin-bottom: 20px; font-size: 0.85rem; font-family: Arial, sans-serif;">Análisis generado el: ${fechaActual}</p>
        `;
        elemento.insertBefore(cabecera, elemento.firstChild);
    }

    const opciones = {
        margin:       10,
        filename:     'Reporte_Salarial_RadarAPR.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, scrollY: 0, scrollX: 0, backgroundColor: '#ffffff' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opciones).from(elemento).save().then(() => {
        if (botonPDF) botonPDF.style.display = 'block'; 
        if (cabecera) cabecera.remove();
        elemento.style.backgroundColor = colorFondoOriginal; 
    });
}

// ============================================================
// EVENTOS ADICIONALES ORIGINALES (MAPA Y CIUDADES INTACTOS)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Llenar ciudades al cargar e interceptar el cambio de región
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', actualizarCiudades);
        actualizarCiudades();
    }

    // 2. Lógica para actualizar el tooltip del Tipo de Contrato
    const contratoSelect = document.getElementById('tipo_contrato');
    const infoIcon = document.getElementById('info_contrato');
    if (contratoSelect && infoIcon) {
        contratoSelect.addEventListener('change', () => {
            if (INFO_CONTRATOS[contratoSelect.value]) {
                infoIcon.title = INFO_CONTRATOS[contratoSelect.value];
            } else {
                infoIcon.title = "Información del contrato";
            }
        });
        infoIcon.addEventListener('click', () => {
            const desc = INFO_CONTRATOS[contratoSelect.value];
            if (desc) alert("Detalle del contrato:\n\n" + desc);
        });
    }

    // 3. Lógica para el mapa al cambiar ciudad
    const ciudadSelect = document.getElementById('ciudad');
    if (ciudadSelect) {
        ciudadSelect.addEventListener('change', () => {
            const contenedor = document.getElementById('contenedor_mapa');
            if (contenedor && contenedor.style.display !== 'none') {
                if (typeof marcarCiudadActual === 'function') marcarCiudadActual();
            }
        });
    }
});