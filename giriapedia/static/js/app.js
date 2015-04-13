;(function() {
  'use strict';
  angular
    .module(
      "GiriaPedia",
      [
        "ngAnimate",
        "ui.bootstrap",
        "ui.router",
        "toastr",
      ]
    )
    .config(routePedia);


  function routePedia($stateProvider, $urlRouterProvider, toastrConfig) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state("home", {
        url: "/",
        templateUrl: 'static/js/partials/map.html',
        controller: 'MapperController',
        controllerAs: 'vm'
      })
      .state("giriasEstado", {
        url: "/:state/",
        templateUrl: 'static/js/partials/girias_state.html',
        controller: 'GiriasEstado',
        controllerAs: 'vm'
      })
      .state("login", {
        url: "/login/",
        templateUrl: "static/js/partials/login.html",
        controller: "LoginCtrl",
        controllerAs: "vm"
      })
      .state("signin", {
        url: "/cadastrar/",
        templateUrl: "static/js/partials/signin.html",
        controller: "SignInCtrl",
        controllerAs: "vm"
      })
      .state("logout", {
        url: "/logout/",
        controller: "LogoutCtrl",
      });

      angular.extend(toastrConfig, {
        preventDuplicates: true
      });

  }

})();
