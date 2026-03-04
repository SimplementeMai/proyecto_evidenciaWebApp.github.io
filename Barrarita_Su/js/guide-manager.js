/**
 * GESTOR DE GUÍA RÁPIDA
 * Proporciona un recorrido interactivo para explicar las funciones base.
 */
export class GuideManager {
    constructor(uiManager, achievementManager = null) {
        this.uiManager = uiManager;
        this.achievementManager = achievementManager;
        this.startBtn = document.getElementById('start-guide-btn');
        this.currentStep = 0;
        
        this.steps = [
            {
                element: '#sponsored-section',
                title: '🎬 Contenido Patrocinado',
                text: 'Ubicado en la parte superior. Aquí encontrarás recursos externos seleccionados para complementar tu experiencia.'
            },
            {
                element: '#open-settings-btn',
                title: '⚙️ Configuración',
                text: 'En la barra lateral izquierda. Abre este panel para personalizar el audio, los temas y el ambiente visual.',
                sidebar: 'left'
            },
            {
                element: '#mute-audio-btn',
                title: '🔇 Control de Audio',
                text: 'Dentro de Configuración. Activa o desactiva todos los sonidos de la aplicación.',
                settingsModal: true
            },
            {
                element: '#theme-switcher-btn',
                title: '🎨 Cambiar Tema',
                text: 'Dentro de Configuración. Alterna entre los diferentes temas visuales (Claro/Oscuro).',
                settingsModal: true
            },
            {
                element: '#toggle-bg-btn',
                title: '🖼️ Ambiente',
                text: 'Dentro de Configuración. Abre el selector para elegir una imagen de fondo.',
                settingsModal: true
            },
            {
                element: '#font-color-slider',
                title: '🌈 Tono de Letra',
                text: 'Dentro de Configuración. Desliza para cambiar el color de la tipografía.',
                settingsModal: true
            },
            {
                element: '#global-clear-btn',
                title: '🗑️ Limpiar Todo',
                text: 'En la barra lateral izquierda. Borra todos los campos de entrada y resultados.',
                sidebar: 'left'
            },
            {
                element: '#global-random-btn',
                title: '🎲 Aleatorio Total',
                text: 'En la barra lateral izquierda. Genera datos y configuraciones aleatorias al instante.',
                sidebar: 'left'
            },
            {
                element: '#random-count-slider',
                title: '📊 Cantidad Aleatoria',
                text: 'En la barra lateral izquierda. Ajusta cuántos números se generarán.',
                sidebar: 'left'
            },
            {
                element: '#data-input',
                title: '✍️ Entrada de Datos',
                text: 'Panel central. Introduce tus números o genera una serie. Pulsa "Calcular".'
            },
            {
                element: '#right-sidebar',
                title: '📍 Navegación Rápida',
                text: 'En la barra lateral derecha. Úsala para saltar directamente a cualquier sección sin hacer scroll.',
                sidebar: 'right'
            },
            {
                element: '#chaos-hub-btn',
                title: '🌀 Hub del Caos',
                text: 'Botón flotante. Pulsa aquí para desplegar el menú de funciones aleatorias: Matrix, Invasiones, Efectos Espejo y más. ¡Libera el caos!'
            }
        ];

        this.init();
    }

    init() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startGuide());
        }
    }

    startGuide() {
        this.currentStep = 0;
        this.createGuideUI();
        this.showStep();
        this.achievementManager?.unlock('open_guide');
    }

    createGuideUI() {
        if (document.getElementById('guide-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'guide-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.3);
            z-index: 15000;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none; /* Dejar que se pueda interactuar con lo de abajo si es necesario */
            transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.id = 'guide-modal';
        modal.style.cssText = `
            pointer-events: auto;
            background: var(--color-bg-card);
            border: 2px solid var(--color-primary);
            border-radius: var(--radius-lg);
            padding: 30px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 0 30px rgba(138, 43, 226, 0.5);
            text-align: center;
            position: relative;
            z-index: 17000;
            animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;

        modal.innerHTML = `
            <h3 id="guide-title" style="color: var(--color-primary); margin-top: 0;"></h3>
            <p id="guide-text" style="margin: 20px 0; line-height: 1.6; color: var(--color-text-primary);"></p>
            <div style="display: flex; justify-content: space-between; gap: 10px; margin-top: 30px;">
                <button id="skip-guide-btn" class="btn-secondary btn-small" style="font-size: 0.8em; opacity: 0.7;">Saltear Guía ⏭️</button>
                <button id="next-guide-btn" class="btn-primary" style="padding: 10px 25px;">Siguiente ➡️</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('next-guide-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('skip-guide-btn').addEventListener('click', () => this.endGuide());
    }

    showStep() {
        const step = this.steps[this.currentStep];
        const titleEl = document.getElementById('guide-title');
        const textEl = document.getElementById('guide-text');
        const nextBtn = document.getElementById('next-guide-btn');

        if (!step || !titleEl || !textEl) return;

        titleEl.textContent = step.title;
        textEl.textContent = step.text;

        if (this.currentStep === this.steps.length - 1) {
            nextBtn.textContent = '¡Entendido! ✨';
        } else {
            nextBtn.textContent = 'Siguiente ➡️';
        }

        // Resaltar elemento (opcional pero profesional)
        this.highlightElement(step.element);
    }

    nextStep() {
        this.currentStep++;
        if (this.currentStep < this.steps.length) {
            this.showStep();
        } else {
            this.endGuide();
        }
    }

    highlightElement(selector) {
        // Remover highlight anterior
        document.querySelector('.guide-highlight')?.classList.remove('guide-highlight');
        
        const step = this.steps[this.currentStep];
        const el = document.querySelector(selector);
        
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('guide-highlight');
            
            // Lógica para abrir barras laterales automáticamente
            const sidebarLeft = document.getElementById('sidebar');
            const sidebarRight = document.getElementById('right-sidebar');
            const settingsModal = document.getElementById('settings-modal');

            if (step.sidebar === 'left') {
                sidebarLeft?.classList.add('active');
                sidebarRight?.classList.remove('active');
                settingsModal?.classList.add('hidden');
            } else if (step.sidebar === 'right') {
                sidebarRight?.classList.add('active');
                sidebarLeft?.classList.remove('active');
                settingsModal?.classList.add('hidden');
            } else if (step.settingsModal) {
                sidebarLeft?.classList.add('active'); // Abrir sidebar para mostrar el origen si es necesario
                settingsModal?.classList.remove('hidden');
            } else {
                // Si el paso no es de sidebar ni modal, cerramos todo lo que estorbe
                sidebarLeft?.classList.remove('active');
                sidebarRight?.classList.remove('active');
                settingsModal?.classList.add('hidden');
            }
        }
    }

    endGuide() {
        // Remover resaltados
        document.querySelector('.guide-highlight')?.classList.remove('guide-highlight');
        
        // Asegurar que todo se cierre al terminar/saltear
        document.getElementById('sidebar')?.classList.remove('active');
        document.getElementById('right-sidebar')?.classList.remove('active');
        document.getElementById('settings-modal')?.classList.add('hidden');
        document.body.style.overflow = 'auto';

        const overlay = document.getElementById('guide-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
        this.uiManager.showNotification('¡Guía completada! Disfruta la herramienta.', 'success');
    }
}

export default GuideManager;
