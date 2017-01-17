angular.module('meanchurch').controller('ChurchesController', ChurchesController);

function ChurchesController(churchDataFactory) {
  var vm = this;
  vm.title = 'Church List';
  churchDataFactory.churchList().then(function(response) {
    // console.log(response);
    vm.churches = response.data;
  });
}
