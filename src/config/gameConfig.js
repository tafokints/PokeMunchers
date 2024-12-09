const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 360,  // Standard mobile width
    height: 640, // 16:9 aspect ratio
    backgroundColor: '#1E1E2E',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: Phaser.Scale.PORTRAIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

export default gameConfig;