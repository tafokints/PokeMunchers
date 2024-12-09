export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontFamily: 'Press Start 2P',
            fontSize: '20px',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        // Loading bar progress events
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Load images
        this.load.image('muncher', 'assets/images/muncher.png');
        this.load.image('enemy', 'assets/images/enemy.png');
        this.load.image('tileset', 'assets/images/tileset.png');
    }

    create() {
        // Initialize game settings
        this.game.config.gameSettings = {
            initialLives: 3,
            baseTime: 120,
            gridSize: 4,
            correctAnswerRatio: 0.35,
            enemySpawnLevel: 4
        };

        // Transition to MainMenu
        this.scene.start('MainMenu');
    }
}