export default class GridManager {
    constructor(scene, config) {
        this.scene = scene;
        this.gridSize = config.gridSize || 4;
        this.tileSize = Math.min(scene.cameras.main.width, scene.cameras.main.height) * 0.15; // 15% of screen
        this.correctAnswerRatio = config.correctAnswerRatio || 0.35;
        
        // Calculate grid position
        const { width, height } = scene.cameras.main;
        this.gridWidth = this.tileSize * this.gridSize;
        this.startX = (width - this.gridWidth) / 2;
        this.startY = height * 0.3;

        // Initialize grid data
        this.grid = [];
        this.tiles = [];
        this.currentPrompt = null;
        this.correctAnswers = new Set();

        this.createGrid();
    }

    createGrid() {
        // Create the visual and logical grid
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            this.tiles[row] = [];
            
            for (let col = 0; col < this.gridSize; col++) {
                const x = this.startX + col * this.tileSize;
                const y = this.startY + row * this.tileSize;
                
                // Create tile background
                const tile = this.scene.add.rectangle(x, y, this.tileSize - 4, this.tileSize - 4, 0xE2E2E2)
                    .setOrigin(0)
                    .setInteractive();

                // Create text for the tile
                const text = this.scene.add.text(x + this.tileSize / 2, y + this.tileSize / 2, '', {
                    fontFamily: 'Press Start 2P',
                    fontSize: '14px',
                    fill: '#000000',
                    align: 'center',
                    wordWrap: { width: this.tileSize - 8 }
                }).setOrigin(0.5);

                this.grid[row][col] = {
                    tile,
                    text,
                    content: null,
                    isCorrect: false,
                    isEmpty: true
                };
                
                this.tiles[row][col] = tile;
            }
        }
    }

    setPrompt(prompt, answers) {
        this.currentPrompt = prompt;
        this.correctAnswers.clear();
        
        // Calculate how many correct answers we need
        const totalTiles = this.gridSize * this.gridSize;
        const correctCount = Math.ceil(totalTiles * this.correctAnswerRatio);
        
        // Make sure we have enough answers
        while (answers.correct.length < correctCount) {
            answers.correct.push(answers.correct[0]); // Duplicate correct answers if needed
        }
        while (answers.incorrect.length < (totalTiles - correctCount)) {
            answers.incorrect.push(answers.incorrect[0]); // Duplicate incorrect answers if needed
        }
        
        // Shuffle and slice the answers
        const correctAnswers = this.shuffle(answers.correct).slice(0, correctCount);
        const incorrectAnswers = this.shuffle(answers.incorrect).slice(0, totalTiles - correctCount);
        
        // Combine and shuffle all answers
        const allAnswers = this.shuffle([...correctAnswers, ...incorrectAnswers]);
        
        // Place answers on the grid
        let answerIndex = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const answer = allAnswers[answerIndex++];
                const isCorrect = correctAnswers.includes(answer);
                
                this.grid[row][col].content = answer;
                this.grid[row][col].isCorrect = isCorrect;
                this.grid[row][col].isEmpty = false;
                this.grid[row][col].text.setText(answer);
                
                if (isCorrect) {
                    this.correctAnswers.add(answer);
                }
            }
        }
    }

    checkTile(row, col) {
        if (!this.isValidPosition(row, col)) return false;
        
        const tile = this.grid[row][col];
        if (tile.isEmpty) return false;
        
        return tile.isCorrect;
    }

    clearTile(row, col) {
        if (!this.isValidPosition(row, col)) return;
        
        const tile = this.grid[row][col];
        tile.isEmpty = true;
        tile.content = null;
        tile.isCorrect = false;
        tile.text.setText('');
    }

    highlightTile(row, col, color = 0x7CFC00) {
        if (!this.isValidPosition(row, col)) return;
        
        const tile = this.grid[row][col].tile;
        tile.setFillStyle(color);
        
        // Reset after a short delay
        this.scene.time.delayedCall(200, () => {
            if (!tile.isEmpty) {
                tile.setFillStyle(0xE2E2E2);
            }
        });
    }

    isValidPosition(row, col) {
        return row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize;
    }

    getGridPosition(x, y) {
        const col = Math.floor((x - this.startX) / this.tileSize);
        const row = Math.floor((y - this.startY) / this.tileSize);
        
        if (this.isValidPosition(row, col)) {
            return { row, col };
        }
        return null;
    }

    shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    getAllCorrectAnswers() {
        return Array.from(this.correctAnswers);
    }

    getRemainingCorrectCount() {
        let count = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col].isCorrect) count++;
            }
        }
        return count;
    }
}