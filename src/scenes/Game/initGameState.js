export function initGameState(scene) {
    // Calculate dynamic sizes if needed
    const screenWidth = 390;
    const gridPadding = 20;
    const cellPadding = 2;
    const availableWidth = screenWidth - (2 * gridPadding);
    const cellSize = Math.floor((availableWidth - (3 * cellPadding)) / 4);

    scene.gridConfig = {
        width: 4,
        height: 4,
        cellSize,
        padding: cellPadding,
        startY: 140,
        textStyle: {
            font: '18px Arial',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: cellSize - 10 }
        }
    };

    scene.levelNumber = 1;
    scene.score = 0;
    scene.lives = 3;
    scene.timeLeft = 89;

    scene.powerups = { freeze: 0, shield: 0, speedBoost: 0 };
    scene.isInvulnerable = false;
    scene.isFrozen = false;
    scene.isGamePaused = false;
    scene.isLevelComplete = false;
    scene.isTransitioning = false;

    scene.gridCells = [];
    scene.answerTexts = [];
    scene.enemies = [];
    scene.collectibles = [];
    scene.effects = { flash: null };

    scene.muncher = null;
    scene.muncherPos = { x: 0, y: 0 };
    scene.muncherState = {
        isEating: false,
        isHurt: false,
        hasPowerup: false
    };

    scene.scoreMultiplier = 1;
    scene.consecutiveCorrect = 0;
    scene.comboTimer = null;

    // UI references (will be set after creation)
    scene.timerText = null;
    scene.levelText = null;
    scene.promptText = null;
    scene.scoreText = null;
    scene.livesText = null;
    scene.powerupUI = null;
}

export function cleanupGameObjects(scene) {
    // Destroy arrays of objects
    [
        scene.gridCells,
        scene.answerTexts,
        scene.enemies,
        scene.powerups
    ].forEach(array => {
        if (Array.isArray(array)) {
            array.forEach(obj => {
                if (obj && obj.destroy) obj.destroy();
            });
        }
    });

    // Destroy individual sprites
    if (scene.muncher?.destroy) scene.muncher.destroy();

    // Destroy UI elements
    [
        scene.timerText,
        scene.levelText,
        scene.promptText,
        scene.scoreText,
        scene.livesText,
        scene.powerupUI
    ].forEach(element => {
        if (element?.destroy) element.destroy();
    });

    // Reset arrays
    scene.gridCells = [];
    scene.answerTexts = [];
    scene.enemies = [];
    scene.powerups = [];

    // Clear timers/tweens
    if (scene.tweens) scene.tweens.killAll();
    if (scene.time) scene.time.removeAllEvents();

    if (scene.timerEvent) {
        scene.timerEvent.destroy();
        scene.timerEvent = null;
    }
}
