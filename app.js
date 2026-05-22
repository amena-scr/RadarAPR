/**
 * RadarAPR - Motor de Cálculo Salarial y Validación Legal
 * Versión COMPACTA - ZONA EXTREMA AUTOMÁTICA Y AJUSTE DE MESES
 */

// ============================================================
// BASE DE DATOS TÉCNICA
// ============================================================
const DATABASE = {
    sueldosBase: { 
        tecnico: {
            junior: 775000,
            semi_senior: 900000,
            senior: 1140000
        }, 
        ingeniero: {
            junior: 1000000,
            semi_senior: 1266666,
            senior: 1680000
        } 
    },
    mult: {
        region: {
            arica: 1.10, tarapaca: 1.35, antofagasta: 1.50, atacama: 1.30, coquimbo: 1.05, valparaiso: 1.05, metropolitana: 1.00, ohiggins: 0.95, maule: 0.90, nuble: 0.88, biobio: 0.95, araucania: 0.88, los_rios: 0.90, los_lagos: 0.92, aysen: 1.20, magallanes: 1.30
        },
        rubro: {
            mineria_cielo_abierto: 1.45, mineria_subterranea: 1.55, mineria_salares: 1.50, petroleo_gas: 1.45, energias_renovables: 1.35, montaje_industrial: 1.35, obras_civiles: 1.30, edificacion_altura: 1.25, puertos_maritimos: 1.25, transporte_terrestre: 1.20, centros_distribucion: 1.15, forestal_madera: 1.15, agroindustria_pesca: 1.10, manufactura_consumo: 1.05, salud_educacion: 1.05, comercio_retail: 1.00, turismo_gastronomia: 0.95,
            laboratorio_quimico: 1.15
        },
        contrato: { indefinido: 1.00, plazo_fijo: 1.08, obra_faena: 1.15, tiempo_parcial: 1.00, teletrabajo: 1.00, temporada: 1.10, honorarios: 1.22 },
        trabajadores: { t_1_9: 1.00, t_10_49: 1.10, t_50_199: 1.20, t_200_mas: 1.35 },
        modalidad: { oficina: 1.00, mixto: 1.12, terreno: 1.25 },
        sector: { privado: 1.00, publico: 0.88 },
        turno: { lunes_viernes_normal: 1.00, lunes_viernes_art22: 1.15, un_dia_semana: 1.00, turno_4x3: 1.08, turno_nocturno: 1.12, turno_7x7: 1.15, turno_14x14: 1.20, otra_excepcional: 1.15, turno_dia_noche: 1.15 },
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

    const formacionEl = document.getElementById('formacion');
    const regionEl = document.getElementById('region');
    const expEl = document.getElementById('experiencia');
    
    if (!formacionEl || formacionEl.value === "") {
        alert("⚠️ Por favor, selecciona el Nivel de formación requerida.");
        return;
    }
    if (!regionEl || regionEl.value === "") {
        alert("⚠️ Por favor, selecciona la Región de la oferta.");
        return;
    }
    if (!expEl || expEl.value === "") {
        alert("⚠️ Por favor, selecciona la Experiencia requerida para calcular la base salarial.");
        return;
    }

    const formacion = formacionEl.value;
    const region = regionEl.value;
    const experiencia = expEl.value;
    const sueldoOfrecido = Number(sueldoInput.value);

    const getVal = id => { const el = document.getElementById(id); return el && el.value !== "" ? el.value : null; };
    const isChecked = id => { const el = document.getElementById(id); return el ? el.checked : false; };
    const getSelectedText = id => {
        const el = document.getElementById(id);
        if (!el || el.value === "") return "No especificado";
        return el.options[el.selectedIndex].text;
    };

    // CONVERSIÓN A LÍQUIDO: Tomamos la base bruta de MiFuturo y aplicamos ~20% de descuento legal
    let mBase = DATABASE.sueldosBase[formacion][experiencia] * 0.80; 
    
    const mRegion = DATABASE.mult.region[region] || 1.00;

    let mRubro = 1.00, mContrato = 1.00, mTrab = 1.00, mModalidad = 1.00, mSector = 1.00;
    let mTurno = 1.00, mEspecializacion = 1.00, mExpMineria = 1.00, mDuracion = 1.00;

    // LÓGICA AUTOMÁTICA DE ZONA EXTREMA (Sin botón HTML)
    let mZona = 1.00;
    let textoZona = "Estándar";
    if (['aysen', 'magallanes'].includes(region)) {
        mZona = 1.20;
        textoZona = "Extremo Sur (Auto)";
    } else if (['arica', 'tarapaca', 'antofagasta', 'atacama'].includes(region)) {
        mZona = 1.15;
        textoZona = "Extremo Norte (Auto)";
    }

    let bdRubro = 'general';
    let redFlags = [], redFlagsNoSeleccionadas = [];
    
    let etiquetaDuracion = "Sueldo Líquido sugerido (Mensual)";
    let textoFiltroDuracion = "Indefinida / Mensual";

    const cant = Number(getVal('cantidad_duracion')) || 1;
    const uni = getVal('unidad_duracion');

    if (uni !== 'indefinida' && uni !== null) {
        textoFiltroDuracion = `${cant} ${getSelectedText('unidad_duracion')}`;
        
        // CORRECCIÓN: Si es meses o años, NO SE MULTIPLICA por la cantidad de meses, se entrega el valor de 1 mes.
        if (uni === 'horas') { 
            mBase = (mBase / 168) * cant; etiquetaDuracion = `Sugerido Líquido por ${cant} hora(s)`; mDuracion = 1.15; 
        } else if (uni === 'dias') { 
            mBase = (mBase / 30) * cant; etiquetaDuracion = `Sugerido Líquido por ${cant} día(s)`; mDuracion = 1.15; 
        } else if (uni === 'semanas') { 
            mBase = (mBase / 4) * cant; etiquetaDuracion = `Sugerido Líquido por ${cant} semana(s)`; mDuracion = 1.10; 
        } else if (uni === 'meses') { 
            etiquetaDuracion = `Sugerido Líquido (Mensual)`; mDuracion = 1.20; 
        } else if (uni === 'anos') { 
            etiquetaDuracion = `Sugerido Líquido (Mensual)`; mDuracion = 1.00; 
        }
    }

    const rubroVal = getVal('rubro'); bdRubro = rubroVal || 'general'; mRubro = rubroVal ? (DATABASE.mult.rubro[rubroVal] || 1.00) : 1.00;
    
    mContrato = getVal('tipo_contrato') ? (DATABASE.mult.contrato[getVal('tipo_contrato')] || 1.00) : 1.00;
    mTrab = getVal('trabajadores_cargo') ? (DATABASE.mult.trabajadores[getVal('trabajadores_cargo')] || 1.00) : 1.00;
    mModalidad = getVal('modalidad') ? (DATABASE.mult.modalidad[getVal('modalidad')] || 1.00) : 1.00;
    mSector = getVal('sector') ? (DATABASE.mult.sector[getVal('sector')] || 1.00) : 1.00;
    mTurno = getVal('turno') ? (DATABASE.mult.turno[getVal('turno')] || 1.00) : 1.00;
    mEspecializacion = getVal('especializacion') ? (DATABASE.mult.especializacion[getVal('especializacion')] || 1.00) : 1.00;
    mExpMineria = getVal('exp_mineria') ? (DATABASE.mult.exp_mineria[getVal('exp_mineria')] || 1.00) : 1.00;

    const checkFlag = (id, activa, preguntaRec) => { if (isChecked(id)) redFlags.push(activa); else redFlagsNoSeleccionadas.push(preguntaRec); };
    checkFlag('tarea_bodega', 'Administrar bodega', '¿Podría confirmar que no estaré a cargo de administrar bodega?');
    checkFlag('tarea_rrhh', 'Control de asistencia', '¿Me aseguran que mi rol no incluirá control de asistencia?');
    checkFlag('tarea_logistica', 'Coordinación logística', '¿Habrá responsabilidades de logística asignadas al puesto?');
    checkFlag('tarea_contabilidad', 'Funciones contables', '¿Está contemplado que asuma funciones contables o caja?');
    checkFlag('tarea_conduccion', 'Conducir vehículos', '¿Será requisito conducir vehículos de la empresa?');
    checkFlag('tarea_supervision_op', 'Supervisar operación', '¿El cargo requiere supervisar la operación productiva?');

    const sueldoJusto = mBase * mRegion * mRubro * mZona * mContrato * mTrab * mModalidad * mDuracion * mSector * mTurno * mEspecializacion * mExpMineria;
    const diferencia = sueldoOfrecido - sueldoJusto;
    const fmt = n => Math.round(n).toLocaleString('es-CL');

    const resDiv = document.getElementById('resultado_analisis');
    resDiv.style.display = 'block'; resDiv.style.marginTop = '20px'; resDiv.style.padding = '12px'; resDiv.style.borderRadius = '8px';

    let html = `<h4 style="margin:0 0 5px 0">📊 Análisis de la Oferta (Valores Líquidos estimados)</h4>`;

    if (diferencia >= -50000) {
        resDiv.style.backgroundColor = '#d4edda'; resDiv.style.borderLeft = '5px solid #28a745';
        html += `<p style="margin:5px 0; font-size:0.85rem;">✅ <strong>Valor Competitivo:</strong> El monto ofrecido está al nivel del mercado para la duración especificada.</p>`;
    } else {
        resDiv.style.backgroundColor = '#fff3cd'; resDiv.style.borderLeft = '5px solid #ffc107';
        html += `<p style="margin:5px 0; font-size:0.85rem;">⚠️ <strong>Bajo el mercado:</strong> Sugerido <strong>$${fmt(sueldoJusto)}</strong>.<br>
                 <small>La oferta está <strong>$${fmt(Math.abs(diferencia))}</strong> por debajo.</small></p>`;
    }

    html += `<hr style="border:none;border-top:1px solid #ccc;margin:8px 0">`;
    html += `<p style="font-size:0.75rem;color:#555;margin:0 0 4px"><strong>📌 Filtros Seleccionados:</strong></p>`;
    html += `<ul style="font-size:0.75rem; color:#333; margin:0 0 8px 0; padding-left:15px; column-count: 2; column-gap: 15px;">`;
    html += `<li><strong>Formación:</strong> ${getSelectedText('formacion')}</li>`;
    html += `<li><strong>Región:</strong> ${getSelectedText('region')}</li>`;
    html += `<li><strong>Ciudad:</strong> ${getSelectedText('ciudad')}</li>`;
    if (mZona !== 1.00) html += `<li><strong>Zona:</strong> ${textoZona}</li>`; // Muestra en el reporte si la detectó
    html += `<li><strong>Duración:</strong> ${textoFiltroDuracion}</li>`;
    html += `<li><strong>Sector:</strong> ${getSelectedText('rubro')}</li>`;
    html += `<li><strong>Experiencia:</strong> ${getSelectedText('experiencia')}</li>`;
    html += `<li><strong>Contrato:</strong> ${getSelectedText('tipo_contrato')}</li>`;
    html += `<li><strong>Modalidad:</strong> ${getSelectedText('modalidad')}</li>`;
    html += `<li><strong>Turno:</strong> ${getSelectedText('turno')}</li>`;
    html += `<li><strong>Esp.:</strong> ${getSelectedText('especializacion')}</li>`;
    html += `<li><strong>Minería:</strong> ${getSelectedText('exp_mineria')}</li>`;
    html += `<li><strong>Dotación:</strong> ${getSelectedText('trabajadores_cargo')}</li>`;
    html += `</ul>`;

    html += `<hr style="border:none;border-top:1px solid #ccc;margin:8px 0">`;
    html += `<table style="width:100%;font-size:0.80rem;border-collapse:collapse; margin-bottom: 5px;">`;
    html += `<tr><td style="padding:4px;font-weight:bold">${etiquetaDuracion}</td>
                 <td style="padding:4px;text-align:right;font-weight:bold;color:#d35400;font-size:0.95rem">$${fmt(sueldoJusto)}</td></tr>`;
    html += `</table>`;

    if (redFlags.length > 0) {
        resDiv.style.backgroundColor = '#f8d7da'; resDiv.style.borderLeft = '5px solid #dc3545';
        html += `<hr style="border:none;border-top:1px solid #f5c6cb;margin:8px 0">`;
        html += `<p style="color:#721c24;margin:0;font-weight:bold;font-size:0.8rem;">🚩 Alerta de Funciones ajenas al rol:</p>`;
        html += `<ul style="color:#721c24;font-size:0.75rem;margin:4px 0 0 0;padding-left:15px">`;
        redFlags.forEach(f => { html += `<li>${f}</li>`; });
        html += `</ul>`;
    }

    const preguntas = [];
    
    preguntas.push({
        icono: '💡', pregunta: 'Recomendaciones Estratégicas',
        detalle: '• <strong>Negocia:</strong> Usa este dato como respaldo.<br>• <strong>Beneficios:</strong> Consulta por bonos, viáticos o seguros.<br>• <strong>Claridad:</strong> Asegura que el rol se limite a Prevención.'
    });

    if (redFlagsNoSeleccionadas.length > 0) {
        preguntas.push({
            icono: '❓', pregunta: 'Preguntas para el Reclutador (Limitar rol)',
            detalle: '<ul style="margin:4px 0 0;padding-left:15px;font-size:0.75rem;color:#444">' +
                     redFlagsNoSeleccionadas.map(f => `<li style="margin-bottom: 2px;">${f}</li>`).join('') + '</ul>'
        });
    }

    if (preguntas.length > 0) {
        html += `<hr style="border:none;border-top:1px solid #ccc;margin:8px 0">`;
        html += `<p style="font-size:0.8rem;font-weight:bold;color:#2c3e50;margin:0 0 6px">💬 Preparación de Entrevista</p>`;
        preguntas.forEach(p => {
            html += `<div style="background:#f0f4f8;border-left:3px solid #2980b9;border-radius:4px;padding:6px 8px;margin-bottom:6px">
                        <p style="margin:0;font-size:0.8rem;font-weight:bold;color:#1a5276">${p.icono} ${p.pregunta}</p>
                        <p style="margin:4px 0 0;font-size:0.75rem;color:#555;line-height:1.3;">${p.detalle}</p>
                     </div>`;
        });
    }

    html += `<div style="margin-top: 15px;">
                <button type="button" class="btn-pdf" onclick="descargarPDF()" style="background: #e74c3c; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 0.95rem; font-weight: bold; width: 100%; transition: background 0.3s;">
                    📄 Descargar Reporte en PDF
                </button>
             </div>`;

    resDiv.innerHTML = html;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'analisis_realizado',
        'formacion': formacion,
        'region': getSelectedText('region'),
        'sueldo_ofrecido': sueldoOfrecido
    });

    if (window.supabaseClient) {
        const ciudad = document.getElementById('ciudad') ? document.getElementById('ciudad').value : '';
        window.supabaseClient.from('consultas_salariales').insert([{
            formacion: formacion, region: region, ciudad: ciudad, rubro: bdRubro,
            experiencia: experiencia, sueldo_ofrecido: Math.round(sueldoOfrecido), sueldo_sugerido: Math.round(sueldoJusto)
        }]).select().then(({ data, error }) => {
            if (!error && typeof dibujarDatos === 'function' && document.getElementById('contenedor_mapa').style.display !== 'none') {
                dibujarDatos();
            }
        });
    }
}

// ============================================================
// EXPORTADOR A PDF
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
            <h2 style="color: #2c3e50; text-align: center; margin-bottom: 2px; font-family: Arial, sans-serif; font-size: 1.2rem;">RadarAPR 📡</h2>
            <h4 style="color: #7f8c8d; text-align: center; margin-top: 0; margin-bottom: 2px; font-family: Arial, sans-serif; font-size: 0.9rem;">Reporte de Inteligencia Salarial</h4>
            <p style="color: #95a5a6; text-align: center; margin-top: 0; margin-bottom: 15px; font-size: 0.75rem; font-family: Arial, sans-serif;">Análisis generado el: ${fechaActual}</p>
        `;
        elemento.insertBefore(cabecera, elemento.firstChild);
    }

    const opciones = {
        margin:       5, 
        filename:     'Reporte_Salarial_RadarAPR.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, scrollY: 0, scrollX: 0, backgroundColor: '#ffffff' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opciones).from(elemento).save().then(() => {
        if (botonPDF) botonPDF.style.display = 'block'; 
        if (cabecera) cabecera.remove();
        elemento.style.backgroundColor = colorFondoOriginal; 
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'descarga_pdf_reporte'
        });
    });
}

// ============================================================
// EVENTOS INICIALES (CIUDADES Y MAPA)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', actualizarCiudades);
        actualizarCiudades();
    }

    const contratoSelect = document.getElementById('tipo_contrato');
    const infoIcon = document.getElementById('info_contrato');
    if (contratoSelect && infoIcon) {
        contratoSelect.addEventListener('change', () => {
            infoIcon.title = INFO_CONTRATOS[contratoSelect.value] ? INFO_CONTRATOS[contratoSelect.value] : "Información del contrato";
        });
        infoIcon.addEventListener('click', () => {
            const desc = INFO_CONTRATOS[contratoSelect.value];
            if (desc) alert("Detalle del contrato:\n\n" + desc);
        });
    }

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