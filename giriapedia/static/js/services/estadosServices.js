;(function(){
  'use strict';

  angular
    .module('GiriaPedia')
    .factory('estados', Estados);


  function Estados($http) {
    return {
      list: function(callback) {
        $http({
          method: 'GET',
          url: '/estados/',
          cache: true
        }).success(callback);
      }
    };
  };

})();
