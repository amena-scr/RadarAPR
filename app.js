/**
 * RadarAPR - Motor de Cálculo Salarial y Validación Legal
 * Actualizado con: Reporte PDF, Listado de Filtros, Banderas Rojas y Fracciones de Tiempo Custom.
 */

const DATABASE = {
    sueldosBase: { tecnico: 750000, ingeniero: 980000 },
    mult: {
        region: { arica: 1.10, tarapaca: 1.35, antofagasta: 1.50, metropolitana: 1.00, valparaiso: 1.05 },
        rubro: { mineria_cielo_abierto: 1.45, obras_civiles: 1.30, comercio_retail: 1.00, salud_educacion: 1.05 },
        experiencia: { junior: 1.00, semi_senior: 1.25, senior: 1.50 },
        contrato: { indefinido: 1.00, plazo_fijo: 1.08, obra_faena: 1.15, honorarios: 1.22 },
        modalidad: { oficina: 1.00, terreno: 1.25 },
        turno: { lunes_viernes_normal: 1.00, turno_7x7: 1.15, turno_nocturno: 1.12 },
        duracionRiesgo: { horas: 1.15, dias: 1.15, semanas: 1.10, meses: 1.05, anos: 1.00, indefinida: 1.00 }
    }
};

function toggleAvanzados() {
    const panel = document.getElementById('seccion_avanzada');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function evaluarOferta() {
    const sueldoInput = document.getElementById('sueldo_ofrecido');
    if (!sueldoInput || sueldoInput.value.trim() === "") {
        alert("⚠️ Por favor, ingresa el Sueldo Líquido Ofrecido ($).");
        return;
    }

    const formacion = document.getElementById('formacion').value;
    const region = document.getElementById('region').value;
    const sueldoOfrecido = Number(sueldoInput.value);

    const getVal = id => {
        const el = document.getElementById(id);
        return el && el.value !== "" ? el.value : null;
    };
    const isChecked = id => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    };
    const getSelectedText = id => {
        const el = document.getElementById(id);
        if (!el || el.value === "" || el.value === "indefinida") return "No especificado / Normal";
        return el.options[el.selectedIndex].text;
    };

    const avanzadosActivos = document.getElementById('seccion_avanzada').style.display === 'block';

    let mBase = DATABASE.sueldosBase[formacion];
    const mRegion = DATABASE.mult.region[region] || 1.00;

    let mRubro = 1.00, mExp = 1.00, mContrato = 1.00, mModalidad = 1.00, mTurno = 1.00, mRiesgoDuracion = 1.00;
    let redFlags = [], redFlagsNoSeleccionadas = [];
    
    let etiquetaDuracion = "Sueldo sugerido (Mensual)";
    let textoFiltroDuracion = "Indefinida / Mensual";

    // LÓGICA DE TIEMPOS PERSONALIZADOS (Horas, Días, Semanas, Meses, Años)
    if (avanzadosActivos) {
        const cant = Number(getVal('cantidad_duracion')) || 1;
        const uni = getVal('unidad_duracion');
        
        if (uni !== 'indefinida') {
            textoFiltroDuracion = `${cant} ${getSelectedText('unidad_duracion')}`;
            // Convertimos la base mensual en proporción al tiempo ingresado
            if (uni === 'horas') { mBase = (mBase / 168) * cant; etiquetaDuracion = `Sugerido por ${cant} hora(s)`; }
            if (uni === 'dias') { mBase = (mBase / 30) * cant; etiquetaDuracion = `Sugerido por ${cant} día(s)`; }
            if (uni === 'semanas') { mBase = (mBase / 4) * cant; etiquetaDuracion = `Sugerido por ${cant} semana(s)`; }
            if (uni === 'meses') { mBase = mBase * cant; etiquetaDuracion = `Sugerido por ${cant} mes(es)`; }
            if (uni === 'anos') { mBase = (mBase * 12) * cant; etiquetaDuracion = `Sugerido por ${cant} año(s)`; }
            mRiesgoDuracion = DATABASE.mult.duracionRiesgo[uni] || 1.00;
        }

        mRubro = getVal('rubro') ? (DATABASE.mult.rubro[getVal('rubro')] || 1.00) : 1.00;
        mExp = getVal('experiencia') ? (DATABASE.mult.experiencia[getVal('experiencia')] || 1.00) : 1.00;
        mContrato = getVal('tipo_contrato') ? (DATABASE.mult.contrato[getVal('tipo_contrato')] || 1.00) : 1.00;
        mModalidad = getVal('modalidad') ? (DATABASE.mult.modalidad[getVal('modalidad')] || 1.00) : 1.00;
        mTurno = getVal('turno') ? (DATABASE.mult.turno[getVal('turno')] || 1.00) : 1.00;

        const checkFlag = (id, activa, inactiva) => { if (isChecked(id)) redFlags.push(activa); else redFlagsNoSeleccionadas.push(inactiva); };
        checkFlag('tarea_bodega', 'Administrar bodega', '¿Es obligatorio administrar bodega o entregar materiales?');
        checkFlag('tarea_rrhh', 'Control de asistencia', '¿Tendré responsabilidades en control de asistencia o RRHH?');
        checkFlag('tarea_logistica', 'Coordinación logística', '¿Debo coordinar temas de logística o despachos?');
        checkFlag('tarea_contabilidad', 'Funciones contables', '¿Me asignarán funciones contables o caja chica?');
        checkFlag('tarea_conduccion', 'Conducir vehículos', '¿Es requisito conducir vehículos y asumir la responsabilidad civil?');
        checkFlag('tarea_supervision_op', 'Supervisión operación', '¿Seré responsable de supervisar la producción?');
    }

    const sueldoJusto = mBase * mRegion * mRubro * mExp * mContrato * mModalidad * mTurno * mRiesgoDuracion;
    const diferencia = sueldoOfrecido - sueldoJusto;
    const fmt = n => Math.round(n).toLocaleString('es-CL');

    const resDiv = document.getElementById('resultado_analisis');
    resDiv.style.display = 'block';
    resDiv.style.marginTop = '25px';
    resDiv.style.padding = '20px';
    resDiv.style.borderRadius = '8px';

    let html = `<h4 style="margin-top:0; color:#2c3e50;">📊 Análisis de la Oferta</h4>`;

    if (diferencia >= -50000) {
        resDiv.style.backgroundColor = '#d4edda';
        resDiv.style.borderLeft = '6px solid #28a745';
        html += `<p>✅ <strong>Valor Competitivo:</strong> El monto ofrecido ($${fmt(sueldoOfrecido)}) está al nivel o superior del mercado para este rol y duración.</p>`;
    } else {
        resDiv.style.backgroundColor = '#fff3cd';
        resDiv.style.borderLeft = '6px solid #ffc107';
        html += `<p>⚠️ <strong>Valor bajo el mercado:</strong> El valor estimado es <strong>$${fmt(sueldoJusto)}</strong> líquidos.<br>
                 <small>La oferta ($${fmt(sueldoOfrecido)}) está <strong>$${fmt(Math.abs(diferencia))}</strong> por debajo de lo recomendado.</small></p>`;
    }

    html += `<hr style="border:none;border-top:1px solid #ccc;margin:12px 0">`;
    html += `<p style="font-size:0.85rem;color:#555;margin:0 0 6px"><strong>📌 Filtros y Parámetros Seleccionados:</strong></p>`;
    html += `<ul style="font-size:0.8rem; color:#333; margin:0 0 15px 0; padding-left:20px; column-count: 2; column-gap: 15px;">`;
    html += `<li><strong>Formación:</strong> ${getSelectedText('formacion')}</li>`;
    html += `<li><strong>Región:</strong> ${getSelectedText('region')}</li>`;
    if (avanzadosActivos) {
        html += `<li><strong>Sector:</strong> ${getSelectedText('rubro')}</li>`;
        html += `<li><strong>Experiencia:</strong> ${getSelectedText('experiencia')}</li>`;
        html += `<li><strong>Contrato:</strong> ${getSelectedText('tipo_contrato')}</li>`;
        html += `<li><strong>Modalidad:</strong> ${getSelectedText('modalidad')}</li>`;
        html += `<li><strong>Turno:</strong> ${getSelectedText('turno')}</li>`;
        html += `<li><strong>Duración Estimada:</strong> ${textoFiltroDuracion}</li>`;
    }
    html += `</ul>`;

    html += `<hr style="border:none;border-top:1px solid #ccc;margin:12px 0">`;
    html += `<table style="width:100%;font-size:0.80rem;border-collapse:collapse; margin-bottom: 10px;">`;
    html += `<tr><td style="padding:8px 6px;font-weight:bold">${etiquetaDuracion}</td>
                 <td style="padding:8px 6px;text-align:right;font-weight:bold;color:#d35400;font-size:1.1rem">$${fmt(sueldoJusto)}</td></tr>`;
    html += `</table>`;

    if (redFlags.length > 0) {
        resDiv.style.backgroundColor = '#f8d7da';
        resDiv.style.borderLeft = '6px solid #dc3545';
        html += `<hr style="border:none;border-top:1px solid #f5c6cb;margin:12px 0">`;
        html += `<p style="color:#721c24;margin:0;font-size:0.9rem;">🚩 <strong>Alerta de Multifuncionalidad (DS N°44):</strong></p>`;
        html += `<ul style="color:#721c24;font-size:0.8rem;margin:6px 0 0 0;padding-left:20px">`;
        redFlags.forEach(f => { html += `<li>${f}</li>`; });
        html += `</ul>`;
    }

    if (avanzadosActivos && redFlagsNoSeleccionadas.length > 0) {
        html += `<hr style="border:none;border-top:1px solid #ccc;margin:14px 0">`;
        html += `<p style="font-size:0.85rem;font-weight:bold;color:#2c3e50;margin:0 0 4px">💬 Preguntas sugeridas para la entrevista</p>`;
        html += `<div style="background:#f0f4f8;border-left:3px solid #2980b9;border-radius:5px;padding:8px 10px;margin-bottom:7px">
                    <p style="margin:0;font-size:0.85rem;font-weight:bold;color:#1a5276">🛡️ Aclarar límites del cargo preventivo</p>
                    <ul style="margin:6px 0 0;padding-left:18px;font-size:0.78rem;color:#444">`;
        redFlagsNoSeleccionadas.forEach(f => { html += `<li>${f}</li>`; });
        html += `</ul></div>`;
    }

    html += `<div style="margin-top: 20px;">
                <button type="button" class="btn-pdf" onclick="descargarPDF()" style="background: #e74c3c; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: bold; width: 100%; transition: background 0.3s;">
                    📄 Descargar Reporte en PDF
                </button>
             </div>`;

    resDiv.innerHTML = html;
}

// ============================================================
// EXPORTADOR A PDF (FECHA, HORA, SIN SCROLL BUG, FONDO BLANCO)
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
        filename:     'Reporte_RadarAPR.pdf',
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