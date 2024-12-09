import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MainMenu from './scenes/MainMenu';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 390,
    height: 844,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        PreloadScene,    // Loads assets first
        MainMenu,       // Then shows menu
        GameScene,       // Main gameplay
        GameOverScene    // Game over screen
    ]
};

const game = new Phaser.Game(config);

// Optional: Handle window resize
window.addEventListener('resize', () => {
    game.scale.refresh();
});