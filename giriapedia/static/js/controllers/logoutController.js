;(function(){
  'use strict';

  angular
    .module("GiriaPedia")
    .controller("LogoutCtrl", LogoutCtrl);


    function LogoutCtrl($scope, $state, toastr, store){
      if(store.get("jwt") !== null){
        console.log(store.get("jwt"))
        store.remove("jwt");
        toastr.success("Volte Logo!", "Giriapédia");
        $state.go("home");
      } else {
        toastr.success("Entre no Giriapédia!", "Giriapédia");
        $state.go("login");
      }
    };

})();
