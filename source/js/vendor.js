/*!
 * MoveTo - A lightweight scroll animation javascript library without any dependency.
 * Version 1.8.3 (21-07-2019 00:32)
 * Licensed under MIT
 * Copyright 2019 Hasan Aydoğdu <hsnaydd@gmail.com>
 */

"use strict";

var MoveTo = function () {
  /**
   * Defaults
   * @type {object}
   */
  var defaults = {
    tolerance: 0,
    duration: 800,
    easing: 'easeOutQuart',
    container: window,
    callback: function callback() {}
  };
  /**
   * easeOutQuart Easing Function
   * @param  {number} t - current time
   * @param  {number} b - start value
   * @param  {number} c - change in value
   * @param  {number} d - duration
   * @return {number} - calculated value
   */

  function easeOutQuart(t, b, c, d) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
  }
  /**
   * Merge two object
   *
   * @param  {object} obj1
   * @param  {object} obj2
   * @return {object} merged object
   */


  function mergeObject(obj1, obj2) {
    var obj3 = {};
    Object.keys(obj1).forEach(function (propertyName) {
      obj3[propertyName] = obj1[propertyName];
    });
    Object.keys(obj2).forEach(function (propertyName) {
      obj3[propertyName] = obj2[propertyName];
    });
    return obj3;
  }

  ;
  /**
   * Converts camel case to kebab case
   * @param  {string} val the value to be converted
   * @return {string} the converted value
   */

  function kebabCase(val) {
    return val.replace(/([A-Z])/g, function ($1) {
      return '-' + $1.toLowerCase();
    });
  }

  ;
  /**
   * Count a number of item scrolled top
   * @param  {Window|HTMLElement} container
   * @return {number}
   */

  function countScrollTop(container) {
    if (container instanceof HTMLElement) {
      return container.scrollTop;
    }

    return container.pageYOffset;
  }

  ;
  /**
   * MoveTo Constructor
   * @param {object} options Options
   * @param {object} easeFunctions Custom ease functions
   */

  function MoveTo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var easeFunctions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.options = mergeObject(defaults, options);
    this.easeFunctions = mergeObject({
      easeOutQuart: easeOutQuart
    }, easeFunctions);
  }
  /**
   * Register a dom element as trigger
   * @param  {HTMLElement} dom Dom trigger element
   * @param  {function} callback Callback function
   * @return {function|void} unregister function
   */


  MoveTo.prototype.registerTrigger = function (dom, callback) {
    var _this = this;

    if (!dom) {
      return;
    }

    var href = dom.getAttribute('href') || dom.getAttribute('data-target'); // The element to be scrolled

    var target = href && href !== '#' ? document.getElementById(href.substring(1)) : document.body;
    var options = mergeObject(this.options, _getOptionsFromTriggerDom(dom, this.options));

    if (typeof callback === 'function') {
      options.callback = callback;
    }

    var listener = function listener(e) {
      e.preventDefault();

      _this.move(target, options);
    };

    dom.addEventListener('click', listener, false);
    return function () {
      return dom.removeEventListener('click', listener, false);
    };
  };
  /**
   * Move
   * Scrolls to given element by using easeOutQuart function
   * @param  {HTMLElement|number} target Target element to be scrolled or target position
   * @param  {object} options Custom options
   */


  MoveTo.prototype.move = function (target) {
    var _this2 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (target !== 0 && !target) {
      return;
    }

    options = mergeObject(this.options, options);
    var distance = typeof target === 'number' ? target : target.getBoundingClientRect().top;
    var from = countScrollTop(options.container);
    var startTime = null;
    var lastYOffset;
    distance -= options.tolerance; // rAF loop

    var loop = function loop(currentTime) {
      var currentYOffset = countScrollTop(_this2.options.container);

      if (!startTime) {
        // To starts time from 1, we subtracted 1 from current time
        // If time starts from 1 The first loop will not do anything,
        // because easing value will be zero
        startTime = currentTime - 1;
      }

      var timeElapsed = currentTime - startTime;

      if (lastYOffset) {
        if (distance > 0 && lastYOffset > currentYOffset || distance < 0 && lastYOffset < currentYOffset) {
          return options.callback(target);
        }
      }

      lastYOffset = currentYOffset;

      var val = _this2.easeFunctions[options.easing](timeElapsed, from, distance, options.duration);

      options.container.scroll(0, val);

      if (timeElapsed < options.duration) {
        window.requestAnimationFrame(loop);
      } else {
        options.container.scroll(0, distance + from);
        options.callback(target);
      }
    };

    window.requestAnimationFrame(loop);
  };
  /**
   * Adds custom ease function
   * @param {string}   name Ease function name
   * @param {function} fn   Ease function
   */


  MoveTo.prototype.addEaseFunction = function (name, fn) {
    this.easeFunctions[name] = fn;
  };
  /**
   * Returns options which created from trigger dom element
   * @param  {HTMLElement} dom Trigger dom element
   * @param  {object} options The instance's options
   * @return {object} The options which created from trigger dom element
   */


  function _getOptionsFromTriggerDom(dom, options) {
    var domOptions = {};
    Object.keys(options).forEach(function (key) {
      var value = dom.getAttribute("data-mt-".concat(kebabCase(key)));

      if (value) {
        domOptions[key] = isNaN(value) ? value : parseInt(value, 10);
      }
    });
    return domOptions;
  }

  return MoveTo;
}();

if (typeof module !== 'undefined') {
  module.exports = MoveTo;
} else {
  window.MoveTo = MoveTo;
}

// Custom select

const CLASS_NAME_SELECT = 'select';
const CLASS_NAME_ACTIVE = 'select_show';
const CLASS_NAME_SELECTED = 'select__option_selected';
const SELECTOR_ACTIVE = '.select_show';
const SELECTOR_DATA = '[data-select]';
const SELECTOR_DATA_TOGGLE = '[data-select="toggle"]';
const SELECTOR_OPTION_SELECTED = '.select__option_selected';

class CustomSelect {
  constructor(target, params) {
    this._elRoot = typeof target === 'string' ? document.querySelector(target) : target;
    this._params = params || {};
    if (this._params['options']) {
      this._elRoot.classList.add(CLASS_NAME_SELECT);
      this._elRoot.innerHTML = CustomSelect.template(this._params);
    }
    this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
    this._elRoot.addEventListener('click', this._onClick.bind(this));
  }
  _onClick(e) {
    const target = e.target;
    const type = target.closest(SELECTOR_DATA).dataset.select;
    switch (type) {
      case 'toggle':
        this.toggle();
        break;
      case 'option':
        this._changeValue(target);
        break;
    }
  }
  _update(option) {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    option.classList.add(CLASS_NAME_SELECTED);
    this._elToggle.textContent = option.textContent;
    this._elToggle.value = option.dataset['value'];
    this._elToggle.dataset.index = option.dataset['index'];
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, option) : null;
    return option.dataset['value'];
  }
  _reset() {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    this._elToggle.textContent = 'Выберите из списка';
    this._elToggle.value = '';
    this._elToggle.dataset.index = -1;
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, null) : null;
    return '';
  }
  _changeValue(option) {
    if (option.classList.contains(CLASS_NAME_SELECTED)) {
      return;
    }
    this._update(option);
    this.hide();
  }
  show() {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
    this._elRoot.classList.add(CLASS_NAME_ACTIVE);
  }
  hide() {
    this._elRoot.classList.remove(CLASS_NAME_ACTIVE);
  }
  toggle() {
    if (this._elRoot.classList.contains(CLASS_NAME_ACTIVE)) {
      this.hide();
    } else {
      this.show();
    }
  }
  dispose() {
    this._elRoot.removeEventListener('click', this._onClick);
  }
  get value() {
    return this._elToggle.value;
  }
  set value(value) {
    let isExists = false;
    this._elRoot.querySelectorAll('.select__option').forEach((option) => {
      if (option.dataset['value'] === value) {
        isExists = true;
        return this._update(option);
      }
    });
    if (!isExists) {
      return this._reset();
    }
  }
  get selectedIndex() {
    return this._elToggle.dataset['index'];
  }
  set selectedIndex(index) {
    const option = this._elRoot.querySelector(`.select__option[data-index="${index}"]`);
    if (option) {
      return this._update(option);
    }
    return this._reset();
  }
}

CustomSelect.template = params => {
  const name = params['name'];
  const options = params['options'];
  const targetValue = params['targetValue'];
  let items = [];
  let selectedIndex = -1;
  let selectedValue = '';
  let selectedContent = 'Выберите из списка';
  options.forEach((option, index) => {
    let selectedClass = '';
    if (option[0] === targetValue) {
      selectedClass = ' select__option_selected';
      selectedIndex = index;
      selectedValue = option[0];
      selectedContent = option[1];
    }
    items.push(`<li class="select__option${selectedClass}" data-select="option" data-value="${option[0]}" data-index="${index}">${option[1]}</li>`);
  });
  return `<button type="button" class="select__toggle" name="${name}" value="${selectedValue}" data-select="toggle" data-index="${selectedIndex}">${selectedContent}</button>
  <div class="select__dropdown">
    <ul class="select__options">${items.join('')}</ul>
  </div>`;
};


document.addEventListener('click', (e) => {
  if (!e.target.closest('.select')) {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
  }
});
