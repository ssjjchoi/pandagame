class PandaGame {
    constructor() {
        this.gameArea = document.querySelector('.game-area');
        this.panda = document.getElementById('panda');
        this.food = document.getElementById('food');
        this.obstacle = document.getElementById('obstacle');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        
        this.gameState = {
            isRunning: false,
            isPaused: false,
            score: 0,
            lives: 3,
            level: 1,
            speed: 0.5
        };
        
        this.pandaPosition = {
            x: 50,
            y: 50
        };
        
        this.foodPosition = {
            x: 0,
            y: 0
        };
        
        this.obstaclePosition = {
            x: 0,
            y: 0
        };
        
        this.keys = {};
        this.gameLoop = null;
        this.lastObstacleHitTime = 0; // 중복 충돌 방지용
        this.hitCooldown = 1000; // 1초 동안 충돌 무시
        
        // AudioContext 초기화 (한 번만 생성)
        this.audioContext = null;
        this.initAudioContext();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.spawnFood();
        this.spawnObstacle();
        this.updateDisplay();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API를 지원하지 않는 브라우저입니다.', e);
            this.audioContext = null;
        }
    }
    
    getAudioContext() {
        if (!this.audioContext) {
            this.initAudioContext();
        }
        
        // AudioContext가 suspended 상태면 resume
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(e => {
                console.warn('AudioContext resume 실패:', e);
            });
        }
        
        return this.audioContext;
    }
    
    setupEventListeners() {
        // 키보드 이벤트 (화면 스크롤 방지)
        document.addEventListener('keydown', (e) => {
            // 방향키와 WASD 키의 기본 동작 방지
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.keys[e.key.toLowerCase()] = true;
            this.handleMovement();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // 버튼 이벤트
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.resetGame());
        
        // 터치 이벤트 (모바일)
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.gameArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.gameArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!this.gameState.isRunning) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // 좌우 이동
                if (deltaX > 30) {
                    this.movePanda('right');
                } else if (deltaX < -30) {
                    this.movePanda('left');
                }
            } else {
                // 상하 이동
                if (deltaY > 30) {
                    this.movePanda('down');
                } else if (deltaY < -30) {
                    this.movePanda('up');
                }
            }
        });
    }
    
    handleMovement() {
        if (!this.gameState.isRunning || this.gameState.isPaused) return;
        
        if (this.keys['arrowup'] || this.keys['w']) {
            this.movePanda('up');
        }
        if (this.keys['arrowdown'] || this.keys['s']) {
            this.movePanda('down');
        }
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.movePanda('left');
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.movePanda('right');
        }
    }
    
    movePanda(direction) {
        const moveDistance = 25;
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const pandaSize = 100;
        
        switch (direction) {
            case 'up':
                this.pandaPosition.y = Math.max(0, this.pandaPosition.y - moveDistance);
                break;
            case 'down':
                this.pandaPosition.y = Math.min(gameAreaRect.height - pandaSize, this.pandaPosition.y + moveDistance);
                break;
            case 'left':
                this.pandaPosition.x = Math.max(0, this.pandaPosition.x - moveDistance);
                break;
            case 'right':
                this.pandaPosition.x = Math.min(gameAreaRect.width - pandaSize, this.pandaPosition.x + moveDistance);
                break;
        }
        
        this.updatePandaPosition();
        this.addPandaMovementEffect(direction);
    }
    
    addPandaMovementEffect(direction) {
        // 판다 움직임에 따른 시각적 효과
        this.panda.style.transform = `translateY(-50%) scale(1.1)`;
        setTimeout(() => {
            this.panda.style.transform = `translateY(-50%) scale(1)`;
        }, 150);
    }
    
    updatePandaPosition() {
        this.panda.style.left = this.pandaPosition.x + 'px';
        this.panda.style.top = this.pandaPosition.y + 'px';
    }
    
    startGame() {
        // AudioContext 활성화 (사용자 상호작용 후)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(e => {
                console.warn('AudioContext resume 실패:', e);
            });
        }
        
        this.gameState.isRunning = true;
        this.gameState.isPaused = false;
        this.startGameLoop();
        this.showMessage('게임 시작! 🐼');
    }
    
    togglePause() {
        if (!this.gameState.isRunning) return;
        
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.gameState.isPaused) {
            clearInterval(this.gameLoop);
            this.showMessage('일시정지 ⏸️');
        } else {
            this.startGameLoop();
            this.showMessage('게임 재개! ▶️');
        }
    }
    
    resetGame() {
        this.gameState = {
            isRunning: false,
            isPaused: false,
            score: 0,
            lives: 3,
            level: 1,
            speed: 0.5
        };
        
        this.pandaPosition = { x: 50, y: 50 };
        this.lastObstacleHitTime = 0; // 충돌 쿨다운 리셋
        this.updatePandaPosition();
        this.spawnFood();
        this.spawnObstacle();
        this.updateDisplay();
        this.hideGameOver();
        this.showMessage('게임 리셋! 🔄');
    }
    
    startGameLoop() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        
        this.gameLoop = setInterval(() => {
            if (!this.gameState.isPaused) {
                this.updateGame();
            }
        }, 1000 / 60); // 60 FPS
    }
    
    updateGame() {
        this.moveObstacle();
        this.checkCollisions();
        this.updateDisplay();
    }
    
    moveObstacle() {
        const obstacle = this.obstacle;
        // 현재 위치를 정확히 가져오기
        let currentLeft = this.obstaclePosition.x;
        if (obstacle.style.left) {
            const parsed = parseInt(obstacle.style.left);
            if (!isNaN(parsed)) {
                currentLeft = parsed;
            }
        }
        
        const newLeft = currentLeft - this.gameState.speed;
        
        // obstaclePosition도 함께 업데이트 (충돌 검사를 위해)
        this.obstaclePosition.x = newLeft;
        obstacle.style.left = newLeft + 'px';
        
        // 장애물이 화면을 벗어나면 다시 생성
        if (newLeft < -50) {
            this.spawnObstacle();
        }
    }
    
    spawnFood() {
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const foodSize = 30;
        
        this.foodPosition.x = Math.random() * (gameAreaRect.width - foodSize);
        this.foodPosition.y = Math.random() * (gameAreaRect.height - foodSize);
        
        this.food.style.left = this.foodPosition.x + 'px';
        this.food.style.top = this.foodPosition.y + 'px';
    }
    
    spawnObstacle() {
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const obstacleSize = 30; // 이모지 크기에 맞춤
        
        this.obstaclePosition.x = gameAreaRect.width + 50;
        this.obstaclePosition.y = Math.random() * (gameAreaRect.height - obstacleSize);
        
        this.obstacle.style.left = this.obstaclePosition.x + 'px';
        this.obstacle.style.top = this.obstaclePosition.y + 'px';
    }
    
    checkCollisions() {
        // 판다와 먹이 충돌 검사
        if (this.checkCollision(this.pandaPosition, this.foodPosition, 80, 30)) {
            this.eatFood();
        }
        
        // 판다와 장애물 충돌 검사 (쿨다운 체크)
        const now = Date.now();
        if (now - this.lastObstacleHitTime > this.hitCooldown) {
            if (this.checkCollision(this.pandaPosition, this.obstaclePosition, 80, 30)) {
                this.hitObstacle();
                this.lastObstacleHitTime = now;
            }
        }
    }
    
    checkCollision(pos1, pos2, size1, size2) {
        return pos1.x < pos2.x + size2 &&
               pos1.x + size1 > pos2.x &&
               pos1.y < pos2.y + size2 &&
               pos1.y + size1 > pos2.y;
    }
    
    eatFood() {
        this.gameState.score += 10;
        this.showMessage('맛있어! 🎋');
        this.playSound('eat');
        this.addEatingEffect();
        this.spawnFood();
        
        // 레벨 업 체크
        if (this.gameState.score > 0 && this.gameState.score % 50 === 0) {
            this.levelUp();
        }
    }
    
    addEatingEffect() {
        // 먹기 효과 애니메이션
        this.panda.style.animation = 'none';
        this.panda.offsetHeight; // 강제 리플로우
        this.panda.style.animation = 'pandaBounce 0.5s ease-in-out';
        
        // 대나무 먹기 효과
        const food = this.food;
        food.style.transform = 'scale(1.5)';
        food.style.opacity = '0.5';
        setTimeout(() => {
            food.style.transform = 'scale(1)';
            food.style.opacity = '1';
        }, 300);
    }
    
    hitObstacle() {
        this.gameState.lives--;
        this.showMessage('우토우(영양빵)에 부딪혔다! 🍞💥');
        this.playSound('hit');
        this.addHitEffect();
        this.spawnObstacle();
        
        if (this.gameState.lives <= 0) {
            this.gameOver();
        }
    }
    
    addHitEffect() {
        // 충돌 효과 애니메이션
        this.panda.style.animation = 'none';
        this.panda.offsetHeight; // 강제 리플로우
        this.panda.style.animation = 'pandaHit 0.3s ease-in-out';
        
        // 화면 흔들림 효과
        document.body.style.animation = 'screenShake 0.3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = 'none';
        }, 300);
    }
    
    levelUp() {
        this.gameState.level++;
        this.gameState.speed += 0.2;
        this.showMessage(`레벨 ${this.gameState.level} 달성! 🎉`);
        this.playSound('levelup');
    }
    
    gameOver() {
        this.gameState.isRunning = false;
        clearInterval(this.gameLoop);
        this.playSound('gameover');
        this.showGameOver();
    }
    
    showGameOver() {
        this.finalScoreElement.textContent = this.gameState.score;
        this.gameOverElement.style.display = 'block';
    }
    
    hideGameOver() {
        this.gameOverElement.style.display = 'none';
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.gameState.score;
        this.livesElement.textContent = this.gameState.lives;
        this.levelElement.textContent = this.gameState.level;
    }
    
    showMessage(message) {
        // 간단한 메시지 표시 (실제로는 더 정교한 UI를 만들 수 있음)
        console.log(message);
        
        // 임시 메시지 표시
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 1000;
            font-size: 1.2em;
            animation: fadeOut 2s ease-in-out forwards;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 2000);
    }
    
    playSound(soundType) {
        // Web Audio API를 사용한 재미있는 효과음 생성
        const audioContext = this.getAudioContext();
        
        if (!audioContext) {
            return; // AudioContext를 사용할 수 없으면 종료
        }
        
        try {
            switch (soundType) {
                case 'eat':
                    // 사과 먹을 때 - 판다가 좋아하는 귀여운 소리 (상승하는 멜로디)
                    this.playPandaEatSound(audioContext);
                    break;
                case 'hit':
                    // 장애물 충돌 - 아픈 소리
                    this.playHitSound(audioContext);
                    break;
                case 'levelup':
                    // 레벨업 - 기쁜 축하 소리
                    this.playLevelUpSound(audioContext);
                    break;
                case 'gameover':
                    // 게임오버 - 슬픈 소리
                    this.playGameOverSound(audioContext);
                    break;
                default:
                    this.playDefaultSound(audioContext);
            }
        } catch (e) {
            console.warn('사운드 재생 실패:', e);
        }
    }
    
    playPandaEatSound(audioContext) {
        // 판다가 좋아하는 귀여운 소리 - 여러 톤 조합
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (도미솔)
        const duration = 0.15;
        const volume = 0.4;
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.05);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.05);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + index * 0.05 + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.05 + duration);
            
            oscillator.start(audioContext.currentTime + index * 0.05);
            oscillator.stop(audioContext.currentTime + index * 0.05 + duration);
        });
    }
    
    playHitSound(audioContext) {
        // 충돌 소리 - 낮은 톤의 불쾌한 소리
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'square';
        oscillator1.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(100, audioContext.currentTime);
        
        // 주파수 급격히 떨어지는 효과
        oscillator1.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.3);
        oscillator2.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.3);
        oscillator2.stop(audioContext.currentTime + 0.3);
    }
    
    playLevelUpSound(audioContext) {
        // 레벨업 축하 소리 - 상승하는 멜로디
        const notes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5
        const duration = 0.1;
        const volume = 0.5;
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.08);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.08);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + index * 0.08 + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.08 + duration);
            
            oscillator.start(audioContext.currentTime + index * 0.08);
            oscillator.stop(audioContext.currentTime + index * 0.08 + duration);
        });
    }
    
    playGameOverSound(audioContext) {
        // 게임오버 슬픈 소리 - 하강하는 멜로디
        const notes = [523.25, 440, 349.23, 261.63]; // C5, A4, F4, C4
        const duration = 0.2;
        const volume = 0.4;
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.15);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + index * 0.15 + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + duration);
            
            oscillator.start(audioContext.currentTime + index * 0.15);
            oscillator.stop(audioContext.currentTime + index * 0.15 + duration);
        });
    }
    
    playDefaultSound(audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
    
    @keyframes pandaHit {
        0%, 100% { transform: translateY(-50%) scale(1); }
        25% { transform: translateY(-50%) scale(0.9) rotate(-5deg); }
        75% { transform: translateY(-50%) scale(0.9) rotate(5deg); }
    }
    
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
`;
document.head.appendChild(style);

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new PandaGame();
});
