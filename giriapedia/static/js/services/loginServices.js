;(function() {
  'use strict';

  angular
    .module("GiriaPedia")
    .factory("loginServices", LoginService);

    function LoginService($http) {
      return {
        send: function(user, callback){
          $http({
            method: "POST",
            url: "/login/",
            data: user
          }).success(callback);
        }
      }
    }

})();
