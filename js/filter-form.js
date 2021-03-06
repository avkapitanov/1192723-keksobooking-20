'use strict';

window.filterForm = (function () {
  var filterFormElement = document.querySelector('.map__filters');
  var filterFormTypeElement = filterFormElement.querySelector('[name=housing-type]');
  var filterFormPriceElement = filterFormElement.querySelector('[name=housing-price]');
  var filterFormRoomsElement = filterFormElement.querySelector('[name=housing-rooms]');
  var filterFormGuestsElement = filterFormElement.querySelector('[name=housing-guests]');
  var filterFormFeaturesElements = filterFormElement.querySelectorAll('[name=features]');

  var enableInputs = function () {
    window.formUtils.enableElements(filterFormElement);
  };

  var disableInputs = function () {
    window.formUtils.disableElements(filterFormElement);
  };

  var filterAdverts = function () {
    window.pin.removePins();

    var sameAdverts = window.data.adverts.filter(function (advert) {
      return checkAdvertType(advert) && checkAdvertPrice(advert)
        && checkAdvertRooms(advert) && checkAdvertGuests(advert) && checkAdvertFeatures(advert) && advert.offer;
    });

    sameAdverts = sameAdverts.slice(0, window.constants.MAX_SIMILAR_ADVERTS);

    window.pin.addPins(sameAdverts);
  };

  var isOptionAll = function (value) {
    return value === window.constants.SIMILAR_ADVERTS_OPTION_ALL;
  };

  var checkAdvertType = function (advert) {
    var selectedType = filterFormTypeElement.value;
    if (isOptionAll(selectedType)) {
      return true;
    }

    return advert.offer.type === selectedType;
  };

  var checkAdvertPrice = function (advert) {
    var selectedPrice = filterFormPriceElement.value;
    if (isOptionAll(selectedPrice)) {
      return true;
    }

    var priceRange = window.constants.FILTER_FORM_PRICE_VALUES[selectedPrice];

    return advert.offer.price > priceRange.min && advert.offer.price <= priceRange.max;
  };

  var checkAdvertRooms = function (advert) {
    var selectedRooms = filterFormRoomsElement.value;
    if (isOptionAll(selectedRooms)) {
      return true;
    }

    return advert.offer.rooms === +selectedRooms;
  };

  var checkAdvertGuests = function (advert) {
    var selectedGuests = filterFormGuestsElement.value;
    if (isOptionAll(selectedGuests)) {
      return true;
    }

    return advert.offer.guests === +selectedGuests;
  };

  var checkAdvertFeatures = function (advert) {
    var selectedOptions = [];
    filterFormFeaturesElements.forEach(function (optionElement) {
      if (optionElement.checked) {
        selectedOptions.push(optionElement.value);
      }
    });

    var featureList = selectedOptions.filter(function (el) {
      return advert.offer.features.indexOf(el) !== -1;
    });

    return selectedOptions.length === featureList.length;
  };

  var reset = function () {
    filterFormElement.reset();
  };

  filterFormElement.addEventListener('change', function () {
    window.card.closePopup();
    window.debounce(filterAdverts);
  });

  return {
    enableInputs: enableInputs,
    disableInputs: disableInputs,
    filterAdverts: filterAdverts,
    reset: reset
  };
})();
