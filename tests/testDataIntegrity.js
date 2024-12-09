import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PokemonAPI, GameConfig, PokemonError } from '../src/config/pokemon/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testDataIntegrity() {
    console.log('Starting data integrity tests...\n');
    let errors = 0;
    let warnings = 0;

    // Test basic data access
    try {
        console.log('Testing basic data access...');
        const pokemon = PokemonAPI.getPokemon('001');
        console.log(`✓ Successfully loaded Pokémon #001 (${pokemon.name})`);
    } catch (error) {
        console.error('✗ Failed to load basic Pokémon data:', error);
        errors++;
    }

    // Test type-based functions
    try {
        console.log('\nTesting type-based functions...');
        GameConfig.TYPES.forEach(type => {
            const pokemonOfType = PokemonAPI.getPokemonByType(type);
            console.log(`✓ Found ${pokemonOfType.length} ${type}-type Pokémon`);
            if (pokemonOfType.length === 0) {
                console.warn(`⚠ Warning: No Pokémon found for type ${type}`);
                warnings++;
            }
        });
    } catch (error) {
        console.error('✗ Failed type-based tests:', error);
        errors++;
    }

    // Test evolution chains
    try {
        console.log('\nTesting evolution chains...');
        const chain = PokemonAPI.getFullEvolutionChain('001');
        console.log(`✓ Successfully loaded evolution chain for #001 (${chain.length} members)`);
    } catch (error) {
        console.error('✗ Failed evolution chain test:', error);
        errors++;
    }

    // Test move data
    try {
        console.log('\nTesting move data...');
        const moves = PokemonAPI.getMoves('025');  // Pikachu
        console.log(`✓ Successfully loaded moves for #025 (${moves.levelUp.length} level-up moves, ${moves.tm.length} TM moves)`);
    } catch (error) {
        console.error('✗ Failed move data test:', error);
        errors++;
    }

    console.log('\nTest summary:');
    console.log(`Errors: ${errors}`);
    console.log(`Warnings: ${warnings}`);
}

testDataIntegrity().catch(console.error);