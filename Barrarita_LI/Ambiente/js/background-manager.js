/**
 * Implementación 1.01 & 1.02: Ajuste de imagen y Mejora de Calidad
 * Gestor de fondos de pantalla y personalización de texto
 */

export class BackgroundManager {
    constructor(themeManager, achievementManager) {
        this.themeManager = themeManager;
        this.achievementManager = achievementManager;
        // Elementos de fondo
        this.bgSelector = document.getElementById('bg-selector');
        this.toggleBtn = document.getElementById('toggle-bg-btn');
        this.applyBtn = document.getElementById('apply-bg-btn');
        this.container = document.getElementById('bg-selector-container');
        
        // Elementos de texto (1.02)
        this.fontSlider = document.getElementById('font-color-slider');
        
        this.body = document.body;
        this.storageKeyBg = 'app_background_image';
        this.storageKeyFont = 'app_font_hue';
        
        this.init();
    }

    init() {
        if (!this.bgSelector || !this.toggleBtn || !this.applyBtn) return;

        // 1. Cargar fondo guardado
        const savedBg = localStorage.getItem(this.storageKeyBg);
        if (savedBg) {
            this.applyBackground(savedBg);
            this.bgSelector.value = savedBg;
        } else {
            const defaultBg = 'none'; // Por defecto sin imagen
            this.applyBackground(defaultBg);
            this.bgSelector.value = defaultBg;
        }

        // 2. Cargar tono de fuente guardado (1.02)
        const savedHue = localStorage.getItem(this.storageKeyFont);
        if (savedHue !== null) {
            this.updateFontColor(savedHue);
            this.fontSlider.value = savedHue;
        }

        // 3. Event Listeners para el panel
        this.toggleBtn.addEventListener('click', () => {
            this.container.classList.toggle('hidden');
        });

        // 4. Aplicar cambios de fondo
        this.applyBtn.addEventListener('click', () => {
            const selectedBg = this.bgSelector.value;
            this.applyBackground(selectedBg);
            localStorage.setItem(this.storageKeyBg, selectedBg);
            
            // Sugerir un tono automático basado en la imagen (1.02)
            this.suggestAutomaticTone(selectedBg);
            
            this.showFeedback(this.applyBtn, '¡Aplicado! ✨');
            if (selectedBg !== 'none') this.achievementManager?.unlock('change_bg');
        });

        // 5. Ajuste de tono de letra (1.02)
        if (this.fontSlider) {
            this.colorChangeCount = parseInt(localStorage.getItem('app_color_change_count')) || 0;
            this.fontSlider.addEventListener('input', (e) => {
                this.updateFontColor(e.target.value);
            });
            this.fontSlider.addEventListener('change', (e) => {
                localStorage.setItem(this.storageKeyFont, e.target.value);
                this.colorChangeCount++;
                localStorage.setItem('app_color_change_count', this.colorChangeCount);
                if (this.colorChangeCount >= 20) this.achievementManager?.unlock('color_obsessed');
            });
        }
    }

    /**
     * Aplica la imagen de fondo con tintes inteligentes por tema
     */
    applyBackground(bgPath) {
        this.body.style.backgroundSize = 'cover';
        this.body.style.backgroundPosition = 'center';
        this.body.style.backgroundAttachment = 'fixed';
        this.body.style.backgroundRepeat = 'no-repeat';

        if (bgPath === 'none') {
            this.body.style.backgroundImage = 'none';
            this.body.style.backgroundColor = 'var(--color-bg-dark)';
            this.body.style.backgroundBlendMode = 'normal';
        } else {
            this.body.style.backgroundImage = `url('${bgPath}')`;
            
            const currentTheme = this.themeManager.getCurrentTheme();
            if (currentTheme === 'theme-light') {
                // Modo Claro: Tinte blanco suave para integrarse con la interfaz
                this.body.style.backgroundColor = 'rgba(252, 252, 249, 0.7)';
                this.body.style.backgroundBlendMode = 'lighten';
            } else {
                // Modo Oscuro/Cipher: Tinte oscuro clásico
                this.body.style.backgroundColor = 'rgba(10, 10, 25, 0.5)';
                this.body.style.backgroundBlendMode = 'multiply';
            }
        }
    }

    /**
     * Actualiza el color de la fuente evitando colores prohibidos (1.02)
     * Condición 1: Evita naranja (20-50), verde oscuro (100-150), amarillo pastel (55-65)
     */
    updateFontColor(hue) {
        let h = parseInt(hue);
        let s = 90;
        let l = 90; // Luminosidad para tema oscuro

        // Ajustar luminosidad si el tema es claro para mantener contraste
        const currentTheme = this.themeManager.getCurrentTheme();
        if (currentTheme === 'theme-light') {
            l = 30; // Mucho más oscuro para fondo claro
            s = 70; // Un poco menos saturado
        }

        // Validar rangos prohibidos y ajustar ligeramente para saltarlos
        if (h >= 20 && h <= 50) h = 15; // Salta el naranja
        if (h >= 55 && h <= 65) h = 70; // Salta el amarillo pastel
        if (h >= 100 && h <= 150) h = 160; // Salta el verde oscuro

        // Aplicar color mediante variables CSS
        const titles = document.querySelectorAll('h2, .main-page-title');
        let colorString;
        
        if (h === 0) {
            colorString = (currentTheme === 'theme-light') ? '#1c1e21' : '#e0e0e0';
            titles.forEach(t => t.style.filter = 'none');
        } else {
            colorString = `hsl(${h}, ${s}%, ${l}%)`;
            // En tema claro, los títulos también necesitan oscurecerse un poco para legibilidad
            const brightness = (currentTheme === 'theme-light') ? '0.7' : '1.2';
            titles.forEach(t => t.style.filter = `hue-rotate(${h}deg) brightness(${brightness})`);
        }
        
        this.body.style.setProperty('--color-text-primary', colorString);
    }

    /**
     * Sugiere un tono contrastante según la imagen (1.02)
     */
    suggestAutomaticTone(bgPath) {
        let suggestedHue = 0;
        
        if (bgPath.includes('playa') || bgPath.includes('costa')) suggestedHue = 190; // Cian/Azulado
        if (bgPath.includes('fut')) suggestedHue = 280; // Púrpura
        if (bgPath.includes('montaña')) suggestedHue = 210; // Azul frío
        if (bgPath.includes('ciudad')) suggestedHue = 320; // Rosa/Magente
        if (bgPath.includes('tren')) suggestedHue = 45; // Dorado (ajustado para no ser naranja feo)
        
        if (suggestedHue !== 0) {
            this.updateFontColor(suggestedHue);
            this.fontSlider.value = suggestedHue;
            localStorage.setItem(this.storageKeyFont, suggestedHue);
        }
    }

    showFeedback(btn, text) {
        const originalText = btn.textContent;
        btn.textContent = text;
        btn.classList.add('btn-success');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('btn-success');
        }, 2000);
    }
}

export default BackgroundManager;
