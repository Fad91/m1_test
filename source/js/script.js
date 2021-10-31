// Переменные

let catalogSection = document.querySelector(".catalog-section")
let catalog = document.querySelector(".catalog");
let cards = [];
let maxShowCardsCount = 6;
let eroticCatalog = document.querySelector(".catalog--erotic");
let dailyButton = document.querySelector("#daily");
let eroticButton = document.querySelector("#erotic");
let dailyHeaderButton = document.querySelector("#header-daily");
let headerEroticButton = document.querySelector("#header-erotic");
let target = document.querySelector("#catalog");
let popup = document.querySelector(".popup");

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
    sizesItems[i].dataset["instock"] = good.sizes[i];
    if (sizesItems[i].dataset["instock"] === "false") {
      sizesItems[i].classList.add("sizes-list__item--inactive");
    }
  }

  for (let j = 0; j < colorItems.length; j++) {
    colorItems[j].dataset["instock"] = good.colors[j];
    if (colorItems[j].dataset["instock"] === "false") {
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
  // Функция вызова поп-апа
  function makeOrder() {
    if (catalog) {
      let cardButtons = card.querySelectorAll("#card-button");
      cardButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
         popup.classList.remove("popup--hidden")
        //  Отрисовка значении попапа
         let popupTitle = document.querySelector(".popup__title");
         let popupImage = document.querySelector(".popup__image")
         let popupPrice = popup.querySelector(".prices__price")
         let popupOldPrice = popup.querySelector(".prices__old-price")
         popupTitle.textContent = `Портупея "${good.name}"`;
         popupImage.src = good.img;
         popupPrice.textContent = good.price;
         if (popupOldPrice) {
           popupOldPrice.textContent = good.oldPrice;
         } else {
          popupOldPrice.classList.add("prices__old-price--hidden");
         }
        });
      });
    }
  }
  makeOrder();

  return card;
}

if (popup) {
  function closePopup() {
    let popupButton = popup.querySelector(".popup__button");
    popupButton.addEventListener("click", function() {
      popup.classList.add("popup--hidden")
    })
  }
}
closePopup();

// Отрисовка карточки товара

function renderCard(cards) {
  let cardsToRender = cards.slice(0, Math.min(cards.length, maxShowCardsCount));
  for (let i = 0; i < cardsToRender.length; i++) {
    let cardElement = createCard(cardsToRender[i]);
    catalog.append(cardElement);
  }
}

// Функция заказа

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

// Плавный скролл при нажатии на кнопки каталога в интро-блоке

function addSmoothScroll() {
  let moveTo = new MoveTo({
    duration: 1200,
  });
  if (dailyHeaderButton) {
    dailyHeaderButton.addEventListener("click", function () {
      moveTo.move(target);
    });
  }
  if (headerEroticButton) {
    headerEroticButton.addEventListener("click", function () {
      moveTo.move(target);
      dailyButton.classList.remove("catalog-section__button--active");
      eroticButton.classList.add("catalog-section__button--active");
      catalog.classList.add("catalog--inactive");
      eroticCatalog.classList.remove("catalog--inactive");
    });
  }
}

addSmoothScroll();
// let triggers = menuLinks;

// triggers.forEach(function (trigger) {
//   moveTo.registerTrigger(trigger);
// });

// Кастомный селект

if (document.querySelector("#select-1")) {
  const select1 = new CustomSelect("#select-1");
}
