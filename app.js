const containers = document.querySelector(".containers");
const detailPage = document.querySelector(".detail-page");
const homePage = document.querySelector(".home-page");
const modeBtn = document.querySelector(".mode-switch")


async function fetchData() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  return data;
}

async function displayData() {
  const data = await fetchData();
  data.forEach((cardData) => {
    displayCards(cardData);
  });
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

displayData();

document.addEventListener("click", (e) => {
  let container = e.target.closest(".container");
  if (container) {
    let countryName = container.children[1].children[0].innerText;
    getDetailPageData(countryName);
  }
});

async function getDetailPageData(countryName) {
  const detailPageData = await fetchData();
  detailPageData.forEach((detail) => {
    if (detail.name.common === countryName) {
      showDetailPage(detail);
    }
  });
}

function showDetailPage(detail) {
  console.log(detail)

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
                  <p class="small-detail"><span>Native Name: </span>${Object.values(detail.name.nativeName)[0].common}</p>
                  <p class="small-detail"><span>Population: </span>${detail.population}</p>
                  <p class="small-detail"><span>Region: </span>${detail.region}</p>
                  <p class="small-detail"><span>Sub Region: </span>${detail.subregion}</p>
                  <p class="small-detail"><span>Capital: </span>${detail.capital}</p>
              </div>
              <div class="right-small-details">
                  <p class="small-detail"><span>Top Level Domain: </span>${detail.tld[0]}</p>
                  <p class="small-detail"><span>Currencies: </span>${
                    Object.values(detail.currencies)[0].name
                  }</p>
                  <p class="small-detail"><span>Languages: </span>${Object.values(Object.values(detail.languages)).join(
                    ", "
                  )}</p>
              </div>
          </div>
          <p><span>Border Countries:</span><span></span><span></span><span></span></p>
      </div>

  </div>`;
  detailPage.classList.remove("hide");
  homePage.classList.add("hide");
  detailPage.innerHTML = detailHtml;
}

function goBack() {
  detailPage.classList.add("hide");
  homePage.classList.remove("hide");
}




/* DARK AND LIGHT MODE TOGGLE */

modeBtn.addEventListener("click", () => {
  let currLightMode = modeBtn.classList.contains("light")
  let currDarkMode = modeBtn.classList.contains("dark")
  if(currLightMode) {
    modeBtn.classList.remove("light")
    modeBtn.classList.add("dark")
    homePage.style.backgroundColor = "hsl(207, 26%, 17%)"
    detailPage.style.backgroundColor = "hsl(207, 26%, 17%)"
    detailPage.style.color = "hsl(0, 0%, 100%)"
    homePage.style.color = "hsl(0, 0%, 100%)"
    document.querySelector(".navbar").style.backgroundColor = "hsl(209, 23%, 22%)"
    document.querySelector(".input").classList.add("input-dark-mode")
    document.querySelector(".navbar").style.color = "hsl(0, 0%, 100%)"
    document.querySelector(".input-bar").classList.add("input-bar-dark")
    document.querySelector(".select-menu").classList.add("select-menu-dark")
    document.querySelectorAll(".container").forEach((container) => container.style.backgroundColor = "hsl(209, 23%, 22%)")
  }
  else if(currDarkMode) {
    modeBtn.classList.remove("dark")
    modeBtn.classList.add("light")
    homePage.style.backgroundColor = "hsl(0, 0%, 98%)"
    detailPage.style.backgroundColor = "hsl(0, 0%, 98%)"
    detailPage.style.color = "hsl(200, 15%, 8%)"
    homePage.style.color = "hsl(200, 15%, 8%)"
    document.querySelector(".navbar").style.backgroundColor = "white"
    document.querySelector(".input").classList.remove("input-dark-mode")
    document.querySelector(".navbar").style.color = " hsl(200, 15%, 8%)"
    document.querySelector(".input-bar").classList.remove("input-bar-dark")
    document.querySelector(".select-menu").classList.remove("select-menu-dark")
    document.querySelectorAll(".container").forEach((container) => container.style.backgroundColor = " hsl(0, 0%, 100%)")
  }
 
 
})
