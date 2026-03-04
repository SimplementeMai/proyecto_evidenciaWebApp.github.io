/**
 * Implementación 1.02: Módulo Dinnerbone
 * Gestor exclusivo para el comando de inversión y huevo de pascua
 */

export class DinnerboneManager {
    constructor(themeManager, audioManager, achievementManager) {
        this.themeManager = themeManager;
        this.audioManager = audioManager;
        this.achievementManager = achievementManager;
        this.pageRoot = document.documentElement;
        this.dinnerboneBtn = document.getElementById('dinnerbone-btn');
        this.secretBtn = document.getElementById('secret-trigger-btn');
        this.dinnerboneModal = document.getElementById('dinnerbone-modal');
        this.puppetMovable = document.querySelector('.dinnerbone-puppet-center');
        this.closeBtn = document.getElementById('secret-trigger-in-modal');
        
        this.puppetAudio = new Audio('audio/puppet_button.mp3');
        this.audioManager.registerAudio(this.puppetAudio, 0.4);

        this.clickCount = 0;
        this.isFlipped = false;
        
        this.boundMouseMove = this.handlePuppetMouseMove.bind(this);
        
        this.init();
    }

    init() {
        if (this.dinnerboneBtn) {
            this.dinnerboneBtn.addEventListener('click', () => this.toggleFlipped());
        }

        if (this.secretBtn) {
            this.secretBtn.addEventListener('click', () => this.showModal());
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hideModal());
        }
    }

    toggleFlipped() {
        this.clickCount++;

        // Cada 3 clics, mostramos el modal y desbloqueamos el tema si es la primera vez.
        if (this.clickCount % 3 === 0) {
            this.showModal();
            this.themeManager.unlockCipherTheme();
        }

        // El botón ahora siempre alterna el estado de rotación.
        if (this.isFlipped) {
            this.unflip();
        } else {
            this.flip();
        }
    }

    flip() {
        this.isFlipped = true;
        this.pageRoot.classList.add('flipped');
        this.achievementManager?.unlock('dinnerbone_once');
        console.log('🙃 ¡Mundo al revés!');
        // Asegurar scroll al inicio para evitar desorientación
        window.scrollTo(0, 0);
    }

    unflip() {
        this.isFlipped = false;
        this.pageRoot.classList.remove('flipped');
        console.log('✓ Normalidad restaurada.');
    }

    showModal() {
        if (this.dinnerboneModal) {
            this.audioManager.playManagedAudio(this.puppetAudio);
            this.dinnerboneModal.classList.remove('hidden');
            this.dinnerboneModal.addEventListener('mousemove', this.boundMouseMove);
        }
    }

    hideModal() {
        if (this.dinnerboneModal) {
            this.dinnerboneModal.classList.add('hidden');
            this.dinnerboneModal.removeEventListener('mousemove', this.boundMouseMove);
            
            // Retoques finales: Regresar a la normalidad automáticamente
            this.unflip();
        }
    }

    handlePuppetMouseMove(e) {
        if (!this.puppetMovable) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const moveX = (clientX - innerWidth / 2) * 0.05;
        const moveY = (clientY - innerHeight / 2) * 0.05;
        this.puppetMovable.style.transform = `rotate(180deg) translateX(${moveX}px) translateY(${moveY}px)`;
    }
}

export default DinnerboneManager;
