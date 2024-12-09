import { pokemonDB, filters } from './pokemon';

// Different types of prompts we can generate
const promptTypes = {
    TYPE: 'type',
    WEAKNESS: 'weakness',
    EVOLUTION: 'evolution',
    CATEGORY: 'category'
};

// Difficulty settings
const difficultySettings = {
    1: { // Beginner
        promptTypes: [promptTypes.TYPE],
        wrongAnswerTypes: ['different-type'],
        gridSize: 4
    },
    2: { // Easy
        promptTypes: [promptTypes.TYPE, promptTypes.WEAKNESS],
        wrongAnswerTypes: ['different-type', 'similar-type'],
        gridSize: 4
    },
    3: { // Medium
        promptTypes: [promptTypes.TYPE, promptTypes.WEAKNESS, promptTypes.CATEGORY],
        wrongAnswerTypes: ['different-type', 'similar-type', 'same-weakness'],
        gridSize: 4
    },
    4: { // Hard
        promptTypes: [promptTypes.TYPE, promptTypes.WEAKNESS, promptTypes.EVOLUTION],
        wrongAnswerTypes: ['different-type', 'similar-type', 'same-weakness', 'same-category'],
        gridSize: 4
    }
};

function generatePrompt(level) {
    const difficulty = Math.min(Math.ceil(level / 3), 4); // Every 3 levels increase difficulty
    const settings = difficultySettings[difficulty];
    
    // Pick a random prompt type for this level
    const promptType = settings.promptTypes[Math.floor(Math.random() * settings.promptTypes.length)];
    
    switch(promptType) {
        case promptTypes.TYPE:
            return generateTypePrompt(settings);
        case promptTypes.WEAKNESS:
            return generateWeaknessPrompt(settings);
        case promptTypes.EVOLUTION:
            return generateEvolutionPrompt(settings);
        case promptTypes.CATEGORY:
            return generateCategoryPrompt(settings);
        default:
            return generateTypePrompt(settings);
    }
}

function generateTypePrompt(settings) {
    const types = ["Fire", "Water", "Grass", "Electric", "Psychic", "Ground", "Rock", "Flying"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const correctPokemon = filters.byType(type).map(p => p.name);
    const incorrectPokemon = Object.values(pokemonDB)
        .filter(p => !p.types.includes(type))
        .map(p => p.name);
    
    return {
        prompt: `${type} Type Pokémon`,
        answers: {
            correct: correctPokemon,
            incorrect: incorrectPokemon
        }
    };
}

// Add other prompt generators as needed...

export function getPromptForLevel(level) {
    return {
        level,
        ...generatePrompt(level)
    };
}

export function isAnswerCorrect(prompt, answer) {
    return prompt.answers.correct.includes(answer);
}