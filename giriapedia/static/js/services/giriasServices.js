;(function(){
  'use strict';

  angular
    .module('GiriaPedia')
    .factory('giriaServer', GiriaServer);


  function GiriaServer($http) {
    return {
      list: function(state, callback) {
        $http({
          method: 'GET',
          url: '/girias/',
          params: {state: state},
        }).success(callback);
      },

      find: function(giriaId, callback){
        $http({
          method: 'GET',
          url: '/girias/'+ giriaId +'/',
          cache: true
        }).success(callback);
      },

      create: function(formGiria, callback){
        $http({
          method: 'POST',
          url: '/girias/',
          data: formGiria
        }).success(callback);
      }
    };
  };

})();
