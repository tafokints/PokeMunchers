export default class Enemy {
    constructor(scene, gridManager, targetMuncher) {
        this.scene = scene;
        this.gridManager = gridManager;
        this.muncher = targetMuncher;
        
        // Random starting position (edges of grid)
        const startPos = this.getRandomStartPosition();
        this.row = startPos.row;
        this.col = startPos.col;
        
        // Create sprite
        const startX = this.gridManager.startX + (this.col + 0.5) * this.gridManager.tileSize;
        const startY = this.gridManager.startY + (this.row + 0.5) * this.gridManager.tileSize;
        
        this.sprite = this.scene.add.sprite(startX, startY, 'enemy')
            .setOrigin(0.5)
            .setDepth(1);

        // Movement properties
        this.isMoving = false;
        this.moveSpeed = 400; // Slightly slower than muncher
        this.moveDelay = 1000; // Time between moves (ms)
        this.lastMoveTime = 0;
        
        // Start movement
        this.startMoving();
    }

    getRandomStartPosition() {
        const gridSize = this.gridManager.gridSize;
        const positions = [];

        // Add top and bottom edges
        for (let i = 0; i < gridSize; i++) {
            positions.push({ row: 0, col: i });            // Top edge
            positions.push({ row: gridSize - 1, col: i }); // Bottom edge
        }
        // Add left and right edges (excluding corners)
        for (let i = 1; i < gridSize - 1; i++) {
            positions.push({ row: i, col: 0 });            // Left edge
            positions.push({ row: i, col: gridSize - 1 }); // Right edge
        }

        return positions[Math.floor(Math.random() * positions.length)];
    }

    startMoving() {
        this.moveTimer = this.scene.time.addEvent({
            delay: this.moveDelay,
            callback: this.moveTowardsMuncher,
            callbackScope: this,
            loop: true
        });
    }

    moveTowardsMuncher() {
        if (this.isMoving) return;

        const muncherPos = this.muncher.getPosition();
        const moves = this.getPossibleMoves();
        
        // Find the move that gets us closest to the muncher
        let bestMove = null;
        let bestDistance = Infinity;

        moves.forEach(move => {
            const distance = this.getDistance(move, muncherPos);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMove = move;
            }
        });

        if (bestMove) {
            this.moveTo(bestMove.row, bestMove.col);
        }
    }

    getPossibleMoves() {
        const moves = [];
        const directions = [
            { row: -1, col: 0 },  // Up
            { row: 1, col: 0 },   // Down
            { row: 0, col: -1 },  // Left
            { row: 0, col: 1 }    // Right
        ];

        directions.forEach(dir => {
            const newRow = this.row + dir.row;
            const newCol = this.col + dir.col;
            
            if (this.gridManager.isValidPosition(newRow, newCol)) {
                moves.push({ row: newRow, col: newCol });
            }
        });

        return moves;
    }

    getDistance(pos1, pos2) {
        // Manhattan distance
        return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
    }

    moveTo(newRow, newCol) {
        this.isMoving = true;

        // Calculate new position in pixels
        const newX = this.gridManager.startX + (newCol + 0.5) * this.gridManager.tileSize;
        const newY = this.gridManager.startY + (newRow + 0.5) * this.gridManager.tileSize;

        // Move sprite
        this.scene.tweens.add({
            targets: this.sprite,
            x: newX,
            y: newY,
            duration: this.moveSpeed,
            ease: 'Linear',
            onComplete: () => {
                this.row = newRow;
                this.col = newCol;
                this.isMoving = false;
                
                // Check for collision with muncher
                const muncherPos = this.muncher.getPosition();
                if (this.row === muncherPos.row && this.col === muncherPos.col) {
                    this.scene.events.emit('enemyCollision');
                }
            }
        });
    }

    update() {
        // Additional update logic if needed
    }

    destroy() {
        if (this.moveTimer) {
            this.moveTimer.destroy();
        }
        this.sprite.destroy();
    }

    getPosition() {
        return { row: this.row, col: this.col };
    }
}