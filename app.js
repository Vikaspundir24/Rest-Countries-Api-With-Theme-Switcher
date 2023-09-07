const containers = document.querySelector(".containers");
const detailPage = document.querySelector(".detail-page");
const homePage = document.querySelector(".home-page");
const modeBtn = document.querySelector(".mode-switch");
const selectMenu = document.querySelector(".select-menu");
const loader = document.querySelector(".loader");

async function fetchDataAll() {
  loader.style.display = "block";
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  loader.style.display = "none";
  return data;
}

async function displayData() {
  const data = await fetchDataAll();
  data.forEach((cardData) => {
    displayCards(cardData);
  });
}

displayData();

/* FILTER BY REGION */

async function fetchRegionData(region) {
  containers.innerHTML = "";
  if (region.value === "all") {
    displayData();
  } else {
    loader.style.display = "block";
    const response = await fetch(
      `https://restcountries.com/v3.1/region/${region.value}`
    );
    const data = await response.json();
    loader.style.display = "none";
    data.forEach((cardData) => {
      displayCards(cardData);
    });
  }
}

/* SEARCH BY INPUT */

async function fetchSearchData(event) {
  if (event.keyCode == 13) {
    if (event.target.value == "") {
      displayData();
    } else {
      loader.style.display = "block";
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${event.target.value}`
      );
      const data = await response.json();
      loader.style.display = "none";
      if (data.status != 404) {
        containers.innerHTML = "";
        data.forEach((cardData) => {
          displayCards(cardData);
        });
      }
    }
  }
}

function displayCards(cardData) {
  const html = `<div class="container">
    <img src="${cardData.flags.png}"class="flag-image" alt="">
    <div class="details">
      <h2 class="country-name">${cardData.name.common}</h2>
      <p class="country-population"><span>Population: </span>${cardData.population}</p>
      <p class="country-region"><span>Region: </span>${cardData.region}</p>
      <p class="country-capital"><span>Capital: </span>${cardData.capital}</p>
    </div>
  </div>`;
  containers.insertAdjacentHTML("beforeend", html);
}

document.addEventListener("click", (e) => {
  let container = e.target.closest(".container");
  let liTag = e.target.closest(".country-list")
  if (container) {
    let countryName = container.children[1].children[0].innerText;
    getDetailPageData(countryName);
  }

  else if(liTag) {
    let borderCoutryName = liTag.innerHTML
    console.log(borderCoutryName)
    fetchByBorderName(borderCoutryName)
  }
});

async function getDetailPageData(countryName) {
  loader.style.display = "block";
  const detailPageData = await fetchDataAll();
  loader.style.display = "none";
  detailPageData.forEach((detail) => {
    if (detail.name.common === countryName) {
      showDetailPage(detail);
      getBorderData(detail);
    }
  });
}

function showDetailPage(detail) {
  const detailHtml = `
  <div class="back"  onClick="goBack()">
  <button class="back-btn"><i class="fa-solid fa-arrow-left"></i>Back</button>
  </div> 
  <div class="country-details">
      <div class="left-flag">
      <img src="${detail.flags.png}" alt="">
      </div>
      <div class="right-details">
          <h1 class="country-name">${detail.name.common}</h1>
          <div class="small-details">
              <div class="left-small-details">
                  <p class="small-detail"><span>Native Name: </span>${
                    Object.values(detail.name.nativeName)[0].common
                  }</p>
                  <p class="small-detail"><span>Population: </span>${
                    detail.population
                  }</p>
                  <p class="small-detail"><span>Region: </span>${
                    detail.region
                  }</p>
                  <p class="small-detail"><span>Sub Region: </span>${
                    detail.subregion
                  }</p>
                  <p class="small-detail"><span>Capital: </span>${
                    detail.capital
                  }</p>
              </div>
              <div class="right-small-details">
                  <p class="small-detail"><span>Top Level Domain: </span>${
                    detail.tld[0]
                  }</p>
                  <p class="small-detail"><span>Currencies: </span>${
                    Object.values(detail.currencies)[0].name
                  }</p>
                  <p class="small-detail"><span>Languages: </span>${Object.values(
                    Object.values(detail.languages)
                  ).join(", ")}</p>
              </div>
          </div>
          <p class="border-ct-main"><span>Border Countries:</span><span class ="border-countries"></span> </p>
      </div>

  </div>`;
  detailPage.style.display = "flex";
  homePage.style.display = "none";
  detailPage.innerHTML = detailHtml;
  getBorderData(detail)
}

async function getBorderData(detail) {
  let ctName = detail.name.common;
  let borders;
  const response = await fetch("./data.json");
  const resData = await response.json();
  resData.forEach((ct) => {
    if (ct.name === ctName) {
      if (ct.borders) {
        loader.style.display = "block";
        borders = ct.borders;
        console.log(borders);
        borders.forEach((border) => fetchBorderData(border));
      }
    }
    loader.style.display = "none";
  });
}

async function fetchBorderData(border) {
  const response = await fetch(`https://restcountries.com/v3.1/alpha/${border}
  `);
  const data = await response.json();

  const country = data[0].name.common;
  console.log(country);
  const ct = document.createElement("li");
  ct.innerHTML = country;
  ct.classList.add("country-list")
  const borderCountries = document.querySelector(".border-countries");
  borderCountries.appendChild(ct);
}

async function fetchByBorderName(country) {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${country}`
  );
  const data = await response.json();
  showDetailPage(data[0])
}

function goBack() {
  detailPage.style.display = "none";
  homePage.style.display = "block";
}

/* DARK AND LIGHT MODE TOGGLE */

modeBtn.addEventListener("click", () => {
  let currLightMode = modeBtn.classList.contains("light");
  let currDarkMode = modeBtn.classList.contains("dark");
  if (currLightMode) {
    modeBtn.classList.remove("light");
    modeBtn.classList.add("dark");
    homePage.style.backgroundColor = "hsl(207, 26%, 17%)";
    detailPage.style.backgroundColor = "hsl(207, 26%, 17%)";
    detailPage.style.color = "hsl(0, 0%, 100%)";
    homePage.style.color = "hsl(0, 0%, 100%)";
    document.querySelector(".navbar").style.backgroundColor =
      "hsl(209, 23%, 22%)";
    document.querySelector(".input").classList.add("input-dark-mode");
    document.querySelector(".navbar").style.color = "hsl(0, 0%, 100%)";
    document.querySelector(".input-bar").classList.add("input-bar-dark");
    document.querySelector(".select-menu").classList.add("select-menu-dark");
    document
      .querySelectorAll(".container")
      .forEach(
        (container) => (container.style.backgroundColor = "hsl(209, 23%, 22%)")
      );

   
  } else if (currDarkMode) {
    modeBtn.classList.remove("dark");
    modeBtn.classList.add("light");
    homePage.style.backgroundColor = "hsl(0, 0%, 98%)";
    detailPage.style.backgroundColor = "hsl(0, 0%, 98%)";
    detailPage.style.color = "hsl(200, 15%, 8%)";
    homePage.style.color = "hsl(200, 15%, 8%)";
    document.querySelector(".navbar").style.backgroundColor = "white";
    document.querySelector(".input").classList.remove("input-dark-mode");
    document.querySelector(".navbar").style.color = " hsl(200, 15%, 8%)";
    document.querySelector(".input-bar").classList.remove("input-bar-dark");
    document.querySelector(".select-menu").classList.remove("select-menu-dark");
    document
      .querySelectorAll(".container")
      .forEach(
        (container) => (container.style.backgroundColor = " hsl(0, 0%, 100%)")
      );
  }
});
