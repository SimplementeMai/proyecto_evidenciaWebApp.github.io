/**
 * RANDOM HUB MANAGER
 * Coordina las 5 grandes funciones aleatorias solicitadas por Mai.
 */
import { MatrixRain } from './matrix-rain.js';
import { MascotInvasion } from './mascot-invasion.js';
import { MirrorWorld } from './mirror-world.js';
import { JellyUI } from './jelly-ui.js';
import { DataExplosion } from './data-explosion.js';

export class RandomHubManager {
    constructor(uiManager, audioManager, achievementManager) {
        this.uiManager = uiManager;
        this.audioManager = audioManager;
        this.achievementManager = achievementManager;
        
        // Inicializar los 5 jinetes del caos (Actualizados para ser más RANDOM)
        this.matrix = new MatrixRain();
        this.mascots = new MascotInvasion();
        this.mirror = new MirrorWorld();
        this.jelly = new JellyUI();
        this.explosion = new DataExplosion();

        this.initUI();
    }

    initUI() {
        const chaosBtn = document.createElement('button');
        chaosBtn.id = 'chaos-hub-btn';
        chaosBtn.innerHTML = '🌀';
        chaosBtn.title = 'El Hub del Caos';
        chaosBtn.style.cssText = `
            position: fixed; bottom: 30px; left: 30px; width: 50px; height: 50px;
            border-radius: 50%; background: linear-gradient(135deg, #ff00ff, #00ffff);
            border: 2px solid white; color: white; font-size: 1.5em; cursor: pointer;
            z-index: 9999; box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
            display: flex; justify-content: center; align-items: center; transition: all 0.3s ease;
        `;
        document.body.appendChild(chaosBtn);
        chaosBtn.addEventListener('click', () => this.toggleChaosMenu());
    }

    toggleChaosMenu() {
        if (document.getElementById('chaos-menu')) {
            document.getElementById('chaos-menu').remove();
            return;
        }

        const menu = document.createElement('div');
        menu.id = 'chaos-menu';
        menu.style.cssText = `
            position: fixed; bottom: 90px; left: 30px; background: rgba(26, 26, 46, 0.95);
            border: 2px solid var(--color-primary); border-radius: 15px; padding: 15px;
            display: flex; flex-direction: column; gap: 10px; z-index: 9999;
            backdrop-filter: blur(10px); animation: popIn 0.3s ease;
        `;

        const options = [
            { name: '💻 Código Matrix', action: () => this.matrix.toggle() },
            { name: '🐱 Invasión Mascota', action: () => this.mascots.toggle() },
            { name: '🪞 Mundo Espejo', action: () => this.mirror.toggle() },
            { name: '🍮 UI Gelatina', action: () => this.jelly.toggle() },
            { name: '💥 Explosión Datos', action: () => this.explosion.toggle() }
        ];

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'side-action-btn';
            btn.textContent = opt.name;
            btn.style.fontSize = '0.8em';
            btn.onclick = () => {
                opt.action();
                this.uiManager.showNotification(`${opt.name} activado`, 'info');
                this.checkChaosGod();
            };
            menu.appendChild(btn);
        });

        document.body.appendChild(menu);
        this.achievementManager?.unlock('chaos_hub');
    }

    checkChaosGod() {
        if (this.matrix.isActive && this.mascots.isActive && this.mirror.isActive && 
            this.jelly.isActive && this.explosion.isActive) {
            this.achievementManager?.unlock('chaos_god');
        }
    }
}

export default RandomHubManager;
