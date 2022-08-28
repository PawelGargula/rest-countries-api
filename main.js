// Link for one country: https://restcountries.com/v3.1/name/germany
const body = document.querySelector('body');
const switchModeBtn = document.querySelector('.swich-mode-button');

switchModeBtn.onclick = () => {
    if (body.dataset.actualMode === 'light') {
        switchModeBtn.textContent = 'Light Mode';
        body.dataset.actualMode = 'dark';
    } else {
        switchModeBtn.textContent = 'Dark Mode';
        body.dataset.actualMode = 'light';
    }
}

const mainContent = document.querySelector('.main-content');
const nameInput = document.querySelector('#search');
const regionInput = document.querySelector('#region');

main();

async function main() {
    const allCountries = await loadCountries('https://restcountries.com/v2/all?fields=flags,name,population,region,capital');

    if (allCountries === undefined) {
        const para = document.createElement('p');
        para.textContent = 'Cannot find countries.';
        mainContent.appendChild(para);
        return;
    }

    addCountriesToDOM(allCountries);

    // Add events to searching inputs
    nameInput.oninput = regionInput.onchange = () => filterCountries(allCountries);
}

async function loadCountries(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Cannot find countries');
        }

        const countries = await response.json();
        return countries;
    } catch (e) {
        console.error(e);
    }
}

function addCountriesToDOM(countries) {
    mainContent.innerHTML = '';

    countries.forEach(country => {
        const card = createCard(country.flags.png, country.name, country.population, country.region, country.capital);
        mainContent.appendChild(card);
    });
}

function createCard(imgSrc, name, population, region, capital) {
    const card = document.createElement('div');
    card.classList.add('card', 'rounded-element');

    const flag = document.createElement('img');
    flag.src = imgSrc;
    flag.alt = `${name} flag`;
    flag.loading = "lazy";

    const info = createInfoElement(name, population, region, capital);

    card.append(flag, info);

    return card;
}

function createInfoElement(name, population, region, capital) {
    const info = document.createElement('div');
    info.classList.add('info');

    const nameElement = document.createElement('h2');
    nameElement.textContent = name;

    const populationElement = createSingleInfoElement("Population: ", population.toLocaleString());
    const regionElement = createSingleInfoElement("Region: ", region);
    const capitalElement = createSingleInfoElement("Population: ", capital);

    info.append(nameElement, populationElement, regionElement, capitalElement);

    return info;
}

function createSingleInfoElement(name, value) {
    const singleInfo = document.createElement('p');

    const header = document.createElement('span');
    header.classList.add('semi-bold-fw');
    header.textContent = name;

    const content = document.createElement('span');
    content.textContent = value;

    singleInfo.append(header, content);

    return singleInfo;
}

function filterCountries(allCountries) {
    let filteredCountries;
    if (nameInput.value.trim().length === 0 && regionInput.value === 'all') {
        filteredCountries = allCountries;
    } else if (regionInput.value === 'all') {
        filteredCountries = allCountries.filter(country =>
            country.name.toLowerCase().includes(nameInput.value.trim().toLowerCase())
        );
    } else if (nameInput.value.trim().length === 0) {
        filteredCountries = allCountries.filter(country =>
            country.region.toLowerCase().includes(regionInput.value)
        );
    } else {
        filteredCountries = allCountries.filter(country =>
            country.name.toLowerCase().includes(nameInput.value.trim().toLowerCase())
            && country.region.toLowerCase().includes(regionInput.value)
        );
    }
    addCountriesToDOM(filteredCountries);
}