;(function() {
  'use strict';

  angular
    .module('GiriaPedia')
    .controller('GiriasEstado', GiriasEstado);


  function GiriasEstado($scope, giriaServer) {
    var vm = this;
    giriaServer.list(function(girias){
      vm.girias = girias;
    });
  };

})();
