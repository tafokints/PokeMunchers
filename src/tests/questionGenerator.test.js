import { createQuestionGenerator } from '../config/game/questionGenerator.js';
import { PokemonAPI } from '../config/pokemon/index.js';

describe('QuestionGenerator', () => {
    let generator;

    beforeEach(() => {
        generator = createQuestionGenerator({
            currentLevel: 1,
            PokemonAPI: PokemonAPI
        });
    });

    test('should initialize with correct configuration', () => {
        expect(generator).toBeDefined();
        expect(generator.currentLevel).toBe(1);
        expect(generator.GRID_SIZE).toBe(16);
    });

    describe('Question Generation', () => {
        const testQuestionType = (type) => {
            test(`${type} questions should generate valid structure`, () => {
                for (let i = 0; i < 5; i++) {
                    const question = generator.questionTypes[type].generator();
                    
                    // Test basic structure
                    expect(question).toBeDefined();
                    expect(question.type).toBe(type);
                    expect(question.question).toBeDefined();
                    expect(Array.isArray(question.options)).toBe(true);
                    
                    // Test grid size
                    expect(question.options.length).toBe(16);
                    
                    // Test correct answers count
                    const correctCount = question.options.filter(
                        option => generator._isCorrectAnswer(option, question)
                    ).length;
                    
                    expect(correctCount).toBe(question.expectedCorrectCount);
                    expect(correctCount).toBeGreaterThan(0);
                }
            });
        };

        // Test each question type
        ['TYPE_MATCHING', 'TYPE_WEAKNESS', 'TYPE_RESISTANCE', 'DUAL_TYPE', 'BASE_FORM']
            .forEach(testQuestionType);
    });

    test('should handle invalid question types gracefully', () => {
        expect(() => {
            generator._isCorrectAnswer('INVALID_TYPE', {});
        }).not.toThrow();
    });

    test('getAvailableQuestionTypes should return array based on level', () => {
        const types = generator.getAvailableQuestionTypes();
        expect(Array.isArray(types)).toBe(true);
        expect(types.length).toBeGreaterThan(0);
        
        // Level 1 should at least have TYPE_MATCHING
        expect(types).toContain('TYPE_MATCHING');
    });

    test('generateRandomQuestion should always return valid question', () => {
        for (let i = 0; i < 5; i++) {
            const question = generator.generateRandomQuestion();
            
            expect(question).toBeDefined();
            expect(question.options.length).toBe(16);
            expect(typeof question.expectedCorrectCount).toBe('number');
            
            const correctCount = question.options.filter(
                option => generator._isCorrectAnswer(option, question)
            ).length;
            
            expect(correctCount).toBe(question.expectedCorrectCount);
            expect(correctCount).toBeGreaterThan(0);
        }
    });
});