;(function() {
  'use strict';

  angular
    .module("GiriaPedia")
    .directive("createUser", createUserDirective);

  function createUserDirective() {

    var directive = {
      restrict: 'E',
      templateUrl: 'static/js/partials/create_user.html',
      controller: 'SignInCtrl',
      controllerAs: 'vm'
    };

    return directive;
  }
})();
