// Link for one country: https://restcountries.com/v3.1/name/germany
const allCountriesURL = "https://restcountries.com/v2/all?fields=flags,name,population,region,capital";

const main = document.querySelector('.main-content');
const searchInput = document.querySelector('#search');

addCountriesToDOM(allCountriesURL);

searchInput.oninput = () => {
    if (searchInput.value.trim().length === 0) {
        addCountriesToDOM(allCountriesURL);
    } else {
        const url = `https://restcountries.com/v3.1/name/${searchInput.value}?fields=flags,name,population,region,capital`;
        addCountriesToDOM(url);
    }
}

async function addCountriesToDOM(url) {
    const countries = await loadCountries(url);

    main.innerHTML = '';
    
    if (countries === undefined) {
        const para = document.createElement('p');
        para.textContent = "Cannot find countries.";
        main.appendChild(para);
        return;
    }

    countries.forEach(country => {
        let countryName = country.name;
        // If API returns object - we have to go deeper to get name (as single string)
        if (typeof countryName === 'object') {
            countryName = countryName.common;
        }

        const card = createCard(country.flags.png, countryName, country.population, country.region, country.capital);
        main.appendChild(card);
    });

}

async function loadCountries(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Cannot find countries');
        }

        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
    }
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