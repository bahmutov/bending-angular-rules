var benv = require('benv');
benv.setup(function () {
  benv.expose({
    angular: benv.require('node_modules/angular/angular.js', 'angular')
  });
  console.log('window is', typeof window);
  console.log('document is', typeof document);
  console.log('angular is', typeof angular);
  console.log('window.angular === angular', window.angular === angular);
});
