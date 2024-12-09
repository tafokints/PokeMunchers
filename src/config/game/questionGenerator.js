import { GameConfig, PokemonAPI } from '../../config/pokemon/index.js'
import { pokemonBase, typeSystem, getPokemonWeaknesses, getPokemonResistances } from '../pokemon/index.js'
import { evolutionData } from '../pokemon/evolution'

class QuestionGenerator {
    constructor(config = {}) {
        // Grid configuration
        this.GRID_SIZE = 16; // 4x4 grid
        this.MIN_CORRECT_ANSWERS = 1;
        this.MAX_ATTEMPTS = 3;

        // Game state
        this.currentLevel = config.currentLevel || 1;
        
        // API access
        this.PokemonAPI = config.PokemonAPI;

        // Question types and their minimum levels
        this.questionTypes = {
            'TYPE_MATCHING': {
                minLevel: GameConfig.DIFFICULTY_LEVELS.EASY,
                generator: this.generateTypeQuestion.bind(this),
                fallback: true
            },
            'MOVE_LEARNING': {
                minLevel: GameConfig.DIFFICULTY_LEVELS.MEDIUM,
                generator: this.generateMoveQuestion.bind(this),
                fallback: false
            },
            'TYPE_WEAKNESS': {
                minLevel: GameConfig.DIFFICULTY_LEVELS.MEDIUM,
                generator: this.generateTypeWeaknessQuestion.bind(this),
                fallback: false
            },
            'TYPE_RESISTANCE': {
                minLevel: GameConfig.DIFFICULTY_LEVELS.HARD,
                generator: this.generateTypeResistanceQuestion.bind(this),
                fallback: false
            },
            'DUAL_TYPE': {
                minLevel: GameConfig.DIFFICULTY_LEVELS.EASY,
                generator: this.generateDualTypeQuestion.bind(this),
                fallback: false
            },
            'BASE_FORM': {
                minLevel: GameConfig.DIFFICULTY_LEVELS.EASY,
                generator: this.generateBaseFormQuestion.bind(this),
                fallback: true
            },
            'STAT_THRESHOLD': {
                minLevel: GameConfig.DIFFICULTY_LEVELS.EASY,
                generator: this.generateStatThresholdQuestion.bind(this),
                fallback: false
            }
        };

        // Fallback types for when primary generation fails
        this.fallbackTypes = ['TYPE_MATCHING', 'BASE_FORM'];

        // Add type system helpers
        this.typeSystem = typeSystem;
        this.getPokemonWeaknesses = getPokemonWeaknesses;
        this.getPokemonResistances = getPokemonResistances;
    }
    _getEvolutionChain(pokemonNumber) {
        // Convert number to string if it isn't already
        const numberStr = pokemonNumber.toString();
        
        // Return the evolution data for this Pokémon
        return evolutionData[numberStr] || null;
    }
    // Core generation method with better error handling
    generateQuestion() {
        let attempts = 0;
        const errors = [];

        while (attempts < this.MAX_ATTEMPTS) {
            try {
                // Get available question types for current level
                const availableTypes = Object.entries(this.questionTypes)
                    .filter(([_, config]) => config.minLevel <= this.currentLevel)
                    .map(([type]) => type);

                if (availableTypes.length === 0) {
                    throw new Error('No question types available for current level');
                }

                // Try a random question type
                const questionType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                const question = this.questionTypes[questionType].generator();

                if (this._validateQuestion(question)) {
                    return question;
                }
            } catch (error) {
                errors.push(error.message);
                attempts++;
            }
        }

        // Try fallback question types
        for (const fallbackType of this.fallbackTypes) {
            try {
                const question = this.questionTypes[fallbackType].generator();
                if (this._validateQuestion(question)) {
                    return question;
                }
            } catch (error) {
                errors.push(`Fallback ${fallbackType} failed: ${error.message}`);
            }
        }

        console.error('All question generation attempts failed:', errors);
        return this._getUltimateFallbackQuestion();
    }

    // Comprehensive validation
    _validateQuestion(question) {
        try {
            console.log('Validating question:', {
                type: question.type,
                optionsLength: question?.options?.length,
                expectedLength: this.GRID_SIZE
            });

            // Basic validation
            if (!question || typeof question !== 'object') {
                throw new Error('Question must be an object');
            }

            // Check required fields
            const requiredFields = ['type', 'question', 'options', 'difficulty'];
            requiredFields.forEach(field => {
                if (!(field in question)) {
                    throw new Error(`Missing required field: ${field}`);
                }
            });

            // Validate options array
            if (!Array.isArray(question.options)) {
                throw new Error('Options must be an array');
            }

            if (question.options.length !== this.GRID_SIZE) {
                throw new Error(`Options must be array of length ${this.GRID_SIZE}`);
            }

            // Count correct answers
            const correctCount = question.options.filter(option => 
                this._isCorrectAnswer(option, question)
            ).length;

            if (correctCount < 1) {
                throw new Error('Question must have at least one correct answer');
            }

            return true;
        } catch (error) {
            console.warn('Question validation failed:', error);
            return false;
        }
    }

    // Ultimate fallback question
    _getUltimateFallbackQuestion() {
        console.log('Generating ultimate fallback question');
        const allPokemon = Object.values(pokemonBase);
        
        try {
            // Get all Normal type Pokémon
            const normalPokemon = allPokemon.filter(p => p.types.includes('Normal'));
            console.log('Found Normal-type Pokémon:', normalPokemon.length);

            // Get 4 Normal type Pokémon (or less if not enough available)
            const correctCount = Math.min(4, normalPokemon.length);
            const selectedNormal = this._getRandomSubset(normalPokemon, correctCount);
            console.log('Selected Normal-type Pokémon:', selectedNormal.length);

            // Calculate how many non-Normal Pokémon we need
            const incorrectNeeded = this.GRID_SIZE - selectedNormal.length;
            console.log('Need incorrect answers:', incorrectNeeded);

            // Get non-Normal Pokémon
            const otherPokemon = this._getRandomSubset(
                allPokemon.filter(p => !p.types.includes('Normal')),
                incorrectNeeded
            );
            console.log('Selected non-Normal Pokémon:', otherPokemon.length);

            // Combine and validate
            const options = [...selectedNormal, ...otherPokemon];
            console.log('Total options:', options.length);

            if (options.length !== this.GRID_SIZE) {
                throw new Error(`Invalid options length: ${options.length}`);
            }

            return {
                type: 'TYPE_MATCHING',
                question: 'Find Normal-type Pokémon',
                targetType: 'Normal',
                options: options.sort(() => Math.random() - 0.5),
                difficulty: 1,
                expectedCorrectCount: selectedNormal.length
            };
        } catch (error) {
            console.error('Ultimate fallback failed:', error);
            
            // If even the ultimate fallback fails, create a minimal valid question
            const minimalOptions = Array(this.GRID_SIZE).fill(null).map((_, index) => ({
                name: `Pokemon ${index + 1}`,
                types: index === 0 ? ['Normal'] : ['Flying'],
                number: index + 1
            }));

            return {
                type: 'TYPE_MATCHING',
                question: 'Find Normal-type Pokémon',
                targetType: 'Normal',
                options: minimalOptions,
                difficulty: 1,
                expectedCorrectCount: 1
            };
        }
    }

    _isCorrectAnswer(option, question) {
        try {
            switch (question.type) {
                case 'BASE_FORM': {
                    // First try using the isCorrect flag that was set during generation
                    if (typeof option.isCorrect === 'boolean') {
                        return option.isCorrect;
                    }
                    
                    // Fallback to checking evolution chain
                    const chain = this._getEvolutionChain(option.number);
                    return !chain || !chain.evolvesTo || chain.evolvesTo.length === 0;
                }
                case 'TYPE_MATCHING':
                    return Array.isArray(option.types) && option.types.includes(question.targetType);
                case 'TYPE_WEAKNESS':
                    const weaknesses = option.types ? this.getPokemonWeaknesses(option.types) : [];
                    return Array.isArray(weaknesses) && weaknesses.includes(question.targetType);
                case 'TYPE_RESISTANCE':
                    const resistances = option.types ? this.getPokemonResistances(option.types) : [];
                    return Array.isArray(resistances) && resistances.includes(question.targetType);
                case 'EVOLUTION_CHAIN':
                    try {
                        const chain = this.PokemonAPI.getEvolutionChain(option.number);
                        // A Pokémon can evolve if it has evolvesTo entries
                        return chain && Array.isArray(chain.evolvesTo) && chain.evolvesTo.length > 0;
                    } catch (error) {
                        console.warn(`Error checking evolution for ${option.name}:`, error);
                        return false;
                    }
                case 'BASE_FORM': {
                    // The option.isCorrect flag is already properly set during generation
                    // We should trust this value instead of recalculating
                    return option.isCorrect;
                    
                    // Alternatively, if you want to verify:
                    // const chain = this._getEvolutionChain(option.number);
                    // return chain.evolvesFrom === null;
                }
                case 'DUAL_TYPE':
                    return Array.isArray(option.types) && option.types.length > 1;
                case 'STAT_THRESHOLD': {
                    if (typeof option.isCorrect === 'boolean') {
                        return option.isCorrect;
                    }
                    const pokemon = pokemonBase[option.number];
                    return pokemon.baseStats[question.statInfo.stat] >= question.statInfo.threshold;
                }
                default:
                    console.warn(`Unknown question type: ${question.type}`);
                    return false;
            }
        } catch (error) {
            console.error('Error in _isCorrectAnswer:', error);
            return false;
        }
    }

    _getRandomSubset(array, size) {
        if (!Array.isArray(array)) {
            console.error('Not an array:', array);
            return [];
        }
        
        // Ensure size is positive and not larger than array length
        const actualSize = Math.max(0, Math.min(size, array.length));
        console.log('Getting random subset:', {
            arrayLength: array.length,
            requestedSize: size,
            actualSize: actualSize
        });
        
        // Shuffle array and take first 'actualSize' elements
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        const result = shuffled.slice(0, actualSize);
        
        console.log('Subset result:', {
            resultLength: result.length,
            expected: actualSize
        });
        
        return result;
    }

    generateTypeQuestion(targetType = null) {
        const type = targetType || GameConfig.TYPES[Math.floor(Math.random() * GameConfig.TYPES.length)];
        const allPokemon = Object.values(pokemonBase);
        console.log('Generating type question for:', type);
        console.log('Total Pokémon available:', allPokemon.length);

        try {
            // Get ALL Pokémon of this type
            const typeMatchPokemon = allPokemon.filter(p => {
                try {
                    return p.types.includes(type);
                } catch (error) {
                    console.warn(`Error checking types for ${p.name}:`, error);
                    return false;
                }
            });
            console.log('Pokémon of type', type, ':', typeMatchPokemon.length);

            // If we don't have enough Pokémon of this type, try another type
            if (typeMatchPokemon.length < 2) {
                console.log('Not enough Pokémon of type', type, 'trying another type');
                return this.generateTypeQuestion(); // Recursive call with new random type
            }

            // Calculate how many correct answers we want (2-6 based on difficulty)
            const correctCount = Math.min(6, Math.max(2, Math.ceil(this.currentLevel / 2)));
            console.log('Desired correct answers:', correctCount);

            // Take the calculated number of correct answers
            const selectedTypePokemon = this._getRandomSubset(
                typeMatchPokemon, 
                Math.min(correctCount, typeMatchPokemon.length)
            );
            console.log('Selected correct Pokémon:', selectedTypePokemon.length);

            // Calculate how many incorrect answers we need
            const incorrectNeeded = this.GRID_SIZE - selectedTypePokemon.length;
            console.log('Incorrect answers needed:', incorrectNeeded);

            // Get non-matching Pokémon
            const nonMatchingPokemon = allPokemon.filter(p => !p.types.includes(type));
            console.log('Available incorrect Pokémon:', nonMatchingPokemon.length);

            // Get exactly the number of incorrect answers needed
            const otherPokemon = this._getRandomSubset(nonMatchingPokemon, incorrectNeeded);
            console.log('Selected incorrect Pokémon:', otherPokemon.length);

            // Combine and shuffle
            const options = [...selectedTypePokemon, ...otherPokemon];
            console.log('Final options length before shuffle:', options.length);

            // Final validation before returning
            if (options.length !== this.GRID_SIZE) {
                console.error('Invalid options length:', options.length);
                throw new Error(`Generated ${options.length} options, expected ${this.GRID_SIZE}`);
            }

            return {
                type: 'TYPE_MATCHING',
                question: `Find ${type} type Pokémon`,
                targetType: type,
                options: options,
                difficulty: this.currentLevel,
                expectedCorrectCount: selectedTypePokemon.length
            };
        } catch (error) {
            console.warn(`Type question generation failed for ${type}:`, error);
            throw error;
        }
    }

    generateEvolutionQuestion() {
        const allPokemon = Object.values(pokemonBase);
        
        // Calculate how many correct answers we want (1-4 based on difficulty)
        const correctCount = Math.min(4, Math.max(1, Math.ceil(this.currentLevel / 2)));

        // Get Pokémon that can evolve
        const evolvingPokemon = this._getRandomSubset(
            allPokemon.filter(p => {
                try {
                    const chain = this.PokemonAPI.getEvolutionChain(p.number);
                    return chain?.evolvesTo?.length > 0;
                } catch (error) {
                    console.warn(`Error checking evolution for ${p.name}:`, error);
                    return false;
                }
            }),
            correctCount
        );

        // Get Pokémon that don't evolve for incorrect answers
        const nonEvolvingPokemon = this._getRandomSubset(
            allPokemon.filter(p => {
                try {
                    const chain = this.PokemonAPI.getEvolutionChain(p.number);
                    return !chain?.evolvesTo?.length;
                } catch (error) {
                    console.warn(`Error checking evolution for ${p.name}:`, error);
                    return false;
                }
            }),
            this.GRID_SIZE - correctCount
        );

        return {
            type: 'EVOLUTION_CHAIN',
            question: 'Find Pokémon that can evolve',
            options: [...evolvingPokemon, ...nonEvolvingPokemon].sort(() => Math.random() - 0.5),
            difficulty: this.currentLevel,
            expectedCorrectCount: correctCount
        };
    }

    generateStatQuestion() {
        const stat = GameConfig.STATS[Math.floor(Math.random() * GameConfig.STATS.length)];
        const threshold = this.statThresholds[stat].medium;
        const allPokemon = Object.values(pokemonBase);

        // Get ALL Pokémon above the threshold
        const highStatPokemon = allPokemon.filter(p => p.baseStats[stat] >= threshold);
        
        // If distribution is poor, adjust threshold
        if (highStatPokemon.length < 4 || highStatPokemon.length > 12) {
            const newThreshold = highStatPokemon.length < 4 ? 
                this.statThresholds[stat].low : 
                this.statThresholds[stat].high;
            
            return this.generateStatQuestionWithThreshold(stat, newThreshold);
        }

        // Get Pokémon below threshold for incorrect answers
        const lowStatPokemon = this._getRandomSubset(
            allPokemon.filter(p => p.baseStats[stat] < threshold),
            this.GRID_SIZE - highStatPokemon.length
        );

        return {
            type: 'STAT_COMPARISON',
            question: `Find ${stat} ≥ ${threshold}`,
            stat: stat,
            threshold: threshold,
            options: [...highStatPokemon, ...lowStatPokemon].sort(() => Math.random() - 0.5),
            difficulty: this.currentLevel,
            expectedCorrectCount: highStatPokemon.length
        };
    }

    generateMoveQuestion() {
        // Select moves based on difficulty
        const movePool = this.currentLevel === GameConfig.DIFFICULTY_LEVELS.EASY ? 
            this.commonMoves.basic :
            this.currentLevel === GameConfig.DIFFICULTY_LEVELS.MEDIUM ?
                [...this.commonMoves.basic, ...this.commonMoves.intermediate] :
                [...this.commonMoves.basic, ...this.commonMoves.intermediate, ...this.commonMoves.advanced];

        // Try moves until we find one with good distribution
        for (const move of movePool) {
            try {
                const question = this._generateMoveQuestionForMove(move);
                if (this._validateQuestion(question)) {
                    return question;
                }
            } catch (error) {
                console.warn(`Failed to generate question for move ${move}:`, error);
                continue;
            }
        }

        // If all moves fail, fall back to Tackle
        return this._generateMoveQuestionForMove('Tackle');
    }

    _generateMoveQuestionForMove(move) {
        const allPokemon = Object.values(pokemonBase);
        
        // Get ALL Pokémon that can learn this move
        const canLearnMove = allPokemon.filter(p => {
            try {
                const moves = this.PokemonAPI.getMoves(p.number);
                return moves.levelUp.some(m => m.name === move) || 
                       moves.tm.includes(move);
            } catch {
                return false; // Handle missing move data
            }
        });

        if (canLearnMove.length === 0) {
            throw new Error(`No Pokémon can learn ${move}`);
        }

        // Get Pokémon that can't learn the move
        const cantLearnMove = this._getRandomSubset(
            allPokemon.filter(p => !canLearnMove.includes(p)),
            this.GRID_SIZE - canLearnMove.length
        );

        return {
            type: 'MOVE_LEARNING',
            question: `Can learn ${move}`,
            move: move,
            options: [...canLearnMove, ...cantLearnMove].sort(() => Math.random() - 0.5),
            difficulty: this.currentLevel,
            expectedCorrectCount: canLearnMove.length
        };
    }

    generateTypeWeaknessQuestion() {
        const allPokemon = Object.values(pokemonBase);
        const targetType = GameConfig.TYPES[Math.floor(Math.random() * GameConfig.TYPES.length)];
        
        console.log('Generating weakness question for type:', targetType);
        
        // Find Pokémon weak to the target type
        const weakPokemon = allPokemon.filter(pokemon => {
            try {
                if (parseInt(pokemon.number) > 151) return false;
                const weaknesses = this.getPokemonWeaknesses(pokemon.types);
                console.log(`${pokemon.name} weaknesses:`, weaknesses);
                return weaknesses.includes(targetType);
            } catch (error) {
                console.warn(`Error checking weaknesses for ${pokemon.name}:`, error);
                return false;
            }
        });
        
        console.log('Found Pokémon weak to', targetType, ':', weakPokemon.length);
        
        // If we don't have enough weak Pokémon, try another type
        if (weakPokemon.length < 2) {
            console.log('Not enough weak Pokémon, trying another type');
            return this.generateTypeWeaknessQuestion();
        }
        
        // Get a subset of correct answers (2-4)
        const correctCount = Math.min(4, Math.max(2, weakPokemon.length));
        const correctAnswers = this._getRandomSubset(weakPokemon, correctCount);
        
        console.log('Selected correct answers:', correctAnswers.length);
        
        // Get Pokémon not weak to the type
        const nonWeakPokemon = allPokemon.filter(pokemon => {
            try {
                if (parseInt(pokemon.number) > 151) return false;
                const weaknesses = this.getPokemonWeaknesses(pokemon.types);
                return !weaknesses.includes(targetType);
            } catch (error) {
                console.warn(`Error checking weaknesses for ${pokemon.name}:`, error);
                return true; // Consider errors as non-weak
            }
        });
        
        // Get exactly enough incorrect answers to fill the grid
        const incorrectAnswers = this._getRandomSubset(
            nonWeakPokemon,
            this.GRID_SIZE - correctAnswers.length
        );
        
        console.log('Selected incorrect answers:', incorrectAnswers.length);
        
        // Combine and shuffle
        const options = [...correctAnswers, ...incorrectAnswers];
        
        return {
            type: 'TYPE_WEAKNESS',
            question: `Find Pokémon weak to ${targetType}`,
            targetType: targetType,
            options: options.sort(() => Math.random() - 0.5),
            expectedCorrectCount: correctAnswers.length,
            difficulty: this.currentLevel
        };
    }

    generateTypeResistanceQuestion() {
        const allPokemon = Object.values(pokemonBase);
        const targetType = GameConfig.TYPES[Math.floor(Math.random() * GameConfig.TYPES.length)];
        
        // Find Pokémon resistant to the target type
        const resistantPokemon = allPokemon.filter(pokemon => 
            pokemon.types && this.getPokemonResistances(pokemon.types).includes(targetType)
        );
        
        // Get a subset of correct answers (2-4)
        const correctCount = Math.min(4, Math.max(2, resistantPokemon.length));
        const correctAnswers = this._getRandomSubset(resistantPokemon, correctCount);
        
        // Get incorrect answers
        const incorrectPokemon = allPokemon.filter(pokemon => 
            !this.getPokemonResistances(pokemon.types).includes(targetType)
        );
        const incorrectAnswers = this._getRandomSubset(
            incorrectPokemon, 
            this.GRID_SIZE - correctCount
        );
        
        return {
            type: 'TYPE_RESISTANCE',
            question: `Find Pokémon resistant to ${targetType}`,
            options: [...correctAnswers, ...incorrectAnswers].sort(() => Math.random() - 0.5),
            targetType,
            expectedCorrectCount: correctAnswers.length,
            difficulty: this.currentLevel
        };
    }

    generateDualTypeQuestion() {
        try {
            // Get all Pokémon
            const allPokemon = Object.values(pokemonBase);
            console.log('Total Pokémon:', allPokemon.length);

            // Find dual-type Pokémon
            const dualTypePokemon = allPokemon.filter(p => p.types.length > 1);
            console.log('Found dual-type Pokémon:', dualTypePokemon.length);

            // Get random subset of dual-type Pokémon
            const selectedDualTypes = this._getRandomSubset(dualTypePokemon, 6);
            console.log('Selected dual-types:', selectedDualTypes.length);

            // Get single-type Pokémon for wrong answers
            const singleTypePokemon = allPokemon.filter(p => p.types.length === 1);
            console.log('Found single-type Pokémon:', singleTypePokemon.length);

            // Get random subset of single-type Pokémon
            const selectedSingleTypes = this._getRandomSubset(singleTypePokemon, 10);
            console.log('Selected single-types:', selectedSingleTypes.length);

            // Combine and shuffle
            const options = [...selectedDualTypes, ...selectedSingleTypes];
            console.log('Final options:', options.length);

            return {
                type: 'DUAL_TYPE',
                question: 'Find dual-type Pokémon',
                options: options.sort(() => Math.random() - 0.5),
                difficulty: this.currentLevel,
                expectedCorrectCount: selectedDualTypes.length
            };
        } catch (error) {
            console.warn('Dual-type question generation failed:', error);
            return this._getUltimateFallbackQuestion();
        }
    }

    generateBaseFormQuestion() {
        const allPokemon = Object.values(pokemonBase);
        console.log('BSFORM Total Pokémon:', allPokemon.length);

        // Find base form Pokémon (either standalone or first in evolution chain)
        const baseFormPokemon = allPokemon.filter(pokemon => {
            try {
                if (parseInt(pokemon.number) > 151) {
                    console.log(`BSFORM Skipping ${pokemon.name} - not Gen 1`);
                    return false;
                }
                
                const chain = this._getEvolutionChain(pokemon.number);
                
                // A Pokémon is a base form if:
                // 1. It has no evolution chain (standalone) OR
                // 2. It's not in anyone else's evolution chain
                const isEvolutionOfAnother = Object.values(evolutionData).some(evoChain => 
                    evoChain.evolvesTo?.some(evo => evo.number === pokemon.number)
                );
                
                const isBaseForm = !isEvolutionOfAnother;
                
                console.log(`BSFORM Checking ${pokemon.name} (${pokemon.number}):`, { 
                    chain, 
                    isBaseForm,
                    isEvolutionOfAnother 
                });
                
                return isBaseForm;
                
            } catch (error) {
                console.warn(`BSFORM Error checking evolution for ${pokemon.name}:`, error);
                return false;
            }
        });
        
        console.log('BSFORM Found base form Pokémon:', baseFormPokemon.length);
        console.log('BSFORM Base forms:', baseFormPokemon.map(p => p.name));
        
        if (baseFormPokemon.length < 4) {
            console.warn('BSFORM Not enough base form Pokémon found, using fallback');
            return this._getUltimateFallbackQuestion();
        }
        
        // Get 4 correct answers
        const correctAnswers = this._getRandomSubset(baseFormPokemon, 4);
        console.log('BSFORM Selected correct answers:', correctAnswers.map(p => p.name));
        
        // Get non-base form Pokémon that aren't in our correct answers
        const nonBaseFormPokemon = allPokemon.filter(pokemon => {
            return !baseFormPokemon.includes(pokemon) && !correctAnswers.includes(pokemon);
        });
        console.log('BSFORM Found non-base form Pokémon:', nonBaseFormPokemon.length);
        
        // Get 12 incorrect answers
        const incorrectAnswers = this._getRandomSubset(nonBaseFormPokemon, 12);
        console.log('BSFORM Selected incorrect answers:', incorrectAnswers.map(p => p.name));

        // Combine and shuffle all options
        const options = [
            ...correctAnswers.map(p => ({
                name: p.name,
                number: p.number,
                isCorrect: true
            })),
            ...incorrectAnswers.map(p => ({
                name: p.name,
                number: p.number,
                isCorrect: false
            }))
        ];
        
        console.log('BSFORM Final options:', JSON.stringify(options, null, 2));
        console.log('BSFORM Expected correct count:', correctAnswers.length);
        console.log('BSFORM Actual correct by isCorrect:', options.filter(o => o.isCorrect).length);

        // Shuffle the options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        const question = {
            type: 'BASE_FORM',
            question: 'Base Form Pokemon?',
            options: options,
            expectedCorrectCount: correctAnswers.length,
            difficulty: 'EASY'
        };

        // Debug the _isCorrectAnswer function
        console.log('BSFORM Testing _isCorrectAnswer for each option:');
        options.forEach(option => {
            console.log(`BSFORM ${option.name}:`, {
                isCorrect: option.isCorrect,
                _isCorrectAnswer: this._isCorrectAnswer(option, question)
            });
        });

        return question;
    }

    getAvailableQuestionTypes() {
        return Object.entries(this.questionTypes)
            .filter(([_, config]) => config.minLevel <= this.currentLevel)
            .map(([type, _]) => type);
    }

    generateRandomQuestion() {
        const availableTypes = this.getAvailableQuestionTypes();
        let attempts = 0;
        
        while (attempts < this.MAX_ATTEMPTS) {
            try {
                const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                const generator = this.questionTypes[type].generator;
                const question = generator();
                
                if (this._validateQuestion(question)) {
                    return question;
                }
            } catch (error) {
                console.warn('Failed to generate random question:', error);
                attempts++;
            }
        }

        // If all attempts fail, use fallback
        return this._getUltimateFallbackQuestion();
    }

    generateStatThresholdQuestion() {
        const allPokemon = Object.values(pokemonBase);
        const stats = ['hp', 'attack', 'defense', 'speed', 'special'];
        
        // Pick a random stat and threshold
        const stat = stats[Math.floor(Math.random() * stats.length)];
        const thresholds = {
            hp: 80,
            attack: 80,
            defense: 80,
            speed: 90,
            special: 85
        };
        
        const threshold = thresholds[stat];
        
        // Find Pokémon that meet the criteria
        const validPokemon = allPokemon.filter(pokemon => {
            try {
                return parseInt(pokemon.number) <= 151 && pokemon.baseStats[stat] >= threshold;
            } catch (error) {
                console.warn(`Error checking stats for ${pokemon.name}:`, error);
                return false;
            }
        });

        if (validPokemon.length < 4) {
            console.warn('Not enough Pokémon found for stat threshold question');
            return this._getUltimateFallbackQuestion();
        }

        // Get 4 correct answers
        const correctAnswers = this._getRandomSubset(validPokemon, 4);
        
        // Get Pokémon that don't meet the criteria
        const invalidPokemon = allPokemon.filter(pokemon => 
            parseInt(pokemon.number) <= 151 && 
            pokemon.baseStats[stat] < threshold &&
            !correctAnswers.includes(pokemon)
        );

        // Get 12 incorrect answers
        const incorrectAnswers = this._getRandomSubset(invalidPokemon, 12);

        // Format options
        const options = [
            ...correctAnswers.map(p => ({
                name: p.name,
                number: p.number,
                isCorrect: true
            })),
            ...incorrectAnswers.map(p => ({
                name: p.name,
                number: p.number,
                isCorrect: false
            }))
        ].sort(() => Math.random() - 0.5);

        return {
            type: 'STAT_THRESHOLD',
            question: `Pokémon with ${stat} ≥ ${threshold}`,
            options: options,
            expectedCorrectCount: correctAnswers.length,
            difficulty: 'EASY',
            statInfo: { stat, threshold } // Store for validation
        };
    }
}

// Create and export a configurable instance
export const createQuestionGenerator = (config) => {
    return new QuestionGenerator(config);
};

// Export the default instance for backward compatibility
export const questionGenerator = createQuestionGenerator({
    currentLevel: 1,
    PokemonAPI: PokemonAPI
}); 