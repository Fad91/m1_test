// Переменные

let catalog = document.querySelector(".catalog");
let cards = [];
let maxShowCardsCount = 6;

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

card.querySelector(".card__title").textContent = `Портупея "${good.name}"`
  return card
}

function renderCard(cards) {
  let cardsToRender = cards.slice(0, Math.min(cards.length, maxShowCardsCount));
    for (let i = 0; i < cardsToRender.length; i++) {
      let cardElement = createCard(cardsToRender[i]);
      catalog.append(cardElement)
    }
}
