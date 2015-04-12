;(function(){
  'use strict';
  angular
    .module('GiriaPedia')
    .controller('MapperController', MapperController);


  function MapperController($scope, estados) {
    var vm = this;

    estados.list(function(listEstados){
      vm.listEstados = listEstados;
    });
  };

})();
