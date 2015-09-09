angular.module('HelloApp', [])
  .controller('HelloController', function ($scope, $http) {
    $scope.names = ['John', 'Mary'];
    $scope.addName = function () {
      $http.get('/new/name').then(function (newName) {
        $scope.names.push(newName);
      });
    };
  });
