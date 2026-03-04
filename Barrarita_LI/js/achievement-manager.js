/**
 * GESTOR DE LOGROS
 * Maneja la lógica de desbloqueo, persistencia y visualización de logros.
 */
export class AchievementManager {
    constructor(uiManager = null) {
        this.uiManager = uiManager;
        this.modal = document.getElementById('achievements-modal');
        this.container = document.getElementById('achievements-container');
        this.openBtn = document.getElementById('open-achievements-btn');
        this.closeBtn = document.getElementById('close-achievements-btn');
        this.storageKey = 'app_achievements';

        this.difficulties = {
            'común': { color: '#2ecc71', label: 'Común' },
            'poco común': { color: '#3498db', label: 'Poco Común' },
            'extraña': { color: '#9b59b6', label: 'Extraña' },
            'difícil': { color: '#e67e22', label: 'Difícil' },
            'descabellado': { color: '#e74c3c', label: 'Descabellado' },
            'imposible': { color: '#f1c40f', label: 'Imposible', glow: true }
        };

        this.achievements = [
            // Comunes
            { id: 'first_calc', title: 'Científico de Datos', desc: 'Realiza tu primer cálculo estadístico.', diff: 'común' },
            { id: 'open_guide', title: 'Aprendiz', desc: 'Abre la guía rápida para entender el sistema.', diff: 'común' },
            { id: 'mute_audio', title: 'Silencio por favor', desc: 'Mutea el audio de la aplicación.', diff: 'común' },
            
            // Poco comunes
            { id: 'change_bg', title: 'Decorador', desc: 'Cambia el fondo de pantalla por primera vez.', diff: 'poco común' },
            { id: 'change_theme', title: 'Camaleón', desc: 'Cambia el tema visual de la aplicación.', diff: 'poco común' },
            { id: 'use_random', title: 'Amante del Azar', desc: 'Usa la función de Aleatorio Total.', diff: 'poco común' },

            // Extrañas
            { id: 'dinnerbone_once', title: 'Mundo al Revés', desc: 'Usa el botón Dinnerbone para voltear la pantalla.', diff: 'extraña' },
            { id: 'click_puppet', title: 'Curiosidad', desc: 'Haz clic directamente en Puppet.', diff: 'extraña' },
            { id: 'chaos_hub', title: 'Caja de Pandora', desc: 'Abre el menú del Hub del Caos.', diff: 'extraña' },

            // Dificiles
            { id: 'win_puppet', title: 'Cazador de Sombras', desc: 'Atrapa a Puppet y completa el protocolo PUPPET-101.', diff: 'difícil' },
            { id: 'unlock_cipher', title: 'Descifrador', desc: 'Encuentra el código secreto y desbloquea el tema Cipher.', diff: 'difícil' },
            { id: 'fast_win', title: 'Reflejos de Gato', desc: 'Gana el juego de Puppet en menos de 15 segundos.', diff: 'difícil' },

            // Descabellado
            { id: 'color_obsessed', title: 'Obsesión Cromática', desc: 'Cambia el tono de letra 20 veces.', diff: 'descabellado' },
            { id: 'puppet_master', title: 'Maestro de Marionetas', desc: 'Gana el juego de Puppet 5 veces.', diff: 'descabellado' },

            // Imposible
            { id: 'chaos_god', title: 'Dios del Caos', desc: 'Activa todas las funciones del Hub del Caos al mismo tiempo.', diff: 'imposible' },
            { id: 'lightning_win', title: 'Atrapa-Relámpagos', desc: 'Gana el juego de Puppet en menos de 8 segundos.', diff: 'imposible' }
        ];

        this.unlocked = this.loadUnlocked();
        this.init();
    }

    init() {
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.showModal());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hideModal());
        }
        
        // Cerrar al hacer clic fuera
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hideModal();
        });

        this.renderAchievements();
    }

    loadUnlocked() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : [];
    }

    saveUnlocked() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.unlocked));
    }

    unlock(id) {
        if (this.unlocked.includes(id)) return;

        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement) return;

        this.unlocked.push(id);
        this.saveUnlocked();
        this.renderAchievements();

        // Notificación especial
        this.uiManager.showNotification(`🏆 ¡LOGRO DESBLOQUEADO!: ${achievement.title}`, 'success', true);
    }

    showModal() {
        this.renderAchievements();
        this.modal?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modal?.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    renderAchievements() {
        if (!this.container) return;

        this.container.innerHTML = '';
        
        this.achievements.forEach(ach => {
            const isUnlocked = this.unlocked.includes(ach.id);
            const diffInfo = this.difficulties[ach.diff];
            
            const card = document.createElement('div');
            card.style.cssText = `
                background: ${isUnlocked ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)'};
                border: 1px solid ${isUnlocked ? diffInfo.color : '#444'};
                border-left: 5px solid ${diffInfo.color};
                padding: 15px;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                opacity: ${isUnlocked ? '1' : '0.5'};
                filter: ${isUnlocked ? 'none' : 'grayscale(1)'};
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                ${isUnlocked && diffInfo.glow ? `box-shadow: 0 0 15px ${diffInfo.color};` : ''}
            `;

            if (isUnlocked && diffInfo.glow) {
                card.style.animation = 'achievement-glow 2s infinite alternate';
            }

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: ${isUnlocked ? 'white' : '#888'}; font-size: 1.1em;">${ach.title}</strong>
                    <span style="font-size: 0.7em; padding: 2px 8px; border-radius: 10px; background: ${diffInfo.color}; color: black; font-weight: bold; text-transform: uppercase;">
                        ${diffInfo.label}
                    </span>
                </div>
                <p style="margin: 5px 0 0 0; font-size: 0.85em; color: ${isUnlocked ? 'var(--color-text-secondary)' : '#666'};">
                    ${ach.desc}
                </p>
                ${isUnlocked ? '<span style="position: absolute; right: 10px; bottom: 5px; font-size: 1.2em; opacity: 0.5;">✅</span>' : ''}
            `;

            this.container.appendChild(card);
        });

        // Inject animation if not exists
        if (!document.getElementById('achievement-anim-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-anim-styles';
            style.textContent = `
                @keyframes achievement-glow {
                    from { box-shadow: 0 0 5px #f1c40f; }
                    to { box-shadow: 0 0 20px #f1c40f, 0 0 30px #f1c40f; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

export default AchievementManager;
