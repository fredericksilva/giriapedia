;(function(){
  'use strict';

  angular
    .module('GiriaPedia')
    .controller('MapperController', MapperController);


  function MapperController($scope, estados) {
    var vm = this;

    var activate = function() {
      estados.list(function(listEstados){
        vm.listEstados = listEstados;
      })
    }

    activate();
  };

})();
