export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background
        this.add.rectangle(0, 0, width, height, 0x000000)
            .setOrigin(0);
        
        // Game Over text
        this.add.text(width/2, height/2 - 50, 'GAME OVER', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Final score
        this.add.text(width/2, height/2 + 10, `Final Score: ${this.finalScore}`, {
            font: '24px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Play Again button
        const playAgainButton = this.add.rectangle(width/2, height/2 + 70, 160, 50, 0x666666)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => playAgainButton.setFillStyle(0x888888))
            .on('pointerout', () => playAgainButton.setFillStyle(0x666666))
            .on('pointerdown', () => this.scene.start('Game'));
            
        playAgainButton.setStrokeStyle(2, 0x888888);
        
        this.add.text(width/2, height/2 + 70, 'Play Again', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Main Menu button
        const menuButton = this.add.rectangle(width/2, height/2 + 140, 160, 50, 0x666666)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuButton.setFillStyle(0x888888))
            .on('pointerout', () => menuButton.setFillStyle(0x666666))
            .on('pointerdown', () => this.scene.start('MainMenu'));
            
        menuButton.setStrokeStyle(2, 0x888888);
        
        this.add.text(width/2, height/2 + 140, 'Main Menu', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
}
