
import countries_data from "./countries_data.js";

let totalCountriesHeading = document.querySelector('.totalCountries')
totalCountriesHeading.textContent = `Total number of countries : ${countries_data.length}`

let countriesAndCountHeading = document.querySelector('.countriesAndCount')

const startingWord = document.querySelector('.startingWord');
const searchWith = document.querySelector('.searchWith');
const sort = document.querySelector('.sort');
const countryInput = document.querySelector('.country');

// Modal Elements
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

const container = document.createElement('div');
container.className = 'container';
document.body.insertBefore(container, document.body.children[1]);

function makeCards(country) {
    let card = document.createElement('div');
    card.className = 'flagCard';
    card.id = `${country.name} flag`;

    let img = document.createElement('img');
    img.src = country.flag;
    img.alt = `${country.name} flag`;
    img.loading = 'lazy';

    let countryName = document.createElement('p');
    countryName.textContent = `${country.name}`;

    card.addEventListener('click', () => {
        showPopup(country);
    });

    card.append(img, countryName);
    return card;
}

function showPopup(country) {

    let languagesList = country.languages ? country.languages.join(', ') : 'N/A';

    modalBody.innerHTML = `
        <img src="${country.flag}" alt="${country.name} flag">
        <h2>${country.name}</h2>
        <p><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
        <p><strong>Languages:</strong> ${languagesList}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area ? country.area.toLocaleString() : 'N/A'} km²</p>
    `;

    modalOverlay.style.display = 'flex';
}

closeModal.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
});

function renderCards(countries) {
    let fragment = document.createDocumentFragment();
    countries.forEach(country => {
        fragment.append(makeCards(country));
    });
    container.innerHTML = '';
    container.append(fragment);
}

renderCards(countries_data);

function filterAndRender(mode) {
    let word = countryInput.value.toLowerCase().trim()
    let filteredObj
    if (mode === 'start') {
        filteredObj = countries_data.filter((obj) => obj.name.toLowerCase().startsWith(word))
        countriesAndCountHeading.innerHTML = `Countries starting with <span>${countryInput.value.trim()}</span> word are <span>${filteredObj.length}</span>`
    }
    else{
        filteredObj = countries_data.filter((obj) => obj.name.toLowerCase().includes(word));
        countriesAndCountHeading.innerHTML = `Countries including <span>${countryInput.value.trim()}</span> word are <span>${filteredObj.length}</span>`
    }
    return renderCards(filteredObj)
}
countryInput.addEventListener('input', () => {
    filterAndRender('including')
});

startingWord.addEventListener('click', () => {
    return filterAndRender('start');
});

searchWith.addEventListener('click', () => {
    return filterAndRender('including')
});

sort.addEventListener('click', () => {
    let fragment = document.createDocumentFragment();
    let cards = Array.from(container.children).reverse();
    cards.forEach((card) => {
        fragment.append(card);
    });
    container.append(fragment);
});