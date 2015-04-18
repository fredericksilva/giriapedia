;(function() {
  'use strict';

  angular
    .module("GiriaPedia")
    .controller("ModalDescriptionCtrl", DescriptionModal);

  function DescriptionModal($scope, $modalInstance, $state, toastr, giriaData, giriaServer) {

    var vm = this;
    vm.item = giriaData;
    vm.close = closeModal;
    vm.addSignificado = addSignificado;

    function closeModal() {
      $modalInstance.dismiss("cancel");
    };

    function addSignificado(){
      return giriaServer.update(vm.item, vm.newDesc, function(resp){
        if(resp.success === true) {

          closeModal();
          toastr.success("Novo significado adicionado!", vm.item.giria);

          $state.go("giriasEstado", {state: vm.item.state});
        }
      });
    };
  };

})();
