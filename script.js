let selectedCountry = null;
let cachedCountriesData = null; // Holds local JSON data after first fetch

// --- EVENT LISTENER ---
document.querySelector('svg').addEventListener('click', (e) => {
  const countryElement = e.target.closest('svg > g[id], svg > path[id]');

  // Ignore clicks on non-country elements or ocean
  if (!countryElement || countryElement.id === 'ocean') return;

  // Prevent re-processing if clicking the already selected country
  if (selectedCountry === countryElement) return;

  // 1. Reset previous selection color
  if (selectedCountry) {
    resetCountryColor(selectedCountry);
  }

  // 2. Highlight new selection
  highlightCountry(countryElement);
  selectedCountry = countryElement;

  // 3. Open Popup Modal
  openPopup(countryElement.id);
});

// --- SVG HIGHLIGHTING HELPERS ---

function getShapes(element) {
  return element.matches('path, circle, polygon, rect')
    ? [element]
    : element.querySelectorAll('path, circle, polygon, rect');
}

function highlightCountry(element) {
  getShapes(element).forEach((shape) => {
    shape.style.fill = '#ff0000'; // Highlight color
    
    // Unhide small island helper circles if present
    if (shape.classList.contains('circlexx') || shape.classList.contains('subxx')) {
      shape.style.opacity = '1';
    }
  });
}

function resetCountryColor(element) {
  getShapes(element).forEach((shape) => {
    shape.style.fill = '';    // Reset to CSS default
    shape.style.opacity = ''; // Reset opacity
  });
}

// --- LOCAL DATA FETCHING ---

async function openPopup(countryCode) {
  try {
    const code = countryCode.toUpperCase();

    // 1. Fetch local JSON file ONCE
    if (!cachedCountriesData) {
      const response = await fetch('./countries.json');
      if (!response.ok) throw new Error(`Could not load local countries.json file.`);
      
      const rawData = await response.json();
      
      // Ensure cachedCountriesData is an array regardless of JSON structure
      if (Array.isArray(rawData)) {
        cachedCountriesData = rawData;
      } else if (rawData.countries && Array.isArray(rawData.countries)) {
        cachedCountriesData = rawData.countries;
      } else if (rawData.data && Array.isArray(rawData.data)) {
        cachedCountriesData = rawData.data;
      } else {
        // If JSON is an object with country codes as keys (e.g. { "US": { name: ... } })
        cachedCountriesData = Object.values(rawData);
      }
    }

    // 2. Find country by code matching flexible property names
    const countryData = cachedCountriesData.find(
      (c) => (c.alpha2Code && c.alpha2Code.toUpperCase() === code) || 
             (c.alpha3Code && c.alpha3Code.toUpperCase() === code) ||
             (c.code && c.code.toUpperCase() === code) ||
             (c.cca2 && c.cca2.toUpperCase() === code) ||
             (c.cca3 && c.cca3.toUpperCase() === code)
    );

    if (!countryData) {
      console.warn(`No data found in JSON for country code: ${code}`);
      return;
    }

    // 3. Extract details safely
    const countryDetails = {
      name: countryData.name?.common || countryData.name || code,
      capital: Array.isArray(countryData.capital) ? countryData.capital[0] : (countryData.capital || 'N/A'),
      population: countryData.population !== undefined 
        ? countryData.population.toLocaleString() 
        : 'N/A',
      region: countryData.region || countryData.continent || 'N/A',
      subregion: countryData.subregion || 'N/A',
      flag: countryData.flag || countryData.emoji || '🚩'
    };

    console.log('Successfully loaded country data:', countryDetails);
    displayModalUI(countryDetails);

  } catch (error) {
    console.error('Error loading local JSON file:', error);
  }
}

// --- UI DISPLAY HELPER ---

function displayModalUI(country) {
  alert(`
    ${country.flag} Country: ${country.name}
    🏛️ Capital: ${country.capital}
    👥 Population: ${country.population}
    🌍 Region: ${country.region}
  `);
}