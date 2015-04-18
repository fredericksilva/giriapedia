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

      find: function(giriaInfo, callback){
        $http({
          method: 'GET',
          url: '/girias/' + giriaInfo.giria + '/' + giriaInfo.state + '/',
        }).success(callback);
      },

      update: function(giriaInfo, giriaData, callback){
        $http({
          method: 'PUT',
          url: '/girias/' + giriaInfo.giria + '/' + giriaInfo.state + '/',
          data: giriaData
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
