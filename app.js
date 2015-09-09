(function () {
  function nextName() {
    return 'World';
  }
  angular.module('HelloApp', [])
    .controller('HelloController', function ($scope) {
      $scope.names = ['John', 'Mary'];
      $scope.addName = function () {
        $scope.names.push(nextName());
      };
    });
}());
