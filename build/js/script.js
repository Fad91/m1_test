// Переменные

let catalog = document.querySelector(".catalog");
let cards = [];
let maxShowCardsCount = 6;
let eroticCatalog = document.querySelector(".catalog--erotic");
let dailyButton = document.querySelector("#daily");
let eroticButton = document.querySelector("#erotic");

// Получение данных о товарах

function getData() {
  fetch("js/daily-goods.json", {
    method: "GET",
    credentials: "same-origin",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (loadedCards) {
      cards = loadedCards;
      // render();
      renderCard(loadedCards);
    });
}

function loadData() {
  window.addEventListener("load", function () {
    getData();
  });
}

loadData();

// Отрисовка карточек товара

function render() {
  catalog.innerHTML = "";
}

// Cоздание карточки товара

function createCard(good) {
  let cardTemplate = document.querySelector("#card");
  let card = cardTemplate.content.cloneNode(true);
  let sizesList = card.querySelector(".sizes-list");
  let sizesItems = sizesList.querySelectorAll(".sizes-list__item");
  let colorsList = card.querySelector(".colors-list");
  let colorItems = colorsList.querySelectorAll(".colors-list__item");
  card.querySelector(".card__img").src = good.img;
  card.querySelector(".card__title").textContent = `Портупея "${good.name}"`;

  for (let i = 0; i < sizesItems.length; i++) {
    sizesItems[i].dataset["value"] = good.sizes[i];
    if (sizesItems[i].dataset["value"] === "false") {
      sizesItems[i].classList.add("sizes-list__item--inactive");
    }
  }

  for (let j = 0; j < colorItems.length; j++) {
    colorItems[j].dataset["value"] = good.colors[j];
    if (colorItems[j].dataset["value"] === "false") {
      colorItems[j].classList.add("colors-list__item--inactive");
    }
  }

  if (good.oldPrice) {
    card.querySelector(".prices__old-price").textContent = good.oldPrice;
  } else {
    card
      .querySelector(".prices__old-price")
      .classList.add("prices__old-price--hidden");
  }

  if (good.price) {
    card.querySelector(".prices__price").textContent = good.price;
  }

  return card;
}

function renderCard(cards) {
  let cardsToRender = cards.slice(0, Math.min(cards.length, maxShowCardsCount));
  for (let i = 0; i < cardsToRender.length; i++) {
    let cardElement = createCard(cardsToRender[i]);
    catalog.append(cardElement);
  }
}

// Переключение каталогов

if (catalog && eroticCatalog) {
  function changeCatalogues() {
    if (dailyButton && eroticButton) {
      dailyButton.addEventListener("click", function () {
        dailyButton.classList.add("catalog-section__button--active");
        if (
          eroticButton.classList.contains("catalog-section__button--active")
        ) {
          eroticButton.classList.remove("catalog-section__button--active");
        }
        catalog.classList.remove("catalog--inactive");
        eroticCatalog.classList.add("catalog--inactive");
      });
      eroticButton.addEventListener("click", function () {
        eroticButton.classList.add("catalog-section__button--active");
        if (dailyButton.classList.contains("catalog-section__button--active")) {
          dailyButton.classList.remove("catalog-section__button--active");
        }
        catalog.classList.add("catalog--inactive");
        eroticCatalog.classList.remove("catalog--inactive");
      });
    }
  }
}

changeCatalogues();
