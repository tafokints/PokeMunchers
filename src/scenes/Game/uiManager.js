export function createTopUI(scene) {
    const width = scene.cameras.main.width;

    scene.levelText = scene.add.text(20, 20, `Level ${scene.levelNumber}`, {
        font: '24px Arial',
        fill: '#ffffff'
    });

    scene.timerText = scene.add.text(width - 20, 20, '1:29', {
        font: '24px Arial',
        fill: '#ffffff'
    }).setOrigin(1, 0);

    scene.promptText = scene.add.text(20, 55, scene.currentLevel?.question || 'Loading...', {
        font: '24px Arial',
        fill: '#ffffff'
    });

    scene.livesText = scene.add.text(width - 20, 55, '♥'.repeat(scene.lives), {
        font: '24px Arial',
        fill: '#ff0000'
    }).setOrigin(1, 0);

    scene.scoreText = scene.add.text(20, 90, `Points: ${scene.score}`, {
        font: '24px Arial',
        fill: '#ffffff'
    });
}

export function createBottomUI(scene) {
    const buttonY = scene.cameras.main.height - 60;
    const spacing = 130;
    const centerX = scene.cameras.main.width / 2;
    const buttonWidth = 120;
    const buttonHeight = 40;

    ['FREEZE', 'POWER-UP', 'PAUSE'].forEach((text, index) => {
        const x = centerX + (index - 1) * spacing;

        const button = scene.add.rectangle(
            x,
            buttonY,
            buttonWidth,
            buttonHeight,
            0x666666
        ).setStrokeStyle(2, 0x888888);

        scene.add.text(
            x,
            buttonY,
            text,
            { font: '20px Arial', fill: '#ffffff' }
        ).setOrigin(0.5);

        button.setInteractive().on('pointerdown', () => {
            switch (text) {
                case 'PAUSE':
                    scene.togglePause();
                    break;
                case 'FREEZE':
                    scene.freezeEnemies?.();
                    break;
                case 'POWER-UP':
                    scene.activatePowerUp?.();
                    break;
            }
        });
    });
}

export function updateTimer(scene) {
    if (scene.isTransitioning || scene.isGamePaused || scene.isLevelComplete) return;

    if (scene.timeLeft > 0) {
        scene.timeLeft--;
        const minutes = Math.floor(scene.timeLeft / 60);
        const seconds = scene.timeLeft % 60;

        if (scene.timerText) {
            scene.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);

            if (scene.timeLeft <= 10) {
                scene.timerText.setStyle({ fill: '#ff0000' });
                // Optional flash
                scene.tweens.add({
                    targets: scene.timerText,
                    alpha: 0.5,
                    duration: 200,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
    } else {
        // Time's up logic
        scene.isGamePaused = true;
        scene.isTransitioning = true;

        const gameOverText = scene.add.text(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY - 50,
            "Time's Up!",
            {
                font: 'bold 48px Arial',
                fill: '#ff0000',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        const finalScoreText = scene.add.text(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY + 50,
            `Final Score: ${scene.score}`,
            {
                font: '32px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        scene.time.delayedCall(2000, () => {
            scene.scene.start('GameOver', { 
                score: scene.score,
                level: scene.levelNumber
            });
        });
    }
}
