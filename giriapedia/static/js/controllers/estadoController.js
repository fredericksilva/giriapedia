;(function() {
  'use strict';

  angular
    .module('GiriaPedia')
    .controller('GiriasEstado', GiriasEstado);

  function GiriasEstado($scope, $stateParams, $state, $modal, giriaServer, toastr) {
    var vm = this;

    vm.estadoAtual = $stateParams.state || $stateParams.stateC;
    vm.giriaAtual = $stateParams.giria;
    vm.createGiria = {state: vm.estadoAtual};
    vm.saveGiria = saveGiria;
    vm.openModal = openModal;

    if(vm.giriaAtual !== undefined) {
      getGiria();
    }

    activate();

    function saveGiria() {
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

    function activate() {
      return giriaServer.list(vm.estadoAtual, function(girias){
        vm.girias = girias;
      });
    };

    function getGiria() {
      var info = {giria: vm.giriaAtual, state: vm.estadoAtual};
      return giriaServer.find(info, function(giria){
        vm.giriaDesc = giria;
      });
    }

    function openModal(descriptions) {
      var modalInstance = $modal.open({
        templateUrl: "static/js/partials/descriptionsModal.html",
        controller: "ModalDescriptionCtrl",
        controllerAs: "vm",
        resolve: {
          items: function () {
            return descriptions;
          }
        }
      });
    };

  };
})();
