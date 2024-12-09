import { PokemonAPI } from '../config/pokemon'

class QuestionGenerator {
    constructor() {
        this.currentLevel = 1
        this.questionTypes = ['TYPE_MATCHING', 'EVOLUTION_CHAIN', 'STAT_COMPARISON']
    }

    generateQuestion() {
        const type = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)]
        
        switch(type) {
            case 'TYPE_MATCHING':
                return this.generateTypeQuestion()
            case 'EVOLUTION_CHAIN':
                return this.generateEvolutionQuestion()
            case 'STAT_COMPARISON':
                return this.generateStatQuestion()
            default:
                return this.generateTypeQuestion()
        }
    }

    generateTypeQuestion() {
        const type = PokemonAPI.TYPES[Math.floor(Math.random() * PokemonAPI.TYPES.length)]
        const pokemonList = PokemonAPI.getPokemonByType(type)
        const correctPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)]
        
        // Get some wrong answers (Pokemon not of this type)
        const wrongPokemon = []
        while (wrongPokemon.length < 3) {
            const randomPokemon = PokemonAPI.getRandomPokemon()
            if (!randomPokemon.types.includes(type) && !wrongPokemon.includes(randomPokemon)) {
                wrongPokemon.push(randomPokemon)
            }
        }

        return {
            type: 'TYPE_MATCHING',
            question: `Which Pokémon is ${type} type?`,
            correctAnswer: correctPokemon,
            options: [...wrongPokemon, correctPokemon].sort(() => Math.random() - 0.5),
            difficulty: this.currentLevel
        }
    }

    generateEvolutionQuestion() {
        // Get a random Pokemon that has an evolution
        let pokemon
        do {
            pokemon = PokemonAPI.getRandomPokemon()
        } while (!PokemonAPI.getEvolutionChain(pokemon.number).evolvesTo.length)

        const evolution = PokemonAPI.getEvolutionChain(pokemon.number).evolvesTo[0]
        const correctPokemon = PokemonAPI.getPokemon(evolution.number)

        // Get wrong answers (Pokemon that aren't the correct evolution)
        const wrongPokemon = []
        while (wrongPokemon.length < 3) {
            const randomPokemon = PokemonAPI.getRandomPokemon()
            if (randomPokemon.number !== correctPokemon.number && !wrongPokemon.includes(randomPokemon)) {
                wrongPokemon.push(randomPokemon)
            }
        }

        return {
            type: 'EVOLUTION_CHAIN',
            question: `What does ${pokemon.name} evolve into?`,
            correctAnswer: correctPokemon,
            options: [...wrongPokemon, correctPokemon].sort(() => Math.random() - 0.5),
            difficulty: this.currentLevel
        }
    }

    generateStatQuestion() {
        const stats = ['hp', 'attack', 'defense', 'special', 'speed']
        const stat = stats[Math.floor(Math.random() * stats.length)]
        
        // Get two random Pokemon
        const pokemon1 = PokemonAPI.getRandomPokemon()
        let pokemon2
        do {
            pokemon2 = PokemonAPI.getRandomPokemon()
        } while (pokemon2.number === pokemon1.number)

        return {
            type: 'STAT_COMPARISON',
            question: `Which Pokémon has higher ${stat}?`,
            correctAnswer: pokemon1.baseStats[stat] > pokemon2.baseStats[stat] ? pokemon1 : pokemon2,
            options: [pokemon1, pokemon2].sort(() => Math.random() - 0.5),
            difficulty: this.currentLevel,
            stat: stat
        }
    }

    setDifficulty(level) {
        this.currentLevel = level
    }
}

export const questionGenerator = new QuestionGenerator()