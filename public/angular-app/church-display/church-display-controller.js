angular.module('meanchurch').controller('ChurchController', ChurchController);

function ChurchController($route, $routeParams, $window, churchDataFactory, AuthFactory, jwtHelper) {
  var vm = this;
  var id = $routeParams.id;
  vm.isSubmitted = false;
  churchDataFactory.churchDisplay(id).then(function(response) {
    vm.church = response.data;
    vm.stars = _getStarRating(response.data.stars);
  });

  function _getStarRating(stars) {
    return new Array(stars);
  }

  vm.isLoggedIn = function() {
    if (AuthFactory.isLoggedIn) {
      return true;
    } else {
      return false;
    }
  };

  vm.addReview = function() {

    var token = jwtHelper.decodeToken($window.sessionStorage.token);
    var username = token.username;

    var postData = {
      name: username,
      rating: vm.rating,
      review: vm.review
    };
    if (vm.reviewForm.$valid) {
      churchDataFactory.postReview(id, postData).then(function(response) {
        if (response.status === 200) {
          $route.reload();
        }
      }).catch(function(error) {
        console.log(error);
      });
    } else {
      vm.isSubmitted = true;
    }
  };

}
