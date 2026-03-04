/* ============================================================
   CONSTANTES GLOBALES
   ============================================================
   Definiciones de constantes para facilitar cambios globales
   y preparar para futuras expansiones
   
   Futuras extensiones:
   - API endpoints
   - Configuración de módulos
   - Límites y validaciones
   ============================================================ */

/**
 * CONFIGURACIÓN GENERAL
 */
export const CONFIG = {
    APP_NAME: 'Análisis Estadístico Interactivo',
    APP_VERSION: '2.0',
    LANGUAGE: 'es',
    THEME: 'dark',
    DEBUG: true
};

/**
 * LIMITES Y VALIDACIONES
 */
export const LIMITS = {
    MAX_DATA_POINTS: 10000,
    MIN_DATA_POINTS: 1,
    MAX_RANDOM_VALUE: 100,
    MIN_RANDOM_VALUE: 1,
    MAX_RANDOM_COUNT: 200,
    MIN_RANDOM_COUNT: 5,
    MAX_SET_SIZE: 100,
    MIN_PROBABILITY: 0,
    MAX_PROBABILITY: 1
};

/**
 * MENSAJES Y NOTIFICACIONES
 */
export const MESSAGES = {
    CONFIRM_CLEAR_ALL: '¿Estás seguro de que quieres limpiar ABSOLUTAMENTE TODOS los datos de todas las secciones?',
    ERROR_INVALID_DATA: 'Por favor, introduce datos válidos o genera datos aleatorios.',
    ERROR_INVALID_SETS: 'Por favor, introduce valores válidos en los conjuntos.',
    ERROR_INVALID_PROBABILITY: 'Los valores de probabilidad deben estar entre 0 y 1.',
    SUCCESS_DATA_CALCULATED: 'Datos calculados exitosamente.',
    SUCCESS_SET_OPERATION: 'Operación de conjunto completada.',
    SUCCESS_PROBABILITY_CALCULATED: 'Probabilidad calculada exitosamente.',
    EASTER_EGG: '¿Buscas algo aquí abajo? 🙃\n¡Me atrapaste explorando al revés!',
    WELCOME: 'Bienvenido a la aplicación de Análisis Estadístico Interactivo.'
};

/**
 * TIPOS DE DATOS
 */
export const DATA_TYPES = {
    NUMERIC: 'numeric',
    SET: 'set',
    PROBABILITY: 'probability'
};

/**
 * OPERACIONES CON CONJUNTOS
 */
export const SET_OPERATIONS = {
    UNION: 'union',
    INTERSECTION: 'intersection',
    DIFFERENCE: 'difference',
    COMPLEMENT: 'complement',
    SYMMETRIC_DIFFERENCE: 'symmetric_difference'
};

/**
 * TIPOS DE GRÁFICOS
 */
export const CHART_TYPES = {
    HISTOGRAM: 'histogram',
    FREQUENCY_POLYGON: 'frequency_polygon',
    OGIVE: 'ogive',
    PARETO: 'pareto',
    TREE_DIAGRAM: 'tree_diagram'
};

/**
 * COLORES PERSONALIZADOS (Referencias a variables CSS)
 */
export const COLORS = {
    PRIMARY: '#8A2BE2',
    PRIMARY_LIGHT: '#a855a8',
    PRIMARY_DARK: '#6a1b9a',
    SECONDARY: '#85c1e9',
    SECONDARY_FADE: 'rgba(133, 193, 233, 0.6)',
    BG_DARK: '#1a1a2e',
    BG_CARD: '#2c2c47',
    TEXT_PRIMARY: '#e0e0e0',
    TEXT_SECONDARY: '#bbb',
    BORDER: '#5a5a7c',
    SUCCESS: '#2ecc71',
    WARNING: '#f39c12',
    DANGER: '#e74c3c'
};

/**
 * CONFIGURACIÓN DE GRÁFICOS
 */
export const CHART_CONFIG = {
    DEFAULT_BINS: 10,
    ANIMATION_DURATION: 600,
    RESPONSIVE: true,
    MAINTAIN_ASPECT_RATIO: false,
    RESPONSIVE_OPTIONS: {
        maintainAspectRatio: false,
        responsive: true
    }
};

/**
 * CONFIGURACIÓN DE ALMACENAMIENTO LOCAL
 */
export const STORAGE_KEYS = {
    DATASETS: 'app_datasets',
    SETS: 'app_sets',
    PREFERENCES: 'app_preferences',
    THEME: 'app_theme',
    LANGUAGE: 'app_language'
};

/**
 * EVENTOS PERSONALIZADOS
 */
export const CUSTOM_EVENTS = {
    DATA_CALCULATED: 'data_calculated',
    DATA_CLEARED: 'data_cleared',
    SET_OPERATION_COMPLETE: 'set_operation_complete',
    PROBABILITY_CALCULATED: 'probability_calculated',
    THEME_CHANGED: 'theme_changed',
    LOCALE_CHANGED: 'locale_changed'
};

/**
 * ENDPOINTS FUTUROS (para integración con backend)
 */
export const API_ENDPOINTS = {
    BASE_URL: 'https://api.example.com',
    DATA: {
        UPLOAD: '/api/data/upload',
        DOWNLOAD: '/api/data/download',
        DELETE: '/api/data/delete'
    },
    STATISTICS: {
        CALCULATE: '/api/statistics/calculate',
        ANALYZE: '/api/statistics/analyze'
    },
    USER: {
        LOGIN: '/api/user/login',
        LOGOUT: '/api/user/logout',
        PROFILE: '/api/user/profile'
    }
};

/**
 * CONFIGURACIÓN DE MÓDULOS
 */
export const MODULES = {
    DATA_INPUT: { enabled: true, name: 'Data Input' },
    STATISTICS: { enabled: true, name: 'Statistics' },
    SETS_OPERATIONS: { enabled: true, name: 'Sets Operations' },
    PROBABILITY: { enabled: true, name: 'Probability' },
    PERMUTATIONS: { enabled: true, name: 'Permutations & Combinations' },
    TREE_DIAGRAM: { enabled: true, name: 'Tree Diagram' }
};

/**
 * INICIALIZACIÓN
 */
export function initializeConstants() {
    if (CONFIG.DEBUG) {
        console.log(`[${CONFIG.APP_NAME}] v${CONFIG.APP_VERSION} - Constantes inicializadas`);
    }
}

export default {
    CONFIG,
    LIMITS,
    MESSAGES,
    DATA_TYPES,
    SET_OPERATIONS,
    CHART_TYPES,
    COLORS,
    CHART_CONFIG,
    STORAGE_KEYS,
    CUSTOM_EVENTS,
    API_ENDPOINTS,
    MODULES,
    initializeConstants
};
