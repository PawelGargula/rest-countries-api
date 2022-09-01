const main = document.querySelector('main');

let nameInput;
let regionInput;
let mainContent;

loadHomeContent();

async function loadHomeContent() {
    main.innerHTML = '';

    addSearchingInputs();

    mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    main.appendChild(mainContent);

    const allCountries = await loadCountries('https://restcountries.com/v3.1/all?fields=flags,name,population,region,capital');

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

function addSearchingInputs() {
    const inputs = document.createElement('div');
    inputs.classList.add('inputs');

    nameInput = document.createElement('input');
    nameInput.classList.add('rounded-element');
    nameInput.type = 'search';
    nameInput.placeholder = 'Search for a country...';

    regionInput = document.createElement('select');
    regionInput.classList.add('rounded-element');

    const option1 = createOption('all', 'Filter by region (All)');

    const option2 = createOption('africa', 'Africa');

    const option3 = createOption('americas', 'Americas')

    const option4 = createOption('asia', 'Asia');

    const option5 = createOption('europe', 'Europe');

    const option6 = createOption('oceania', 'Oceania');

    regionInput.append(option1, option2, option3, option4, option5, option6);

    inputs.append(nameInput, regionInput);

    main.appendChild(inputs);
}

function createOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;

    return option;
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
        const card = createCard(country.flags.png, country.name.common, country.population, country.region, country.capital);
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
    card.onclick = () => loadCountryDetails(name);

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
            country.name.common.toLowerCase().includes(nameInput.value.trim().toLowerCase())
        );
    } else if (nameInput.value.trim().length === 0) {
        filteredCountries = allCountries.filter(country =>
            country.region.toLowerCase().includes(regionInput.value)
        );
    } else {
        filteredCountries = allCountries.filter(country =>
            country.name.common.toLowerCase().includes(nameInput.value.trim().toLowerCase())
            && country.region.toLowerCase().includes(regionInput.value)
        );
    }
    addCountriesToDOM(filteredCountries);
}

async function loadCountryDetails(name) {
    const country = (await loadCountries(`https://restcountries.com/v3.1/name/${name}?fields=flags,name,population,region,subregion,capital,tld,currencies,languages,borders&fullText=true`))[0];

    let borderCountries = country.borders; 

    console.log(country);

    addCountryDetailsToDOM(
        country.flags.svg,
        name,
        Object.values(country.name.nativeName)[0].common, 
        country.population.toLocaleString(),
        country.region,
        country.subregion,
        country.capital,
        country.tld,
        Object.values(country.currencies)[0].name,
        Object.values(country.languages).join(', '),
        borderCountries
        );
}

function addCountryDetailsToDOM(imgSrc, name, nativeName, population, region, subregion, capital, topLevelDomain, currencies, languages, borderCountries) {
    main.innerHTML = '';
    
    console.log(`
    ${imgSrc},
    ${name},
    ${nativeName},
    ${population},
    ${region},
    ${subregion},
    ${capital},
    ${topLevelDomain},
    ${currencies},
    ${languages},
    ${borderCountries},
    `);

    const backBtn = document.createElement('button');
    backBtn.classList.add('button', 'back', 'semi-bold');
    backBtn.innerText = 'Back';
    backBtn.onclick = loadHomeContent;

    const detailContent = document.createElement('div');
    detailContent.classList.add('detail-content');

    const flag = document.createElement('img');
    flag.src = imgSrc;
    flag.alt = '';

    const detailText = document.createElement('div');
    detailText.classList.add('detail-text');

    detailContent.append(flag, detailText);

    const commonName = document.createElement('h2');;
    commonName.textContent = name;

    const detailInfo1 = document.createElement('div');
    detailInfo1.classList.add('detail-info');
    
    const nativeNameElement = createSingleInfoElement('Native name: ', nativeName);
    const populationElement = createSingleInfoElement('Population: ', population);
    const regionElement = createSingleInfoElement('Region: ', region);
    const subRegionElement = createSingleInfoElement('Sub Region: ', subregion);
    const capitalElement = createSingleInfoElement('Capital: ', capital);

    detailInfo1.append(
        nativeNameElement,
        populationElement,
        regionElement,
        subRegionElement,
        capitalElement,
        )

    const detailInfo2 = document.createElement('div');
    detailInfo2.classList.add('detail-info');
    
    const topLevelDomainElement = createSingleInfoElement('Top Level Domain: ', topLevelDomain);
    const currenciesElement = createSingleInfoElement('Currencies: ', currencies);
    const languagesElement = createSingleInfoElement('Currencies: ', languages);

    detailInfo2.append(
        topLevelDomainElement,
        currenciesElement,
        languagesElement,
    )

    const borderCountriesElement = document.createElement('div');
    borderCountriesElement.classList.add('border-countries');

    const countriesHeader = document.createElement('h3');
    countriesHeader.textContent = 'Border Countries:';
    countriesHeader.classList.add('semi-bold-fw');

    const buttons = document.createElement('div');

    borderCountriesElement.append(countriesHeader, buttons);

    detailText.append(commonName, detailInfo1, detailInfo2, borderCountriesElement);
    
    main.append(backBtn, detailContent);

    borderCountries.forEach(async (countryCode) => {
        const country = await loadCountries(`https://restcountries.com/v3.1/alpha/${countryCode}?fields=name&fullText=true`);
        const countryName = country.name.common ;

        const countryBtn = document.createElement('button');
        countryBtn.classList.add('button');
        countryBtn.textContent = countryName;
        countryBtn.onclick = () => loadCountryDetails(countryName);

        buttons.appendChild(countryBtn);
    });
}