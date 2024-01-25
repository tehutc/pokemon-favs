document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=30');
        const { results } = await response.json();
        await fetchData(results);
        setupEventListeners();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function fetchData(pokemons) {
    const resArr = [];
    for (const pokemon of pokemons) {
        try {
            const response = await fetch(pokemon.url);
            const pokemonDetails = await response.json();
            resArr.push(pokemonDetails);
        } catch (error) {
            console.error('Error fetching details for pokemon', pokemon.name, error);
        }
    }
    showData(resArr);
}

const showData = (arrData) => {
    const collectionContainer = document.getElementById('collection-container');
    arrData.forEach((pokemonDetails) => {
        const heightInMeters = pokemonDetails.height * 0.1;
        const weightInKg = pokemonDetails.weight * 0.1;

        collectionContainer.innerHTML += `<div class="pokemon-card" id="${pokemonDetails.name}" data-height="${heightInMeters}" data-weight="${weightInKg}">
                <h3>${pokemonDetails.name} </h3>
                <p>Weight: ${weightInKg.toFixed(2)} kg </p>
                <p>Height: ${heightInMeters.toFixed(2)} meters</p>
                <button class="toggle-favorite">Add to Favorites</button>
                </div>`;
    });
    setupEventListeners();
    calculateTotals();
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
    calculateTotals();
}

function sortingPoke(containerId, sortAZ) {
    const container = document.getElementById(containerId);
    Array.from(container.getElementsByClassName('pokemon-card'))
        .sort((a, b) => (sortAZ ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)))
        .forEach(card => container.appendChild(card));
}


function calculateTotals() {
    calculateTotalsForContainer('collection-container', 'total-height-collection', 'total-weight-collection');
    calculateTotalsForContainer('favorites-container', 'total-height-fav', 'total-weight-fav');
}

function calculateTotalsForContainer(containerId, totalHeightElementId, totalWeightElementId) {
    const cards = Array.from(document.getElementById(containerId).getElementsByClassName('pokemon-card'));

    const totalHeight = cards.reduce((total, card) => {
        const height = parseFloat(card.getAttribute('data-height')) || 0;
        return total + height;
    }, 0);

    const totalWeight = cards.reduce((total, card) => {
        const weight = parseFloat(card.getAttribute('data-weight')) || 0; // Assuming 'data-weight' attribute is set correctly
        return total + weight;
    }, 0);

    document.getElementById(totalHeightElementId).innerText = totalHeight.toFixed(2);
    document.getElementById(totalWeightElementId).innerText = totalWeight.toFixed(2);
}