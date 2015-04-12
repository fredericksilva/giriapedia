;(function() {
  'use strict';
  angular
    .module(
      "GiriaPedia",
      [
        "ngRoute",
        "ui.bootstrap"
      ]
    )
    .config(routePedia);


  function routePedia($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'static/js/partials/map.html',
        controller: 'MapperController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      })

  }

})();
