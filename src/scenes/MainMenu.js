export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Title
        const title = this.add.text(width / 2, height * 0.2, 'POKE MUNCHERS', {
            fontFamily: 'Press Start 2P',
            fontSize: '32px',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        // Create menu buttons
        this.createMenuButton(height * 0.4, 'Start Game', () => this.startGame());
        this.createMenuButton(height * 0.5, 'Leaderboard', () => this.showLeaderboard());
        this.createMenuButton(height * 0.6, 'Settings', () => this.showSettings());
        this.createMenuButton(height * 0.7, 'Remove Ads', () => this.removeAds());

        // Add version text
        this.add.text(width - 10, height - 10, 'v1.0.0', {
            fontFamily: 'Press Start 2P',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(1, 1);
    }

    createMenuButton(y, text, callback) {
        const button = this.add.text(this.cameras.main.width / 2, y, text, {
            fontFamily: 'Press Start 2P',
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
            padding: { x: 20, y: 10 },
            backgroundColor: '#0066CC'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => button.setScale(1.1))
        .on('pointerout', () => button.setScale(1))
        .on('pointerdown', callback);

        return button;
    }

    startGame() {
        this.scene.start('Game');
    }

    showLeaderboard() {
        // Will implement later
        console.log('Leaderboard clicked');
    }

    showSettings() {
        // Will implement later
        console.log('Settings clicked');
    }

    removeAds() {
        // Will implement later
        console.log('Remove Ads clicked');
    }
}