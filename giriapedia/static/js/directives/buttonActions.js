;(function() {
  'use strict';

  angular
    .module("GiriaPedia")
    .directive("buttonAction", buttonAction);

  function buttonAction() {

    var directive = {
      restrict: 'E',
      templateUrl: 'static/js/partials/buttons.html',
      controller: 'GiriasEstado',
      controllerAs: 'vm',
      scope: {
        page: '@'
      }
    };

    return directive;
  }
})();
