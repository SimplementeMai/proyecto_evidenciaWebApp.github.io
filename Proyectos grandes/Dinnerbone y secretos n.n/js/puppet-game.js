/**
 * Módulo de Juego: Atrapa a Puppet
 * Maneja la lógica del mini-juego secreto, puntuaciones y persistencia.
 */

export class PuppetGameManager {
    constructor(uiManager, audioManager, achievementManager) {
        this.uiManager = uiManager;
        this.audioManager = audioManager;
        this.achievementManager = achievementManager;
        this.puppetContainer = document.getElementById('puppet-container');
        this.puppetImage = document.getElementById('puppet-image');
        this.storageKey = 'puppet_game_scores';
        
        // El PuppetDialogueManager se asignará después de la inicialización en main.js
        this.dialogueManager = null;

        // Audio de fondo (Nyan Cat Loop)
        this.loopAudio = new Audio('audio/game_loop.mp3');
        this.loopAudio.loop = true;
        this.audioManager.registerAudio(this.loopAudio, 0.2);

        // Audio de fallo
        this.failAudio = new Audio('audio/game_fail.mp3');
        this.audioManager.registerAudio(this.failAudio, 0.4);

        // Audio de victoria
        this.winAudio = new Audio('audio/game_win.mp3');
        this.audioManager.registerAudio(this.winAudio, 0.4);

        this.gameState = {
            isActive: false,
            clicks: 0,
            startTime: 0,
            timerId: null,
            animationId: null,
            timeLeft: 120
        };
        
        // Cargar o inicializar puntuaciones (JSON)
        this.scores = this.loadScores();
        this.initUI();
    }

    setDialogueManager(manager) {
        this.dialogueManager = manager;
    }

    loadScores() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            totalCompletions: 0,
            bestTime: Infinity,
            maxClicks: 5,
            history: []
        };
    }

    saveScores() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
        this.updateStatsDisplay();
    }

    initUI() {
        if (!document.getElementById('puppet-stats-panel')) {
            const statsPanel = document.createElement('div');
            statsPanel.id = 'puppet-stats-panel';
            statsPanel.className = 'hidden';
            statsPanel.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: rgba(13, 13, 26, 0.9);
                border: 2px solid var(--color-primary);
                border-radius: var(--radius-lg);
                padding: 15px;
                color: white;
                font-family: monospace;
                z-index: 10003;
                box-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
                pointer-events: none;
                transition: opacity 0.5s ease;
            `;
            document.body.appendChild(statsPanel);
        }
        this.updateStatsDisplay();
    }

    updateStatsDisplay(currentTime = null) {
        const panel = document.getElementById('puppet-stats-panel');
        if (!panel) return;

        const bestTimeStr = this.scores.bestTime === Infinity ? 'N/A' : `${this.scores.bestTime.toFixed(2)}s`;
        
        panel.innerHTML = `
            <h4 style="color: var(--color-primary); margin: 0 0 10px 0; border-bottom: 1px solid #444;">📊 PUPPET STATS</h4>
            <div style="font-size: 0.9em; line-height: 1.6;">
                <p>⏱️ Tiempo Actual: <span style="color: var(--color-secondary);">${currentTime ? currentTime.toFixed(2) + 's' : '0.00s'}</span></p>
                <p>🏆 Mejor Tiempo: <span style="color: var(--color-success);">${bestTimeStr}</span></p>
                <p>🎯 Completados: <span style="color: var(--color-warning);">${this.scores.totalCompletions}</span></p>
                <p>📍 Objetivo: <span style="color: var(--color-primary-light);">5 Clics</span></p>
            </div>
        `;
    }

    resetScores() {
        this.scores = {
            totalCompletions: 0,
            bestTime: Infinity,
            maxClicks: 5,
            history: []
        };
        this.saveScores();
        this.uiManager.showNotification('Estadísticas del juego reiniciadas.', 'info');
    }

    startGame() {
        if (this.gameState.isActive || !this.puppetContainer) return;
        
        this.uiManager.showNotification('¡Protocolo PUPPET-101 iniciado! Atrapa a Puppet 5 veces.', 'info', true);
        this.uiManager.playSound('random', true);
        
        // Notificar al gestor de diálogos
        this.dialogueManager?.setGameState(true);

        // LOGICA CONDICIONAL DE AUDIO (Regla: Noir = Tranquilidad, Normal = Nyan Cat)
        if (!this.audioManager.isMuted) {
            // Solo en modo normal suspendemos la música alegre y ponemos el Nyan Cat
            this.audioManager.suspendMusic();
            this.loopAudio.currentTime = 0;
            this.audioManager.playManagedAudio(this.loopAudio, true);
        } else {
            // En modo Noir, NO suspendemos la música (así el piano sigue sonando)
            // Y NO reproducimos el loopAudio (Nyan Cat) para mantener la calma
            console.log('Manteniendo atmósfera Noir durante el juego...');
        }

        // Reset state
        this.gameState = {
            isActive: true,
            clicks: 0,
            startTime: performance.now(),
            timeLeft: 120,
            originalStyle: this.puppetContainer.style.cssText
        };

        document.getElementById('puppet-stats-panel')?.classList.remove('hidden');
        this.createTimerDisplay();

        const speedFactor = 1.2; 
        let posX = window.innerWidth / 2;
        let posY = window.innerHeight / 2;
        let velX = (Math.random() > 0.5 ? 4 : -4) * speedFactor; 
        let velY = (Math.random() > 0.5 ? 4 : -4) * speedFactor;

        this.puppetContainer.style.transition = 'none';
        this.puppetContainer.style.zIndex = '20000';
        this.puppetContainer.style.cursor = 'crosshair';
        this.puppetContainer.style.position = 'fixed';
        this.puppetContainer.style.padding = '25px'; 
        this.puppetContainer.style.right = 'auto'; 
        this.puppetContainer.style.bottom = 'auto';

        const updatePosition = () => {
            if (!this.gameState.isActive) return;

            posX += velX;
            posY += velY;

            if (posX <= 0 || posX >= window.innerWidth - 150) {
                velX *= -1;
                posX = Math.max(0, Math.min(posX, window.innerWidth - 150));
            }

            if (posY <= 0 || posY >= window.innerHeight - 150) {
                velY *= -1;
                posY = Math.max(0, Math.min(posY, window.innerHeight - 150));
            }

            this.puppetContainer.style.left = `${posX}px`;
            this.puppetContainer.style.top = `${posY}px`;

            const currentElapsed = (performance.now() - this.gameState.startTime) / 1000;
            this.updateStatsDisplay(currentElapsed);

            this.gameState.animationId = requestAnimationFrame(updatePosition);
        };

        this.handleGameClick = (e) => {
            e.stopPropagation();
            this.gameState.clicks++;
            this.uiManager.playSound('success', false);
            this.uiManager.showNotification(`¡Impacto! (${this.gameState.clicks}/5)`, 'success', false);
            
            velX *= 1.50; 
            velY *= 1.50;

            if (this.gameState.clicks >= 5) {
                this.winGame();
            }
        };

        this.puppetContainer.addEventListener('click', this.handleGameClick);
        this.gameState.animationId = requestAnimationFrame(updatePosition);
        
        this.gameState.timerId = setInterval(() => {
            this.gameState.timeLeft--;
            const timerDisplay = document.getElementById('puppet-game-timer');
            if (timerDisplay) {
                timerDisplay.textContent = `TIEMPO: ${this.gameState.timeLeft}s`;
                if (this.gameState.timeLeft <= 10) {
                    timerDisplay.style.color = 'var(--color-danger)';
                    timerDisplay.style.boxShadow = '0 0 30px var(--color-danger)';
                }
            }
            if (this.gameState.timeLeft <= 0) this.failGame();
        }, 1000);
    }

    createTimerDisplay() {
        if (document.getElementById('puppet-game-timer')) return;
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'puppet-game-timer';
        timerDisplay.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85); color: var(--color-primary);
            padding: 10px 40px; border-radius: 50px; border: 2px solid var(--color-primary);
            font-family: 'Courier New', monospace; font-size: 2.2em; font-weight: bold;
            z-index: 20001; box-shadow: 0 0 25px var(--color-primary);
            pointer-events: none; letter-spacing: 3px;
        `;
        document.body.appendChild(timerDisplay);
    }

    winGame() {
        const timeTaken = (performance.now() - this.gameState.startTime) / 1000;
        this.scores.totalCompletions++;
        
        // Logros de Juego
        this.achievementManager?.unlock('win_puppet');
        if (timeTaken < 15) this.achievementManager?.unlock('fast_win');
        if (timeTaken < 8) this.achievementManager?.unlock('lightning_win');
        if (this.scores.totalCompletions >= 5) this.achievementManager?.unlock('puppet_master');

        if (timeTaken < this.scores.bestTime) {
            this.scores.bestTime = timeTaken;
            this.uiManager.showNotification('¡NUEVO RÉCORD DE TIEMPO! 🏆', 'success', true);
        }
        this.scores.history.push({ date: new Date().toISOString(), time: timeTaken, clicks: this.gameState.clicks });
        this.saveScores();
        this.cleanup();
        this.audioManager.playManagedAudio(this.winAudio);
        this.uiManager.showNotification(`¡Victoria! Tiempo: ${timeTaken.toFixed(2)}s`, 'success', true);
        this.uiManager.playSound('success', true);
        const textarea = document.getElementById('manual-data');
        if (textarea && textarea.value === 'PUPPET-101') textarea.value = '';
    }

    failGame() {
        this.cleanup();
        this.audioManager.playManagedAudio(this.failAudio);
        this.uiManager.showNotification('¡Se acabó el tiempo! Puppet ha escapado... 🙃', 'warning', true);
        this.uiManager.playSound('clear', true);
    }

    cleanup() {
        this.gameState.isActive = false;
        cancelAnimationFrame(this.gameState.animationId);
        clearInterval(this.gameState.timerId);
        this.audioManager.pauseManagedAudio(this.loopAudio);
        this.loopAudio.currentTime = 0;

        // REANUDAR MUSICA DE FONDO (ALEGRE/NOIR)
        this.audioManager.resumeMusic();

        // Notificar al gestor de diálogos el fin del juego
        this.dialogueManager?.setGameState(false);

        if (this.puppetContainer) {
            this.puppetContainer.removeEventListener('click', this.handleGameClick);
            this.puppetContainer.style.cssText = this.gameState.originalStyle;
        }
        
        document.getElementById('puppet-game-timer')?.remove();
        setTimeout(() => {
            if (!this.gameState.isActive) document.getElementById('puppet-stats-panel')?.classList.add('hidden');
        }, 5000);
    }
}

export default PuppetGameManager;
