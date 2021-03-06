'use strict';

window.notification = (function () {
  var notificationSuccessElement = document.querySelector('#success')
    .content
    .querySelector('.success');

  var notificationErrorElement = document.querySelector('#error')
    .content
    .querySelector('.error');

  var mainElement = document.querySelector('main');
  var errorBtnElement = document.querySelector('.error__button');

  var successMessageEscPressHandler = function (evt) {
    if (window.utils.isEscPress(evt)) {
      removeSuccessMessage();
    }
  };

  var removeSuccessMessage = function () {
    document.querySelector('.success').remove();
    document.removeEventListener('keydown', successMessageEscPressHandler);
    document.removeEventListener('click', removeSuccessMessage);
  };

  var showAdvertFormSuccess = function () {
    var successElement = notificationSuccessElement.cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', successElement);
    document.addEventListener('keydown', successMessageEscPressHandler);
    document.addEventListener('click', removeSuccessMessage);
  };

  var showAdvertFormError = function () {
    var errorElement = notificationErrorElement.cloneNode(true);
    mainElement.insertAdjacentElement('afterbegin', errorElement);
    document.addEventListener('keydown', errorMessageEscPressHandler);
    errorBtnElement.addEventListener('click', removeErrorMessage);
    document.addEventListener('click', removeErrorMessage);
  };

  var removeErrorMessage = function () {
    document.querySelector('.error').remove();
    document.removeEventListener('keydown', errorMessageEscPressHandler);
    errorBtnElement.removeEventListener('click', removeErrorMessage);
    document.removeEventListener('click', removeErrorMessage);
  };

  var errorMessageEscPressHandler = function (evt) {
    if (window.utils.isEscPress(evt)) {
      removeErrorMessage();
    }
  };

  return {
    showAdvertFormSuccess: showAdvertFormSuccess,
    showAdvertFormError: showAdvertFormError
  };
})();
