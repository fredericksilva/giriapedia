(function(){
  'use strict';

  angular
    .module('UltraBusca')
    .controller('TesteBusca', TestBusca)


    function TestBusca($scope) {
      var vm = this;

      vm.list_name = ["mario", "idiva", "gomes", "duarte"];
    }
})();
