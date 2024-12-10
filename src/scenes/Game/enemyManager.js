export function spawnEnemy(scene, speed = 100) {
    const { width, height, cellSize, padding, startY } = scene.gridConfig;
    const totalWidth = width * (cellSize + padding) - padding;
    const startX = (scene.cameras.main.width - totalWidth) / 2;

    const enemy = scene.add.sprite(0, 0, 'enemy').setScale(0.5);
    enemy.gridPos = {
        x: Phaser.Math.Between(0, 3),
        y: Phaser.Math.Between(0, 3)
    };

    enemy.x = startX + enemy.gridPos.x * (cellSize + padding) + cellSize/2;
    enemy.y = startY + enemy.gridPos.y * (cellSize + padding) + cellSize/2;

    scene.enemies.push(enemy);
    moveEnemy(scene, enemy, 400);
}

function moveEnemy(scene, enemy, speed) {
    if (!scene.muncher || scene.isGamePaused || scene.isFrozen) return;

    const { width, height, cellSize, padding, startY } = scene.gridConfig;
    const totalWidth = width * (cellSize + padding) - padding;
    const startX = (scene.cameras.main.width - totalWidth) / 2;

    const dx = scene.muncherPos.x - enemy.gridPos.x;
    const dy = scene.muncherPos.y - enemy.gridPos.y;
    const possibleMoves = [];

    if (enemy.gridPos.x > 0) possibleMoves.push({ x: -1, y: 0, weight: dx < 0 ? 2 : 1 });
    if (enemy.gridPos.x < 3) possibleMoves.push({ x: 1, y: 0, weight: dx > 0 ? 2 : 1 });
    if (enemy.gridPos.y > 0) possibleMoves.push({ x: 0, y: -1, weight: dy < 0 ? 2 : 1 });
    if (enemy.gridPos.y < 3) possibleMoves.push({ x: 0, y: 1, weight: dy > 0 ? 2 : 1 });

    let weightedMoves = [];
    possibleMoves.forEach(move => {
        for (let i = 0; i < move.weight; i++) {
            weightedMoves.push({ x: move.x, y: move.y });
        }
    });

    const moveChoice = Phaser.Utils.Array.GetRandom(weightedMoves);
    enemy.gridPos.x += moveChoice.x;
    enemy.gridPos.y += moveChoice.y;

    const newX = startX + enemy.gridPos.x * (cellSize + padding) + cellSize/2;
    const newY = startY + enemy.gridPos.y * (cellSize + padding) + cellSize/2;

    scene.tweens.add({
        targets: enemy,
        x: newX,
        y: newY,
        duration: speed,
        ease: 'Linear',
        onComplete: () => {
            if (enemy.active) {
                scene.time.delayedCall(Phaser.Math.Between(500, 1000), () => {
                    moveEnemy(scene, enemy, speed);
                });
            }
        }
    });
}

export function checkEnemyCollisions(scene) {
    if (scene.isInvulnerable || !scene.muncher) return;

    scene.enemies.forEach(enemy => {
        if (!enemy.active) return;
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, scene.muncher.x, scene.muncher.y);
        if (distance < 30) {
            handleEnemyCollision(scene);
        }
    });
}

function handleEnemyCollision(scene) {
    if (scene.isInvulnerable) return;

    scene.lives--;
    scene.livesText.setText('♥'.repeat(scene.lives));
    scene.isInvulnerable = true;
    scene.muncher.alpha = 0.5;
    scene.cameras.main.shake(250, 0.01);

    if (scene.lives <= 0) {
        scene.scene.start('GameOver', { score: scene.score });
        return;
    }

    scene.time.delayedCall(2000, () => {
        scene.isInvulnerable = false;
        scene.muncher.alpha = 1;
    });
}
