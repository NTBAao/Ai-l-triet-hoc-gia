/**
 * AI LÀ TRIẾT HỌC GIA - WEB AUDIO SYNTHESIZER ENGINE
 * Generates authentic TV game show sound effects dynamically using Web Audio API
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.heartbeatInterval = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopSuspense();
        }
        return this.enabled;
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.08);
        } catch (e) {}
    }

    playStart() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            // Dramatic gong / start chime
            const notes = [220, 330, 440, 660];
            notes.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.08);

                gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.6);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(this.ctx.currentTime + idx * 0.08);
                osc.stop(this.ctx.currentTime + idx * 0.08 + 0.6);
            });
        } catch (e) {}
    }

    playTick() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch (e) {}
    }

    playSelect() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        } catch (e) {}
    }

    playLockIn() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            // Dramatic tension riser
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(360, this.ctx.currentTime + 1.2);

            gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 1.2);
        } catch (e) {}
    }

    playCorrect() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;

                const startTime = this.ctx.currentTime + idx * 0.1;
                gain.gain.setValueAtTime(0.01, startTime);
                gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.8);
            });
        } catch (e) {}
    }

    playWrong() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(130, this.ctx.currentTime);
            osc.frequency.setValueAtTime(115, this.ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.8);
        } catch (e) {}
    }

    playLifeline() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.4);
        } catch (e) {}
    }

    playVictory() {
        if (!this.enabled) return;
        this.init();
        try {
            if (!this.ctx) return;
            const fanfare = [
                { f: 523.25, d: 0.2, t: 0 },
                { f: 523.25, d: 0.2, t: 0.2 },
                { f: 523.25, d: 0.2, t: 0.4 },
                { f: 659.25, d: 0.4, t: 0.6 },
                { f: 783.99, d: 0.3, t: 1.0 },
                { f: 1046.50, d: 1.2, t: 1.3 }
            ];

            fanfare.forEach(item => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.value = item.f;

                const start = this.ctx.currentTime + item.t;
                gain.gain.setValueAtTime(0.2, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + item.d);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(start);
                osc.stop(start + item.d);
            });
        } catch (e) {}
    }

    playSuspense() {
        this.startSuspense();
    }

    startSuspense() {
        if (!this.enabled) return;
        this.stopSuspense();
        this.init();
        this.heartbeatInterval = setInterval(() => {
            if (!this.enabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(65, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.18);
            } catch (e) {}
        }, 1200);
    }

    stopSuspense() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
}

// Proxy wrapper so any non-existent audio call never crashes
const rawAudio = new SoundEngine();
const AudioSys = new Proxy(rawAudio, {
    get(target, prop) {
        if (prop in target) {
            const val = target[prop];
            if (typeof val === 'function') {
                return val.bind(target);
            }
            return val;
        }
        // Safe no-op function for unknown methods
        return () => {};
    }
});
