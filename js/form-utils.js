'use strict';

window.formUtils = (function () {
  var disableElements = function (formElement) {
    Array.from(formElement.elements).forEach(function (element) {
      if (isTagToDisable(element)) {
        addDisable(element);
      }
    });
  };

  var enableElements = function (formElement) {
    Array.from(formElement.elements).forEach(function (element) {
      if (isTagToDisable(element)) {
        removeDisable(element);
      }
    });
  };

  var addDisable = function (element) {
    element.disabled = true;
  };

  var removeDisable = function (element) {
    element.disabled = false;
  };

  var isTagToDisable = function (element) {
    var tag = element.tagName.toLowerCase();
    return window.constants.FORM_ELEMENTS_TO_DISABLE.indexOf(tag) !== -1;
  };

  return {
    disableElements: disableElements,
    enableElements: enableElements,
    addDisable: addDisable,
    removeDisable: removeDisable,
    isTagToDisable: isTagToDisable
  };
})();
