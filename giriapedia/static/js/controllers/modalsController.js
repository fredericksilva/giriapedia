;(function() {
  'use strict';

  angular
    .module("GiriaPedia")
    .controller("ModalDescriptionCtrl", DescriptionModal);

  function DescriptionModal($scope, $modalInstance, items) {

    var vm = this;
    vm.items = items;
    vm.close = closeModal;

    function closeModal() {
      $modalInstance.dismiss("cancel");
    };
  };

})();
