import Phaser from 'phaser';

// Import submodules
import { initGameState, cleanupGameObjects } from './initGameState.js';
import { createTopUI, createBottomUI, updateTimer } from './uiManager.js';
import { createGrid, displayAnswers } from './gridManager.js';
import { createMuncher, handleMuncherMovement, eatCurrentTile } from './muncherManager.js';
import { spawnEnemy, checkEnemyCollisions } from './enemyManager.js';
import { getLevelData, setupLevel } from './levelManager.js';
import { showLevelCompleteEffect } from './transitions.js';
import { PowerUpManager } from './powerUpManager.js';
import { AchievementManager } from './achievementManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        // Clean up any previous objects if scene restarts
        cleanupGameObjects(this);

        // Initialize fresh game state
        initGameState(this);

        this.currentLevel = getLevelData(this);
        
        // Set up camera and UI
        this.cameras.main.setBackgroundColor('#000000');
        createTopUI(this);
        createGrid(this);
        createBottomUI(this);

        // Prepare level data
        
        displayAnswers(this, this.currentLevel);

        // Set up Muncher (player)
        createMuncher(this);

        // Setup level difficulty (enemies, timers, etc.)
        setupLevel(this);

        // Input and control setup
        this.setupControls();

        // Start main game loop
        this.startGameLoop();

        // PowerUp and Achievement Managers (if needed)
        this.powerUpManager = new PowerUpManager(this);
        this.achievementManager = new AchievementManager();
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => this.togglePause());
    }

    startGameLoop() {
        // Main game timer event
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => updateTimer(this),
            loop: true
        });
    }

    togglePause() {
        this.isGamePaused = !this.isGamePaused;

        if (this.isGamePaused) {
            // Show pause overlay
            const pauseOverlay = this.add.rectangle(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.7
            );
            
            const pauseText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 50,
                'PAUSED',
                { font: 'bold 48px Arial', fill: '#ffffff' }
            ).setOrigin(0.5);
            
            const resumeText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 50,
                'Press PAUSE to resume',
                { font: '24px Arial', fill: '#ffffff' }
            ).setOrigin(0.5);
            
            this.pauseMenu = { pauseOverlay, pauseText, resumeText };
        } else {
            // Remove pause overlay
            if (this.pauseMenu) {
                Object.values(this.pauseMenu).forEach(el => el.destroy());
                this.pauseMenu = null;
            }
        }
    }

    update() {
        if (!this.currentLevel || this.isGamePaused || this.isLevelComplete || this.isTransitioning) return;

        handleMuncherMovement(this);
        checkEnemyCollisions(this);

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            eatCurrentTile(this, showLevelCompleteEffect);
        }
    }
}
