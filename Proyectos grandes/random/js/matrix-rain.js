/**
 * MATRIX CODE RAIN
 * Crea un efecto de lluvia de código digital sobre la pantalla.
 */
export class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.columns = 0;
        this.drops = [];
        this.isActive = false;
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
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'matrix-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.8;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        const chars = "統計確率データ乱数行列数値計算".split(""); // Caracteres relacionados con estadística
        const fontSize = 16;
        this.columns = this.canvas.width / fontSize;
        this.drops = Array(Math.floor(this.columns)).fill(1);

        const draw = () => {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = "#0F0"; // Verde Matrix
            this.ctx.font = fontSize + "px monospace";

            for (let i = 0; i < this.drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                this.ctx.fillText(text, i * fontSize, this.drops[i] * fontSize);

                if (this.drops[i] * fontSize > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i]++;
            }
            this.animationId = requestAnimationFrame(draw);
        };

        draw();
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    stop() {
        cancelAnimationFrame(this.animationId);
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
    }
}
