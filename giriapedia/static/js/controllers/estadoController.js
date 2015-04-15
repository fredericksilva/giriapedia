;(function() {
  'use strict';

  angular
    .module('GiriaPedia')
    .controller('GiriasEstado', GiriasEstado);

  function GiriasEstado($scope, $stateParams, giriaServer, toastr, $state) {
    var vm = this;

    vm.estadoAtual = $stateParams.state || $stateParams.stateC;
    vm.createGiria = {state: vm.estadoAtual};

    var activate = function() {
      return giriaServer.list(vm.estadoAtual, function(girias){
        vm.girias = girias;
      });
    };

    vm.saveGiria = function() {
      giriaServer.create(vm.createGiria, function(giriaReturn){
        if( giriaReturn.success === true ) {
          toastr.success("Giria cadastrada com sucesso", null);
          // Get Girias
          activate();
          // Hide form
          $state.go("giriasEstado", {state: vm.estadoAtual});
          vm.createGiria = {state: vm.estadoAtual};
        } else {
          toastr.error(giriaReturn.error, "Error ao salvar");
        }
      });
    };

    activate();

  };
})();
