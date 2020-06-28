'use strict';

window.pin = (function () {
  var mapPinsElement = document.querySelector('.map__pins');
  var advertPinTemplateElement = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var addPinsOnMap = function (adverts) {
    var fragment = document.createDocumentFragment();
    adverts.forEach(function (advert) {
      fragment.appendChild(renderAdvertPin(advert));
    });
    mapPinsElement.appendChild(fragment);
    bindPinEvents();
  };

  var removeAdvertPinsFromMap = function () {
    var mapPinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinElements.forEach(function (element) {
      element.remove();
    });
  };

  var renderAdvertPin = function (advert) {
    var pinElement = advertPinTemplateElement.cloneNode(true);

    var image = pinElement.querySelector('img');
    image.src = advert.author.avatar;
    image.alt = advert.offer.title;

    pinElement.style.left = advert.location.x - (window.constants.PIN_WIDTH / 2) + 'px';
    pinElement.style.top = advert.location.y - window.constants.PIN_HEIGHT + 'px';

    pinElement.dataset.advert = advert.id;

    return pinElement;
  };

  var pinHandler = function (evt) {
    removeActiveClass();
    var advertIndex = evt.currentTarget.dataset.advert;
    var advertCard = window.card.renderAdvertCard(window.data.adverts[advertIndex]);
    window.card.showAdvertCard(advertCard);
    evt.currentTarget.classList.add('map__pin--active');
  };

  var removeActiveClass = function () {
    var mapPinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinElements.forEach(function (mapPin) {
      mapPin.classList.remove('map__pin--active');
    });
  };

  var bindPinEvents = function () {
    var mapPinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinElements.forEach(function (mapPin) {
      mapPin.addEventListener('click', function (evt) {
        pinHandler(evt);
      });

      mapPin.addEventListener('keydown', function (evt) {
        if (evt.key === 'Enter') {
          pinHandler(evt);
        }
      });
    });
  };

  return {
    addPinsOnMap: addPinsOnMap,
    removeAdvertPinsFromMap: removeAdvertPinsFromMap,
    renderAdvertPin: renderAdvertPin,
    bindPinEvents: bindPinEvents,
    removeActiveClass: removeActiveClass
  };
})();
