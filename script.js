document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=30');
        const { results } = await response.json();
        await displayData(results);
        setupEventListeners();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function displayData(pokemons) {
    const collectionContainer = document.getElementById('collection-container');
    for (const pokemon of pokemons) {
        try {
            const response = await fetch(pokemon.url); // Fetching detailed data for each pokemon
            const pokemonDetails = await response.json();
            const heightInMeters = pokemonDetails.height * 0.1; // Convert decimeters to meters

            collectionContainer.innerHTML += `<div class="pokemon-card" id="${pokemonDetails.name}" data-height="${heightInMeters}">
                <h3>${pokemonDetails.name}</h3>
                <p>Weight: ${((pokemonDetails.weight) * .1).toFixed(2)} kg</p>
                <p>Height: ${heightInMeters.toFixed(2)} decimeters</p>
                <button class="toggle-favorite">Add to Favorites</button>
            </div>`;
        } catch (error) {
            console.error('Error fetching details for pokemon:', pokemon.name, error);
        }
    }
    setupEventListeners();
}


function setupEventListeners() {
    document.querySelectorAll('.pokemon-card button').forEach(button => 
        button.addEventListener('click', toggleFavoriteStatus)
    );
    ['sort-collection-az', 'sort-collection-za', 'sort-fav-az', 'sort-fav-za'].forEach(id => 
        document.getElementById(id).addEventListener('click', () => 
            sortingPoke(id.includes('collection') ? 'collection-container' : 'favorites-container', id.endsWith('az'))));
}

function toggleFavoriteStatus(event) {
    const pokemonCard = event.target.closest('.pokemon-card');
    const isFavorite = pokemonCard.parentNode.id === 'favorites-container';
    (isFavorite ? document.getElementById('collection-container') : document.getElementById('favorites-container'))
    .appendChild(pokemonCard);
    event.target.innerText = isFavorite ? 'Add to Favorites' : 'Remove from Favorites';
    setupEventListeners();
    calculateHeight();
}

function sortingPoke(containerId, sortAZ) {
    const container = document.getElementById(containerId);
    Array.from(container.getElementsByClassName('pokemon-card'))
        .sort((a, b) => (sortAZ ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)))
        .forEach(card => container.appendChild(card));
}


function calculateHeight() {
    const cards = Array.from(document.getElementById('favorites-container').getElementsByClassName('pokemon-card'));

    const totalHeight = cards.reduce((total, card, index) => {
        const height = parseFloat(card.getAttribute('data-height')) || 0;
        return total + height;
    }, 0);
    document.getElementById('total-height').innerText = totalHeight.toFixed(2);
}

