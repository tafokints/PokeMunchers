export const typeSystem = {
    effectiveness: {
        "Normal": {
            superEffective: [],
            notVeryEffective: ["Rock", "Steel"],
            noEffect: ["Ghost"]
        },
        "Fire": {
            superEffective: ["Grass", "Ice", "Bug", "Steel"],
            notVeryEffective: ["Fire", "Water", "Rock", "Dragon"],
            noEffect: []
        },
        "Water": {
            superEffective: ["Fire", "Ground", "Rock"],
            notVeryEffective: ["Water", "Grass", "Dragon"],
            noEffect: []
        },
        "Electric": {
            superEffective: ["Water", "Flying"],
            notVeryEffective: ["Electric", "Grass", "Dragon"],
            noEffect: ["Ground"]
        },
        "Grass": {
            superEffective: ["Water", "Ground", "Rock"],
            notVeryEffective: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"],
            noEffect: []
        },
        "Ice": {
            superEffective: ["Grass", "Ground", "Flying", "Dragon"],
            notVeryEffective: ["Fire", "Water", "Ice", "Steel"],
            noEffect: []
        },
        "Fighting": {
            superEffective: ["Normal", "Ice", "Rock", "Steel"],
            notVeryEffective: ["Poison", "Flying", "Psychic", "Bug"],
            noEffect: ["Ghost"]
        },
        "Poison": {
            superEffective: ["Grass"],
            notVeryEffective: ["Poison", "Ground", "Rock", "Ghost"],
            noEffect: ["Steel"]
        },
        "Ground": {
            superEffective: ["Fire", "Electric", "Poison", "Rock", "Steel"],
            notVeryEffective: ["Grass", "Bug"],
            noEffect: ["Flying"]
        },
        "Flying": {
            superEffective: ["Grass", "Fighting", "Bug"],
            notVeryEffective: ["Electric", "Rock", "Steel"],
            noEffect: []
        },
        "Psychic": {
            superEffective: ["Fighting", "Poison"],
            notVeryEffective: ["Psychic", "Steel"],
            noEffect: ["Dark"]
        },
        "Bug": {
            superEffective: ["Grass", "Psychic"],
            notVeryEffective: ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel"],
            noEffect: []
        },
        "Rock": {
            superEffective: ["Fire", "Ice", "Flying", "Bug"],
            notVeryEffective: ["Fighting", "Ground", "Steel"],
            noEffect: []
        },
        "Ghost": {
            superEffective: ["Psychic", "Ghost"],
            notVeryEffective: ["Steel"],
            noEffect: ["Normal"]
        },
        "Dragon": {
            superEffective: ["Dragon"],
            notVeryEffective: ["Steel"],
            noEffect: []
        },
        "Steel": {
            superEffective: ["Ice", "Rock"],
            notVeryEffective: ["Fire", "Water", "Electric", "Steel"],
            noEffect: []
        }
    },
    
    // Type colors for UI
    colors: {
        "Normal": "#A8A878",
        "Fire": "#F08030",
        "Water": "#6890F0",
        "Electric": "#F8D030",
        "Grass": "#78C850",
        "Ice": "#98D8D8",
        "Fighting": "#C03028",
        "Poison": "#A040A0",
        "Ground": "#E0C068",
        "Flying": "#A890F0",
        "Psychic": "#F85888",
        "Bug": "#A8B820",
        "Rock": "#B8A038",
        "Ghost": "#705898",
        "Dragon": "#7038F8",
        "Steel": "#B8B8D0"
    },

    // Updated effectiveness calculation
    getEffectiveness: (attackType, defenseType) => {
        const effectiveness = typeSystem.effectiveness[attackType];
        
        // Check immunities first (0x damage)
        if (effectiveness.noEffect.includes(defenseType)) {
            return 0;
        }
        
        // Check super effective (2x damage)
        if (effectiveness.superEffective.includes(defenseType)) {
            return 2;
        }
        
        // Check not very effective (0.5x damage)
        if (effectiveness.notVeryEffective.includes(defenseType)) {
            return 0.5;
        }
        
        // Normal effectiveness (1x damage)
        return 1;
    },

    // Updated dual-type effectiveness calculation
    getDualTypeEffectiveness: (attackType, defenseTypes) => {
        // If any type provides immunity, the whole attack is nullified
        if (defenseTypes.some(defType => 
            typeSystem.effectiveness[attackType].noEffect.includes(defType))) {
            return 0;
        }

        // Calculate combined effectiveness
        return defenseTypes.reduce((multiplier, defenseType) => 
            multiplier * typeSystem.getEffectiveness(attackType, defenseType), 1
        );
    },

    // Get color for type
    getTypeColor: (type) => typeSystem.colors[type] || "#68A090"  // Default color if type not found
};

// Helper function to get weaknesses for a Pokémon
export function getPokemonWeaknesses(types) {
    const weaknesses = new Set();
    const allTypes = Object.keys(typeSystem.effectiveness);
    
    allTypes.forEach(attackType => {
        const effectiveness = typeSystem.getDualTypeEffectiveness(attackType, types);
        if (effectiveness > 1) {
            weaknesses.add(attackType);
        }
    });
    
    return Array.from(weaknesses);
}

// Helper function to get resistances for a Pokémon
export function getPokemonResistances(types) {
    const resistances = new Set();
    const allTypes = Object.keys(typeSystem.effectiveness);
    
    allTypes.forEach(attackType => {
        const effectiveness = typeSystem.getDualTypeEffectiveness(attackType, types);
        if (effectiveness < 1) {
            resistances.add(attackType);
        }
    });
    
    return Array.from(resistances);
}