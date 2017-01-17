angular.module('meanchurch').factory('churchDataFactory', churchDataFactory);

function churchDataFactory($http) {
  return {
    churchList: churchList,
    churchDisplay: churchDisplay,
    postReview: postReview
  };

  function churchList() {
    return $http.get('/api/churches?count=10').then(complete).catch(failed);
  }

  function churchDisplay(id) {
    return $http.get('/api/churches/' + id).then(complete).catch(failed);
  }

  function postReview(id, review) {
    return $http.post('/api/churches/' + id + '/reviews', review).then(complete).catch(failed);
  }

  function complete(response) {
    return response;
  }

  function failed(error) {
    console.log(error.statusText);
  }

}
