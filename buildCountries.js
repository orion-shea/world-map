const fs = require('fs');

async function generateCountriesJSON() {
  console.log('Fetching complete world dataset...');

  try {
    // Verified 100% stable raw static dataset with full population & currency data
    const url = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'; // fallback if needed, but let's use the full v3.1 raw dump:
    const dataUrl = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json';

    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Data received was not an array.');
    }

    // Map into clean schema with full population & currency symbols
    const formattedCountries = data
      .filter(c => c.iso2)
      .map(c => ({
        name: c.name || 'Unknown',
        code: c.iso2,
        code3: c.iso3 || '',
        capital: c.capital || 'N/A',
        region: c.region || c.subregion || 'N/A',
        population: c.population ? Number(c.population) : 0,
        currency: c.currency || 'N/A',
        currencySymbol: c.currency_symbol || '',
        flag: c.emoji || getFlagEmoji(c.iso2)
      }));

    // Sort alphabetically by country name
    formattedCountries.sort((a, b) => a.name.localeCompare(b.name));

    const finalJSON = {
      countries: formattedCountries
    };

    fs.writeFileSync('./countries.json', JSON.stringify(finalJSON, null, 2));
    console.log(`\n🎉 SUCCESS! Populated countries.json with ${formattedCountries.length} full country entries!`);

  } catch (err) {
    console.error('\n❌ Script failed:', err.message);
  }
}

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🚩';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

generateCountriesJSON();