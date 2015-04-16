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
        "angular-jwt",
        "angular-storage",
      ]
    )
    .config(authenticateFunction)
    .run(verifyAuth)
    .config(routePedia);

  function authenticateFunction($urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    // Need annotate 'store' to work with minified
    jwtInterceptorProvider.tokenGetter = ["store", function(store) {
      return store.get('jwt');
    }];

    $httpProvider.interceptors.push('jwtInterceptor');
  };

  function verifyAuth($rootScope, $state, store, jwtHelper){
    $rootScope.$on('$stateChangeStart', function(event, to, toParams, fromState, fromParams) {
      if (to.data && to.data.requiresLogin) {
        if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
          if(to.name === "criarGiria") {
            store.set("estado", toParams.stateC);
          }
          event.preventDefault();
          $state.go('login');
        }
      }
    });
  };

  function routePedia($stateProvider, toastrConfig) {

    var home = {
      url: "/",
      templateUrl: 'static/js/partials/map.html',
      controller: 'MapperController',
      controllerAs: 'vm'
    },
    state = {
      url: "/:state/",
      templateUrl: 'static/js/partials/girias_state.html',
      controller: 'GiriasEstado',
      controllerAs: 'vm',
    },
    createGiria = {
      url: "/giria/:stateC/criar/",
      templateUrl: 'static/js/partials/create_giria.html',
      controller: 'GiriasEstado',
      controllerAs: 'vm',
      data: {
        requiresLogin: true
      }
    },
    giriaDescription = {
      url: "/giria/:stateC/:giria/significados/",
      templateUrl: 'static/js/partials/giria_significados.html',
      controller: 'GiriasEstado',
      controllerAs: 'vm',
    },
    login = {
      url: "/auth/login/",
      templateUrl: "static/js/partials/login.html",
      controller: "LoginCtrl",
      controllerAs: "vm"
    },
    signin = {
      url: "/auth/cadastrar/",
      templateUrl: "static/js/partials/signin.html",
      controller: "SignInCtrl",
      controllerAs: "vm"
    },
    logout = {
      url: "/auth/logout/",
      controller: "LogoutCtrl",
    }

    $stateProvider
      .state("home", home)
      .state("giriasEstado", state)
      .state("criarGiria", createGiria)
      .state("giriaDescription", giriaDescription)
      .state("login", login)
      .state("signin", signin)
      .state("logout", logout);

      angular.extend(toastrConfig, {
        preventDuplicates: true
      });

  };

})();
