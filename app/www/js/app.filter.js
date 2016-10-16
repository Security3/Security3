(function () {
  'use strict';

  angular.module('Security3')
    .filter('noPicture', function () {
      return function (input) {
        if (input === "") {
          return "img/nopic.png";
        } else {
          return input;
        }
      }
    });
})();
