;(function() {
  'use strict';

  angular
    .module("GiriaPedia")
    .controller("SignInCtrl", SignInCtrl);

  function SignInCtrl($scope, signinServices, toastr, store, $state) {
    var vm = this;

    vm.newUser = {};
    vm.createUser = createUser;

    function createUser() {
      signinServices.send(vm.newUser, function(data){
        if (data.success === true) {
          toastr.success("Usuario cadastrado", null);
          store.set("jwt", data.token);
          // Retornar para pagina anterior ou estado...
          $state.go("giriasEstado", {state: store.get("estado")});
        } else {
          toastr.error("Error ao criar usuario", "Usuario");
        }
      });
    };

  }
})();
