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
        var url = '/girias/' + giriaInfo.giria + '/' + giriaInfo.state + '/';

        $http({
          method: 'PUT',
          url: url,
          data: giriaData
        }).success(callback);
      },

      upVote: function(giriaInfo, giriaVote, callback){
        var url = '/girias/' + giriaInfo.giria + '/' + giriaInfo.state + '/';

        $http({
          method: 'PUT',
          url: url + "?upvotes=true",
          data: giriaVote
        }).success(callback);
      },

      downVote: function(giriaInfo, giriaVote, callback){
        var url = '/girias/' + giriaInfo.giria + '/' + giriaInfo.state + '/';

        $http({
          method: 'PUT',
          url: url + "?downvotes=true",
          data: giriaVote
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
