var benv = require('benv');
benv.setup(function () {
  benv.expose({
    angular: benv.require('node_modules/angular/angular.js', 'angular')
  });
  require('./app');
  // confirm that module HelloApp has controller HelloController
  var $controller = angular.injector(['ng', 'HelloApp']).get('$controller');
  var scope = {};
  $controller('HelloController', { $scope: scope });
  console.log(scope.names);
  // prints [ 'John', 'Mary' ]
});
