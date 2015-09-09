var ngDice = require('ng-dice');
ngDice({
  name: 'app',
  file: __dirname + '/app.js',
  extract: 'nextName()',
  tests: function (codeExtract) {
    it('returns next name', function () {
      var nextName = codeExtract();
      console.assert(nextName() === 'World');
    });
  }
});
