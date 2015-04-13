;(function() {
  'use strict';

  angular
    .module("GiriaPedia")
    .controller("SignInCtrl", SignInCtrl);

  function SignInCtrl($scope, signInServer, toastr) {
    var vm = this;

    vm.newUser = {};
    vm.createUser = createUser;

    function createUser() {
      signInServer.send(vm.newUser, function(data){
        if (data.success === true) {
          toastr.success("Usuario cadastrado", null);
        } else {
          toastr.error("Error ao criar usuario", "Usuario");
        }
      });
    };

  }
})();
