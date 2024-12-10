import { questionGenerator } from '../../config/game/questionGenerator.js';
import { spawnEnemy } from './enemyManager.js';

export function getLevelData(scene) {
    try {
        const question = questionGenerator.generateRandomQuestion();
        const formattedData = {
            type: question.type,
            question: question.question,
            level: scene.levelNumber,
            answers: {
                correct: question.options
                    .filter(option => questionGenerator._isCorrectAnswer(option, question))
                    .map(option => option.name),
                incorrect: question.options
                    .filter(option => !questionGenerator._isCorrectAnswer(option, question))
                    .map(option => option.name)
            },
            difficulty: question.difficulty
        };

        if (!validateFormattedData(formattedData)) {
            return getFallbackQuestion(scene);
        }

        return formattedData;
    } catch (error) {
        console.error('Failed to get level data:', error);
        return getFallbackQuestion(scene);
    }
}

function validateFormattedData(data) {
    const requiredFields = ['type', 'question', 'level', 'answers'];
    const isValid = requiredFields.every(field => {
        const hasField = data.hasOwnProperty(field);
        if (!hasField) {
            console.error(`Missing required field: ${field}`);
        }
        return hasField;
    });

    if (!isValid) return false;
    if (!data.answers.correct?.length || !data.answers.incorrect?.length) {
        console.error('Invalid answers structure');
        return false;
    }

    const intersection = data.answers.correct.filter(x => data.answers.incorrect.includes(x));
    if (intersection.length > 0) {
        console.error('Found duplicate answers:', intersection);
        return false;
    }

    return true;
}

function getFallbackQuestion(scene) {
    return {
        type: 'TYPE',
        question: 'Find Fire Pokémon',
        level: scene.levelNumber,
        answers: {
            correct: [ 'Charmander','Charmeleon','Charizard','Vulpix','Ninetales','Growlithe','Arcanine','Ponyta' ],
            incorrect: [ 'Pikachu','Bulbasaur','Squirtle','Oddish','Psyduck','Poliwag','Tentacool','Slowpoke' ]
        },
        difficulty: 1
    };
}

export function setupLevel(scene) {
    const difficulty = calculateDifficulty(scene);
    scene.timeLeft = difficulty.timeLimit;

    // Spawn enemies
    for (let i = 0; i < difficulty.enemyCount; i++) {
        spawnEnemy(scene, difficulty.enemySpeed);
    }
}

function calculateDifficulty(scene) {
    return {
        timeLimit: Math.max(60, 90 - (scene.levelNumber * 5)),
        enemyCount: Math.min(3, 1 + Math.floor(scene.levelNumber / 3)),
        enemySpeed: Math.min(200, 100 + (scene.levelNumber * 10))
    };
}
