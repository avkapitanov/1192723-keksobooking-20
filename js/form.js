'use strict';

window.form = (function () {
  var initialCoordinates = {};
  var addFormElement = document.querySelector('.ad-form');
  var adFormInputElements = addFormElement.querySelectorAll('.ad-form input');
  var adFormSelectElements = addFormElement.querySelectorAll('.ad-form select');
  var adFormTextareaElements = addFormElement.querySelectorAll('.ad-form textarea');
  var addFormHousingRoomsElement = document.querySelector('select[name=rooms]');
  var addFormHousingCapacityElement = document.querySelector('select[name=capacity]');
  var adFormSubmitElement = addFormElement.querySelector('.ad-form__submit');

  var adFormTitleElement = addFormElement.querySelector('input[name=title]');
  var adFormTypeElement = addFormElement.querySelector('[name=type]');
  var adFormPriceElement = addFormElement.querySelector('[name=price]');
  var adFormTimeInElement = addFormElement.querySelector('[name="timein"]');
  var adFormTimeOutElement = addFormElement.querySelector('[name="timeout"]');
  var addressFieldElement = addFormElement.querySelector('input[name=address]');

  var resetFormElement = addFormElement.querySelector('.ad-form__reset');

  var addFormSubmit = function (evt) {
    evt.preventDefault();
    if (!addFormElement.checkValidity()) {
      return;
    }

    window.data.saveAdvertForm(new FormData(addFormElement), successHandler, errorHandler);
  };

  var successHandler = function () {
    window.notification.showAdvertFormSuccess();
    resetFormToInit();
    window.map.deactivateMap();
  };

  var errorHandler = function () {
    window.notification.showAdvertFormError();
  };

  var validateHousingCapacity = function () {
    var roomsCount = addFormHousingRoomsElement.value;
    var capacityCount = addFormHousingCapacityElement.value;
    if (roomsCount < window.constants.NOT_FOR_GUESTS_ROOMS_COUNT) {
      if (capacityCount === '0' || capacityCount > roomsCount) {
        var errorMsg = roomsCount === '1' ? 'Можно выбрать только одного гостя' : 'Можно выбрать до ' + roomsCount + ' гостей';
        addFormHousingCapacityElement.setCustomValidity(errorMsg);
      } else {
        addFormHousingCapacityElement.setCustomValidity('');
      }
    } else if (capacityCount !== '0') {
      addFormHousingCapacityElement.setCustomValidity('Только не для гостей');
    } else {
      addFormHousingCapacityElement.setCustomValidity('');
    }
  };

  var disableInputsOnAddForm = function () {
    window.formUtils.disableInputs(adFormInputElements);
    window.formUtils.disableInputs(adFormSelectElements);
    window.formUtils.disableInputs(adFormTextareaElements);
  };

  var enableInputsOnAddForm = function () {
    window.formUtils.enableInputs(adFormInputElements);
    window.formUtils.enableInputs(adFormSelectElements);
    window.formUtils.enableInputs(adFormTextareaElements);
  };

  var validatePrice = function () {
    var advertType = adFormTypeElement.value;
    var advertTypeMinPrice = window.constants.TYPE_ADVERT_MIN_PRICE[advertType];
    var advertPriceValue = adFormPriceElement.value;
    adFormPriceElement.placeholder = advertTypeMinPrice;
    adFormPriceElement.min = advertTypeMinPrice;

    if (advertPriceValue === '') {
      adFormPriceElement.setCustomValidity('Поле обязательно к заполнению');
    } else if (advertPriceValue < advertTypeMinPrice) {
      adFormPriceElement.setCustomValidity('Минимальная сумма ' + advertTypeMinPrice);
    } else if (advertPriceValue > window.constants.MAX_ADVERT_PRICE_VALUE) {
      adFormPriceElement.setCustomValidity('Максимальная сумма ' + window.constants.MAX_ADVERT_PRICE_VALUE);
    } else {
      adFormPriceElement.setCustomValidity('');
    }
  };

  var validateTime = function (evt) {
    var isTimeInChange = evt.currentTarget === adFormTimeInElement;
    if (isTimeInChange) {
      adFormTimeOutElement.value = adFormTimeInElement.value;
    } else {
      adFormTimeInElement.value = adFormTimeOutElement.value;
    }
  };

  var fillAddressField = function (save) {
    var coords = window.map.getMainPinCoordinates();

    if (save) {
      initialCoordinates = coords;
    }

    setCoordinatesToField(coords);
  };

  var setCoordinatesToField = function (coords) {
    addressFieldElement.value = coords.x + ', ' + coords.y;
  };

  var activateForm = function () {
    addFormElement.classList.remove('ad-form--disabled');
    enableInputsOnAddForm();
  };

  var deactivateForm = function () {
    addFormElement.classList.add('ad-form--disabled');
    disableInputsOnAddForm();
  };

  var resetForm = function () {
    addFormElement.reset();
    setCoordinatesToField(initialCoordinates);
  };

  var resetFormToInit = function () {
    resetForm();
    deactivateForm();
  };

  addFormHousingRoomsElement.addEventListener('change', validateHousingCapacity);
  addFormHousingCapacityElement.addEventListener('change', validateHousingCapacity);
  adFormSubmitElement.addEventListener('click', addFormSubmit);

  adFormTypeElement.addEventListener('change', validatePrice);
  adFormPriceElement.addEventListener('input', validatePrice);
  adFormTimeInElement.addEventListener('change', function (evt) {
    validateTime(evt);
  });
  adFormTimeOutElement.addEventListener('change', function (evt) {
    validateTime(evt);
  });

  adFormTitleElement.addEventListener('invalid', function () {
    if (adFormTitleElement.validity.tooShort) {
      adFormTitleElement.setCustomValidity('Имя должно состоять минимум из ' + window.constants.MIN_ADVERT_TITLE_LENGTH + '-х символов');
    } else if (adFormTitleElement.validity.tooLong) {
      adFormTitleElement.setCustomValidity('Имя не должно превышать ' + window.constants.MAX_ADVERT_TITLE_LENGTH + '-ти символов');
    } else if (adFormTitleElement.validity.valueMissing) {
      adFormTitleElement.setCustomValidity('Обязательное поле');
    } else {
      adFormTitleElement.setCustomValidity('');
    }
  });

  adFormTitleElement.addEventListener('input', function () {
    var valueLength = adFormTitleElement.value.length;

    if (valueLength < window.constants.MIN_ADVERT_TITLE_LENGTH) {
      adFormTitleElement.setCustomValidity('Ещё ' + (window.constants.MIN_ADVERT_TITLE_LENGTH - valueLength) + ' симв.');
    } else if (valueLength > window.constants.MAX_ADVERT_TITLE_LENGTH) {
      adFormTitleElement.setCustomValidity('Удалите лишние ' + (valueLength - window.constants.MIN_ADVERT_TITLE_LENGTH) + ' симв.');
    } else {
      adFormTitleElement.setCustomValidity('');
    }
  });

  resetFormElement.addEventListener('click', function (evt) {
    resetForm(evt);
  });

  return {
    disableInputsOnAddForm: disableInputsOnAddForm,
    enableInputsOnAddForm: enableInputsOnAddForm,
    fillAddressField: fillAddressField,
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };
})();