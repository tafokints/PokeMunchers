export function createGrid(scene) {
    const { width, height, cellSize, padding, startY } = scene.gridConfig;
    const totalWidth = width * (cellSize + padding) - padding;
    const startX = (scene.cameras.main.width - totalWidth) / 2;

    scene.gridCells = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cellX = startX + x * (cellSize + padding);
            const cellY = startY + y * (cellSize + padding);

            const cell = scene.add.rectangle(cellX, cellY, cellSize, cellSize, 0x444444).setOrigin(0, 0);
            cell.setStrokeStyle(1, 0x666666);
            scene.gridCells.push(cell);
        }
    }
}

export function displayAnswers(scene, levelData) {
    if (!levelData || !levelData.answers) return;

    // Clear existing answers
    if (scene.answerTexts) {
        scene.answerTexts.forEach(text => text?.destroy());
    }
    scene.answerTexts = [];

    const { width, height, cellSize, padding, startY } = scene.gridConfig;
    const totalWidth = width * (cellSize + padding) - padding;
    const startX = (scene.cameras.main.width - totalWidth) / 2;

    const allAnswers = [...levelData.answers.correct, ...levelData.answers.incorrect];
    
    // Shuffle answers (Fisher-Yates)
    for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }

    // Fill remaining cells with empty strings if needed
    while (allAnswers.length < width * height) {
        allAnswers.push('');
    }

    allAnswers.forEach((answer, index) => {
        const x = index % width;
        const y = Math.floor(index / width);

        const cellX = startX + x * (cellSize + padding);
        const cellY = startY + y * (cellSize + padding);

        if (answer) {
            const fontSize = answer.length > 8 ? '14px' : '18px';
            const text = scene.add.text(
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
            scene.answerTexts.push(text);
        } else {
            scene.answerTexts.push(null);
        }
    });
}
