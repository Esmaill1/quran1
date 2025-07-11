// Audio Player Controller
class RelaxRadioPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.statusDot = document.querySelector('.status-dot');
        this.statusText = document.querySelector('.status-text');
        this.currentTimeElement = document.querySelector('.current-time');
        this.visualizerCanvas = document.getElementById('visualizer');
        this.visualizerCtx = this.visualizerCanvas ? this.visualizerCanvas.getContext('2d') : null;
        this.animationId = null;
        this.isPlaying = false;
        this.isLoading = false;
        this.visualizerData = [];
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Audio event listeners
        this.audio.addEventListener('loadstart', () => this.updateStatus('جاري التحميل...', 'loading'));
        this.audio.addEventListener('canplay', () => this.updateStatus('جاهز للبث', 'ready'));
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('error', (e) => this.onError(e));
        this.audio.addEventListener('waiting', () => this.updateStatus('جاري التحميل...', 'loading'));
        this.audio.addEventListener('playing', () => this.updateStatus('البث المباشر', 'playing'));
        this.audio.addEventListener('stalled', () => this.updateStatus('انقطع الاتصال...', 'loading'));
        this.audio.addEventListener('suspend', () => this.updateStatus('متوقف مؤقتاً', 'ready'));
        
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
        
        // Try to autoplay (may be blocked by browser)
        this.tryAutoplay();
    }
    
    async tryAutoplay() {
        try {
            // Check if autoplay is allowed
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                await playPromise;
                // Autoplay succeeded
                this.isPlaying = true;
                this.updateUI();
            }
        } catch (error) {
            // Autoplay was prevented
            console.log('Autoplay prevented by browser');
            this.updateStatus('اضغط للبث', 'ready');
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    async play() {
        try {
            this.isLoading = true;
            this.updateStatus('جاري التحميل...', 'loading');
            this.playPauseBtn.classList.add('loading');
            
            await this.audio.play();
            this.isPlaying = true;
            this.isLoading = false;
            this.updateUI();
            
            // Start visualizer after successful play
            setTimeout(() => {
                this.startVisualizer();
            }, 500);
            
        } catch (error) {
            console.error('Error playing audio:', error);
            this.isLoading = false;
            this.onError(error);
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
        this.stopVisualizer();
    }
    
    onPlay() {
        this.isPlaying = true;
        this.isLoading = false;
        this.updateUI();
        this.updateStatus('البث المباشر', 'playing');
    }
    
    onPause() {
        this.isPlaying = false;
        this.updateUI();
        this.updateStatus('متوقف مؤقتاً', 'ready');
        this.stopVisualizer();
    }
    
    onError(error) {
        console.error('Audio error:', error);
        this.isPlaying = false;
        this.isLoading = false;
        this.updateUI();
        this.updateStatus('خطأ في تحميل البث', 'error');
        this.stopVisualizer();
    }
    
    updateUI() {
        // Remove loading class
        this.playPauseBtn.classList.remove('loading');
        
        // Update button state
        if (this.isPlaying) {
            this.playPauseBtn.classList.add('playing');
        } else {
            this.playPauseBtn.classList.remove('playing');
        }
    }
    
    updateStatus(text, state) {
        this.statusText.textContent = text;
        
        // Update status dot
        this.statusDot.className = 'status-dot';
        if (state === 'loading') {
            this.statusDot.classList.add('loading');
        } else if (state === 'playing') {
            this.statusDot.classList.add('playing');
        } else if (state === 'error') {
            this.statusDot.classList.add('error');
        }
    }
    
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        if (this.currentTimeElement) {
            this.currentTimeElement.textContent = timeString;
        }
    }
    
    startVisualizer() {
        if (!this.visualizerCanvas || !this.visualizerCtx) return;
        
        try {
            // Set canvas size for device pixel ratio
            const dpr = window.devicePixelRatio || 1;
            const width = this.visualizerCanvas.offsetWidth;
            const height = this.visualizerCanvas.offsetHeight;
            this.visualizerCanvas.width = width * dpr;
            this.visualizerCanvas.height = height * dpr;
            this.visualizerCtx.setTransform(1, 0, 0, 1, 0, 0);
            this.visualizerCtx.scale(dpr, dpr);
            
            // Initialize visualizer data
            this.visualizerData = Array(32).fill(0).map(() => Math.random() * 0.3);
            
            this.drawVisualizer();
            
        } catch (error) {
            console.error('Visualizer setup error:', error);
        }
    }
    
    stopVisualizer() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.visualizerCanvas && this.visualizerCtx) {
            this.visualizerCtx.clearRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
        }
    }
    
    drawVisualizer() {
        if (!this.isPlaying || !this.visualizerCanvas || !this.visualizerCtx) {
            this.stopVisualizer();
            return;
        }
        
        const ctx = this.visualizerCtx;
        const canvas = this.visualizerCanvas;
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);
        
        ctx.clearRect(0, 0, width, height);
        
        // Update visualizer data with smooth animation
        for (let i = 0; i < this.visualizerData.length; i++) {
            // Add some randomness and smooth transitions
            this.visualizerData[i] += (Math.random() - 0.5) * 0.1;
            this.visualizerData[i] = Math.max(0.1, Math.min(0.8, this.visualizerData[i]));
            
            // Add some correlation between adjacent bars
            if (i > 0) {
                this.visualizerData[i] = this.visualizerData[i] * 0.7 + this.visualizerData[i-1] * 0.3;
            }
        }
        
        // Draw soft pastel bars
        const barWidth = width / this.visualizerData.length;
        for (let i = 0; i < this.visualizerData.length; i++) {
            const value = this.visualizerData[i];
            const barHeight = value * height * 0.8;
            const x = i * barWidth;
            
            // Pastel gradient for bars
            const gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
            gradient.addColorStop(0, '#a7bfff');
            gradient.addColorStop(0.5, '#f3c6ff');
            gradient.addColorStop(1, '#fbc2eb');
            
            ctx.fillStyle = gradient;
            ctx.shadowColor = 'rgba(102,126,234,0.15)';
            ctx.shadowBlur = 8;
            ctx.fillRect(x + 2, height - barHeight, barWidth - 4, barHeight);
        }
        
        this.animationId = requestAnimationFrame(() => this.drawVisualizer());
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RelaxRadioPlayer();
});

// Add some nice hover effects
document.addEventListener('DOMContentLoaded', () => {
    const playerCard = document.querySelector('.player-card');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    
    // Add subtle hover effect to the entire card
    if (playerCard) {
        playerCard.addEventListener('mouseenter', () => {
            playerCard.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        playerCard.addEventListener('mouseleave', () => {
            playerCard.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Add ripple effect to play button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = (e.clientX - playPauseBtn.offsetLeft) + 'px';
            ripple.style.top = (e.clientY - playPauseBtn.offsetTop) + 'px';
            ripple.style.width = ripple.style.height = '20px';
            
            playPauseBtn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 