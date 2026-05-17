/**
 * RadarAPR - Motor de Cálculo Salarial y Validación Legal
 * Versión: 1.1.0 — Con Filtros Avanzados
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
            arica: 1.10,
            tarapaca: 1.35,
            antofagasta: 1.50,
            atacama: 1.30,
            coquimbo: 1.05,
            valparaiso: 1.05,
            metropolitana: 1.00,
            ohiggins: 0.95,
            maule: 0.90,
            nuble: 0.88,
            biobio: 0.95,
            araucania: 0.88,
            los_rios: 0.90,
            los_lagos: 0.92,
            aysen: 1.20,
            magallanes: 1.30
        },

        // ── Rubro / Sector Económico ──
        rubro: {
            mineria_cielo_abierto: 1.50,
            mineria_subterranea: 1.60,
            mineria_salares: 1.55,
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
        experiencia: {
            junior: 1.00,
            semi_senior: 1.25,
            senior: 1.50
        },

        // ── FILTROS AVANZADOS ──

        // Tipo de Contrato
        contrato: {
            indefinido: 1.00,
            plazo_fijo: 1.08,
            honorarios: 1.22,
            obra_faena: 1.15
        },

        // Trabajadores a Cargo
        trabajadores: {
            sin_cargo: 1.00,
            hasta_50: 1.10,
            hasta_200: 1.20,
            hasta_500: 1.32,
            mas_500: 1.45
        },

        // Modalidad de Trabajo
        modalidad: {
            oficina: 1.00,
            mixto: 1.12,
            terreno: 1.25
        },

        // Duración del Servicio
        duracion: {
            indefinida: 1.00,
            largo: 1.00,
            mediano: 1.08,
            corto: 1.15,
            un_mes: 1.20,
            solo_un_mes: 1.25,
            un_dia: 1.30
        },

        // Sector
        sector: {
            privado: 1.00,
            publico_general: 0.88,
            publico_salud: 0.90,
            publico_educacion: 0.82
        },

        // Zona Extrema
        zona_extrema: {
            no_aplica: 1.00,
            extremo_norte: 1.15,
            extremo_sur: 1.20
        }
    }
};

// ============================================================
// CONTROL DE INTERFAZ
// ============================================================

function toggleAvanzados() {
    const panel = document.getElementById('seccion_avanzada');
    const btn = document.getElementById('btn-avanzados');
    const open = panel.style.display === 'block';
    panel.style.display = open ? 'none' : 'block';
    if (btn) btn.classList.toggle('open', !open);
}

// ============================================================
// FUNCIÓN PRINCIPAL: EVALUAR OFERTA
// ============================================================
function evaluarOferta() {

    // ── 1. Campos base ──
    const sueldoInput = document.getElementById('sueldo_ofrecido');
    if (!sueldoInput || sueldoInput.value.trim() === "") {
        alert("⚠️ Por favor, ingresa el Sueldo Líquido Ofrecido ($) para realizar el análisis.");
        if (sueldoInput) sueldoInput.focus();
        return;
    }
    const formacion = document.getElementById('formacion').value;
    const region = document.getElementById('region').value;
    const rubro = document.getElementById('rubro').value;
    const exp = document.getElementById('experiencia').value;
    const sueldoOfrecido = Number(sueldoInput.value);

    // ── 2. Siempre leer TODOS los filtros avanzados ──
    //    Si el panel está cerrado los selects mantienen su valor por defecto,
    //    lo que equivale a multiplicador ×1.00 (sin impacto en el cálculo).
    const getVal = id => {
        const el = document.getElementById(id);
        return el ? el.value : null;
    };
    const isChecked = id => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    };

    const zona_extrema = getVal('zona_extrema') || 'no_aplica';
    const contrato     = getVal('tipo_contrato') || 'indefinido';
    const trabajadores = getVal('trabajadores_cargo') || 'sin_cargo';
    const modalidad    = getVal('modalidad') || 'oficina';
    const duracion     = getVal('duracion') || 'indefinida';
    const sector       = getVal('sector') || 'privado';

    const redFlags = [];
    if (isChecked('tarea_bodega'))       redFlags.push('Administrar bodega o materiales');
    if (isChecked('tarea_rrhh'))         redFlags.push('Control de asistencia o remuneraciones');
    if (isChecked('tarea_logistica'))    redFlags.push('Coordinación logística o despachos');
    if (isChecked('tarea_contabilidad')) redFlags.push('Funciones contables o de finanzas');
    if (isChecked('tarea_conduccion'))   redFlags.push('Conducción de vehículos de la empresa');
    if (isChecked('tarea_supervision_op')) redFlags.push('Supervisión de la operación productiva');

    // ── 3. Cálculo (siempre aplica todos los multiplicadores) ──
    const mBase      = DATABASE.sueldosBase[formacion];
    const mRegion    = DATABASE.mult.region[region]        || 1.00;
    const mRubro     = DATABASE.mult.rubro[rubro]          || 1.00;
    const mExp       = DATABASE.mult.experiencia[exp]      || 1.00;
    const mZona      = DATABASE.mult.zona_extrema[zona_extrema] || 1.00;
    const mContrato  = DATABASE.mult.contrato[contrato]    || 1.00;
    const mTrab      = DATABASE.mult.trabajadores[trabajadores] || 1.00;
    const mModalidad = DATABASE.mult.modalidad[modalidad]  || 1.00;
    const mDuracion  = DATABASE.mult.duracion[duracion]    || 1.00;
    const mSector    = DATABASE.mult.sector[sector]        || 1.00;

    const sueldoJusto = mBase * mRegion * mRubro * mExp * mZona
                      * mContrato * mTrab * mModalidad * mDuracion * mSector;

    const diferencia = sueldoOfrecido - sueldoJusto;
    const fmt = n => Math.round(n).toLocaleString('es-CL');

    // ── 4. Renderizar resultado ──
    const resDiv = document.getElementById('resultado_analisis');
    resDiv.style.display = 'block';
    resDiv.style.marginTop = '25px';
    resDiv.style.padding = '20px';
    resDiv.style.borderRadius = '8px';

    let html = `<h4 style="margin-top:0">📊 Análisis de la Oferta</h4>`;

    if (diferencia >= -50000) {
        resDiv.style.backgroundColor = '#d4edda';
        resDiv.style.borderLeft = '6px solid #28a745';
        html += `<p>✅ <strong>Sueldo Competitivo:</strong> El monto ofrecido está alineado con el mercado técnico para este perfil.</p>`;
    } else {
        resDiv.style.backgroundColor = '#fff3cd';
        resDiv.style.borderLeft = '6px solid #ffc107';
        html += `<p>⚠️ <strong>Sueldo bajo el mercado:</strong> El sueldo estimado para este perfil es <strong>$${fmt(sueldoJusto)}</strong> líquidos.<br>
                 <small>El ofrecido ($${fmt(sueldoOfrecido)}) está <strong>$${fmt(Math.abs(diferencia))}</strong> por debajo.</small></p>`;
    }

    // Tabla de factores
    html += `<hr style="border:none;border-top:1px solid #ccc;margin:12px 0">`;
    html += `<p style="font-size:0.82rem;color:#555;margin:0 0 6px"><strong>Factores aplicados:</strong></p>`;
    html += `<table style="width:100%;font-size:0.80rem;border-collapse:collapse">`;

    const filas = [
        ['Sueldo base',          `$${fmt(mBase)}`],
        ['Región',               `×${mRegion.toFixed(2)}`],
        ['Sector económico',     `×${mRubro.toFixed(2)}`],
        ['Experiencia',          `×${mExp.toFixed(2)}`],
        ['Zona extrema',         `×${mZona.toFixed(2)}`],
        ['Tipo de contrato',     `×${mContrato.toFixed(2)}`],
        ['Trabajadores a cargo', `×${mTrab.toFixed(2)}`],
        ['Modalidad',            `×${mModalidad.toFixed(2)}`],
        ['Duración del servicio',`×${mDuracion.toFixed(2)}`],
        ['Sector institución',   `×${mSector.toFixed(2)}`],
    ];

    filas.forEach(([label, val]) => {
        html += `<tr>
            <td style="padding:3px 6px;color:#333">${label}</td>
            <td style="padding:3px 6px;text-align:right;font-weight:bold;color:#2c3e50">${val}</td>
        </tr>`;
    });

    html += `<tr style="border-top:1px solid #ccc">
        <td style="padding:5px 6px;font-weight:bold">Sueldo sugerido</td>
        <td style="padding:5px 6px;text-align:right;font-weight:bold;color:#d35400;font-size:0.95rem">$${fmt(sueldoJusto)}</td>
    </tr>`;
    html += `</table>`;

    // Banderas rojas detectadas
    if (redFlags.length > 0) {
        resDiv.style.backgroundColor = '#f8d7da';
        resDiv.style.borderLeft = '6px solid #dc3545';
        html += `<hr style="border:none;border-top:1px solid #f5c6cb;margin:12px 0">`;
        html += `<p style="color:#721c24;margin:0">🚩 <strong>Alerta de Multifuncionalidad (DS N°44):</strong></p>`;
        html += `<ul style="color:#721c24;font-size:0.85rem;margin:6px 0 0 0;padding-left:20px">`;
        redFlags.forEach(f => { html += `<li>${f}</li>`; });
        html += `</ul>`;
        html += `<p style="color:#721c24;font-size:0.82rem;margin:8px 0 0">Estas tareas exceden el ámbito legal del Experto en Prevención. Considera negociar una compensación adicional.</p>`;
    }

    // ── 5. Preguntas para negociar (filtros en valor por defecto) ──
    const preguntas = [];

    if (contrato === 'indefinido') {
        preguntas.push({
            icono: '📄',
            pregunta: '¿Cuál es el tipo de contrato que ofrecen?',
            detalle: 'Consulta si es indefinido, a plazo fijo, por honorarios o por obra/faena. Cada modalidad implica distintos derechos y niveles de compensación.'
        });
    }
    if (trabajadores === 'sin_cargo') {
        preguntas.push({
            icono: '👷',
            pregunta: '¿Cuántos trabajadores tendría a mi cargo o bajo mi asesoría directa?',
            detalle: 'El volumen de trabajadores determina la carga real del cargo y es un argumento clave para negociar el sueldo.'
        });
    }
    if (modalidad === 'oficina') {
        preguntas.push({
            icono: '🏗️',
            pregunta: '¿El cargo es de oficina, en terreno/faena o en modalidad mixta?',
            detalle: 'El trabajo en terreno implica mayor exposición al riesgo y debe ser compensado económicamente.'
        });
    }
    if (duracion === 'indefinida') {
        preguntas.push({
            icono: '⏱️',
            pregunta: '¿Cuál es la duración del proyecto o del contrato?',
            detalle: 'Un contrato de corta duración requiere una tarifa más alta para compensar la inestabilidad laboral.'
        });
    }
    if (sector === 'privado') {
        preguntas.push({
            icono: '🏛️',
            pregunta: '¿Es empresa privada o un organismo público (municipio, servicio, hospital)?',
            detalle: 'El sector define el marco de remuneraciones aplicable y los beneficios adicionales del cargo.'
        });
    }
    if (redFlags.length === 0) {
        preguntas.push({
            icono: '🚩',
            pregunta: '¿El cargo incluye funciones ajenas al Experto en Prevención?',
            detalle: `Según el <strong>Decreto Supremo N°44</strong> (Art. 10–12), las funciones <u>legales</u> del Experto en Prevención son:<br>
                <ol style="margin:6px 0 4px;padding-left:18px;font-size:0.78rem;color:#444">
                    <li>Planificar, organizar y supervisar el programa de prevención de riesgos.</li>
                    <li>Asesorar al empleador en la formulación de políticas y metas de seguridad.</li>
                    <li>Inspeccionar y controlar las condiciones ambientales y de trabajo.</li>
                    <li>Investigar accidentes del trabajo y enfermedades profesionales.</li>
                    <li>Mantener las estadísticas de siniestralidad (tasas de frecuencia y gravedad).</li>
                    <li>Colaborar con los Comités Paritarios de Higiene y Seguridad.</li>
                    <li>Programar y promover capacitación y gestionar la IRL.</li>
                    <li>Controlar el uso de elementos de protección personal.</li>
                    <li>Coordinar acciones con el organismo administrador (ISL / Mutualidad).</li>
                    <li>Mantener actualizado el RIOHS.</li>
                </ol>
                <span style="color:#c0392b;font-size:0.78rem">⚠️ Funciones como bodega, RRHH, logística, contabilidad, conducción o supervisión de operaciones <strong>no están contempladas</strong> en el DS N°44 y constituyen multifuncionalidad no remunerada.</span>`
        });
    }

    // Pregunta de beneficios (siempre aparece)
    preguntas.push({
        icono: '🍽️',
        pregunta: '¿La empresa costea alimentación, alojamiento o traslados?',
        detalle: `Estos beneficios tienen impacto directo en el costo de vida real del cargo. Consulta específicamente por:<br>
            <ul style="margin:5px 0 4px;padding-left:18px;font-size:0.78rem;color:#444">
                <li><strong>Alimentación:</strong> ¿Casino en faena, colación o asignación en dinero?</li>
                <li><strong>Alojamiento:</strong> ¿Campamento, hotel o asignación para arriendo?</li>
                <li><strong>Traslado de ciudad:</strong> ¿Pasaje aéreo o terrestre pagado por la empresa?</li>
                <li><strong>Transporte de acercamiento:</strong> ¿Movilización desde la ciudad al lugar de trabajo?</li>
            </ul>
            <span style="font-size:0.78rem;color:#555">Si estos beneficios <strong>no están incluidos</strong>, el sueldo ofrecido debe cubrir esos costos. Considéralos al negociar.</span>`
    });

    if (preguntas.length > 0) {
        html += `<hr style="border:none;border-top:1px solid #ccc;margin:14px 0">`;
        html += `<p style="font-size:0.85rem;font-weight:bold;color:#2c3e50;margin:0 0 4px">
                    💬 Preguntas para negociar informado
                 </p>`;
        html += `<p style="font-size:0.78rem;color:#888;margin:0 0 10px">
                    Los filtros marcados con ⬜ no fueron completados. Usa estas preguntas en la entrevista para afinar el cálculo salarial.
                 </p>`;
        preguntas.forEach(p => {
            html += `<div style="background:#f0f4f8;border-left:3px solid #2980b9;border-radius:5px;padding:8px 10px;margin-bottom:7px">
                        <p style="margin:0;font-size:0.85rem;font-weight:bold;color:#1a5276">${p.icono} ${p.pregunta}</p>
                        <p style="margin:4px 0 0;font-size:0.78rem;color:#555">${p.detalle}</p>
                     </div>`;
        });
    }

    resDiv.innerHTML = html;

    // ── 6. Guardar consulta en Supabase ──
    if (window.supabase) {
        const ciudad = document.getElementById('ciudad') ? document.getElementById('ciudad').value : '';
        supabase.from('consultas_salariales').insert([
            {
                formacion: formacion,
                region: region,
                ciudad: ciudad,
                rubro: rubro,
                experiencia: exp,
                sueldo_ofrecido: sueldoOfrecido,
                sueldo_sugerido: sueldoJusto
            }
        ]).then(({ data, error }) => {
            if (error) {
                console.error('Error guardando en Supabase:', error);
            } else {
                console.log('Consulta guardada en Supabase');
                // Si el mapa está visible, actualizarlo
                if (typeof dibujarDatos === 'function' && document.getElementById('contenedor_mapa').style.display !== 'none') {
                    dibujarDatos();
                }
            }
        });
    } else {
        // Fallback a localStorage si Supabase falla
        const historial = JSON.parse(localStorage.getItem('radar_logs') || '[]');
        historial.push({
            region: region,
            ofrecido: sueldoOfrecido,
            fecha: new Date().toISOString()
        });
        localStorage.setItem('radar_logs', JSON.stringify(historial));
        
        if (typeof dibujarDatos === 'function' && document.getElementById('contenedor_mapa').style.display !== 'none') {
            dibujarDatos();
        }
    }
}