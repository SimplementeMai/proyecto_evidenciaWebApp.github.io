/**
 * MANAGER DE INTERFAZ DE USUARIO (Restructurado 1.02)
 * Controlador central para sincronizar elementos UI
 */

export class UIManager {
    constructor(audioManager) {
        this.audioManager = audioManager;
        this.sidebarLeft = document.getElementById('sidebar');
        this.sidebarRight = document.getElementById('right-sidebar');
        this.puppetContainer = document.getElementById('puppet-container');
        this.puppetImage = document.getElementById('puppet-image');
        this.body = document.body;
        this.notificationToast = document.getElementById('notification-toast');
        
        // Settings Modal Elements
        this.settingsModal = document.getElementById('settings-modal');
        this.openSettingsBtn = document.getElementById('open-settings-btn');
        this.closeSettingsBtn = document.getElementById('close-settings-btn');
        
        this.initializeSyncedElements();
        this.initSettingsModal();
    }

    initSettingsModal() {
        if (this.openSettingsBtn && this.settingsModal) {
            this.openSettingsBtn.addEventListener('click', () => {
                this.settingsModal.classList.remove('hidden');
                this.body.style.overflow = 'hidden'; // Prevent scroll while open
            });
        }

        if (this.closeSettingsBtn && this.settingsModal) {
            this.closeSettingsBtn.addEventListener('click', () => {
                this.settingsModal.classList.add('hidden');
                this.body.style.overflow = 'auto'; // Restore scroll
            });
        }

        // Close on clicking overlay (outside content)
        this.settingsModal?.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.settingsModal.classList.add('hidden');
                this.body.style.overflow = 'auto';
            }
        });
    }

    /**
     * Inicializa la sincronización entre elementos UI
     */
    initializeSyncedElements() {
        if (this.sidebarRight && this.puppetContainer) {
            this.sidebarRight.addEventListener('mouseenter', () => {
                this.showPuppet();
            });
            this.sidebarRight.addEventListener('mouseleave', () => {
                this.hidePuppet();
            });
            this.puppetContainer.addEventListener('mouseleave', () => {
                this.hidePuppet();
            });
        }

        // Mobile Toggle Logic
        const mobileLeftBtn = document.getElementById('mobile-left-toggle');
        const mobileRightBtn = document.getElementById('mobile-right-toggle');

        if (mobileLeftBtn) {
            mobileLeftBtn.addEventListener('click', () => {
                this.sidebarLeft?.classList.toggle('active');
                this.sidebarRight?.classList.remove('active'); // Close other
            });
        }

        if (mobileRightBtn) {
            mobileRightBtn.addEventListener('click', () => {
                this.sidebarRight?.classList.toggle('active');
                this.sidebarLeft?.classList.remove('active'); // Close other
            });
        }

        // Close sidebars when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (this.sidebarLeft?.classList.contains('active') && 
                    !this.sidebarLeft.contains(e.target) && 
                    e.target !== mobileLeftBtn) {
                    this.sidebarLeft.classList.remove('active');
                }
                if (this.sidebarRight?.classList.contains('active') && 
                    !this.sidebarRight.contains(e.target) && 
                    e.target !== mobileRightBtn) {
                    this.sidebarRight.classList.remove('active');
                }
            }
        });
    }

    /**
     * Mostrar imagen puppet (Usando right)
     */
    showPuppet() {
        if (this.puppetContainer) {
            this.puppetContainer.style.right = 'var(--puppet-visible)';
        }
    }

    /**
     * Ocultar imagen puppet (Usando right)
     */
    hidePuppet() {
        if (this.puppetContainer) {
            this.puppetContainer.style.right = 'var(--puppet-hidden)';
        }
    }

    /**
     * Motor de sonido sintetizado para la interfaz
     */
    playSound(type, isGlobal = false) {
        if (this.audioManager.isMuted) return; 
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const gainNode = audioCtx.createGain();
            gainNode.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            const duration = isGlobal ? 0.4 : 0.15;
            const volume = isGlobal ? 0.08 : 0.04;

            if (type === 'random') {
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(isGlobal ? 330 : 554.37, now);
                osc.frequency.exponentialRampToValueAtTime(isGlobal ? 660 : 880, now + duration);
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
                osc.connect(gainNode);
                osc.start();
                osc.stop(now + duration);
            } 
            else if (type === 'clear') {
                const filter = audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(isGlobal ? 1000 : 2000, now);
                filter.frequency.exponentialRampToValueAtTime(50, now + duration);
                filter.connect(gainNode);
                const bufferSize = audioCtx.sampleRate * duration;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 0.5 - 0.25;
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
                noise.connect(filter);
                noise.start();
            }
            else {
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(isGlobal ? 523.25 : 659.25, now);
                if (isGlobal) osc.frequency.exponentialRampToValueAtTime(1046.50, now + duration);
                gainNode.gain.setValueAtTime(volume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
                osc.connect(gainNode);
                osc.start();
                osc.stop(now + duration);
            }
        } catch (e) {
            console.warn('Audio no disponible:', e);
        }
    }

    /**
     * Mostrar notificación toast y reproducir sonido
     */
    showNotification(message, type = 'info', isGlobal = false) {
        if (!this.notificationToast) return;
        this.playSound(type === 'success' ? 'success' : 'info', isGlobal);
        let icon = '';
        switch (type) {
            case 'success': icon = '✅'; break;
            case 'error': icon = '❌'; break;
            case 'warning': icon = '⚠️'; break;
            case 'info': icon = 'ℹ️'; break;
        }
        this.notificationToast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
        this.notificationToast.className = 'toast ' + type + ' show';
        setTimeout(() => this.notificationToast.classList.remove('show'), 3000);
    }
}

export default UIManager;
