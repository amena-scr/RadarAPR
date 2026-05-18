/**
 * RadarAPR - Motor de Cálculo Salarial y Validación Legal
 * Versión: 1.1.3 — Ajuste de Jornadas y Tarifas Por Día
 * Base normativa: INE 2026 / DS 44 / Ley 16.744
 */

// ============================================================
// BASE DE DATOS TÉCNICA
// ============================================================
const DATABASE = {

    sueldosBase: {
        tecnico: 750000,
        ingeniero: 980000
    },

    mult: {
        // ── Región (16 regiones de Chile) ──
        region: {
            arica: 1.10, tarapaca: 1.35, antofagasta: 1.50, atacama: 1.30,
            coquimbo: 1.05, valparaiso: 1.05, metropolitana: 1.00, ohiggins: 0.95,
            maule: 0.90, nuble: 0.88, biobio: 0.95, araucania: 0.88,
            los_rios: 0.90, los_lagos: 0.92, aysen: 1.20, magallanes: 1.30
        },

        // ── Rubro / Sector Económico ──
        rubro: {
            mineria_cielo_abierto: 1.45,
            mineria_subterranea: 1.55,
            mineria_salares: 1.50,
            petroleo_gas: 1.45,
            energias_renovables: 1.35,
            montaje_industrial: 1.35,
            obras_civiles: 1.30,
            edificacion_altura: 1.25,
            puertos_maritimos: 1.25,
            transporte_terrestre: 1.20,
            centros_distribucion: 1.15,
            forestal_madera: 1.15,
            barrio_industrial: 1.10,
            agroindustria_pesca: 1.10,
            manufactura_consumo: 1.05,
            salud_educacion: 1.05,
            comercio_retail: 1.00,
            turismo_gastronomia: 0.95,
            servicios_publicos: 0.90,
            municipalidad: 0.85
        },

        // ── Experiencia ──
        experiencia: { junior: 1.00, semi_senior: 1.25, senior: 1.50 },

        // ── FILTROS AVANZADOS ──
        contrato: { indefinido: 1.00, plazo_fijo: 1.08, honorarios: 1.22, obra_faena: 1.15 },
        trabajadores: { sin_cargo: 1.00, hasta_50: 1.10, hasta_200: 1.20, hasta_500: 1.32, mas_500: 1.45 },
        modalidad: { oficina: 1.00, mixto: 1.12, terreno: 1.25 },

        // ── Duración del Servicio ──
        duracion: {
            indefinida: 1.00,
            largo: 1.00,
            mediano: 1.08,
            corto: 1.15,
            un_mes: 1.20,
            solo_un_mes: 1.25,
            un_dia: 1.80 // Factor de recargo por jornada única esporádica
        },

        sector: { privado: 1.00, publico_general: 0.88, publico_salud: 0.90, publico_educacion: 0.82 },
        zona_extrema: { no_aplica: 1.00, extremo_norte: 1.15, extremo_sur: 1.20 },

        // ── Jornada y Turnos (Separado Lunes a Viernes de Art. 22) ──
        turno: {
            lunes_viernes_normal: 1.00,
            lunes_viernes_art22: 1.15, // Mayor disponibilidad horaria requerida
            turno_5x2: 1.05,
            turno_4x3: 1.08,
            turno_nocturno: 1.12,
            turno_7x7: 1.15,
            turno_14x14: 1.20
        },
        especializacion: { ninguna: 1.00, sns: 1.05, auditor: 1.08, sernageomin_c: 1.10, sernageomin_b: 1.20, sernageomin_a: 1.35 },
        exp_mineria: { sin_experiencia: 1.00, pequena_mineria: 1.05, mediana_mineria: 1.10, gran_mineria: 1.15 }
    }
};

// ============================================================
// CONTROL DE INTERFAZ
// ============================================================

function toggleAvanzados() {
    const panel = document.getElementById('seccion_avanzada');
    const btn = document.querySelector('.btn-avanzados');
    const open = panel.style.display === 'block';
    panel.style.display = open ? 'none' : 'block';
    if (btn) btn.classList.toggle('open', !open);
}

// ============================================================
// FUNCIÓN PRINCIPAL: EVALUAR OFERTA
// ============================================================
function evaluarOferta() {

    // ── 1. Validación inicial ──
    const sueldoInput = document.getElementById('sueldo_ofrecido');
    if (!sueldoInput || sueldoInput.value.trim() === "") {
        alert("⚠️ Por favor, ingresa el Sueldo Líquido Ofrecido ($) para realizar el análisis.");
        if (sueldoInput) sueldoInput.focus();
        return;
    }

    const formacion = document.getElementById('formacion').value;
    const region = document.getElementById('region').value;
    const sueldoOfrecido = Number(sueldoInput.value);

    // ── 2. Helpers de captura ──
    const getVal = id => {
        const el = document.getElementById(id);
        return el ? el.value : null;
    };
    const isChecked = id => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    };

    // ── 3. Estado del Panel Avanzado ──
    const panelAvanzado = document.getElementById('seccion_avanzada');
    const avanzadosActivos = panelAvanzado && (panelAvanzado.style.display === 'block');

    // Factores Base
    let mBase = DATABASE.sueldosBase[formacion];
    const mRegion = DATABASE.mult.region[region] || 1.00;

    // Factores Avanzados (Bloqueados en 1.00 por defecto)
    let mRubro = 1.00, mExp = 1.00, mZona = 1.00;
    let mContrato = 1.00, mTrab = 1.00, mModalidad = 1.00, mDuracion = 1.00, mSector = 1.00;
    let mTurno = 1.00, mEspecializacion = 1.00, mExpMineria = 1.00;

    let bdRubro = 'general';
    let bdExp = 'general';
    let redFlags = [];

    const duracionVal = getVal('duracion');

    // CORRECCIÓN: Si es "por dia", dividimos la base mensual por 30 para calcular sobre 1 día real
    if (avanzadosActivos && duracionVal === 'un_dia') {
        mBase = mBase / 30;
    }

    // ── 4. Lectura si el panel está abierto ──
    if (avanzadosActivos) {
        const rubroVal = getVal('rubro');
        const expVal = getVal('experiencia');

        bdRubro = rubroVal || 'general';
        bdExp = expVal || 'general';

        mRubro = DATABASE.mult.rubro[rubroVal] || 1.00;
        mExp = DATABASE.mult.experiencia[expVal] || 1.00;
        mZona = DATABASE.mult.zona_extrema[getVal('zona_extrema')] || 1.00;
        mContrato = DATABASE.mult.contrato[getVal('tipo_contrato')] || 1.00;
        mTrab = DATABASE.mult.trabajadores[getVal('trabajadores_cargo')] || 1.00;
        mModalidad = DATABASE.mult.modalidad[getVal('modalidad')] || 1.00;
        mDuracion = DATABASE.mult.duracion[duracionVal] || 1.00;
        mSector = DATABASE.mult.sector[getVal('sector')] || 1.00;

        mTurno = DATABASE.mult.turno[getVal('turno')] || 1.00;
        mEspecializacion = DATABASE.mult.especializacion[getVal('especializacion')] || 1.00;
        mExpMineria = DATABASE.mult.exp_mineria[getVal('exp_mineria')] || 1.00;

        if (isChecked('tarea_bodega')) redFlags.push('Administrar bodega o materiales');
        if (isChecked('tarea_rrhh')) redFlags.push('Control de asistencia o remuneraciones');
        if (isChecked('tarea_logistica')) redFlags.push('Coordinación logística o despachos');
        if (isChecked('tarea_contabilidad')) redFlags.push('Funciones contables o de finanzas');
        if (isChecked('tarea_conduccion')) redFlags.push('Conducción de vehículos de la empresa');
        if (isChecked('tarea_supervision_op')) redFlags.push('Supervisión de la operación productiva');
    }

    // ── 5. Cálculo Matemático ──
    const sueldoJusto = mBase * mRegion * mRubro * mExp * mZona * mContrato * mTrab * mModalidad * mDuracion * mSector * mTurno * mEspecializacion * mExpMineria;
    const diferencia = sueldoOfrecido - sueldoJusto;
    const fmt = n => Math.round(n).toLocaleString('es-CL');

    // ── 6. Renderizar panel de resultados ──
    const resDiv = document.getElementById('resultado_analisis');
    resDiv.style.display = 'block';
    resDiv.style.marginTop = '25px';
    resDiv.style.padding = '20px';
    resDiv.style.borderRadius = '8px';

    let html = `<h4 style="margin-top:0">📊 Análisis de la Oferta</h4>`;

    if (diferencia >= -50000) {
        resDiv.style.backgroundColor = '#d4edda';
        resDiv.style.borderLeft = '6px solid #28a745';
        html += `<p>✅ <strong>Sueldo Competitivo:</strong> El monto ofrecido está al nivel del mercado técnico analizado.</p>`;
    } else {
        resDiv.style.backgroundColor = '#fff3cd';
        resDiv.style.borderLeft = '6px solid #ffc107';
        html += `<p>⚠️ <strong>Sueldo bajo el mercado:</strong> El valor de mercado estimado es <strong>$${fmt(sueldoJusto)}</strong> líquidos.<br>
                 <small>El valor ingresado ($${fmt(sueldoOfrecido)}) está <strong>$${fmt(Math.abs(diferencia))}</strong> por debajo.</small></p>`;
    }

    html += `<hr style="border:none;border-top:1px solid #ccc;margin:12px 0">`;
    html += `<p style="font-size:0.82rem;color:#555;margin:0 0 6px"><strong>Factores matemáticos aplicados:</strong></p>`;
    html += `<table style="width:100%;font-size:0.80rem;border-collapse:collapse">`;

    const filas = [
        [duracionVal === 'un_dia' ? 'Sueldo base (Por día)' : 'Sueldo base', `$${fmt(mBase)}`],
        ['Región', `×${mRegion.toFixed(2)}`]
    ];

    if (avanzadosActivos) {
        if (mRubro !== 1.00) filas.push(['Sector económico', `×${mRubro.toFixed(2)}`]);
        if (mExp !== 1.00) filas.push(['Experiencia general', `×${mExp.toFixed(2)}`]);
        if (mZona !== 1.00) filas.push(['Zona extrema', `×${mZona.toFixed(2)}`]);
        if (mContrato !== 1.00) filas.push(['Tipo de contrato', `×${mContrato.toFixed(2)}`]);
        if (mTrab !== 1.00) filas.push(['Trabajadores a cargo', `×${mTrab.toFixed(2)}`]);
        if (mModalidad !== 1.00) filas.push(['Modalidad', `×${mModalidad.toFixed(2)}`]);
        if (mTurno !== 1.00) filas.push(['Sistema de jornada/turno', `×${mTurno.toFixed(2)}`]);
        if (mDuracion !== 1.00) filas.push(['Duración del servicio', `×${mDuracion.toFixed(2)}`]);
        if (mEspecializacion !== 1.00) filas.push(['Resolución/Certificación', `×${mEspecializacion.toFixed(2)}`]);
        if (mExpMineria !== 1.00) filas.push(['Experiencia en minería', `×${mExpMineria.toFixed(2)}`]);
        if (mSector !== 1.00) filas.push(['Sector institución', `×${mSector.toFixed(2)}`]);
    }

    filas.forEach(([label, val]) => {
        html += `<tr>
            <td style="padding:3px 6px;color:#333">${label}</td>
            <td style="padding:3px 6px;text-align:right;font-weight:bold;color:#2c3e50">${val}</td>
        </tr>`;
    });

    html += `<tr style="border-top:1px solid #ccc">
        <td style="padding:5px 6px;font-weight:bold">${duracionVal === 'un_dia' ? 'Sugerido por día' : 'Sueldo sugerido mensual'}</td>
        <td style="padding:5px 6px;text-align:right;font-weight:bold;color:#d35400;font-size:0.95rem">$${fmt(sueldoJusto)}</td>
    </tr>`;
    html += `</table>`;

    if (redFlags.length > 0) {
        resDiv.style.backgroundColor = '#f8d7da';
        resDiv.style.borderLeft = '6px solid #dc3545';
        html += `<hr style="border:none;border-top:1px solid #f5c6cb;margin:12px 0">`;
        html += `<p style="color:#721c24;margin:0">🚩 <strong>Alerta de Multifuncionalidad (DS N°44):</strong></p>`;
        html += `<ul style="color:#721c24;font-size:0.85rem;margin:6px 0 0 0;padding-left:20px">`;
        redFlags.forEach(f => { html += `<li>${f}</li>`; });
        html += `</ul>`;
        html += `<p style="color:#721c24;font-size:0.82rem;margin:8px 0 0">Estas tareas exceden el ámbito legal del cargo de Experto en Prevención. Considera negociar una compensación adicional o rechazar responsabilidades civiles ajenas.</p>`;
    }

    // ── 7. Preguntas de Entrevista ──
    const preguntas = [];
    if (!avanzadosActivos) {
        preguntas.push({
            icono: '📄',
            pregunta: '¿Cuál es el tipo de contrato, jornada y sistema de turnos?',
            detalle: 'Un contrato esporádico o regirse por el Artículo 22 (sin límite horario) justifican la exigencia de un valor mayor.'
        });
        preguntas.push({
            icono: '👷',
            pregunta: '¿Cuántos trabajadores están expuestos bajo mi responsabilidad?',
            detalle: 'A mayor masa laboral activa, mayor es la carga penal y civil asignada ante contingencias.'
        });
    }

    preguntas.push({
        icono: '🍽️',
        pregunta: '¿La oferta incluye asignaciones operativas directas?',
        detalle: 'Si no cubren viáticos mínimos de traslado, alojamiento o alimentación en faenas alejadas, dichos costos deben indexarse sumándose al piso salarial pretendido.'
    });

    if (preguntas.length > 0) {
        html += `<hr style="border:none;border-top:1px solid #ccc;margin:14px 0">`;
        html += `<p style="font-size:0.85rem;font-weight:bold;color:#2c3e50;margin:0 0 4px">💬 Puntos clave para la entrevista</p>`;
        preguntas.forEach(p => {
            html += `<div style="background:#f0f4f8;border-left:3px solid #2980b9;border-radius:5px;padding:8px 10px;margin-bottom:7px">
                        <p style="margin:0;font-size:0.85rem;font-weight:bold;color:#1a5276">${p.icono} ${p.pregunta}</p>
                        <p style="margin:4px 0 0;font-size:0.78rem;color:#555">${p.detalle}</p>
                     </div>`;
        });
    }

    resDiv.innerHTML = html;

    // ── 8. Persistencia en Supabase ──
    if (window.supabaseClient) {
        const ciudad = document.getElementById('ciudad') ? document.getElementById('ciudad').value : '';
        window.supabaseClient.from('consultas_salariales').insert([
            {
                formacion: formacion,
                region: region,
                ciudad: ciudad,
                rubro: bdRubro,
                experiencia: bdExp,
                sueldo_ofrecido: Math.round(sueldoOfrecido),
                sueldo_sugerido: Math.round(sueldoJusto)
            }
        ]).select().then(({ data, error }) => {
            if (!error && typeof dibujarDatos === 'function' && document.getElementById('contenedor_mapa').style.display !== 'none') {
                dibujarDatos();
            }
        });
    }
}