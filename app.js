const containers = document.querySelector(".containers");

async function fetchData() {
  const response = await fetch("/data.json");
  const data = await response.json();
  return data;
}

async function displayData() {
    const data = await fetchData()
    data.forEach((cardData) => {
        displayCards(cardData)
    })
}

function displayCards(cardData) {
    const html = `<div class="container">
    <img src="${cardData.flags.png}"class="flag-image" alt="">
    <div class="details">
      <h2 class="country-name">${cardData.name}</h2>
      <p class="country-population"><span>Population: </span>${cardData.population}</p>
      <p class="country-region"><span>Region: </span>${cardData.region}</p>
      <p class="country-capital"><span>Capital: </span>${cardData.capital}</p>
    </div>
  </div>`
  containers.insertAdjacentHTML("beforeend" ,html)
}

displayData()