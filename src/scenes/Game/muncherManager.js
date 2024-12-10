export function createMuncher(scene) {
    const { cellSize, padding, startY } = scene.gridConfig;
    const totalWidth = 4 * (cellSize + padding) - padding;
    const startX = (scene.cameras.main.width - totalWidth) / 2;

    if (scene.muncher) scene.muncher.destroy();
    scene.muncher = scene.add.sprite(
        startX + cellSize/2,
        startY + cellSize/2,
        'muncher'
    ).setOrigin(0.5);

    scene.muncherPos = { x: 0, y: 0 };
}

export function handleMuncherMovement(scene) {
    if (!scene.muncher || !scene.cursors || scene.isGamePaused || scene.isLevelComplete || scene.isTransitioning) return;

    const { cellSize, padding, startY } = scene.gridConfig;
    const totalWidth = 4 * (cellSize + padding) - padding;
    const startX = (scene.cameras.main.width - totalWidth) / 2;

    if (Phaser.Input.Keyboard.JustDown(scene.cursors.left) && scene.muncherPos.x > 0) {
        scene.muncherPos.x--;
        updateMuncherPosition(scene);
    } else if (Phaser.Input.Keyboard.JustDown(scene.cursors.right) && scene.muncherPos.x < 3) {
        scene.muncherPos.x++;
        updateMuncherPosition(scene);
    } else if (Phaser.Input.Keyboard.JustDown(scene.cursors.up) && scene.muncherPos.y > 0) {
        scene.muncherPos.y--;
        updateMuncherPosition(scene);
    } else if (Phaser.Input.Keyboard.JustDown(scene.cursors.down) && scene.muncherPos.y < 3) {
        scene.muncherPos.y++;
        updateMuncherPosition(scene);
    }
}

function updateMuncherPosition(scene) {
    const { cellSize, padding, startY } = scene.gridConfig;
    const totalWidth = 4 * (cellSize + padding) - padding;
    const startX = (scene.cameras.main.width - totalWidth) / 2;

    scene.tweens.add({
        targets: scene.muncher,
        x: startX + scene.muncherPos.x * (cellSize + padding) + cellSize/2,
        y: startY + scene.muncherPos.y * (cellSize + padding) + cellSize/2,
        duration: 100,
        ease: 'Power1'
    });

    checkAnswer(scene);
}

function checkAnswer(scene) {
    const currentIndex = scene.muncherPos.y * 4 + scene.muncherPos.x;
    const currentAnswer = scene.answerTexts[currentIndex]?.text;

    if (currentAnswer && scene.currentLevel.answers.correct.includes(currentAnswer)) {
        // Correct tile
        console.log('Correct!');
    } else if (currentAnswer) {
        // Incorrect tile
        console.log('Incorrect!');
    }
}

export function eatCurrentTile(scene, showLevelCompleteEffect) {
    const currentIndex = scene.muncherPos.y * 4 + scene.muncherPos.x;
    const currentAnswer = scene.answerTexts[currentIndex]?.text;

    if (!currentAnswer) return;

    if (scene.currentLevel.answers.correct.includes(currentAnswer)) {
        handleCorrectAnswer(scene, currentIndex, showLevelCompleteEffect);
    } else {
        handleIncorrectAnswer(scene);
    }
}

function handleCorrectAnswer(scene, index, showLevelCompleteEffect) {
    showCorrectAnswerEffect(scene, scene.muncher.x, scene.muncher.y);
    updateScoreWithCombo(scene);
    scene.answerTexts[index].destroy();
    scene.answerTexts[index] = null;

    const remainingCorrect = scene.answerTexts
        .filter(t => t && scene.currentLevel.answers.correct.includes(t.text));

    if (remainingCorrect.length === 0) {
        // Level complete
        scene.isTransitioning = true;
        scene.isLevelComplete = true;
        scene.levelNumber++;

        const nextLevelData = scene.getLevelData(); // scene.getLevelData should still work or import it
        showLevelCompleteEffect(scene);

        scene.time.delayedCall(1500, () => {
            scene.isLevelComplete = false;
            scene.isTransitioning = false;
            scene.currentLevel = nextLevelData;

            // Rebuild UI and grid
            scene.cleanupGameObjects(scene);
            scene.createTopUI(scene);
            scene.createGrid(scene);
            scene.createBottomUI(scene);
            scene.setupLevel(scene);
            scene.createMuncher(scene);
            scene.displayAnswers(scene, scene.currentLevel);

            scene.levelText.setText(`Level ${scene.levelNumber}`);
        });
    }
}

function handleIncorrectAnswer(scene) {
    showIncorrectAnswerEffect(scene);
    scene.consecutiveCorrect = 0;
    scene.scoreMultiplier = 1;
    scene.lives--;
    scene.livesText.setText('♥'.repeat(scene.lives));
    scene.cameras.main.shake(200, 0.005);

    if (scene.lives <= 0) {
        scene.scene.start('GameOver', { score: scene.score });
    }
}

function showCorrectAnswerEffect(scene, x, y) {
    const scorePopup = scene.add.text(x, y, `+${100 * scene.scoreMultiplier}`, {
        font: 'bold 24px Arial',
        fill: '#00ff00',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: scorePopup,
        y: y - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => scorePopup.destroy()
    });

    const cell = scene.gridCells[scene.muncherPos.y * 4 + scene.muncherPos.x];
    const originalFill = cell.fillColor;
    cell.setFillStyle(0x00ff00, 0.3);
    scene.time.delayedCall(200, () => {
        cell.setFillStyle(originalFill);
    });
}

function showIncorrectAnswerEffect(scene) {
    const cell = scene.gridCells[scene.muncherPos.y * 4 + scene.muncherPos.x];
    const originalFill = cell.fillColor;
    cell.setFillStyle(0xff0000, 0.3);
    scene.time.delayedCall(200, () => {
        cell.setFillStyle(originalFill);
    });

    const scorePopup = scene.add.text(
        scene.muncher.x,
        scene.muncher.y,
        '-50',
        {
            font: 'bold 24px Arial',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        }
    ).setOrigin(0.5);

    scene.tweens.add({
        targets: scorePopup,
        y: scene.muncher.y - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => scorePopup.destroy()
    });
}

function updateScoreWithCombo(scene) {
    if (scene.comboTimer) scene.comboTimer.remove();

    scene.consecutiveCorrect++;
    if (scene.consecutiveCorrect >= 5) {
        scene.scoreMultiplier = 3;
    } else if (scene.consecutiveCorrect >= 3) {
        scene.scoreMultiplier = 2;
    }

    const baseScore = 100;
    const scoreGain = baseScore * scene.scoreMultiplier;
    scene.score += scoreGain;

    const multiplierText = scene.scoreMultiplier > 1 ? ` (${scene.scoreMultiplier}x)` : '';
    scene.scoreText.setText(`Points: ${scene.score}${multiplierText}`);

    scene.comboTimer = scene.time.delayedCall(3000, () => {
        scene.consecutiveCorrect = 0;
        scene.scoreMultiplier = 1;
        scene.scoreText.setText(`Points: ${scene.score}`);
        scene.comboTimer = null;
    });
}
