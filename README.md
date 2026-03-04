# 📊 Página Interactiva - Análisis Estadístico

Una aplicación web interactiva y llamativa para explorar conceptos de **probabilidad y estadística** con visualizaciones gráficas en tiempo real.

## ✨ Características

- **Análisis de Datos**: Calcula estadísticas descriptivas (media, mediana, moda, rango)
- **Visualizaciones**: Histogramas, polígonos de frecuencia, ojivas y diagramas de Pareto
- **Operaciones con Conjuntos**: Union, intersección, diferencia, complemento
- **Probabilidad Simple**: Calcula probabilidades básicas
- **Probabilidad Secuencial**: Análisis de eventos secuenciales
- **Permutaciones y Combinaciones**: Cálculos combinatorios
- **Diagrama de Árbol**: Visualización de probabilidades condicionales
- **Interfaz Interactiva**: Sidebars retráctiles, mascota interactiva, efecto Dinnerbone 🙃

## 🚀 Inicio Rápido

### Abrir la Aplicación
1. Abre `index.html` en tu navegador
2. O usa un servidor local:
   ```bash
   python -m http.server 8000
   # Luego abre http://localhost:8000
   ```

### Acceder a Características Secretas
- **Dinnerbone**: Haz clic en "🙃 Dinnerbone" en la barra izquierda para invertir toda la página
- **Botón Secreto**: Cuando actives Dinnerbone, aparecerá un "?" en la parte inferior izquierda

## 📁 Estructura del Proyecto

```
randomizado/
├── index.html              # Página principal
├── DOCUMENTATION.md        # Documentación detallada
├── README.md              # Este archivo
├── assets/
│   └── images/
│       └── Fn31.webp      # Mascota interactiva (Puppet)
├── css/                   # Estilos modularizados
│   ├── variables.css      # Variables y temas
│   ├── layout.css         # Estructura y posicionamiento
│   ├── components.css     # Componentes reutilizables
│   └── utilities.css      # Clases auxiliares
└── js/                    # JavaScript modular
    ├── main.js            # Orquestador principal
    ├── ui-manager.js      # Gestor de interfaz
    ├── data.js            # Gestión de datos
    ├── statistics.js      # Cálculos estadísticos
    ├── charts.js          # Generación de gráficos
    └── config.js          # Constantes globales
```

## 🎯 Cómo Usar

### 1. Entrada de Datos
- **Manualmente**: Introduce números separados por comas en el área de texto
- **Aleatorio**: Haz clic en "Generar Datos Aleatorios" o usa el slider de la barra izquierda
- **Calcular**: Presiona "Calcular" para procesar los datos

### 2. Operaciones con Conjuntos
- Define los conjuntos A, B y C
- Usa los botones para realizar operaciones (∪, ∩, -, ')
- Los resultados aparecen en una tabla

### 3. Cálculos de Probabilidad
- **Simple**: Proporciona valor afectado y total
- **Secuencial**: Ingresa múltiples probabilidades
- **Diagrama de Árbol**: Configura las probabilidades condicionales

### 4. Funciones Globales
Barra izquierda:
- 🗑️ **Limpiar Todo**: Borra todos los datos
- 🎲 **Aleatorio Total**: Genera datos aleatorios en todas las secciones
- 🙃 **Dinnerbone**: Invierte la página
- **Slider**: Controla la cantidad de datos aleatorios

## 🎨 Personalización

### Cambiar Colores
Edita las variables en `css/variables.css`:
```css
:root {
    --color-primary: #8A2BE2;      /* Cambiar color principal */
    --color-bg-dark: #1a1a2e;      /* Cambiar fondo */
}
```

### Agregar Nuevas Secciones
1. Crea un nuevo módulo en `js/modules/`
2. Importa en `main.js`
3. Agrega HTML en `index.html`

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modularizados con variables
- **JavaScript (ES6+)**: Módulos, clases, funciones flecha
- **Chart.js**: Visualización de gráficos

## 📊 Dependencias Externas

- **Chart.js CDN**: Para gráficos interactivos

## 🚀 Futuras Expansiones

- [ ] Temas dinámicos (claro/oscuro)
- [ ] Sistema de notificaciones
- [ ] Almacenamiento en localStorage
- [ ] Exportar datos a CSV/PDF
- [ ] Modo offline
- [ ] Autenticación de usuarios
- [ ] Colaboración en tiempo real
- [ ] API REST backend

## ⌨️ Accesibilidad

- ✅ Navegación por teclado completa
- ✅ Atributos ARIA
- ✅ Roles semánticos
- ✅ Contraste suficiente
- ✅ Soporte para reducir movimiento

## 📱 Responsivo

Funciona perfectamente en:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 🖥️ Desktop (1024px+)

## 🐛 Solución de Problemas

### Los botones no funcionan
→ Recarga la página (Ctrl+R)

### Los estilos no se ven bien
→ Revisa que todos los archivos CSS están siendo cargados (F12 → Network)

### Errores en la consola
→ Abre la consola del navegador (F12) para más detalles

## 📝 Notas de Desarrollo

- Código bien documentado y modularizado
- Listo para agregar nuevas funcionalidades
- Sistema de constantes centralizado
- UIManager para gestión centralizada de interfaz

## 📄 Licencia

Este proyecto es de uso educativo.

## 👨‍💻 Autor

Desarrollado como proyecto educativo de análisis estadístico interactivo.

---

**Última actualización**: 23 de Febrero, 2026  
**Versión**: 2.0 (Reestructurado)

Para más detalles técnicos, consulta [DOCUMENTATION.md](DOCUMENTATION.md)
