/**
 * JELLY UI
 * Hace que los elementos se muevan como gelatina al pasar el ratón.
 */
export class JellyUI {
    constructor() {
        this.isActive = false;
        this.injectStyles();
    }

    toggle() {
        this.isActive = !this.isActive;
        const targets = document.querySelectorAll('.module-section, .side-action-btn, .sponsored-item, h1, h2');
        targets.forEach(t => {
            if (this.isActive) {
                t.classList.add('jelly-item');
            } else {
                t.classList.remove('jelly-item');
            }
        });
    }

    injectStyles() {
        if (document.getElementById('jelly-styles')) return;
        const style = document.createElement('style');
        style.id = 'jelly-styles';
        style.textContent = `
            .jelly-item:hover {
                animation: jelly-wobble 0.6s both;
            }

            @keyframes jelly-wobble {
                0% { transform: scale3d(1, 1, 1); }
                30% { transform: scale3d(1.25, 0.75, 1); }
                40% { transform: scale3d(0.75, 1.25, 1); }
                50% { transform: scale3d(1.15, 0.85, 1); }
                65% { transform: scale3d(0.95, 1.05, 1); }
                75% { transform: scale3d(1.05, 0.95, 1); }
                100% { transform: scale3d(1, 1, 1); }
            }
        `;
        document.head.appendChild(style);
    }
}
