/**
 * Gestor de Temas
 * Maneja el cambio entre temas (claro, oscuro, cipher) y su persistencia.
 */
export class ThemeManager {
    constructor(uiManager, achievementManager) {
        this.uiManager = uiManager;
        this.achievementManager = achievementManager;
        this.body = document.body;
        this.switcherBtn = document.getElementById('theme-switcher-btn');
        this.cipherModeBtn = document.getElementById('cipher-mode-btn'); // Nuevo botón
        this.storageKey = 'app_theme';
        this.cipherUnlockedKey = 'cipher_theme_unlocked';

        this.themes = ['theme-dark', 'theme-light'];
        this.themeNames = {
            'theme-dark': 'Oscuro',
            'theme-light': 'Claro',
            'theme-cipher': 'Cipher'
        };

        this.init();
    }

    init() {
        // Inicializar visibilidad del botón Cipher
        if (localStorage.getItem(this.cipherUnlockedKey) === 'true') {
            this.themes.push('theme-cipher');
            this.cipherModeBtn?.classList.remove('hidden');
        } else {
            this.cipherModeBtn?.classList.add('hidden');
        }

        this.switcherBtn.addEventListener('click', () => this.cycleTheme());
        
        // Listener para el botón de activar modo Cipher
        this.cipherModeBtn?.addEventListener('click', () => this.applyTheme('theme-cipher'));

        // Aplicar tema guardado o el por defecto (oscuro)
        const savedTheme = localStorage.getItem(this.storageKey) || 'theme-dark';
        this.applyTheme(savedTheme);
    }

    cycleTheme() {
        const currentTheme = this.getCurrentTheme();
        const currentIndex = this.themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        const nextTheme = this.themes[nextIndex];
        this.applyTheme(nextTheme);
    }

    applyTheme(themeName) {
        // Limpiar clases de temas anteriores
        this.themes.forEach(theme => this.body.classList.remove(theme));

        // Aplicar la nueva clase de tema
        if (this.themes.includes(themeName)) {
            this.body.classList.add(themeName);
            localStorage.setItem(this.storageKey, themeName);
            this.uiManager.showNotification(`Tema cambiado a: ${this.themeNames[themeName]}`, 'info');
            
            // Ejecutar callback si existe
            if (this.onThemeChange) {
                this.onThemeChange(themeName);
            }
        }
    }

    unlockCipherTheme() {
        if (!this.themes.includes('theme-cipher')) {
            this.themes.push('theme-cipher');
            localStorage.setItem(this.cipherUnlockedKey, 'true');
            this.cipherModeBtn?.classList.remove('hidden'); // Hacer visible el botón
            this.achievementManager?.unlock('unlock_cipher');
            this.uiManager.showNotification('¡Has desbloqueado un nuevo tema!', 'success', true);
        }
    }

    getCurrentTheme() {
        return localStorage.getItem(this.storageKey) || 'theme-dark';
    }
}

export default ThemeManager;
