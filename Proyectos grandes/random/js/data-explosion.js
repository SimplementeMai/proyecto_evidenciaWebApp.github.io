/**
 * DATA EXPLOSION
 * Los números del dataset actual salen disparados desde el cursor.
 */
import { getCurrentDataset } from '../../../Calculo/Datos/js/data.js';

export class DataExplosion {
    constructor() {
        this.isActive = false;
        this.boundMove = this.handleMouseMove.bind(this);
    }

    toggle() {
        this.isActive = !this.isActive;
        if (this.isActive) {
            window.addEventListener('mousemove', this.boundMove);
        } else {
            window.removeEventListener('mousemove', this.boundMove);
        }
    }

    handleMouseMove(e) {
        const data = getCurrentDataset();
        if (!data || data.length === 0) return;

        const num = data[Math.floor(Math.random() * data.length)];
        this.createFloatingNumber(e.clientX, e.clientY, num);
    }

    createFloatingNumber(x, y, value) {
        const el = document.createElement('div');
        el.textContent = value;
        el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: var(--color-primary);
            font-weight: bold;
            font-size: 1.2em;
            pointer-events: none;
            z-index: 10008;
            transition: all 1s ease-out;
        `;
        document.body.appendChild(el);

        setTimeout(() => {
            el.style.transform = `translate(${(Math.random()-0.5)*200}px, ${(Math.random()-0.5)*200}px) scale(2)`;
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 1000);
        }, 10);
    }
}
