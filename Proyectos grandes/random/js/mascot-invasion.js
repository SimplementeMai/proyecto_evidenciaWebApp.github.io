/**
 * MASCOT INVASION
 * Emojis aleatorios que rebotan por toda la pantalla.
 */
export class MascotInvasion {
    constructor() {
        this.isActive = false;
        this.mascots = [];
        this.emojis = ['🐱', '🐶', '🦊', '🐸', '🦁', '🦖', '🦄', '🌈', '✨', '🔥'];
        this.animationId = null;
    }

    toggle() {
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.start();
        } else {
            this.stop();
        }
    }

    start() {
        for (let i = 0; i < 15; i++) {
            this.createMascot();
        }
        this.animate();
    }

    createMascot() {
        const mascot = document.createElement('div');
        mascot.innerHTML = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        mascot.style.cssText = `
            position: fixed;
            font-size: 2em;
            z-index: 10007;
            pointer-events: none;
            user-select: none;
        `;
        document.body.appendChild(mascot);

        const data = {
            el: mascot,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10
        };
        this.mascots.push(data);
    }

    animate() {
        if (!this.isActive) return;

        this.mascots.forEach(m => {
            m.x += m.vx;
            m.y += m.vy;

            if (m.x <= 0 || m.x >= window.innerWidth - 30) m.vx *= -1;
            if (m.y <= 0 || m.y >= window.innerHeight - 30) m.vy *= -1;

            m.el.style.left = m.x + 'px';
            m.el.style.top = m.y + 'px';
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        cancelAnimationFrame(this.animationId);
        this.mascots.forEach(m => m.el.remove());
        this.mascots = [];
    }
}
