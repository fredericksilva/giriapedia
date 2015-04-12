;(function(){
  'use strict';

  angular
    .module('GiriaPedia')
    .factory('giriaServer', GiriaServer);


  function GiriaServer($http) {
    return {
      list: function(callback) {
        $http({
          method: 'GET',
          url: '/girias/',
          cache: true
        }).success(callback);
      },

      find: function(giriaId, callback){
        $http({
          method: 'GET',
          url: '/girias/'+ giriaId +'/',
          cache: true
        }).success(callback)
      }
    };
  };

})();
