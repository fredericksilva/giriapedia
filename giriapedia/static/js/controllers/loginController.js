;(function(){
  'use strict';

  angular
    .module("GiriaPedia")
    .controller("LoginCtrl", LoginCtrl);

  function LoginCtrl($scope, loginServices, store, $state, toastr) {

    var vm = this;

    vm.user = {};

    vm.login = function() {

      loginServices.send(vm.user, function(data){
        if(data.success === true){
          store.set("jwt", data.token);
          $state.go("giriasEstado", {state: store.get("estado")});
          toastr.success("Seja Bem Vindo");
        } else {
          toastr.error(data.error);
          $state.go("login");
        }
      });
    };
  }
})();
