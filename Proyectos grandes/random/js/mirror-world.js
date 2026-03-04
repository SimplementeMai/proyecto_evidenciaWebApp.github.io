/**
 * MIRROR WORLD
 * Voltea la pantalla horizontalmente e invierte colores.
 */
export class MirrorWorld {
    constructor() {
        this.isActive = false;
    }

    toggle() {
        this.isActive = !this.isActive;
        const html = document.documentElement;
        if (this.isActive) {
            html.style.filter = 'invert(1) hue-rotate(180deg)';
            html.style.transform = 'scaleX(-1)';
        } else {
            html.style.filter = 'none';
            html.style.transform = 'none';
        }
    }
}
