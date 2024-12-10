import Phaser from 'phaser';

class PreLoadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        this.load.image('muncher', 'assets/images/muncher.png');
    }

    create() {
        // Import Pokemon data dynamically to avoid potential parsing issues
        import('../../config/pokemon/base.js').then(({ pokemonBase }) => {
            import('../../config/pokemon/types.js').then(({ typeSystem }) => {
                import('../../config/pokemon/evolution.js').then(({ evolutionData }) => {
                    this.game.pokemon = {
                        base: pokemonBase,
                        types: typeSystem,
                        evolution: evolutionData
                    };
                    this.scene.start('MainMenu');
                });
            });
        });
    }
}

export default PreLoadScene;
