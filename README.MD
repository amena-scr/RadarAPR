# RadarAPR 📡 

**Versión:** 1.0.0  
**Entorno de Desarrollo:** Antigravity (VSCode OSS)  
**Estado:** Prototipo Funcional / Beta  

## 📌 Descripción del Proyecto
**RadarAPR** es una herramienta técnica diseñada para expertos en prevención de riesgos en Chile. Su objetivo es proporcionar transparencia en el mercado laboral, permitiendo a los profesionales evaluar ofertas de trabajo, detectar funciones fuera de la normativa legal (**Decreto Supremo N° 40**) y calcular sueldos competitivos basados en datos del **INE 2026**.

## 🛠️ Especificaciones Técnicas
- **Frontend:** HTML5 / CSS3 (Diseño Responsive).
- **Lógica:** JavaScript ES6 (Vanilla JS).
- **Almacenamiento:** LocalStorage (Persistencia de datos del historial en el navegador).
- **Runtime Sugerido:** Node.js 22.21.1 para futuras integraciones de scraping.

## 📂 Estructura de Archivos
- `index.html`: Estructura principal y formulario de entrada de datos.
- `styles.css`: Definiciones de diseño, variables de color y adaptabilidad móvil.
- `app.js`: Cerebro de la aplicación, motor de cálculo salarial y lógica de validación legal.

## 🚀 Funcionalidades Principales
1. **Calculadora Salarial Inteligente:** Utiliza algoritmos de multiplicación cruzada (Sueldo Base x Región x Rubro x Experiencia).
2. **Escáner de Banderas Rojas (Red Flags):** Identifica tareas administrativas o logísticas que no corresponden al cargo de APR según la Ley 16.744.
3. **Historial de Consultas:** Guarda localmente las evaluaciones realizadas para permitir el análisis de tendencias personales.

## ⚖️ Base Normativa Aplicada
- **Ley 16.744:** Seguro Social Obligatorio contra Accidentes del Trabajo y Enfermedades Profesionales.
- **Decreto Supremo N° 40:** Aprueba reglamento sobre prevención de riesgos profesionales.
- **Decreto Supremo N° 594:** Condiciones sanitarias y ambientales básicas en los lugares de trabajo.

---
**Desarrollado en Antigravity para la comunidad de Prevención de Riesgos.**