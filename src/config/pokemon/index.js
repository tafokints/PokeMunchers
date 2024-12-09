import { pokemonBase } from './base.js';
import { evolutionData } from './evolution.js';
import { pokemonMoves } from './moves.js';
import { typeSystem, getPokemonWeaknesses, getPokemonResistances } from './types.js';

// Validation functions
const Validators = {
    isValidNumber: (number) => {
        return typeof number === 'string' && 
               /^\d{3}$/.test(number) && 
               number >= "001" && 
               number <= "151";
    },

    isValidType: (type) => {
        return Object.keys(typeSystem.effectiveness).includes(type);
    },

    isValidStat: (stat) => {
        return ['hp', 'attack', 'defense', 'special', 'speed'].includes(stat);
    },

    isValidMove: (moveName) => {
        return Object.values(pokemonMoves).some(moves => 
            moves.levelUp.some(m => m.name === moveName) || 
            moves.tm.includes(moveName)
        );
    }
};

// Custom error class for Pokemon-related errors
class PokemonError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'PokemonError';
        this.code = code;
    }
}

const isBaseFormPokemon = (pokemon) => {
    try {
        // Must be Gen 1 Pokémon
        if (parseInt(pokemon.number) > 151) return false;

        const chain = evolutionData[pokemon.number];
        
        // Check if it evolves into a Gen 1 Pokémon
        const hasGen1Evolution = chain?.evolvesTo?.some(evolution => 
            parseInt(evolution.number) <= 151
        );

        return hasGen1Evolution;
    } catch (err) {
        console.warn(`Evolution check failed for ${pokemon.name}:`, err);
        return false;
    }
};

// Enhanced API with error handling and validation
export const PokemonAPI = {
    getPokemon: (number) => {
        if (!Validators.isValidNumber(number)) {
            throw new PokemonError(`Invalid Pokémon number: ${number}`, 'INVALID_NUMBER');
        }
        return pokemonBase[number];
    },

    getEvolutionChain: (number) => {
        if (!Validators.isValidNumber(number)) {
            throw new PokemonError(`Invalid Pokémon number: ${number}`, 'INVALID_NUMBER');
        }

        const chain = evolutionData[number];
        if (!chain) {
            return null;
        }

        // Ensure we only include Gen 1 evolutions (<=151)
        return {
            ...chain,
            evolvesTo: chain.evolvesTo?.filter(evolution => 
                parseInt(evolution.number) <= 151
            ) || [],
            evolvesFrom: chain.evolvesFrom && parseInt(chain.evolvesFrom) <= 151 
                ? chain.evolvesFrom 
                : null
        };
    },

    getMoves: (number) => {
        if (!Validators.isValidNumber(number)) {
            throw new PokemonError(`Invalid Pokémon number: ${number}`, 'INVALID_NUMBER');
        }
        return pokemonMoves[number];
    },

    getPokemonByType: (type) => {
        if (!Validators.isValidType(type)) {
            throw new PokemonError(`Invalid type: ${type}`, 'INVALID_TYPE');
        }
        return Object.values(pokemonBase).filter(pokemon => 
            pokemon.types.includes(type)
        );
    },

    getPokemonByMove: (moveName) => {
        if (!Validators.isValidMove(moveName)) {
            throw new PokemonError(`Invalid move: ${moveName}`, 'INVALID_MOVE');
        }
        return Object.values(pokemonBase).filter(pokemon => {
            const moves = pokemonMoves[pokemon.number];
            return moves.levelUp.some(m => m.name === moveName) ||
                   moves.tm.includes(moveName);
        });
    },

    getPokemonByStatRange: (stat, min, max) => {
        if (!Validators.isValidStat(stat)) {
            throw new PokemonError(`Invalid stat: ${stat}`, 'INVALID_STAT');
        }
        return Object.values(pokemonBase).filter(pokemon => 
            pokemon.baseStats[stat] >= min && 
            pokemon.baseStats[stat] <= max
        );
    },

    getFullEvolutionChain: (number) => {
        if (!Validators.isValidNumber(number)) {
            throw new PokemonError(`Invalid Pokémon number: ${number}`, 'INVALID_NUMBER');
        }
        const chain = new Set();
        const addToChain = (num) => {
            if (!evolutionData[num]) return;
            
            chain.add(num);
            
            if (evolutionData[num].evolvesFrom) {
                addToChain(evolutionData[num].evolvesFrom);
            }
            
            if (Array.isArray(evolutionData[num].evolvesTo)) {
                evolutionData[num].evolvesTo.forEach(evo => {
                    if (evo && evo.number) {
                        addToChain(evo.number);
                    }
                });
            }
        };
        
        addToChain(number);
        return Array.from(chain).sort();
    },

    getTypeEffectiveness: (attackType, defenseTypes) => {
        if (!Validators.isValidType(attackType)) {
            throw new PokemonError(`Invalid attack type: ${attackType}`, 'INVALID_TYPE');
        }
        if (!defenseTypes.every(Validators.isValidType)) {
            throw new PokemonError(`Invalid defense type(s): ${defenseTypes}`, 'INVALID_TYPE');
        }
        return typeSystem.getDualTypeEffectiveness(attackType, defenseTypes);
    },

    getRandomPokemon: () => {
        const numbers = Object.keys(pokemonBase);
        return pokemonBase[numbers[Math.floor(Math.random() * numbers.length)]];
    },

    getRandomPokemonOfType: (type) => {
        if (!Validators.isValidType(type)) {
            throw new PokemonError(`Invalid type: ${type}`, 'INVALID_TYPE');
        }
        const pokemonOfType = PokemonAPI.getPokemonByType(type);
        return pokemonOfType[Math.floor(Math.random() * pokemonOfType.length)];
    },

    searchPokemon: (query) => {
        query = query.toLowerCase();
        return Object.values(pokemonBase).filter(pokemon => 
            pokemon.name.toLowerCase().includes(query) ||
            pokemon.number.includes(query) ||
            pokemon.types.some(type => type.toLowerCase().includes(query))
        );
    }
};

// Constants for game configuration
export const GameConfig = {
    MAX_POKEMON_NUMBER: 151,
    TYPES: Object.keys(typeSystem.effectiveness),
    STATS: ['hp', 'attack', 'defense', 'special', 'speed'],
    DIFFICULTY_LEVELS: {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3
    }
};

// Export everything
export {
    pokemonBase,
    evolutionData,
    pokemonMoves,
    typeSystem,
    getPokemonWeaknesses,
    getPokemonResistances,
    PokemonError
};