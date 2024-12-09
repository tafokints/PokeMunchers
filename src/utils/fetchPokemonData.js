import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

async function fetchGen1Data() {
    const GEN1_LIMIT = 151;
    const pokemonData = {};
    const movesets = {};
    const evolutionData = {};

    console.log('Starting Pokémon data fetch...');

    for (let i = 1; i <= GEN1_LIMIT; i++) {
        console.log(`Fetching Pokémon #${i}...`);
        
        try {
            // Fetch basic Pokémon data
            const pokemonResponse = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${i}`);
            
            // Fetch species data
            const speciesResponse = await fetchWithRetry(pokemonResponse.species.url);

            // Fetch evolution chain
            const evolutionResponse = await fetchWithRetry(speciesResponse.evolution_chain.url);

            // Format the data
            const number = String(i).padStart(3, '0');
            pokemonData[number] = {
                name: pokemonResponse.name.charAt(0).toUpperCase() + pokemonResponse.name.slice(1),
                number: number,
                types: pokemonResponse.types.map(type => 
                    type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
                ),
                height: `${pokemonResponse.height / 10} m`,
                weight: `${pokemonResponse.weight / 10} kg`,
                baseStats: {
                    hp: pokemonResponse.stats[0].base_stat,
                    attack: pokemonResponse.stats[1].base_stat,
                    defense: pokemonResponse.stats[2].base_stat,
                    special: pokemonResponse.stats[3].base_stat,
                    speed: pokemonResponse.stats[5].base_stat
                },
                category: speciesResponse.genera.find(g => g.language.name === 'en')?.genus || 'Unknown'
            };

            // Get Gen 1 moves
            const gen1Moves = pokemonResponse.moves.filter(move => 
                move.version_group_details.some(detail => 
                    detail.version_group.name === 'red-blue'
                )
            );

            movesets[number] = {
                levelUp: gen1Moves
                    .filter(move => move.version_group_details.some(detail => 
                        detail.move_learn_method.name === 'level-up'
                    ))
                    .map(move => ({
                        level: move.version_group_details.find(detail => 
                            detail.move_learn_method.name === 'level-up'
                        ).level_learned_at,
                        name: move.move.name.split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                    })),
                tm: gen1Moves
                    .filter(move => move.version_group_details.some(detail => 
                        detail.move_learn_method.name === 'machine'
                    ))
                    .map(move => move.move.name.split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '))
            };

            // Process evolution chain
            const chain = evolutionResponse.chain;
            const processChain = (chain) => {
                const speciesNumber = chain.species.url.split('/').slice(-2, -1)[0];
                evolutionData[speciesNumber] = {
                    evolvesFrom: chain.evolves_from_species ? chain.evolves_from_species.name : null,
                    evolvesTo: chain.evolves_to.map(evo => ({
                        number: evo.species.url.split('/').slice(-2, -1)[0],
                        method: evo.evolution_details[0]?.trigger.name || 'unknown',
                        level: evo.evolution_details[0]?.min_level || null
                    }))
                };
                chain.evolves_to.forEach(processChain);
            };
            processChain(chain);

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error(`Error fetching Pokémon #${i}:`, error);
        }
    }

    // Ensure directory exists
    const dataDir = join(__dirname, '..', 'config', 'pokemon');
    await mkdir(dataDir, { recursive: true });

    // Save the data
    await writeFile(
        join(dataDir, 'base.js'),
        `export const pokemonBase = ${JSON.stringify(pokemonData, null, 2)};`
    );

    await writeFile(
        join(dataDir, 'moves.js'),
        `export const pokemonMoves = ${JSON.stringify(movesets, null, 2)};`
    );

    await writeFile(
        join(dataDir, 'evolution.js'),
        `export const evolutionData = ${JSON.stringify(evolutionData, null, 2)};`
    );

    console.log('Data fetch complete!');
}

// Run the fetcher
fetchGen1Data().catch(console.error);