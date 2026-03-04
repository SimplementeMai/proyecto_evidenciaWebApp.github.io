// Archivo principal para la lógica de la interfaz de usuario
import { generateRandomData, parseManualData, getCurrentDataset } from './Calculo/Datos/js/data.js';
import { 
    calculateMean, calculateMedian, calculateMode, calculateMin, calculateMax, calculateRange, calculateFrequencyTable,
    parseSetInput, union, intersection, difference, complement, calculateSimpleProbability, calculateSequentialIndependentProbability,
    calculatePermutations, calculateCombinations // Importar permutaciones y combinaciones
} from './Calculo/Resultados/js/statistics.js';
import { createHistogram, createFrequencyPolygon, createOgive, createParetoChart } from './Calculo/Resultados/js/charts.js';
import UIManager from './Barrarita_LI/js/ui-manager.js';
import BackgroundManager from './Barrarita_LI/Ambiente/js/background-manager.js';
import DinnerboneManager from './Proyectos grandes/Dinnerbone y secretos n.n/js/dinnerbone-manager.js';
import PuppetGameManager from './Proyectos grandes/Dinnerbone y secretos n.n/js/puppet-game.js';
import PuppetDialogueManager from './Proyectos grandes/Dinnerbone y secretos n.n/js/puppet-dialogue.js';
import ThemeManager from './Barrarita_LI/js/theme-manager.js';
import AudioManager from './Barrarita_LI/js/audio-manager.js';
import GuideManager from './Barrarita_Su/js/guide-manager.js';
import RandomHubManager from './Proyectos grandes/random/js/random-hub.js';
import AchievementManager from './Barrarita_LI/js/achievement-manager.js';

/* ============================================================
   ARCHIVO PRINCIPAL - ORGANIZACION
   ============================================================
   
   ESTRUCTURA MODULAR PARA FUTURAS EXPANSIONES:
   
   1. UI MANAGER (ui-manager.js)
      - Sincronización de elementos UI
      - Manejo de temas
      - Notificaciones
   
   2. DATA MANAGER (data.js)
      - Gestión de datos del usuario
      - Almacenamiento local (localStorage)
      - Exportación de datos
   
   3. STATISTICS ENGINE (statistics.js)
      - Cálculos matemáticos
      - Operaciones con conjuntos
      - Probabilidades
   
   4. CHARTS RENDERER (charts.js)
      - Generación de gráficos
      - Actualización de gráficos
      - Estilos de gráficos
   
   5. MODULES (futuro)
      - Module Pattern para cada sección
      - State Management centralizado
      - Sistema de plugins
   
   PATRONES DE DISEÑO:
   - Observer Pattern: UIManager observa cambios
   - Module Pattern: Cada módulo es independiente
   - Singleton: UIManager es instancia única
   - Event-Driven: Basado en eventos del DOM
   
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    
    // ========== INICIALIZAR MANAGERS =========
    const achievementManager = new AchievementManager(); // Sin UI manager por ahora
    const audioManager = new AudioManager(achievementManager); 
    const uiManager = new UIManager(audioManager);
    
    // Vincular UI Manager con Achievement Manager ahora que existe
    achievementManager.uiManager = uiManager;

    const themeManager = new ThemeManager(uiManager, achievementManager);
    const bgManager = new BackgroundManager(themeManager, achievementManager);
    const dinnerboneManager = new DinnerboneManager(themeManager, audioManager, achievementManager);
    const puppetGameManager = new PuppetGameManager(uiManager, audioManager, achievementManager);
    const puppetDialogueManager = new PuppetDialogueManager(uiManager, achievementManager);
    const randomHubManager = new RandomHubManager(uiManager, audioManager, achievementManager);
    
    // Vincular juego con diálogos
    puppetGameManager.setDialogueManager(puppetDialogueManager);

    const guideManager = new GuideManager(uiManager, achievementManager);

    // Vincular cambio de tema con actualización de color de fuente y fondo
    themeManager.onThemeChange = (theme) => {
        bgManager.updateFontColor(bgManager.fontSlider.value);
        bgManager.applyBackground(bgManager.bgSelector.value); // Actualizar tinte de fondo
        achievementManager.unlock('change_theme');
    };

    // ========== LOGICA SPLASH SCREEN ==========
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // Reproducir audio de bienvenida gestionado
        const welcomeAudio = new Audio('audio/welcome.mp3');
        audioManager.registerAudio(welcomeAudio, 0.4);
        
        // Intentar reproducir (con manejo de autoplay en AudioManager)
        audioManager.playManagedAudio(welcomeAudio);

        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            // Eliminar del DOM después de la transición para ahorrar recursos
            setTimeout(() => {
                splashScreen.remove();
            }, 1000);
        }, 2000);
    }
    
    const masterResetBtn = document.getElementById('master-reset-btn');

    if (masterResetBtn) {
        masterResetBtn.addEventListener('click', () => {
            // Primera Advertencia
            if (confirm('⚠️ ADVERTENCIA 1: Estás a punto de ejecutar un Reinicio Maestro. Esto borrará todos tus récords, temas desbloqueados y configuraciones. ¿Deseas continuar?')) {
                // Segunda Advertencia
                if (confirm('🚫 ADVERTENCIA FINAL: Esta acción es irreversible. Todos los datos del sistema se perderán. ¿Estás ABSOLUTAMENTE seguro?')) {
                    achievementManager.unlock('master_reset');
                    localStorage.clear();
                    uiManager.showNotification('SISTEMA REINICIADO. Recargando...', 'error', true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        });
    }

    const manualDataTextarea = document.getElementById('manual-data');
    const generateRandomBtn = document.getElementById('generate-random-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const statisticsResultsDiv = document.getElementById('statistics-results');
    const frequencyTableResultsDiv = document.getElementById('frequency-table-results');
    const chartsContainerDiv = document.getElementById('charts-container');

    // Elementos de la UI para operaciones con conjuntos
    const universalSetInput = document.getElementById('universal-set-input');
    const setAInput = document.getElementById('setA-input');
    const setBInput = document.getElementById('setB-input');
    const setCInput = document.getElementById('setC-input'); // Nuevo input para el Conjunto C

    const unionBtn = document.getElementById('union-btn');
    const intersectionBtn = document.getElementById('intersection-btn');
    const differenceABBtn = document.getElementById('difference-ab-btn');
    const differenceBABtn = document.getElementById('difference-ba-btn'); 
    const complementABtn = document.getElementById('complement-a-btn');
    const complementBBtn = document.getElementById('complement-b-btn');

    // Nuevos botones para operaciones con C
    const unionACBtn = document.getElementById('union-ac-btn');
    const intersectionACBtn = document.getElementById('intersection-ac-btn');
    const differenceACBtn = document.getElementById('difference-ac-btn');
    const differenceCABtn = document.getElementById('difference-ca-btn');
    const unionBCBtn = document.getElementById('union-bc-btn');
    const intersectionBCBtn = document.getElementById('intersection-bc-btn');
    const differenceBCBtn = document.getElementById('difference-bc-btn');
    const differenceCBBtn = document.getElementById('difference-cb-btn');
    const complementCBtn = document.getElementById('complement-c-btn');

    // Nuevos botones para operaciones ternarias
    const unionABCBtn = document.getElementById('union-abc-btn');
    const intersectionABCBtn = document.getElementById('intersection-abc-btn');

    const calculateAllSetsBtn = document.getElementById('calculate-all-sets-btn');
    const clearSetOperationsBtn = document.getElementById('clear-set-operations-btn'); // Botón Limpiar Todo
    const setOperationsResultsDiv = document.getElementById('set-operations-results');

    // Elementos de la UI para probabilidad simple
    const affectedValueInput = document.getElementById('affected-value-input');
    const totalValueInput = document.getElementById('total-value-input');
    const calculateProbabilityBtn = document.getElementById('calculate-probability-btn');
    const probabilityResultsDiv = document.getElementById('probability-results');

    // Elementos de la UI para probabilidad secuencial
    const independentProbabilitiesInput = document.getElementById('independent-probabilities-input');
    const calculateSequentialProbBtn = document.getElementById('calculate-sequential-prob-btn');
    const sequentialProbabilityResultsDiv = document.getElementById('sequential-probability-results');

    // Elementos de la UI para diagrama de árbol
    const probAInput = document.getElementById('prob-a-input');
    const probBGivAInput = document.getElementById('prob-b-given-a-input');
    const probBGivNotAInput = document.getElementById('prob-b-given-not-a-input');
    const generateTreeDiagramBtn = document.getElementById('generate-tree-diagram-btn');
    const treeDiagramContainer = document.getElementById('tree-diagram-container');

    // Elementos de la UI para permutaciones y combinaciones
    const nInput = document.getElementById('n-input');
    const rInput = document.getElementById('r-input');
    const calculatePermutationsBtn = document.getElementById('calculate-permutations-btn');
    const calculateCombinationsBtn = document.getElementById('calculate-combinations-btn');
    const permutationsCombinationsResultsDiv = document.getElementById('permutations-combinations-results');

    // Global action buttons from right sidebar
    const globalClearBtn = document.getElementById('global-clear-btn');
    const globalRandomBtn = document.getElementById('global-random-btn');
    const dinnerboneBtn = document.getElementById('dinnerbone-btn');
    const secretTriggerBtn = document.getElementById('secret-trigger-btn');
    const secretTriggerInModalBtn = document.getElementById('secret-trigger-in-modal');
    const startExploringBtn = document.getElementById('start-exploring-btn');

    // Nota: DinnerboneBtn es manejado exclusivamente por DinnerboneManager para evitar duplicados

    if (secretTriggerBtn) {
        secretTriggerBtn.addEventListener('click', () => {
            uiManager.showNotification('¿Buscas algo aquí abajo? 🙃 ¡Me atrapaste explorando al revés!', 'info');
        });
    }

    if (secretTriggerInModalBtn) {
        secretTriggerInModalBtn.addEventListener('click', () => {
            uiManager.showNotification('¿Encontraste mi verdadera forma? 🙃 ¡Aquí me ves tal como soy... DE CABEZA!', 'success');
            // Cerrar el modal automáticamente después del mensaje
            setTimeout(() => {
                dinnerboneManager.hideModal();
            }, 1000);
        });
    }

    // "Comenzar a Explorar" button scrolls to data input section
    if (startExploringBtn) {
        startExploringBtn.addEventListener('click', () => {
            const dataInputSection = document.getElementById('data-input');
            if (dataInputSection) {
                dataInputSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                // Focus on the textarea for immediate input
                setTimeout(() => {
                    document.getElementById('manual-data')?.focus();
                }, 500);
            }
        });
    }

    // Slider for random count
    const randomCountSlider = document.getElementById('random-count-slider');
    const sliderValueDisplay = document.getElementById('slider-value');

    if (randomCountSlider && sliderValueDisplay) {
        randomCountSlider.addEventListener('input', () => {
            sliderValueDisplay.textContent = randomCountSlider.value;
        });
    }

    // Global chart instances
    let histogramChartInstance = null;
    let frequencyPolygonChartInstance = null;
    let ogiveChartInstance = null;
    let paretoChartInstance = null;

    if (globalClearBtn) {
        globalClearBtn.addEventListener('click', () => {
            if (!confirm('¿Estás seguro de que quieres limpiar ABSOLUTAMENTE TODOS los datos de todas las secciones?')) {
                return;
            }
            uiManager.playSound('clear', true); // Sonido de limpieza GLOBAL
            // Clear main data
            if (manualDataTextarea) manualDataTextarea.value = '';
            if (statisticsResultsDiv) statisticsResultsDiv.innerHTML = '';
            if (frequencyTableResultsDiv) frequencyTableResultsDiv.innerHTML = '';
            
            // Clear sets
            if (setAInput) setAInput.value = '';
            if (setBInput) setBInput.value = '';
            if (setCInput) setCInput.value = '';
            if (universalSetInput) universalSetInput.value = '';
            if (setOperationsResultsDiv) setOperationsResultsDiv.innerHTML = '';
            
            // Clear probability
            if (affectedValueInput) affectedValueInput.value = '';
            if (totalValueInput) totalValueInput.value = '';
            if (probabilityResultsDiv) probabilityResultsDiv.innerHTML = '';
            
            // Clear sequential probability
            if (independentProbabilitiesInput) independentProbabilitiesInput.value = '';
            if (sequentialProbabilityResultsDiv) sequentialProbabilityResultsDiv.innerHTML = '';
            
            // Clear perm/comb
            if (nInput) nInput.value = '';
            if (rInput) rInput.value = '';
            if (permutationsCombinationsResultsDiv) permutationsCombinationsResultsDiv.innerHTML = '';
            
            // Clear tree diagram
            if (probAInput) probAInput.value = '0.5';
            if (probBGivAInput) probBGivAInput.value = '0.7';
            if (probBGivNotAInput) probBGivNotAInput.value = '0.3';
            if (treeDiagramContainer) treeDiagramContainer.innerHTML = '';
            
            // Destroy charts and clear their container
            if (histogramChartInstance) histogramChartInstance.destroy(); histogramChartInstance = null;
            if (frequencyPolygonChartInstance) frequencyPolygonChartInstance.destroy(); frequencyPolygonChartInstance = null;
            if (ogiveChartInstance) ogiveChartInstance.destroy(); ogiveChartInstance = null;
            if (paretoChartInstance) paretoChartInstance.destroy(); paretoChartInstance = null;
            
            if (chartsContainerDiv) {
                chartsContainerDiv.innerHTML = `
                    <h3>Gráficos:</h3>
                    <div class="chart-wrapper"><canvas id="histogramChart"></canvas></div>
                    <div class="chart-wrapper"><canvas id="frequencyPolygonChart"></canvas></div>
                    <div class="chart-wrapper"><canvas id="ogiveChart"></canvas></div>
                    <div class="chart-wrapper"><canvas id="paretoChart"></canvas></div>
                `;
            }

            uiManager.showNotification('¡Se ha limpiado absolutamente todo!', 'info', true);
        });
    }

    if (globalRandomBtn) {
        globalRandomBtn.addEventListener('click', () => {
            achievementManager.unlock('use_random');
            uiManager.playSound('random', true); // Sonido de aleatorio GLOBAL
            const count = randomCountSlider ? parseInt(randomCountSlider.value) : 20;
            // Random main data using slider value
            const randomData = generateRandomData(count);
            if (manualDataTextarea) manualDataTextarea.value = randomData.join(', ');
            if (calculateBtn) calculateBtn.click(); 
            
            // Random sets function
            const generateRandomSet = (size, max) => {
                const set = new Set();
                while(set.size < size) set.add(Math.floor(Math.random() * max) + 1);
                return Array.from(set).sort((a,b) => a-b).join(', ');
            };
            // Sets size also scaled a bit with data
            const setSize = Math.min(15, Math.max(3, Math.floor(count / 4)));
            if (setAInput) setAInput.value = generateRandomSet(setSize, count * 2);
            if (setBInput) setBInput.value = generateRandomSet(setSize, count * 2);
            if (setCInput) setCInput.value = generateRandomSet(setSize, count * 2);
            updateUniversalSet();
            if (calculateAllSetsBtn) calculateAllSetsBtn.click(); 
            
            // Random simple probability
            const total = Math.floor(Math.random() * 100) + 10;
            const affected = Math.floor(Math.random() * total);
            if (affectedValueInput) affectedValueInput.value = affected;
            if (totalValueInput) totalValueInput.value = total;
            if (calculateProbabilityBtn) calculateProbabilityBtn.click();
            
            // Random sequential probability
            const seqProbCount = Math.floor(Math.random() * 3) + 2;
            const seqProbs = [];
            for(let i=0; i<seqProbCount; i++) seqProbs.push(Math.floor(Math.random() * 100));
            if (independentProbabilitiesInput) independentProbabilitiesInput.value = seqProbs.join(', ');
            if (calculateSequentialProbBtn) calculateSequentialProbBtn.click();
            
            // Random perm/comb
            const n = Math.floor(Math.random() * 10) + 5;
            const r = Math.floor(Math.random() * n) + 1;
            if (nInput) nInput.value = n;
            if (rInput) rInput.value = r;
            if (calculatePermutationsBtn) calculatePermutationsBtn.click();
            if (calculateCombinationsBtn) calculateCombinationsBtn.click();
            
            // Random tree diagram
            if (probAInput) probAInput.value = (Math.random()).toFixed(2);
            if (probBGivAInput) probBGivAInput.value = (Math.random()).toFixed(2);
            if (probBGivNotAInput) probBGivNotAInput.value = (Math.random()).toFixed(2);
            if (generateTreeDiagramBtn) generateTreeDiagramBtn.click();

            uiManager.showNotification('¡Datos aleatorios generados con éxito!', 'success', true);
        });
    }

    if (generateRandomBtn) {
        generateRandomBtn.addEventListener('click', () => {
            uiManager.playSound('random', false); // Sonido de aleatorio INDIVIDUAL
            const count = randomCountSlider ? parseInt(randomCountSlider.value) : 20;
            const randomData = generateRandomData(count);
            if (manualDataTextarea) manualDataTextarea.value = randomData.join(', ');
            displayDataInConsole(); // For debugging
            uiManager.showNotification('Datos de muestra generados.', 'success', false);
        });
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const dataString = manualDataTextarea ? manualDataTextarea.value.trim() : '';
            achievementManager.unlock('first_calc');
            
            // PROTOCOLO SECRETO: MINI-JUEGO
            if (dataString === 'PUPPET-101') {
                puppetGameManager.startGame();
                return;
            }

            const parsedData = parseManualData(dataString);
            if (parsedData.length > 0) {
                const currentData = getCurrentDataset();
                displayStatistics(currentData);
                displayFrequencyTable(currentData);
                displayCharts(currentData);
                uiManager.showNotification('Cálculos realizados con éxito.', 'success', false);
                console.log('Datos listos para calcular:', currentData);
            } else {
                uiManager.showNotification('Por favor, introduce datos válidos o genera datos aleatorios.', 'warning', false);
                if (statisticsResultsDiv) statisticsResultsDiv.innerHTML = ''; 
                if (frequencyTableResultsDiv) frequencyTableResultsDiv.innerHTML = ''; 
                
                if (histogramChartInstance) histogramChartInstance.destroy(); histogramChartInstance = null;
                if (frequencyPolygonChartInstance) frequencyPolygonChartInstance.destroy(); frequencyPolygonChartInstance = null;
                if (ogiveChartInstance) ogiveChartInstance.destroy(); ogiveChartInstance = null;
                if (paretoChartInstance) paretoChartInstance.destroy(); paretoChartInstance = null;

                if (chartsContainerDiv) {
                    chartsContainerDiv.innerHTML = `
                        <h3>Gráficos:</h3>
                        <div class="chart-wrapper"><canvas id="histogramChart"></canvas></div>
                        <div class="chart-wrapper"><canvas id="frequencyPolygonChart"></canvas></div>
                        <div class="chart-wrapper"><canvas id="ogiveChart"></canvas></div>
                        <div class="chart-wrapper"><canvas id="paretoChart"></canvas></div>
                    `;
                }
            }
        });
    }

    // Función para actualizar el conjunto universal automáticamente
    function updateUniversalSet() {
        if (!setAInput || !setBInput || !setCInput || !universalSetInput) return;
        const setA = parseSetInput(setAInput.value);
        const setB = parseSetInput(setBInput.value);
        const setC = parseSetInput(setCInput.value);

        // Calcular la unión de A, B y C
        const combined = union(union(setA, setB), setC);
        
        // Convert Set to Array, sort numerically, then join
        const sortedCombined = Array.from(combined).sort((a, b) => {
            if (typeof a === 'number' && typeof b === 'number') {
                return a - b;
            }
            return String(a).localeCompare(String(b));
        });
        universalSetInput.value = sortedCombined.join(', ');
    }

    // Event Listeners para actualizar el Conjunto Universal automáticamente
    if (setAInput) setAInput.addEventListener('input', updateUniversalSet);
    if (setBInput) setBInput.addEventListener('input', updateUniversalSet);
    if (setCInput) setCInput.addEventListener('input', updateUniversalSet);

    // Función para inicializar la tabla de resultados de conjuntos si no existe
    function ensureSetResultsTable() {
        if (!setOperationsResultsDiv) return null;
        if (!document.getElementById('set-results-table')) {
            setOperationsResultsDiv.innerHTML = `
                <h3>Resultados de Conjuntos:</h3>
                <table id="set-results-table" border="1" style="width:100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th>Operación</th>
                            <th>Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            `;
        }
        const table = document.getElementById('set-results-table');
        return table ? table.getElementsByTagName('tbody')[0] : null;
    }

    // Event Listeners para Operaciones con Conjuntos
    if (unionBtn) {
        unionBtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setB = parseSetInput(setBInput.value);
            const result = union(setA, setB);
            displaySetOperationResult('Unión (A ∪ B)', 'set-result-union', result);
            uiManager.showNotification('Unión (A ∪ B) calculada.', 'success', false);
        });
    }

    if (intersectionBtn) {
        intersectionBtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setB = parseSetInput(setBInput.value);
            const result = intersection(setA, setB);
            displaySetOperationResult('Intersección (A ∩ B)', 'set-result-intersection', result);
            uiManager.showNotification('Intersección (A ∩ B) calculada.', 'success', false);
        });
    }

    if (differenceABBtn) {
        differenceABBtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setB = parseSetInput(setBInput.value);
            const result = difference(setA, setB);
            displaySetOperationResult('Diferencia (A - B)', 'set-result-difference-ab', result);
            uiManager.showNotification('Diferencia (A - B) calculada.', 'success', false);
        });
    }

    if (differenceBABtn) {
        differenceBABtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setB = parseSetInput(setBInput.value);
            const result = difference(setB, setA);
            displaySetOperationResult('Diferencia (B - A)', 'set-result-difference-ba', result);
            uiManager.showNotification('Diferencia (B - A) calculada.', 'success', false);
        });
    }

    if (complementABtn) {
        complementABtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const universalSet = parseSetInput(universalSetInput.value);
            if (universalSet.size === 0) {
                uiManager.showNotification('Por favor, introduce un Conjunto Universal para calcular el complemento.', 'warning');
                return;
            }
            const result = complement(setA, universalSet);
            displaySetOperationResult('Complemento de A (A\')', 'set-result-complement-a', result);
            uiManager.showNotification('Complemento de A calculado.', 'success', false);
        });
    }

    if (complementBBtn) {
        complementBBtn.addEventListener('click', () => {
            const setB = parseSetInput(setBInput.value);
            const universalSet = parseSetInput(universalSetInput.value);
            if (universalSet.size === 0) {
                uiManager.showNotification('Por favor, introduce un Conjunto Universal para calcular el complemento.', 'warning');
                return;
            }
            const result = complement(setB, universalSet);
            displaySetOperationResult('Complemento de B (B\')', 'set-result-complement-b', result);
            uiManager.showNotification('Complemento de B calculado.', 'success', false);
        });
    }

    if (unionACBtn) {
        unionACBtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = union(setA, setC);
            displaySetOperationResult('Unión (A ∪ C)', 'set-result-union-ac', result);
            uiManager.showNotification('Unión (A ∪ C) calculada.', 'success', false);
        });
    }

    if (intersectionACBtn) {
        intersectionACBtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = intersection(setA, setC);
            displaySetOperationResult('Intersección (A ∩ C)', 'set-result-intersection-ac', result);
            uiManager.showNotification('Intersección (A ∩ C) calculada.', 'success', false);
        });
    }

    if (differenceACBtn) {
        differenceACBtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = difference(setA, setC);
            displaySetOperationResult('Diferencia (A - C)', 'set-result-difference-ac', result);
            uiManager.showNotification('Diferencia (A - C) calculada.', 'success', false);
        });
    }

    if (differenceCABtn) {
        differenceCABtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = difference(setC, setA);
            displaySetOperationResult('Diferencia (C - A)', 'set-result-difference-ca', result);
            uiManager.showNotification('Diferencia (C - A) calculada.', 'success', false);
        });
    }

    if (unionBCBtn) {
        unionBCBtn.addEventListener('click', () => {
            const setB = parseSetInput(setBInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = union(setB, setC);
            displaySetOperationResult('Unión (B ∪ C)', 'set-result-union-bc', result);
            uiManager.showNotification('Unión (B ∪ C) calculada.', 'success', false);
        });
    }

    if (intersectionBCBtn) {
        intersectionBCBtn.addEventListener('click', () => {
            const setB = parseSetInput(setBInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = intersection(setB, setC);
            displaySetOperationResult('Intersección (B ∩ C)', 'set-result-intersection-bc', result);
            uiManager.showNotification('Intersección (B ∩ C) calculada.', 'success', false);
        });
    }

    if (differenceBCBtn) {
        differenceBCBtn.addEventListener('click', () => {
            const setB = parseSetInput(setBInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = difference(setB, setC);
            displaySetOperationResult('Diferencia (B - C)', 'set-result-difference-bc', result);
            uiManager.showNotification('Diferencia (B - C) calculada.', 'success', false);
        });
    }

    if (differenceCBBtn) {
        differenceCBBtn.addEventListener('click', () => {
            const setB = parseSetInput(setBInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = difference(setC, setB);
            displaySetOperationResult('Diferencia (C - B)', 'set-result-difference-cb', result);
            uiManager.showNotification('Diferencia (C - B) calculada.', 'success', false);
        });
    }

    if (complementCBtn) {
        complementCBtn.addEventListener('click', () => {
            const setC = parseSetInput(setCInput.value);
            const universalSet = parseSetInput(universalSetInput.value);
            if (universalSet.size === 0) {
                uiManager.showNotification('Por favor, introduce un Conjunto Universal para calcular el complemento.', 'warning');
                return;
            }
            const result = complement(setC, universalSet);
            displaySetOperationResult('Complemento de C (C\')', 'set-result-complement-c', result);
            uiManager.showNotification('Complemento de C calculado.', 'success', false);
        });
    }

    if (unionABCBtn) {
        unionABCBtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setB = parseSetInput(setBInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = union(setA, union(setB, setC));
            displaySetOperationResult('Unión (A ∪ B ∪ C)', 'set-result-union-abc', result);
            uiManager.showNotification('Unión (A ∪ B ∪ C) calculada.', 'success', false);
        });
    }

    if (intersectionABCBtn) {
        intersectionABCBtn.addEventListener('click', () => {
            const setA = parseSetInput(setAInput.value);
            const setB = parseSetInput(setBInput.value);
            const setC = parseSetInput(setCInput.value);
            const result = intersection(setA, intersection(setB, setC));
            displaySetOperationResult('Intersección (A ∩ B ∩ C)', 'set-result-intersection-abc', result);
            uiManager.showNotification('Intersección (A ∩ B ∩ C) calculada.', 'success', false);
        });
    }

    if (calculateAllSetsBtn) {
        calculateAllSetsBtn.addEventListener('click', () => {
            if (setOperationsResultsDiv) setOperationsResultsDiv.innerHTML = '';
            const tbody = ensureSetResultsTable();
            if (!tbody) return;

            const setA = parseSetInput(setAInput.value);
            const setB = parseSetInput(setBInput.value);
            const setC = parseSetInput(setCInput.value);
            const universalSet = parseSetInput(universalSetInput.value);
            
            displaySetOperationResult('Unión (A ∪ B)', 'set-result-union', union(setA, setB), tbody);
            displaySetOperationResult('Intersección (A ∩ B)', 'set-result-intersection', intersection(setA, setB), tbody);
            displaySetOperationResult('Diferencia (A - B)', 'set-result-difference-ab', difference(setA, setB), tbody);
            displaySetOperationResult('Diferencia (B - A)', 'set-result-difference-ba', difference(setB, setA), tbody);
            
            displaySetOperationResult('Unión (A ∪ C)', 'set-result-union-ac', union(setA, setC), tbody);
            displaySetOperationResult('Intersección (A ∩ C)', 'set-result-intersection-ac', intersection(setA, setC), tbody);
            displaySetOperationResult('Diferencia (A - C)', 'set-result-difference-ac', difference(setA, setC), tbody);
            displaySetOperationResult('Diferencia (C - A)', 'set-result-difference-ca', difference(setC, setA), tbody);
            
            displaySetOperationResult('Unión (B ∪ C)', 'set-result-union-bc', union(setB, setC), tbody);
            displaySetOperationResult('Intersección (B ∩ C)', 'set-result-intersection-bc', intersection(setB, setC), tbody);
            displaySetOperationResult('Diferencia (B - C)', 'set-result-difference-bc', difference(setB, setC), tbody);
            displaySetOperationResult('Diferencia (C - B)', 'set-result-difference-cb', difference(setC, setB), tbody);

            displaySetOperationResult('Unión (A ∪ B ∪ C)', 'set-result-union-abc', union(setA, union(setB, setC)), tbody);
            displaySetOperationResult('Intersección (A ∩ B ∪ C)', 'set-result-intersection-abc', intersection(setA, intersection(setB, setC)), tbody);

            if (universalSet.size === 0) {
                displaySetOperationResult('Complemento de A (A\')', 'set-result-complement-a', new Set(['N/A - Universal vacío']), tbody);
                displaySetOperationResult('Complemento de B (B\')', 'set-result-complement-b', new Set(['N/A - Universal vacío']), tbody);
                displaySetOperationResult('Complemento de C (C\')', 'set-result-complement-c', new Set(['N/A - Universal vacío']), tbody);
            } else {
                displaySetOperationResult('Complemento de A (A\')', 'set-result-complement-a', complement(setA, universalSet), tbody);
                displaySetOperationResult('Complemento de B (B\')', 'set-result-complement-b', complement(setB, universalSet), tbody);
                displaySetOperationResult('Complemento de C (C\')', 'set-result-complement-c', complement(setC, universalSet), tbody);
            }
            uiManager.showNotification('Todas las operaciones con conjuntos realizadas.', 'success', false);
        });
    }

    if (clearSetOperationsBtn) {
        clearSetOperationsBtn.addEventListener('click', () => {
            if (!confirm('¿Estás seguro de que quieres limpiar todos los campos y resultados de conjuntos?')) {
                return;
            }
            uiManager.playSound('clear', false); // Sonido de limpieza INDIVIDUAL
            if (setAInput) setAInput.value = '';
            if (setBInput) setBInput.value = '';
            if (setCInput) setCInput.value = '';
            if (universalSetInput) universalSetInput.value = '';
            if (setOperationsResultsDiv) setOperationsResultsDiv.innerHTML = ''; 
            updateUniversalSet(); 
            uiManager.showNotification('Campos de conjuntos limpiados.', 'info', false);
        });
    }

    if (calculateProbabilityBtn) {
        calculateProbabilityBtn.addEventListener('click', () => {
            const affectedValue = parseFloat(affectedValueInput.value);
            const totalValue = parseFloat(totalValueInput.value);
            const result = calculateSimpleProbability(affectedValue, totalValue);
            if (probabilityResultsDiv) {
                if (isNaN(result.decimal)) {
                    probabilityResultsDiv.innerHTML = `<p style="color: red;">${result.percentage}</p>`;
                    uiManager.showNotification('Error en el cálculo de probabilidad.', 'warning', false);
                } else {
                    probabilityResultsDiv.innerHTML = `
                        <p><strong>Probabilidad:</strong> ${result.decimal.toFixed(4)}</p>
                        <p><strong>Porcentaje:</strong> ${result.percentage}</p>
                    `;
                    uiManager.showNotification('Probabilidad simple calculada.', 'success', false);
                }
            }
        });
    }

    if (calculateSequentialProbBtn) {
        calculateSequentialProbBtn.addEventListener('click', () => {
            const probabilitiesInput = independentProbabilitiesInput.value;
            const rawProbabilities = probabilitiesInput.split(',')
                                                        .map(s => parseFloat(s.trim()))
                                                        .filter(n => !isNaN(n));
            if (rawProbabilities.length === 0) {
                if (sequentialProbabilityResultsDiv) sequentialProbabilityResultsDiv.innerHTML = `<p style="color: red;">Por favor, introduce probabilidades válidas.</p>`;
                uiManager.showNotification('Introduce probabilidades válidas.', 'warning', false);
                return;
            }
            const result = calculateSequentialIndependentProbability(rawProbabilities);
            if (sequentialProbabilityResultsDiv) {
                if (isNaN(result.decimal)) {
                    sequentialProbabilityResultsDiv.innerHTML = `<p style="color: red;">${result.percentage}</p>`;
                    uiManager.showNotification('Error en probabilidad secuencial.', 'warning', false);
                } else {
                    sequentialProbabilityResultsDiv.innerHTML = `
                        <p><strong>Probabilidad Secuencial:</strong> ${result.decimal.toFixed(6)}</p>
                        <p><strong>Porcentaje:</strong> ${result.percentage}</p>
                    `;
                    uiManager.showNotification('Probabilidad secuencial calculada.', 'success', false);
                }
            }
        });
    }

    if (calculatePermutationsBtn) {
        calculatePermutationsBtn.addEventListener('click', () => {
            const n = parseInt(nInput.value);
            const r = parseInt(rInput.value);
            const result = calculatePermutations(n, r);
            if (permutationsCombinationsResultsDiv) {
                if (typeof result === 'string') {
                    permutationsCombinationsResultsDiv.innerHTML = `<p style="color: red;">${result}</p>`;
                    uiManager.showNotification('Error en permutaciones.', 'warning', false);
                } else {
                    permutationsCombinationsResultsDiv.innerHTML = `<p><strong>Permutaciones (nPr):</strong> ${result}</p>`;
                    uiManager.showNotification('Permutaciones calculadas exitosamente.', 'success', false);
                }
            }
        });
    }

    if (calculateCombinationsBtn) {
        calculateCombinationsBtn.addEventListener('click', () => {
            const n = parseInt(nInput.value);
            const r = parseInt(rInput.value);
            const result = calculateCombinations(n, r);
            if (permutationsCombinationsResultsDiv) {
                if (typeof result === 'string') {
                    permutationsCombinationsResultsDiv.innerHTML = `<p style="color: red;">${result}</p>`;
                    uiManager.showNotification('Error en combinaciones.', 'warning', false);
                } else {
                    permutationsCombinationsResultsDiv.innerHTML = `<p><strong>Combinaciones (nCr):</strong> ${result}</p>`;
                    uiManager.showNotification('Combinaciones calculadas exitosamente.', 'success', false);
                }
            }
        });
    }

    if (generateTreeDiagramBtn) {
        generateTreeDiagramBtn.addEventListener('click', () => {
            const pA = parseFloat(probAInput.value);
            const pBgivenA = parseFloat(probBGivAInput.value);
            const pBgivenNotA = parseFloat(probBGivNotAInput.value);
            
            if (!treeDiagramContainer) return;

            if (isNaN(pA) || pA < 0 || pA > 1 || isNaN(pBgivenA) || pBgivenA < 0 || pBgivenA > 1 || isNaN(pBgivenNotA) || pBgivenNotA < 0 || pBgivenNotA > 1) {
                treeDiagramContainer.innerHTML = `<p style="color: var(--color-danger); padding: var(--spacing-lg); text-align: center; font-weight: bold;">⚠️ Por favor, introduce probabilidades válidas entre 0 y 1.</p>`;
                uiManager.showNotification('Probabilidades inválidas para el diagrama.', 'warning', false);
                return;
            }
            
            const pNotA = 1 - pA;
            const pNotBgivenA = 1 - pBgivenA;
            const pNotBgivenNotA = 1 - pBgivenNotA;
            const pA_B = pA * pBgivenA;
            const pA_NotB = pA * pNotBgivenA;
            const pNotA_B = pNotA * pBgivenNotA;
            const pNotA_NotB = pNotA * pNotBgivenNotA;
            
            treeDiagramContainer.innerHTML = `
                <div class="tree-diagram-wrapper">
                    <!-- NODO INICIAL -->
                    <div class="tree-start">
                        <div class="tree-label">Inicio</div>
                    </div>
                    
                    <!-- NIVEL 1: A y A' -->
                    <div class="tree-level-1">
                        <!-- Rama A -->
                        <div class="tree-branch-left">
                            <div class="tree-node-container">
                                <div class="tree-line-vertical"></div>
                                <div class="tree-path-label">P(A) = ${pA.toFixed(3)}</div>
                                <div class="tree-label">A</div>
                            </div>
                            
                            <!-- Nivel 2: B y B' bajo A -->
                            <div class="tree-level-2">
                                <div class="tree-end-node">
                                    <div class="tree-line-vertical"></div>
                                    <div class="tree-path-label">P(B|A) = ${pBgivenA.toFixed(3)}</div>
                                    <div class="tree-label">B</div>
                                    <div class="joint-probability">P(A∩B) = ${pA_B.toFixed(4)}</div>
                                </div>
                                <div class="tree-end-node">
                                    <div class="tree-line-vertical"></div>
                                    <div class="tree-path-label">P(B'|A) = ${pNotBgivenA.toFixed(3)}</div>
                                    <div class="tree-label">B'</div>
                                    <div class="joint-probability">P(A∩B') = ${pA_NotB.toFixed(4)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Rama A' -->
                        <div class="tree-branch-right">
                            <div class="tree-node-container">
                                <div class="tree-line-vertical"></div>
                                <div class="tree-path-label">P(A') = ${pNotA.toFixed(3)}</div>
                                <div class="tree-label">A'</div>
                            </div>
                            
                            <!-- Nivel 2: B y B' bajo A' -->
                            <div class="tree-level-2">
                                <div class="tree-end-node">
                                    <div class="tree-line-vertical"></div>
                                    <div class="tree-path-label">P(B|A') = ${pBgivenNotA.toFixed(3)}</div>
                                    <div class="tree-label">B</div>
                                    <div class="joint-probability">P(A'∩B) = ${pNotA_B.toFixed(4)}</div>
                                </div>
                                <div class="tree-end-node">
                                    <div class="tree-line-vertical"></div>
                                    <div class="tree-path-label">P(B'|A') = ${pNotBgivenNotA.toFixed(3)}</div>
                                    <div class="tree-label">B'</div>
                                    <div class="joint-probability">P(A'∩B') = ${pNotA_NotB.toFixed(4)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- LEYENDA -->
                <div class="tree-legend">
                    <h4>Resumen de Probabilidades:</h4>
                    <div class="legend-items">
                        <div class="legend-item">
                            <strong>P(A):</strong> ${pA.toFixed(4)} | 
                            <strong>P(A'):</strong> ${pNotA.toFixed(4)}
                        </div>
                        <div class="legend-item">
                            <strong>P(B|A):</strong> ${pBgivenA.toFixed(4)} | 
                            <strong>P(B|A'):</strong> ${pBgivenNotA.toFixed(4)}
                        </div>
                        <div class="legend-item">
                            <strong>∑ de probabilidades finales:</strong> ${(pA_B + pA_NotB + pNotA_B + pNotA_NotB).toFixed(4)} ✓
                        </div>
                    </div>
                </div>
            `;
            uiManager.showNotification('Diagrama de árbol generado exitosamente.', 'success', false);
        });
    }

    function displayStatistics(data) {
        const mean = calculateMean(data).toFixed(2);
        const median = calculateMedian(data).toFixed(2);
        const mode = calculateMode(data).length ? calculateMode(data).join(', ') : 'N/A';
        const min = calculateMin(data);
        const max = calculateMax(data);
        const range = calculateRange(data);
        statisticsResultsDiv.innerHTML = `
            <h3>Estadísticas Descriptivas:</h3>
            <p><strong>Media:</strong> ${mean}</p>
            <p><strong>Mediana:</strong> ${median}</p>
            <p><strong>Moda:</strong> ${mode}</p>
            <p><strong>Mínimo:</strong> ${min}</p>
            <p><strong>Máximo:</strong> ${max}</p>
            <p><strong>Rango:</strong> ${range}</p>
        `;
    }

    function displayFrequencyTable(data) {
        const frequencyTable = calculateFrequencyTable(data);
        if (frequencyTable.length === 0) {
            frequencyTableResultsDiv.innerHTML = '<p>No hay datos para la tabla de frecuencias.</p>';
            return;
        }
        let tableHTML = '<h3>Tabla de Frecuencias:</h3>';
        tableHTML += '<table border="1" style="width:100%; border-collapse: collapse;">';
        tableHTML += '<thead><tr><th>Valor</th><th>fi</th><th>fr</th><th>Fi</th><th>Fr</th></tr></thead>';
        tableHTML += '<tbody>';
        frequencyTable.forEach(row => {
            tableHTML += `<tr>
                <td>${row.value}</td>
                <td>${row.fi}</td>
                <td>${row.fr.toFixed(4)}</td>
                <td>${row.Fi}</td>
                <td>${row.Fr.toFixed(4)}</td>
            </tr>`;
        });
        tableHTML += '</tbody></table>';
        frequencyTableResultsDiv.innerHTML = tableHTML;
    }

    function displayCharts(data) {
        // Only initialize canvases if they don't exist
        if (!document.getElementById('histogramChart')) {
            chartsContainerDiv.innerHTML = `
                <h3>Gráficos:</h3>
                <div style="width: 80%; margin: auto;"><canvas id="histogramChart"></canvas></div>
                <div style="width: 80%; margin: auto; margin-top: 20px;"><canvas id="frequencyPolygonChart"></canvas></div>
                <div style="width: 80%; margin: auto; margin-top: 20px;"><canvas id="ogiveChart"></canvas></div>
                <div style="width: 80%; margin: auto; margin-top: 20px;"><canvas id="paretoChart"></canvas></div>
            `;
        }

        histogramChartInstance = createHistogram(data, 'histogramChart', histogramChartInstance);
        frequencyPolygonChartInstance = createFrequencyPolygon(data, 'frequencyPolygonChart', frequencyPolygonChartInstance);
        ogiveChartInstance = createOgive(data, 'ogiveChart', ogiveChartInstance);
        paretoChartInstance = createParetoChart(data, 'paretoChart', paretoChartInstance);
    }

    function displaySetOperationResult(operationName, id, result, tbodyElement = null) {
        const sortedResult = Array.from(result).sort((a, b) => {
            if (typeof a === 'number' && typeof b === 'number') return a - b;
            return String(a).localeCompare(String(b));
        });
        const targetTbody = tbodyElement || ensureSetResultsTable();
        let existingRow = document.getElementById(id);
        if (!existingRow) {
            existingRow = document.createElement('tr');
            existingRow.id = id;
            targetTbody.appendChild(existingRow);
        }
        existingRow.innerHTML = `<td><strong>${operationName}</strong></td><td>{ ${sortedResult.join(', ')} }</td>`;
    }

    function displayDataInConsole() {
        console.log('Current Dataset:', getCurrentDataset());
    }
});