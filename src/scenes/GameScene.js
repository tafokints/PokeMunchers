import GridManager from '../objects/GridManager';
import Muncher from '../objects/Muncher';
import Enemy from '../objects/Enemy';
import { PokemonAPI, PokemonError, GameConfig } from '../config/pokemon/index.js';
import { questionGenerator } from '../config/game/questionGenerator.js';

const PLACEHOLDER_IMAGES = {
    muncher: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGUSURBVFiF7ZY9SwNBEIYfRUQQFEEQi4CFlZ3/wcZSSOV/sLGzs7K0tLGwshIsrAQLwUosLAQLCwtBEEEQRBBEDvJBkuN2Z3Zv70zgA1fszn3szOzO7kFJSYB54BLYB5aAWWAhxKwAB8A10AQmYgqfAT4CLAMPwHKA/zrwFGDegWmfwueBZ2AywHcH6EbwdIGtfgxmgBdgxuG3BbyNwPEBrKcVPwW8A3MWnwpw5yj+J94jz0Iz0AXWEvYbwGeG4p/AOvBl/L8GKjZ+E/jOULyxDZxb7C2HbQxsAhsW+yHQiSj+DhwBVxbbDbBrY6sBHyMUbwMnwLHFfgZUB9iqwGuE4rfAqcV2n+QlHGSrAE8Rip8DJ0NsZ8BEP1sZeIwovp+i+KlpqwCPEYqfASeW4rfmWBVzLEbxfeAyxHZhjtXMsSrwHKH4LXBosV2bY3VzrAa8RSh+AxwMsd0C9UG2GvAeoXgLOLXYHkhu3QBbHWhHKH4FnFls98B8mu0HuItQ/AzYs9geSW7dX7H9Ah81xmWRvWHpAAAAAElFTkSuQmCC',
    enemy: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGJSURBVFiF7ZY7SwNBFIW/KIIgCIIgFoKFlZ3/wcZSSOV/sLGzs7K0tLGwshIsrAQLwUosLAQLCwtBEEEQRBBkH+TBJpvZmdm9uwv4wRV75z7OnLn3zgOGGGIIwBxwCuwBS8AsMB9iFoED4BpoABMxhc8AHwGWgQdgOcB/HXgKMO/AlE/heeDZvBTiuwN0Ini6wFY/BjPAC1Bx+G0BbxE4PoDVtOJT5mVzFp8KcOco/idekWegGegCKwn7DeBzhOKfwBrwZfy/BhZsfBP4HqG4sQ2cWexVh20MbAIbFvshUI8ofg8cAVcWWx3YtbFVgY8Rxe+AE+DYYj8DFgfYFoHXCMVvgVOL7Z7kIxxkKwNPEYqfAydDbGfARD9bCXiMUHw/RfFT01YGHiMUPwNOLMVvzbEF5liM4vvAZYjtwhy7MI9VgOcIxW+BQ4vt2hy7MI/VgLcIxW+AgxDbLVAfZKsB7xGKt4BTi+2B5NYNsC0B7QjFr4Azi+0emE+z/QB3EYqfAXsW2yPJrfsr9gvwwcZlJFSMkwAAAABJRU5ErkJggg==',
    tileset: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGKSURBVHic7doxTsNAEIXhZ4gQQhQUFNDRcwSOwzE4DsfgCPT0FBQUiBIhRIkQIiNFipxkd+zZndn9P8nCxbP7/M/2FhsBAAAAAAAAAAAAwHbuJR0kfUi6qTwLzuxJ0lHS2B1XdceCkZ6dsQ6SLrM+6F7SadZnwpl9jt1xUvKPAIhAEDAEAUMQMAQBQxAwBAFDEDAEAUMQMAQBQxAwBAFDEDAEAUMQMAQBQxAwBAFDEDAEAUMQMAQBQxAwBAFDEDAEAUMQMAQBQxAwBAFDEDAEAUMQMAQBQxAwBAFDEDAEAUMQMAQBQxAwBAEAAAAAAAAAAACgqm/KRXQzN0JVIQAAAABJRU5ErkJggg=='
};

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    initializeGameState() {
        // Calculate dimensions based on screen width
        const screenWidth = 390;
        const gridPadding = 20;
        const cellPadding = 2;
        const availableWidth = screenWidth - (2 * gridPadding);
        const cellSize = Math.floor((availableWidth - (3 * cellPadding)) / 4);

        // Grid configuration
        this.gridConfig = {
            width: 4,
            height: 4,
            cellSize: cellSize,
            padding: cellPadding,
            startY: 140,
            textStyle: {
                font: '18px Arial',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: cellSize - 10 }
            }
        };

        // Game progression
        this.levelNumber = 1;
        this.score = 0;
        this.lives = 3;
        this.timeLeft = 89;
        this.currentLevel = this.getLevelData();
        
        // Player state
        this.powerups = {
            freeze: 0,
            shield: 0,
            speedBoost: 0
        };
        this.isInvulnerable = false;
        this.isFrozen = false;
        
        // Game elements
        this.gridCells = [];
        this.answerTexts = [];
        this.enemies = [];
        this.powerupSprites = [];
        this.collectibles = [];
        
        // Player character
        this.muncher = null;
        this.muncherPos = { x: 0, y: 0 };
        this.muncherState = {
            isEating: false,
            isHurt: false,
            hasPowerup: false
        };
        
        // UI elements
        this.timerText = null;
        this.levelText = null;
        this.promptText = null;
        this.scoreText = null;
        this.livesText = null;
        this.powerupUI = null;
        
        // Input state
        this.touchStart = null;
        this.cursors = null;
        this.spaceKey = null;
        
        // Game state flags
        this.isGamePaused = false;
        this.isLevelComplete = false;
        this.isTransitioning = false;

        this.scoreMultiplier = 1;
        this.consecutiveCorrect = 0;
        this.comboTimer = null;
        
        // Add visual effects state
        this.effects = {
            flash: null
        };
    }

    cleanupGameObjects() {
        // Clean up arrays of objects
        [
            this.gridCells,
            this.answerTexts,
            this.enemies,
            this.powerups
        ].forEach(array => {
            if (Array.isArray(array)) {
                array.forEach(obj => {
                    if (obj && obj.destroy) obj.destroy();
                });
            }
        });

        // Clean up individual sprites
        if (this.muncher?.destroy) this.muncher.destroy();
        
        // Clean up UI elements
        [
            this.timerText,
            this.levelText,
            this.promptText,
            this.scoreText,
            this.livesText,
            this.powerupUI
        ].forEach(element => {
            if (element?.destroy) element.destroy();
        });

        // Reset arrays
        this.gridCells = [];
        this.answerTexts = [];
        this.enemies = [];
        this.powerups = [];

        // Clear any running timers or tweens
        this.tweens.killAll();
        this.time.removeAllEvents();

        // Clean up timer
        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = null;
        }

        // Add level complete cleanup
        this.cleanupLevelComplete();
    }

    createTopUI() {
        const width = this.cameras.main.width;
        
        // Use levelNumber instead of currentLevel
        this.levelText = this.add.text(20, 20, `Level ${this.levelNumber}`, {
            font: '24px Arial',
            fill: '#ffffff'
        });

        // Timer (right-aligned)
        this.timerText = this.add.text(width - 20, 20, '1:29', {
            font: '24px Arial',
            fill: '#ffffff'
        }).setOrigin(1, 0);

        // Prompt and Lives
        this.promptText = this.add.text(20, 55, this.currentLevel?.question || 'Loading...', {
            font: '24px Arial',
            fill: '#ffffff'
        });

        // Lives (right-aligned)
        this.livesText = this.add.text(width - 20, 55, '♥'.repeat(this.lives), {
            font: '24px Arial',
            fill: '#ff0000'
        }).setOrigin(1, 0);

        // Points
        this.scoreText = this.add.text(20, 90, `Points: ${this.score}`, {
            font: '24px Arial',
            fill: '#ffffff'
        });
    }

    updateTimer() {
        if (this.isTransitioning || this.isGamePaused || this.isLevelComplete) return;
        
        if (this.timeLeft > 0) {
            this.timeLeft--;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            
            // Update timer text
            if (this.timerText) {
                this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                
                // Visual warning when time is low
                if (this.timeLeft <= 10) {
                    this.timerText.setStyle({ fill: '#ff0000' });
                    // Optional: Add flashing effect
                    this.tweens.add({
                        targets: this.timerText,
                        alpha: 0.5,
                        duration: 200,
                        yoyo: true,
                        repeat: 1
                    });
                }
            }
        } else {
            // Time's up!
            this.isGamePaused = true;
            this.isTransitioning = true;
            
            // Show game over message
            const gameOverText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 50,
                'Time\'s Up!',
                {
                    font: 'bold 48px Arial',
                    fill: '#ff0000',
                    stroke: '#000000',
                    strokeThickness: 6
                }
            ).setOrigin(0.5);

            const finalScoreText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 50,
                `Final Score: ${this.score}`,
                {
                    font: '32px Arial',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 4
                }
            ).setOrigin(0.5);

            // Transition to game over after delay
            this.time.delayedCall(2000, () => {
                this.scene.start('GameOver', { 
                    score: this.score,
                    level: this.levelNumber
                });
            });
        }
    }

    createGrid() {
        const { width, height, cellSize, padding, startY } = this.gridConfig;
        const totalWidth = width * (cellSize + padding) - padding;
        const startX = (this.cameras.main.width - totalWidth) / 2;

        this.gridCells = [];
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cellX = startX + x * (cellSize + padding);
                const cellY = startY + y * (cellSize + padding);
                
                const cell = this.add.rectangle(
                    cellX,
                    cellY,
                    cellSize,
                    cellSize,
                    0x444444
                ).setOrigin(0, 0);
                
                cell.setStrokeStyle(1, 0x666666); // Thinner border to match screenshot
                this.gridCells.push(cell);
            }
        }
    }

    createBottomUI() {
        const buttonY = this.cameras.main.height - 60;
        const spacing = 130;
        const centerX = this.cameras.main.width / 2;
        const buttonWidth = 120;
        const buttonHeight = 40;

        ['FREEZE', 'POWER-UP', 'PAUSE'].forEach((text, index) => {
            const x = centerX + (index - 1) * spacing;
            
            // Button background
            const button = this.add.rectangle(
                x,
                buttonY,
                buttonWidth,
                buttonHeight,
                0x666666
            ).setStrokeStyle(2, 0x888888);

            // Button text
            this.add.text(
                x,
                buttonY,
                text,
                {
                    font: '20px Arial',
                    fill: '#ffffff'
                }
            ).setOrigin(0.5);

            button.setInteractive()
                .on('pointerdown', () => {
                    switch(text) {
                        case 'PAUSE':
                            this.togglePause();
                            break;
                        case 'FREEZE':
                            this.freezeEnemies();
                            break;
                        case 'POWER-UP':
                            this.activatePowerUp();
                            break;
                    }
                });
        });
    }

    create() {
        // Clean up before creating new scene
        this.cleanupGameObjects();
        
        // Initialize fresh game state
        this.initializeGameState();
        
        // Set up scene
        this.cameras.main.setBackgroundColor('#000000');
        this.createTopUI();
        this.createGrid();
        this.createBottomUI();
        this.createMuncher();
        this.displayAnswers(this.currentLevel);
        
        // Set up controls
        this.setupControls();
        
        // Start game loop
        this.startGameLoop();
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Add pause key
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
            .on('down', () => this.togglePause());
    }

    startGameLoop() {
        // Main game timer
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    togglePause() {
        this.isGamePaused = !this.isGamePaused;
        
        if (this.isGamePaused) {
            // Show pause menu
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
                {
                    font: 'bold 48px Arial',
                    fill: '#ffffff'
                }
            ).setOrigin(0.5);
            
            const resumeText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 50,
                'Press PAUSE to resume',
                {
                    font: '24px Arial',
                    fill: '#ffffff'
                }
            ).setOrigin(0.5);
            
            this.pauseMenu = { pauseOverlay, pauseText, resumeText };
        } else {
            // Clean up pause menu
            Object.values(this.pauseMenu).forEach(element => element.destroy());
            this.pauseMenu = null;
        }
    }

    update() {
        if (!this.currentLevel || this.isGamePaused || this.isLevelComplete) return;
        
        this.handleMuncherMovement();
        this.checkEnemyCollisions();
        
        // Check for space key press
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.eatCurrentTile();
        }
    }

    setupLevel() {
        const difficulty = this.calculateDifficulty();
        this.timeLeft = difficulty.timeLimit;
        
        // Spawn enemies based on difficulty
        for (let i = 0; i < difficulty.enemyCount; i++) {
            this.spawnEnemy(difficulty.enemySpeed);
        }
    }

    calculateDifficulty() {
        return {
            timeLimit: Math.max(60, 90 - (this.levelNumber * 5)),
            enemyCount: Math.min(3, 1 + Math.floor(this.levelNumber / 3)),
            enemySpeed: Math.min(200, 100 + (this.levelNumber * 10))
        };
    }

    getLevelData() {
        try {
            // Get question from generator
            const question = questionGenerator.generateRandomQuestion();
            console.log('Generated Question:', question);
            
            // Format the data for the game scene
            const formattedData = {
                type: question.type,
                question: question.question,
                level: this.levelNumber,
                answers: {
                    correct: question.options
                        .filter((option, index) => questionGenerator._isCorrectAnswer(option, question))
                        .map(option => option.name),
                    incorrect: question.options
                        .filter((option, index) => !questionGenerator._isCorrectAnswer(option, question))
                        .map(option => option.name)
                },
                difficulty: question.difficulty
            };

            // Final validation
            if (!this.validateFormattedData(formattedData)) {
                return this.getFallbackQuestion();
            }
            
            return formattedData;
        } catch (error) {
            console.error('Failed to get level data:', error);
            return this.getFallbackQuestion();
        }
    }

    validateFormattedData(data) {
        const requiredFields = ['type', 'question', 'level', 'answers'];
        const isValid = requiredFields.every(field => {
            const hasField = data.hasOwnProperty(field);
            if (!hasField) {
                console.error(`Missing required field: ${field}`);
            }
            return hasField;
        });

        if (!isValid) return false;

        // Validate answers structure
        if (!data.answers.correct?.length || !data.answers.incorrect?.length) {
            console.error('Invalid answers structure');
            return false;
        }

        // Validate no duplicate answers between correct and incorrect
        const intersection = data.answers.correct.filter(x => 
            data.answers.incorrect.includes(x)
        );
        if (intersection.length > 0) {
            console.error('Found duplicate answers:', intersection);
            return false;
        }

        return true;
    }

    formatQuestion(levelData) {
        switch(levelData.type) {
            case 'TYPE':
                return `Find ${levelData.answer} Pokémon`;
            case 'GENERATION':
                return `Find Generation ${levelData.answer} Pokémon`;
            case 'EVOLUTION':
                return `Find ${levelData.answer} Evolution Pokémon`;
            default:
                return 'Find Pokémon';
        }
    }

    getFallbackQuestion() {
        return {
            type: 'TYPE',
            question: 'Find Fire Pokémon',
            level: this.levelNumber,
            answers: {
                correct: [
                    'Charmander',
                    'Charmeleon',
                    'Charizard',
                    'Vulpix',
                    'Ninetales',
                    'Growlithe',
                    'Arcanine',
                    'Ponyta'
                ],
                incorrect: [
                    'Pikachu',
                    'Bulbasaur',
                    'Squirtle',
                    'Oddish',
                    'Psyduck',
                    'Poliwag',
                    'Tentacool',
                    'Slowpoke'
                ]
            },
            difficulty: 1
        };
    }

    displayAnswers(levelData) {
        console.log('Starting displayAnswers with levelData:', levelData);
        
        if (!levelData || !levelData.answers) {
            console.error('Invalid levelData in displayAnswers:', levelData);
            return;
        }

        // Clear existing texts safely
        if (this.answerTexts) {
            console.log('Clearing existing answers, count:', this.answerTexts.length);
            this.answerTexts.forEach(text => {
                if (text) text.destroy();
            });
        }
        this.answerTexts = [];

        const { width, height, cellSize, padding, startY } = this.gridConfig;
        const totalWidth = width * (cellSize + padding) - padding;
        const startX = (this.cameras.main.width - totalWidth) / 2;

        // Combine and shuffle answers
        const allAnswers = [
            ...levelData.answers.correct,
            ...levelData.answers.incorrect
        ];
        console.log('Combined answers before shuffle:', allAnswers);
        
        // Fisher-Yates shuffle
        for (let i = allAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }
        console.log('Answers after shuffle:', allAnswers);

        // Fill remaining slots with empty strings if needed
        while (allAnswers.length < width * height) {
            allAnswers.push('');
        }

        // Display answers in grid
        allAnswers.forEach((answer, index) => {
            const x = index % width;
            const y = Math.floor(index / width);
            
            const cellX = startX + x * (cellSize + padding);
            const cellY = startY + y * (cellSize + padding);

            console.log(`Creating text for answer "${answer}" at position (${x}, ${y})`);

            if (answer) {
                // Dynamically adjust text size based on length
                const fontSize = answer.length > 8 ? '14px' : '18px';
                
                const text = this.add.text(
                    cellX + cellSize/2,
                    cellY + cellSize/2,
                    answer,
                    {
                        font: `${fontSize} Arial`,
                        fill: '#ffffff',
                        align: 'center',
                        wordWrap: { width: cellSize - 10 }
                    }
                ).setOrigin(0.5);
                
                // Debug visual indicator
                const debugRect = this.add.rectangle(
                    cellX + cellSize/2,
                    cellY + cellSize/2,
                    cellSize - 4,
                    cellSize - 4,
                    0x00ff00,
                    0.1
                );
                
                this.answerTexts.push(text);
            } else {
                this.answerTexts.push(null);
            }
        });

        console.log('Final answerTexts array:', this.answerTexts.map(t => t ? t.text : null));
    }

    createMuncher() {
        // Destroy existing muncher if it exists
        if (this.muncher) {
            this.muncher.destroy();
        }

        const { cellSize, padding, startY } = this.gridConfig;
        const totalWidth = 4 * (cellSize + padding) - padding;
        const startX = (this.cameras.main.width - totalWidth) / 2;

        // Create muncher sprite
        this.muncher = this.add.sprite(
            startX + cellSize/2,
            startY + cellSize/2,
            'muncher'
        ).setOrigin(0.5);

        // Reset muncher position
        this.muncherPos = { x: 0, y: 0 };
    }

    handleMuncherMovement() {
        if (!this.muncher || !this.cursors || this.isGamePaused || this.isLevelComplete || this.isTransitioning) return;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left) && this.muncherPos.x > 0) {
            this.muncherPos.x--;
            this.updateMuncherPosition();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.muncherPos.x < 3) {
            this.muncherPos.x++;
            this.updateMuncherPosition();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.muncherPos.y > 0) {
            this.muncherPos.y--;
            this.updateMuncherPosition();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) && this.muncherPos.y < 3) {
            this.muncherPos.y++;
            this.updateMuncherPosition();
        }
    }

    updateMuncherPosition() {
        const { cellSize, padding, startY } = this.gridConfig;
        const totalWidth = 4 * (cellSize + padding) - padding;
        const startX = (this.cameras.main.width - totalWidth) / 2;

        // Update muncher position with animation
        this.tweens.add({
            targets: this.muncher,
            x: startX + this.muncherPos.x * (cellSize + padding) + cellSize/2,
            y: startY + this.muncherPos.y * (cellSize + padding) + cellSize/2,
            duration: 100,
            ease: 'Power1'
        });

        // Check answer at new position
        this.checkAnswer();
    }

    checkAnswer() {
        const currentIndex = this.muncherPos.y * 4 + this.muncherPos.x;
        const currentAnswer = this.answerTexts[currentIndex]?.text;
        
        if (currentAnswer && this.currentLevel.answers.correct.includes(currentAnswer)) {
            console.log('Correct!');
            // TODO: Add correct answer handling
        } else if (currentAnswer) {
            console.log('Incorrect!');
            // TODO: Add incorrect answer handling
        }
    }

    eatCurrentTile() {
        const currentIndex = this.muncherPos.y * 4 + this.muncherPos.x;
        const currentAnswer = this.answerTexts[currentIndex]?.text;
        
        if (!currentAnswer) return;

        if (this.currentLevel.answers.correct.includes(currentAnswer)) {
            // Correct answer handling
            this.showCorrectAnswerEffect(this.muncher.x, this.muncher.y);
            this.updateScoreWithCombo();
            
            this.answerTexts[currentIndex].destroy();
            this.answerTexts[currentIndex] = null;

            // Check if all correct answers have been found
            const remainingCorrectAnswers = this.answerTexts
                .filter(text => text && this.currentLevel.answers.correct.includes(text.text));

            if (remainingCorrectAnswers.length === 0) {
                // Set transition flag
                this.isTransitioning = true;
                this.isLevelComplete = true;
                
                // Level complete!
                this.levelNumber++;
                
                // Get new level data BEFORE showing completion message
                const nextLevelData = this.getLevelData();
                console.log('Next level data:', nextLevelData);
                
                // Show level complete effect and handle transition
                this.showLevelCompleteEffect();

                // Wait a moment, then start next level
                this.time.delayedCall(1500, () => {
                    this.isLevelComplete = false;
                    this.isTransitioning = false;
                    
                    // Use the previously fetched level data
                    this.currentLevel = nextLevelData;
                    
                    // Clean up and recreate scene elements
                    this.cleanupGameObjects();
                    this.createTopUI();
                    this.createGrid();
                    this.createBottomUI();
                    this.setupLevel();
                    this.createMuncher();
                    
                    console.log('About to display answers for next level');
                    this.displayAnswers(this.currentLevel);
                    
                    // Update level text
                    this.levelText.setText(`Level ${this.levelNumber}`);
                });
            }
        } else {
            // Incorrect answer handling
            this.showIncorrectAnswerEffect();
            this.resetCombo();
            this.lives--;
            
            if (this.lives <= 0) {
                this.lives = 0;
                this.livesText.setText('♥'.repeat(this.lives));
                this.scene.start('GameOver', { score: this.score });
                return;
            }
            
            this.livesText.setText('♥'.repeat(this.lives));
            this.cameras.main.shake(200, 0.005);
        }
    }

    showCorrectAnswerEffect(x, y) {
        // Show score popup with current multiplier
        const scoreText = this.add.text(x, y, `+${100 * this.scoreMultiplier}`, {
            font: 'bold 24px Arial',
            fill: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => scoreText.destroy()
        });

        // Flash cell background
        const cell = this.gridCells[this.muncherPos.y * 4 + this.muncherPos.x];
        const originalFill = cell.fillColor;
        
        cell.setFillStyle(0x00ff00, 0.3);
        this.time.delayedCall(200, () => {
            cell.setFillStyle(originalFill);
        });
    }

    showIncorrectAnswerEffect() {
        // Flash cell red
        const cell = this.gridCells[this.muncherPos.y * 4 + this.muncherPos.x];
        const originalFill = cell.fillColor;
        
        cell.setFillStyle(0xff0000, 0.3);
        this.time.delayedCall(200, () => {
            cell.setFillStyle(originalFill);
        });

        // Show negative score popup
        const scoreText = this.add.text(
            this.muncher.x,
            this.muncher.y,
            '-50',
            {
                font: 'bold 24px Arial',
                fill: '#ff0000',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            y: this.muncher.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => scoreText.destroy()
        });
    }

    updateScoreWithCombo() {
        // Reset combo timer if it exists
        if (this.comboTimer) this.comboTimer.remove();

        // Increment consecutive correct answers
        this.consecutiveCorrect++;

        // Update multiplier based on consecutive correct answers
        if (this.consecutiveCorrect >= 5) {
            this.scoreMultiplier = 3;
        } else if (this.consecutiveCorrect >= 3) {
            this.scoreMultiplier = 2;
        }

        // Add score with multiplier
        const baseScore = 100;
        const scoreGain = baseScore * this.scoreMultiplier;
        this.score += scoreGain;

        // Update score display with multiplier if active
        const multiplierText = this.scoreMultiplier > 1 ? ` (${this.scoreMultiplier}x)` : '';
        this.scoreText.setText(`Points: ${this.score}${multiplierText}`);

        // Start combo timer
        this.comboTimer = this.time.delayedCall(3000, () => {
            this.resetCombo();
        });
    }

    resetCombo() {
        this.consecutiveCorrect = 0;
        this.scoreMultiplier = 1;
        this.scoreText.setText(`Points: ${this.score}`);
        if (this.comboTimer) {
            this.comboTimer.remove();
            this.comboTimer = null;
        }
    }

    showLevelCompleteEffect() {
        // Store references to level complete elements for cleanup
        this.levelCompleteElements = [];

        // Flash the screen with a success color
        const flash = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x00ff00, 0.2
        ).setOrigin(0);

        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });

        // Calculate bonuses
        const levelBonus = 250 * this.levelNumber;
        const timeBonus = this.timeLeft * 10;
        const totalBonus = levelBonus + timeBonus;

        // Add bonus to score
        this.score += totalBonus;

        // Position text elements with more spacing
        // Move up further from the toolbar
        const toolbarHeight = 50;
        const bottomY = this.cameras.main.height - toolbarHeight - 160; // Increased from -100 to -160
        
        // Level complete text positioned higher
        const levelCompleteText = this.add.text(
            this.cameras.main.centerX,
            bottomY - 60,
            'Level Complete!',
            {
                font: 'bold 32px Arial',
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Show bonus text below level complete with clear spacing
        const bonusText = this.add.text(
            this.cameras.main.centerX,
            bottomY + 10,
            [
                `Level Bonus: +${levelBonus}`,
                `Time Bonus: +${timeBonus}`,
                `Total Bonus: +${totalBonus}`
            ],
            {
                font: '20px Arial',
                fill: '#ffffff',
                align: 'center',
                lineSpacing: 8,
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        // Store references for cleanup
        this.levelCompleteElements.push(levelCompleteText, bonusText);

        // Animate level complete text
        this.tweens.add({
            targets: levelCompleteText,
            scale: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.out'
        });

        // Animate bonus text
        this.tweens.add({
            targets: bonusText,
            scale: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.out',
            delay: 200
        });

        // Set up cleanup after delay
        this.time.delayedCall(1500, () => {
            this.cleanupLevelComplete();
        });
    }

    cleanupLevelComplete() {
        if (this.levelCompleteElements) {
            // Fade out all level complete elements
            this.tweens.add({
                targets: this.levelCompleteElements,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    // Destroy all elements
                    this.levelCompleteElements.forEach(element => {
                        if (element && element.destroy) {
                            element.destroy();
                        }
                    });
                    this.levelCompleteElements = [];
                }
            });
        }
    }

    freezeEnemies() {
        if (this.powerups.freeze <= 0) return;
        
        this.powerups.freeze--;
        this.isFrozen = true;
        
        // Visual feedback
        const freezeEffect = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x00ffff,
            0.2
        );
        
        // Unfreeze after 5 seconds
        this.time.delayedCall(5000, () => {
            this.isFrozen = false;
            freezeEffect.destroy();
        });
    }

    updateScore(amount) {
        // Increase multiplier for consecutive correct answers
        if (amount > 0) {
            this.consecutiveCorrect++;
            if (this.consecutiveCorrect >= 3) {
                this.scoreMultiplier = 2;
            }
            if (this.consecutiveCorrect >= 5) {
                this.scoreMultiplier = 3;
            }
        } else {
            // Reset multiplier on wrong answers
            this.consecutiveCorrect = 0;
            this.scoreMultiplier = 1;
        }
        
        this.score += amount * this.scoreMultiplier;
        this.scoreText.setText(`Points: ${this.score} (${this.scoreMultiplier}x)`);
    }

    showAnswerFeedback(isCorrect, x, y) {
        // Create feedback text
        const text = this.add.text(x, y, isCorrect ? '+100' : '-50', {
            font: 'bold 24px Arial',
            fill: isCorrect ? '#00ff00' : '#ff0000'
        }).setOrigin(0.5);

        // Animate it
        this.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    spawnEnemy(speed = 100) {
        const { width, height, cellSize, padding, startY } = this.gridConfig;
        const totalWidth = width * (cellSize + padding) - padding;
        const startX = (this.cameras.main.width - totalWidth) / 2;
        
        // Create enemy sprite
        const enemy = this.add.sprite(0, 0, 'enemy');
        enemy.setScale(0.5);
        
        // Initialize enemy grid position
        enemy.gridPos = {
            x: Phaser.Math.Between(0, 3),
            y: Phaser.Math.Between(0, 3)
        };
        
        // Set initial screen position based on grid position
        enemy.x = startX + enemy.gridPos.x * (cellSize + padding) + cellSize/2;
        enemy.y = startY + enemy.gridPos.y * (cellSize + padding) + cellSize/2;

        // Add to enemies array
        this.enemies.push(enemy);
        
        // Start movement with slower speed
        this.moveEnemy(enemy, 400); // Increased base movement duration to 400ms
    }

    moveEnemy(enemy, speed) {
        if (!this.muncher || this.isGamePaused || this.isFrozen) return;

        const { width, height, cellSize, padding, startY } = this.gridConfig;
        const totalWidth = width * (cellSize + padding) - padding;
        const startX = (this.cameras.main.width - totalWidth) / 2;

        // Calculate direction to muncher (for smarter movement)
        const dx = this.muncherPos.x - enemy.gridPos.x;
        const dy = this.muncherPos.y - enemy.gridPos.y;

        // Determine possible moves
        const possibleMoves = [];
        
        // Horizontal and vertical moves only (no diagonals)
        if (enemy.gridPos.x > 0) possibleMoves.push({ x: -1, y: 0, weight: dx < 0 ? 2 : 1 });
        if (enemy.gridPos.x < 3) possibleMoves.push({ x: 1, y: 0, weight: dx > 0 ? 2 : 1 });
        if (enemy.gridPos.y > 0) possibleMoves.push({ x: 0, y: -1, weight: dy < 0 ? 2 : 1 });
        if (enemy.gridPos.y < 3) possibleMoves.push({ x: 0, y: 1, weight: dy > 0 ? 2 : 1 });

        // Weight moves towards muncher more heavily
        let weightedMoves = [];
        possibleMoves.forEach(move => {
            for (let i = 0; i < move.weight; i++) {
                weightedMoves.push({ x: move.x, y: move.y });
            }
        });

        // Choose move with weighted randomness
        const move = Phaser.Utils.Array.GetRandom(weightedMoves);
        
        // Update enemy grid position
        enemy.gridPos.x += move.x;
        enemy.gridPos.y += move.y;

        // Calculate new screen position
        const newX = startX + enemy.gridPos.x * (cellSize + padding) + cellSize/2;
        const newY = startY + enemy.gridPos.y * (cellSize + padding) + cellSize/2;

        // Move enemy with animation
        this.tweens.add({
            targets: enemy,
            x: newX,
            y: newY,
            duration: speed,
            ease: 'Linear',
            onComplete: () => {
                // Continue movement if enemy still exists
                if (enemy.active) {
                    // Add a longer delay between moves (500-1000ms)
                    this.time.delayedCall(Phaser.Math.Between(500, 1000), () => {
                        this.moveEnemy(enemy, speed);
                    });
                }
            }
        });
    }

    checkEnemyCollisions() {
        if (this.isInvulnerable || !this.muncher) return;

        this.enemies.forEach(enemy => {
            if (!enemy.active) return;

            const distance = Phaser.Math.Distance.Between(
                enemy.x,
                enemy.y,
                this.muncher.x,
                this.muncher.y
            );

            if (distance < 30) { // Adjust collision radius as needed
                this.handleEnemyCollision();
            }
        });
    }

    handleEnemyCollision() {
        if (this.isInvulnerable) return;

        // Reduce lives
        this.lives--;
        this.livesText.setText('♥'.repeat(this.lives));

        // Make muncher temporarily invulnerable
        this.isInvulnerable = true;
        this.muncher.alpha = 0.5;

        // Screen shake effect
        this.cameras.main.shake(250, 0.01);

        // Check for game over
        if (this.lives <= 0) {
            this.scene.start('GameOver', { score: this.score });
            return;
        }

        // Reset invulnerability after delay
        this.time.delayedCall(2000, () => {
            this.isInvulnerable = false;
            this.muncher.alpha = 1;
        });
    }
}

class PowerUpManager {
    constructor(scene) {
        this.scene = scene;
        this.powerUps = {
            freeze: { count: 0, duration: 5000 },
            shield: { count: 0, duration: 10000 },
            speedBoost: { count: 0, duration: 8000 }
        };
    }

    addPowerUp(type) {
        if (this.powerUps[type]) {
            this.powerUps[type].count++;
            this.updateUI();
        }
    }

    usePowerUp(type) {
        if (this.powerUps[type]?.count > 0) {
            this.powerUps[type].count--;
            this.activateEffect(type);
            this.updateUI();
        }
    }

    updateUI() {
        // Update power-up display
    }
}

class AchievementManager {
    constructor() {
        this.achievements = {
            speedRunner: { name: "Speed Runner", condition: "Complete level in 30 seconds", unlocked: false },
            perfectionist: { name: "Perfectionist", condition: "No wrong answers in a level", unlocked: false },
            comboMaster: { name: "Combo Master", condition: "Get 5x multiplier", unlocked: false }
        };
    }

    checkAchievements(gameState) {
        if (gameState.timeLeft > 60 && !this.achievements.speedRunner.unlocked) {
            this.unlockAchievement('speedRunner');
        }
        // ... check other achievements
    }

    unlockAchievement(id) {
        if (!this.achievements[id].unlocked) {
            this.achievements[id].unlocked = true;
            this.showAchievementPopup(this.achievements[id].name);
        }
    }
}