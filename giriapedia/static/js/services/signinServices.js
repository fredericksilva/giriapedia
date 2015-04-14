;(function() {
  'use strict';

  angular
    .module("GiriaPedia")
    .factory("signinServices", SignInServer);

  function SignInServer($http) {

    return {
      send: function(newUser, callback) {
        $http({
          method: "POST",
          url: "/signin/",
          data: newUser
        }).success(callback);
      }
    }

  }
})();
