;(function() {
  'use strict';

  angular
    .module('GiriaPedia')
    .controller('GiriasEstado', GiriasEstado);

  function GiriasEstado($scope, $stateParams, giriaServer, toastr) {
    var vm = this;

    vm.estadoAtual = $stateParams.state;
    vm.createGiria = {state: vm.estadoAtual};

    var activate = function() {
      giriaServer.list(vm.estadoAtual, function(girias){
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
          vm.showForm = false;
        } else {
          toastr.error(giriaReturn.error, "Error ao salvar");
        }
      });
    };

    activate();

  };
})();
