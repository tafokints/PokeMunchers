export function showLevelCompleteEffect(scene) {
    const flash = scene.add.rectangle(
        0, 0,
        scene.cameras.main.width,
        scene.cameras.main.height,
        0x00ff00, 0.2
    ).setOrigin(0);

    scene.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 500,
        onComplete: () => flash.destroy()
    });

    const levelBonus = 250 * scene.levelNumber;
    const timeBonus = scene.timeLeft * 10;
    const totalBonus = levelBonus + timeBonus;
    scene.score += totalBonus;

    const toolbarHeight = 50;
    const bottomY = scene.cameras.main.height - toolbarHeight - 160;
    const levelCompleteText = scene.add.text(
        scene.cameras.main.centerX,
        bottomY - 60,
        'Level Complete!',
        {
            font: 'bold 32px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }
    ).setOrigin(0.5);

    const bonusText = scene.add.text(
        scene.cameras.main.centerX,
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

    scene.levelCompleteElements = [levelCompleteText, bonusText];

    scene.tweens.add({
        targets: levelCompleteText,
        scale: { from: 0, to: 1 },
        duration: 500,
        ease: 'Back.out'
    });

    scene.tweens.add({
        targets: bonusText,
        scale: { from: 0, to: 1 },
        duration: 500,
        ease: 'Back.out',
        delay: 200
    });

    scene.time.delayedCall(1500, () => {
        cleanupLevelComplete(scene);
    });
}

function cleanupLevelComplete(scene) {
    if (scene.levelCompleteElements) {
        scene.tweens.add({
            targets: scene.levelCompleteElements,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                scene.levelCompleteElements.forEach(e => e.destroy());
                scene.levelCompleteElements = [];
            }
        });
    }
}
