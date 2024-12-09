export default class Muncher {
    constructor(scene, gridManager) {
        this.scene = scene;
        this.gridManager = gridManager;
        
        // Starting position (top-left of grid)
        this.row = 0;
        this.col = 0;
        
        // Create sprite
        const startX = this.gridManager.startX + this.gridManager.tileSize / 2;
        const startY = this.gridManager.startY + this.gridManager.tileSize / 2;
        
        this.sprite = this.scene.add.sprite(startX, startY, 'muncher')
            .setOrigin(0.5)
            .setDepth(1);

        // Movement state
        this.isMoving = false;
        this.moveSpeed = 200;

        // Track whether touch is over control buttons
        this.touchingControls = false;

        // Touch input setup
        this.setupTouchControls();
    }

    setupTouchControls() {
        let startX = 0;
        let startY = 0;
        const swipeThreshold = 30;

        // Debug keyboard controls for desktop testing
        this.keys = this.scene.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            space: 'SPACE'
        });

        // Mouse/touch input
        this.scene.input.on('pointerdown', (pointer) => {
            if (!this.touchingControls) {
                startX = pointer.x;
                startY = pointer.y;
                console.log('Start position:', startX, startY); // Debug log
            }
        });

        this.scene.input.on('pointerup', (pointer) => {
            if (!this.touchingControls) {
                const dx = pointer.x - startX;
                const dy = pointer.y - startY;
                const time = pointer.upTime - pointer.downTime;
                
                console.log('Swipe delta:', dx, dy); // Debug log
                console.log('Swipe time:', time); // Debug log

                // Check if pointer is over the game grid
                const gridBounds = this.getGridBounds();
                if (pointer.x >= gridBounds.x && pointer.x <= gridBounds.x + gridBounds.width &&
                    pointer.y >= gridBounds.y && pointer.y <= gridBounds.y + gridBounds.height) {
                    
                    // If it's a quick tap, munch
                    if (time < 200 && Math.abs(dx) < swipeThreshold && Math.abs(dy) < swipeThreshold) {
                        this.munch();
                        return;
                    }
                    
                    // If it's a swipe
                    if (Math.abs(dx) > swipeThreshold || Math.abs(dy) > swipeThreshold) {
                        if (Math.abs(dx) > Math.abs(dy)) {
                            if (dx > 0) this.move('right');
                            else this.move('left');
                        } else {
                            if (dy > 0) this.move('down');
                            else this.move('up');
                        }
                    }
                }
            }
            this.touchingControls = false;
        });
    }

    getGridBounds() {
        return {
            x: this.gridManager.startX,
            y: this.gridManager.startY,
            width: this.gridManager.gridSize * this.gridManager.tileSize,
            height: this.gridManager.gridSize * this.gridManager.tileSize
        };
    }

    createVirtualDPad() {
        const padding = 20;
        const buttonSize = 60;
        const { height, width } = this.scene.cameras.main;

        // Create semi-transparent background for d-pad
        const dpadBg = this.scene.add.circle(
            padding + buttonSize, 
            height - padding - buttonSize,
            buttonSize * 1.2,
            0x000000,
            0.3
        ).setDepth(2);

        // Create directional buttons
        const buttons = {
            up: this.createDPadButton(dpadBg.x, dpadBg.y - buttonSize, '↑'),
            down: this.createDPadButton(dpadBg.x, dpadBg.y + buttonSize, '↓'),
            left: this.createDPadButton(dpadBg.x - buttonSize, dpadBg.y, '←'),
            right: this.createDPadButton(dpadBg.x + buttonSize, dpadBg.y, '→')
        };

        // Create munch button on the right side
        const munchButton = this.scene.add.circle(
            width - padding - buttonSize,
            height - padding - buttonSize,
            buttonSize,
            0x00ff00,
            0.3
        ).setDepth(2)
        .setInteractive()
        .on('pointerdown', () => {
            this.touchingControls = true;
            this.munch();
        });

        // Add "MUNCH" text to the button
        this.scene.add.text(
            munchButton.x,
            munchButton.y,
            'MUNCH',
            {
                fontFamily: 'Press Start 2P',
                fontSize: '12px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5).setDepth(2);
    }

    createDPadButton(x, y, symbol) {
        return this.scene.add.text(x, y, symbol, {
            fontFamily: 'Press Start 2P',
            fontSize: '24px',
            fill: '#ffffff'
        })
        .setOrigin(0.5)
        .setDepth(2)
        .setInteractive()
        .on('pointerdown', () => {
            this.touchingControls = true;
            switch(symbol) {
                case '↑': this.move('up'); break;
                case '↓': this.move('down'); break;
                case '←': this.move('left'); break;
                case '→': this.move('right'); break;
            }
        });
    }

    update() {
        // Debug keyboard controls
        if (!this.isMoving) {
            if (this.keys.up.isDown) this.move('up');
            else if (this.keys.down.isDown) this.move('down');
            else if (this.keys.left.isDown) this.move('left');
            else if (this.keys.right.isDown) this.move('right');
            else if (this.keys.space.isDown) this.munch();
        }
    }

    move(direction) {
        if (this.isMoving) return;

        let newRow = this.row;
        let newCol = this.col;

        switch (direction) {
            case 'up': newRow--; break;
            case 'down': newRow++; break;
            case 'left': newCol--; break;
            case 'right': newCol++; break;
        }

        // Check if new position is valid
        if (this.gridManager.isValidPosition(newRow, newCol)) {
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
                ease: 'Power1',
                onComplete: () => {
                    this.row = newRow;
                    this.col = newCol;
                    this.isMoving = false;
                }
            });
        }
    }

    munch() {
        if (this.isMoving) return;

        const isCorrect = this.gridManager.checkTile(this.row, this.col);
        
        // Play munch animation
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                // Emit event for game scene to handle scoring
                this.scene.events.emit('munch', {
                    row: this.row,
                    col: this.col,
                    isCorrect: isCorrect
                });
            }
        });
    }

    getPosition() {
        return { row: this.row, col: this.col };
    }

    reset() {
        // Reset to starting position
        this.row = 0;
        this.col = 0;
        this.sprite.x = this.gridManager.startX + this.gridManager.tileSize / 2;
        this.sprite.y = this.gridManager.startY + this.gridManager.tileSize / 2;
        this.isMoving = false;
    }
}