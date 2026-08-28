document.querySelector('svg').addEventListener('click', (e) => {
  // 1. Find the top-level element (a direct child of <svg> or a top <g>)
  // This looks for a <g id="..."> or <path id="..."> that sits near the top level
  const countryElement = e.target.closest('svg > g[id], svg > path[id]');

  // 2. Ignore clicks on non-country elements like the ocean
  if (countryElement && countryElement.id !== 'ocean') {
    const countryCode = countryElement.id; // Guaranteed to be "hk" in your example
    
    // Grab the name from the top-level <title> tag if available
    const titleTag = countryElement.querySelector('title');
    const countryName = titleTag ? titleTag.textContent : countryCode.toUpperCase();

    console.log(`Country Code: ${countryCode} - Name: ${countryName}`);
    
    // Trigger your pop-up modal
    openPopup(countryCode, countryName);
  }
});

function openPopup(countryCode, countryName) {
  // 1. Fetch basic info (can be a local JSON object/file)
  // 2. Show form to input personal notes/visited status
  // 3. Save to localStorage: localStorage.setItem(countryId, JSON.stringify(userData));
}