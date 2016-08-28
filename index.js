require('colorful').toxic();
var packageJson = require('./package.json');

module.exports = function() {
  var help = function() {
    console.log('get meitianhui');
  }

  if (!process.argv[2]) {
    help();
    return;
  }

  var param = process.argv.slice(2)[0];

  console.log();
  if (param === 'getProductList') {
    var meitianhui = require('./src/meitianhui');
    var params = process.argv.slice(2);
    var username = params[1];
    var password = params[2];
    meitianhui(username, password);
  } else {
    help();
  }
}
