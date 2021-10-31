// Переменные

let pageBody = document.querySelector("body");
let catalogSection = document.querySelector(".catalog-section");
let catalog = document.querySelector(".catalog");
let cards = [];
let maxShowCardsCount = 6;
let eroticCatalog = document.querySelector(".catalog--erotic");
let dailyButton = document.querySelector("#daily");
let eroticButton = document.querySelector("#erotic");
let dailyHeaderButton = document.querySelector("#header-daily");
let headerEroticButton = document.querySelector("#header-erotic");
let target = document.querySelector("#catalog");
let overlay = document.querySelector(".overlay");
let popup = document.querySelector(".popup");
let form = document.querySelector(".popup form");
let COUNTRY_CODE = "+7";
let NAME_LENGTH = 2;
let PHONE_LENGTH = 17;
let length = COUNTRY_CODE.length;
let nameInput = document.querySelector("#name");
let phoneInput = document.querySelector("#tel");

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

  if (good.discount) {
    let discount = card.querySelector(".card__discount");
    discount.classList.remove("card__discount--hidden");
    discount.textContent = good.discount;
  }
  // Функция вызова поп-апа
  function makeOrder() {
    if (catalog) {
      let cardButtons = card.querySelectorAll("#card-button");
      cardButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          popup.classList.remove("popup--hidden");
          overlay.classList.remove("overlay--hidden");
          bodyScrollLock.disableBodyScroll(pageBody);
          //  Отрисовка значении попапа
          let popupTitle = document.querySelector(".popup__title");
          let popupImage = document.querySelector(".popup__image");
          let popupPrice = popup.querySelector(".prices__price");
          let popupOldPrice = popup.querySelector(".prices__old-price");
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

// Закрытие Попапа

if (popup) {
  function closePopup() {
    // let popupButton = popup.querySelector(".popup__button");
    // popupButton.addEventListener("click", function () {
    //   popup.classList.add("popup--hidden");
    //   overlay.classList.add("overlay--hidden");
    //   bodyScrollLock.enableBodyScroll(pageBody);
    // });
    let popupCloseButton = popup.querySelector(".popup__close-button");
    popupCloseButton.addEventListener("click", function () {
      popup.classList.add("popup--hidden");
      overlay.classList.add("overlay--hidden");
      bodyScrollLock.enableBodyScroll(pageBody);
    });
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

// Валидация формы

function replacePhoneValue(el) {
  var matrix = COUNTRY_CODE + " " + "(___) ___ __ __";
  var def = matrix.replace(/\D/g, "");
  var i = 0;
  var val = el.value.replace(/\D/g, "");
  if (def.length >= val.length) {
    val = def;
  }
  el.value = matrix.replace(/./g, function (a) {
    if (/[_\d]/.test(a) && i < val.length) {
      return val.charAt(i++);
    }
    if (i >= val.length) {
      return "";
    } else {
      return a;
    }
  });
}

function onInputPhoneInput(e) {
  replacePhoneValue(e.target);
}

function onFocusPhoneInput(e) {
  if (!e.target.value) {
    e.target.value = COUNTRY_CODE;
    e.target.addEventListener("input", onInputPhoneInput);
    e.target.addEventListener("blur", onBlurPhoneInput);
    e.target.addEventListener("keydown", onKeydownPhoneInput);
  }
}

function onKeydownPhoneInput(e) {
  if (
    e.target.selectionStart <= length &&
    e.keyCode !== 8 &&
    e.keyCode !== 46
  ) {
    e.target.setSelectionRange(length, length);
  }
  if (
    (e.target.selectionStart === length || e.target.selectionStart === 1) &&
    e.keyCode === 8
  ) {
    e.preventDefault();
  }
  if (e.target.selectionStart === 1 && e.keyCode === 46) {
    e.preventDefault();
  }
}

function onBlurPhoneInput(e) {
  if (e.target.value === COUNTRY_CODE) {
    e.target.value = "";
    e.target.removeEventListener("input", onInputPhoneInput);
    e.target.removeEventListener("blur", onBlurPhoneInput);
  }
}

function initPhoneMask() {
  phoneInput.addEventListener("focus", onFocusPhoneInput);
  if (phoneInput.value) {
    replacePhoneValue(phoneInput);
    phoneInput.addEventListener("input", onInputPhoneInput);
    phoneInput.addEventListener("blur", onBlurPhoneInput);
    phoneInput.addEventListener("keydown", onKeydownPhoneInput);
  }
}

function validateInput(input, inputLength) {
  var flag = true;
  if (input.value.length < inputLength) {
    flag = false;
    input.classList.add("popup__input--has-error");
  }
  return flag;
}

function cleanInputs() {
  nameInput.addEventListener("input", function () {
    nameInput.classList.remove("popup__input--has-error");
  });
  phoneInput.addEventListener("input", function () {
    phoneInput.classList.remove("popup__input--has-error");
  });
}

function initFormValidate() {
  if (!form) {
    return;
  }

  form.noValidate = true;
  cleanInputs();
  initPhoneMask();
  form.addEventListener("submit", function (e) {
    validateInput(nameInput, NAME_LENGTH);
    validateInput(phoneInput, PHONE_LENGTH);
    e.preventDefault();
    if (
      validateInput(nameInput, NAME_LENGTH) &&
      validateInput(phoneInput, PHONE_LENGTH)
    ) {
      popup.classList.add("popup--hidden");
      overlay.classList.add("overlay--hidden");
      bodyScrollLock.enableBodyScroll(pageBody);
    }
    if (
      validateInput(nameInput, NAME_LENGTH) ||
      validateInput(phoneInput, PHONE_LENGTH)
    ) {
      setTimeout(function () {
        form.reset();
      }, 500);
    }
  });
}

initFormValidate();
