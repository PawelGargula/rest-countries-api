// Link for one country: https://restcountries.com/v3.1/name/germany
const main = document.querySelector('.main-content');

async function addAllCountriesToDOM() {
    main.innerHTML = '';

    const countries = await loadAllCountries();

    countries.forEach(country => {
        const card = createCard(country.flags.png, country.name, country.population, country.region, country.capital)
        main.appendChild(card);
    });

}

async function loadAllCountries() {
    const response = await fetch("https://restcountries.com/v2/all?fields=flags,name,population,region,capital");
    const data = await response.json();
    return data;
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

    const populationElement = createSingleInfoElement("Population: ", population);
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

addAllCountriesToDOM();