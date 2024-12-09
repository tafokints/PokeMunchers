export const pokemonDB = {
    "001": {
        name: "Bulbasaur",
        number: "001",
        types: ["Grass", "Poison"],
        height: "0.7 m",
        weight: "6.9 kg",
        baseStats: {
            hp: 45,
            attack: 49,
            defense: 49,
            spAtk: 65,
            spDef: 65,
            speed: 45
        },
        moves: {
            levelUp: [
                { level: 1, name: "Tackle", type: "Normal" },
                { level: 1, name: "Growl", type: "Normal" },
                { level: 3, name: "Vine Whip", type: "Grass" },
                { level: 6, name: "Growth", type: "Normal" },
                { level: 9, name: "Leech Seed", type: "Grass" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["002"]
    },
    "004": {
        name: "Charmander",
        number: "004",
        types: ["Fire"],
        height: "0.6 m",
        weight: "8.5 kg",
        baseStats: {
            hp: 39,
            attack: 52,
            defense: 43,
            spAtk: 60,
            spDef: 50,
            speed: 65
        },
        moves: {
            levelUp: [
                { level: 1, name: "Scratch", type: "Normal" },
                { level: 1, name: "Growl", type: "Normal" },
                { level: 4, name: "Ember", type: "Fire" },
                { level: 8, name: "Smokescreen", type: "Normal" },
                { level: 12, name: "Dragon Breath", type: "Dragon" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["005"]
    },
    "007": {
        name: "Squirtle",
        number: "007",
        types: ["Water"],
        height: "0.5 m",
        weight: "9.0 kg",
        baseStats: {
            hp: 44,
            attack: 48,
            defense: 65,
            spAtk: 50,
            spDef: 64,
            speed: 43
        },
        moves: {
            levelUp: [
                { level: 1, name: "Tackle", type: "Normal" },
                { level: 1, name: "Tail Whip", type: "Normal" },
                { level: 3, name: "Water Gun", type: "Water" },
                { level: 6, name: "Withdraw", type: "Water" },
                { level: 9, name: "Bubble", type: "Water" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["008"]
    },
    "025": {
        name: "Pikachu",
        number: "025",
        types: ["Electric"],
        height: "0.4 m",
        weight: "6.0 kg",
        baseStats: {
            hp: 35,
            attack: 55,
            defense: 40,
            spAtk: 50,
            spDef: 50,
            speed: 90
        },
        moves: {
            levelUp: [
                { level: 1, name: "Thunder Shock", type: "Electric" },
                { level: 1, name: "Growl", type: "Normal" },
                { level: 4, name: "Tail Whip", type: "Normal" },
                { level: 8, name: "Quick Attack", type: "Normal" },
                { level: 12, name: "Thunder Wave", type: "Electric" }
            ]
        },
        evolvesFrom: "172",
        evolvesTo: ["026"]
    },
    "037": {
        name: "Vulpix",
        number: "037",
        types: ["Fire"],
        height: "0.6 m",
        weight: "9.9 kg",
        baseStats: {
            hp: 38,
            attack: 41,
            defense: 40,
            spAtk: 50,
            spDef: 65,
            speed: 65
        },
        moves: {
            levelUp: [
                { level: 1, name: "Ember", type: "Fire" },
                { level: 4, name: "Tail Whip", type: "Normal" },
                { level: 8, name: "Quick Attack", type: "Normal" },
                { level: 12, name: "Fire Spin", type: "Fire" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["038"]
    },
    "043": {
        name: "Oddish",
        number: "043",
        types: ["Grass", "Poison"],
        height: "0.5 m",
        weight: "5.4 kg",
        baseStats: {
            hp: 45,
            attack: 50,
            defense: 55,
            spAtk: 75,
            spDef: 65,
            speed: 30
        },
        moves: {
            levelUp: [
                { level: 1, name: "Absorb", type: "Grass" },
                { level: 4, name: "Growth", type: "Normal" },
                { level: 8, name: "Sweet Scent", type: "Normal" },
                { level: 12, name: "Acid", type: "Poison" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["044"]
    },
    "058": {
        name: "Growlithe",
        number: "058",
        types: ["Fire"],
        height: "0.7 m",
        weight: "19.0 kg",
        baseStats: {
            hp: 55,
            attack: 70,
            defense: 45,
            spAtk: 70,
            spDef: 50,
            speed: 60
        },
        moves: {
            levelUp: [
                { level: 1, name: "Bite", type: "Dark" },
                { level: 1, name: "Roar", type: "Normal" },
                { level: 4, name: "Ember", type: "Fire" },
                { level: 8, name: "Leer", type: "Normal" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["059"]
    },
    "060": {
        name: "Poliwag",
        number: "060",
        types: ["Water"],
        height: "0.6 m",
        weight: "12.4 kg",
        baseStats: {
            hp: 40,
            attack: 50,
            defense: 40,
            spAtk: 40,
            spDef: 40,
            speed: 90
        },
        moves: {
            levelUp: [
                { level: 1, name: "Water Gun", type: "Water" },
                { level: 5, name: "Hypnosis", type: "Psychic" },
                { level: 8, name: "Bubble", type: "Water" },
                { level: 11, name: "Double Slap", type: "Normal" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["061"]
    },
    "063": {
        name: "Abra",
        number: "063",
        types: ["Psychic"],
        height: "0.9 m",
        weight: "19.5 kg",
        baseStats: {
            hp: 25,
            attack: 20,
            defense: 15,
            spAtk: 105,
            spDef: 55,
            speed: 90
        },
        moves: {
            levelUp: [
                { level: 1, name: "Teleport", type: "Psychic" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["064"]
    },
    "066": {
        name: "Machop",
        number: "066",
        types: ["Fighting"],
        height: "0.8 m",
        weight: "19.5 kg",
        baseStats: {
            hp: 70,
            attack: 80,
            defense: 50,
            spAtk: 35,
            spDef: 35,
            speed: 35
        },
        moves: {
            levelUp: [
                { level: 1, name: "Low Kick", type: "Fighting" },
                { level: 1, name: "Leer", type: "Normal" },
                { level: 4, name: "Focus Energy", type: "Normal" },
                { level: 8, name: "Karate Chop", type: "Fighting" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["067"]
    },
    "016": {
        name: "Pidgey",
        number: "016",
        types: ["Normal", "Flying"],
        height: "0.3 m",
        weight: "1.8 kg",
        baseStats: {
            hp: 40,
            attack: 45,
            defense: 40,
            spAtk: 35,
            spDef: 35,
            speed: 56
        },
        moves: {
            levelUp: [
                { level: 1, name: "Tackle", type: "Normal" },
                { level: 5, name: "Sand Attack", type: "Ground" },
                { level: 9, name: "Gust", type: "Flying" },
                { level: 13, name: "Quick Attack", type: "Normal" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["017"]
    },
    "074": {
        name: "Geodude",
        number: "074",
        types: ["Rock", "Ground"],
        height: "0.4 m",
        weight: "20.0 kg",
        baseStats: {
            hp: 40,
            attack: 80,
            defense: 100,
            spAtk: 30,
            spDef: 30,
            speed: 20
        },
        moves: {
            levelUp: [
                { level: 1, name: "Tackle", type: "Normal" },
                { level: 4, name: "Defense Curl", type: "Normal" },
                { level: 8, name: "Rock Throw", type: "Rock" },
                { level: 12, name: "Magnitude", type: "Ground" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["075"]
    },
    "092": {
        name: "Gastly",
        number: "092",
        types: ["Ghost", "Poison"],
        height: "1.3 m",
        weight: "0.1 kg",
        baseStats: {
            hp: 30,
            attack: 35,
            defense: 30,
            spAtk: 100,
            spDef: 35,
            speed: 80
        },
        moves: {
            levelUp: [
                { level: 1, name: "Lick", type: "Ghost" },
                { level: 1, name: "Hypnosis", type: "Psychic" },
                { level: 5, name: "Spite", type: "Ghost" },
                { level: 8, name: "Mean Look", type: "Normal" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["093"]
    },
    "081": {
        name: "Magnemite",
        number: "081",
        types: ["Electric", "Steel"],
        height: "0.3 m",
        weight: "6.0 kg",
        baseStats: {
            hp: 25,
            attack: 35,
            defense: 70,
            spAtk: 95,
            spDef: 55,
            speed: 45
        },
        moves: {
            levelUp: [
                { level: 1, name: "Thunder Shock", type: "Electric" },
                { level: 4, name: "Tackle", type: "Normal" },
                { level: 7, name: "Sonic Boom", type: "Normal" },
                { level: 11, name: "Thunder Wave", type: "Electric" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["082"]
    },
    "120": {
        name: "Staryu",
        number: "120",
        types: ["Water"],
        height: "0.8 m",
        weight: "34.5 kg",
        baseStats: {
            hp: 30,
            attack: 45,
            defense: 55,
            spAtk: 70,
            spDef: 55,
            speed: 85
        },
        moves: {
            levelUp: [
                { level: 1, name: "Tackle", type: "Normal" },
                { level: 4, name: "Water Gun", type: "Water" },
                { level: 7, name: "Rapid Spin", type: "Normal" },
                { level: 10, name: "Recover", type: "Normal" }
            ]
        },
        evolvesFrom: null,
        evolvesTo: ["121"]
    }
};

// ... rest of the filters code stays the same ...

// Helper functions for filtering and question generation
export const filters = {
    byType: (type) => Object.values(pokemonDB).filter(p => p.types.includes(type)),
    byMoveType: (type) => Object.values(pokemonDB).filter(p => 
        p.moves.levelUp.some(m => m.type === type) || 
        p.moves.tm.some(m => m.type === type)
    ),
    byStatThreshold: (stat, value) => Object.values(pokemonDB).filter(p => 
        p.baseStats[stat] >= value
    ),
    byWeightRange: (min, max) => Object.values(pokemonDB).filter(p => {
        const weight = parseFloat(p.weight.split(' ')[0]);
        return weight >= min && weight <= max;
    }),
    byHeightRange: (min, max) => Object.values(pokemonDB).filter(p => {
        const height = parseFloat(p.height.split(' ')[0]);
        return height >= min && height <= max;
    }),
    byEvolutionStage: (stage) => {
        switch(stage) {
            case 1: return Object.values(pokemonDB).filter(p => !p.evolvesFrom);
            case 2: return Object.values(pokemonDB).filter(p => p.evolvesFrom && p.evolvesTo.length > 0);
            case 3: return Object.values(pokemonDB).filter(p => p.evolvesFrom && p.evolvesTo.length === 0);
            default: return [];
        }
    }
};
export const questionTypes = {
    TYPE_MATCHING: {
        id: 'TYPE_MATCHING',
        minLevel: 1,
        maxLevel: 3,
        generate: () => {
            const types = ["Fire", "Water", "Grass", "Electric", "Normal", "Flying", "Rock", "Ground", "Ghost", "Poison", "Steel"];
            const type = types[Math.floor(Math.random() * types.length)];
            return {
                prompt: `Find all ${type} type Pokémon`,
                answers: {
                    correct: Object.values(pokemonDB).filter(p => p.types.includes(type)).map(p => p.name),
                    incorrect: Object.values(pokemonDB).filter(p => !p.types.includes(type)).map(p => p.name)
                }
            };
        }
    },
    DUAL_TYPE: {
        id: 'DUAL_TYPE',
        minLevel: 4,
        maxLevel: 6,
        generate: () => {
            const dualTypes = Object.values(pokemonDB)
                .filter(p => p.types.length === 2)
                .map(p => p.types);
            const randomDualType = dualTypes[Math.floor(Math.random() * dualTypes.length)];
            return {
                prompt: `Find Pokémon that are both ${randomDualType[0]} and ${randomDualType[1]} type`,
                answers: {
                    correct: Object.values(pokemonDB)
                        .filter(p => p.types.includes(randomDualType[0]) && p.types.includes(randomDualType[1]))
                        .map(p => p.name),
                    incorrect: Object.values(pokemonDB)
                        .filter(p => !p.types.includes(randomDualType[0]) || !p.types.includes(randomDualType[1]))
                        .map(p => p.name)
                }
            };
        }
    },
    STATS: {
        id: 'STATS',
        minLevel: 7,
        maxLevel: 9,
        generate: () => {
            const stats = ["hp", "attack", "defense", "spAtk", "spDef", "speed"];
            const stat = stats[Math.floor(Math.random() * stats.length)];
            const threshold = 60; // Adjustable threshold
            return {
                prompt: `Find Pokémon with ${stat} over ${threshold}`,
                answers: {
                    correct: Object.values(pokemonDB)
                        .filter(p => p.baseStats[stat] > threshold)
                        .map(p => p.name),
                    incorrect: Object.values(pokemonDB)
                        .filter(p => p.baseStats[stat] <= threshold)
                        .map(p => p.name)
                }
            };
        }
    }
};

export function getQuestionForLevel(level) {
    // Filter question types appropriate for this level
    const availableTypes = Object.values(questionTypes)
        .filter(type => level >= type.minLevel && level <= type.maxLevel);
    
    // Pick a random question type from available ones
    const questionType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    // Generate and return the question
    return questionType.generate();
}