;(function() {
  'use strict';
  angular
    .module(
      "UltraBusca",
      [
        "ngRoute",
        "ui.bootstrap"
      ]
    )
    .config(function($interpolateProvider){
      $interpolateProvider.startSymbol("{!");
      $interpolateProvider.endSymbol("!}");
    })
})();
