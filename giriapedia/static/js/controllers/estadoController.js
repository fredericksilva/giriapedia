;(function() {
  'use strict';

  angular
    .module('GiriaPedia')
    .controller('GiriasEstado', GiriasEstado);

  function GiriasEstado($scope, $stateParams, $state, $modal, store, giriaServer, toastr) {
    var vm = this;

    vm.estadoAtual = $stateParams.state || $stateParams.stateC;
    vm.giriaAtual = $stateParams.giria;
    vm.createGiria = {state: vm.estadoAtual};
    vm.currentUser = store.get("jwt") || null;
    vm.saveGiria = saveGiria;
    vm.openModal = openModal;
    vm.upVote = upVote;
    vm.downVote = downVote;

    if(vm.giriaAtual !== undefined) {
      getGiria();
    }

    activate();

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
    };

    function upVote(descIndex){
      if( vm.currentUser !== null ) {
        var info = {giria: vm.giriaAtual, state: vm.estadoAtual};

        return giriaServer.upVote(info, {description: descIndex}, function(resp){
          if(resp.success === true) {

            vm.giriaDesc = resp.giria;

            toastr.success("Obrigado pelo seu voto!", "Giriapédia");

            $state.go("giriaDescription", {
              stateC: vm.estadoAtual, giria: vm.giriaAtual
            });

          }
        });
      } else {
        $state.go("login");
        toastr.info("Você já é cadastrado?", "Giriapédia");
      }
    };

    function downVote(descIndex) {
      if( vm.currentUser !== null ) {
        var info = {giria: vm.giriaAtual, state: vm.estadoAtual};
        return giriaServer.downVote(info, {description: descIndex}, function(resp){
          if(resp.success === true) {

            vm.giriaDesc = resp.giria;

            toastr.success("Obrigado pelo seu voto!", "Giriapédia");

            $state.go("giriaDescription", {
              stateC: vm.estadoAtual, giria: vm.giriaAtual
            });
          }
        });
      } else {
        $state.go("login");
        toastr.info("Você já é cadastrado?", "Giriapédia");
      }
    };

    function openModal(item){
      if ( vm.currentUser !== null ) {
        var modalInstance = $modal.open({
          templateUrl: "static/js/partials/descriptionsModal.html",
          controller: "ModalDescriptionCtrl",
          controllerAs: "vm",
          resolve: {
            giriaData: function () {
              return {
                giria: item.giria,
                state: vm.estadoAtual
              };
            }
          }
        });
      } else {
        $state.go("login");
        toastr.info("Você já é cadastrado?", "Giriapédia");
      }
    };

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
          var gambiRoute = "#/giria/"+ vm.estadoAtual +"/"+ vm.createGiria.giria +"/significados/",
            html = [
            "<p>Deseja adicionar um novo significado?</p>",
            "<br />",
            "<a href='"+ gambiRoute+"' class='btn btn-danger btn-sm'>Novo Significado</a>"
          ];

          toastr.error(html.join(" "), "Error ao salvar", {
              allowHtml: true,
              closeButton: true,
              tapToDismiss: false,
              timeOut: 5000
            }
          );

          toastr.error(giriaReturn.error, "Error ao salvar");
        }
      });
    };

  };
})();
