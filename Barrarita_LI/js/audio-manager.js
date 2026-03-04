/**
 * MANAGER DE AUDIO
 * Centraliza la gestión de todos los elementos de audio HTML5 (<audio>)
 * Permite mutear/desmutear globalmente y controlar el volumen.
 */
export class AudioManager {
    constructor(achievementManager) {
        this.achievementManager = achievementManager;
        this.isMuted = localStorage.getItem('isMuted') === 'true';
        this.isMusicEnabled = localStorage.getItem('isMusicEnabled') !== 'false'; 
        this.audioElements = []; 
        this.muteButton = document.getElementById('mute-audio-btn');
        this.musicButton = document.getElementById('toggle-music-btn');
        
        // Sistema de Audio Dual (Alegre vs Noir)
        this.audioCtx = null;
        this.masterGain = null;
        this.currentLoopActive = false;
        this.sequenceTimer = null;
        this.activeClima = null; // 'alegre' o 'noir'
        this.isSuspended = false; // Flag para suspensión temporal (Juegos, etc.)

        this.init();
    }

    init() {
        if (this.muteButton) {
            this.muteButton.addEventListener('click', () => this.toggleMute());
            this.updateMuteState(this.isMuted); 
            this.updateMuteButtonUI();
        }

        if (this.musicButton) {
            this.musicButton.addEventListener('click', () => this.toggleMusic());
            this.updateMusicButtonUI();
        }
    }

    /**
     * Suspende temporalmente la música sintética (para juegos, etc.)
     */
    suspendMusic() {
        this.isSuspended = true;
        this.stopMusicLoop();
    }

    /**
     * Reanuda la música sintética tras una suspensión
     */
    resumeMusic() {
        this.isSuspended = false;
        if (this.isMusicEnabled) {
            this.updateMuteState(this.isMuted);
        }
    }

    initSynth() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.connect(this.audioCtx.destination);
            this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        }
    }

    /**
     * Sintetiza una nota con estilo diferente según el clima
     */
    playSynthNote(freq, startTime, type = 'piano', duration = 2.0) {
        if (!this.audioCtx || this.isSuspended) return; // No sonar si está suspendido
        
        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();
        
        if (type === 'alegre') {
            osc.type = 'sine'; 
            noteGain.gain.setValueAtTime(0, startTime);
            noteGain.gain.linearRampToValueAtTime(0.1, startTime + 0.1); 
            noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        } else {
            osc.type = 'triangle'; 
            noteGain.gain.setValueAtTime(0, startTime);
            noteGain.gain.linearRampToValueAtTime(0.15, startTime + 0.01); 
            noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        }
        
        osc.frequency.setValueAtTime(freq, startTime);
        osc.connect(noteGain);
        noteGain.connect(this.masterGain);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    /**
     * Inicia el bucle musical según el estado actual
     */
    startMusicLoop(clima) {
        if (!this.isMusicEnabled || this.isSuspended) return;
        this.initSynth();
        
        if (this.currentLoopActive && this.activeClima === clima) return;
        
        this.stopMusicLoop(); 
        this.currentLoopActive = true;
        this.activeClima = clima;

        this.masterGain.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 1.5);

        const CLIMAS = {
            alegre: {
                loopDuration: 6.0,
                melody: [
                    [261.63, 0], [329.63, 0.5], [392.00, 1.0], [493.88, 1.5],
                    [349.23, 3.0], [440.00, 3.5], [523.25, 4.0], [659.25, 4.5]
                ]
            },
            noir: {
                loopDuration: 8.0,
                melody: [
                    [110.00, 0], [220.00, 0.5], [261.63, 1.0], [164.81, 1.5],
                    [110.00, 2.5], [220.00, 3.0], [246.94, 3.5], [196.00, 4.0]
                ]
            }
        };

        const config = CLIMAS[clima];
        
        const playLoop = () => {
            if (!this.currentLoopActive || this.activeClima !== clima || this.isSuspended) return;
            const now = this.audioCtx.currentTime;
            
            config.melody.forEach(([freq, time]) => {
                this.playSynthNote(freq, now + time, clima);
            });

            this.sequenceTimer = setTimeout(playLoop, config.loopDuration * 1000);
        };

        playLoop();
        if (clima === 'noir') this.startVinylHiss();
    }

    startVinylHiss() {
        if (!this.audioCtx) return;
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * 0.004;
        this.hissSource = this.audioCtx.createBufferSource();
        this.hissSource.buffer = buffer;
        this.hissSource.loop = true;
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800; 
        this.hissSource.connect(filter);
        filter.connect(this.masterGain);
        this.hissSource.start();
    }

    stopMusicLoop() {
        this.currentLoopActive = false;
        if (this.sequenceTimer) clearTimeout(this.sequenceTimer);
        if (this.masterGain) this.masterGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 1);
        if (this.hissSource) {
            try { this.hissSource.stop(this.audioCtx.currentTime + 1); } catch(e) {}
        }
    }

    toggleMusic() {
        this.isMusicEnabled = !this.isMusicEnabled;
        localStorage.setItem('isMusicEnabled', this.isMusicEnabled);
        this.updateMusicButtonUI();
        this.updateMuteState(this.isMuted); // Re-evaluar estado
    }

    updateMusicButtonUI() {
        if (this.musicButton) {
            this.musicButton.innerHTML = this.isMusicEnabled ? '🎵 Música: ON' : '🎵 Música: OFF';
            this.musicButton.style.opacity = this.isMusicEnabled ? '1' : '0.6';
        }
    }

    /**
     * Registra un elemento de audio para que sea gestionado por el AudioManager.
     */
    registerAudio(audio, initialVolume) {
        audio.dataset.initialVolume = initialVolume;
        audio.volume = this.isMuted ? 0 : initialVolume;
        this.audioElements.push(audio);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('isMuted', this.isMuted);
        this.updateMuteState(this.isMuted);
        this.updateMuteButtonUI();
        if (this.isMuted) this.achievementManager?.unlock('mute_audio');
    }

    updateMuteState(isMuted) {
        const root = document.documentElement;
        
        if (isMuted) {
            // ESTADO NOIR
            root.classList.add('silent-mode-active');
            if (this.isMusicEnabled) this.startMusicLoop('noir');
            else this.stopMusicLoop();
            
            this.audioElements.forEach(audio => {
                audio.volume = 0;
                audio.pause();
            });
        } else {
            // ESTADO NORMAL (ALEGRE)
            root.classList.remove('silent-mode-active');
            if (this.isMusicEnabled) this.startMusicLoop('alegre');
            else this.stopMusicLoop();

            this.audioElements.forEach(audio => {
                audio.volume = parseFloat(audio.dataset.initialVolume);
                if (audio.loop && audio.paused && audio.dataset.wasPlaying === 'true') {
                    audio.play().catch(e => console.warn('Error al reanudar audio:', e));
                }
            });
        }
    }

    updateMuteButtonUI() {
        if (this.muteButton) {
            this.muteButton.innerHTML = this.isMuted ? '🔇 Audio: Silenciado' : '🔊 Audio: Activado';
        }
    }

    updateAudioVolumes() {
        // Redirigimos a la lógica centralizada
        this.updateMuteState(this.isMuted);
    }

    updateMuteButtonUI() {
        if (this.muteButton) {
            this.muteButton.innerHTML = this.isMuted ? '🔇 Audio: Silenciado' : '🔊 Audio: Activado';
        }
    }

    /**
     * Reproduce un audio, respetando el estado de muteo.
     * @param {HTMLAudioElement} audio - El elemento de audio a reproducir.
     * @param {boolean} loop - Si el audio debe reproducirse en bucle.
     */
    playManagedAudio(audio, loop = false) {
        if (this.isMuted) {
            audio.dataset.wasPlaying = 'true'; 
            return;
        }
        audio.loop = loop;
        audio.play().catch(e => {
            console.warn('Autoplay bloqueado o error de reproducción. Reintentando al primer clic.');
            const playOnClick = () => {
                if (!this.isMuted) audio.play();
                document.removeEventListener('click', playOnClick);
            };
            document.addEventListener('click', playOnClick);
        });
        audio.dataset.wasPlaying = 'true';
    }

    /**
     * Pausa un audio gestionado.
     * @param {HTMLAudioElement} audio - El elemento de audio a pausar.
     */
    pauseManagedAudio(audio) {
        audio.pause();
        audio.dataset.wasPlaying = 'false';
    }
}

export default AudioManager;
