const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

const iconMenu = document.querySelector('.icon-menu');
const headerBody = document.querySelector('.header__menu');

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    document.documentElement.classList.toggle("menu-open");
  });
}

document.addEventListener("click", function (e) {
  const isClickInsideMenu = headerBody && headerBody.contains(e.target);
  const isClickOnBurger = iconMenu && iconMenu.contains(e.target);

  if (!isClickInsideMenu && !isClickOnBurger) {
    document.documentElement.classList.remove("menu-open");
  }
});

//========================================================================================================================================================

// Добавление к шапке при скролле
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('_header-scroll');
      document.documentElement.classList.add('header-scroll');
    } else {
      header.classList.remove('_header-scroll');
      document.documentElement.classList.remove('header-scroll');
    }
  });
}

//========================================================================================================================================================

//Попап
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show"
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        goHash: true
      },
      on: {
        beforeOpen: function () { },
        afterOpen: function () { },
        beforeClose: function () { },
        afterClose: function () { }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.previousMenuState = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.eventsPopup();
  }
  eventsPopup() {
    document.addEventListener("click", function (e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if ("error" !== this._dataValue) {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));
    document.addEventListener("keydown", function (e) {
      if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && 9 == e.which && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", function () {
        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
      }.bind(this));
      window.addEventListener("load", function () {
        if (window.location.hash) this._openToHash();
      }.bind(this));
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
      if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(this.targetOpen.selector);
      if (this.targetOpen.element) {
        this.previousMenuState = document.documentElement.classList.contains('menu-open');
        if (this.previousMenuState) {
          if (typeof menuClose === 'function') {
            menuClose();
          } else {
            document.documentElement.classList.remove("menu-open");
            if (typeof bodyUnlock === 'function') bodyUnlock();
          }
        }
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        const videoElement = this.targetOpen.element.querySelector("video");
        if (videoElement) {
          videoElement.muted = true;
          videoElement.currentTime = 0;
          videoElement.play().catch((e => console.error("Autoplay error:", e)));
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    const videoElement = this.previousOpen.element.querySelector("video");
    if (videoElement) videoElement.pause();
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
      if (this.previousMenuState) {
        if (typeof menuOpen === 'function') {
          menuOpen();
        } else {
          document.documentElement.classList.add("menu-open");
          if (typeof bodyLock === 'function') bodyLock();
        }
      }
    }
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    this.options.on.afterClose(this);
  }
  _getHash() {
    if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
  }
  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && 0 === focusedIndex) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================

//Форма
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      formValidate.removeError(targetElement);
      targetElement.hasAttribute('data-validate') ? formValidate.removeError(targetElement) : null;
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      targetElement.hasAttribute('data-validate') ? formValidate.validateInput(targetElement) : null;
    }
  });
  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('.form__viewpass')) {
        const viewpassBlock = targetElement.closest('.form__viewpass');
        const input = viewpassBlock.closest('.form__input').querySelector('input');

        if (input) {
          const isActive = viewpassBlock.classList.contains('_viewpass-active');
          input.setAttribute("type", isActive ? "password" : "text");
          viewpassBlock.classList.toggle('_viewpass-active');
        } else {
          console.error('Input не найден!');
        }
      }
    });
  }
  if (options.autoHeight) {
    const textareas = document.querySelectorAll('textarea[data-autoheight]');
    if (textareas.length) {
      textareas.forEach(textarea => {
        const startHeight = textarea.hasAttribute('data-autoheight-min') ?
          Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
        const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
          Number(textarea.dataset.autoheightMax) : Infinity;
        setHeight(textarea, Math.min(startHeight, maxHeight))
        textarea.addEventListener('input', () => {
          if (textarea.scrollHeight > startHeight) {
            textarea.style.height = `auto`;
            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
          }
        });
      });
      function setHeight(textarea, height) {
        textarea.style.height = `${height}px`;
      }
    }
  }
}
formFieldsInit({
  viewPass: true,
  autoHeight: false
});

let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;

    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else if (formRequiredItem.dataset.validate === "password-confirm") {
      const passwordInput = document.getElementById('password');
      if (!passwordInput) return error;

      if (formRequiredItem.value !== passwordInput.value) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }

    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');
    let inputError = formRequiredItem.parentElement.querySelector('.form__error');
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    if (formRequiredItem.parentElement.querySelector('.form__error')) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    formRequiredItem.parentElement.classList.add('_form-success');
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('_form-success');
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll('input,textarea');
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_form-focus');
        el.classList.remove('_form-focus');

        el.classList.remove('_form-success');
        el.parentElement.classList.remove('_form-success');

        el.parentElement.classList.remove('filled');

        formValidate.removeError(el);

        if (el.classList.contains('telephone') && el.clearFilled) {
          el.clearFilled();
        }
      }

      let checkboxes = form.querySelectorAll('.checkbox__input');
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
          checkbox.classList.remove('_form-success');
          checkbox.closest('.checkbox')?.classList.remove('_form-success');
        }
      }

      if (modules_flsModules.select) {
        let selects = form.querySelectorAll('div.select');
        if (selects.length) {
          for (let index = 0; index < selects.length; index++) {
            const select = selects[index].querySelector('select');
            modules_flsModules.select.selectBuild(select);
          }
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};

function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener('reset', function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }

  async function formSubmitAction(form, e) {
    let hasError = false;
    const selectContents = form.querySelectorAll('.select__content');

    selectContents.forEach(content => {
      const selectItem = content.closest('.select');
      if (!selectItem) return;

      const originalSelect = selectItem.querySelector('select');
      if (!originalSelect) return;

      const value = content.value.trim();
      const formInput = selectItem.closest('.form__input');

      if (!value) {
        hasError = true;
        content.classList.add('_form-error');
        if (formInput) {
          formInput.classList.add('_form-error');
        }
      } else {
        content.classList.remove('_form-error');
        if (formInput) {
          formInput.classList.remove('_form-error');
        }
      }
    });

    if (hasError) {
      e.preventDefault();
      const firstError = form.querySelector('._form-error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;

    if (error === 0) {
      const ajax = form.hasAttribute('data-ajax');

      if (ajax) {
        e.preventDefault();

        const customSelects = form.querySelectorAll('.select');

        customSelects.forEach(selectItem => {
          const originalSelect = selectItem.querySelector('select');
          if (!originalSelect) return;

          let contactMethod = 'Не выбран';
          let contactValue = 'Не указан';

          const selectedOption = originalSelect.options[originalSelect.selectedIndex];

          if (selectedOption && selectedOption.value) {
            if (selectedOption.dataset.custom === 'true') {
              contactMethod = originalSelect.dataset.currentMethod || 'Не выбран';
              contactValue = originalSelect.dataset.userInput || selectedOption.value;
            } else {
              contactMethod = selectedOption.dataset.value || selectedOption.value;
              contactValue = selectedOption.value;
              originalSelect.dataset.currentMethod = contactMethod;
            }
          }

          const oldMethodInput = form.querySelector('input[name="contact_method"]');
          const oldValueInput = form.querySelector('input[name="user_contact_value"]');
          if (oldMethodInput) oldMethodInput.remove();
          if (oldValueInput) oldValueInput.remove();

          const methodInput = document.createElement('input');
          methodInput.type = 'hidden';
          methodInput.name = 'contact_method';
          methodInput.value = contactMethod;
          form.appendChild(methodInput);

          const valueInput = document.createElement('input');
          valueInput.type = 'hidden';
          valueInput.name = 'user_contact_value';
          valueInput.value = contactValue;
          form.appendChild(valueInput);
        });

        const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
        const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
        const formData = new FormData(form);

        form.classList.add('_sending');

        try {
          const response = await fetch(formAction, {
            method: formMethod,
            body: formData
          });

          if (response.ok) {
            const textResponse = await response.text();

            try {
              let responseResult = JSON.parse(textResponse);

              form.classList.remove('_sending');

              if (responseResult.success) {
                formSent(form, responseResult);

                setTimeout(() => {
                  form.reset();
                  const allSelects = form.querySelectorAll('select');
                  allSelects.forEach(select => {
                    delete select.dataset.userInput;
                    delete select.dataset.currentMethod;
                    const customOpt = select.querySelector('option[data-custom="true"]');
                    if (customOpt) customOpt.remove();
                    Array.from(select.options).forEach(option => {
                      if (option.dataset.originalValue) {
                        option.value = option.dataset.originalValue;
                        delete option.dataset.originalValue;
                      }
                    });
                    select.selectedIndex = 0;
                  });
                }, 500);

              } else {
                alert("Ошибка: " + (responseResult.message || "Неизвестная ошибка"));
              }
            } catch (parseError) {
              alert("Ошибка: сервер вернул неверный формат данных");
            }
          } else {
            alert("Ошибка сервера: " + response.status);
            form.classList.remove('_sending');
          }
        } catch (error) {
          alert("Ошибка отправки формы: " + error.message);
          form.classList.remove('_sending');
        }
      } else if (form.hasAttribute('data-dev')) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
        const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
        gotoBlock(formGoToErrorClass, true, 1000);
      }
    }
  }

  function formSent(form, responseResult = ``) {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));

    const telephoneInputs = form.querySelectorAll('.telephone');
    telephoneInputs.forEach(input => {
      input.value = '';
      const parent = input.closest('.form__input');
      if (parent) {
        parent.classList.remove('filled');
      }
    });

    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach(fileInput => {
      fileInput.value = '';
      const formFile = fileInput.closest('.form-file');
      if (formFile) {
        const formFileInput = formFile.querySelector('.form-file__input');
        if (formFileInput) {
          const originalText = formFileInput.dataset.originalText || 'Прикрепить текущий расчет / КП';
          formFileInput.textContent = originalText;
        }
      }
    });

    const customSelects = form.querySelectorAll('.select');
    customSelects.forEach(selectItem => {
      const originalSelect = selectItem.querySelector('select');
      if (originalSelect) {
        const customOption = originalSelect.querySelector('option[data-custom="true"]');
        if (customOption) {
          customOption.remove();
        }

        Array.from(originalSelect.options).forEach(option => {
          if (option.dataset.originalValue) {
            option.value = option.dataset.originalValue;
            delete option.dataset.originalValue;
          }
        });

        originalSelect.selectedIndex = 0;

        delete originalSelect.dataset.userInput;
        delete originalSelect.dataset.currentMethod;

        const contentInput = selectItem.querySelector('.select__content');
        if (contentInput) {
          contentInput.value = '';
          const placeholder = originalSelect.dataset.placeholder || '';
          contentInput.placeholder = placeholder;
        }

        selectItem.classList.remove('_select-active');

        const optionButtons = selectItem.querySelectorAll('.select__option');
        optionButtons.forEach(btn => {
          btn.hidden = false;
        });

        if (!originalSelect.hasAttribute('data-show-selected')) {
          const firstOption = selectItem.querySelector('.select__option[data-value]');
          if (firstOption && originalSelect.selectedIndex === 0) {
            firstOption.hidden = true;
          }
        }

        if (typeof SelectConstructor !== 'undefined') {
          const selectInstance = new SelectConstructor({ init: false });
          selectInstance.setSelectTitleValue(selectItem, originalSelect);
        }
      }
    });

    const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
    hiddenInputs.forEach(input => {
      if (input.name === 'button_subject' ||
        input.name === 'contact_method' ||
        input.name === 'user_contact_value') {
        input.value = '';
      }
    });

    if (typeof formValidate !== 'undefined' && formValidate.formClean) {
      formValidate.formClean(form);
    }

    const popupSelector = form.dataset.popupMessage;
    let popup = null;

    if (popupSelector) {
      if (popupSelector.startsWith('#')) {
        popup = document.querySelector(popupSelector);
      } else {
        popup = document.querySelector(`[data-popup="${popupSelector}"]`) ||
          document.querySelector(`.${popupSelector.replace('.', '')}`);
      }
    }

    document.querySelectorAll('.popup_show').forEach(p => {
      p.classList.remove('popup_show');
      p.setAttribute('aria-hidden', 'true');
    });

    if (popup) {
      if (typeof popupOpen === 'function') {
        popupOpen(popupSelector);
      }
      else if (typeof openPopup === 'function') {
        openPopup(popup);
      }
      else {
        popup.classList.add('popup_show');
        popup.setAttribute('aria-hidden', 'false');

        document.documentElement.classList.add('lock', 'popup-show');

        if (typeof bodyLock === 'function') {
          bodyLock();
        } else if (typeof bodyLockToggle === 'function') {
          bodyLockToggle();
        } else {
          document.body.style.overflow = 'hidden';
          document.body.style.paddingRight = '17px';
        }
      }

      document.documentElement.classList.remove('open-quiz');

      const closePopupHandler = function (e) {
        if (e.target === popup || e.target.closest('.popup__close') || e.target.closest('[data-close]')) {
          popup.classList.remove('popup_show');
          popup.setAttribute('aria-hidden', 'true');
          document.documentElement.classList.remove('lock', 'popup-show');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          document.removeEventListener('click', closePopupHandler);
        }
      };

      setTimeout(() => {
        document.addEventListener('click', closePopupHandler);
      }, 100);

    } else {
      window.location.href = 'thanks.html';
    }
  }
}

formSubmit();

//========================================================================================================================================================

//Маска
const telephone = document.querySelectorAll('.telephone');
if (telephone) {
  Inputmask({
    "mask": "+7 (999) 999 - 99 - 99",
    "showMaskOnHover": false,
  }).mask(telephone);
}

//========================================================================================================================================================

//Наблюдатель
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true,
    }
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.classList.contains('watcher') ? this.scrollWatcherRun() : null;
  }
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  scrollWatcherRun() {
    document.documentElement.classList.add('watcher');
    this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]'));
  }
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function (item) {
        if (item.dataset.watch === 'navigator' && !item.dataset.watchThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold =
              window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            'data-watch-threshold',
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
      }));
      uniqParams.forEach(uniqParam => {
        let uniqParamArray = uniqParam.split('|');
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        }
        let groupItems = Array.from(items).filter(function (item) {
          let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
          let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px';
          let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
          if (
            String(watchRoot) === paramsWatch.root &&
            String(watchMargin) === paramsWatch.margin &&
            String(watchThreshold) === paramsWatch.threshold
          ) {
            return item;
          }
        });

        let configWatcher = this.getScrollWatcherConfig(paramsWatch);

        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {}
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    }
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf('px') < 0 && paramsWatch.margin.indexOf('%') < 0) {
      return
    }
    if (paramsWatch.threshold === 'prx') {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1.0; i += 0.005) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(',');
    }
    configWatcher.threshold = paramsWatch.threshold;

    return configWatcher;
  }
  scrollWatcherCreate(configWatcher) {
    console.log(configWatcher);
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach(item => this.observer.observe(item));
  }
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains('_watcher-view') ? targetElement.classList.add('_watcher-view') : null;
    } else {
      targetElement.classList.contains('_watcher-view') ? targetElement.classList.remove('_watcher-view') : null;
    }
  }
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute('data-watch-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry: entry
      }
    }));
  }
}
modules_flsModules.watcher = new ScrollWatcher({});

//========================================================================================================================================================

//Прокрутка к блоку
let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);

  if (!targetBlockElement) {
    console.warn(`Element ${targetBlock} not found`);
    return;
  }

  let headerItem = '';
  let headerItemHeight = 0;

  if (noHeader) {
    headerItem = 'header.header';
    const headerElement = document.querySelector(headerItem);
    if (headerElement) {
      if (!headerElement.classList.contains('_header-scroll')) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add('_header-scroll');
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove('_header-scroll');
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else {
        headerItemHeight = headerElement.offsetHeight;
      }
    }
  }

  if (document.documentElement.classList.contains("menu-open")) {
    if (typeof menuClose === 'function') {
      menuClose();
    }
  }

  if (typeof SmoothScroll !== 'undefined') {
    let options = {
      speedAsDuration: true,
      speed: speed,
      header: headerItem,
      offset: offsetTop,
      easing: 'easeOutQuad',
    };
    new SmoothScroll().animateScroll(targetBlockElement, '', options);
  } else {
    let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + window.scrollY;

    if (headerItemHeight) {
      targetBlockElementPosition -= headerItemHeight;
    }

    if (offsetTop) {
      targetBlockElementPosition -= offsetTop;
    }

    window.scrollTo({
      top: targetBlockElementPosition,
      behavior: "smooth"
    });
  }
};
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);

  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      const gotoLink = targetElement.closest('[data-goto]');

      if (gotoLink) {
        const gotoLinkSelector = gotoLink.dataset.goto || '';
        const noHeader = gotoLink.hasAttribute('data-goto-header');
        const gotoSpeed = gotoLink.dataset.gotoSpeed ? parseInt(gotoLink.dataset.gotoSpeed) : 500;
        const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;

        if (window.modules_flsModules && modules_flsModules.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`)?.closest('[data-fp-section]');
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;

          if (fullpageSectionId !== null) {
            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
            if (document.documentElement.classList.contains("menu-open") && typeof menuClose === 'function') {
              menuClose();
            }
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }

        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;

      if (targetElement.dataset.watch === 'navigator') {
        document.querySelectorAll('[data-goto]._navigator-active').forEach(el => {
          el.classList.remove('_navigator-active');
        });

        const navigatorLinks = findNavigatorLinks(targetElement);
        navigatorLinks.forEach(link => {
          if (entry.isIntersecting) {
            link.classList.add('_navigator-active');
          } else {
            link.classList.remove('_navigator-active');
          }
        });
      }
    }
  }

  function findNavigatorLinks(element) {
    const links = [];

    if (element.id) {
      const idLinks = document.querySelectorAll(`[data-goto="#${element.id}"]`);
      links.push(...idLinks);
    }

    if (element.classList.length) {
      element.classList.forEach(className => {
        const classLinks = document.querySelectorAll(`[data-goto=".${className}"]`);
        links.push(...classLinks);
      });
    }

    return links;
  }
}
pageNavigation();

//========================================================================================================================================================

const YMAPS_SRC = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';

const MAPS_CONFIG = {
  map1: {
    center: [55.087687, 36.604884],
    zoom: 15,
    placemarks: [
      { coords: [55.087687, 36.604884], icon: 'img/icons/map1.svg' },
      { coords: [55.090382, 36.606950], icon: 'img/icons/map2.svg' },
      { coords: [55.089588, 36.610363], icon: 'img/icons/map3.svg' },
      { coords: [55.087986, 36.603258], icon: 'img/icons/map4.svg' },
      { coords: [55.117082, 36.597014], icon: 'img/icons/map5.svg' },
    ],
  },
  map2: {
    center: [55.087687, 36.604884],
    zoom: 15,
    placemarks: [
      { coords: [55.087687, 36.604884], icon: 'img/icons/map1.svg' },
    ],
  },
};

function getIconSize() {
  const w = window.innerWidth;
  if (w < 768) return 60;
  if (w < 1200) return 80;
  return 100;
}

let ymapsPromise = null;
function loadYmaps() {
  if (ymapsPromise) return ymapsPromise;

  ymapsPromise = new Promise((resolve, reject) => {
    if (typeof ymaps !== 'undefined') {
      ymaps.ready(() => resolve(ymaps));
      return;
    }
    const script = document.createElement('script');
    script.src = YMAPS_SRC;
    script.async = true;
    script.onload = () => ymaps.ready(() => resolve(ymaps));
    script.onerror = () => reject(new Error('Yandex Maps failed to load'));
    document.head.appendChild(script);
  });

  return ymapsPromise;
}

function initMap(id, { center, zoom, placemarks }) {
  const el = document.getElementById(id);
  if (!el || el.dataset.initialized === 'true') return;

  try {
    el.querySelector('.map-preview')?.remove();

    const map = new ymaps.Map(id, { center, zoom, controls: ['zoomControl'] });
    const marks = [];
    const size = getIconSize();

    placemarks.forEach(({ coords, icon }) => {
      const pm = new ymaps.Placemark(coords, {}, {
        iconLayout: 'default#image',
        iconImageHref: icon,
        iconImageSize: [size, size],
        iconImageOffset: [-size / 2, -size / 2],
      });
      map.geoObjects.add(pm);
      marks.push({ pm, icon });
    });

    el._ymapsInstance = { map, marks };
    el.dataset.initialized = 'true';
  } catch (error) {
    console.error(`Map init error (${id}):`, error);
  }
}

function updateIcons() {
  const size = getIconSize();
  document.querySelectorAll('[data-initialized="true"]').forEach((el) => {
    const inst = el._ymapsInstance;
    if (!inst) return;
    inst.marks.forEach(({ pm, icon }) => {
      pm.options.set({
        iconImageHref: icon,
        iconImageSize: [size, size],
        iconImageOffset: [-size / 2, -size / 2],
      });
    });
  });
}

const mqls = [
  window.matchMedia('(max-width: 767px)'),
  window.matchMedia('(max-width: 1199px)'),
];
mqls.forEach((mql) => mql.addEventListener('change', updateIcons));

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateIcons, 150);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    observer.unobserve(el);

    const config = MAPS_CONFIG[el.id];
    if (!config) return;

    loadYmaps()
      .then(() => initMap(el.id, config))
      .catch((err) => console.error(err));
  });
}, { rootMargin: '0px 0px 200px 0px' });

Object.keys(MAPS_CONFIG).forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

//========================================================================================================================================================

if (document.querySelector('.block-infrastructure__slider')) {
  const infrastructureSwiper = new Swiper('.block-infrastructure__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 'auto',
    spaceBetween: 0,
    speed: 400,
    preloadImages: true,
    navigation: {
      prevEl: '.infrastructure-arrow-prev',
      nextEl: '.infrastructure-arrow-next',
    },
  });
}

//========================================================================================================================================================

let progressWidget = document.querySelectorAll('.progress-widget');
if (progressWidget) {
  progressWidget.forEach(widget => {
    const progress = parseFloat(widget.style.getPropertyValue('--progress')) || 0;
    const L = r => 2 * Math.PI * r;

    const bar = widget.querySelector('.progress-widget__bar');
    const inner = widget.querySelector('.progress-widget__track--inner');
    const outer = widget.querySelector('.progress-widget__track--outer');

    bar.style.strokeDasharray = L(146.5);
    inner.style.strokeDasharray = L(133);
    outer.style.strokeDasharray = L(160);

    bar.style.strokeDashoffset = L(146.5) * (1 - progress / 100);
    inner.style.strokeDashoffset = -L(133) * progress / 100;
    outer.style.strokeDashoffset = -L(160) * progress / 100;
  });
}

//========================================================================================================================================================

const filterCards = document.querySelectorAll('.filter-card');

if (filterCards) {
  const filterButtons = document.querySelectorAll('.filter__title');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.dataset.filter;

      filterCards.forEach(card => {
        if (filterValue === 'all' || card.dataset.filter === filterValue) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

//========================================================================================================================================================

//До-после
class BeforeAfter {
  constructor(props) {
    let defaultConfig = {
      init: true,
      logging: true,
      swiper: null
    };
    this.config = Object.assign(defaultConfig, props);
    this.isDragging = false;

    if (this.config.init) {
      const beforeAfterItems = document.querySelectorAll('[data-ba]');
      if (beforeAfterItems.length > 0) {
        this.beforeAfterInit(beforeAfterItems);
      }
    }
  }

  beforeAfterInit(beforeAfterItems) {
    beforeAfterItems.forEach((beforeAfter, index) => {
      if (beforeAfter) {
        this.beforeAfterClasses(beforeAfter);
        this.beforeAfterItemInit(beforeAfter);
      }
    });
  }

  beforeAfterClasses(beforeAfter) {
    beforeAfter.addEventListener('mouseover', function (e) {
      const targetElement = e.target;
      const isArrow = targetElement.closest('[data-ba-arrow]');

      if (!isArrow) {
        if (targetElement.closest('[data-ba-before]')) {
          beforeAfter.classList.remove('_right');
          beforeAfter.classList.add('_left');
        } else {
          beforeAfter.classList.add('_right');
          beforeAfter.classList.remove('_left');
        }
      }
    });

    beforeAfter.addEventListener('mouseleave', function () {
      beforeAfter.classList.remove('_left');
      beforeAfter.classList.remove('_right');
    });
  }

  beforeAfterItemInit(beforeAfter) {
    const beforeAfterArrow = beforeAfter.querySelector('[data-ba-arrow]');
    const afterItem = beforeAfter.querySelector('[data-ba-after]');

    if (!beforeAfterArrow || !afterItem) {
      return;
    }

    const beforeAfterArrowWidth = parseFloat(
      window.getComputedStyle(beforeAfterArrow).getPropertyValue('width')
    );

    const handleStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleDragStart(e, beforeAfter, afterItem, beforeAfterArrowWidth);
    };

    beforeAfterArrow.addEventListener('mousedown', handleStart);
    beforeAfterArrow.addEventListener('touchstart', handleStart, { passive: false });
  }

  handleDragStart(e, beforeAfter, afterItem, arrowWidth) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;

    const swiperInstance = this.config.swiper;

    if (swiperInstance && typeof swiperInstance === 'object') {
      swiperInstance.allowTouchMove = false;
      swiperInstance.allowSlideNext = false;
      swiperInstance.allowSlidePrev = false;
      swiperInstance.touchEventsData.preventDefault = true;
    }

    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    const sizes = {
      width: beforeAfter.offsetWidth,
      left: beforeAfter.getBoundingClientRect().left - window.scrollX
    };

    const moveHandler = (eMove) => {
      if (!this.isDragging) return;
      eMove.preventDefault();
      eMove.stopPropagation();
      this.handleMouseMove(eMove, beforeAfter, afterItem, arrowWidth, sizes);
    };

    const endHandler = (eEnd) => {
      if (!this.isDragging) return;

      eEnd.preventDefault();
      eEnd.stopPropagation();

      this.isDragging = false;

      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchend', endHandler);
      document.removeEventListener('touchcancel', endHandler);

      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';

      if (swiperInstance && typeof swiperInstance === 'object') {
        setTimeout(() => {
          swiperInstance.allowTouchMove = true;
          swiperInstance.allowSlideNext = true;
          swiperInstance.allowSlidePrev = true;
          swiperInstance.touchEventsData.preventDefault = false;
        }, 50);
      }
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', endHandler);
    document.addEventListener('touchcancel', endHandler);

    document.addEventListener('dragstart', (eDrag) => {
      eDrag.preventDefault();
    });
  }

  handleMouseMove(e, beforeAfter, afterItem, arrowWidth, sizes) {
    let clientX;
    if (e.type === 'touchmove' && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
    } else if (e.clientX) {
      clientX = e.clientX;
    } else {
      return;
    }

    let posLeft = clientX - sizes.left;
    posLeft = Math.max(0, Math.min(posLeft, sizes.width));

    const way = (posLeft / sizes.width) * 100;
    const arrowLeft = `calc(${way}% - ${arrowWidth}px)`;

    const arrow = beforeAfter.querySelector('[data-ba-arrow]');
    if (arrow) {
      arrow.style.left = arrowLeft;
      arrow.style.transform = 'translate(50%, -50%)';
    }
    afterItem.style.width = `${100 - way}%`;
  }
}

if (typeof window.modules_flsModules === 'undefined') {
  window.modules_flsModules = {};
}

window.modules_flsModules.ba = new BeforeAfter({
  logging: true
});

//========================================================================================================================================================

function initCalculator() {
  const rangesBlock = document.querySelector('.block-calculator__ranges');
  if (!rangesBlock) {
    return;
  }

  const formatMoney = (v) =>
    Math.round(v).toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';

  const formatPercent = (v) => Math.round(v) + ' %';
  const formatYears = (v) => Math.round(v) + ' лет';

  const parseNumber = (str) => {
    const n = String(str).replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(n) || 0;
  };

  const PRICE_MIN = 2500000;
  const PRICE_MAX = 8000000;
  const PRICE_STEP = 100000;
  const PRICE_START = 5000000;

  const DOWN_MIN = 0;
  const DOWN_MAX = 100;      // %
  const DOWN_STEP = 1;
  const DOWN_START = 0;

  const TERM_MIN = 1;
  const TERM_MAX = 30;      // лет
  const TERM_STEP = 1;
  const TERM_START = 20;

  const RATE = 12;          // годовая ставка, %

  const priceInput = document.querySelector('.price');
  const downInput = document.querySelector('.down-payment');
  const termInput = document.querySelector('.term');

  const priceSliderEl = document.querySelector('.block-calculator__range-price');
  const downSliderEl = document.querySelector('.block-calculator__range-down-payment');
  const termSliderEl = document.querySelector('.block-calculator__range-term');

  const summEl = document.getElementById('summ');
  const monthlySummEl = document.getElementById('monthly-summ');

  noUiSlider.create(priceSliderEl, {
    start: [PRICE_START],
    connect: [true, false],
    step: PRICE_STEP,
    range: { min: PRICE_MIN, max: PRICE_MAX },
    format: { to: (v) => Math.round(v), from: (v) => Number(v) },
  });

  noUiSlider.create(downSliderEl, {
    start: [DOWN_START],
    connect: [true, false],
    step: DOWN_STEP,
    range: { min: DOWN_MIN, max: DOWN_MAX },
    format: { to: (v) => Math.round(v), from: (v) => Number(v) },
  });

  noUiSlider.create(termSliderEl, {
    start: [TERM_START],
    connect: [true, false],
    step: TERM_STEP,
    range: { min: TERM_MIN, max: TERM_MAX },
    format: { to: (v) => Math.round(v), from: (v) => Number(v) },
  });

  function recalculate() {
    const price = Number(priceSliderEl.noUiSlider.get());
    const downPercent = Number(downSliderEl.noUiSlider.get());
    const termYears = Number(termSliderEl.noUiSlider.get());

    const downAmount = price * downPercent / 100;
    const loanAmount = Math.max(price - downAmount, 0);

    const monthlyRate = RATE / 100 / 12;
    const months = termYears * 12;

    let monthly = 0;
    if (loanAmount > 0 && months > 0) {
      monthly =
        loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    }

    priceInput.value = formatMoney(price);
    downInput.value = formatPercent(downPercent);
    termInput.value = formatYears(termYears);

    summEl.textContent = formatMoney(loanAmount);
    monthlySummEl.textContent = formatMoney(monthly);
  }

  priceSliderEl.noUiSlider.on('update', (values) => {
    const v = Math.round(values[0]);
    priceInput.value = formatMoney(v);
    recalculate();
  });

  downSliderEl.noUiSlider.on('update', (values) => {
    const v = Math.round(values[0]);
    downInput.value = formatPercent(v);
    recalculate();
  });

  termSliderEl.noUiSlider.on('update', (values) => {
    const v = Math.round(values[0]);
    termInput.value = formatYears(v);
    recalculate();
  });

  priceInput.addEventListener('change', function () {
    let v = parseNumber(this.value);
    v = Math.min(Math.max(v, PRICE_MIN), PRICE_MAX);
    priceSliderEl.noUiSlider.set(v);
  });

  downInput.addEventListener('change', function () {
    let v = parseNumber(this.value);
    v = Math.min(Math.max(v, DOWN_MIN), DOWN_MAX);
    downSliderEl.noUiSlider.set(v);
  });

  termInput.addEventListener('change', function () {
    let v = parseNumber(this.value);
    v = Math.min(Math.max(v, TERM_MIN), TERM_MAX);
    termSliderEl.noUiSlider.set(v);
  });

  recalculate();
}
initCalculator();